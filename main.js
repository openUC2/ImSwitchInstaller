"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { app, BrowserWindow, ipcMain, dialog, shell } = require("electron");
const { promisify } = require("util");
const { PythonShell } = require("python-shell");
const path = require("path");
const fs = require("fs");
const tar = require("tar");
const mv = promisify(fs.rename);
const exec = promisify(require("child_process").exec);
const { spawn } = require("child_process");
const stream = require("stream");
const https = require("https");
const semver = require("semver");
const serverFetch = require("node-fetch");
const os = require("os");
var appDir = app.getAppPath();
var win = null;
var logWin = null;
var isQuitting = false;
var log = console.log;
console.log = function () {
    var args = Array.from(arguments);
    let timestamp = new Date()
        .toISOString()
        .replace(/T/, " ")
        .replace(/\..+/, "");
    let prefix = `[${timestamp}]`;
    let message = [prefix, ...args];
    log.apply(console, message);
    try {
        logWin.webContents.send("log", message.join(" "));
    }
    catch (error) {
        // do nothing window was closed
    }
};
// Path variables for easy management of execution
const homeDir = path.join(app.getPath("home"), ".imswitch");

function getOSSpecificHostname() {
  const hostname = os.hostname();
  
  switch (os.platform()) {
    case "win32":
      // Windows usually doesn't respond to *.local
      return hostname; // e.g., "DESKTOP-ABC123"
    case "darwin":
      // macOS often responds to "<hostname>.local"
      return hostname + ".local";
    case "linux":
    default:
      // Many Linux distros may handle just hostname
      return hostname;
  }
}




// Get files asynchonously
const TIMEOUT = 300000;
//https://stackoverflow.com/questions/11944932/how-to-download-a-file-with-node-js-without-using-third-party-libraries
function downloadFile(url, dest) {
  const uri = new URL(url);
  console.log("Download file: ", uri.pathname);
  if (!dest) {
    dest = basename(uri.pathname);
  }
  const pkg = url.toLowerCase().startsWith("https:") ? https : http;

  // check if file exists, if so, return a promise that resolves immediately
  if (fs.existsSync && fs.existsSync(dest)) {
    console.log(`${dest} already exists`);
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    console.log("Downloading: ", url);
    const request = pkg.get(uri.href).on("response", (res) => {
      if (res.statusCode === 200) {
        console.log("Status 200");
        const file = fs.createWriteStream(dest, { flags: "wx" });
        res
          .on("end", () => {
            file.end();
            console.log(`${uri.pathname} downloaded to: ${dest}`);
            resolve();
          })
          .on("error", (err) => {
            file.destroy();
            fs.unlink(dest, () => reject(err));
            log.error(err);
          })
          .pipe(file);
      } else if (res.statusCode === 302 || res.statusCode === 301) {
        // Recursively follow redirects, only a 200 will resolve.
        console.log("Redirecting to: ", res.headers.location);
        downloadFile(res.headers.location, dest).then(() => resolve());
      } else {
        reject(
          new Error(
            `Download request failed, response status: ${res.statusCode} ${res.statusMessage}`
          )
        );
      }
    });
    request.setTimeout(TIMEOUT, function () {
      request.abort();
      reject(new Error(`Request timeout after ${TIMEOUT / 1000.0}s`));
    });
  });
}
// Delete a file safely
function deleteFile(file) {
    return new Promise((resolve, reject) => {
        fs.unlinkSync(file);
        resolve(true);
    });
}
function getVersion() {
    // get version from package.json
    const packageJson = require(path.join(appDir, "package.json"));
    return packageJson.version;
}

// Run command with proper logging and error handling
function runCommand(command, args, win, options = {}) {
    return new Promise((resolve, reject) => {
        console.log(`Executing: ${command} ${args.join(' ')}`);
        
        const child = spawn(command, args, { 
            stdio: 'pipe',
            ...options 
        });

        let stdout = '';
        let stderr = '';

        child.stdout.on('data', (data) => {
            const output = data.toString();
            stdout += output;
            console.log('stdout:', output);
            if (win && win.webContents) {
                win.webContents.send("updateStatus", output);
            }
        });

        child.stderr.on('data', (data) => {
            const output = data.toString();
            stderr += output;
            console.log('stderr:', output);
            if (win && win.webContents) {
                win.webContents.send("updateStatus", output);
            }
        });

        child.on('close', (code) => {
            console.log(`Command exited with code ${code}`);
            if (code === 0) {
                resolve({ stdout, stderr, code });
            } else {
                reject(new Error(`Command failed with code ${code}: ${stderr}`));
            }
        });

        child.on('error', (error) => {
            console.error('Command error:', error);
            reject(error);
        });
    });
}

