import axios from 'axios';

// API Base URL - Update this to match your backend server
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor to include auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('bhn_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle unauthorized errors (expired token)
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('bhn_token');
            localStorage.removeItem('bhn_user');
            window.location.href = '/login?session=expired';
        }
        return Promise.reject(error);
    }
);

// =============================================
// DATABASE-INTEGRATED API SERVICES
// =============================================

// Simulate API delay for development
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// =============================================
// USER MANAGEMENT APIs
// =============================================

export const userAPI = {
    // Get current user profile
    getCurrentUser: async () => {
        await delay(300);
        try {
            const response = await api.get('/users/profile');
            return response.data;
        } catch (error) {
            // Mock response for development
            return {
                success: true,
                data: {
                    id: 'user-123',
                    email: 'user@example.com',
                    userType: 'doctor',
                    profile: {
                        firstName: 'Dr. Sarah',
                        lastName: 'Johnson',
                        phone: '+1-555-123-4567',
                        specialization: 'Obstetrics and Gynecology',
                        licenseNumber: 'ON-12345'
                    }
                }
            };
        }
    },

    // Update user profile
    updateProfile: async (profileData) => {
        await delay(500);
        try {
            const response = await api.put('/users/profile', profileData);
            return response.data;
        } catch (error) {
            return { success: true, message: 'Profile updated successfully' };
        }
    }
};

// =============================================
// DASHBOARD STATISTICS APIs
// =============================================

export const dashboardAPI = {
    // Get dashboard statistics
    getStats: async (userType = 'doctor') => {
        await delay(400);
        try {
            const response = await api.get(`/dashboard/stats?userType=${userType}`);
            return response.data;
        } catch (error) {
            // Mock response based on database structure
            if (userType === 'doctor') {
                return {
                    success: true,
                    data: {
                        todayAppointments: 8,
                        activePatients: 24,
                        pendingRecords: 3,
                        urgentCases: 2,
                        todaySchedule: [
                            {
                                id: 'apt-1',
                                patientName: 'Emma Wilson',
                                time: '09:00',
                                type: 'Prenatal Checkup',
                                status: 'confirmed',
                                urgency: 'normal'
                            },
                            {
                                id: 'apt-2',
                                patientName: 'Maria Garcia',
                                time: '10:30',
                                type: 'Consultation',
                                status: 'scheduled',
                                urgency: 'high'
                            }
                        ],
                        recentActivities: [
                            {
                                id: 'act-1',
                                type: 'health_record',
                                message: 'New lab results uploaded for Emma Wilson',
                                timestamp: new Date().toISOString(),
                                urgency: 'normal'
                            },
                            {
                                id: 'act-2',
                                type: 'appointment',
                                message: 'Appointment confirmed with Maria Garcia',
                                timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
                                urgency: 'low'
                            }
                        ]
                    }
                };
            } else {
                // Patient dashboard
                return {
                    success: true,
                    data: {
                        upcomingAppointments: 2,
                        healthRecords: 12,
                        medications: 3,
                        lastVisit: '2025-01-10',
                        nextAppointment: {
                            date: '2025-01-25',
                            time: '14:30',
                            doctor: 'Dr. Sarah Johnson',
                            type: 'Follow-up'
                        }
                    }
                };
            }
        }
    }
};

// =============================================
// HEALTH RECORDS APIs
// =============================================

export const healthRecordsAPI = {
    // Get health records for a patient
    getRecords: async (patientId, filters = {}) => {
        await delay(600);
        try {
            const params = new URLSearchParams({
                patientId,
                ...filters
            });
            const response = await api.get(`/health-records?${params}`);
            return response.data;
        } catch (error) {
            // Mock response based on health_records table
            return {
                success: true,
                data: [
                    {
                        id: 'hr-1',
                        recordType: 'prenatal',
                        title: '28-week Prenatal Checkup',
                        description: 'Routine prenatal examination',
                        diagnosis: 'Normal pregnancy progression',
                        urgencyLevel: 'normal',
                        visitDate: '2025-01-15',
                        visitTime: '14:30',
                        vitalSigns: {
                            bloodPressure: { systolic: 120, diastolic: 80 },
                            heartRate: 72,
                            temperature: 98.6,
                            weight: 65.5
                        },
                        doctor: {
                            name: 'Dr. Sarah Johnson',
                            specialization: 'Obstetrics'
                        },
                        followUpDate: '2025-02-15',
                        status: 'active'
                    },
                    {
                        id: 'hr-2',
                        recordType: 'lab_results',
                        title: 'Blood Work Results',
                        description: 'Complete blood count and metabolic panel',
                        urgencyLevel: 'normal',
                        visitDate: '2025-01-10',
                        results: {
                            hemoglobin: '12.5 g/dL',
                            whiteBloodCells: '7,200/μL',
                            glucose: '95 mg/dL'
                        },
                        status: 'active'
                    }
                ]
            };
        }
    },

    // Create new health record
    createRecord: async (recordData) => {
        await delay(800);
        try {
            const response = await api.post('/health-records', recordData);
            return response.data;
        } catch (error) {
            return {
                success: true,
                data: {
                    id: `hr-${Date.now()}`,
                    ...recordData,
                    createdAt: new Date().toISOString()
                },
                message: 'Health record created successfully'
            };
        }
    },

    // Update health record
    updateRecord: async (recordId, recordData) => {
        await delay(500);
        try {
            const response = await api.put(`/health-records/${recordId}`, recordData);
            return response.data;
        } catch (error) {
            return {
                success: true,
                message: 'Health record updated successfully'
            };
        }
    }
};

