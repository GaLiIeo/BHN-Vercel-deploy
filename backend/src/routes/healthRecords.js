const express = require('express');
const router = express.Router();
const { body, query } = require('express-validator');
const { authenticate, authorize } = require('../middleware/auth');
const {
    getRecords,
    createRecord,
    updateRecord,
    getVitalSignsTrends
} = require('../controllers/healthRecordsController');

// Validation middleware
const validateRecordCreation = [
    body('patientId')
        .isUUID()
        .withMessage('Valid patient ID is required'),
    body('recordType')
        .isIn(['vital_signs', 'lab_results', 'vaccination', 'prenatal', 'consultation', 'mental_health', 'physical_therapy', 'nutrition', 'birth_record', 'emergency'])
        .withMessage('Valid record type is required'),
    body('title')
        .trim()
        .isLength({ min: 1, max: 255 })
        .withMessage('Title is required and must be less than 255 characters'),
    body('visitDate')
        .isISO8601()
        .withMessage('Valid visit date is required'),
    body('urgencyLevel')
        .optional()
        .isIn(['low', 'normal', 'high', 'urgent', 'critical'])
        .withMessage('Invalid urgency level'),
    body('vitalSigns.bloodPressure.systolic')
        .optional()
        .isInt({ min: 50, max: 300 })
        .withMessage('Systolic blood pressure must be between 50-300'),
    body('vitalSigns.bloodPressure.diastolic')
        .optional()
        .isInt({ min: 30, max: 200 })
        .withMessage('Diastolic blood pressure must be between 30-200'),
    body('vitalSigns.heartRate')
        .optional()
        .isInt({ min: 30, max: 300 })
        .withMessage('Heart rate must be between 30-300'),
    body('vitalSigns.temperature')
        .optional()
        .isFloat({ min: 30, max: 45 })
        .withMessage('Temperature must be between 30-45°C'),
    body('vitalSigns.weight')
        .optional()
        .isFloat({ min: 0.5, max: 1000 })
        .withMessage('Weight must be between 0.5-1000 kg'),
    body('vitalSigns.height')
        .optional()
        .isInt({ min: 30, max: 300 })
        .withMessage('Height must be between 30-300 cm'),
    body('vitalSigns.oxygenSaturation')
        .optional()
        .isInt({ min: 50, max: 100 })
        .withMessage('Oxygen saturation must be between 50-100%'),
    body('medications')
        .optional()
        .isArray()
        .withMessage('Medications must be an array'),
    body('medications.*.name')
        .optional()
        .trim()
        .isLength({ min: 1, max: 255 })
        .withMessage('Medication name is required'),
    body('medications.*.dosage')
        .optional()
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Medication dosage is required'),
    body('medications.*.frequency')
        .optional()
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Medication frequency is required')
];

const validateRecordQuery = [
    query('bhnId')
        .optional()
        .matches(/^BHN-\d{4}-\d{3,6}$/)
        .withMessage('Invalid BHN ID format'),
    query('patientId')
        .optional()
        .isUUID()
        .withMessage('Invalid patient ID format'),
    query('recordType')
        .optional()
        .isIn(['vital_signs', 'lab_results', 'vaccination', 'prenatal', 'consultation', 'mental_health', 'physical_therapy', 'nutrition', 'birth_record', 'emergency'])
        .withMessage('Invalid record type'),
    query('urgencyLevel')
        .optional()
        .isIn(['low', 'normal', 'high', 'urgent', 'critical'])
        .withMessage('Invalid urgency level'),
    query('startDate')
        .optional()
        .isISO8601()
        .withMessage('Invalid start date format'),
    query('endDate')
        .optional()
        .isISO8601()
        .withMessage('Invalid end date format'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1-100'),
    query('offset')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Offset must be non-negative')
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
 * @route   GET /api/health-records
 * @desc    Get health records with HIPAA/PIPEDA compliance
 * @access  Private
 */
router.get('/',
    authenticate,
    validateRecordQuery,
    handleValidationErrors,
    getRecords
);

/**
 * @route   POST /api/health-records
 * @desc    Create comprehensive health record
 * @access  Private (Healthcare providers and patients)
 */
router.post('/',
    authenticate,
    authorize(['doctor', 'nurse', 'provider', 'patient']),
    validateRecordCreation,
    handleValidationErrors,
    createRecord
);

/**
 * @route   PUT /api/health-records/:id
 * @desc    Update health record
 * @access  Private (Healthcare providers and record owner)
 */
router.put('/:id',
    authenticate,
    authorize(['doctor', 'nurse', 'provider', 'patient']),
    updateRecord
);

/**
 * @route   GET /api/health-records/trends
 * @desc    Get vital signs trends for a patient
 * @access  Private
 */
router.get('/trends',
    authenticate,
    query('patientId').isUUID().withMessage('Valid patient ID is required'),
    query('days').optional().isInt({ min: 1, max: 365 }).withMessage('Days must be between 1-365'),
    handleValidationErrors,
    getVitalSignsTrends
);

/**
 * @route   GET /api/health-records/search
 * @desc    Search health records by BHN ID (HIPAA/PIPEDA compliant)
 * @access  Private
 */
router.get('/search',
    authenticate,
    query('bhnId').matches(/^BHN\d{14}$/).withMessage('Valid 14-digit BHN ID is required'),
    handleValidationErrors,
    (req, res, next) => {
        // Set the bhnId in query for the getRecords function
        req.query.bhnId = req.query.bhnId;
        next();
    },
    getRecords
);

/**
 * @route   GET /api/health-records/types
 * @desc    Get available record types
 * @access  Private
 */
router.get('/types', authenticate, (req, res) => {
    const recordTypes = [
        { value: 'vital_signs', label: 'Vital Signs' },
        { value: 'lab_results', label: 'Laboratory Results' },
        { value: 'vaccination', label: 'Vaccination' },
        { value: 'prenatal', label: 'Prenatal Care' },
        { value: 'consultation', label: 'Consultation' },
        { value: 'mental_health', label: 'Mental Health' },
        { value: 'physical_therapy', label: 'Physical Therapy' },
        { value: 'nutrition', label: 'Nutrition' },
        { value: 'birth_record', label: 'Birth Record' },
        { value: 'emergency', label: 'Emergency' }
    ];

    res.json({
        success: true,
        data: recordTypes
    });
});

/**
 * @route   GET /api/health-records/urgency-levels
 * @desc    Get available urgency levels
 * @access  Private
 */
router.get('/urgency-levels', authenticate, (req, res) => {
    const urgencyLevels = [
        { value: 'low', label: 'Low Priority', color: '#4CAF50' },
        { value: 'normal', label: 'Normal', color: '#2196F3' },
        { value: 'high', label: 'High Priority', color: '#FF9800' },
        { value: 'urgent', label: 'Urgent', color: '#F44336' },
        { value: 'critical', label: 'Critical', color: '#9C27B0' }
    ];

    res.json({
        success: true,
        data: urgencyLevels
    });
});

module.exports = router;