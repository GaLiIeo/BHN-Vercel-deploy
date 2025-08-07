const express = require('express');
const router = express.Router();
const { body, query } = require('express-validator');
const { authenticate, authorize } = require('../middleware/auth');
const researchService = require('../utils/researchIntegration');

// Validation middleware
const validateResearchQuery = [
    query('query')
        .trim()
        .isLength({ min: 2, max: 200 })
        .withMessage('Query must be between 2-200 characters'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 50 })
        .withMessage('Limit must be between 1-50'),
    query('sort')
        .optional()
        .isIn(['relevance', 'date', 'citation'])
        .withMessage('Sort must be relevance, date, or citation')
];

const validateDrugInteractionCheck = [
    body('medications')
        .isArray({ min: 2, max: 20 })
        .withMessage('Must provide 2-20 medications'),
    body('medications.*')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Each medication must be 2-100 characters')
];

const validateComprehensiveResearch = [
    body('query')
        .trim()
        .isLength({ min: 2, max: 200 })
        .withMessage('Query must be between 2-200 characters'),
    body('patientContext')
        .optional()
        .isObject()
        .withMessage('Patient context must be an object'),
    body('medications')
        .optional()
        .isArray()
        .withMessage('Medications must be an array')
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
 * @route   GET /api/research/pubmed
 * @desc    Search PubMed for medical literature
 * @access  Private (Healthcare providers only)
 */
router.get('/pubmed',
    authenticate,
    authorize(['doctor', 'nurse', 'provider', 'admin']),
    validateResearchQuery,
    handleValidationErrors,
    async (req, res, next) => {
        try {
            const { query, limit, sort } = req.query;

            const results = await researchService.searchPubMed(query, {
                limit: parseInt(limit) || 10,
                sort: sort || 'relevance'
            });

            res.json({
                success: true,
                data: results,
                meta: {
                    query,
                    resultCount: results.length,
                    source: 'PubMed'
                }
            });
        } catch (error) {
            next(error);
        }
    }
);

/**
 * @route   GET /api/research/clinical-trials
 * @desc    Search clinical trials
 * @access  Private (Healthcare providers only)
 */
router.get('/clinical-trials',
    authenticate,
    authorize(['doctor', 'nurse', 'provider', 'admin']),
    validateResearchQuery,
    handleValidationErrors,
    async (req, res, next) => {
        try {
            const { query, limit } = req.query;

            const results = await researchService.searchClinicalTrials(query, {
                limit: parseInt(limit) || 10
            });

            res.json({
                success: true,
                data: results,
                meta: {
                    query,
                    resultCount: results.length,
                    source: 'ClinicalTrials.gov'
                }
            });
        } catch (error) {
            next(error);
        }
    }
);

/**
 * @route   GET /api/research/diagnostic-criteria/:condition
 * @desc    Get diagnostic criteria for a condition
 * @access  Private (Healthcare providers only)
 */
router.get('/diagnostic-criteria/:condition',
    authenticate,
    authorize(['doctor', 'nurse', 'provider', 'admin']),
    async (req, res, next) => {
        try {
            const { condition } = req.params;

            const criteria = await researchService.getDiagnosticCriteria(condition);

            if (!criteria) {
                return res.status(404).json({
                    success: false,
                    message: 'Diagnostic criteria not found for this condition',
                    code: 'CRITERIA_NOT_FOUND'
                });
            }

            res.json({
                success: true,
                data: criteria
            });
        } catch (error) {
            next(error);
        }
    }
);

/**
 * @route   GET /api/research/treatment-guidelines/:condition
 * @desc    Get treatment guidelines for a condition
 * @access  Private (Healthcare providers only)
 */
router.get('/treatment-guidelines/:condition',
    authenticate,
    authorize(['doctor', 'nurse', 'provider', 'admin']),
    async (req, res, next) => {
        try {
            const { condition } = req.params;
            const patientContext = req.query.patientContext ? JSON.parse(req.query.patientContext) : {};

            const guidelines = await researchService.getTreatmentGuidelines(condition, patientContext);

            if (!guidelines) {
                return res.status(404).json({
                    success: false,
                    message: 'Treatment guidelines not found for this condition',
                    code: 'GUIDELINES_NOT_FOUND'
                });
            }

            res.json({
                success: true,
                data: guidelines
            });
        } catch (error) {
            next(error);
        }
    }
);

/**
 * @route   POST /api/research/drug-interactions
 * @desc    Check drug interactions
 * @access  Private (Healthcare providers only)
 */
router.post('/drug-interactions',
    authenticate,
    authorize(['doctor', 'nurse', 'provider', 'admin']),
    validateDrugInteractionCheck,
    handleValidationErrors,
    async (req, res, next) => {
        try {
            const { medications } = req.body;

            const interactions = await researchService.checkDrugInteractions(medications);

            res.json({
                success: true,
                data: {
                    medications,
                    interactions,
                    hasInteractions: interactions.length > 0,
                    riskLevel: interactions.length > 0 ? 'moderate' : 'low'
                }
            });
        } catch (error) {
            next(error);
        }
    }
);

/**
 * @route   GET /api/research/icd10/:condition
 * @desc    Get ICD-10 codes for a condition
 * @access  Private (Healthcare providers only)
 */
router.get('/icd10/:condition',
    authenticate,
    authorize(['doctor', 'nurse', 'provider', 'admin']),
    async (req, res, next) => {
        try {
            const { condition } = req.params;

            const codes = await researchService.getICD10Codes(condition);

            if (!codes) {
                return res.status(404).json({
                    success: false,
                    message: 'ICD-10 codes not found for this condition',
                    code: 'CODES_NOT_FOUND'
                });
            }

            res.json({
                success: true,
                data: codes
            });
        } catch (error) {
            next(error);
        }
    }
);

/**
 * @route   GET /api/research/calculators/:condition
 * @desc    Get medical calculators for a condition
 * @access  Private (Healthcare providers only)
 */
router.get('/calculators/:condition',
    authenticate,
    authorize(['doctor', 'nurse', 'provider', 'admin']),
    async (req, res, next) => {
        try {
            const { condition } = req.params;
            const patientData = req.query.patientData ? JSON.parse(req.query.patientData) : {};

            const calculators = await researchService.getMedicalCalculators(condition, patientData);

            res.json({
                success: true,
                data: calculators,
                meta: {
                    condition,
                    calculatorCount: calculators.length
                }
            });
        } catch (error) {
            next(error);
        }
    }
);

/**
 * @route   POST /api/research/comprehensive
 * @desc    Comprehensive research integration
 * @access  Private (Healthcare providers only)
 */
router.post('/comprehensive',
    authenticate,
    authorize(['doctor', 'nurse', 'provider', 'admin']),
    validateComprehensiveResearch,
    handleValidationErrors,
    async (req, res, next) => {
        try {
            const { query, patientContext, medications } = req.body;

            const results = await researchService.comprehensiveResearch(query, {
                patientContext,
                medications
            });

            res.json({
                success: true,
                data: results,
                meta: {
                    query,
                    searchTimestamp: results.timestamp,
                    hasLiterature: results.literature.length > 0,
                    hasClinicalTrials: results.clinicalTrials.length > 0,
                    hasDiagnosticCriteria: !!results.diagnosticCriteria,
                    hasTreatmentGuidelines: !!results.treatmentGuidelines,
                    hasInteractions: results.drugInteractions.length > 0
                }
            });
        } catch (error) {
            next(error);
        }
    }
);

/**
 * @route   GET /api/research/databases
 * @desc    Get available research databases
 * @access  Private (Healthcare providers only)
 */
router.get('/databases',
    authenticate,
    authorize(['doctor', 'nurse', 'provider', 'admin']),
    async (req, res, next) => {
        try {
            const databases = {
                medical: researchService.medicalDatabases,
                clinical: researchService.clinicalTools
            };

            res.json({
                success: true,
                data: databases
            });
        } catch (error) {
            next(error);
        }
    }
);

/**
 * @route   GET /api/research/search-suggestions
 * @desc    Get search suggestions based on query
 * @access  Private (Healthcare providers only)
 */
router.get('/search-suggestions',
    authenticate,
    authorize(['doctor', 'nurse', 'provider', 'admin']),
    async (req, res, next) => {
        try {
            const { q } = req.query;

            if (!q || q.length < 2) {
                return res.json({
                    success: true,
                    data: []
                });
            }

            // Mock search suggestions - would integrate with medical terminology APIs
            const suggestions = [
                `${q} diagnosis`,
                `${q} treatment`,
                `${q} guidelines`,
                `${q} symptoms`,
                `${q} medication`,
                `${q} risk factors`,
                `${q} prognosis`,
                `${q} complications`
            ].filter(suggestion => suggestion.length <= 100);

            res.json({
                success: true,
                data: suggestions
            });
        } catch (error) {
            next(error);
        }
    }
);

module.exports = router;