var ipc = require("electron").ipcRenderer;
var uninstallImSwitch = document.getElementById("uninstallImSwitch");
var back = document.getElementById("back");
var statusContainer = document.getElementById("statusContainer");
var progressBar = document.getElementById("progressBar");
var statusText = document.getElementById("statusText");
var goToMenu = document.getElementById("goToMenu");
var confirmUninstall = document.getElementById("confirmUninstall");

// Step status elements
var step1Status = document.getElementById("step1-status");
var step2Status = document.getElementById("step2-status");
var step3Status = document.getElementById("step3-status");
var step4Status = document.getElementById("step4-status");

var currentStep = 0;
var isUninstalling = false;

// Update step status
function updateStepStatus(step, status) {
    const stepElements = {
        1: step1Status,
        2: step2Status,
        3: step3Status,
        4: step4Status
    };

    const stepElement = stepElements[step];
    if (stepElement) {
        stepElement.textContent = status;
        stepElement.className = `badge ${getStatusColor(status)}`;
    }
}

function getStatusColor(status) {
    switch (status) {
        case "In Progress":
            return "bg-warning";
        case "Complete":
            return "bg-success";
        case "Failed":
            return "bg-danger";
        default:
            return "bg-secondary";
    }
}

function updateProgress(percentage) {
    progressBar.style.width = percentage + "%";
    progressBar.setAttribute("aria-valuenow", percentage);
}

function updateStatus(message) {
    statusText.textContent = message;
}

function resetUI() {
    isUninstalling = false;
    uninstallImSwitch.classList.remove("disabled");
    uninstallImSwitch.innerHTML = "Uninstall ImSwitch";
    back.classList.remove("btn-danger");
    back.classList.add("btn-secondary");
    back.innerHTML = "Back";
    back.href = "./menu.html";
    statusContainer.style.display = "none";
    
    // Reset all step statuses
    updateStepStatus(1, "Pending");
    updateStepStatus(2, "Pending");
    updateStepStatus(3, "Pending");
    updateStepStatus(4, "Pending");
    updateProgress(0);
    updateStatus("Ready to uninstall...");
}

function startUninstallation() {
    isUninstalling = true;
    uninstallImSwitch.classList.add("disabled");
    uninstallImSwitch.innerHTML = "<i class='fas fa-spinner fa-spin'></i> Uninstalling...";
    back.classList.remove("btn-secondary");
    back.classList.add("btn-danger");
    back.innerHTML = "Cancel";
    back.href = "#";
    statusContainer.style.display = "block";
    
    updateStatus("Starting uninstallation...");
    updateProgress(5);
    
    ipc.send("uninstallImSwitchDetailed");
}

uninstallImSwitch.addEventListener("click", function () {
    if (!isUninstalling) {
        // Show confirmation modal
        const confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'));
        confirmModal.show();
    }
});

confirmUninstall.addEventListener("click", function () {
    // Hide confirmation modal
    const confirmModal = bootstrap.Modal.getInstance(document.getElementById('confirmModal'));
    confirmModal.hide();
    
    // Start uninstallation
    startUninstallation();
});

back.addEventListener("click", function (event) {
    if (back.classList.contains("btn-danger")) {
        event.preventDefault();
        // TODO: Implement cancellation if needed
        ipc.send("cancelUninstallation");
        resetUI();
    }
});

goToMenu.addEventListener("click", function () {
    window.location.href = "./menu.html";
});

// Listen for uninstall progress updates
ipc.on("uninstallProgress", function (event, data) {
    const { step, message, percentage, stepStatus } = data;
    
    updateStatus(message);
    updateProgress(percentage);
    
    if (step && stepStatus) {
        updateStepStatus(step, stepStatus);
    }
});

// Listen for uninstall completion
ipc.on("uninstallComplete", function (event) {
    updateStatus("Uninstall completed successfully!");
    updateProgress(100);
    updateStepStatus(4, "Complete");
    
    // Show success modal
    const successModal = new bootstrap.Modal(document.getElementById('successModal'));
    successModal.show();
    
    resetUI();
});

// Listen for uninstall failure
ipc.on("uninstallFailed", function (event, errorMessage) {
    updateStatus("Uninstall failed!");
    
    // Show error modal
    const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
    const errorMessageElement = document.getElementById('errorMessage');
    errorMessageElement.textContent = errorMessage || "An unknown error occurred during uninstallation.";
    errorModal.show();
    
    resetUI();
});

// Listen for step updates
ipc.on("uninstallStep", function (event, data) {
    const { step, message } = data;
    updateStatus(message);
    updateStepStatus(step, "In Progress");
});