// Setup Miniforge (similar to the bash script)
function setupMiniforge(win) {
    return new Promise(async (resolve, reject) => {
        try {
            const miniforgePath = path.join(homeDir, "miniforge");
            
            // Check if miniforge already exists
            if (fs.existsSync(miniforgePath)) {
                console.log("Miniforge already installed");
                resolve(true);
                return;
            }

            console.log("Installing Miniforge");
            win.webContents.send("updateStatus", "Installing Miniforge...");

            // Determine architecture and download URL
            const arch = os.arch();
            const platform = os.platform();
            let downloadUrl, installerName;

            if (platform === 'linux') {
                if (arch === 'arm64' || arch === 'aarch64') {
                    downloadUrl = "https://github.com/conda-forge/miniforge/releases/latest/download/Miniforge3-Linux-aarch64.sh";
                    installerName = "Miniforge3-Linux-aarch64.sh";
                } else {
                    downloadUrl = "https://github.com/conda-forge/miniforge/releases/latest/download/Miniforge3-Linux-x86_64.sh";
                    installerName = "Miniforge3-Linux-x86_64.sh";
                }
            } else if (platform === 'darwin') {
                if (arch === 'arm64') {
                    downloadUrl = "https://github.com/conda-forge/miniforge/releases/latest/download/Miniforge3-MacOSX-arm64.sh";
                    installerName = "Miniforge3-MacOSX-arm64.sh";
                    console.log("Downloading Mambaforge for macOS ARM64");
                } else {
                    downloadUrl = "https://github.com/conda-forge/miniforge/releases/latest/download/Miniforge3-MacOSX-x86_64.sh";
                    installerName = "Miniforge3-MacOSX-x86_64.sh";
                }
            } else if (platform === 'win32') {
                downloadUrl = "https://github.com/conda-forge/miniforge/releases/latest/download/Miniforge3-Windows-x86_64.exe";
                installerName = "Miniforge3-Windows-x86_64.exe";
            }

            const installerPath = path.join(homeDir, installerName);
            
            // TODO: If file exists, remove or rename it first 


            // Download the installer # TODO: We want a loading bar to appear that informs us about the download progress
            await downloadFile(downloadUrl, installerPath);
            
            // Make installer executable on Unix systems
            if (platform !== 'win32') {
                fs.chmodSync(installerPath, '755');
            }
            
            // Install Miniforge
            console.log(`Installing Miniforge to ${miniforgePath}`);
            if (platform === 'win32') {
                await runCommand(installerPath, ['/S', `/D=${miniforgePath}`], win);
            } else {
                await runCommand('bash', [installerPath, '-b', '-p', miniforgePath], win);
            }

            // Wait longer for installation to complete
            console.log("Waiting for installation to complete...");
            await new Promise(resolve => setTimeout(resolve, 10000));

            // Check what was actually created
            console.log(`Checking if installation directory exists: ${miniforgePath}`);
            if (fs.existsSync(miniforgePath)) {
                console.log("Installation directory exists, listing contents:");
                try {
                    const contents = fs.readdirSync(miniforgePath);
                    console.log("Contents:", contents);
                    
                    // Check if bin directory exists
                    const binPath = path.join(miniforgePath, "bin");
                    if (fs.existsSync(binPath)) {
                        console.log("bin directory exists, contents:");
                        const binContents = fs.readdirSync(binPath);
                        console.log("bin contents:", binContents);
                    } else {
                        console.log("bin directory does not exist");
                    }
                } catch (err) {
                    console.log("Error reading directory contents:", err);
                }
            } else {
                console.log("Installation directory does not exist");
            }

            // Verify installation was successful
            const condaPath = platform === "win32" 
                ? path.join(miniforgePath, "Scripts", "conda.exe")
                : path.join(miniforgePath, "bin", "conda");
            
            console.log(`Looking for conda at: ${condaPath}`);
            if (!fs.existsSync(condaPath)) {
                // Try alternative paths that might exist
                const altCondaPath = path.join(miniforgePath, "condabin", "conda");
                console.log(`Trying alternative conda path: ${altCondaPath}`);
                if (fs.existsSync(altCondaPath)) {
                    console.log("Found conda at alternative path");
                } else {
                    throw new Error(`Miniforge installation failed - conda not found at ${condaPath} or ${altCondaPath}`);
                }
            }
            
            console.log(`Miniforge installed successfully at ${miniforgePath}`);

            // Clean up installer
            fs.unlinkSync(installerPath);
            
            resolve(true);
        } catch (error) {
            console.error("Error setting up Miniforge:", error);
            reject(error);
        }
    });
}