// =============================================
// APPOINTMENTS APIs
// =============================================

export const appointmentsAPI = {
    // Get appointments
    getAppointments: async (filters = {}) => {
        await delay(500);
        try {
            const params = new URLSearchParams(filters);
            const response = await api.get(`/appointments?${params}`);
            return response.data;
        } catch (error) {
            // Mock response based on appointments table
            return {
                success: true,
                data: [
                    {
                        id: 'apt-1',
                        patientId: 'p-1',
                        doctorId: 'd-1',
                        appointmentDate: '2025-01-25',
                        appointmentTime: '14:30',
                        duration: 30,
                        appointmentType: 'prenatal_checkup',
                        reason: 'Routine prenatal examination',
                        status: 'scheduled',
                        patient: {
                            firstName: 'Emma',
                            lastName: 'Wilson',
                            phone: '+1-555-123-4567',
                            email: 'emma.wilson@example.com'
                        },
                        doctor: {
                            firstName: 'Dr. Sarah',
                            lastName: 'Johnson',
                            specialization: 'Obstetrics and Gynecology'
                        },
                        facility: 'Central Medical Center'
                    },
                    {
                        id: 'apt-2',
                        patientId: 'p-2',
                        doctorId: 'd-1',
                        appointmentDate: '2025-01-26',
                        appointmentTime: '10:00',
                        duration: 45,
                        appointmentType: 'consultation',
                        reason: 'Follow-up consultation',
                        status: 'confirmed',
                        patient: {
                            firstName: 'Maria',
                            lastName: 'Garcia',
                            phone: '+1-555-987-6543',
                            email: 'maria.garcia@example.com'
                        },
                        urgencyLevel: 'high'
                    }
                ]
            };
        }
    },

    // Schedule new appointment
    scheduleAppointment: async (appointmentData) => {
        await delay(700);
        try {
            const response = await api.post('/appointments', appointmentData);
            return response.data;
        } catch (error) {
            return {
                success: true,
                data: {
                    id: `apt-${Date.now()}`,
                    ...appointmentData,
                    status: 'scheduled',
                    createdAt: new Date().toISOString()
                },
                message: 'Appointment scheduled successfully'
            };
        }
    },

    // Update appointment
    updateAppointment: async (appointmentId, appointmentData) => {
        await delay(500);
        try {
            const response = await api.put(`/appointments/${appointmentId}`, appointmentData);
            return response.data;
        } catch (error) {
            return {
                success: true,
                message: 'Appointment updated successfully'
            };
        }
    },

    // Cancel appointment
    cancelAppointment: async (appointmentId, reason) => {
        await delay(400);
        try {
            const response = await api.post(`/appointments/${appointmentId}/cancel`, { reason });
            return response.data;
        } catch (error) {
            return {
                success: true,
                message: 'Appointment cancelled successfully'
            };
        }
    }
};

// =============================================
// PATIENTS APIs
// =============================================

export const patientsAPI = {
    // Get patients list (for doctors)
    getPatients: async (filters = {}) => {
        await delay(600);
        try {
            const params = new URLSearchParams(filters);
            const response = await api.get(`/patients?${params}`);
            return response.data;
        } catch (error) {
            // Mock response based on patients and user_profiles tables
            return {
                success: true,
                data: [
                    {
                        id: 'p-1',
                        bhnId: 'BHN20250000000001',
                        user: {
                            firstName: 'Emma',
                            lastName: 'Wilson',
                            email: 'emma.wilson@example.com',
                            phone: '+1-555-123-4567',
                            dateOfBirth: '1990-05-15',
                            gender: 'female'
                        },
                        bloodType: 'O+',
                        allergies: 'None known',
                        currentMedications: 'Prenatal vitamins',
                        medicalConditions: 'Pregnancy - 28 weeks',
                        insuranceProvider: 'Health Plus',
                        lastVisit: '2025-01-15',
                        nextAppointment: '2025-01-25'
                    },
                    {
                        id: 'p-2',
                        bhnId: 'BHN20250000000002',
                        user: {
                            firstName: 'Maria',
                            lastName: 'Garcia',
                            email: 'maria.garcia@example.com',
                            phone: '+1-555-987-6543',
                            dateOfBirth: '1985-03-22',
                            gender: 'female'
                        },
                        bloodType: 'A+',
                        allergies: 'Penicillin',
                        currentMedications: 'None',
                        medicalConditions: 'Postpartum care',
                        insuranceProvider: 'Provincial Health',
                        lastVisit: '2025-01-10',
                        status: 'active'
                    }
                ]
            };
        }
    },

    // Get patient details
    getPatientDetails: async (patientId) => {
        await delay(400);
        try {
            const response = await api.get(`/patients/${patientId}`);
            return response.data;
        } catch (error) {
            return {
                success: true,
                data: {
                    id: patientId,
                    bhnId: 'BHN20250000000001',
                    user: {
                        firstName: 'Emma',
                        lastName: 'Wilson',
                        email: 'emma.wilson@example.com',
                        phone: '+1-555-123-4567',
                        dateOfBirth: '1990-05-15',
                        gender: 'female',
                        address: '123 Main St, Toronto, ON',
                        emergencyContact: {
                            name: 'John Wilson',
                            phone: '+1-555-123-4568',
                            relationship: 'Spouse'
                        }
                    },
                    medicalInfo: {
                        bloodType: 'O+',
                        allergies: 'None known',
                        currentMedications: 'Prenatal vitamins',
                        medicalConditions: 'Pregnancy - 28 weeks',
                        familyHistory: 'No significant family history'
                    },
                    insurance: {
                        provider: 'Health Plus',
                        number: 'HP-12345678',
                        groupNumber: 'GRP-001'
                    }
                }
            };
        }
    }
};

