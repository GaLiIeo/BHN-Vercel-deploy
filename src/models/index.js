const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

// Import all models
const User = require('./User');
const UserProfile = require('./UserProfile');
const Patient = require('./Patient');
const Doctor = require('./Doctor');
const HealthRecord = require('./HealthRecord');
const Appointment = require('./Appointment');
const Document = require('./Document');
const Medication = require('./Medication');
const HealthcareFacility = require('./HealthcareFacility');
const BirthRegistration = require('./BirthRegistration');

// Initialize models
const models = {
    User: User(sequelize, DataTypes),
    UserProfile: UserProfile(sequelize, DataTypes),
    Patient: Patient(sequelize, DataTypes),
    Doctor: Doctor(sequelize, DataTypes),
    HealthRecord: HealthRecord(sequelize, DataTypes),
    Appointment: Appointment(sequelize, DataTypes),
    Document: Document(sequelize, DataTypes),
    Medication: Medication(sequelize, DataTypes),
    HealthcareFacility: HealthcareFacility(sequelize, DataTypes),
    BirthRegistration: BirthRegistration(sequelize, DataTypes)
};

// Define associations
Object.keys(models).forEach(modelName => {
    if (models[modelName].associate) {
        models[modelName].associate(models);
    }
});

// Add sequelize instance to models
models.sequelize = sequelize;
models.Sequelize = require('sequelize');

module.exports = models;