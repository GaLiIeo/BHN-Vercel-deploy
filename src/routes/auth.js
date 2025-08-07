const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { authenticate, sensitiveOperationLimit } = require('../middleware/auth');
const {
    register,
    login,
    refreshToken,
    logout,
    getMe,
    changePassword
} = require('../controllers/authController');

// Validation middleware
const validateRegistration = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Valid email is required'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
    body('firstName')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('First name must be between 2 and 50 characters'),
    body('lastName')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Last name must be between 2 and 50 characters'),
    body('userType')
        .optional()
        .isIn(['patient', 'doctor', 'nurse', 'admin', 'hospital_staff', 'provider'])
        .withMessage('Invalid user type'),
    body('phone')
        .optional()
        .isMobilePhone()
        .withMessage('Valid phone number is required'),
    body('dateOfBirth')
        .optional()
        .isISO8601()
        .withMessage('Valid date of birth is required')
];

const validateLogin = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Valid email is required'),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
];

const validateChangePassword = [
    body('currentPassword')
        .notEmpty()
        .withMessage('Current password is required'),
    body('newPassword')
        .isLength({ min: 8 })
        .withMessage('New password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('New password must contain at least one lowercase letter, one uppercase letter, and one number')
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
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register',
    sensitiveOperationLimit,
    validateRegistration,
    handleValidationErrors,
    register
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login',
    sensitiveOperationLimit,
    validateLogin,
    handleValidationErrors,
    login
);

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token
 * @access  Public (requires refresh token cookie)
 */
router.post('/refresh', refreshToken);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', authenticate, logout);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', authenticate, getMe);

/**
 * @route   PUT /api/auth/change-password
 * @desc    Change user password
 * @access  Private
 */
router.put('/change-password',
    authenticate,
    sensitiveOperationLimit,
    validateChangePassword,
    handleValidationErrors,
    changePassword
);

/**
 * @route   GET /api/auth/verify-token
 * @desc    Verify if token is valid
 * @access  Private
 */
router.get('/verify-token', authenticate, (req, res) => {
    res.json({
        success: true,
        data: {
            valid: true,
            user: {
                id: req.user.id,
                email: req.user.email,
                userType: req.user.user_type
            }
        },
        message: 'Token is valid'
    });
});

module.exports = router;