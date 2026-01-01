/* ===================================
   Navigation & Routing Module
   ================================ */

// Show specific tab
export function showTab(tabName) {
    // Hide all tabs
    const allTabs = document.querySelectorAll('.tab-pane');
    allTabs.forEach(tab => tab.classList.remove('active'));
    
    // Show selected tab
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Update navigation active state
    const allNavItems = document.querySelectorAll('.nav-item');
    allNavItems.forEach(item => item.classList.remove('active'));
    
    const activeNavItem = document.querySelector(`[onclick*="${tabName}"]`);
    if (activeNavItem) {
        activeNavItem.classList.add('active');
    }
}

// Toggle sidebar
export function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    if (sidebar) {
        sidebar.classList.toggle('active');
    }
    if (overlay) {
        overlay.classList.toggle('active');
    }
}

// Close sidebar
export function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    if (sidebar) {
        sidebar.classList.remove('active');
    }
    if (overlay) {
        overlay.classList.remove('active');
    }
}

// Show tab from sidebar and close sidebar
export function showTabFromSidebar(tabName) {
    showTab(tabName);
    closeSidebar();
    
    // Trigger tab-specific initialization if needed
    if (window.onTabChange) {
        window.onTabChange(tabName);
    }
}

// Setup router globals for onclick handlers
export function setupRouterGlobals() {
    window.showTab = showTab;
    window.toggleSidebar = toggleSidebar;
    window.closeSidebar = closeSidebar;
    window.showTabFromSidebar = showTabFromSidebar;
}

// Initialize router
export function initializeRouter() {
    setupRouterGlobals();
    
    // Set up sidebar overlay click to close
    const overlay = document.getElementById('sidebarOverlay');
    if (overlay) {
        overlay.addEventListener('click', closeSidebar);
    }
    
    // Show dashboard by default
    showTab('dashboard');
}
