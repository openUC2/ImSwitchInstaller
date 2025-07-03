var ipc = require("electron").ipcRenderer;
var installImSwitch = document.getElementById("installImSwitch");
var back = document.getElementById("back");
var statusContainer = document.getElementById("statusContainer");
var progressBar = document.getElementById("progressBar");
var statusText = document.getElementById("statusText");
var goToStart = document.getElementById("goToStart");

// Step status elements
var step1Status = document.getElementById("step1-status");
var step2Status = document.getElementById("step2-status");
var step3Status = document.getElementById("step3-status");
var step4Status = document.getElementById("step4-status");

var currentStep = 0;
var isInstalling = false;

// Update step status
function updateStepStatus(step, status) {
    const statusElements = [step1Status, step2Status, step3Status, step4Status];
    const statusElement = statusElements[step - 1];
    
    if (statusElement) {
        statusElement.className = `badge bg-${getStatusColor(status)}`;
        statusElement.textContent = status;
    }
}

function getStatusColor(status) {
    switch(status.toLowerCase()) {
        case 'in progress': return 'warning';
        case 'complete': return 'success';
        case 'failed': return 'danger';
        default: return 'secondary';
    }
}

function updateProgress(percentage) {
    progressBar.style.width = percentage + '%';
    progressBar.setAttribute('aria-valuenow', percentage);
}

function updateStatus(message) {
    statusText.textContent = message;
}

function resetUI() {
    installImSwitch.classList.remove("disabled");
    installImSwitch.innerHTML = "Install ImSwitch";
    back.classList.add("btn-warning");
    back.classList.remove("btn-danger");
    back.innerHTML = "Back";
    back.href = "./menu.html";
    statusContainer.style.display = "none";
    updateProgress(0);
    updateStatus("Ready to install...");
    
    // Reset all step statuses
    updateStepStatus(1, "Pending");
    updateStepStatus(2, "Pending");
    updateStepStatus(3, "Pending");
    updateStepStatus(4, "Pending");
    
    currentStep = 0;
    isInstalling = false;
}

function startInstallation() {
    isInstalling = true;
    installImSwitch.classList.add("disabled");
    installImSwitch.innerHTML = "<i class='fas fa-spinner fa-spin'></i> Installing...";
    back.classList.remove("btn-warning");
    back.classList.add("btn-danger");
    back.innerHTML = "Cancel";
    back.href = "#";
    statusContainer.style.display = "block";
    
    updateStatus("Starting installation...");
    updateProgress(5);
    
    ipc.send("installImSwitchDetailed");
}

installImSwitch.addEventListener("click", function () {
    if (!isInstalling) {
        startInstallation();
    }
});

back.addEventListener("click", function (event) {
    if (back.classList.contains("btn-danger")) {
        event.preventDefault();
        // TODO: Implement cancellation if needed
        ipc.send("cancelInstallation");
        resetUI();
    }
});

goToStart.addEventListener("click", function () {
    window.location.href = "./startImSwitch.html";
});

// Listen for installation progress updates
ipc.on("installationProgress", function (event, data) {
    const { step, message, percentage, stepStatus } = data;
    
    updateStatus(message);
    updateProgress(percentage);
    
    if (step && stepStatus) {
        updateStepStatus(step, stepStatus);
    }
});

// Listen for installation completion
ipc.on("installationComplete", function (event) {
    updateStatus("Installation completed successfully!");
    updateProgress(100);
    updateStepStatus(4, "Complete");
    
    // Show success modal
    const successModal = new bootstrap.Modal(document.getElementById('successModal'));
    successModal.show();
    
    resetUI();
});

// Listen for installation failure
ipc.on("installationFailed", function (event, errorMessage) {
    updateStatus("Installation failed: " + errorMessage);
    updateStepStatus(currentStep, "Failed");
    
    // Show error modal
    document.getElementById("errorMessage").textContent = errorMessage;
    const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
    errorModal.show();
    
    resetUI();
});

// Listen for step updates
ipc.on("installationStep", function (event, data) {
    const { step, message } = data;
    currentStep = step;
    
    // Mark previous steps as complete
    for (let i = 1; i < step; i++) {
        updateStepStatus(i, "Complete");
    }
    
    // Mark current step as in progress
    updateStepStatus(step, "In Progress");
    updateStatus(message);
    
    // Update progress based on step
    const stepProgress = [0, 25, 50, 75, 100];
    updateProgress(stepProgress[step] || 0);
});