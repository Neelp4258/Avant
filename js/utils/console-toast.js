
// Console Interceptor - Capture all console messages
(function() {
    const consoleLogs = [];
    const maxLogs = 500;
    const consoleLogsEl = document.getElementById('consoleLogs');

    function addLog(type, args) {
        const timestamp = new Date().toLocaleTimeString();
        const message = Array.from(args).map(arg => {
            if (typeof arg === 'object') {
                try {
                    return JSON.stringify(arg, null, 2);
                } catch (e) {
                    return String(arg);
                }
            }
            return String(arg);
        }).join(' ');

        const logEntry = { timestamp, type, message };
        consoleLogs.push(logEntry);

        // Keep only last maxLogs entries
        if (consoleLogs.length > maxLogs) {
            consoleLogs.shift();
        }

        // Update UI if console is open
        if (consoleLogsEl) {
            renderLogs();
        }
    }

    function renderLogs() {
        const logsHtml = consoleLogs.map(log => `
            <div class="console-${log.type}">
                <span class="console-timestamp">${log.timestamp}</span>
                <strong>[${log.type.toUpperCase()}]</strong> ${escapeHtml(log.message)}
            </div>
        `).join('');

        consoleLogsEl.innerHTML = logsHtml || '<div style="color: #9ca3af; text-align: center; padding: 40px;">No logs yet</div>';
        consoleLogsEl.scrollTop = consoleLogsEl.scrollHeight;
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Intercept console methods
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;
    const originalInfo = console.info;

    console.log = function(...args) {
        addLog('log', args);
        originalLog.apply(console, args);
    };

    console.error = function(...args) {
        addLog('error', args);
        originalError.apply(console, args);
    };

    console.warn = function(...args) {
        addLog('warn', args);
        originalWarn.apply(console, args);
    };

    console.info = function(...args) {
        addLog('info', args);
        originalInfo.apply(console, args);
    };

    // Capture uncaught errors
    window.addEventListener('error', function(event) {
        addLog('error', [`Uncaught Error: ${event.message} at ${event.filename}:${event.lineno}:${event.colno}`]);
    });

    // Capture unhandled promise rejections
    window.addEventListener('unhandledrejection', function(event) {
        addLog('error', [`Unhandled Promise Rejection: ${event.reason}`]);
    });

    // Global functions for console viewer
    window.toggleConsole = function() {
        const viewer = document.getElementById('consoleViewer');
        if (viewer.classList.contains('active')) {
            viewer.classList.remove('active');
        } else {
            viewer.classList.add('active');
            renderLogs();
        }
    };

    window.clearConsoleLogs = function() {
        consoleLogs.length = 0;
        renderLogs();
    };

    window.exportConsoleLogs = function() {
        const logText = consoleLogs.map(log =>
            `[${log.timestamp}] [${log.type.toUpperCase()}] ${log.message}`
        ).join('\n');

        const blob = new Blob([logText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `console-logs-${new Date().toISOString().slice(0,19).replace(/:/g,'-')}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        alert('✅ Console logs exported successfully!');
    };

    // Add initial log
    console.log('🐛 Console viewer initialized');
})();

// Toast Notification System
window.showToast = function(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toastContainer');
    if (!container) {
        console.warn('Toast container not found');
        return;
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    // Icon based on type
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    const icon = icons[type] || icons.info;

    // Build toast HTML
    toast.innerHTML = `
        <span class="toast-icon">${icon}</span>
        <span class="toast-message">${message}</span>
        <button class="toast-close" onclick="this.parentElement.remove()">×</button>
    `;

    // Add to container
    container.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);

    // Auto remove after duration
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, duration);
};
    