// Setup conda environment
function setupCondaEnvironment(win) {
    return new Promise(async (resolve, reject) => {
        try {
            const miniforgePath = path.join(homeDir, "miniforge");

            // Define condaPath here
            const condaPath = os.platform() === "win32"
                ? path.join(miniforgePath, "Scripts", "conda.exe")
                : path.join(miniforgePath, "bin", "conda");

            // Define mambaPath
            let mambaPath = os.platform() === "win32"
                ? path.join(miniforgePath, "Scripts", "mamba.exe")
                : path.join(miniforgePath, "bin", "mamba");

            // Fallback to conda if mamba is missing
            if (!fs.existsSync(mambaPath)) {
                console.log("Mamba not found, falling back to conda...");
                mambaPath = condaPath;
            }

            // Verify conda installation exists
            let actualCondaPath = condaPath;
            if (!fs.existsSync(condaPath)) {
                // Try alternative conda path
                const altCondaPath = path.join(miniforgePath, "condabin", "conda");
                if (fs.existsSync(altCondaPath)) {
                    actualCondaPath = altCondaPath;
                    console.log(`Using alternative conda path: ${altCondaPath}`);
                } else {
                    throw new Error(`Conda not found at ${condaPath} or ${altCondaPath}. Miniforge installation may have failed.`);
                }
            }

            // Check if environment already exists
            const envPath = path.join(miniforgePath, "envs", "imswitch311");
            if (fs.existsSync(envPath)) {
                console.log("Conda environment already exists");
                resolve(true);
                return;
            }

            console.log("Creating conda environment...");
            win.webContents.send("updateStatus", "Creating conda environment imswitch311...");

            // Create conda environment with Python 3.11
            await runCommand(actualCondaPath, ["create", "-y", "--name", "imswitch311", "python=3.11"], win);

            // Install git
            console.log("Installing git...");
            await runCommand(mambaPath, ["install", "-n", "imswitch311", "git", "-y"], win);

            // Install specific packages
            console.log("Installing conda packages...");
            win.webContents.send("updateStatus", "Installing conda packages...");
            await runCommand(actualCondaPath, ["install", "-n", "imswitch311", "-y", "-c", "conda-forge", 
                "h5py", "numcodecs=0.13.1", "scikit-image=0.25.2"], win);

            // Clean conda cache
            await runCommand(actualCondaPath, ["clean", "--all", "-f", "-y"], win);

            resolve(true);
        } catch (error) {
            console.error("Error setting up conda environment:", error);
            reject(error);
        }
    });
}

// Install ImSwitch packages
function installImSwitchPackages(win) {
    return new Promise(async (resolve, reject) => {
        try {
            const miniforgePath = path.join(homeDir, "miniforge");
            const pipPath = os.platform() === "win32" 
                ? path.join(miniforgePath, "envs", "imswitch311", "Scripts", "pip.exe")
                : path.join(miniforgePath, "envs", "imswitch311", "bin", "pip");

            // if windows => set PYTHONUTF8=1
            if (process.platform === "win32") {
                // Change code page to 65001 (UTF-8)
                await runCommand("chcp", ["65001"], win);
                // Set PYTHONUTF8=1 environment variable
                process.env["PYTHONUTF8"] = "1";
            }
            // Verify pip installation exists
            if (!fs.existsSync(pipPath)) {
                throw new Error(`Pip not found at ${pipPath}. Conda environment may not be properly created.`);
            }

            // Check if ImSwitch is already installed
            try {
                const result = await runCommand(pipPath, ["show", "imswitch"], win);
                if (result.stdout.includes("Name: imswitch")) {
                    console.log("ImSwitch already installed");
                    resolve(true);
                    return;
                }
            } catch (error) {
                // ImSwitch not installed, continue with installation
            }

            console.log("Installing UC2-REST...");
            win.webContents.send("updateStatus", "Installing UC2-REST...");
            await runCommand(pipPath, ["install", "https://github.com/openUC2/UC2-REST/archive/master.zip"], win);

            console.log("Installing ImSwitch...");
            win.webContents.send("updateStatus", "Installing ImSwitch...");
            await runCommand(pipPath, ["install", "https://github.com/openUC2/ImSwitch/archive/master.zip"], win);

            console.log("Uninstalling psygnal...");
            win.webContents.send("updateStatus", "Uninstalling psygnal...");
            await runCommand(pipPath, ["uninstall", "psygnal", "-y"], win);

            console.log("Installing psygnal...");
            win.webContents.send("updateStatus", "Installing psygnal...");
            await runCommand(pipPath, ["install", "psygnal", "--no-binary", ":all:"], win);

            resolve(true);
        } catch (error) {
            console.error("Error installing ImSwitch packages:", error);
            reject(error);
        }
    });
}

