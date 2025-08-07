import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Button,
    Stepper,
    Step,
    StepLabel,
    StepContent,
    Tabs,
    Tab,
    Autocomplete,
    Slider,
    Switch,
    FormControlLabel,
    Alert,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Paper,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    IconButton,
    Divider,
    Stack
} from '@mui/material';
import {
    ExpandMore as ExpandMoreIcon,
    Favorite as HeartIcon,
    Thermostat as TempIcon,
    Scale as WeightIcon,
    Height as HeightIcon,
    Bloodtype as BloodIcon,
    Medication as MedicationIcon,
    Add as AddIcon,
    Remove as RemoveIcon,
    Warning as WarningIcon,
    CheckCircle as CheckIcon
} from '@mui/icons-material';

const ComprehensiveHealthForm = ({ open, onClose, onSubmit, patientsList = [] }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState({
        // Basic Information
        patientId: '',
        recordType: 'consultation',
        title: '',
        description: '',
        visitDate: new Date().toISOString().split('T')[0],
        visitTime: new Date().toTimeString().slice(0, 5),
        urgencyLevel: 'normal',

        // Vital Signs
        vitalSigns: {
            bloodPressure: { systolic: '', diastolic: '' },
            heartRate: '',
            temperature: '',
            weight: '',
            height: '',
            oxygenSaturation: '',
            respiratoryRate: '',
            painLevel: 0,
            glucoseLevel: '',
            symptoms: []
        },

        // Clinical Assessment
        diagnosis: '',
        treatmentPlan: '',
        notes: '',
        followUpDate: '',
        followUpInstructions: '',

        // Medications
        medications: []
    });

    const [calculatedBMI, setCalculatedBMI] = useState(null);
    const [vitalSignsStatus, setVitalSignsStatus] = useState({});

    // Record types with comprehensive options
    const recordTypes = [
        { value: 'consultation', label: 'General Consultation', icon: <HeartIcon /> },
        { value: 'prenatal', label: 'Prenatal Care', icon: <HeartIcon /> },
        { value: 'vaccination', label: 'Vaccination', icon: <MedicationIcon /> },
        { value: 'emergency', label: 'Emergency Visit', icon: <WarningIcon /> },
        { value: 'mental_health', label: 'Mental Health', icon: <HeartIcon /> },
        { value: 'physical_therapy', label: 'Physical Therapy', icon: <HeightIcon /> },
        { value: 'nutrition', label: 'Nutrition Consultation', icon: <WeightIcon /> },
        { value: 'lab_results', label: 'Laboratory Results', icon: <BloodIcon /> },
        { value: 'vital_signs', label: 'Vital Signs Check', icon: <TempIcon /> }
    ];

    const urgencyLevels = [
        { value: 'low', label: 'Low Priority', color: '#4CAF50' },
        { value: 'normal', label: 'Normal', color: '#2196F3' },
        { value: 'high', label: 'High Priority', color: '#FF9800' },
        { value: 'urgent', label: 'Urgent', color: '#F44336' },
        { value: 'critical', label: 'Critical', color: '#9C27B0' }
    ];

    const commonSymptoms = [
        'Fever', 'Headache', 'Nausea', 'Fatigue', 'Shortness of breath',
        'Chest pain', 'Abdominal pain', 'Dizziness', 'Cough', 'Sore throat',
        'Back pain', 'Joint pain', 'Insomnia', 'Loss of appetite', 'Rash',
        'Swelling', 'Numbness', 'Blurred vision', 'Hearing loss', 'Memory issues'
    ];

    const steps = [
        'Basic Information',
        'Vital Signs',
        'Clinical Assessment',
        'Medications',
        'Review & Submit'
    ];

    // Calculate BMI when height and weight change
    useEffect(() => {
        const { height, weight } = formData.vitalSigns;
        if (height && weight) {
            const heightInMeters = parseFloat(height) / 100;
            const weightInKg = parseFloat(weight);
            const bmi = weightInKg / (heightInMeters * heightInMeters);
            setCalculatedBMI(bmi.toFixed(1));
        } else {
            setCalculatedBMI(null);
        }
    }, [formData.vitalSigns.height, formData.vitalSigns.weight]);

    // Assess vital signs status
    useEffect(() => {
        const { bloodPressure, heartRate, temperature, oxygenSaturation } = formData.vitalSigns;
        const status = {};

        // Blood pressure assessment
        if (bloodPressure.systolic && bloodPressure.diastolic) {
            const sys = parseInt(bloodPressure.systolic);
            const dia = parseInt(bloodPressure.diastolic);
            if (sys < 120 && dia < 80) status.bloodPressure = { level: 'normal', color: '#4CAF50' };
            else if (sys <= 129 && dia < 80) status.bloodPressure = { level: 'elevated', color: '#FF9800' };
            else if (sys >= 140 || dia >= 90) status.bloodPressure = { level: 'high', color: '#F44336' };
            else status.bloodPressure = { level: 'stage 1', color: '#FF5722' };
        }

        // Heart rate assessment
        if (heartRate) {
            const hr = parseInt(heartRate);
            if (hr >= 60 && hr <= 100) status.heartRate = { level: 'normal', color: '#4CAF50' };
            else if (hr < 60) status.heartRate = { level: 'low', color: '#FF9800' };
            else status.heartRate = { level: 'high', color: '#F44336' };
        }

        // Temperature assessment
        if (temperature) {
            const temp = parseFloat(temperature);
            if (temp >= 36.1 && temp <= 37.2) status.temperature = { level: 'normal', color: '#4CAF50' };
            else if (temp < 36.1) status.temperature = { level: 'low', color: '#2196F3' };
            else status.temperature = { level: 'fever', color: '#F44336' };
        }

        // Oxygen saturation assessment
        if (oxygenSaturation) {
            const o2 = parseInt(oxygenSaturation);
            if (o2 >= 95) status.oxygenSaturation = { level: 'normal', color: '#4CAF50' };
            else if (o2 >= 90) status.oxygenSaturation = { level: 'low', color: '#FF9800' };
            else status.oxygenSaturation = { level: 'critical', color: '#F44336' };
        }

        setVitalSignsStatus(status);
    }, [formData.vitalSigns]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleVitalSignChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            vitalSigns: {
                ...prev.vitalSigns,
                [field]: value
            }
        }));
    };

    const addMedication = () => {
        setFormData(prev => ({
            ...prev,
            medications: [...prev.medications, {
                name: '',
                dosage: '',
                frequency: '',
                duration: '',
                instructions: '',
                startDate: new Date().toISOString().split('T')[0],
                isActive: true
            }]
        }));
    };

    const removeMedication = (index) => {
        setFormData(prev => ({
            ...prev,
            medications: prev.medications.filter((_, i) => i !== index)
        }));
    };

    const updateMedication = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            medications: prev.medications.map((med, i) =>
                i === index ? { ...med, [field]: value } : med
            )
        }));
    };

    const handleNext = () => {
        setActiveStep(prev => prev + 1);
    };

    const handleBack = () => {
        setActiveStep(prev => prev - 1);
    };

    const handleSubmit = () => {
        const submitData = {
            ...formData,
            vitalSigns: {
                ...formData.vitalSigns,
                bmi: calculatedBMI
            }
        };
        onSubmit(submitData);
    };

    const renderBasicInformation = () => (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Autocomplete
                    fullWidth
                    options={patientsList}
                    getOptionLabel={(option) => `${option.user?.firstName} ${option.user?.lastName} (${option.bhnId})`}
                    value={patientsList.find(p => p.id === formData.patientId) || null}
                    onChange={(e, newValue) => handleInputChange('patientId', newValue?.id || '')}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Select Patient"
                            required
                            helperText="Search by name or BHN ID"
                        />
                    )}
                    renderOption={(props, option) => (
                        <Box component="li" {...props}>
                            <Box>
                                <Typography variant="body1">
                                    {option.user?.firstName} {option.user?.lastName}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    BHN ID: {option.bhnId} • {option.user?.email}
                                </Typography>
                            </Box>
                        </Box>
                    )}
                />
            </Grid>

            <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                    <InputLabel>Record Type</InputLabel>
                    <Select
                        value={formData.recordType}
                        onChange={(e) => handleInputChange('recordType', e.target.value)}
                        label="Record Type"
                    >
                        {recordTypes.map((type) => (
                            <MenuItem key={type.value} value={type.value}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    {type.icon}
                                    {type.label}
                                </Box>
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                    <InputLabel>Urgency Level</InputLabel>
                    <Select
                        value={formData.urgencyLevel}
                        onChange={(e) => handleInputChange('urgencyLevel', e.target.value)}
                        label="Urgency Level"
                    >
                        {urgencyLevels.map((level) => (
                            <MenuItem key={level.value} value={level.value}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Box
                                        sx={{
                                            width: 12,
                                            height: 12,
                                            borderRadius: '50%',
                                            backgroundColor: level.color
                                        }}
                                    />
                                    {level.label}
                                </Box>
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>

            <Grid item xs={12}>
                <TextField
                    fullWidth
                    required
                    label="Record Title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., Annual Physical Exam, Follow-up Consultation"
                />
            </Grid>

            <Grid item xs={12}>
                <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Brief description of the visit or condition"
                />
            </Grid>

            <Grid item xs={12} md={6}>
                <TextField
                    fullWidth
                    required
                    type="date"
                    label="Visit Date"
                    value={formData.visitDate}
                    onChange={(e) => handleInputChange('visitDate', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                />
            </Grid>

            <Grid item xs={12} md={6}>
                <TextField
                    fullWidth
                    type="time"
                    label="Visit Time"
                    value={formData.visitTime}
                    onChange={(e) => handleInputChange('visitTime', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                />
            </Grid>
        </Grid>
    );

    const renderVitalSigns = () => (
        <Grid container spacing={3}>
            {/* Blood Pressure */}
            <Grid item xs={12}>
                <Card variant="outlined">
                    <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <BloodIcon />
                            Blood Pressure
                            {vitalSignsStatus.bloodPressure && (
                                <Chip
                                    label={vitalSignsStatus.bloodPressure.level}
                                    size="small"
                                    sx={{
                                        backgroundColor: vitalSignsStatus.bloodPressure.color,
                                        color: 'white'
                                    }}
                                />
                            )}
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Systolic"
                                    value={formData.vitalSigns.bloodPressure.systolic}
                                    onChange={(e) => handleVitalSignChange('bloodPressure', {
                                        ...formData.vitalSigns.bloodPressure,
                                        systolic: e.target.value
                                    })}
                                    InputProps={{ endAdornment: 'mmHg' }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Diastolic"
                                    value={formData.vitalSigns.bloodPressure.diastolic}
                                    onChange={(e) => handleVitalSignChange('bloodPressure', {
                                        ...formData.vitalSigns.bloodPressure,
                                        diastolic: e.target.value
                                    })}
                                    InputProps={{ endAdornment: 'mmHg' }}
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>

            {/* Heart Rate and Temperature */}
            <Grid item xs={12} md={6}>
                <Card variant="outlined">
                    <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <HeartIcon />
                            Heart Rate
                            {vitalSignsStatus.heartRate && (
                                <Chip
                                    label={vitalSignsStatus.heartRate.level}
                                    size="small"
                                    sx={{
                                        backgroundColor: vitalSignsStatus.heartRate.color,
                                        color: 'white'
                                    }}
                                />
                            )}
                        </Typography>
                        <TextField
                            fullWidth
                            type="number"
                            value={formData.vitalSigns.heartRate}
                            onChange={(e) => handleVitalSignChange('heartRate', e.target.value)}
                            InputProps={{ endAdornment: 'bpm' }}
                            placeholder="60-100 normal"
                        />
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12} md={6}>
                <Card variant="outlined">
                    <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <TempIcon />
                            Temperature
                            {vitalSignsStatus.temperature && (
                                <Chip
                                    label={vitalSignsStatus.temperature.level}
                                    size="small"
                                    sx={{
                                        backgroundColor: vitalSignsStatus.temperature.color,
                                        color: 'white'
                                    }}
                                />
                            )}
                        </Typography>
                        <TextField
                            fullWidth
                            type="number"
                            step="0.1"
                            value={formData.vitalSigns.temperature}
                            onChange={(e) => handleVitalSignChange('temperature', e.target.value)}
                            InputProps={{ endAdornment: '°C' }}
                            placeholder="36.1-37.2 normal"
                        />
                    </CardContent>
                </Card>
            </Grid>

            {/* Weight and Height */}
            <Grid item xs={12} md={6}>
                <Card variant="outlined">
                    <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <WeightIcon />
                            Weight
                        </Typography>
                        <TextField
                            fullWidth
                            type="number"
                            step="0.1"
                            value={formData.vitalSigns.weight}
                            onChange={(e) => handleVitalSignChange('weight', e.target.value)}
                            InputProps={{ endAdornment: 'kg' }}
                        />
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12} md={6}>
                <Card variant="outlined">
                    <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <HeightIcon />
                            Height
                        </Typography>
                        <TextField
                            fullWidth
                            type="number"
                            value={formData.vitalSigns.height}
                            onChange={(e) => handleVitalSignChange('height', e.target.value)}
                            InputProps={{ endAdornment: 'cm' }}
                        />
                        {calculatedBMI && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                BMI: {calculatedBMI}
                            </Typography>
                        )}
                    </CardContent>
                </Card>
            </Grid>

            {/* Additional Vitals */}
            <Grid item xs={12} md={6}>
                <TextField
                    fullWidth
                    type="number"
                    label="Oxygen Saturation"
                    value={formData.vitalSigns.oxygenSaturation}
                    onChange={(e) => handleVitalSignChange('oxygenSaturation', e.target.value)}
                    InputProps={{ endAdornment: '%' }}
                    placeholder="95-100 normal"
                />
            </Grid>

            <Grid item xs={12} md={6}>
                <TextField
                    fullWidth
                    type="number"
                    label="Respiratory Rate"
                    value={formData.vitalSigns.respiratoryRate}
                    onChange={(e) => handleVitalSignChange('respiratoryRate', e.target.value)}
                    InputProps={{ endAdornment: '/min' }}
                    placeholder="12-20 normal"
                />
            </Grid>

            <Grid item xs={12} md={6}>
                <TextField
                    fullWidth
                    type="number"
                    label="Glucose Level"
                    value={formData.vitalSigns.glucoseLevel}
                    onChange={(e) => handleVitalSignChange('glucoseLevel', e.target.value)}
                    InputProps={{ endAdornment: 'mg/dL' }}
                    placeholder="70-100 fasting"
                />
            </Grid>

            {/* Pain Level */}
            <Grid item xs={12} md={6}>
                <Typography gutterBottom>Pain Level (0-10)</Typography>
                <Slider
                    value={formData.vitalSigns.painLevel}
                    onChange={(e, value) => handleVitalSignChange('painLevel', value)}
                    min={0}
                    max={10}
                    marks
                    valueLabelDisplay="auto"
                />
            </Grid>

            {/* Symptoms */}
            <Grid item xs={12}>
                <Autocomplete
                    multiple
                    options={commonSymptoms}
                    value={formData.vitalSigns.symptoms}
                    onChange={(e, newValue) => handleVitalSignChange('symptoms', newValue)}
                    renderInput={(params) => (
                        <TextField {...params} label="Symptoms" placeholder="Select symptoms" />
                    )}
                    renderTags={(tagValue, getTagProps) =>
                        tagValue.map((option, index) => (
                            <Chip
                                label={option}
                                {...getTagProps({ index })}
                                key={index}
                                size="small"
                                color="primary"
                                variant="outlined"
                            />
                        ))
                    }
                />
            </Grid>
        </Grid>
    );

    const renderClinicalAssessment = () => (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Diagnosis"
                    value={formData.diagnosis}
                    onChange={(e) => handleInputChange('diagnosis', e.target.value)}
                    placeholder="Clinical diagnosis and assessment"
                />
            </Grid>

            <Grid item xs={12}>
                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Treatment Plan"
                    value={formData.treatmentPlan}
                    onChange={(e) => handleInputChange('treatmentPlan', e.target.value)}
                    placeholder="Recommended treatment and interventions"
                />
            </Grid>

            <Grid item xs={12}>
                <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Additional Notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Any additional observations or notes"
                />
            </Grid>

            <Grid item xs={12} md={6}>
                <TextField
                    fullWidth
                    type="date"
                    label="Follow-up Date (Optional)"
                    value={formData.followUpDate}
                    onChange={(e) => handleInputChange('followUpDate', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                />
            </Grid>

            <Grid item xs={12} md={6}>
                <TextField
                    fullWidth
                    label="Follow-up Instructions"
                    value={formData.followUpInstructions}
                    onChange={(e) => handleInputChange('followUpInstructions', e.target.value)}
                    placeholder="Instructions for follow-up care"
                />
            </Grid>
        </Grid>
    );

    const renderMedications = () => (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">Prescribed Medications</Typography>
                <Button
                    startIcon={<AddIcon />}
                    onClick={addMedication}
                    variant="outlined"
                    size="small"
                >
                    Add Medication
                </Button>
            </Box>

            {formData.medications.length === 0 ? (
                <Alert severity="info">No medications prescribed for this visit.</Alert>
            ) : (
                <Stack spacing={2}>
                    {formData.medications.map((medication, index) => (
                        <Paper key={index} sx={{ p: 2, border: '1px solid #e0e0e0' }}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Medication Name"
                                        value={medication.name}
                                        onChange={(e) => updateMedication(index, 'name', e.target.value)}
                                        size="small"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <TextField
                                        fullWidth
                                        label="Dosage"
                                        value={medication.dosage}
                                        onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                                        size="small"
                                        placeholder="e.g., 500mg"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <TextField
                                        fullWidth
                                        label="Frequency"
                                        value={medication.frequency}
                                        onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                                        size="small"
                                        placeholder="e.g., twice daily"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <TextField
                                        fullWidth
                                        label="Duration"
                                        value={medication.duration}
                                        onChange={(e) => updateMedication(index, 'duration', e.target.value)}
                                        size="small"
                                        placeholder="e.g., 7 days"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Instructions"
                                        value={medication.instructions}
                                        onChange={(e) => updateMedication(index, 'instructions', e.target.value)}
                                        size="small"
                                        placeholder="Take with food"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={2}>
                                    <TextField
                                        fullWidth
                                        type="date"
                                        label="Start Date"
                                        value={medication.startDate}
                                        onChange={(e) => updateMedication(index, 'startDate', e.target.value)}
                                        size="small"
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={1}>
                                    <IconButton
                                        onClick={() => removeMedication(index)}
                                        color="error"
                                        size="small"
                                    >
                                        <RemoveIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </Paper>
                    ))}
                </Stack>
            )}
        </Box>
    );

    const renderReview = () => (
        <Box>
            <Typography variant="h6" gutterBottom>Review Health Record</Typography>

            <Accordion expanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle1">Basic Information</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">Patient:</Typography>
                            <Typography variant="body1">
                                {patientsList.find(p => p.id === formData.patientId)?.user?.firstName} {' '}
                                {patientsList.find(p => p.id === formData.patientId)?.user?.lastName}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">Record Type:</Typography>
                            <Typography variant="body1">{recordTypes.find(r => r.value === formData.recordType)?.label}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">Visit Date:</Typography>
                            <Typography variant="body1">{formData.visitDate} {formData.visitTime}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">Urgency:</Typography>
                            <Chip
                                label={urgencyLevels.find(u => u.value === formData.urgencyLevel)?.label}
                                size="small"
                                sx={{
                                    backgroundColor: urgencyLevels.find(u => u.value === formData.urgencyLevel)?.color,
                                    color: 'white'
                                }}
                            />
                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion>

            {Object.values(formData.vitalSigns).some(value => value && value !== '') && (
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="subtitle1">Vital Signs</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container spacing={2}>
                            {formData.vitalSigns.bloodPressure.systolic && (
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="text.secondary">Blood Pressure:</Typography>
                                    <Typography variant="body1">
                                        {formData.vitalSigns.bloodPressure.systolic}/{formData.vitalSigns.bloodPressure.diastolic} mmHg
                                    </Typography>
                                </Grid>
                            )}
                            {formData.vitalSigns.heartRate && (
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="text.secondary">Heart Rate:</Typography>
                                    <Typography variant="body1">{formData.vitalSigns.heartRate} bpm</Typography>
                                </Grid>
                            )}
                            {calculatedBMI && (
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="text.secondary">BMI:</Typography>
                                    <Typography variant="body1">{calculatedBMI}</Typography>
                                </Grid>
                            )}
                        </Grid>
                    </AccordionDetails>
                </Accordion>
            )}

            {formData.medications.length > 0 && (
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="subtitle1">Medications ({formData.medications.length})</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <List>
                            {formData.medications.map((med, index) => (
                                <ListItem key={index}>
                                    <ListItemIcon>
                                        <MedicationIcon />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={med.name}
                                        secondary={`${med.dosage} - ${med.frequency} - ${med.duration}`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </AccordionDetails>
                </Accordion>
            )}
        </Box>
    );

    if (!open) return null;

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Comprehensive Health Record Entry
            </Typography>

            <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((label, index) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                        <StepContent>
                            <Box sx={{ mb: 2 }}>
                                {index === 0 && renderBasicInformation()}
                                {index === 1 && renderVitalSigns()}
                                {index === 2 && renderClinicalAssessment()}
                                {index === 3 && renderMedications()}
                                {index === 4 && renderReview()}
                            </Box>

                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                    disabled={index === 0}
                                    onClick={handleBack}
                                    variant="outlined"
                                >
                                    Back
                                </Button>

                                {index === steps.length - 1 ? (
                                    <Button
                                        onClick={handleSubmit}
                                        variant="contained"
                                        startIcon={<CheckIcon />}
                                    >
                                        Create Health Record
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={handleNext}
                                        variant="contained"
                                    >
                                        Next
                                    </Button>
                                )}

                                <Button
                                    onClick={onClose}
                                    variant="text"
                                >
                                    Cancel
                                </Button>
                            </Box>
                        </StepContent>
                    </Step>
                ))}
            </Stepper>
        </Box>
    );
};

export default ComprehensiveHealthForm;