// Shared sidebar functionality for ImSwitch Material Design UI

// Function to create sidebar HTML structure
function createSidebar() {
  return `
    <nav class="sidebar elevation-2" id="sidebar">
      <ul class="sidebar-nav">
        <li>
          <a href="./menu.html" class="sidebar-nav-item">
            <span class="material-icons sidebar-nav-icon">home</span>
            <span class="sidebar-nav-text">Home</span>
          </a>
        </li>
        <li>
          <a href="./installImSwitch.html" class="sidebar-nav-item">
            <span class="material-icons sidebar-nav-icon">download</span>
            <span class="sidebar-nav-text">Install ImSwitch</span>
          </a>
        </li>
        <li>
          <a href="./startImSwitch.html" class="sidebar-nav-item">
            <span class="material-icons sidebar-nav-icon">play_arrow</span>
            <span class="sidebar-nav-text">Start ImSwitch</span>
          </a>
        </li>
        <li>
          <a href="#" class="sidebar-nav-item" id="openWebInterface">
            <span class="material-icons sidebar-nav-icon">web</span>
            <span class="sidebar-nav-text">Open Web Interface</span>
          </a>
        </li>
        <li>
          <a href="./discoverMicroscopes.html" class="sidebar-nav-item">
            <span class="material-icons sidebar-nav-icon">search</span>
            <span class="sidebar-nav-text">Discover Microscopes</span>
          </a>
        </li>
        <li>
          <a href="./updateImSwitch.html" class="sidebar-nav-item">
            <span class="material-icons sidebar-nav-icon">update</span>
            <span class="sidebar-nav-text">Update ImSwitch</span>
          </a>
        </li>
        <li>
          <a href="./installESPDrivers.html" class="sidebar-nav-item">
            <span class="material-icons sidebar-nav-icon">usb</span>
            <span class="sidebar-nav-text">Install Drivers</span>
          </a>
        </li>
        <li>
          <a href="./updateESP/index.html" class="sidebar-nav-item">
            <span class="material-icons sidebar-nav-icon">memory</span>
            <span class="sidebar-nav-text">Update UC2-ESP32</span>
          </a>
        </li>
        <li>
          <a href="./setupConfig.html" class="sidebar-nav-item">
            <span class="material-icons sidebar-nav-icon">settings</span>
            <span class="sidebar-nav-text">Setup Configuration</span>
          </a>
        </li>
        <li>
          <a href="./fastAPI.html" class="sidebar-nav-item">
            <span class="material-icons sidebar-nav-icon">api</span>
            <span class="sidebar-nav-text">FastAPI</span>
          </a>
        </li>
        <li>
          <a href="./uninstallImSwitch.html" class="sidebar-nav-item">
            <span class="material-icons sidebar-nav-icon">delete</span>
            <span class="sidebar-nav-text">Uninstall ImSwitch</span>
          </a>
        </li>
      </ul>
    </nav>
  `;
}

// Function to create header with menu toggle instead of back button
function createHeaderWithMenu(title) {
  return `
    <header class="mdc-top-app-bar elevation-4">
      <div class="mdc-top-app-bar__row">
        <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
          <button class="mdc-icon-button mdc-top-app-bar__navigation-icon" id="menuToggle">
            <span class="material-icons">menu</span>
          </button>
          <span class="mdc-top-app-bar__title">${title}</span>
        </section>
        <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-end">
          <button class="mdc-icon-button theme-toggle" id="themeToggle" title="Toggle Light/Dark Theme">
            <span class="material-icons">brightness_6</span>
          </button>
          <img src="../assets/icons/icon.png" alt="ImSwitch Logo" class="app-logo" />
        </section>
      </div>
    </header>
  `;
}

// Function to initialize sidebar functionality
function initializeSidebar() {
  // Menu toggle functionality
  const menuToggle = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');
  const mainContent = document.getElementById('mainContent');

  if (menuToggle && sidebar && mainContent) {
    menuToggle.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
      mainContent.classList.toggle('sidebar-collapsed');
    });
  }

  // Theme toggle functionality
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;
  let isDarkMode = true; // Default to dark mode

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      isDarkMode = !isDarkMode;
      
      if (isDarkMode) {
        // Dark theme
        root.style.setProperty('--mdc-theme-background', '#121212');
        root.style.setProperty('--mdc-theme-surface', '#1e1e1e');
        root.style.setProperty('--mdc-theme-on-background', '#ffffff');
        root.style.setProperty('--mdc-theme-on-surface', '#ffffff');
      } else {
        // Light theme
        root.style.setProperty('--mdc-theme-background', '#ffffff');
        root.style.setProperty('--mdc-theme-surface', '#f5f5f5');
        root.style.setProperty('--mdc-theme-on-background', '#000000');
        root.style.setProperty('--mdc-theme-on-surface', '#000000');
      }
    });
  }

  // Active navigation highlighting
  const currentPage = window.location.pathname.split('/').pop();
  const navItems = document.querySelectorAll('.sidebar-nav-item');
  
  navItems.forEach(item => {
    const href = item.getAttribute('href');
    if (href && href.includes(currentPage)) {
      item.classList.add('active');
    }
  });

  // Auto-collapse sidebar on mobile
  if (window.innerWidth <= 768) {
    sidebar?.classList.add('collapsed');
    mainContent?.classList.add('sidebar-collapsed');
  }
}

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createSidebar, createHeaderWithMenu, initializeSidebar };
}