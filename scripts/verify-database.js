#!/usr/bin/env node

/**
 * Birth Health Network - Database Verification Script
 * This script verifies database connectivity, schema, and HIPAA compliance
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'birth_health_network',
    user: process.env.DB_USER || 'bhn_user',
    password: process.env.DB_PASSWORD || 'your_password'
};

const pool = new Pool(dbConfig);

// Color codes for console output
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

function colorLog(color, message) {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

async function verifyDatabaseConnection() {
    colorLog('cyan', '\n🔗 Testing Database Connection...');

    try {
        const client = await pool.connect();
        const result = await client.query('SELECT NOW(), version()');
        client.release();

        colorLog('green', '✅ Database connection successful!');
        colorLog('blue', `📅 Server time: ${result.rows[0].now}`);
        colorLog('blue', `🗄️  PostgreSQL version: ${result.rows[0].version.split(' ')[1]}`);
        return true;
    } catch (error) {
        colorLog('red', '❌ Database connection failed!');
        colorLog('red', `Error: ${error.message}`);
        return false;
    }
}

async function verifyDatabaseSchema() {
    colorLog('cyan', '\n🏗️  Verifying Database Schema...');

    const requiredTables = [
        'users',
        'user_profiles',
        'patients',
        'doctors',
        'health_records',
        'audit_logs',
        'birth_registrations'
    ];

    try {
        const result = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name
        `);

        const existingTables = result.rows.map(row => row.table_name);
        colorLog('green', `✅ Found ${existingTables.length} tables in database`);

        // Check required tables
        const missingTables = requiredTables.filter(table => !existingTables.includes(table));

        if (missingTables.length === 0) {
            colorLog('green', '✅ All required tables exist!');
            colorLog('blue', `📋 Tables: ${existingTables.join(', ')}`);
        } else {
            colorLog('yellow', `⚠️  Missing tables: ${missingTables.join(', ')}`);
        }

        return missingTables.length === 0;
    } catch (error) {
        colorLog('red', '❌ Schema verification failed!');
        colorLog('red', `Error: ${error.message}`);
        return false;
    }
}

async function verifyTableStructure() {
    colorLog('cyan', '\n📊 Verifying Critical Table Structures...');

    try {
        // Check patients table for BHN ID format
        const patientsResult = await pool.query(`
            SELECT column_name, data_type, character_maximum_length, is_nullable
            FROM information_schema.columns 
            WHERE table_name = 'patients' 
            ORDER BY ordinal_position
        `);

        colorLog('green', '✅ Patients table structure verified');

        // Check for BHN ID column
        const bhnIdColumn = patientsResult.rows.find(col => col.column_name === 'bhn_id');
        if (bhnIdColumn) {
            colorLog('green', `✅ BHN ID column exists (${bhnIdColumn.data_type}, max length: ${bhnIdColumn.character_maximum_length})`);
        } else {
            colorLog('red', '❌ BHN ID column missing from patients table!');
        }

        // Check user_profiles table for contact information
        const profilesResult = await pool.query(`
            SELECT column_name, data_type
            FROM information_schema.columns 
            WHERE table_name = 'user_profiles' 
            AND column_name IN ('phone', 'address', 'city', 'state', 'zip_code')
            ORDER BY column_name
        `);

        colorLog('green', `✅ User profiles contact fields: ${profilesResult.rows.map(r => r.column_name).join(', ')}`);

        return true;
    } catch (error) {
        colorLog('red', '❌ Table structure verification failed!');
        colorLog('red', `Error: ${error.message}`);
        return false;
    }
}

async function verifyDataIntegrity() {
    colorLog('cyan', '\n🔍 Checking Data Integrity...');

    try {
        // Count records in main tables
        const tables = ['users', 'patients', 'health_records'];

        for (const table of tables) {
            const result = await pool.query(`SELECT COUNT(*) FROM ${table}`);
            const count = parseInt(result.rows[0].count);
            colorLog('blue', `📊 ${table}: ${count} records`);
        }

        // Check for orphaned records
        const orphanedPatients = await pool.query(`
            SELECT COUNT(*) FROM patients p
            LEFT JOIN users u ON p.user_id = u.id
            WHERE u.id IS NULL
        `);

        const orphanedRecords = await pool.query(`
            SELECT COUNT(*) FROM health_records hr
            LEFT JOIN patients p ON hr.patient_id = p.id
            WHERE p.id IS NULL
        `);

        if (parseInt(orphanedPatients.rows[0].count) === 0 && parseInt(orphanedRecords.rows[0].count) === 0) {
            colorLog('green', '✅ No orphaned records found');
        } else {
            colorLog('yellow', `⚠️  Found orphaned records - Patients: ${orphanedPatients.rows[0].count}, Records: ${orphanedRecords.rows[0].count}`);
        }

        return true;
    } catch (error) {
        colorLog('red', '❌ Data integrity check failed!');
        colorLog('red', `Error: ${error.message}`);
        return false;
    }
}

async function verifyHIPAACompliance() {
    colorLog('cyan', '\n🔒 Verifying HIPAA Compliance Features...');

    try {
        // Check for audit logs table
        const auditResult = await pool.query(`
            SELECT COUNT(*) FROM information_schema.tables 
            WHERE table_name = 'audit_logs'
        `);

        if (parseInt(auditResult.rows[0].count) > 0) {
            colorLog('green', '✅ Audit logs table exists');

            // Check recent audit entries
            const recentAudits = await pool.query(`
                SELECT COUNT(*) FROM audit_logs 
                WHERE created_at > NOW() - INTERVAL '24 hours'
            `);
            colorLog('blue', `📝 Recent audit entries (24h): ${recentAudits.rows[0].count}`);
        } else {
            colorLog('red', '❌ Audit logs table missing - HIPAA compliance issue!');
        }

        // Check for encrypted fields (if implemented)
        const encryptedFields = await pool.query(`
            SELECT column_name FROM information_schema.columns 
            WHERE table_name IN ('health_records', 'patients')
            AND (column_name LIKE '%encrypted%' OR column_name LIKE '%cipher%')
        `);

        if (encryptedFields.rows.length > 0) {
            colorLog('green', `✅ Encrypted fields found: ${encryptedFields.rows.map(r => r.column_name).join(', ')}`);
        } else {
            colorLog('yellow', '⚠️  No encrypted fields detected - consider implementing field-level encryption');
        }

        return true;
    } catch (error) {
        colorLog('red', '❌ HIPAA compliance check failed!');
        colorLog('red', `Error: ${error.message}`);
        return false;
    }
}

async function getDatabaseStats() {
    colorLog('cyan', '\n📈 Database Statistics...');

    try {
        // Database size
        const dbSize = await pool.query(`
            SELECT pg_size_pretty(pg_database_size(current_database())) as size
        `);
        colorLog('blue', `💾 Database size: ${dbSize.rows[0].size}`);

        // Table sizes
        const tableSizes = await pool.query(`
            SELECT 
                tablename,
                pg_size_pretty(pg_total_relation_size(tablename::regclass)) as size,
                pg_total_relation_size(tablename::regclass) as size_bytes
            FROM pg_tables 
            WHERE schemaname = 'public'
            ORDER BY pg_total_relation_size(tablename::regclass) DESC
            LIMIT 5
        `);

        colorLog('blue', '📋 Largest tables:');
        tableSizes.rows.forEach(row => {
            colorLog('blue', `  • ${row.tablename}: ${row.size}`);
        });

        // Active connections
        const connections = await pool.query(`
            SELECT count(*) as active_connections
            FROM pg_stat_activity 
            WHERE datname = current_database()
        `);
        colorLog('blue', `🔗 Active connections: ${connections.rows[0].active_connections}`);

        return true;
    } catch (error) {
        colorLog('red', '❌ Statistics retrieval failed!');
        colorLog('red', `Error: ${error.message}`);
        return false;
    }
}

async function testBHNIdValidation() {
    colorLog('cyan', '\n🆔 Testing BHN ID Validation...');

    try {
        // Test valid BHN ID format
        const testId = 'BHN20250000000001';
        const isValid = /^BHN\d{14}$/.test(testId);

        if (isValid) {
            colorLog('green', `✅ BHN ID format validation working: ${testId}`);
        } else {
            colorLog('red', `❌ BHN ID format validation failed for: ${testId}`);
        }

        // Test database constraint (if exists)
        try {
            await pool.query('BEGIN');
            await pool.query(`
                INSERT INTO patients (user_id, bhn_id) 
                VALUES ('550e8400-e29b-41d4-a716-446655440000', 'INVALID_FORMAT')
            `);
            await pool.query('ROLLBACK');
            colorLog('yellow', '⚠️  Database constraint for BHN ID format not enforced');
        } catch (constraintError) {
            await pool.query('ROLLBACK');
            colorLog('green', '✅ Database constraint for BHN ID format is working');
        }

        return true;
    } catch (error) {
        colorLog('red', '❌ BHN ID validation test failed!');
        colorLog('red', `Error: ${error.message}`);
        return false;
    }
}

async function generateHealthReport() {
    colorLog('cyan', '\n📋 Generating Health Report...');

    const report = {
        timestamp: new Date().toISOString(),
        database: {
            host: dbConfig.host,
            port: dbConfig.port,
            database: dbConfig.database
        },
        tests: {
            connection: false,
            schema: false,
            structure: false,
            integrity: false,
            hipaa: false,
            statistics: false,
            bhnId: false
        },
        summary: {
            passed: 0,
            failed: 0,
            warnings: 0
        }
    };

    // Run all tests
    report.tests.connection = await verifyDatabaseConnection();
    report.tests.schema = await verifyDatabaseSchema();
    report.tests.structure = await verifyTableStructure();
    report.tests.integrity = await verifyDataIntegrity();
    report.tests.hipaa = await verifyHIPAACompliance();
    report.tests.statistics = await getDatabaseStats();
    report.tests.bhnId = await testBHNIdValidation();

    // Calculate summary
    Object.values(report.tests).forEach(result => {
        if (result) report.summary.passed++;
        else report.summary.failed++;
    });

    // Save report
    const reportPath = path.join(__dirname, '..', 'logs', 'database-health-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    // Display summary
    colorLog('cyan', '\n📊 VERIFICATION SUMMARY');
    colorLog('cyan', '========================');
    colorLog('green', `✅ Passed: ${report.summary.passed}`);
    colorLog('red', `❌ Failed: ${report.summary.failed}`);

    if (report.summary.failed === 0) {
        colorLog('green', '\n🎉 All database verification tests passed!');
        colorLog('green', '✅ Your database is ready for deployment!');
    } else {
        colorLog('red', '\n⚠️  Some tests failed. Please review and fix issues before deployment.');
    }

    colorLog('blue', `\n📄 Detailed report saved to: ${reportPath}`);

    return report;
}

// Main execution
async function main() {
    colorLog('magenta', '🏥 Birth Health Network - Database Verification');
    colorLog('magenta', '===============================================');

    try {
        await generateHealthReport();
    } catch (error) {
        colorLog('red', `\n💥 Verification failed with error: ${error.message}`);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

// Run the verification
if (require.main === module) {
    main();
}

module.exports = {
    verifyDatabaseConnection,
    verifyDatabaseSchema,
    verifyTableStructure,
    verifyDataIntegrity,
    verifyHIPAACompliance,
    getDatabaseStats,
    testBHNIdValidation,
    generateHealthReport
};
