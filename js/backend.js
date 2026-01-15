/* =============================================
   SAFARSORTED BACKEND SERVICE
   Premium localStorage-based Backend System
   ============================================= */

const SafarSortedBackend = (function () {
    'use strict';

    // Storage Keys
    const KEYS = {
        INQUIRIES: 'safarsorted_inquiries',
        SETTINGS: 'safarsorted_settings',
        ANALYTICS: 'safarsorted_analytics',
        USER_PREFS: 'safarsorted_user_prefs',
        BOOKINGS: 'safarsorted_bookings'
    };

    // ==========================================
    // STORAGE SERVICE
    // ==========================================
    const Storage = {
        get(key) {
            try {
                return JSON.parse(localStorage.getItem(key)) || null;
            } catch { return null; }
        },
        set(key, data) {
            try {
                localStorage.setItem(key, JSON.stringify(data));
                return true;
            } catch { return false; }
        },
        remove(key) {
            localStorage.removeItem(key);
        }
    };

    // ==========================================
    // INQUIRY SERVICE
    // ==========================================
    const Inquiries = {
        getAll() {
            return Storage.get(KEYS.INQUIRIES) || [];
        },

        getById(id) {
            return this.getAll().find(i => i.id === id);
        },

        getByStatus(status) {
            return this.getAll().filter(i => i.status === status);
        },

        getStats() {
            const all = this.getAll();
            return {
                total: all.length,
                new: all.filter(i => i.status === 'new').length,
                contacted: all.filter(i => i.status === 'contacted').length,
                booked: all.filter(i => i.status === 'booked').length,
                cancelled: all.filter(i => i.status === 'cancelled').length,
                conversionRate: all.length ? Math.round((all.filter(i => i.status === 'booked').length / all.length) * 100) : 0
            };
        },

        create(data) {
            const inquiries = this.getAll();
            const inquiry = {
                id: Date.now(),
                name: data.name,
                phone: data.phone,
                email: data.email || '',
                travelers: parseInt(data.travelers) || 1,
                destination: data.destination,
                travelDate: data.travelDate || '',
                tripType: data.tripType || '',
                budget: data.budget || '',
                message: data.message || '',
                status: 'new',
                notes: '',
                source: data.source || 'website',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
            inquiries.unshift(inquiry);
            Storage.set(KEYS.INQUIRIES, inquiries);

            // Track analytics
            Analytics.track('inquiry_created', { destination: inquiry.destination });

            return inquiry;
        },

        update(id, updates) {
            const inquiries = this.getAll();
            const idx = inquiries.findIndex(i => i.id === id);
            if (idx !== -1) {
                inquiries[idx] = { ...inquiries[idx], ...updates, updated_at: new Date().toISOString() };
                Storage.set(KEYS.INQUIRIES, inquiries);
                return inquiries[idx];
            }
            return null;
        },

        delete(id) {
            const inquiries = this.getAll().filter(i => i.id !== id);
            Storage.set(KEYS.INQUIRIES, inquiries);
            return true;
        },

        search(query) {
            const q = query.toLowerCase();
            return this.getAll().filter(i =>
                i.name.toLowerCase().includes(q) ||
                i.phone.includes(q) ||
                i.destination.toLowerCase().includes(q) ||
                (i.email && i.email.toLowerCase().includes(q))
            );
        }
    };

    // ==========================================
    // TRAVELERS SERVICE
    // ==========================================
    const Travelers = {
        getAll() {
            const inquiries = Inquiries.getAll();
            const travelersMap = new Map();

            inquiries.forEach(i => {
                if (!travelersMap.has(i.phone)) {
                    travelersMap.set(i.phone, {
                        id: i.phone,
                        name: i.name,
                        phone: i.phone,
                        email: i.email || '',
                        trips: [],
                        totalTrips: 0,
                        firstContact: i.created_at,
                        lastContact: i.created_at
                    });
                }
                const traveler = travelersMap.get(i.phone);
                traveler.trips.push({
                    destination: i.destination,
                    date: i.travelDate,
                    status: i.status,
                    created: i.created_at
                });
                traveler.totalTrips++;
                if (new Date(i.created_at) > new Date(traveler.lastContact)) {
                    traveler.lastContact = i.created_at;
                    traveler.name = i.name; // Update to latest name
                }
            });

            return Array.from(travelersMap.values()).sort((a, b) =>
                new Date(b.lastContact) - new Date(a.lastContact)
            );
        },

        getByPhone(phone) {
            return this.getAll().find(t => t.phone === phone);
        },

        getStats() {
            const travelers = this.getAll();
            const repeatCustomers = travelers.filter(t => t.totalTrips > 1);
            return {
                total: travelers.length,
                repeatCustomers: repeatCustomers.length,
                avgTripsPerCustomer: travelers.length ? (travelers.reduce((sum, t) => sum + t.totalTrips, 0) / travelers.length).toFixed(1) : 0
            };
        }
    };

    // ==========================================
    // ANALYTICS SERVICE
    // ==========================================
    const Analytics = {
        getData() {
            return Storage.get(KEYS.ANALYTICS) || {
                pageViews: {},
                events: [],
                destinations: {},
                dailyStats: {}
            };
        },

        save(data) {
            Storage.set(KEYS.ANALYTICS, data);
        },

        trackPageView(page) {
            const data = this.getData();
            const today = new Date().toISOString().split('T')[0];

            // Page views
            data.pageViews[page] = (data.pageViews[page] || 0) + 1;

            // Daily stats
            if (!data.dailyStats[today]) {
                data.dailyStats[today] = { views: 0, inquiries: 0 };
            }
            data.dailyStats[today].views++;

            this.save(data);
        },

        track(event, properties = {}) {
            const data = this.getData();
            data.events.push({
                event,
                properties,
                timestamp: new Date().toISOString()
            });

            // Track destination popularity
            if (properties.destination) {
                data.destinations[properties.destination] = (data.destinations[properties.destination] || 0) + 1;
            }

            // Keep only last 1000 events
            if (data.events.length > 1000) {
                data.events = data.events.slice(-1000);
            }

            this.save(data);
        },

        getPopularDestinations() {
            const data = this.getData();
            return Object.entries(data.destinations)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10)
                .map(([name, count]) => ({ name, count }));
        },

        getWeeklyStats() {
            const data = this.getData();
            const stats = [];
            for (let i = 6; i >= 0; i--) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                const key = date.toISOString().split('T')[0];
                stats.push({
                    date: key,
                    views: data.dailyStats[key]?.views || 0,
                    inquiries: data.dailyStats[key]?.inquiries || 0
                });
            }
            return stats;
        }
    };

    // ==========================================
    // SETTINGS SERVICE
    // ==========================================
    const Settings = {
        defaults: {
            whatsapp: '+91 8989015959',
            email: 'safarsorted@gmail.com',
            company: 'SafarSorted',
            tagline: 'Your Journey, Sorted!',
            currency: 'INR',
            notifyEmail: true,
            notifySound: true,
            autoResponse: true,
            responseTime: '2 hours'
        },

        get() {
            return { ...this.defaults, ...Storage.get(KEYS.SETTINGS) };
        },

        set(settings) {
            Storage.set(KEYS.SETTINGS, { ...this.get(), ...settings });
        },

        reset() {
            Storage.set(KEYS.SETTINGS, this.defaults);
        }
    };

    // ==========================================
    // USER PREFERENCES SERVICE
    // ==========================================
    const UserPrefs = {
        get() {
            return Storage.get(KEYS.USER_PREFS) || {
                travelerType: null,
                recentViews: [],
                wishlist: []
            };
        },

        set(prefs) {
            Storage.set(KEYS.USER_PREFS, { ...this.get(), ...prefs });
        },

        setTravelerType(type) {
            this.set({ travelerType: type });
        },

        addRecentView(destination) {
            const prefs = this.get();
            prefs.recentViews = [destination, ...prefs.recentViews.filter(d => d !== destination)].slice(0, 5);
            this.set(prefs);
        },

        toggleWishlist(destination) {
            const prefs = this.get();
            const idx = prefs.wishlist.indexOf(destination);
            if (idx === -1) {
                prefs.wishlist.push(destination);
            } else {
                prefs.wishlist.splice(idx, 1);
            }
            this.set(prefs);
            return idx === -1;
        },

        isInWishlist(destination) {
            return this.get().wishlist.includes(destination);
        }
    };

    // ==========================================
    // NOTIFICATION SERVICE
    // ==========================================
    const Notify = {
        show(message, type = 'info', duration = 4000) {
            const existing = document.querySelector('.ss-notification');
            if (existing) existing.remove();

            const colors = {
                success: '#22c55e',
                error: '#ef4444',
                warning: '#f59e0b',
                info: '#3b82f6'
            };

            const icons = {
                success: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
                error: '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>',
                warning: '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
                info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>'
            };

            const notification = document.createElement('div');
            notification.className = 'ss-notification';
            notification.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${icons[type]}</svg>
                <span>${message}</span>
                <button onclick="this.parentElement.remove()">×</button>
            `;

            Object.assign(notification.style, {
                position: 'fixed',
                bottom: '24px',
                right: '24px',
                padding: '14px 20px',
                paddingRight: '44px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                zIndex: '9999',
                maxWidth: '400px',
                animation: 'ssNotifyIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                backgroundColor: colors[type],
                color: '#fff',
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '0.9rem'
            });

            const svg = notification.querySelector('svg');
            Object.assign(svg.style, { width: '20px', height: '20px', flexShrink: '0' });

            const btn = notification.querySelector('button');
            Object.assign(btn.style, {
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '20px',
                cursor: 'pointer',
                opacity: '0.8'
            });

            if (!document.getElementById('ss-notify-styles')) {
                const style = document.createElement('style');
                style.id = 'ss-notify-styles';
                style.textContent = `
                    @keyframes ssNotifyIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
                    @keyframes ssNotifyOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
                `;
                document.head.appendChild(style);
            }

            document.body.appendChild(notification);

            if (duration > 0) {
                setTimeout(() => {
                    notification.style.animation = 'ssNotifyOut 0.3s ease forwards';
                    setTimeout(() => notification.remove(), 300);
                }, duration);
            }
        },

        success(msg) { this.show(msg, 'success'); },
        error(msg) { this.show(msg, 'error'); },
        warning(msg) { this.show(msg, 'warning'); },
        info(msg) { this.show(msg, 'info'); }
    };

    // ==========================================
    // FORM HANDLER SERVICE
    // ==========================================
    const Forms = {
        validate(data, rules) {
            const errors = [];

            if (rules.name && (!data.name || data.name.trim().length < 2)) {
                errors.push('Please enter a valid name');
            }

            if (rules.phone) {
                const phone = (data.phone || '').replace(/\s/g, '');
                const phoneRegex = /^[\+]?[0-9]{10,14}$/;
                if (!phoneRegex.test(phone)) {
                    errors.push('Please enter a valid phone number');
                }
            }

            if (rules.email && data.email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(data.email)) {
                    errors.push('Please enter a valid email');
                }
            }

            if (rules.destination && !data.destination) {
                errors.push('Please select a destination');
            }

            if (rules.travelers && (!data.travelers || data.travelers < 1)) {
                errors.push('Please enter number of travelers');
            }

            return errors;
        },

        submitInquiry(formData) {
            const errors = this.validate(formData, {
                name: true,
                phone: true,
                destination: true,
                travelers: true
            });

            if (errors.length) {
                Notify.error(errors[0]);
                return { success: false, errors };
            }

            const inquiry = Inquiries.create(formData);
            Notify.success("Thank you! We'll contact you within 2 hours.");

            return { success: true, inquiry };
        }
    };

    // ==========================================
    // EXPORT/IMPORT SERVICE
    // ==========================================
    const DataManager = {
        exportAll() {
            return {
                version: '2.0',
                exportedAt: new Date().toISOString(),
                inquiries: Inquiries.getAll(),
                settings: Settings.get(),
                analytics: Analytics.getData()
            };
        },

        importAll(data) {
            try {
                if (data.inquiries) Storage.set(KEYS.INQUIRIES, data.inquiries);
                if (data.settings) Storage.set(KEYS.SETTINGS, data.settings);
                if (data.analytics) Storage.set(KEYS.ANALYTICS, data.analytics);
                return true;
            } catch {
                return false;
            }
        },

        clearAll() {
            Object.values(KEYS).forEach(key => Storage.remove(key));
        },

        downloadBackup() {
            const data = this.exportAll();
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `safarsorted_backup_${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
        }
    };

    // ==========================================
    // INITIALIZE
    // ==========================================
    function init() {
        // Track page view
        const page = window.location.pathname.split('/').pop() || 'index.html';
        Analytics.trackPageView(page);

        console.log('🚀 SafarSorted Backend Initialized');
    }

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // ==========================================
    // PUBLIC API
    // ==========================================
    return {
        Inquiries,
        Travelers,
        Analytics,
        Settings,
        UserPrefs,
        Notify,
        Forms,
        DataManager,
        Storage
    };

})();

// Expose globally
window.SS = SafarSortedBackend;
