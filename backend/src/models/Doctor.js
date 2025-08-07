module.exports = (sequelize, DataTypes) => {
    const Doctor = sequelize.define('Doctor', {
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
            }
        },
        license_number: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },
        specialization: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        sub_specialties: {
            type: DataTypes.ARRAY(DataTypes.TEXT),
            allowNull: true
        },
        years_of_experience: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        education: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        certifications: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        bio: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        hospital_affiliations: {
            type: DataTypes.JSONB,
            allowNull: true
        },
        office_hours: {
            type: DataTypes.JSONB,
            allowNull: true
        },
        accepting_new_patients: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        consultation_fee: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true
        },
        languages_spoken: {
            type: DataTypes.ARRAY(DataTypes.TEXT),
            allowNull: true
        }
    }, {
        tableName: 'doctors',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            {
                unique: true,
                fields: ['license_number']
            },
            {
                fields: ['user_id']
            },
            {
                fields: ['specialization']
            }
        ]
    });

    Doctor.associate = function (models) {
        // Doctor belongs to user
        Doctor.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user'
        });

        // Doctor has many patients
        Doctor.hasMany(models.Patient, {
            foreignKey: 'primary_doctor_id',
            as: 'patients'
        });

        // Doctor has many health records
        Doctor.hasMany(models.HealthRecord, {
            foreignKey: 'doctor_id',
            as: 'healthRecords'
        });

        // Doctor has many appointments
        Doctor.hasMany(models.Appointment, {
            foreignKey: 'doctor_id',
            as: 'appointments'
        });

        // Doctor can prescribe medications
        Doctor.hasMany(models.Medication, {
            foreignKey: 'prescribed_by_doctor_id',
            as: 'prescribedMedications'
        });
    };

    return Doctor;
};