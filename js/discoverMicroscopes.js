const { ipcRenderer } = require('electron');

class MicroscopeDiscovery {
    constructor() {
        this.discoveredMicroscopes = new Map();
        this.isScanning = false;
        
        this.initializeEventListeners();
        this.loadStoredMicroscopes();
    }

    initializeEventListeners() {
        // UI event listeners
        document.getElementById('refreshButton').addEventListener('click', () => {
            this.startDiscovery();
        });

        document.getElementById('addManualButton').addEventListener('click', () => {
            const modal = new bootstrap.Modal(document.getElementById('manualAddModal'));
            modal.show();
        });

        document.getElementById('addMicroscopeButton').addEventListener('click', () => {
            this.addManualMicroscope();
        });

        // IPC event listeners for main process communication
        ipcRenderer.on('microscope-discovered', (event, microscope) => {
            this.onMicroscopeDiscovered(microscope);
        });

        ipcRenderer.on('discovery-progress', (event, progress) => {
            this.updateDiscoveryProgress(progress);
        });

        ipcRenderer.on('discovery-complete', () => {
            this.onDiscoveryComplete();
        });

        ipcRenderer.on('discovery-progress-detail', (event, detail) => {
            this.updateDetailedProgress(detail);
        });

        ipcRenderer.on('microscope-status-update', (event, {id, status}) => {
            this.updateMicroscopeStatus(id, status);
        });
    }

    async startDiscovery() {
        if (this.isScanning) return;
        
        this.isScanning = true;
        this.updateUI();
        
        // Show progress bar
        document.getElementById('discoveryProgress').style.display = 'block';
        document.getElementById('progressBar').style.width = '0%';
        document.getElementById('progressText').textContent = 'Starting discovery...';
        
        // Clear detailed progress
        const detailsList = document.getElementById('scanningDetailsList');
        if (detailsList) {
            detailsList.innerHTML = '<small class="text-muted">Starting scan...</small>';
        }
        
        // Clear previous results
        this.discoveredMicroscopes.clear();
        this.renderMicroscopes();
        
        // Start discovery process in main process
        ipcRenderer.send('start-microscope-discovery');
    }

    onMicroscopeDiscovered(microscope) {
        this.discoveredMicroscopes.set(microscope.id, microscope);
        this.renderMicroscopes();
        this.storeMicroscopes();
    }

    updateDiscoveryProgress(progress) {
        const progressBar = document.getElementById('progressBar');
        const progressText = document.getElementById('progressText');
        
        progressBar.style.width = `${progress.percentage}%`;
        progressBar.setAttribute('aria-valuenow', progress.percentage);
        progressText.textContent = progress.message;
    }

    onDiscoveryComplete() {
        this.isScanning = false;
        this.updateUI();
        
        // Hide progress bar after a delay
        setTimeout(() => {
            document.getElementById('discoveryProgress').style.display = 'none';
        }, 2000);
    }

    updateUI() {
        const refreshButton = document.getElementById('refreshButton');
        const refreshSpinner = document.getElementById('refreshSpinner');
        const refreshText = document.getElementById('refreshText');
        
        if (this.isScanning) {
            refreshButton.disabled = true;
            refreshSpinner.style.display = 'inline-block';
            refreshText.textContent = 'Scanning...';
        } else {
            refreshButton.disabled = false;
            refreshSpinner.style.display = 'none';
            refreshText.textContent = 'Refresh';
        }
    }

    renderMicroscopes() {
        const container = document.getElementById('microscopesList');
        
        if (this.discoveredMicroscopes.size === 0) {
            container.innerHTML = `
                <div class="text-center p-4">
                    <p class="text-muted">No microscopes discovered yet. Click "Refresh" to start scanning.</p>
                </div>
            `;
            return;
        }

        const microscopesHTML = Array.from(this.discoveredMicroscopes.values())
            .map(microscope => this.createMicroscopeCard(microscope))
            .join('');
        
        container.innerHTML = microscopesHTML;
        
        // Add event listeners for action buttons
        this.attachMicroscopeEventListeners();
    }

    createMicroscopeCard(microscope) {
        const statusClass = microscope.status === 'online' ? 'status-online' : 
                           microscope.status === 'offline' ? 'status-offline' : 'status-discovering';
        const cardClass = microscope.status === 'online' ? 'connected' : 
                         microscope.status === 'offline' ? 'offline' : '';

        // Determine if connect button should be enabled
        const canConnect = microscope.status === 'online' || 
                          (microscope.lastSeen && Date.now() - microscope.lastSeen < 300000); // 5 minutes

        const protocol = microscope.protocol || 'https';

        return `
            <div class="microscope-card ${cardClass}" data-microscope-id="${microscope.id}">
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <h5>${microscope.name}</h5>
                        <div class="microscope-info">
                            <small class="text-muted">
                                <strong>Address:</strong> ${protocol}://${microscope.host}:${microscope.port}<br>
                                <strong>Type:</strong> ${microscope.discoveryType || 'Manual'}<br>
                                ${microscope.version ? `<strong>Version:</strong> ${microscope.version}<br>` : ''}
                                <strong>Last seen:</strong> ${new Date(microscope.lastSeen).toLocaleString()}
                            </small>
                        </div>
                    </div>
                    <span class="microscope-status ${statusClass}">${microscope.status}</span>
                </div>
                
                <div class="microscope-actions">
                    <button class="btn btn-sm btn-primary connect-btn" 
                            data-microscope-id="${microscope.id}"
                            ${!canConnect ? 'disabled' : ''}>
                        Connect
                    </button>
                    <button class="btn btn-sm btn-info control-btn" 
                            data-microscope-id="${microscope.id}"
                            ${!canConnect ? 'disabled' : ''}>
                        Remote Control
                    </button>
                    <button class="btn btn-sm btn-secondary test-btn" 
                            data-microscope-id="${microscope.id}">
                        Test Connection
                    </button>
                    <button class="btn btn-sm btn-danger remove-btn" 
                            data-microscope-id="${microscope.id}">
                        Remove
                    </button>
                </div>
            </div>
        `;
    }

