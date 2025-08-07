module.exports = (sequelize, DataTypes) => {
    const Patient = sequelize.define('Patient', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        bhn_id: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true
        },
        blood_type: {
            type: DataTypes.ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'unknown'),
            defaultValue: 'unknown'
        },
        allergies: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        current_medications: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        medical_conditions: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        insurance_provider: {
            type: DataTypes.STRING(200),
            allowNull: true
        },
        insurance_number: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        insurance_group_number: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        primary_doctor_id: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'doctors',
                key: 'id'
            }
        },
        preferred_pharmacy: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        medical_history: {
            type: DataTypes.JSONB,
            allowNull: true
        },
        family_history: {
            type: DataTypes.JSONB,
            allowNull: true
        }
    }, {
        tableName: 'patients',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            {
                unique: true,
                fields: ['bhn_id']
            },
            {
                fields: ['user_id']
            },
            {
                fields: ['primary_doctor_id']
            }
        ]
    });

    Patient.associate = function (models) {
        // Patient belongs to a user
        Patient.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user',
            onDelete: 'CASCADE'
        });

        // Patient belongs to a primary doctor
        Patient.belongsTo(models.Doctor, {
            foreignKey: 'primary_doctor_id',
            as: 'primaryDoctor'
        });

        // Patient has many health records
        Patient.hasMany(models.HealthRecord, {
            foreignKey: 'patient_id',
            as: 'healthRecords',
            onDelete: 'CASCADE'
        });

        // Patient has many appointments
        Patient.hasMany(models.Appointment, {
            foreignKey: 'patient_id',
            as: 'appointments',
            onDelete: 'CASCADE'
        });

        // Patient has many medications
        Patient.hasMany(models.Medication, {
            foreignKey: 'patient_id',
            as: 'medications',
            onDelete: 'CASCADE'
        });

        // Patient has many documents
        Patient.hasMany(models.Document, {
            foreignKey: 'patient_id',
            as: 'documents'
        });
    };

    return Patient;
};