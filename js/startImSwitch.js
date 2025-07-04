// This script handles the Start ImSwitch button click event
// and sends an IPC message to the main process to start ImSwitch.

// Use Electron's ipcRenderer directly for IPC communication
var ipc = require('electron').ipcRenderer;

document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('startImSwitch');
    const stopBtn = document.getElementById('stopImSwitch');
    const startSpinner = document.getElementById('startSpinner');
    const startButtonText = document.getElementById('startButtonText');
    const statusArea = document.getElementById('statusArea');
    const statusMessage = document.getElementById('statusMessage');
    const progressBar = document.getElementById('progressBar');

    // Initialize UI state
    updateButtonStates(false); // ImSwitch not running initially

    if (startBtn) {
        startBtn.addEventListener('click', () => {
            // Update UI to show loading state
            showLoading(true);
            updateButtonStates(true); // Starting
            showStatus('Starting ImSwitch...', 'info');
            
            // Send IPC message to main process
            ipc.send('startImSwitch');
        });
    }

    if (stopBtn) {
        stopBtn.addEventListener('click', () => {
            showStatus('Stopping ImSwitch...', 'warning');
            updateButtonStates(false); // Stopping
            
            // Send IPC message to main process
            ipc.send('stopImSwitch');
        });
    }

    // Listen for status updates from main process
    ipc.on('imSwitchStatus', (event, data) => {
        const { status, message, type = 'info' } = data;
        
        switch (status) {
            case 'starting':
                showLoading(true);
                updateButtonStates(true);
                showStatus(message || 'Starting ImSwitch...', 'info');
                break;
            case 'checking-api':
                showStatus(message || 'Checking if ImSwitch API is ready...', 'info');
                break;
            case 'ready':
                showLoading(false);
                updateButtonStates(true, true); // Running
                showStatus(message || 'ImSwitch is running and ready!', 'success');
                break;
            case 'stopped':
                showLoading(false);
                updateButtonStates(false); // Stopped
                showStatus(message || 'ImSwitch has been stopped.', 'secondary');
                break;
            case 'error':
                showLoading(false);
                updateButtonStates(false); // Error state
                showStatus(message || 'An error occurred.', 'danger');
                break;
        }
    });

    // Listen for the legacy updateStatus messages for backward compatibility
    ipc.on('updateStatus', (event, message) => {
        if (message && message.trim()) {
            showStatus(message, 'info');
        }
    });

    function showLoading(show) {
        if (startSpinner && startButtonText) {
            startSpinner.style.display = show ? 'inline-block' : 'none';
            startButtonText.textContent = show ? 'Starting...' : 'Start ImSwitch';
        }
    }

    function updateButtonStates(isStarting, isRunning = false) {
        if (startBtn) {
            startBtn.disabled = isStarting || isRunning;
        }
        if (stopBtn) {
            stopBtn.style.display = (isStarting || isRunning) ? 'block' : 'none';
            stopBtn.disabled = isStarting && !isRunning;
        }
    }

    function showStatus(message, type = 'info') {
        if (statusArea && statusMessage) {
            statusArea.style.display = 'block';
            statusMessage.textContent = message;
            
            // Update alert class based on type
            const alertDiv = statusArea.querySelector('.alert');
            if (alertDiv) {
                alertDiv.className = `alert alert-${type}`;
            }
        }
    }
});
