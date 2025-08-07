/**
 * Form validation utility functions for the Birth Health Network application
 */

/**
 * Validates a form based on the provided data
 * @param {Object} formData - The form data to validate
 * @returns {Object} - Object containing isValid flag and errors object
 */
export const validateForm = (formData) => {
    const errors = {};
    let isValid = true;

    // Email validation
    if (formData.email && !validateEmail(formData.email)) {
        errors.email = 'Please enter a valid email address';
        isValid = false;
    }

    // Phone validation
    if (formData.phone && !validatePhone(formData.phone)) {
        errors.phone = 'Please enter a valid phone number';
        isValid = false;
    }

    // Name validation
    if (formData.firstName && formData.firstName.trim().length < 2) {
        errors.firstName = 'First name must be at least 2 characters';
        isValid = false;
    }

    if (formData.lastName && formData.lastName.trim().length < 2) {
        errors.lastName = 'Last name must be at least 2 characters';
        isValid = false;
    }

    // Password validation
    if (formData.password) {
        if (formData.password.length < 8) {
            errors.password = 'Password must be at least 8 characters';
            isValid = false;
        } else if (!validatePassword(formData.password)) {
            errors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
            isValid = false;
        }
    }

    // Password confirmation validation
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
        isValid = false;
    }

    // Date of birth validation
    if (formData.dateOfBirth && !validateDateOfBirth(formData.dateOfBirth)) {
        errors.dateOfBirth = 'Please enter a valid date of birth';
        isValid = false;
    }

    // License number validation for doctors
    if (formData.userType === 'doctor' && formData.licenseNumber && formData.licenseNumber.trim().length < 5) {
        errors.licenseNumber = 'Please enter a valid license number';
        isValid = false;
    }

    return { isValid, errors };
};

/**
 * Validates an email address
 * @param {string} email - The email to validate
 * @returns {boolean} - Whether the email is valid
 */
export const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};

/**
 * Validates a phone number
 * @param {string} phone - The phone number to validate
 * @returns {boolean} - Whether the phone number is valid
 */
export const validatePhone = (phone) => {
    // Allow formats like (123) 456-7890, 123-456-7890, 1234567890
    const re = /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
    return re.test(String(phone));
};

/**
 * Validates a password
 * @param {string} password - The password to validate
 * @returns {boolean} - Whether the password is valid
 */
export const validatePassword = (password) => {
    // At least one uppercase, one lowercase, one number, and 8 characters
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return re.test(String(password));
};

/**
 * Validates a date of birth
 * @param {string} dateOfBirth - The date of birth to validate
 * @returns {boolean} - Whether the date of birth is valid
 */
export const validateDateOfBirth = (dateOfBirth) => {
    const date = new Date(dateOfBirth);
    const now = new Date();

    // Check if date is valid and not in the future
    return date instanceof Date && !isNaN(date) && date < now;
};

/**
 * Formats a phone number for display
 * @param {string} phone - The phone number to format
 * @returns {string} - The formatted phone number
 */
export const formatPhoneNumber = (phone) => {
    if (!phone) return '';

    // Strip all non-numeric characters
    const cleaned = phone.replace(/\D/g, '');

    // Format as (XXX) XXX-XXXX
    if (cleaned.length === 10) {
        return `(${cleaned.substring(0, 3)}) ${cleaned.substring(3, 6)}-${cleaned.substring(6, 10)}`;
    }

    // If not 10 digits, return original
    return phone;
};

/**
 * Formats a date for display
 * @param {string} date - The date to format
 * @returns {string} - The formatted date
 */
export const formatDate = (date) => {
    if (!date) return '';

    const d = new Date(date);
    if (isNaN(d.getTime())) return date;

    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}; 