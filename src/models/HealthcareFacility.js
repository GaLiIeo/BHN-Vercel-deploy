module.exports = (sequelize, DataTypes) => {
    const HealthcareFacility = sequelize.define('HealthcareFacility', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        facility_type: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        address: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        city: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        state: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        zip_code: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        phone: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: true,
            validate: {
                isEmail: true
            }
        },
        website: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        emergency_services: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        services_offered: {
            type: DataTypes.ARRAY(DataTypes.TEXT),
            allowNull: true
        },
        operating_hours: {
            type: DataTypes.JSONB,
            allowNull: true
        }
    }, {
        tableName: 'healthcare_facilities',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            {
                fields: ['name']
            },
            {
                fields: ['facility_type']
            },
            {
                fields: ['city', 'state']
            }
        ]
    });

    HealthcareFacility.associate = function (models) {
        // HealthcareFacility has many health records
        HealthcareFacility.hasMany(models.HealthRecord, {
            foreignKey: 'facility_id',
            as: 'healthRecords'
        });

        // HealthcareFacility has many appointments
        HealthcareFacility.hasMany(models.Appointment, {
            foreignKey: 'facility_id',
            as: 'appointments'
        });
    };

    return HealthcareFacility;
};