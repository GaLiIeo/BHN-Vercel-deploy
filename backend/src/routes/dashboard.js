const express = require('express');
const router = express.Router();
const { query } = require('express-validator');
const { authenticate, authorize } = require('../middleware/auth');
const {
    getDashboardData,
    getPatientsList,
    getSystemStats
} = require('../controllers/dashboardController');

// Validation middleware
const validatePatientsQuery = [
    query('limit')
        .optional()
        .isInt({ min: 1, max: 500 })
        .withMessage('Limit must be between 1-500'),
    query('offset')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Offset must be non-negative'),
    query('search')
        .optional()
        .isLength({ min: 2, max: 100 })
        .withMessage('Search term must be 2-100 characters')
];

// Validation error handler
const handleValidationErrors = (req, res, next) => {
    const { validationResult } = require('express-validator');
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array(),
            code: 'VALIDATION_ERROR'
        });
    }

    next();
};

// Routes
/**
 * @route   GET /api/dashboard
 * @desc    Get comprehensive dashboard data
 * @access  Private
 */
router.get('/',
    authenticate,
    getDashboardData
);

/**
 * @route   GET /api/dashboard/patients
 * @desc    Get patients list for healthcare providers
 * @access  Private (Healthcare providers only)
 */
router.get('/patients',
    authenticate,
    authorize(['doctor', 'nurse', 'provider', 'admin']),
    validatePatientsQuery,
    handleValidationErrors,
    getPatientsList
);

/**
 * @route   GET /api/dashboard/stats
 * @desc    Get system statistics
 * @access  Private (Admin only)
 */
router.get('/stats',
    authenticate,
    authorize(['admin']),
    getSystemStats
);

/**
 * @route   GET /api/dashboard/quick-stats
 * @desc    Get quick statistics for any authenticated user
 * @access  Private
 */
router.get('/quick-stats', authenticate, async (req, res, next) => {
    try {
        const userType = req.userType;
        const userId = req.userId;

        let stats = {};

        if (userType === 'doctor' || userType === 'provider') {
            const { Doctor, Patient, Appointment, HealthRecord } = require('../models');

            const doctor = await Doctor.findOne({ where: { user_id: userId } });
            if (doctor) {
                const today = new Date();
                const todayStart = new Date(today.setHours(0, 0, 0, 0));
                const todayEnd = new Date(today.setHours(23, 59, 59, 999));

                stats = {
                    totalPatients: await Patient.count({ where: { primary_doctor_id: doctor.id } }),
                    todayAppointments: await Appointment.count({
                        where: {
                            doctor_id: doctor.id,
                            appointment_date: { [require('sequelize').Op.between]: [todayStart, todayEnd] }
                        }
                    }),
                    recentRecords: await HealthRecord.count({
                        where: {
                            doctor_id: doctor.id,
                            created_at: { [require('sequelize').Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
                        }
                    })
                };
            }
        } else if (userType === 'patient') {
            const { Patient, Appointment, HealthRecord, Medication } = require('../models');

            const patient = await Patient.findOne({ where: { user_id: userId } });
            if (patient) {
                stats = {
                    totalRecords: await HealthRecord.count({ where: { patient_id: patient.id } }),
                    upcomingAppointments: await Appointment.count({
                        where: {
                            patient_id: patient.id,
                            appointment_date: { [require('sequelize').Op.gte]: new Date() }
                        }
                    }),
                    activeMedications: await Medication.count({
                        where: { patient_id: patient.id, is_active: true }
                    })
                };
            }
        }

        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;