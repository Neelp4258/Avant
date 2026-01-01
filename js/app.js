/* ===================================
   Main Application Entry Point
   Elevator Management System
   ================================ */

// Firebase Configuration & Database
import { db } from './core/firebase-config.js';

// Core Modules
import { initializeTranslations, applyTranslations } from './core/translations.js';
import { initializeAuth, setupAuthGlobals } from './core/auth.js';
import { initializeRouter, setupRouterGlobals } from './core/router.js';
import { state } from './core/state.js';

// Utility Modules
import { setupUIHelperGlobals } from './utils/ui-helpers.js';
import { formatDate, formatDateIndian } from './utils/date-utils.js';

// Firebase Operations
import { readAllDocuments } from './core/firebase-operations.js';

// Note: Feature functions are loaded from app-features.js (loaded separately in index.html)
// This allows gradual modularization while maintaining all functionality

console.log('🚀 Initializing Elevator Management System...');

// Global initialization function
window.initializeApp = async function() {
    console.log('📊 Loading application data...');
    
    // Load all data from Firebase
    try {
        // Load inventory
        const inventoryResult = await readAllDocuments('inventory');
        if (inventoryResult.success) {
            // Organize by location
            state.inventory = {
                warehouse: inventoryResult.data.filter(item => item.location === 'warehouse'),
                office: inventoryResult.data.filter(item => item.location === 'office'),
                'service-van': inventoryResult.data.filter(item => item.location === 'service-van')
            };
        }
        
        // Load projects
        const projectsResult = await readAllDocuments('projects');
        if (projectsResult.success) {
            state.projects = projectsResult.data;
        }
        
        // Load maintenance records
        const maintenanceResult = await readAllDocuments('maintenance');
        if (maintenanceResult.success) {
            state.maintenance = maintenanceResult.data;
        }
        
        // Load AMC contracts
        const amcResult = await readAllDocuments('amc');
        if (amcResult.success) {
            state.amc = amcResult.data;
        }
        
        // Load employees
        const employeesResult = await readAllDocuments('employees');
        if (employeesResult.success) {
            state.employees = employeesResult.data;
        }
        
        // Load leads
        const leadsResult = await readAllDocuments('leads');
        if (leadsResult.success) {
            state.leads = leadsResult.data;
        }
        
        console.log('✅ Application data loaded successfully');
        
        // Initialize dashboard
        if (window.loadDashboard) {
            window.loadDashboard();
        }
        
        // Show success message
        if (window.showToast) {
            window.showToast('Welcome to Elevator Management System!', 'success');
        }
        
    } catch (error) {
        console.error('❌ Error loading application data:', error);
        if (window.showToast) {
            window.showToast('Error loading data. Please refresh the page.', 'error');
        }
    }
};

// Main initialization when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 DOM Content Loaded - Starting initialization...');

    // NOTE: Auth, routing, and data loading are fully handled by app-features.js
    // This file (app.js) is currently not needed but kept for future modularization
    // app-features.js handles:
    // - Authentication (login form listener on line 382)
    // - Session management (checkSession on window load)
    // - Data loading (loadData function)
    // - Dashboard rendering (renderDashboardByRole)

    console.log('✅ Application initialized (handled by app-features.js)');
});

// Handle online/offline status
window.addEventListener('online', () => {
    const badge = document.getElementById('offlineBadge');
    if (badge) badge.classList.remove('show');
    if (window.showToast) {
        window.showToast('Back online!', 'success');
    }
});

window.addEventListener('offline', () => {
    const badge = document.getElementById('offlineBadge');
    if (badge) badge.classList.add('show');
    if (window.showToast) {
        window.showToast('You are offline. Some features may not work.', 'warning');
    }
});

// Export state for debugging
window.__APP_STATE__ = state;

console.log('✨ Elevator Management System Ready!');