    attachMicroscopeEventListeners() {
        // Connect buttons
        document.querySelectorAll('.connect-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const microscopeId = e.target.getAttribute('data-microscope-id');
                this.connectToMicroscope(microscopeId);
            });
        });

        // Remote control buttons
        document.querySelectorAll('.control-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const microscopeId = e.target.getAttribute('data-microscope-id');
                this.openRemoteControl(microscopeId);
            });
        });

        // Test connection buttons
        document.querySelectorAll('.test-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const microscopeId = e.target.getAttribute('data-microscope-id');
                this.testConnection(microscopeId);
            });
        });

        // Remove buttons
        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const microscopeId = e.target.getAttribute('data-microscope-id');
                this.removeMicroscope(microscopeId);
            });
        });
    }

    connectToMicroscope(microscopeId) {
        const microscope = this.discoveredMicroscopes.get(microscopeId);
        if (!microscope) return;

        const protocol = microscope.protocol || 'https';
        // Load the microscope's web interface in a new window
        const url = `${protocol}://${microscope.host}:${microscope.port}/imswitch/index.html`;
        console.log(`Connecting to microscope at ${url}`);
        // Send IPC message to main process to open the microscope interface
        ipcRenderer.send('load-microscope-interface', url);
    }

    openRemoteControl(microscopeId) {
        const microscope = this.discoveredMicroscopes.get(microscopeId);
        if (!microscope) return;

        // Open remote control window/interface
        ipcRenderer.send('open-remote-control', microscope);
    }

    testConnection(microscopeId) {
        const microscope = this.discoveredMicroscopes.get(microscopeId);
        if (!microscope) return;

        // Update status to testing
        microscope.status = 'testing';
        this.renderMicroscopes();

        // Test connection via main process
        ipcRenderer.send('test-microscope-connection', microscope);
    }

    removeMicroscope(microscopeId) {
        if (confirm('Are you sure you want to remove this microscope?')) {
            this.discoveredMicroscopes.delete(microscopeId);
            this.renderMicroscopes();
            this.storeMicroscopes();
        }
    }

    updateMicroscopeStatus(microscopeId, status) {
        const microscope = this.discoveredMicroscopes.get(microscopeId);
        if (microscope) {
            microscope.status = status;
            microscope.lastSeen = Date.now();
            this.renderMicroscopes();
            this.storeMicroscopes();
        }
    }

    updateDetailedProgress(detail) {
        const detailsList = document.getElementById('scanningDetailsList');
        if (!detailsList) return;
        
        const timestamp = new Date().toLocaleTimeString();
        const newDetail = document.createElement('div');
        newDetail.innerHTML = `<small class="text-muted">[${timestamp}] Scanning: ${detail.currentIPs.join(', ')}</small>`;
        
        detailsList.appendChild(newDetail);
        
        // Keep only last 20 entries to avoid overflow
        while (detailsList.children.length > 20) {
            detailsList.removeChild(detailsList.firstChild);
        }
        
        // Auto-scroll to bottom
        detailsList.scrollTop = detailsList.scrollHeight;
    }

    addManualMicroscope() {
        const name = document.getElementById('microscopeName').value.trim();
        const ip = document.getElementById('microscopeIP').value.trim();
        const port = document.getElementById('microscopePort').value.trim();
        const protocol = document.getElementById('microscopeProtocol').value;

        if (!name || !ip || !port || !protocol) {
            alert('Please fill in all fields');
            return;
        }

        const microscope = {
            id: `manual_${ip}_${port}_${protocol}`,
            name: name,
            host: ip,
            port: parseInt(port),
            protocol: protocol,
            status: 'unknown',
            discoveryType: 'Manual',
            lastSeen: Date.now()
        };

        this.discoveredMicroscopes.set(microscope.id, microscope);
        this.renderMicroscopes();
        this.storeMicroscopes();

        // Close modal and reset form
        const modal = bootstrap.Modal.getInstance(document.getElementById('manualAddModal'));
        modal.hide();
        document.getElementById('manualAddForm').reset();

        // Test the connection immediately
        this.testConnection(microscope.id);
    }

    storeMicroscopes() {
        const data = Array.from(this.discoveredMicroscopes.values());
        localStorage.setItem('discoveredMicroscopes', JSON.stringify(data));
    }

    loadStoredMicroscopes() {
        try {
            const stored = localStorage.getItem('discoveredMicroscopes');
            if (stored) {
                const data = JSON.parse(stored);
                data.forEach(microscope => {
                    // Mark stored microscopes as unknown status initially
                    microscope.status = 'unknown';
                    this.discoveredMicroscopes.set(microscope.id, microscope);
                });
                this.renderMicroscopes();
                
                // Test connections for stored microscopes
                this.discoveredMicroscopes.forEach((microscope, id) => {
                    this.testConnection(id);
                });
            }
        } catch (error) {
            console.error('Error loading stored microscopes:', error);
        }
    }
}

// Initialize discovery system when page loads
document.addEventListener('DOMContentLoaded', () => {
    new MicroscopeDiscovery();
});