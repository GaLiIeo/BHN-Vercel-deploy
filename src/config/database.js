const { Sequelize } = require('sequelize');
const path = require('path');

// Database configuration - prioritize PostgreSQL, fallback to SQLite for development
const hasPostgresConfig = process.env.DB_HOST || process.env.DB_NAME || process.env.DB_USER;
const usePostgres = hasPostgresConfig || process.env.NODE_ENV === 'production';
const useSQLite = !usePostgres && (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV);

console.log(`🔧 Database mode: ${usePostgres ? 'PostgreSQL' : 'SQLite (development fallback)'}`);
if (usePostgres) {
    console.log(`📊 PostgreSQL config: ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || 'birth_health_network'}`);
} else {
    console.log('📁 SQLite database file will be created at: ./database.sqlite');
}

const config = useSQLite ? {
    dialect: 'sqlite',
    storage: path.join(__dirname, '../../database.sqlite'),
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
} : {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'birth_health_network',
    username: process.env.DB_USER || 'bhn_user',
    password: process.env.DB_PASSWORD || 'your_secure_password',
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,

    // Connection pool configuration (only for postgres)
    pool: {
        max: parseInt(process.env.DB_POOL_MAX) || 5,
        min: parseInt(process.env.DB_POOL_MIN) || 0,
        acquire: parseInt(process.env.DB_POOL_ACQUIRE) || 30000,
        idle: parseInt(process.env.DB_POOL_IDLE) || 10000
    },

    // Retry configuration
    retry: {
        max: 3
    },

    // SSL configuration for production
    dialectOptions: process.env.NODE_ENV === 'production' ? {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    } : {},

    // Timezone configuration
    timezone: process.env.TZ || '+00:00',

    // Query configuration
    define: {
        timestamps: true,
        underscored: true,
        freezeTableName: true
    }
};

// Create Sequelize instance
const sequelize = new Sequelize(config);

// Test connection
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        const dbType = useSQLite ? 'SQLite (development)' : 'PostgreSQL';
        console.log(`✅ Database connection established successfully (${dbType})`);

        // Sync models in development
        if (process.env.NODE_ENV === 'development') {
            await sequelize.sync({ alter: true });
            console.log('📊 Database models synchronized');
        }
    } catch (error) {
        console.error('❌ Unable to connect to the database:', error.message);

        if (useSQLite) {
            console.log('💡 SQLite fallback failed. Check file permissions.');
        } else {
            console.log('💡 PostgreSQL connection failed. Consider using SQLite for development.');
        }

        // Retry connection in production
        if (process.env.NODE_ENV === 'production') {
            console.log('🔄 Retrying database connection in 5 seconds...');
            setTimeout(testConnection, 5000);
        } else {
            process.exit(1);
        }
    }
};

// Initialize connection
testConnection();

module.exports = sequelize;