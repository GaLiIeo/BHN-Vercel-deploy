// Configuration for Birth Health Network Frontend
const config = {
    apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
    appName: process.env.REACT_APP_APP_NAME || 'Birth Health Network',
    version: process.env.REACT_APP_VERSION || '1.0.0',
    production: process.env.NODE_ENV === 'production',

    // API endpoints
    endpoints: {
        auth: '/auth',
        dashboard: '/dashboard',
        healthRecords: '/health-records',
        appointments: '/appointments',
        patients: '/patients',
        doctors: '/doctors',
        documents: '/documents',
        birthRegistrations: '/birth-registrations',
    },

    // UI Configuration
    ui: {
        sidebarWidth: 280,
        headerHeight: 64,
        maxFileSize: 10 * 1024 * 1024, // 10MB
    },

    // Feature flags
    features: {
        enableDocumentUpload: true,
        enableAdvancedSearch: true,
        enableNotifications: true,
    }
};

export default config;