// Clone ImSwitchConfig repository
function cloneImSwitchConfig(win) {
    return new Promise(async (resolve, reject) => {
        try {
            const configPath = path.join(homeDir, "ImSwitchConfig");
            
            if (fs.existsSync(configPath)) {
                console.log("ImSwitchConfig already exists");
                resolve(true);
                return;
            }

            console.log("Cloning ImSwitchConfig...");
            win.webContents.send("updateStatus", "Cloning ImSwitchConfig repository...");
            
            await runCommand("git", ["clone", "https://github.com/openUC2/ImSwitchConfig.git", configPath], win);
            
            resolve(true);
        } catch (error) {
            console.error("Error cloning ImSwitchConfig:", error);
            reject(error);
        }
    });
}

// Check if ImSwitch is fully installed
function isImSwitchInstalled() {
    const miniforgePath = path.join(homeDir, "miniforge");
    const envPath = path.join(miniforgePath, "envs", "imswitch311");
    
    return fs.existsSync(miniforgePath) && 
           fs.existsSync(envPath) ;
}

// Makes the local user writable folder
// TODO: Version checking to see if we need to update the files
function checkLocalDir() {
    if (!fs.existsSync(homeDir)) {
        fs.mkdirSync(homeDir, {
            recursive: true,
        });
    }
}
function createWindow() {
    const win = new BrowserWindow({
        width: 1250,
        height: 750,
        resizable: true,
        autoHideMenuBar: true,
        webPreferences: { nodeIntegration: true, contextIsolation: false },
    });
    // Start with the load screen
    win.loadFile("pages/loading.html");
    return win;
}
function createLogWindow() {
    const logWin = new BrowserWindow({
        width: 500,
        height: 250,
        resizable: true,
        autoHideMenuBar: true,
        webPreferences: { nodeIntegration: true, contextIsolation: false },
        closeable: false,
    });
    logWin.loadFile("pages/log.html");
    return logWin;
}
app.on("ready", () => {
    win = createWindow();
    logWin = createLogWindow();
    // Uncomment if you want tools on launch
    // win.webContents.toggleDevTools()
    win.on("close", function (e) {
        const choice = dialog.showMessageBoxSync(win, {
            type: "question",
            buttons: ["Yes", "Cancel"],
            title: "Confrim Quit",
            message: "Are you sure you want to quit? Quitting will kill all running processes.",
        });
        if (choice === 1) {
            e.preventDefault();
        }
        else {
            try {
                logWin.webContents.send("savelogs", []);
                logWin.close();
            }
            catch (error) {
                // do nothing window was closed
            }
        }
    });
    win.webContents.once("did-finish-load", () => {
        // Make a directory to house enviornment, settings, etc.
        checkLocalDir();
        
        // Update loading status
        win.webContents.send("updateStatus", "Setting up directories...");
        
        // After initial setup, transition to the main menu
        setTimeout(() => {
            win.webContents.send("updateStatus", "Loading menu...");
            setTimeout(() => {
                win.loadFile("pages/menu.html");
            }, 1000);
        }, 2000);
    });
});
app.whenReady().then(() => {
    app.on("activate", function () {
        if (BrowserWindow.getAllWindows().length === 0)
            createWindow();
    });
});
app.on("window-all-closed", function () {
    app.quit();
});
ipcMain.on("getVersion", (event) => {
    event.sender.send("version", getVersion());
});
// Handlers
// Directories
ipcMain.on("openDialog", function (event, data) {
    let window = BrowserWindow.getFocusedWindow();
    dialog
        .showOpenDialog(window, {
        properties: ["openDirectory"],
    })
        .then((result) => {
        // Check for a valid result
        if (!result.canceled) {
            // console.log(result.filePaths)
            // Send back the dir and whether this is input or output
            event.sender.send("returnPath", [result.filePaths[0], data]);
        }
    })
        .catch((err) => {
        console.log(err);
    });
});
// Files
ipcMain.on("openFileDialog", function (event, data) {
    let window = BrowserWindow.getFocusedWindow();
    dialog
        .showOpenDialog(window, {
        properties: ["openFile"],
    })
        .then((result) => {
        // Check for a valid result
        if (!result.canceled) {
            // console.log(result.filePaths)
            // Send back the dir and whether this is input or output
            event.sender.send("returnPath", [result.filePaths[0], data]);
        }
    })
        .catch((err) => {
        console.log(err);
    });
});

