/* ===================================
   UI Helper Functions
   ================================ */

// Modal management
export function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

export function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

export function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.classList.remove('active');
    });
    document.body.style.overflow = '';
}

// Setup global modal functions
export function setupModalGlobals() {
    window.openModal = openModal;
    window.closeModal = closeModal;
    window.closeAllModals = closeAllModals;
}

// Loading state management
export function showLoading(elementId = 'loadingIndicator') {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = 'block';
    }
}

export function hideLoading(elementId = 'loadingIndicator') {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = 'none';
    }
}

// Confirmation dialog
export function confirmAction(message, onConfirm) {
    if (confirm(message)) {
        onConfirm();
    }
}

// Format currency
export function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2
    }).format(amount || 0);
}

// Format number
export function formatNumber(number) {
    return new Intl.NumberFormat('en-IN').format(number || 0);
}

// Debounce function
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Copy to clipboard
export async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        if (window.showToast) {
            window.showToast('Copied to clipboard!', 'success');
        }
        return true;
    } catch (err) {
        console.error('Failed to copy:', err);
        return false;
    }
}

// Download file
export function downloadFile(content, filename, mimeType = 'text/plain') {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Escape HTML to prevent XSS
export function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Generate unique ID
export function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Setup all UI helper globals
export function setupUIHelperGlobals() {
    setupModalGlobals();
    window.confirmAction = confirmAction;
    window.formatCurrency = formatCurrency;
    window.formatNumber = formatNumber;
    window.copyToClipboard = copyToClipboard;
    window.downloadFile = downloadFile;
}
