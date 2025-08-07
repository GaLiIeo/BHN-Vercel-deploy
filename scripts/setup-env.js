#!/usr/bin/env node

/**
 * Birth Health Network - Environment Setup Script
 * This script helps generate secure environment variables
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

function generateSecureKey(length) {
    return crypto.randomBytes(length).toString('hex');
}

function generateJWTSecret() {
    return crypto.randomBytes(64).toString('hex');
}

function generateSessionSecret() {
    return crypto.randomBytes(32).toString('hex');
}

function generateEncryptionKey() {
    return crypto.randomBytes(16).toString('hex');
}

function createEnvFile() {
    const envContent = `# =============================================
# BIRTH HEALTH NETWORK - AUTO-GENERATED .ENV
# Generated on: ${new Date().toISOString()}
# =============================================

# =============================================
# DATABASE CONFIGURATION
# =============================================
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=birth_health_network
DB_USER=bhn_user
DB_PASSWORD=your_secure_password_here

# =============================================
# SERVER CONFIGURATION
# =============================================
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:3001

# =============================================
# JWT & AUTHENTICATION (AUTO-GENERATED)
# =============================================
JWT_SECRET=${generateJWTSecret()}
JWT_EXPIRES_IN=7d
SESSION_SECRET=${generateSessionSecret()}
ENCRYPTION_KEY=${generateEncryptionKey()}

# =============================================
# EMAIL CONFIGURATION
# =============================================
EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
FROM_EMAIL=noreply@birthhealth.network
FROM_NAME=Birth Health Network

# =============================================
# SECURITY & HIPAA COMPLIANCE
# =============================================
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
HIPAA_AUDIT_ENABLED=true
HIPAA_LOG_LEVEL=info

# =============================================
# DEVELOPMENT SETTINGS
# =============================================
DEBUG_MODE=false
MOCK_EMAIL=true
AUTO_SEED_DB=false

# =============================================
# FEATURE FLAGS
# =============================================
ENABLE_REGISTRATION=true
ENABLE_PASSWORD_RESET=true
ENABLE_2FA=true
ENABLE_AUDIT_LOGS=true
ENABLE_DATA_ENCRYPTION=true

# =============================================
# AWS CONFIGURATION (Fill in for production)
# =============================================
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_BUCKET_NAME=bhn-documents

# =============================================
# PRODUCTION SETTINGS
# =============================================
ENABLE_COMPRESSION=true
ENABLE_CACHING=true
FORCE_HTTPS=false
`;

    const envPath = path.join(process.cwd(), '.env');

    if (fs.existsSync(envPath)) {
        console.log('⚠️  .env file already exists. Creating .env.new instead...');
        fs.writeFileSync(path.join(process.cwd(), '.env.new'), envContent);
        console.log('✅ New environment file created as .env.new');
        console.log('📝 Review and rename to .env when ready');
    } else {
        fs.writeFileSync(envPath, envContent);
        console.log('✅ .env file created successfully!');
    }

    console.log('\n🔒 SECURITY NOTICE:');
    console.log('• JWT Secret: 128 characters (auto-generated)');
    console.log('• Session Secret: 64 characters (auto-generated)');
    console.log('• Encryption Key: 32 characters (auto-generated)');
    console.log('\n⚠️  IMPORTANT:');
    console.log('1. Update DB_PASSWORD with your actual database password');
    console.log('2. Update EMAIL_USER and EMAIL_PASSWORD for email functionality');
    console.log('3. Add AWS credentials for production deployment');
    console.log('4. Never commit .env file to version control');

    return envPath;
}

function main() {
    console.log('🏥 Birth Health Network - Environment Setup');
    console.log('==========================================\n');

    try {
        createEnvFile();
        console.log('\n🎉 Environment setup completed!');
        console.log('\nNext steps:');
        console.log('1. Edit .env file with your actual credentials');
        console.log('2. Run: npm run verify-db (to test database)');
        console.log('3. Run: npm start (to start the application)');
    } catch (error) {
        console.error('❌ Environment setup failed:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = {
    generateSecureKey,
    generateJWTSecret,
    generateSessionSecret,
    generateEncryptionKey,
    createEnvFile
};
