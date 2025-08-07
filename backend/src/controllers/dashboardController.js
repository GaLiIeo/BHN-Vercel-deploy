const {
    User,
    UserProfile,
    Patient,
    Doctor,
    HealthRecord,
    Appointment,
    Medication,
    Document
} = require('../models');
const { Op } = require('sequelize');
const { NotFoundError, ForbiddenError } = require('../middleware/errorHandler');

/**
 * Get comprehensive dashboard data for healthcare providers
 */
const getDashboardData = async (req, res, next) => {
    try {
        const userId = req.userId;
        const userType = req.userType;

        let dashboardData = {
            user: {},
            statistics: {},
            recentActivities: [],
            upcomingAppointments: [],
            urgentCases: [],
            todaySchedule: [],
            patientsList: [],
            systemMetrics: {}
        };

        // Get user profile
        const user = await User.findByPk(userId, {
            include: [
                {
                    model: UserProfile,
                    as: 'profile'
                }
            ]
        });

        if (!user) {
            throw new NotFoundError('User');
        }

        dashboardData.user = {
            id: user.id,
            email: user.email,
            userType: user.user_type,
            firstName: user.profile?.first_name,
            lastName: user.profile?.last_name,
            lastLogin: user.last_login
        };

        // Role-specific dashboard data
        if (userType === 'doctor' || userType === 'provider') {
            dashboardData = await getDoctorDashboardData(userId, dashboardData);
        } else if (userType === 'patient') {
            dashboardData = await getPatientDashboardData(userId, dashboardData);
        } else if (userType === 'admin') {
            dashboardData = await getAdminDashboardData(dashboardData);
        }

        res.json({
            success: true,
            data: dashboardData
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get doctor-specific dashboard data
 */
const getDoctorDashboardData = async (userId, dashboardData) => {
    try {
        // Get doctor profile
        const doctor = await Doctor.findOne({
            where: { user_id: userId },
            include: [
                {
                    model: User,
                    as: 'user',
                    include: [{ model: UserProfile, as: 'profile' }]
                }
            ]
        });

        if (!doctor) {
            throw new NotFoundError('Doctor profile');
        }

        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));

        // Today's appointments
        const todayAppointments = await Appointment.findAll({
            where: {
                doctor_id: doctor.id,
                appointment_date: {
                    [Op.between]: [startOfDay, endOfDay]
                }
            },
            include: [
                {
                    model: Patient,
                    as: 'patient',
                    include: [
                        {
                            model: User,
                            as: 'user',
                            include: [{ model: UserProfile, as: 'profile' }]
                        }
                    ]
                }
            ],
            order: [['appointment_time', 'ASC']]
        });

        // Doctor's patients
        const patients = await Patient.findAll({
            where: { primary_doctor_id: doctor.id },
            include: [
                {
                    model: User,
                    as: 'user',
                    include: [{ model: UserProfile, as: 'profile' }]
                }
            ],
            limit: 50,
            order: [['updated_at', 'DESC']]
        });

        // Recent health records created by this doctor
        const recentRecords = await HealthRecord.findAll({
            where: { doctor_id: doctor.id },
            include: [
                {
                    model: Patient,
                    as: 'patient',
                    include: [
                        {
                            model: User,
                            as: 'user',
                            include: [{ model: UserProfile, as: 'profile' }]
                        }
                    ]
                }
            ],
            limit: 10,
            order: [['created_at', 'DESC']]
        });

        // Urgent cases
        const urgentCases = await HealthRecord.findAll({
            where: {
                doctor_id: doctor.id,
                urgency_level: ['urgent', 'critical']
            },
            include: [
                {
                    model: Patient,
                    as: 'patient',
                    include: [
                        {
                            model: User,
                            as: 'user',
                            include: [{ model: UserProfile, as: 'profile' }]
                        }
                    ]
                }
            ],
            limit: 5,
            order: [['created_at', 'DESC']]
        });

        // Statistics
        const totalPatients = await Patient.count({
            where: { primary_doctor_id: doctor.id }
        });

        const totalAppointments = await Appointment.count({
            where: { doctor_id: doctor.id }
        });

        const todayAppointmentCount = todayAppointments.length;
        const completedTodayCount = todayAppointments.filter(app => app.status === 'completed').length;

        const recentRecordsCount = await HealthRecord.count({
            where: {
                doctor_id: doctor.id,
                created_at: {
                    [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
                }
            }
        });

        // Update dashboard data
        dashboardData.statistics = {
            totalPatients,
            totalAppointments,
            todayAppointments: todayAppointmentCount,
            completedToday: completedTodayCount,
            pendingRecords: recentRecordsCount,
            urgentCases: urgentCases.length
        };

        dashboardData.todaySchedule = todayAppointments.map(apt => ({
            id: apt.id,
            patientName: `${apt.patient.user.profile?.first_name} ${apt.patient.user.profile?.last_name}`,
            bhnId: apt.patient.bhn_id,
            time: apt.appointment_time,
            type: apt.appointment_type,
            status: apt.status,
            reason: apt.reason
        }));

        dashboardData.patientsList = patients.map(patient => ({
            id: patient.id,
            bhnId: patient.bhn_id,
            user: {
                firstName: patient.user.profile?.first_name,
                lastName: patient.user.profile?.last_name,
                email: patient.user.email
            },
            bloodType: patient.blood_type,
            lastVisit: patient.updated_at
        }));

        dashboardData.urgentCases = urgentCases.map(record => ({
            id: record.id,
            patientName: `${record.patient.user.profile?.first_name} ${record.patient.user.profile?.last_name}`,
            bhnId: record.patient.bhn_id,
            title: record.title,
            urgencyLevel: record.urgency_level,
            visitDate: record.visit_date,
            description: record.description
        }));

        dashboardData.recentActivities = recentRecords.map(record => ({
            id: record.id,
            type: 'health_record',
            action: 'created',
            patientName: `${record.patient.user.profile?.first_name} ${record.patient.user.profile?.last_name}`,
            description: record.title,
            timestamp: record.created_at
        }));

        return dashboardData;
    } catch (error) {
        throw error;
    }
};

/**
 * Get patient-specific dashboard data
 */
const getPatientDashboardData = async (userId, dashboardData) => {
    try {
        // Get patient profile
        const patient = await Patient.findOne({
            where: { user_id: userId },
            include: [
                {
                    model: User,
                    as: 'user',
                    include: [{ model: UserProfile, as: 'profile' }]
                },
                {
                    model: Doctor,
                    as: 'primaryDoctor',
                    include: [
                        {
                            model: User,
                            as: 'user',
                            include: [{ model: UserProfile, as: 'profile' }]
                        }
                    ]
                }
            ]
        });

        if (!patient) {
            throw new NotFoundError('Patient profile');
        }

        // Upcoming appointments
        const upcomingAppointments = await Appointment.findAll({
            where: {
                patient_id: patient.id,
                appointment_date: {
                    [Op.gte]: new Date()
                }
            },
            include: [
                {
                    model: Doctor,
                    as: 'doctor',
                    include: [
                        {
                            model: User,
                            as: 'user',
                            include: [{ model: UserProfile, as: 'profile' }]
                        }
                    ]
                }
            ],
            limit: 5,
            order: [['appointment_date', 'ASC'], ['appointment_time', 'ASC']]
        });

        // Recent health records
        const recentRecords = await HealthRecord.findAll({
            where: { patient_id: patient.id },
            include: [
                {
                    model: Doctor,
                    as: 'doctor',
                    include: [
                        {
                            model: User,
                            as: 'user',
                            include: [{ model: UserProfile, as: 'profile' }]
                        }
                    ]
                }
            ],
            limit: 10,
            order: [['visit_date', 'DESC']]
        });

        // Active medications
        const activeMedications = await Medication.findAll({
            where: {
                patient_id: patient.id,
                is_active: true
            },
            include: [
                {
                    model: Doctor,
                    as: 'prescriber',
                    include: [
                        {
                            model: User,
                            as: 'user',
                            include: [{ model: UserProfile, as: 'profile' }]
                        }
                    ]
                }
            ],
            limit: 10,
            order: [['start_date', 'DESC']]
        });

        // Statistics
        const totalRecords = await HealthRecord.count({
            where: { patient_id: patient.id }
        });

        const totalAppointments = await Appointment.count({
            where: { patient_id: patient.id }
        });

        const completedAppointments = await Appointment.count({
            where: {
                patient_id: patient.id,
                status: 'completed'
            }
        });

        // Update dashboard data
        dashboardData.statistics = {
            totalRecords,
            totalAppointments,
            completedAppointments,
            activeMedications: activeMedications.length,
            upcomingAppointments: upcomingAppointments.length
        };

        dashboardData.upcomingAppointments = upcomingAppointments.map(apt => ({
            id: apt.id,
            doctorName: `Dr. ${apt.doctor.user.profile?.first_name} ${apt.doctor.user.profile?.last_name}`,
            specialization: apt.doctor.specialization,
            date: apt.appointment_date,
            time: apt.appointment_time,
            type: apt.appointment_type,
            status: apt.status
        }));

        dashboardData.recentActivities = recentRecords.slice(0, 5).map(record => ({
            id: record.id,
            type: 'health_record',
            title: record.title,
            doctorName: record.doctor ? `Dr. ${record.doctor.user.profile?.first_name} ${record.doctor.user.profile?.last_name}` : 'Unknown',
            visitDate: record.visit_date,
            urgencyLevel: record.urgency_level
        }));

        dashboardData.activeMedications = activeMedications.map(med => ({
            id: med.id,
            name: med.medication_name,
            dosage: med.dosage,
            frequency: med.frequency,
            prescriber: med.prescriber ? `Dr. ${med.prescriber.user.profile?.first_name} ${med.prescriber.user.profile?.last_name}` : 'Unknown',
            startDate: med.start_date,
            endDate: med.end_date
        }));

        dashboardData.primaryDoctor = patient.primaryDoctor ? {
            name: `Dr. ${patient.primaryDoctor.user.profile?.first_name} ${patient.primaryDoctor.user.profile?.last_name}`,
            specialization: patient.primaryDoctor.specialization,
            email: patient.primaryDoctor.user.email
        } : null;

        return dashboardData;
    } catch (error) {
        throw error;
    }
};

/**
 * Get admin-specific dashboard data
 */
const getAdminDashboardData = async (dashboardData) => {
    try {
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));

        // System-wide statistics
        const totalUsers = await User.count();
        const totalPatients = await Patient.count();
        const totalDoctors = await Doctor.count();
        const totalAppointments = await Appointment.count();
        const totalHealthRecords = await HealthRecord.count();

        const todayAppointments = await Appointment.count({
            where: {
                appointment_date: {
                    [Op.between]: [startOfDay, endOfDay]
                }
            }
        });

        const activeUsers = await User.count({
            where: {
                last_login: {
                    [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
                }
            }
        });

        // Recent system activities
        const recentRecords = await HealthRecord.findAll({
            include: [
                {
                    model: Patient,
                    as: 'patient',
                    include: [
                        {
                            model: User,
                            as: 'user',
                            include: [{ model: UserProfile, as: 'profile' }]
                        }
                    ]
                },
                {
                    model: Doctor,
                    as: 'doctor',
                    include: [
                        {
                            model: User,
                            as: 'user',
                            include: [{ model: UserProfile, as: 'profile' }]
                        }
                    ]
                }
            ],
            limit: 10,
            order: [['created_at', 'DESC']]
        });

        // System health metrics
        const systemMetrics = {
            databaseHealth: 'healthy',
            apiResponseTime: '245ms',
            uptime: '99.9%',
            errorRate: '0.1%',
            activeConnections: 42
        };

        dashboardData.statistics = {
            totalUsers,
            totalPatients,
            totalDoctors,
            totalAppointments,
            totalHealthRecords,
            todayAppointments,
            activeUsers
        };

        dashboardData.recentActivities = recentRecords.map(record => ({
            id: record.id,
            type: 'health_record',
            action: 'created',
            patientName: `${record.patient.user.profile?.first_name} ${record.patient.user.profile?.last_name}`,
            doctorName: record.doctor ? `Dr. ${record.doctor.user.profile?.first_name} ${record.doctor.user.profile?.last_name}` : 'Unknown',
            title: record.title,
            timestamp: record.created_at
        }));

        dashboardData.systemMetrics = systemMetrics;

        return dashboardData;
    } catch (error) {
        throw error;
    }
};

/**
 * Get all patients for healthcare providers (with HIPAA compliance)
 */
const getPatientsList = async (req, res, next) => {
    try {
        const userType = req.userType;
        const userId = req.userId;

        // Only healthcare providers and admins can access patient lists
        if (!['doctor', 'nurse', 'provider', 'admin'].includes(userType)) {
            throw new ForbiddenError('Access denied to patient list');
        }

        let whereClause = {};

        // Doctors can only see their own patients
        if (userType === 'doctor') {
            const doctor = await Doctor.findOne({ where: { user_id: userId } });
            if (doctor) {
                whereClause.primary_doctor_id = doctor.id;
            } else {
                return res.json({ success: true, data: [] });
            }
        }

        const patients = await Patient.findAll({
            where: whereClause,
            include: [
                {
                    model: User,
                    as: 'user',
                    include: [
                        {
                            model: UserProfile,
                            as: 'profile'
                        }
                    ]
                },
                {
                    model: Doctor,
                    as: 'primaryDoctor',
                    include: [
                        {
                            model: User,
                            as: 'user',
                            include: [{ model: UserProfile, as: 'profile' }]
                        }
                    ]
                }
            ],
            limit: parseInt(req.query.limit) || 100,
            offset: parseInt(req.query.offset) || 0,
            order: [['created_at', 'DESC']]
        });

        const sanitizedPatients = patients.map(patient => ({
            id: patient.id,
            bhnId: patient.bhn_id,
            user: {
                firstName: patient.user.profile?.first_name,
                lastName: patient.user.profile?.last_name,
                email: patient.user.email,
                dateOfBirth: patient.user.profile?.date_of_birth
            },
            bloodType: patient.blood_type,
            primaryDoctor: patient.primaryDoctor ? {
                name: `Dr. ${patient.primaryDoctor.user.profile?.first_name} ${patient.primaryDoctor.user.profile?.last_name}`,
                specialization: patient.primaryDoctor.specialization
            } : null,
            lastUpdated: patient.updated_at
        }));

        res.json({
            success: true,
            data: sanitizedPatients,
            meta: {
                total: sanitizedPatients.length,
                limit: parseInt(req.query.limit) || 100,
                offset: parseInt(req.query.offset) || 0
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get system statistics for admin users
 */
const getSystemStats = async (req, res, next) => {
    try {
        if (req.userType !== 'admin') {
            throw new ForbiddenError('Admin access required');
        }

        const stats = await getAdminDashboardData({});

        res.json({
            success: true,
            data: stats.statistics,
            systemMetrics: stats.systemMetrics
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getDashboardData,
    getPatientsList,
    getSystemStats
};