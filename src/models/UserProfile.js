module.exports = (sequelize, DataTypes) => {
    const UserProfile = sequelize.define('UserProfile', {
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
        first_name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                len: [1, 100]
            }
        },
        last_name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                len: [1, 100]
            }
        },
        middle_name: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        date_of_birth: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        gender: {
            type: DataTypes.ENUM('male', 'female', 'other', 'prefer_not_to_say'),
            allowNull: true
        },
        phone: {
            type: DataTypes.STRING(20),
            allowNull: true,
            validate: {
                is: /^[\+]?[1-9][\d]{0,15}$/
            }
        },
        address: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        city: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        state: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        zip_code: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        country: {
            type: DataTypes.STRING(100),
            defaultValue: 'Canada'
        },
        emergency_contact_name: {
            type: DataTypes.STRING(200),
            allowNull: true
        },
        emergency_contact_phone: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        emergency_contact_relationship: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        profile_image_url: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        timezone: {
            type: DataTypes.STRING(50),
            defaultValue: 'America/Toronto'
        },
        language_preference: {
            type: DataTypes.STRING(10),
            defaultValue: 'en'
        }
    }, {
        tableName: 'user_profiles',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            {
                fields: ['user_id']
            },
            {
                fields: ['first_name', 'last_name']
            }
        ]
    });

    UserProfile.associate = function (models) {
        // Profile belongs to user
        UserProfile.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user'
        });
    };

    return UserProfile;
};