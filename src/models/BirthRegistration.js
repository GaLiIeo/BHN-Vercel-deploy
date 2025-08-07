module.exports = (sequelize, DataTypes) => {
    const BirthRegistration = sequelize.define('BirthRegistration', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        bhn_id: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true
        },
        // Child information
        child_first_name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        child_last_name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        child_middle_name: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        child_gender: {
            type: DataTypes.ENUM('male', 'female', 'other', 'prefer_not_to_say'),
            allowNull: true
        },
        birth_date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        birth_time: {
            type: DataTypes.TIME,
            allowNull: true
        },
        birth_weight: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true
        },
        birth_length: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true
        },
        birth_location: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        birth_hospital_id: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'healthcare_facilities',
                key: 'id'
            }
        },
        // Mother information
        mother_first_name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        mother_last_name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        mother_maiden_name: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        mother_date_of_birth: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        mother_place_of_birth: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        mother_occupation: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        mother_address: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        // Father information
        father_first_name: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        father_last_name: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        father_date_of_birth: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        father_place_of_birth: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        father_occupation: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        father_address: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        // Registration details
        registration_status: {
            type: DataTypes.ENUM('pending', 'approved', 'rejected', 'requires_review'),
            defaultValue: 'pending'
        },
        registered_by_user_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        reviewed_by_user_id: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        approval_date: {
            type: DataTypes.DATE,
            allowNull: true
        },
        rejection_reason: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        registration_number: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        // Medical information
        delivery_type: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        complications: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        apgar_score_1min: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                min: 0,
                max: 10
            }
        },
        apgar_score_5min: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                min: 0,
                max: 10
            }
        },
        attending_physician_id: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'doctors',
                key: 'id'
            }
        }
    }, {
        tableName: 'birth_registrations',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            {
                unique: true,
                fields: ['bhn_id']
            },
            {
                fields: ['registration_status']
            },
            {
                fields: ['birth_date']
            },
            {
                fields: ['registered_by_user_id']
            }
        ]
    });

    BirthRegistration.associate = function (models) {
        // BirthRegistration belongs to birth hospital
        BirthRegistration.belongsTo(models.HealthcareFacility, {
            foreignKey: 'birth_hospital_id',
            as: 'birthHospital'
        });

        // BirthRegistration belongs to attending physician
        BirthRegistration.belongsTo(models.Doctor, {
            foreignKey: 'attending_physician_id',
            as: 'attendingPhysician'
        });

        // BirthRegistration belongs to registering user
        BirthRegistration.belongsTo(models.User, {
            foreignKey: 'registered_by_user_id',
            as: 'registeredBy'
        });

        // BirthRegistration belongs to reviewing user
        BirthRegistration.belongsTo(models.User, {
            foreignKey: 'reviewed_by_user_id',
            as: 'reviewedBy'
        });

        // BirthRegistration has many documents
        BirthRegistration.hasMany(models.Document, {
            foreignKey: 'birth_registration_id',
            as: 'documents'
        });
    };

    return BirthRegistration;
};