// ImSwitch specific IPC handlers
ipcMain.on("startImSwitch", async function (event) {
  console.log("Starting ImSwitch process...");
  
  try {
    // Check if ImSwitch is installed, if not, prompt user to install first
    if (!isImSwitchInstalled()) {
      console.log("ImSwitch not found, prompting user to install...");
      win.webContents.send("updateStatus", "ImSwitch is not installed. Please install it first using the 'Install ImSwitch' button in the menu.");
      
      const choice = dialog.showMessageBoxSync(win, {
        type: "question",
        buttons: ["Install Now", "Go to Menu", "Cancel"],
        title: "ImSwitch Not Installed",
        message: "ImSwitch is not installed on this system. Would you like to install it now?",
        detail: "You can also go back to the menu and click 'Install ImSwitch' for a more detailed installation process."
      });
      
      if (choice === 0) {
        // Install now - redirect to install page
        win.loadFile("pages/installImSwitch.html");
        return;
      } else if (choice === 1) {
        // Go to menu
        win.loadFile("pages/menu.html");
        return;
      } else {
        // Cancel - do nothing
        win.webContents.send("updateStatus", "ImSwitch startup cancelled. Please install ImSwitch first.");
        return;
      }
    }

    // Now start ImSwitch
    const miniforgePath = path.join(homeDir, "miniforge");
    const pythonPath = os.platform() === "win32" 
      ? path.join(miniforgePath, "envs", "imswitch311", "python.exe")
      : path.join(miniforgePath, "envs", "imswitch311", "bin", "python");
    
    // TODO: Make this configurable in the future through the GUI as a dropdown
    const configPath = path.join(homeDir, "ImSwitchConfig", "imcontrol_setups", "example_virtual_microscope.json");
    // "python -m imswitch --headless --http-port 8001 --socket-port 8002 --no-ssl" 
    console.log("Starting ImSwitch in headless mode...");
    win.webContents.send("updateStatus", "Starting ImSwitch...");
    
    // TODO: We want to monitor the command output and display it in the log window and maybe have a loading bar in the gui
    const args = [
      "-m", "imswitch",
      "--headless",
      "--http-port", "8001",
      "--socket-port", "8002",
      "--no-ssl"
    ];
    

    // Spawn and store the child process
    if (imSwitchChild) {
        console.log("ImSwitch is already running. Restarting...");
        killImSwitchProcess();
    }
    
    
    // Start ImSwitch in the background
    runCommand(pythonPath, args, win)
      .then(() => {
        console.log("ImSwitch process completed");
      })
      .catch((error) => {
        console.error("ImSwitch process error:", error);
      });
    const localHostname = getOSSpecificHostname();

        setTimeout(() => {
      const childWin = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: { nodeIntegration: true, contextIsolation: false },
      });
      childWin.loadURL(`http://${localHostname}:8001`).catch((error) => {
        console.error("Failed to load ImSwitch web interface:", error);
      });
    }, 50000); //  until we don't see anything we should have a spinner showing the user that something is happening

  } catch (error) {
    console.error("Failed to start ImSwitch:", error);
    win.webContents.send("updateStatus", `Error: ${error.message}`);
    dialog.showErrorBox("ImSwitch Startup Error", `Failed to start ImSwitch: ${error.message}`);
  }
});

