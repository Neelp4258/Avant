// ==================================
// TECHNICIAN LOCATION TRACKING SYSTEM
// ==================================
// This module handles real-time location tracking for technicians
// Admin can view all technicians on a map and see their visit history
// Technicians can enable/disable their location tracking

// Save reference to original showToast if it exists BEFORE defining our fallback
const originalShowToast = typeof window.showToast === 'function' ? window.showToast : null;

// Fallback showToast if not available
function showToast(message, type = 'info') {
    if (originalShowToast && originalShowToast !== showToast) {
        originalShowToast(message, type);
    } else {
        console.log(`[${type.toUpperCase()}] ${message}`);
    }
}

// Wait for Firebase and global variables to be available
function waitForGlobals(callback, maxAttempts = 50) {
    let attempts = 0;
    const checkInterval = setInterval(() => {
        attempts++;
        if (window.db && window.collection && window.currentUser && window.employees) {
            clearInterval(checkInterval);
            console.log('✅ All globals loaded, initializing tracking system');
            callback();
        } else if (attempts >= maxAttempts) {
            clearInterval(checkInterval);
            console.error('❌ Timeout waiting for globals. Missing:', {
                db: !!window.db,
                collection: !!window.collection,
                currentUser: !!window.currentUser,
                employees: !!window.employees
            });
        }
    }, 100); // Check every 100ms
}

let trackingMap = null;
let technicianMarkers = {};
let locationWatchId = null;
let isTrackingEnabled = false;
let locationUpdateInterval = null;
let selectedTechnicianId = 'all';
let locationListener = null; // Track the onSnapshot listener
let isInitializing = false; // Prevent multiple initializations

// Initialize tracking system when tab is opened
function initializeTracking() {
    // Prevent multiple simultaneous initializations
    if (isInitializing) {
        console.log('⚠️ Tracking already initializing, skipping...');
        return;
    }

    console.log('🗺️ Initializing tracking system...');
    isInitializing = true;

    // Wait for globals to be available
    waitForGlobals(() => {
        initializeTrackingInternal();
        isInitializing = false;
    });
}

function initializeTrackingInternal() {
    // Show appropriate view based on user role
    if (currentUser.role === 'admin' || currentUser.systemRole === 'admin') {
        document.getElementById('adminTrackingView').style.display = 'block';
        document.getElementById('technicianTrackingView').style.display = 'none';
        initializeAdminTracking();
    } else if (currentUser.role === 'technician' || currentUser.systemRole === 'technician') {
        document.getElementById('adminTrackingView').style.display = 'none';
        document.getElementById('technicianTrackingView').style.display = 'block';
        initializeTechnicianTracking();
    } else {
        // Other roles don't have access to tracking
        showToast('Tracking is only available for technicians and administrators', 'warning');
    }
}

// ==========================================
// ADMIN TRACKING VIEW
// ==========================================

function initializeAdminTracking() {
    console.log('🔧 Initializing admin tracking view...');

    // Initialize map
    setTimeout(() => {
        if (!trackingMap) {
            trackingMap = L.map('trackingMap').setView([20.5937, 78.9629], 5); // India center

            // Add OpenStreetMap tiles (free, no API key needed)
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 19
            }).addTo(trackingMap);

            console.log('✅ Map initialized');
        }
    }, 500);

    // Load technician list for dropdown
    loadTechnicianSelector();

    // Load technician locations
    loadTechnicianLocations();

    // Load recent visits
    loadRecentVisits();

    // Set up real-time listener for location updates
    setupLocationListener();
}

function loadTechnicianSelector() {
    const selector = document.getElementById('technicianSelector');
    if (!selector) return;

    // Get all technicians
    const technicians = employees.filter(emp =>
        (emp.systemRole === 'technician' || emp.role === 'technician') &&
        (emp.systemStatus === 'active' || emp.status === 'active')
    );

    // Populate dropdown
    selector.innerHTML = '<option value="all">All Technicians</option>';
    technicians.forEach(tech => {
        const option = document.createElement('option');
        option.value = tech.id;
        option.textContent = `${tech.firstName || tech.username} ${tech.lastName || ''}`;
        selector.appendChild(option);
    });
}

function selectTechnician(techId) {
    selectedTechnicianId = techId;
    console.log('📌 Selected technician:', techId);

    if (techId === 'all') {
        // Show all technicians
        Object.values(technicianMarkers).forEach(marker => {
            marker.addTo(trackingMap);
        });
    } else {
        // Hide all markers
        Object.values(technicianMarkers).forEach(marker => {
            marker.remove();
        });

        // Show only selected technician
        if (technicianMarkers[techId]) {
            technicianMarkers[techId].addTo(trackingMap);
            trackingMap.setView(technicianMarkers[techId].getLatLng(), 13);
        }
    }
}

