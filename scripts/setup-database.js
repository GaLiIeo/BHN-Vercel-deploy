#!/usr/bin/env node

/**
 * Database Setup Script
 * This script helps you set up the PostgreSQL database for the Birth Health Network application
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Default PostgreSQL connection settings
const DEFAULT_CONFIG = {
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: '', // Will be prompted
    database: 'postgres' // Connect to default database first
};

const TARGET_DATABASE = 'birth_health_network';

async function createDatabase() {
    console.log('🔧 Setting up PostgreSQL database for Birth Health Network...\n');

    // Get connection details
    const config = { ...DEFAULT_CONFIG };

    console.log('📋 Database Configuration:');
    console.log(`Host: ${config.host}`);
    console.log(`Port: ${config.port}`);
    console.log(`User: ${config.user}`);
    console.log(`Target Database: ${TARGET_DATABASE}\n`);

    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    // Prompt for password
    const password = await new Promise((resolve) => {
        rl.question('Enter PostgreSQL password for user "postgres": ', (answer) => {
            resolve(answer);
        });
    });

    rl.close();
    config.password = password;

    try {
        // Connect to PostgreSQL
        console.log('\n🔌 Connecting to PostgreSQL...');
        const client = new Client(config);
        await client.connect();
        console.log('✅ Connected to PostgreSQL successfully');

        // Check if database exists
        const dbExistsQuery = `
            SELECT 1 FROM pg_database WHERE datname = $1
        `;
        const dbResult = await client.query(dbExistsQuery, [TARGET_DATABASE]);

        if (dbResult.rows.length === 0) {
            // Create database
            console.log(`🗄️ Creating database "${TARGET_DATABASE}"...`);
            await client.query(`CREATE DATABASE "${TARGET_DATABASE}"`);
            console.log('✅ Database created successfully');
        } else {
            console.log(`✅ Database "${TARGET_DATABASE}" already exists`);
        }

        await client.end();

        // Connect to the target database and run schema
        console.log(`\n🔌 Connecting to "${TARGET_DATABASE}"...`);
        const targetClient = new Client({
            ...config,
            database: TARGET_DATABASE
        });

        await targetClient.connect();
        console.log('✅ Connected to target database');

        // Read and execute schema
        const schemaPath = path.join(__dirname, '../database_schema.sql');
        if (fs.existsSync(schemaPath)) {
            console.log('📋 Executing database schema...');
            const schema = fs.readFileSync(schemaPath, 'utf8');

            // Split schema into individual statements
            const statements = schema
                .split(';')
                .map(stmt => stmt.trim())
                .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

            for (const statement of statements) {
                try {
                    await targetClient.query(statement);
                } catch (error) {
                    if (!error.message.includes('already exists')) {
                        console.warn(`⚠️ Warning: ${error.message}`);
                    }
                }
            }

            console.log('✅ Database schema executed successfully');
        } else {
            console.log('⚠️ Schema file not found, skipping schema creation');
        }

        await targetClient.end();

        // Create environment file template
        console.log('\n📄 Creating environment configuration...');
        const envTemplate = `# Copy this to .env and update the values
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=${TARGET_DATABASE}
DB_USER=postgres
DB_PASSWORD=${password}

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=3001
`;

        fs.writeFileSync('.env.template', envTemplate);
        console.log('✅ Environment template created as .env.template');

        console.log('\n🎉 Database setup completed successfully!');
        console.log('\n📋 Next steps:');
        console.log('1. Copy .env.template to .env');
        console.log('2. Update any additional configuration in .env as needed');
        console.log('3. Run "npm start" to start the application');

    } catch (error) {
        console.error('\n❌ Database setup failed:', error.message);

        if (error.code === 'ECONNREFUSED') {
            console.log('\n💡 Troubleshooting:');
            console.log('- Make sure PostgreSQL is running');
            console.log('- Check if the connection details are correct');
            console.log('- Verify PostgreSQL is listening on port 5432');
        } else if (error.code === '28P01') {
            console.log('\n💡 Authentication failed - check your password');
        }

        process.exit(1);
    }
}

// Run the setup
if (require.main === module) {
    createDatabase().catch(console.error);
}

module.exports = { createDatabase };