// Install ImSwitch manually (for menu option)
ipcMain.on("installImSwitch", async function (event) {
  console.log("Installing ImSwitch...");
  
  try {
    win.webContents.send("updateStatus", "Starting ImSwitch installation...");
    
    await setupMiniforge(win);
    await setupCondaEnvironment(win);
    await installImSwitchPackages(win);
    
    win.webContents.send("updateStatus", "ImSwitch installation complete!");
    event.sender.send("installComplete");
    
  } catch (error) {
    console.error("Installation failed:", error);
    win.webContents.send("updateStatus", `Installation failed: ${error.message}`);
    event.sender.send("installFailed", error.message);
  }
});

// Install ImSwitch with detailed progress reporting (for dedicated install page)
ipcMain.on("installImSwitchDetailed", async function (event) {
  console.log("Installing ImSwitch with detailed progress...");
  
  try {
    // Step 1: Install Miniforge
    event.sender.send("installationStep", { step: 1, message: "Installing Miniforge..." });
    event.sender.send("installationProgress", { 
      step: 1, 
      message: "Downloading and installing Miniforge...", 
      percentage: 10, 
      stepStatus: "In Progress" 
    });
    
    await setupMiniforge(win);
    
    event.sender.send("installationProgress", { 
      step: 1, 
      message: "Miniforge installation complete", 
      percentage: 25, 
      stepStatus: "Complete" 
    });

    // Step 2: Create Conda Environment
    event.sender.send("installationStep", { step: 2, message: "Creating conda environment..." });
    event.sender.send("installationProgress", { 
      step: 2, 
      message: "Creating Python 3.11 environment and installing packages...", 
      percentage: 30, 
      stepStatus: "In Progress" 
    });
    
    await setupCondaEnvironment(win);
    
    event.sender.send("installationProgress", { 
      step: 2, 
      message: "Conda environment setup complete", 
      percentage: 50, 
      stepStatus: "Complete" 
    });

    // Step 3: Install ImSwitch Packages
    event.sender.send("installationStep", { step: 3, message: "Installing ImSwitch packages..." });
    event.sender.send("installationProgress", { 
      step: 3, 
      message: "Installing UC2-REST, ImSwitch, and psygnal...", 
      percentage: 60, 
      stepStatus: "In Progress" 
    });
    
    await installImSwitchPackages(win);
    
    event.sender.send("installationProgress", { 
      step: 3, 
      message: "Package installation complete", 
      percentage: 75, 
      stepStatus: "Complete" 
    });


    
    
    event.sender.send("installationProgress", { 
      step: 4, 
      message: "Configuration download complete", 
      percentage: 100, 
      stepStatus: "Complete" 
    });

    console.log("ImSwitch installation completed successfully");
    event.sender.send("installationComplete");
    
  } catch (error) {
    console.error("Installation failed:", error);
    event.sender.send("installationFailed", error.message);
  }
});

// Cancel installation (placeholder for future implementation)
ipcMain.on("cancelInstallation", function (event) {
  console.log("Installation cancellation requested");
  // TODO: Implement proper cancellation logic if needed
});

// Update ImSwitch and UC2-REST packages
ipcMain.on("updateImSwitch", function (event, data) {
  console.log("Updating ImSwitch to the latest version");
  
  const miniforgePath = path.join(homeDir, "miniforge");
  const pipPath = os.platform() === "win32" 
    ? path.join(miniforgePath, "envs", "imswitch311", "Scripts", "pip.exe")
    : path.join(miniforgePath, "envs", "imswitch311", "bin", "pip");

  let updatePromise = Promise.resolve();
  
  // Check if user wants to update packages
  if (1) {  // (data && data.updatePackages) {
    updatePromise = updatePromise.then(() => {
      win.webContents.send("updateStatus", "Updating UC2-REST package...");
      console.log("Updating UC2-REST package...");
      return runCommand(pipPath, ["install", "--upgrade", "https://github.com/openUC2/UC2-REST/archive/master.zip", "--no-cache", "--force-reinstall"], win);
    }).then(() => {
      win.webContents.send("updateStatus", "Updating ImSwitch package...");
        console.log("Updating ImSwitch package...");
      return runCommand(pipPath, ["install", "--upgrade", "https://github.com/openUC2/ImSwitch/archive/master.zip", "--no-cache", "--force-reinstall"], win);
    });
  }
  
  // TODO: if we reach something like [2025-06-30 21:14:01] Command exited with code 0, we know that the update was successful
  updatePromise
    .then(() => {
      win.webContents.send("updateStatus", "Update complete!");
      event.sender.send("updateComplete");
    })
    .catch((error) => {
      console.error("Update failed:", error);
      win.webContents.send("updateStatus", "Update failed. Check console for details.");
      event.sender.send("updateFailed", error.message);
    });
});

