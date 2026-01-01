/* ===================================
   Multi-Language Translation System
   ================================ */

export const translations = {
    en: {
        company_name: 'Ambivare Solutions',
        portal_subtitle: 'Elevator Management Portal',
        system_title: 'Elevator Management System',
        dashboard: 'Dashboard',
        warehouse: 'Warehouse',
        service_van: 'Service Van',
        office: 'Office',
        projects: 'Projects',
        maintenance: 'Maintenance',
        amc: 'AMC',
        billing: 'Billing',
        sales: 'Sales',
        activities: 'Activities',
        hr: 'HR',
        logout: 'Logout',
        username: 'Username',
        password: 'Password',
        sign_in: 'Sign In',
        enter_username: 'Enter your username',
        enter_password: 'Enter password',
        add: 'Add',
        edit: 'Edit',
        delete: 'Delete',
        save: 'Save',
        cancel: 'Cancel',
        close: 'Close',
        search: 'Search',
        filter: 'Filter',
        export: 'Export'
    },
    hi: {
        company_name: 'अम्बिवरे सॉल्यूशंस',
        portal_subtitle: 'एलिवेटर प्रबंधन पोर्टल',
        dashboard: 'डैशबोर्ड',
        warehouse: 'गोदाम',
        logout: 'लॉगआउट'
    },
    mr: {
        company_name: 'अंबिवरे सॉल्युशन्स',
        portal_subtitle: 'एलिव्हेटर व्यवस्थापन पोर्टल',
        dashboard: 'डॅशबोर्ड',
        warehouse: 'गोदाम',
        logout: 'लॉगआउट'
    }
};

export let currentLanguage = localStorage.getItem('selectedLanguage') || 'en';

export function changeLanguage() {
    const selector = document.getElementById('languageSelector');
    currentLanguage = selector.value;
    localStorage.setItem('selectedLanguage', currentLanguage);
    applyTranslations();
}

export function applyTranslations() {
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[currentLanguage]?.[key]) {
            element.textContent = translations[currentLanguage][key];
        }
    });
    
    const placeholderElements = document.querySelectorAll('[data-translate-placeholder]');
    placeholderElements.forEach(element => {
        const key = element.getAttribute('data-translate-placeholder');
        if (translations[currentLanguage]?.[key]) {
            element.placeholder = translations[currentLanguage][key];
        }
    });
}

export function initializeTranslations() {
    applyTranslations();
    window.changeLanguage = changeLanguage;
}
