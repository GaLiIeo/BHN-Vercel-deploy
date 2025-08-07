module.exports = (sequelize, DataTypes) => {
    const Medication = sequelize.define('Medication', {
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
            },
            onDelete: 'CASCADE'
        },
        prescribed_by_doctor_id: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'doctors',
                key: 'id'
            }
        },
        health_record_id: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'health_records',
                key: 'id'
            }
        },
        medication_name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        dosage: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        frequency: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        duration: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        instructions: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        side_effects: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        start_date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        end_date: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        tableName: 'medications',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            {
                fields: ['patient_id']
            },
            {
                fields: ['prescribed_by_doctor_id']
            },
            {
                fields: ['health_record_id']
            },
            {
                fields: ['is_active']
            }
        ]
    });

    Medication.associate = function (models) {
        // Medication belongs to a patient
        Medication.belongsTo(models.Patient, {
            foreignKey: 'patient_id',
            as: 'patient',
            onDelete: 'CASCADE'
        });

        // Medication belongs to a doctor who prescribed it
        Medication.belongsTo(models.Doctor, {
            foreignKey: 'prescribed_by_doctor_id',
            as: 'prescribedBy'
        });

        // Medication belongs to a health record
        Medication.belongsTo(models.HealthRecord, {
            foreignKey: 'health_record_id',
            as: 'healthRecord'
        });
    };

    return Medication;
};