module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password_hash: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        user_type: {
            type: DataTypes.ENUM('patient', 'doctor', 'nurse', 'admin', 'hospital_staff', 'provider'),
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('active', 'inactive', 'suspended', 'pending_verification'),
            defaultValue: 'pending_verification'
        },
        email_verified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        email_verification_token: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        password_reset_token: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        password_reset_expires: {
            type: DataTypes.DATE,
            allowNull: true
        },
        last_login: {
            type: DataTypes.DATE,
            allowNull: true
        },
        login_attempts: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        locked_until: {
            type: DataTypes.DATE,
            allowNull: true
        },
        two_factor_enabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        two_factor_secret: {
            type: DataTypes.STRING(255),
            allowNull: true
        }
    }, {
        tableName: 'users',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            {
                unique: true,
                fields: ['email']
            },
            {
                fields: ['user_type']
            },
            {
                fields: ['status']
            }
        ]
    });

    User.associate = function (models) {
        // User has one profile
        User.hasOne(models.UserProfile, {
            foreignKey: 'user_id',
            as: 'profile',
            onDelete: 'CASCADE'
        });

        // User can be a patient
        User.hasOne(models.Patient, {
            foreignKey: 'user_id',
            as: 'patientProfile',
            onDelete: 'CASCADE'
        });

        // User can be a doctor
        User.hasOne(models.Doctor, {
            foreignKey: 'user_id',
            as: 'doctorProfile',
            onDelete: 'CASCADE'
        });

        // User can have many documents
        User.hasMany(models.Document, {
            foreignKey: 'uploaded_by_user_id',
            as: 'uploadedDocuments'
        });
    };

    return User;
};