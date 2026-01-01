/* ===================================
   Firebase Configuration & Initialization
   ================================ */

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-analytics.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAWScTKIGLxxNi6bgKGRrrfCHdA--W-Dzk",
    authDomain: "trivanta-leads.firebaseapp.com",
    projectId: "trivanta-leads",
    storageBucket: "trivanta-leads.firebasestorage.app",
    messagingSenderId: "665778087013",
    appId: "1:665778087013:web:e728dc7c97f1198704d28c",
    measurementId: "G-0L9B205EQY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// Export for use in other modules
export { app, analytics, db };
