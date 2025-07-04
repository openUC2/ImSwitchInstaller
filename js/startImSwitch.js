// This script handles the Start ImSwitch button click event
// and sends an IPC message to the main process to start ImSwitch.

// Use Electron's ipcRenderer directly for IPC communication
var ipc = require('electron').ipcRenderer;

document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('startImSwitch');
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            // Send IPC message to main process
            ipc.send('startImSwitch');
        });
    }
});