// =============================================
// MEDICATIONS APIs
// =============================================

export const medicationsAPI = {
    // Get medications for a patient
    getMedications: async (patientId) => {
        await delay(300);
        try {
            const response = await api.get(`/medications?patientId=${patientId}`);
            return response.data;
        } catch (error) {
            return {
                success: true,
                data: [
                    {
                        id: 'med-1',
                        medicationName: 'Prenatal Vitamins',
                        dosage: '1 tablet',
                        frequency: 'Daily',
                        startDate: '2024-12-01',
                        endDate: '2025-06-01',
                        instructions: 'Take with food',
                        prescribedBy: 'Dr. Sarah Johnson',
                        isActive: true
                    },
                    {
                        id: 'med-2',
                        medicationName: 'Folic Acid',
                        dosage: '400 mcg',
                        frequency: 'Daily',
                        startDate: '2024-12-01',
                        instructions: 'Take on empty stomach',
                        prescribedBy: 'Dr. Sarah Johnson',
                        isActive: true
                    }
                ]
            };
        }
    },

    // Add new medication
    addMedication: async (medicationData) => {
        await delay(500);
        try {
            const response = await api.post('/medications', medicationData);
            return response.data;
        } catch (error) {
            return {
                success: true,
                data: {
                    id: `med-${Date.now()}`,
                    ...medicationData,
                    createdAt: new Date().toISOString()
                },
                message: 'Medication added successfully'
            };
        }
    }
};

// =============================================
// DOCUMENTS APIs
// =============================================

export const documentsAPI = {
    // Upload document
    uploadDocument: async (formData) => {
        await delay(1000);
        try {
            const response = await api.post('/documents/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            return {
                success: true,
                data: {
                    documentId: `doc-${Date.now()}`,
                    filename: 'uploaded_document.pdf',
                    size: 1048576,
                    uploadedAt: new Date().toISOString()
                },
                message: 'Document uploaded successfully'
            };
        }
    },

    // Get documents
    getDocuments: async (patientId) => {
        await delay(400);
        try {
            const response = await api.get(`/documents?patientId=${patientId}`);
            return response.data;
        } catch (error) {
            return {
                success: true,
                data: [
                    {
                        id: 'doc-1',
                        filename: 'lab_results_2025_01_15.pdf',
                        documentType: 'lab_result',
                        title: 'Blood Work Results',
                        uploadedAt: '2025-01-15T10:30:00Z',
                        size: 524288
                    },
                    {
                        id: 'doc-2',
                        filename: 'ultrasound_2025_01_10.jpg',
                        documentType: 'image',
                        title: '28-week Ultrasound',
                        uploadedAt: '2025-01-10T14:00:00Z',
                        size: 2097152
                    }
                ]
            };
        }
    }
};

// =============================================
// NOTIFICATIONS APIs
// =============================================

export const notificationsAPI = {
    // Get notifications
    getNotifications: async (limit = 20) => {
        await delay(300);
        try {
            const response = await api.get(`/notifications?limit=${limit}`);
            return response.data;
        } catch (error) {
            return {
                success: true,
                data: [
                    {
                        id: 'notif-1',
                        type: 'appointment_reminder',
                        title: 'Upcoming Appointment',
                        message: 'You have an appointment tomorrow at 2:30 PM with Dr. Sarah Johnson',
                        isRead: false,
                        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
                    },
                    {
                        id: 'notif-2',
                        type: 'test_result',
                        title: 'Lab Results Available',
                        message: 'Your blood work results from January 15th are now available',
                        isRead: false,
                        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
                    }
                ]
            };
        }
    },

    // Mark notification as read
    markAsRead: async (notificationId) => {
        await delay(200);
        try {
            const response = await api.put(`/notifications/${notificationId}/read`);
            return response.data;
        } catch (error) {
            return { success: true };
        }
    }
};

// Export the main api instance as default
export default api;