// Open ImSwitch web interface in current window
ipcMain.on("openWebInterface", function () {
    // TODO: We want the webfrontend to be opened inside the same window, not a new one
  if (!win) {
    console.error("Main window is not available. Cannot open web interface.");
    return;
  }
  else{
    console.log("Main window is available. Proceeding to open web interface.");
    
  }
  console.log("Opening ImSwitch web interface...");
  win.loadURL("http://localhost:8001").catch((error) => {
    console.error("Failed to load web interface:", error);
    dialog.showErrorBox("Web Interface Error", "Could not load ImSwitch web interface. Make sure ImSwitch is running.");
  });
});

// Uninstall ImSwitch completely
ipcMain.on("uninstallImSwitchDetailed", async function (event) {
  console.log("Uninstalling ImSwitch with detailed progress...");
  
  try {
    // Check if ImSwitch is installed before attempting uninstall
    if (!fs.existsSync(homeDir)) {
      console.log("ImSwitch directory does not exist, nothing to uninstall");
      event.sender.send("uninstallProgress", { 
        step: 4, 
        message: "No ImSwitch installation found", 
        percentage: 100, 
        stepStatus: "Complete" 
      });
      event.sender.send("uninstallComplete");
      return;
    }
    
    // Step 1: Stop ImSwitch process
    event.sender.send("uninstallStep", { step: 1, message: "Stopping ImSwitch process..." });
    event.sender.send("uninstallProgress", { 
      step: 1, 
      message: "Checking for running ImSwitch process...", 
      percentage: 10, 
      stepStatus: "In Progress" 
    });
    
    await stopImSwitchProcess(win);
    
    event.sender.send("uninstallProgress", { 
      step: 1, 
      message: "ImSwitch process stopped", 
      percentage: 25, 
      stepStatus: "Complete" 
    });

    // Step 2: Remove Python environment (miniforge)
    event.sender.send("uninstallStep", { step: 2, message: "Removing Python environment..." });
    event.sender.send("uninstallProgress", { 
      step: 2, 
      message: "Removing Miniforge and Python packages...", 
      percentage: 30, 
      stepStatus: "In Progress" 
    });
    
    await removeMiniforgePath(win);
    
    event.sender.send("uninstallProgress", { 
      step: 2, 
      message: "Python environment removed", 
      percentage: 60, 
      stepStatus: "Complete" 
    });

    // Step 3: Remove configuration files
    event.sender.send("uninstallStep", { step: 3, message: "Removing configuration files..." });
    event.sender.send("uninstallProgress", { 
      step: 3, 
      message: "Removing ImSwitch configuration...", 
      percentage: 65, 
      stepStatus: "In Progress" 
    });
    
    await removeConfigPath(win);
    
    event.sender.send("uninstallProgress", { 
      step: 3, 
      message: "Configuration files removed", 
      percentage: 85, 
      stepStatus: "Complete" 
    });

    // Step 4: Clean up ImSwitch directory
    event.sender.send("uninstallStep", { step: 4, message: "Cleaning up directory..." });
    event.sender.send("uninstallProgress", { 
      step: 4, 
      message: "Removing remaining files...", 
      percentage: 90, 
      stepStatus: "In Progress" 
    });
    
    await cleanupImSwitchDirectory(win);
    
    event.sender.send("uninstallProgress", { 
      step: 4, 
      message: "Directory cleanup complete", 
      percentage: 100, 
      stepStatus: "Complete" 
    });

    console.log("ImSwitch uninstallation completed successfully");
    event.sender.send("uninstallComplete");
    
  } catch (error) {
    console.error("Uninstallation failed:", error);
    event.sender.send("uninstallFailed", error.message);
  }
});

// Cancel uninstallation (placeholder for future implementation)
ipcMain.on("cancelUninstallation", function (event) {
  console.log("Uninstallation cancellation requested");
  // TODO: Implement proper cancellation logic if needed
});

