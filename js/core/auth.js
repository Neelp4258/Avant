/* ===================================
   Authentication Module
   ================================ */

import { ADMIN_USERNAME, ADMIN_PASSWORD, SESSION_KEY } from './constants.js';
import { state } from './state.js';
import { applyTranslations } from './translations.js';

// Check if user is logged in
export function checkSession() {
    const session = localStorage.getItem(SESSION_KEY);
    if (session) {
        try {
            state.currentUser = JSON.parse(session);
            return true;
        } catch (e) {
            localStorage.removeItem(SESSION_KEY);
            return false;
        }
    }
    return false;
}

// Login function
export async function login(username, password) {
    // Check hardcoded admin credentials
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        const user = {
            username: ADMIN_USERNAME,
            role: 'Admin',
            loginTime: new Date().toISOString()
        };
        
        state.currentUser = user;
        localStorage.setItem(SESSION_KEY, JSON.stringify(user));
        
        return { success: true, user };
    }
    
    // Check against Firebase employees collection
    // (This would be implemented with Firebase auth in production)
    return { success: false, error: 'Invalid username or password' };
}

// Logout function
export function logout() {
    localStorage.removeItem(SESSION_KEY);
    state.currentUser = null;
    window.location.reload();
}

// Initialize authentication
export function initializeAuth() {
    const loginForm = document.getElementById('loginForm');
    const loginScreen = document.getElementById('loginScreen');
    const mainApp = document.getElementById('mainApp');
    
    // Check if already logged in
    if (checkSession()) {
        loginScreen?.classList.add('hidden');
        mainApp?.classList.add('active');
        applyTranslations();
        return true;
    }
    
    // Handle login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const username = document.getElementById('username')?.value;
            const password = document.getElementById('password')?.value;
            const loginError = document.getElementById('loginError');
            const loginBtn = document.getElementById('loginBtn');
            
            if (!username || !password) {
                if (loginError) {
                    loginError.textContent = 'Please enter both username and password';
                    loginError.style.display = 'block';
                }
                return;
            }
            
            // Disable button during login
            if (loginBtn) {
                loginBtn.disabled = true;
                loginBtn.textContent = 'Signing in...';
            }
            
            const result = await login(username, password);
            
            if (result.success) {
                loginScreen?.classList.add('hidden');
                mainApp?.classList.add('active');
                applyTranslations();
                
                // Initialize app after login
                if (window.initializeApp) {
                    window.initializeApp();
                }
            } else {
                if (loginError) {
                    loginError.textContent = result.error || 'Login failed';
                    loginError.style.display = 'block';
                }
                if (loginBtn) {
                    loginBtn.disabled = false;
                    loginBtn.textContent = 'Sign In';
                }
            }
        });
    }
    
    return false;
}

// Export logout to window for onclick handlers
export function setupAuthGlobals() {
    window.logout = logout;
}
