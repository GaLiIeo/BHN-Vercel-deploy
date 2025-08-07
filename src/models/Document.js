module.exports = (sequelize, DataTypes) => {
    const Document = sequelize.define('Document', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        uploaded_by_user_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        patient_id: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'patients',
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
        birth_registration_id: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'birth_registrations',
                key: 'id'
            }
        },
        filename: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        original_filename: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        file_path: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        file_size: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        mime_type: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        document_type: {
            type: DataTypes.ENUM('birth_certificate', 'medical_record', 'lab_result', 'prescription', 'insurance_card', 'id_document', 'consent_form', 'image', 'other'),
            allowNull: false
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        is_encrypted: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        encryption_key_id: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        s3_bucket: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        s3_key: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        s3_version_id: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        is_public: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        access_level: {
            type: DataTypes.STRING(50),
            defaultValue: 'private'
        }
    }, {
        tableName: 'documents',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            {
                fields: ['uploaded_by_user_id']
            },
            {
                fields: ['patient_id']
            },
            {
                fields: ['health_record_id']
            },
            {
                fields: ['document_type']
            }
        ]
    });

    Document.associate = function (models) {
        // Document belongs to a user who uploaded it
        Document.belongsTo(models.User, {
            foreignKey: 'uploaded_by_user_id',
            as: 'uploadedBy'
        });

        // Document belongs to a patient
        Document.belongsTo(models.Patient, {
            foreignKey: 'patient_id',
            as: 'patient'
        });

        // Document belongs to a health record
        Document.belongsTo(models.HealthRecord, {
            foreignKey: 'health_record_id',
            as: 'healthRecord'
        });
    };

    return Document;
};