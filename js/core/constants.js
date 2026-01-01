/* ===================================
   Application Constants
   ================================ */

// Authentication
export const ADMIN_USERNAME = "Admin";
export const ADMIN_PASSWORD = "Ambivare@2025";
export const SESSION_KEY = "ambivare_session";

// Inventory Categories
export const CATEGORIES = {
    warehouse: ["Motors", "Controllers", "Cables", "Rails", "Car Equipment", "Safety Components", "Door Systems", "Fixtures", "Tools", "Hardware", "Other"],
    office: ["Stationery", "Paper", "Folders", "Pens", "Markers", "Toner", "Printer Supplies", "Furniture", "Electronics", "Other"],
    "service-van": ["Emergency Parts", "Tools", "Testing Equipment", "Safety Gear", "Sensors", "Controllers", "Cables", "Car Parts", "Door Parts", "Other"]
};

// Company Settings Default
export const DEFAULT_COMPANY_SETTINGS = {
    name: 'Ambivare Solutions',
    logo: 'assets/ambivare.png',
    address: '',
    phone: '',
    email: 'info@ambivaresolutions.com',
    gst: '',
    cin: '',
    bankDetails: ''
};
