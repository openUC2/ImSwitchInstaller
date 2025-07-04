// This script opens the ImSwitch web interface in a new window/tab
// using the local hostname from the OS.

const os = require('os');

document.addEventListener('DOMContentLoaded', () => {
    const openWebBtn = document.getElementById('openWebInterface');
    if (openWebBtn) {
        openWebBtn.addEventListener('click', () => {
            // Get the local hostname from the OS
            const hostname = os.hostname();
            window.open(`http://${hostname}:8001`, '_blank');
        });
    }
});
