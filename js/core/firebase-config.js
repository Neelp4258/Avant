/* ===================================
   Firebase Configuration & Initialization
   ================================ */

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-analytics.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC2jWIdCA6VQMrZB8yanb3HQFzN9e6KXY0",
    authDomain: "dazzlojewellers.firebaseapp.com",
    projectId: "dazzlojewellers",
    storageBucket: "dazzlojewellers.firebasestorage.app",
    messagingSenderId: "334783357818",
    appId: "1:334783357818:web:3009541b14699606fd2cc3",
    measurementId: "G-288DC3S9LM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// Export for use in other modules
export { app, analytics, db };
