/* ===================================
   Global State Management
   ================================ */

// Global Application State
export const state = {
    currentUser: null,
    currentLanguage: 'en',
    inventory: { warehouse: [], office: [], "service-van": [] },
    projects: [],
    maintenance: [],
    amc: [],
    amcMonthlyMaintenance: [],
    leads: [],
    activities: [],
    employees: [],
    tasks: [],
    invoices: [],
    vendors: [],
    salarySlips: [],
    quotations: [],
    purchaseOrders: [],
    proformaInvoices: [],
    taxInvoices: [],
    installationActivities: [],
    modernisationActivities: [],
    repairActivities: [],
    complaintActivities: [],
    materials: [],
    companySettings: {
        name: 'Ambivare Solutions',
        logo: 'assets/ambivare.png',
        address: '',
        phone: '',
        email: 'info@ambivaresolutions.com',
        gst: '',
        cin: '',
        bankDetails: ''
    }
};

// State update helpers
export function updateState(key, value) {
    state[key] = value;
}

export function getState(key) {
    return state[key];
}

export function resetState() {
    Object.keys(state).forEach(key => {
        if (Array.isArray(state[key])) {
            state[key] = [];
        } else if (typeof state[key] === 'object') {
            state[key] = {};
        } else {
            state[key] = null;
        }
    });
}
