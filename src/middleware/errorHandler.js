const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log error for debugging
    console.error(`Error: ${err.message}`, {
        stack: err.stack,
        url: req.originalUrl,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString()
    });

    // Sequelize Validation Error
    if (err.name === 'SequelizeValidationError') {
        const message = Object.values(err.errors).map(val => val.message);
        error = {
            success: false,
            message: 'Validation Error',
            details: message,
            code: 'VALIDATION_ERROR'
        };
        return res.status(400).json(error);
    }

    // Sequelize Unique Constraint Error
    if (err.name === 'SequelizeUniqueConstraintError') {
        const message = 'Resource already exists';
        error = {
            success: false,
            message,
            code: 'DUPLICATE_RESOURCE'
        };
        return res.status(400).json(error);
    }

    // Sequelize Foreign Key Constraint Error
    if (err.name === 'SequelizeForeignKeyConstraintError') {
        const message = 'Referenced resource not found';
        error = {
            success: false,
            message,
            code: 'FOREIGN_KEY_ERROR'
        };
        return res.status(400).json(error);
    }

    // Sequelize Database Connection Error
    if (err.name === 'SequelizeConnectionError') {
        error = {
            success: false,
            message: 'Database connection error',
            code: 'DATABASE_ERROR'
        };
        return res.status(503).json(error);
    }

    // JWT Errors
    if (err.name === 'JsonWebTokenError') {
        error = {
            success: false,
            message: 'Invalid token',
            code: 'INVALID_TOKEN'
        };
        return res.status(401).json(error);
    }

    if (err.name === 'TokenExpiredError') {
        error = {
            success: false,
            message: 'Token expired',
            code: 'TOKEN_EXPIRED'
        };
        return res.status(401).json(error);
    }

    // Multer Errors (File Upload)
    if (err.code === 'LIMIT_FILE_SIZE') {
        error = {
            success: false,
            message: 'File too large',
            code: 'FILE_TOO_LARGE'
        };
        return res.status(400).json(error);
    }

    if (err.code === 'LIMIT_FILE_COUNT') {
        error = {
            success: false,
            message: 'Too many files',
            code: 'TOO_MANY_FILES'
        };
        return res.status(400).json(error);
    }

    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        error = {
            success: false,
            message: 'Unexpected file field',
            code: 'UNEXPECTED_FILE'
        };
        return res.status(400).json(error);
    }

    // Express Validator Errors
    if (err.type === 'entity.parse.failed') {
        error = {
            success: false,
            message: 'Invalid JSON',
            code: 'INVALID_JSON'
        };
        return res.status(400).json(error);
    }

    // Custom Application Errors
    if (err.isOperational) {
        error = {
            success: false,
            message: err.message,
            code: err.code || 'APPLICATION_ERROR'
        };
        return res.status(err.statusCode || 400).json(error);
    }

    // Default to 500 server error
    error = {
        success: false,
        message: process.env.NODE_ENV === 'production'
            ? 'Internal server error'
            : err.message,
        code: 'INTERNAL_ERROR'
    };

    // Include stack trace in development
    if (process.env.NODE_ENV === 'development') {
        error.stack = err.stack;
    }

    res.status(500).json(error);
};

// Custom Error Classes
class AppError extends Error {
    constructor(message, statusCode, code = 'APPLICATION_ERROR') {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

class ValidationError extends AppError {
    constructor(message, details = []) {
        super(message, 400, 'VALIDATION_ERROR');
        this.details = details;
    }
}

class NotFoundError extends AppError {
    constructor(resource = 'Resource') {
        super(`${resource} not found`, 404, 'NOT_FOUND');
    }
}

class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized access') {
        super(message, 401, 'UNAUTHORIZED');
    }
}

class ForbiddenError extends AppError {
    constructor(message = 'Forbidden access') {
        super(message, 403, 'FORBIDDEN');
    }
}

class ConflictError extends AppError {
    constructor(message = 'Resource conflict') {
        super(message, 409, 'CONFLICT');
    }
}

module.exports = {
    errorHandler,
    AppError,
    ValidationError,
    NotFoundError,
    UnauthorizedError,
    ForbiddenError,
    ConflictError
};