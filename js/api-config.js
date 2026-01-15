/* =============================================
   SAFARSORTED API CONFIGURATION
   Update API_BASE_URL after deploying to Render
   ============================================= */

const API_CONFIG = {
    // Live backend on Render
    API_BASE_URL: 'https://safarsorted-api.onrender.com',

    // For local development, use:
    // API_BASE_URL: 'http://localhost:3000',

    // Admin credentials (for demo - in production use proper auth)
    ADMIN_USER: 'admin',
    ADMIN_PASS: 'safarsorted123'
};

// API Helper Functions
const SafarAPI = {
    async submitInquiry(data) {
        try {
            const response = await fetch(`${API_CONFIG.API_BASE_URL}/api/inquiry`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to submit inquiry');
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    async getInquiries() {
        try {
            const credentials = btoa(`${API_CONFIG.ADMIN_USER}:${API_CONFIG.ADMIN_PASS}`);
            const response = await fetch(`${API_CONFIG.API_BASE_URL}/api/admin/inquiries`, {
                headers: {
                    'Authorization': `Basic ${credentials}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch inquiries');
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    async updateInquiry(id, data) {
        try {
            const credentials = btoa(`${API_CONFIG.ADMIN_USER}:${API_CONFIG.ADMIN_PASS}`);
            const response = await fetch(`${API_CONFIG.API_BASE_URL}/api/admin/inquiries/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${credentials}`
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Failed to update inquiry');
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    async getStats() {
        try {
            const credentials = btoa(`${API_CONFIG.ADMIN_USER}:${API_CONFIG.ADMIN_PASS}`);
            const response = await fetch(`${API_CONFIG.API_BASE_URL}/api/admin/stats`, {
                headers: {
                    'Authorization': `Basic ${credentials}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch stats');
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
};

// Expose globally
window.SafarAPI = SafarAPI;
window.API_CONFIG = API_CONFIG;