// Uninstall helper functions
function stopImSwitchProcess(win) {
    return new Promise((resolve, reject) => {
        try {
            console.log("Stopping ImSwitch process...");
            win.webContents.send("updateStatus", "Stopping ImSwitch process...");
            
            // Kill any running ImSwitch process
            killImSwitchProcess(win);
            
            resolve(true);
        } catch (error) {
            console.error("Error stopping ImSwitch process:", error);
            // Don't fail the uninstall if we can't stop the process
            resolve(true);
        }
    });
}

function removeMiniforgePath(win) {
    return new Promise((resolve, reject) => {
        try {
            const miniforgePath = path.join(homeDir, "miniforge");
            console.log(`Removing miniforge directory: ${miniforgePath}`);
            win.webContents.send("updateStatus", "Removing Python environment...");
            
            if (fs.existsSync(miniforgePath)) {
                fs.rmSync(miniforgePath, { recursive: true, force: true });
                console.log("Miniforge directory removed successfully");
            } else {
                console.log("Miniforge directory does not exist, skipping...");
            }
            
            resolve(true);
        } catch (error) {
            console.error("Error removing miniforge directory:", error);
            reject(error);
        }
    });
}

function removeConfigPath(win) {
    return new Promise((resolve, reject) => {
        try {
            const configPath = path.join(homeDir, "ImSwitchConfig");
            console.log(`Removing config directory: ${configPath}`);
            win.webContents.send("updateStatus", "Removing configuration files...");
            
            if (fs.existsSync(configPath)) {
                fs.rmSync(configPath, { recursive: true, force: true });
                console.log("ImSwitchConfig directory removed successfully");
            } else {
                console.log("ImSwitchConfig directory does not exist, skipping...");
            }
            
            resolve(true);
        } catch (error) {
            console.error("Error removing config directory:", error);
            reject(error);
        }
    });
}

function cleanupImSwitchDirectory(win) {
    return new Promise((resolve, reject) => {
        try {
            console.log(`Cleaning up ImSwitch directory: ${homeDir}`);
            win.webContents.send("updateStatus", "Cleaning up remaining files...");
            
            if (fs.existsSync(homeDir)) {
                // Remove any remaining files in the directory
                const files = fs.readdirSync(homeDir);
                for (const file of files) {
                    const filePath = path.join(homeDir, file);
                    try {
                        if (fs.statSync(filePath).isDirectory()) {
                            fs.rmSync(filePath, { recursive: true, force: true });
                        } else {
                            fs.unlinkSync(filePath);
                        }
                    } catch (fileError) {
                        console.warn(`Could not remove ${filePath}:`, fileError.message);
                    }
                }
                
                // Try to remove the main directory if it's empty
                try {
                    fs.rmdirSync(homeDir);
                    console.log("ImSwitch directory removed successfully");
                } catch (dirError) {
                    // Directory might not be empty, that's okay
                    console.log("ImSwitch directory cleanup completed (some files may remain)");
                }
            } else {
                console.log("ImSwitch directory does not exist, skipping...");
            }
            
            resolve(true);
        } catch (error) {
            console.error("Error cleaning up ImSwitch directory:", error);
            reject(error);
        }
    });
}

function setUTF8Encoding(win) {
    return new Promise(async (resolve, reject) => {
        try {
            if (process.platform === "win32") {
                // Change code page to 65001 (UTF-8)
                await runCommand("chcp", ["65001"], win);
                // Set PYTHONUTF8=1 environment variable
                process.env["PYTHONUTF8"] = "1";
            }
            resolve(true);
        } catch (error) {
            reject(error);
        }
    });
}

// Track the ImSwitch process globally
let imSwitchChild = null;



// Function to force-stop ImSwitch
function killImSwitchProcess(win) {
  if (!imSwitchChild) {
    console.log("No ImSwitch process to kill");
    return;
  }

  const pid = imSwitchChild.pid;
  console.log(`Forcing stop of ImSwitch process with PID: ${pid}`);

  if (process.platform === "win32") {
    // On Windows, use taskkill
    spawn("taskkill", ["/F", "/PID", pid]);
  } else {
    // On macOS and Linux, send a SIGTERM (or SIGKILL if needed)
    imSwitchChild.kill("SIGTERM");
  }

  imSwitchChild = null;
}
