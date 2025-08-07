module.exports = (sequelize, DataTypes) => {
    const Appointment = sequelize.define('Appointment', {
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
            allowNull: false,
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
        appointment_date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        appointment_time: {
            type: DataTypes.TIME,
            allowNull: false
        },
        duration_minutes: {
            type: DataTypes.INTEGER,
            defaultValue: 30
        },
        appointment_type: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        reason: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show'),
            defaultValue: 'scheduled'
        },
        chief_complaint: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        visit_notes: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        prescription_notes: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        next_appointment_recommended: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        scheduled_by_user_id: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        confirmed_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        cancelled_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        cancellation_reason: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        fee_amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true
        },
        payment_status: {
            type: DataTypes.STRING(50),
            defaultValue: 'pending'
        },
        insurance_claim_number: {
            type: DataTypes.STRING(100),
            allowNull: true
        }
    }, {
        tableName: 'appointments',
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
                fields: ['appointment_date']
            },
            {
                fields: ['status']
            },
            {
                fields: ['appointment_date', 'appointment_time']
            }
        ]
    });

    Appointment.associate = function (models) {
        // Appointment belongs to patient
        Appointment.belongsTo(models.Patient, {
            foreignKey: 'patient_id',
            as: 'patient'
        });

        // Appointment belongs to doctor
        Appointment.belongsTo(models.Doctor, {
            foreignKey: 'doctor_id',
            as: 'doctor'
        });

        // Appointment scheduled by user
        Appointment.belongsTo(models.User, {
            foreignKey: 'scheduled_by_user_id',
            as: 'scheduledBy'
        });
    };

    return Appointment;
};