async function loadTechnicianLocations() {
    try {
        const locationsSnapshot = await getDocs(collection(db, 'technicianLocations'));
        const locations = [];

        locationsSnapshot.forEach(doc => {
            locations.push({ id: doc.id, ...doc.data() });
        });

        console.log('📍 Loaded', locations.length, 'technician locations');

        // Update stats
        const activeCount = locations.filter(loc => loc.isActive).length;
        document.getElementById('totalTechnicians').textContent = locations.length;
        document.getElementById('activeTechnicians').textContent = activeCount;
        document.getElementById('inactiveTechnicians').textContent = locations.length - activeCount;

        // Update map markers
        updateMapMarkers(locations);

        // Update table
        updateTechnicianTable(locations);

    } catch (error) {
        console.error('Error loading technician locations:', error);
    }
}

function updateMapMarkers(locations) {
    if (!trackingMap) return;

    // Clear existing markers
    Object.values(technicianMarkers).forEach(marker => marker.remove());
    technicianMarkers = {};

    locations.forEach(location => {
        if (!location.latitude || !location.longitude) return;

        const tech = employees.find(e => e.id === location.technicianId);
        if (!tech) return;

        const techName = `${tech.firstName || tech.username} ${tech.lastName || ''}`;

        // Create marker icon based on status
        const iconColor = location.isActive ? 'green' : 'gray';
        const icon = L.divIcon({
            className: 'custom-marker',
            html: `<div style="background: ${iconColor}; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-size: 16px;">📍</div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });

        const marker = L.marker([location.latitude, location.longitude], { icon })
            .bindPopup(`
                <div style="padding: 8px;">
                    <strong>${techName}</strong><br>
                    Status: ${location.isActive ? '🟢 Active' : '🔴 Inactive'}<br>
                    Last Update: ${new Date(location.lastUpdate?.toDate() || location.lastUpdate).toLocaleString()}<br>
                    Accuracy: ±${Math.round(location.accuracy)}m
                </div>
            `);

        technicianMarkers[location.technicianId] = marker;

        if (selectedTechnicianId === 'all' || selectedTechnicianId === location.technicianId) {
            marker.addTo(trackingMap);
        }
    });

    // Fit map to show all markers
    if (selectedTechnicianId === 'all' && Object.keys(technicianMarkers).length > 0) {
        const group = L.featureGroup(Object.values(technicianMarkers));
        trackingMap.fitBounds(group.getBounds(), { padding: [50, 50] });
    }
}

function updateTechnicianTable(locations) {
    const tbody = document.getElementById('technicianTrackingList');
    if (!tbody) return;

    if (locations.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">
                    <p style="color: var(--text-secondary);">📍 No technician location data available</p>
                    <p style="font-size: 12px; color: var(--text-tertiary); margin-top: 8px;">Technicians will appear here when they enable location tracking</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = locations.map(location => {
        const tech = employees.find(e => e.id === location.technicianId);
        if (!tech) return '';

        const techName = `${tech.firstName || tech.username} ${tech.lastName || ''}`;
        const statusBadge = location.isActive ?
            '<span class="badge badge-success">🟢 Active</span>' :
            '<span class="badge badge-danger">🔴 Inactive</span>';

        const lastUpdate = location.lastUpdate ?
            new Date(location.lastUpdate.toDate ? location.lastUpdate.toDate() : location.lastUpdate).toLocaleString() :
            'Never';

        return `
            <tr>
                <td><strong>${techName}</strong></td>
                <td>${statusBadge}</td>
                <td>${lastUpdate}</td>
                <td>
                    <small style="font-family: monospace;">
                        ${location.latitude ? location.latitude.toFixed(6) : '--'},
                        ${location.longitude ? location.longitude.toFixed(6) : '--'}
                    </small>
                </td>
                <td>±${location.accuracy ? Math.round(location.accuracy) : '--'}m</td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="focusTechnician('${location.technicianId}')" ${!location.latitude ? 'disabled' : ''}>
                        📍 View
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function focusTechnician(techId) {
    if (technicianMarkers[techId]) {
        selectedTechnicianId = techId;
        document.getElementById('technicianSelector').value = techId;

        // Hide all markers
        Object.values(technicianMarkers).forEach(marker => marker.remove());

        // Show and focus on selected
        technicianMarkers[techId].addTo(trackingMap);
        trackingMap.setView(technicianMarkers[techId].getLatLng(), 15);
        technicianMarkers[techId].openPopup();
    }
}

async function loadRecentVisits() {
    try {
        const visitsRef = collection(db, 'technicianVisits');
        const q = query(visitsRef, orderBy('timestamp', 'desc'), limit(20));
        const visitsSnapshot = await getDocs(q);

        const visits = [];
        visitsSnapshot.forEach(doc => {
            visits.push({ id: doc.id, ...doc.data() });
        });

        displayRecentVisits(visits);

    } catch (error) {
        console.error('Error loading recent visits:', error);
    }
}

function displayRecentVisits(visits) {
    const container = document.getElementById('recentVisits');
    if (!container) return;

    if (visits.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 32px; color: var(--text-secondary);">
                No recent visits recorded
            </div>
        `;
        return;
    }

    container.innerHTML = visits.map(visit => {
        const tech = employees.find(e => e.id === visit.technicianId);
        const techName = tech ? `${tech.firstName || tech.username} ${tech.lastName || ''}` : 'Unknown';

        const timestamp = visit.timestamp ?
            new Date(visit.timestamp.toDate ? visit.timestamp.toDate() : visit.timestamp).toLocaleString() :
            'Unknown time';

        return `
            <div style="border-bottom: 1px solid var(--border); padding: 12px; display: flex; gap: 12px; align-items: start;">
                <div style="font-size: 24px;">📍</div>
                <div style="flex: 1;">
                    <div style="font-weight: 600; color: var(--text-primary); margin-bottom: 4px;">
                        ${techName}
                    </div>
                    <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 4px;">
                        ${visit.projectName || 'Unknown Project'}
                    </div>
                    <div style="font-size: 12px; color: var(--text-tertiary);">
                        ${timestamp}
                        ${visit.latitude && visit.longitude ?
                            ` • ${visit.latitude.toFixed(6)}, ${visit.longitude.toFixed(6)}` :
                            ''}
                    </div>
                </div>
                ${visit.latitude && visit.longitude ?
                    `<button class="btn btn-sm btn-secondary" onclick="viewVisitLocation(${visit.latitude}, ${visit.longitude})">
                        🗺️ View
                    </button>` :
                    ''}
            </div>
        `;
    }).join('');
}

function viewVisitLocation(lat, lng) {
    if (trackingMap) {
        trackingMap.setView([lat, lng], 15);
        L.popup()
            .setLatLng([lat, lng])
            .setContent('<strong>Visit Location</strong>')
            .openOn(trackingMap);
    }
}

function setupLocationListener() {
    // Unsubscribe from previous listener if exists
    if (locationListener) {
        console.log('🔄 Cleaning up previous location listener');
        locationListener();
        locationListener = null;
    }

    // Listen for real-time location updates
    const locationsRef = collection(db, 'technicianLocations');
    locationListener = onSnapshot(locationsRef, (snapshot) => {
        console.log('🔄 Location update received');
        loadTechnicianLocations();
        loadRecentVisits();
    });
}

// ==========================================
// TECHNICIAN TRACKING VIEW
// ==========================================

function initializeTechnicianTracking() {
    console.log('👷 Initializing technician tracking view...');

    // Check if location tracking is already enabled
    checkTrackingStatus();
}

async function checkTrackingStatus() {
    try {
        const docRef = doc(db, 'technicianLocations', currentUser.id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists() && docSnap.data().isActive) {
            // Location tracking is enabled
            startLocationTracking();
        }
    } catch (error) {
        console.error('Error checking tracking status:', error);
    }
}

async function toggleLocationTracking() {
    const btn = document.getElementById('toggleLocationBtn');
    const status = document.getElementById('trackingStatus');
    const statusText = document.getElementById('trackingStatusText');

    if (!isTrackingEnabled) {
        // Enable tracking
        if (!navigator.geolocation) {
            showToast('Geolocation is not supported by your browser', 'error');
            return;
        }

        btn.disabled = true;
        btn.textContent = 'Enabling...';

        // Request permission and start tracking
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                await startLocationTracking();
                showToast('Location tracking enabled successfully', 'success');
            },
            (error) => {
                console.error('Error getting location:', error);
                showToast('Failed to enable location tracking. Please allow location access.', 'error');
                btn.disabled = false;
                btn.textContent = 'Enable Location';
            },
            { enableHighAccuracy: true }
        );
    } else {
        // Disable tracking
        await stopLocationTracking();
        showToast('Location tracking disabled', 'info');
    }
}

async function startLocationTracking() {
    if (!navigator.geolocation) return;

    isTrackingEnabled = true;

    const btn = document.getElementById('toggleLocationBtn');
    const status = document.getElementById('trackingStatus');
    const statusText = document.getElementById('trackingStatusText');

    btn.textContent = 'Disable Location';
    btn.className = 'btn btn-danger';
    status.textContent = '🟢 Active';
    status.className = 'badge badge-success';
    statusText.textContent = 'Your location is being tracked for field service management';

    // Watch position with high accuracy
    locationWatchId = navigator.geolocation.watchPosition(
        updateLocation,
        (error) => {
            console.error('Location error:', error);
            showToast('Location tracking error. Check your GPS settings.', 'warning');
        },
        {
            enableHighAccuracy: true,
            maximumAge: 10000,
            timeout: 30000
        }
    );

    // Also update location every 2 minutes
    locationUpdateInterval = setInterval(() => {
        navigator.geolocation.getCurrentPosition(updateLocation, null, {
            enableHighAccuracy: true
        });
    }, 120000); // 2 minutes

    // Initial location update
    navigator.geolocation.getCurrentPosition(updateLocation);
}

async function stopLocationTracking() {
    isTrackingEnabled = false;

    if (locationWatchId) {
        navigator.geolocation.clearWatch(locationWatchId);
        locationWatchId = null;
    }

    if (locationUpdateInterval) {
        clearInterval(locationUpdateInterval);
        locationUpdateInterval = null;
    }

    const btn = document.getElementById('toggleLocationBtn');
    const status = document.getElementById('trackingStatus');
    const statusText = document.getElementById('trackingStatusText');

    btn.textContent = 'Enable Location';
    btn.className = 'btn btn-success';
    status.textContent = '🔴 Disabled';
    status.className = 'badge badge-danger';
    statusText.textContent = 'Enable location tracking to start';

    // Update Firebase
    try {
        await setDoc(doc(db, 'technicianLocations', currentUser.id), {
            technicianId: currentUser.id,
            technicianName: currentUser.fullName || currentUser.username,
            isActive: false,
            lastUpdate: new Date()
        }, { merge: true });
    } catch (error) {
        console.error('Error updating tracking status:', error);
    }

    // Clear display
    document.getElementById('currentLat').textContent = '--';
    document.getElementById('currentLng').textContent = '--';
    document.getElementById('currentAccuracy').textContent = '--';
    document.getElementById('lastUpdateTime').textContent = '--';
}

async function updateLocation(position) {
    const { latitude, longitude, accuracy } = position.coords;

    console.log('📍 Location update:', { latitude, longitude, accuracy });

    // Update UI
    document.getElementById('currentLat').textContent = latitude.toFixed(6);
    document.getElementById('currentLng').textContent = longitude.toFixed(6);
    document.getElementById('currentAccuracy').textContent = `±${Math.round(accuracy)}m`;
    document.getElementById('lastUpdateTime').textContent = new Date().toLocaleTimeString();

    // Update Firebase
    try {
        await setDoc(doc(db, 'technicianLocations', currentUser.id), {
            technicianId: currentUser.id,
            technicianName: currentUser.fullName || currentUser.username,
            latitude: latitude,
            longitude: longitude,
            accuracy: accuracy,
            isActive: true,
            lastUpdate: new Date()
        });

        console.log('✅ Location updated in Firebase');
    } catch (error) {
        console.error('Error updating location:', error);
    }
}

// Record a visit to a project
async function recordProjectVisit(projectId, projectName) {
    if (!isTrackingEnabled) {
        console.warn('Location tracking is not enabled');
        return;
    }

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            try {
                await addDoc(collection(db, 'technicianVisits'), {
                    technicianId: currentUser.id,
                    technicianName: currentUser.fullName || currentUser.username,
                    projectId: projectId,
                    projectName: projectName,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    timestamp: new Date()
                });

                console.log('✅ Project visit recorded');
                showToast(`Visit to ${projectName} recorded`, 'success');
            } catch (error) {
                console.error('Error recording visit:', error);
            }
        },
        (error) => {
            console.error('Error getting location for visit:', error);
        },
        { enableHighAccuracy: true }
    );
}

// Expose to global scope
window.initializeTracking = initializeTracking;
window.toggleLocationTracking = toggleLocationTracking;
window.selectTechnician = selectTechnician;
window.focusTechnician = focusTechnician;
window.viewVisitLocation = viewVisitLocation;
window.recordProjectVisit = recordProjectVisit;
window.refreshTracking = function() {
    if (currentUser.role === 'admin' || currentUser.systemRole === 'admin') {
        loadTechnicianLocations();
        loadRecentVisits();
    } else {
        checkTrackingStatus();
    }
};

console.log('✅ Tracking module loaded');
