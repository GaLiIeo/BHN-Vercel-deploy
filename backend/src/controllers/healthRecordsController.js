const { HealthRecord, Patient, User, UserProfile, Doctor, Medication } = require('../models');
const { ValidationError, NotFoundError, ForbiddenError } = require('../middleware/errorHandler');
const { Op } = require('sequelize');

/**
 * Get health records with HIPAA/PIPEDA compliance
 */
const getRecords = async (req, res, next) => {
    try {
        const {
            bhnId,
            patientId,
            recordType,
            urgencyLevel,
            startDate,
            endDate,
            limit = 20,
            offset = 0
        } = req.query;

        let whereClause = {};
        let patientWhereClause = {};

        // HIPAA/PIPEDA Compliance: Only search by BHN ID for privacy
        if (bhnId) {
            patientWhereClause.bhn_id = bhnId;
        } else if (patientId && (req.userType === 'doctor' || req.userType === 'admin')) {
            whereClause.patient_id = patientId;
        } else if (req.userType === 'patient') {
            // Patients can only see their own records
            const patient = await Patient.findOne({ where: { user_id: req.userId } });
            if (patient) {
                whereClause.patient_id = patient.id;
            } else {
                return res.json({ success: true, data: [] });
            }
        }

        // Additional filters
        if (recordType) {
            whereClause.record_type = recordType;
        }

        if (urgencyLevel) {
            whereClause.urgency_level = urgencyLevel;
        }

        if (startDate && endDate) {
            whereClause.visit_date = {
                [Op.between]: [startDate, endDate]
            };
        }

        const records = await HealthRecord.findAll({
            where: whereClause,
            include: [
                {
                    model: Patient,
                    as: 'patient',
                    where: Object.keys(patientWhereClause).length ? patientWhereClause : undefined,
                    include: [
                        {
                            model: User,
                            as: 'user',
                            include: [
                                {
                                    model: UserProfile,
                                    as: 'profile'
                                }
                            ]
                        }
                    ]
                },
                {
                    model: Doctor,
                    as: 'doctor',
                    include: [
                        {
                            model: User,
                            as: 'user',
                            include: [
                                {
                                    model: UserProfile,
                                    as: 'profile'
                                }
                            ]
                        }
                    ]
                },
                {
                    model: Medication,
                    as: 'medications'
                }
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['visit_date', 'DESC'], ['created_at', 'DESC']]
        });

        // Sanitize data for HIPAA/PIPEDA compliance
        const sanitizedRecords = records.map(record => {
            const sanitized = {
                id: record.id,
                recordType: record.record_type,
                title: record.title,
                description: record.description,
                visitDate: record.visit_date,
                visitTime: record.visit_time,
                urgencyLevel: record.urgency_level,
                status: record.record_status,
                createdAt: record.created_at
            };

            // Add patient info only if authorized
            if (req.userType === 'doctor' || req.userType === 'admin' || bhnId) {
                sanitized.patient = {
                    bhnId: record.patient?.bhn_id,
                    firstName: record.patient?.user?.profile?.first_name,
                    lastName: record.patient?.user?.profile?.last_name
                };
            }

            // Add doctor info (anonymized for patients)
            if (record.doctor) {
                sanitized.doctor = {
                    name: req.userType === 'patient'
                        ? 'Healthcare Provider'
                        : `Dr. ${record.doctor.user?.profile?.first_name} ${record.doctor.user?.profile?.last_name}`,
                    specialization: record.doctor.specialization
                };
            }

            // Add clinical data only for authorized users
            if (req.userType === 'doctor' || req.userType === 'admin' ||
                (req.userType === 'patient' && record.patient?.user_id === req.userId)) {
                sanitized.diagnosis = record.diagnosis;
                sanitized.treatmentPlan = record.treatment_plan;
                sanitized.notes = record.notes;
                sanitized.vitalSigns = record.vital_signs;
                sanitized.followUpDate = record.follow_up_date;
                sanitized.followUpInstructions = record.follow_up_instructions;
                sanitized.medications = record.medications;
            }

            return sanitized;
        });

        res.json({
            success: true,
            data: sanitizedRecords,
            meta: {
                total: sanitizedRecords.length,
                limit: parseInt(limit),
                offset: parseInt(offset)
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Create comprehensive health record
 */
const createRecord = async (req, res, next) => {
    try {
        const {
            patientId,
            recordType,
            title,
            description,
            diagnosis,
            treatmentPlan,
            notes,
            visitDate,
            visitTime,
            urgencyLevel = 'normal',
            followUpDate,
            followUpInstructions,
            vitalSigns,
            medications = []
        } = req.body;

        // Validate required fields
        if (!patientId || !recordType || !title || !visitDate) {
            throw new ValidationError('Missing required fields: patientId, recordType, title, visitDate');
        }

        // Verify patient exists and user has permission
        const patient = await Patient.findByPk(patientId);
        if (!patient) {
            throw new NotFoundError('Patient');
        }

        // Authorization check
        if (req.userType === 'patient' && patient.user_id !== req.userId) {
            throw new ForbiddenError('Cannot create records for other patients');
        }

        // Get doctor ID if user is a doctor
        let doctorId = null;
        if (req.userType === 'doctor') {
            const doctor = await Doctor.findOne({ where: { user_id: req.userId } });
            doctorId = doctor?.id;
        }

        // Validate and structure vital signs
        let structuredVitalSigns = null;
        if (vitalSigns) {
            structuredVitalSigns = {
                bloodPressure: vitalSigns.bloodPressure || {},
                heartRate: vitalSigns.heartRate || null,
                temperature: vitalSigns.temperature || null,
                weight: vitalSigns.weight || null,
                height: vitalSigns.height || null,
                oxygenSaturation: vitalSigns.oxygenSaturation || null,
                respiratoryRate: vitalSigns.respiratoryRate || null,
                bmi: vitalSigns.bmi || null,
                painLevel: vitalSigns.painLevel || null,
                glucoseLevel: vitalSigns.glucoseLevel || null,
                symptoms: vitalSigns.symptoms || [],
                timestamp: new Date()
            };

            // Calculate BMI if height and weight are provided
            if (vitalSigns.height && vitalSigns.weight) {
                const heightInMeters = parseFloat(vitalSigns.height) / 100;
                const weightInKg = parseFloat(vitalSigns.weight);
                structuredVitalSigns.bmi = (weightInKg / (heightInMeters * heightInMeters)).toFixed(1);
            }
        }

        // Create health record in transaction
        const sequelize = require('../config/database');
        const result = await sequelize.transaction(async (t) => {
            // Create health record
            const record = await HealthRecord.create({
                patient_id: patientId,
                doctor_id: doctorId,
                record_type: recordType,
                urgency_level: urgencyLevel,
                title,
                description,
                diagnosis,
                treatment_plan: treatmentPlan,
                notes,
                vital_signs: structuredVitalSigns,
                visit_date: visitDate,
                visit_time: visitTime,
                follow_up_date: followUpDate,
                follow_up_instructions: followUpInstructions
            }, { transaction: t });

            // Add medications if provided
            const createdMedications = [];
            if (medications && medications.length > 0) {
                for (const med of medications) {
                    if (med.name && med.dosage && med.frequency) {
                        const medication = await Medication.create({
                            patient_id: patientId,
                            prescribed_by_doctor_id: doctorId,
                            health_record_id: record.id,
                            medication_name: med.name,
                            dosage: med.dosage,
                            frequency: med.frequency,
                            duration: med.duration,
                            instructions: med.instructions,
                            side_effects: med.sideEffects,
                            start_date: med.startDate || visitDate,
                            end_date: med.endDate,
                            is_active: med.isActive !== false
                        }, { transaction: t });
                        createdMedications.push(medication);
                    }
                }
            }

            return { record, medications: createdMedications };
        });

        // Fetch complete record with associations
        const completeRecord = await HealthRecord.findByPk(result.record.id, {
            include: [
                {
                    model: Patient,
                    as: 'patient',
                    include: [
                        {
                            model: User,
                            as: 'user',
                            include: [{ model: UserProfile, as: 'profile' }]
                        }
                    ]
                },
                {
                    model: Medication,
                    as: 'medications'
                }
            ]
        });

        res.status(201).json({
            success: true,
            data: completeRecord,
            message: 'Health record created successfully'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update health record
 */
const updateRecord = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const record = await HealthRecord.findByPk(id, {
            include: [{ model: Patient, as: 'patient' }]
        });

        if (!record) {
            throw new NotFoundError('Health record');
        }

        // Authorization check
        if (req.userType === 'patient' && record.patient.user_id !== req.userId) {
            throw new ForbiddenError('Cannot update records for other patients');
        }

        // Update record
        await record.update(updateData);

        res.json({
            success: true,
            data: record,
            message: 'Health record updated successfully'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get vital signs trends
 */
const getVitalSignsTrends = async (req, res, next) => {
    try {
        const { patientId, days = 30 } = req.query;

        if (!patientId) {
            throw new ValidationError('Patient ID is required');
        }

        const patient = await Patient.findByPk(patientId);
        if (!patient) {
            throw new NotFoundError('Patient');
        }

        // Authorization check
        if (req.userType === 'patient' && patient.user_id !== req.userId) {
            throw new ForbiddenError('Cannot access data for other patients');
        }

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(days));

        const records = await HealthRecord.findAll({
            where: {
                patient_id: patientId,
                visit_date: {
                    [Op.gte]: startDate
                },
                vital_signs: {
                    [Op.ne]: null
                }
            },
            attributes: ['visit_date', 'vital_signs'],
            order: [['visit_date', 'ASC']]
        });

        // Process trends data
        const trends = {
            bloodPressure: [],
            heartRate: [],
            temperature: [],
            weight: [],
            bmi: [],
            oxygenSaturation: []
        };

        records.forEach(record => {
            const date = record.visit_date;
            const vitals = record.vital_signs;

            if (vitals.bloodPressure) {
                trends.bloodPressure.push({
                    date,
                    systolic: vitals.bloodPressure.systolic,
                    diastolic: vitals.bloodPressure.diastolic
                });
            }

            if (vitals.heartRate) {
                trends.heartRate.push({ date, value: vitals.heartRate });
            }

            if (vitals.temperature) {
                trends.temperature.push({ date, value: vitals.temperature });
            }

            if (vitals.weight) {
                trends.weight.push({ date, value: vitals.weight });
            }

            if (vitals.bmi) {
                trends.bmi.push({ date, value: vitals.bmi });
            }

            if (vitals.oxygenSaturation) {
                trends.oxygenSaturation.push({ date, value: vitals.oxygenSaturation });
            }
        });

        res.json({
            success: true,
            data: trends,
            meta: {
                patientId,
                days: parseInt(days),
                recordCount: records.length
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getRecords,
    createRecord,
    updateRecord,
    getVitalSignsTrends
};