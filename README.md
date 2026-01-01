# Elevator Management System - Organized Structure

## Overview
This is a comprehensive cloud-based elevator management system built with vanilla JavaScript, Firebase, and modern web technologies.

## Project Structure

```
Lift-management/
├── assets/
│   └── ambivare.png                    # Company logo
├── css/
│   ├── main.css                        # Main stylesheet (imports all modules)
│   ├── variables.css                   # CSS custom properties
│   ├── base.css                        # Base styles & reset
│   ├── components/                     # Component-specific styles
│   │   ├── alerts.css
│   │   ├── amc.css
│   │   ├── badges.css
│   │   ├── billing.css
│   │   ├── buttons.css
│   │   ├── cards.css
│   │   ├── console.css
│   │   ├── forms.css
│   │   ├── header.css
│   │   ├── login.css
│   │   ├── mapbox.css
│   │   ├── modals.css
│   │   ├── sidebar.css
│   │   ├── tables.css
│   │   └── toast.css
│   └── utilities/                      # Utility styles
│       ├── animations.css
│       ├── responsive.css
│       └── scrollbar.css
├── js/
│   ├── core/                           # Core application modules
│   │   ├── firebase-config.js          # Firebase initialization
│   │   ├── constants.js                # Application constants
│   │   └── state.js                    # Global state management
│   ├── modules/                        # Feature modules (to be extracted)
│   ├── utils/                          # Utility functions (to be extracted)
│   └── app.js                          # Main application logic
├── index.html                          # Main application entry point
└── README.md                           # This file
```

## Technology Stack

- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Backend**: Firebase Firestore (NoSQL cloud database)
- **Storage**: Firebase IndexedDB for offline persistence
- **Maps**: Mapbox GL for technician tracking
- **PDF Generation**: jsPDF
- **Excel Export**: SheetJS/XLSX
- **Charts**: Chart.js
- **Email**: SMTP.js

## Key Features

### Core Modules
1. **Dashboard** - Role-based dashboards (Admin, Technician, Sales, Reception)
2. **Inventory Management** - Warehouse, Office, Service Van
3. **Project Management** - Multi-step project creation and tracking
4. **AMC** - Annual Maintenance Contract management
5. **Billing** - Quotations, Invoices, Purchase Orders
6. **HR** - Employee management, attendance, salary slips
7. **Sales** - Lead management and conversion tracking
8. **Tracking** - Real-time GPS tracking of technicians
9. **Chat** - Internal real-time messaging

### Features
- Multi-language support (English, Hindi, Marathi)
- Offline-first with IndexedDB persistence
- Role-based access control
- PDF generation for reports and invoices
- Excel export functionality
- Barcode scanning for inventory
- Digital signatures for work completion
- Real-time notifications

## Firebase Collections

- `inventory` - Inventory items (warehouse, office, service van)
- `projects` - Project records
- `maintenance` - Repair/maintenance records
- `amc` - AMC contracts
- `amcMonthlyMaintenance` - Monthly AMC tasks
- `activities` - Activity audit log
- `employees` / `users` - Employee records
- `tasks` - Task assignments
- `invoices` - Invoice records
- `salarySlips` - Salary records
- `quotations` - Sales quotations
- `purchaseOrders` - Purchase orders
- `proformaInvoices` - Proforma invoices
- `taxInvoices` - Tax invoices
- `installationActivities` - Installation tracking
- `modernisationActivities` - Modernization tracking
- `materials` - BOM materials
- `leads` - Sales leads
- `vendors` - Vendor records
- `chats/{chatId}/messages` - Chat messages

## Getting Started

1. Open `index.html` in a modern web browser
2. Login with credentials:
   - **Username**: Admin
   - **Password**: Ambivare@2025

## Browser Compatibility

- Chrome/Edge (recommended)
- Firefox
- Safari
- Mobile browsers (responsive design)

## Security Notes

- Firebase API keys are exposed in client-side code (normal for Firebase)
- Security rules should be configured in Firebase Console
- Credentials are currently hardcoded (should be migrated to Firebase Auth)

## Development Roadmap

### Completed
- ✅ Organized CSS into modular components
- ✅ Created proper directory structure
- ✅ Extracted Firebase configuration
- ✅ Created state management system

### To Do
- 🔄 Continue modularizing JavaScript into feature-specific files
- 🔄 Migrate authentication to Firebase Auth
- 🔄 Add TypeScript for better type safety
- 🔄 Implement automated tests
- 🔄 Add build process (Webpack/Vite)
- 🔄 Optimize bundle size

## Contributing

This is a proprietary system for elevator management. For questions or support, contact the development team.

## License

© 2025 Ambivare Solutions. All rights reserved.
