module.exports = (sequelize, DataTypes) => {
    const HealthRecord = sequelize.define('HealthRecord', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        patient_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'patients',
                key: 'id'
            }
        },
        doctor_id: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'doctors',
                key: 'id'
            }
        },
        facility_id: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'healthcare_facilities',
                key: 'id'
            }
        },
        record_type: {
            type: DataTypes.ENUM(
                'vital_signs', 'lab_results', 'vaccination', 'prenatal',
                'consultation', 'mental_health', 'physical_therapy',
                'nutrition', 'birth_record', 'emergency'
            ),
            allowNull: false
        },
        urgency_level: {
            type: DataTypes.ENUM('low', 'normal', 'high', 'urgent', 'critical'),
            defaultValue: 'normal'
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        diagnosis: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        treatment_plan: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        vital_signs: {
            type: DataTypes.JSONB,
            allowNull: true,
            comment: 'Stores vital signs data: blood pressure, heart rate, temperature, weight, height, oxygen saturation, BMI, etc.'
        },
        visit_date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        visit_time: {
            type: DataTypes.TIME,
            allowNull: true
        },
        follow_up_date: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        follow_up_instructions: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        record_status: {
            type: DataTypes.STRING(50),
            defaultValue: 'active'
        },
        is_confidential: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        tableName: 'health_records',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            {
                fields: ['patient_id']
            },
            {
                fields: ['doctor_id']
            },
            {
                fields: ['visit_date']
            },
            {
                fields: ['record_type']
            },
            {
                fields: ['urgency_level']
            }
        ]
    });

    HealthRecord.associate = function (models) {
        // Health record belongs to patient
        HealthRecord.belongsTo(models.Patient, {
            foreignKey: 'patient_id',
            as: 'patient'
        });

        // Health record belongs to doctor
        HealthRecord.belongsTo(models.Doctor, {
            foreignKey: 'doctor_id',
            as: 'doctor'
        });

        // Health record has many medications
        HealthRecord.hasMany(models.Medication, {
            foreignKey: 'health_record_id',
            as: 'medications'
        });

        // Health record has many documents
        HealthRecord.hasMany(models.Document, {
            foreignKey: 'health_record_id',
            as: 'documents'
        });
    };

    return HealthRecord;
};