const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, UserProfile } = require('../models');
const { ValidationError, UnauthorizedError, ConflictError } = require('../middleware/errorHandler');

/**
 * Generate JWT token
 */
const generateToken = (userId, userType) => {
    return jwt.sign(
        { userId, userType },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '24h' }
    );
};

/**
 * Generate refresh token
 */
const generateRefreshToken = (userId) => {
    return jwt.sign(
        { userId, type: 'refresh' },
        process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' }
    );
};

/**
 * Register new user
 */
const register = async (req, res, next) => {
    try {
        const {
            email,
            password,
            firstName,
            lastName,
            userType = 'patient',
            phone,
            dateOfBirth
        } = req.body;

        // Validate required fields
        if (!email || !password || !firstName || !lastName) {
            throw new ValidationError('Missing required fields', [
                'Email, password, first name, and last name are required'
            ]);
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new ValidationError('Invalid email format');
        }

        // Validate password strength
        if (password.length < 8) {
            throw new ValidationError('Password must be at least 8 characters long');
        }

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email: email.toLowerCase() } });
        if (existingUser) {
            throw new ConflictError('User with this email already exists');
        }

        // Hash password
        const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create user and profile in transaction
        const sequelize = require('../config/database');
        const result = await sequelize.transaction(async (t) => {
            // Create user
            const user = await User.create({
                email: email.toLowerCase(),
                password_hash: hashedPassword,
                user_type: userType,
                status: 'active', // In production, you might want 'pending_verification'
                email_verified: true // In production, set to false and send verification email
            }, { transaction: t });

            // Create user profile
            const profile = await UserProfile.create({
                user_id: user.id,
                first_name: firstName,
                last_name: lastName,
                phone: phone || null,
                date_of_birth: dateOfBirth || null
            }, { transaction: t });

            return { user, profile };
        });

        // Generate tokens
        const accessToken = generateToken(result.user.id, result.user.user_type);
        const refreshToken = generateRefreshToken(result.user.id);

        // Set refresh token as httpOnly cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(201).json({
            success: true,
            data: {
                user: {
                    id: result.user.id,
                    email: result.user.email,
                    userType: result.user.user_type,
                    firstName: result.profile.first_name,
                    lastName: result.profile.last_name,
                    status: result.user.status
                },
                accessToken,
                expiresIn: '24h'
            },
            message: 'User registered successfully'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Login user
 */
const login = async (req, res, next) => {
    try {
        const { email, password, rememberMe = false } = req.body;

        if (!email || !password) {
            throw new ValidationError('Email and password are required');
        }

        // Find user with profile
        const user = await User.findOne({
            where: { email: email.toLowerCase() },
            include: [{
                model: UserProfile,
                as: 'profile'
            }]
        });

        if (!user) {
            throw new UnauthorizedError('Invalid email or password');
        }

        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) {
            throw new UnauthorizedError('Invalid email or password');
        }

        // Check user status
        if (user.status !== 'active') {
            throw new UnauthorizedError('Account is not active');
        }

        // Update last login
        await user.update({ last_login: new Date() });

        // Generate tokens
        const accessToken = generateToken(user.id, user.user_type);
        const refreshToken = generateRefreshToken(user.id);

        // Set refresh token cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000 // 30 days or 7 days
        });

        res.json({
            success: true,
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    userType: user.user_type,
                    firstName: user.profile?.first_name,
                    lastName: user.profile?.last_name,
                    status: user.status
                },
                accessToken,
                expiresIn: '24h'
            },
            message: 'Login successful'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Refresh access token
 */
const refreshToken = async (req, res, next) => {
    try {
        const { refreshToken: token } = req.cookies;

        if (!token) {
            throw new UnauthorizedError('Refresh token not provided');
        }

        // Verify refresh token
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);

        if (decoded.type !== 'refresh') {
            throw new UnauthorizedError('Invalid token type');
        }

        // Get user
        const user = await User.findByPk(decoded.userId);
        if (!user || user.status !== 'active') {
            throw new UnauthorizedError('User not found or inactive');
        }

        // Generate new tokens
        const newAccessToken = generateToken(user.id, user.user_type);
        const newRefreshToken = generateRefreshToken(user.id);

        // Set new refresh token cookie
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({
            success: true,
            data: {
                accessToken: newAccessToken,
                expiresIn: '24h'
            },
            message: 'Token refreshed successfully'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Logout user
 */
const logout = async (req, res, next) => {
    try {
        // Clear refresh token cookie
        res.clearCookie('refreshToken');

        res.json({
            success: true,
            message: 'Logout successful'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get current user profile
 */
const getMe = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.userId, {
            include: [{
                model: UserProfile,
                as: 'profile'
            }],
            attributes: { exclude: ['password_hash'] }
        });

        if (!user) {
            throw new NotFoundError('User');
        }

        res.json({
            success: true,
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    userType: user.user_type,
                    status: user.status,
                    emailVerified: user.email_verified,
                    firstName: user.profile?.first_name,
                    lastName: user.profile?.last_name,
                    phone: user.profile?.phone,
                    dateOfBirth: user.profile?.date_of_birth,
                    lastLogin: user.last_login,
                    createdAt: user.created_at
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Change password
 */
const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            throw new ValidationError('Current password and new password are required');
        }

        if (newPassword.length < 8) {
            throw new ValidationError('New password must be at least 8 characters long');
        }

        // Get user
        const user = await User.findByPk(req.userId);
        if (!user) {
            throw new NotFoundError('User');
        }

        // Verify current password
        const isValidPassword = await bcrypt.compare(currentPassword, user.password_hash);
        if (!isValidPassword) {
            throw new UnauthorizedError('Current password is incorrect');
        }

        // Hash new password
        const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        // Update password
        await user.update({ password_hash: hashedPassword });

        res.json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    refreshToken,
    logout,
    getMe,
    changePassword
};