var ipc = require("electron").ipcRenderer;
var updateImSwitch = document.getElementById("updateImSwitch");
var back = document.getElementById("back");
var statusContainer = document.getElementById("statusContainer");
var progressBar = document.getElementById("progressBar");
var statusText = document.getElementById("statusText");
var goToStart = document.getElementById("goToStart");

// Step status elements
var step1Status = document.getElementById("step1-status");
var step2Status = document.getElementById("step2-status");
var step3Status = document.getElementById("step3-status");

var currentStep = 0;
var isUpdating = false;

// Update step status
function updateStepStatus(step, status) {
    const statusElements = [step1Status, step2Status, step3Status];
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
    updateImSwitch.classList.remove("disabled");
    updateImSwitch.innerHTML = "Update ImSwitch";
    back.classList.add("btn-warning");
    back.classList.remove("btn-danger");
    back.innerHTML = "Back";
    back.href = "./menu.html";
    statusContainer.style.display = "none";
    updateProgress(0);
    updateStatus("Ready to update...");
    
    // Reset all step statuses
    updateStepStatus(1, "Pending");
    updateStepStatus(2, "Pending");
    updateStepStatus(3, "Pending");
    
    currentStep = 0;
    isUpdating = false;
}

function startUpdate() {
    isUpdating = true;
    updateImSwitch.classList.add("disabled");
    updateImSwitch.innerHTML = "<i class='fas fa-spinner fa-spin'></i> Updating...";
    back.classList.remove("btn-warning");
    back.classList.add("btn-danger");
    back.innerHTML = "Cancel";
    back.href = "#";
    statusContainer.style.display = "block";
    
    updateStatus("Starting update...");
    updateProgress(5);
    
    ipc.send("updateImSwitchDetailed");
}

updateImSwitch.addEventListener("click", function () {
    if (!isUpdating) {
        startUpdate();
    }
});

back.addEventListener("click", function (event) {
    if (back.classList.contains("btn-danger")) {
        event.preventDefault();
        // TODO: Implement cancellation if needed
        ipc.send("cancelUpdate");
        resetUI();
    }
});

goToStart.addEventListener("click", function () {
    window.location.href = "./startImSwitch.html";
});

// Listen for update progress updates
ipc.on("updateProgress", function (event, data) {
    const { step, message, percentage, stepStatus } = data;
    
    updateStatus(message);
    updateProgress(percentage);
    
    if (step && stepStatus) {
        updateStepStatus(step, stepStatus);
    }
});

// Listen for update completion
ipc.on("updateComplete", function (event) {
    updateStatus("Update completed successfully!");
    updateProgress(100);
    updateStepStatus(3, "Complete");
    
    // Show success modal
    const successModal = new bootstrap.Modal(document.getElementById('successModal'));
    successModal.show();
    
    resetUI();
});

// Listen for update failure
ipc.on("updateFailed", function (event, errorMessage) {
    updateStatus("Update failed: " + errorMessage);
    updateStepStatus(currentStep, "Failed");
    
    // Show error modal
    document.getElementById("errorMessage").textContent = errorMessage;
    const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
    errorModal.show();
    
    resetUI();
});

// Listen for step updates
ipc.on("updateStep", function (event, data) {
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
    const stepProgress = [0, 33, 66, 100];
    updateProgress(stepProgress[step] || 0);
});

// Legacy support for existing update events (in case they're still used)
ipc.on("updateLoad", function (event, response) {
    if (Array.isArray(response) && response.length >= 2) {
        updateProgress(response[0]);
        updateStatus(response[1]);
    }
});

ipc.on("alignResult", function (event, response) {
    // Legacy event handler - treat as success
    updateComplete();
});

ipc.on("alignError", function (event, response) {
    // Legacy event handler - treat as error
    updateStatus("Update failed");
    const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
    errorModal.show();
    resetUI();
});
