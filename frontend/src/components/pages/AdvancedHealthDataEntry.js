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
    Stack,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Stepper,
    Step,
    StepLabel,
    LinearProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Rating,
    Checkbox,
    FormGroup,
    RadioGroup,
    Radio,
    FormLabel
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
    CheckCircle as CheckIcon,
    Search as SearchIcon,
    Psychology as BrainIcon,
    Visibility as EyeIcon,
    Hearing as EarIcon,
    Restaurant as NutritionIcon,
    DirectionsRun as ActivityIcon,
    Hotel as SleepIcon,
    SmokingRooms as SmokingIcon,
    LocalDrink as AlcoholIcon,
    ChildCare as PregnancyIcon,
    Science as LabIcon,
    Vaccines as VaccineIcon,
    LocalHospital as EmergencyIcon,
    AccessTime as TimeIcon
} from '@mui/icons-material';

const AdvancedHealthDataEntry = ({ open, onClose, onSubmit, patientsList = [], existingRecord = null }) => {
    const [activeTab, setActiveTab] = useState(0);
    const [researchDialog, setResearchDialog] = useState(false);
    const [loadingResearch, setLoadingResearch] = useState(false);

    const [formData, setFormData] = useState({
        // Basic Record Information
        patientId: existingRecord?.patientId || '',
        recordType: existingRecord?.recordType || 'consultation',
        title: existingRecord?.title || '',
        description: existingRecord?.description || '',
        visitDate: existingRecord?.visitDate || new Date().toISOString().split('T')[0],
        visitTime: existingRecord?.visitTime || new Date().toTimeString().slice(0, 5),
        urgencyLevel: existingRecord?.urgencyLevel || 'normal',

        // Comprehensive Vital Signs
        vitalSigns: {
            // Basic Vitals
            bloodPressure: { systolic: '', diastolic: '' },
            heartRate: '',
            temperature: '',
            weight: '',
            height: '',
            oxygenSaturation: '',
            respiratoryRate: '',

            // Advanced Vitals
            bloodSugar: '',
            cholesterolTotal: '',
            cholesterolLDL: '',
            cholesterolHDL: '',
            triglycerides: '',
            bmi: '',
            bodyFat: '',
            muscleMass: '',
            boneDensity: '',

            // Pain and Comfort
            painLevel: 0,
            painLocation: [],
            painType: '',
            painDuration: '',

            // Mental Health Indicators
            moodRating: 5,
            anxietyLevel: 0,
            stressLevel: 0,
            sleepQuality: 5,
            energyLevel: 5,

            // Physical Function
            mobilityLevel: 5,
            balanceScore: 5,
            strengthLevel: 5,
            enduranceLevel: 5,

            // Symptoms
            symptoms: [],
            symptomSeverity: {},
            symptomDuration: {},

            // Environmental
            environmentalFactors: [],
            occupationalHazards: [],

            timestamp: new Date().toISOString()
        },

        // Clinical Assessment
        diagnosis: existingRecord?.diagnosis || '',
        differentialDiagnosis: [],
        treatmentPlan: existingRecord?.treatmentPlan || '',
        notes: existingRecord?.notes || '',
        followUpDate: existingRecord?.followUpDate || '',
        followUpInstructions: existingRecord?.followUpInstructions || '',

        // Detailed Medical History
        medicalHistory: {
            allergies: [],
            chronicConditions: [],
            surgicalHistory: [],
            familyHistory: [],
            socialHistory: {
                smoking: { status: 'never', packsPerDay: 0, yearsSmoked: 0, quitDate: '' },
                alcohol: { frequency: 'never', drinksPerWeek: 0, type: '' },
                drugs: { status: 'never', substances: [], lastUse: '' },
                exercise: { frequency: 'sedentary', type: [], duration: '', intensity: '' },
                diet: { type: 'balanced', restrictions: [], supplements: [] },
                occupation: '',
                livingArrangement: '',
                socialSupport: '',
                stressFactors: []
            },
            reproductiveHistory: {
                pregnancies: 0,
                births: 0,
                miscarriages: 0,
                lastMenstrualPeriod: '',
                contraception: '',
                sexuallyActive: false
            }
        },

        // Physical Examination
        physicalExam: {
            general: {
                appearance: '',
                consciousness: 'alert',
                cooperation: 'cooperative',
                distress: 'none'
            },
            head: {
                shape: 'normal',
                hair: 'normal',
                scalp: 'normal'
            },
            eyes: {
                vision: '',
                pupils: 'normal',
                extraocularMovements: 'normal',
                conjunctiva: 'normal',
                sclera: 'normal'
            },
            ears: {
                hearing: '',
                tympanic: 'normal',
                canal: 'normal',
                wax: 'none'
            },
            nose: {
                patency: 'normal',
                septum: 'midline',
                turbinates: 'normal',
                discharge: 'none'
            },
            throat: {
                pharynx: 'normal',
                tonsils: 'normal',
                teeth: 'normal',
                gums: 'normal'
            },
            neck: {
                lymphNodes: 'normal',
                thyroid: 'normal',
                carotidPulses: 'normal',
                jugularVenousDistension: 'none'
            },
            chest: {
                shape: 'normal',
                expansion: 'symmetric',
                breathing: 'normal'
            },
            lungs: {
                breath_sounds: 'clear',
                percussion: 'resonant',
                tactileFremitus: 'normal'
            },
            heart: {
                rate: '',
                rhythm: 'regular',
                murmurs: 'none',
                gallops: 'none',
                rubs: 'none'
            },
            abdomen: {
                inspection: 'normal',
                bowelSounds: 'normal',
                palpation: 'soft',
                tenderness: 'none',
                masses: 'none',
                organomegaly: 'none'
            },
            extremities: {
                edema: 'none',
                pulses: 'normal',
                capillaryRefill: 'normal',
                deformities: 'none',
                strength: '5/5',
                reflexes: 'normal'
            },
            skin: {
                color: 'normal',
                temperature: 'normal',
                moisture: 'normal',
                turgor: 'normal',
                lesions: 'none'
            },
            neurological: {
                mentalStatus: 'normal',
                cranialNerves: 'normal',
                motor: 'normal',
                sensory: 'normal',
                coordination: 'normal',
                gait: 'normal'
            }
        },

        // Laboratory Results
        labResults: {
            bloodTests: [],
            urineTests: [],
            imagingStudies: [],
            biopsyResults: [],
            cultures: [],
            specializedTests: []
        },

        // Medications - Comprehensive
        medications: [],

        // Procedures and Interventions
        procedures: [],

        // Care Plan
        carePlan: {
            goals: [],
            interventions: [],
            patient_education: [],
            lifestyle_modifications: [],
            monitoring_plan: [],
            referrals: []
        },

        // Quality Measures
        qualityMetrics: {
            patient_satisfaction: 0,
            pain_improvement: 0,
            functional_improvement: 0,
            adherence_score: 0
        }
    });

    // Comprehensive medical data arrays
    const painLocations = [
        'Head', 'Neck', 'Shoulders', 'Arms', 'Chest', 'Upper Back', 'Lower Back',
        'Abdomen', 'Pelvis', 'Hips', 'Thighs', 'Knees', 'Calves', 'Ankles', 'Feet'
    ];

    const painTypes = [
        'Sharp', 'Dull', 'Throbbing', 'Burning', 'Stabbing', 'Cramping',
        'Aching', 'Shooting', 'Tingling', 'Numbness'
    ];

    const comprehensiveSymptoms = [
        // General
        'Fever', 'Chills', 'Night sweats', 'Fatigue', 'Weight loss', 'Weight gain',
        'Appetite loss', 'Malaise', 'Weakness',

        // Cardiovascular
        'Chest pain', 'Palpitations', 'Shortness of breath', 'Leg swelling',
        'Claudication', 'Orthopnea', 'Paroxysmal nocturnal dyspnea',

        // Respiratory
        'Cough', 'Sputum production', 'Wheezing', 'Hemoptysis', 'Pleuritic pain',

        // Gastrointestinal
        'Nausea', 'Vomiting', 'Diarrhea', 'Constipation', 'Abdominal pain',
        'Heartburn', 'Difficulty swallowing', 'Blood in stool', 'Jaundice',

        // Genitourinary
        'Dysuria', 'Frequency', 'Urgency', 'Hematuria', 'Incontinence',
        'Nocturia', 'Flank pain',

        // Neurological
        'Headache', 'Dizziness', 'Seizures', 'Memory problems', 'Confusion',
        'Tremor', 'Numbness', 'Tingling', 'Weakness', 'Vision changes',

        // Musculoskeletal
        'Joint pain', 'Joint swelling', 'Muscle pain', 'Back pain', 'Stiffness',

        // Dermatological
        'Rash', 'Itching', 'Bruising', 'Hair loss', 'Nail changes',

        // Endocrine
        'Heat intolerance', 'Cold intolerance', 'Excessive thirst',
        'Excessive urination', 'Hair growth changes',

        // Psychiatric
        'Depression', 'Anxiety', 'Insomnia', 'Mood swings', 'Irritability'
    ];

    const chronicConditions = [
        'Diabetes Type 1', 'Diabetes Type 2', 'Hypertension', 'Hyperlipidemia',
        'Coronary Artery Disease', 'Heart Failure', 'Atrial Fibrillation',
        'COPD', 'Asthma', 'Sleep Apnea', 'Chronic Kidney Disease',
        'Arthritis', 'Osteoporosis', 'Fibromyalgia', 'Depression', 'Anxiety',
        'Bipolar Disorder', 'Schizophrenia', 'Cancer History', 'Stroke',
        'Seizure Disorder', 'Migraine', 'Thyroid Disease', 'Liver Disease'
    ];

    const allergyTypes = [
        'Drug allergies', 'Food allergies', 'Environmental allergies',
        'Latex allergy', 'Contrast allergy', 'Anesthesia allergy'
    ];

    const procedureTypes = [
        'Diagnostic procedure', 'Therapeutic procedure', 'Surgical procedure',
        'Minimally invasive procedure', 'Emergency procedure'
    ];

    // Research integration function
    const searchMedicalResearch = async (query) => {
        setLoadingResearch(true);
        try {
            // Simulate research API call
            // In real implementation, integrate with PubMed, UpToDate, etc.
            const mockResearchData = [
                {
                    title: `Latest guidelines for ${query}`,
                    source: 'American Medical Association',
                    summary: 'Recent updates in clinical practice guidelines...',
                    relevance: 95
                },
                {
                    title: `Evidence-based treatment for ${query}`,
                    source: 'Cochrane Reviews',
                    summary: 'Systematic review of treatment options...',
                    relevance: 88
                },
                {
                    title: `Diagnostic criteria for ${query}`,
                    source: 'Mayo Clinic Proceedings',
                    summary: 'Updated diagnostic criteria and recommendations...',
                    relevance: 82
                }
            ];

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            return mockResearchData;
        } catch (error) {
            console.error('Research search error:', error);
            return [];
        } finally {
            setLoadingResearch(false);
        }
    };

    const handleResearchIntegration = async () => {
        const diagnosis = formData.diagnosis;
        if (!diagnosis) {
            alert('Please enter a diagnosis first to search for relevant research');
            return;
        }

        setResearchDialog(true);
        const results = await searchMedicalResearch(diagnosis);
        // Handle research results integration
    };

    const handleInputChange = (section, field, value) => {
        if (section) {
            setFormData(prev => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [field]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [field]: value
            }));
        }
    };

    const addMedication = () => {
        setFormData(prev => ({
            ...prev,
            medications: [...prev.medications, {
                id: Date.now(),
                name: '',
                genericName: '',
                dosage: '',
                frequency: '',
                route: 'oral',
                duration: '',
                instructions: '',
                indication: '',
                sideEffects: '',
                contraindications: '',
                interactions: '',
                startDate: new Date().toISOString().split('T')[0],
                endDate: '',
                prescribedBy: '',
                pharmacyInstructions: '',
                refills: 0,
                isActive: true,
                adherence: 100,
                effectiveness: 0,
                tolerability: 0
            }]
        }));
    };

    const addLabResult = (category) => {
        const newResult = {
            id: Date.now(),
            testName: '',
            result: '',
            normalRange: '',
            units: '',
            flag: 'normal',
            date: new Date().toISOString().split('T')[0],
            laboratory: '',
            orderingPhysician: '',
            interpretation: '',
            followUpRecommended: false
        };

        setFormData(prev => ({
            ...prev,
            labResults: {
                ...prev.labResults,
                [category]: [...prev.labResults[category], newResult]
            }
        }));
    };

    const renderVitalSignsTab = () => (
        <Grid container spacing={3}>
            {/* Basic Vital Signs */}
            <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Basic Vital Signs</Typography>
                <Grid container spacing={2}>
                    {/* Blood Pressure */}
                    <Grid item xs={12} md={6}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="subtitle1" gutterBottom>
                                    <BloodIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                                    Blood Pressure
                                </Typography>
                                <Grid container spacing={1}>
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            type="number"
                                            label="Systolic"
                                            value={formData.vitalSigns.bloodPressure.systolic}
                                            onChange={(e) => handleInputChange('vitalSigns', 'bloodPressure', {
                                                ...formData.vitalSigns.bloodPressure,
                                                systolic: e.target.value
                                            })}
                                            InputProps={{ endAdornment: 'mmHg' }}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            type="number"
                                            label="Diastolic"
                                            value={formData.vitalSigns.bloodPressure.diastolic}
                                            onChange={(e) => handleInputChange('vitalSigns', 'bloodPressure', {
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

                    {/* Heart Rate */}
                    <Grid item xs={12} md={3}>
                        <TextField
                            fullWidth
                            type="number"
                            label="Heart Rate"
                            value={formData.vitalSigns.heartRate}
                            onChange={(e) => handleInputChange('vitalSigns', 'heartRate', e.target.value)}
                            InputProps={{
                                endAdornment: 'bpm',
                                startAdornment: <HeartIcon color="error" />
                            }}
                        />
                    </Grid>

                    {/* Temperature */}
                    <Grid item xs={12} md={3}>
                        <TextField
                            fullWidth
                            type="number"
                            step="0.1"
                            label="Temperature"
                            value={formData.vitalSigns.temperature}
                            onChange={(e) => handleInputChange('vitalSigns', 'temperature', e.target.value)}
                            InputProps={{
                                endAdornment: '°C',
                                startAdornment: <TempIcon color="primary" />
                            }}
                        />
                    </Grid>

                    {/* Weight and Height */}
                    <Grid item xs={12} md={3}>
                        <TextField
                            fullWidth
                            type="number"
                            step="0.1"
                            label="Weight"
                            value={formData.vitalSigns.weight}
                            onChange={(e) => handleInputChange('vitalSigns', 'weight', e.target.value)}
                            InputProps={{
                                endAdornment: 'kg',
                                startAdornment: <WeightIcon color="success" />
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <TextField
                            fullWidth
                            type="number"
                            label="Height"
                            value={formData.vitalSigns.height}
                            onChange={(e) => handleInputChange('vitalSigns', 'height', e.target.value)}
                            InputProps={{
                                endAdornment: 'cm',
                                startAdornment: <HeightIcon color="info" />
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <TextField
                            fullWidth
                            type="number"
                            label="O2 Saturation"
                            value={formData.vitalSigns.oxygenSaturation}
                            onChange={(e) => handleInputChange('vitalSigns', 'oxygenSaturation', e.target.value)}
                            InputProps={{ endAdornment: '%' }}
                        />
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <TextField
                            fullWidth
                            type="number"
                            label="Respiratory Rate"
                            value={formData.vitalSigns.respiratoryRate}
                            onChange={(e) => handleInputChange('vitalSigns', 'respiratoryRate', e.target.value)}
                            InputProps={{ endAdornment: '/min' }}
                        />
                    </Grid>
                </Grid>
            </Grid>

            {/* Advanced Metabolic Parameters */}
            <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Metabolic Parameters</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={3}>
                        <TextField
                            fullWidth
                            type="number"
                            label="Blood Sugar"
                            value={formData.vitalSigns.bloodSugar}
                            onChange={(e) => handleInputChange('vitalSigns', 'bloodSugar', e.target.value)}
                            InputProps={{ endAdornment: 'mg/dL' }}
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField
                            fullWidth
                            type="number"
                            label="Total Cholesterol"
                            value={formData.vitalSigns.cholesterolTotal}
                            onChange={(e) => handleInputChange('vitalSigns', 'cholesterolTotal', e.target.value)}
                            InputProps={{ endAdornment: 'mg/dL' }}
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField
                            fullWidth
                            type="number"
                            label="LDL Cholesterol"
                            value={formData.vitalSigns.cholesterolLDL}
                            onChange={(e) => handleInputChange('vitalSigns', 'cholesterolLDL', e.target.value)}
                            InputProps={{ endAdornment: 'mg/dL' }}
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField
                            fullWidth
                            type="number"
                            label="HDL Cholesterol"
                            value={formData.vitalSigns.cholesterolHDL}
                            onChange={(e) => handleInputChange('vitalSigns', 'cholesterolHDL', e.target.value)}
                            InputProps={{ endAdornment: 'mg/dL' }}
                        />
                    </Grid>
                </Grid>
            </Grid>

            {/* Pain Assessment */}
            <Grid item xs={12}>
                <Card variant="outlined">
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            <WarningIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                            Pain Assessment
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Typography gutterBottom>Pain Level (0-10)</Typography>
                                <Slider
                                    value={formData.vitalSigns.painLevel}
                                    onChange={(e, value) => handleInputChange('vitalSigns', 'painLevel', value)}
                                    min={0}
                                    max={10}
                                    marks
                                    valueLabelDisplay="auto"
                                    sx={{ mt: 2 }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Autocomplete
                                    multiple
                                    options={painLocations}
                                    value={formData.vitalSigns.painLocation}
                                    onChange={(e, newValue) => handleInputChange('vitalSigns', 'painLocation', newValue)}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Pain Locations" />
                                    )}
                                    renderTags={(tagValue, getTagProps) =>
                                        tagValue.map((option, index) => (
                                            <Chip
                                                label={option}
                                                {...getTagProps({ index })}
                                                key={index}
                                                size="small"
                                                color="error"
                                            />
                                        ))
                                    }
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Pain Type</InputLabel>
                                    <Select
                                        value={formData.vitalSigns.painType}
                                        onChange={(e) => handleInputChange('vitalSigns', 'painType', e.target.value)}
                                        label="Pain Type"
                                    >
                                        {painTypes.map((type) => (
                                            <MenuItem key={type} value={type}>{type}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Pain Duration"
                                    value={formData.vitalSigns.painDuration}
                                    onChange={(e) => handleInputChange('vitalSigns', 'painDuration', e.target.value)}
                                    placeholder="e.g., 2 hours, 3 days, chronic"
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>

            {/* Mental Health Indicators */}
            <Grid item xs={12}>
                <Card variant="outlined">
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            <BrainIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                            Mental Health & Well-being
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Typography gutterBottom>Mood Rating (1-10)</Typography>
                                <Rating
                                    value={formData.vitalSigns.moodRating}
                                    onChange={(e, value) => handleInputChange('vitalSigns', 'moodRating', value)}
                                    max={10}
                                    size="large"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography gutterBottom>Anxiety Level (0-10)</Typography>
                                <Slider
                                    value={formData.vitalSigns.anxietyLevel}
                                    onChange={(e, value) => handleInputChange('vitalSigns', 'anxietyLevel', value)}
                                    min={0}
                                    max={10}
                                    marks
                                    valueLabelDisplay="auto"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography gutterBottom>Sleep Quality (1-10)</Typography>
                                <Rating
                                    value={formData.vitalSigns.sleepQuality}
                                    onChange={(e, value) => handleInputChange('vitalSigns', 'sleepQuality', value)}
                                    max={10}
                                    icon={<SleepIcon />}
                                    emptyIcon={<SleepIcon />}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography gutterBottom>Energy Level (1-10)</Typography>
                                <Rating
                                    value={formData.vitalSigns.energyLevel}
                                    onChange={(e, value) => handleInputChange('vitalSigns', 'energyLevel', value)}
                                    max={10}
                                    icon={<ActivityIcon />}
                                    emptyIcon={<ActivityIcon />}
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>

            {/* Comprehensive Symptoms */}
            <Grid item xs={12}>
                <Card variant="outlined">
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Comprehensive Symptom Assessment
                        </Typography>
                        <Autocomplete
                            multiple
                            options={comprehensiveSymptoms}
                            value={formData.vitalSigns.symptoms}
                            onChange={(e, newValue) => handleInputChange('vitalSigns', 'symptoms', newValue)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Current Symptoms"
                                    placeholder="Search and select symptoms"
                                />
                            )}
                            renderTags={(tagValue, getTagProps) =>
                                tagValue.map((option, index) => (
                                    <Chip
                                        label={option}
                                        {...getTagProps({ index })}
                                        key={index}
                                        size="small"
                                        color="warning"
                                        variant="outlined"
                                    />
                                ))
                            }
                        />
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );

    const renderPhysicalExamTab = () => (
        <Grid container spacing={3}>
            {Object.entries(formData.physicalExam).map(([system, fields]) => (
                <Grid item xs={12} key={system}>
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
                                {system.replace(/([A-Z])/g, ' $1').trim()} Examination
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container spacing={2}>
                                {Object.entries(fields).map(([field, value]) => (
                                    <Grid item xs={12} md={6} key={field}>
                                        <TextField
                                            fullWidth
                                            label={field.replace(/([A-Z])/g, ' $1').trim()}
                                            value={value}
                                            onChange={(e) => {
                                                const newPhysicalExam = {
                                                    ...formData.physicalExam,
                                                    [system]: {
                                                        ...formData.physicalExam[system],
                                                        [field]: e.target.value
                                                    }
                                                };
                                                setFormData(prev => ({
                                                    ...prev,
                                                    physicalExam: newPhysicalExam
                                                }));
                                            }}
                                            multiline={field === 'appearance' || field === 'notes'}
                                            rows={field === 'appearance' || field === 'notes' ? 2 : 1}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
                </Grid>
            ))}
        </Grid>
    );

    const renderLabResultsTab = () => (
        <Grid container spacing={3}>
            {Object.entries(formData.labResults).map(([category, results]) => (
                <Grid item xs={12} key={category}>
                    <Card variant="outlined">
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
                                    <LabIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                                    {category.replace(/([A-Z])/g, ' $1').trim()}
                                </Typography>
                                <Button
                                    startIcon={<AddIcon />}
                                    onClick={() => addLabResult(category)}
                                    variant="outlined"
                                    size="small"
                                >
                                    Add {category.replace(/([A-Z])/g, ' $1').trim()}
                                </Button>
                            </Box>

                            {results.length === 0 ? (
                                <Alert severity="info">No {category.replace(/([A-Z])/g, ' $1').trim().toLowerCase()} recorded</Alert>
                            ) : (
                                <TableContainer component={Paper} variant="outlined">
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Test Name</TableCell>
                                                <TableCell>Result</TableCell>
                                                <TableCell>Normal Range</TableCell>
                                                <TableCell>Flag</TableCell>
                                                <TableCell>Date</TableCell>
                                                <TableCell>Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {results.map((result, index) => (
                                                <TableRow key={result.id}>
                                                    <TableCell>
                                                        <TextField
                                                            size="small"
                                                            value={result.testName}
                                                            onChange={(e) => {
                                                                const newResults = [...results];
                                                                newResults[index].testName = e.target.value;
                                                                setFormData(prev => ({
                                                                    ...prev,
                                                                    labResults: {
                                                                        ...prev.labResults,
                                                                        [category]: newResults
                                                                    }
                                                                }));
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            size="small"
                                                            value={result.result}
                                                            onChange={(e) => {
                                                                const newResults = [...results];
                                                                newResults[index].result = e.target.value;
                                                                setFormData(prev => ({
                                                                    ...prev,
                                                                    labResults: {
                                                                        ...prev.labResults,
                                                                        [category]: newResults
                                                                    }
                                                                }));
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            size="small"
                                                            value={result.normalRange}
                                                            onChange={(e) => {
                                                                const newResults = [...results];
                                                                newResults[index].normalRange = e.target.value;
                                                                setFormData(prev => ({
                                                                    ...prev,
                                                                    labResults: {
                                                                        ...prev.labResults,
                                                                        [category]: newResults
                                                                    }
                                                                }));
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <FormControl size="small">
                                                            <Select
                                                                value={result.flag}
                                                                onChange={(e) => {
                                                                    const newResults = [...results];
                                                                    newResults[index].flag = e.target.value;
                                                                    setFormData(prev => ({
                                                                        ...prev,
                                                                        labResults: {
                                                                            ...prev.labResults,
                                                                            [category]: newResults
                                                                        }
                                                                    }));
                                                                }}
                                                            >
                                                                <MenuItem value="normal">Normal</MenuItem>
                                                                <MenuItem value="high">High</MenuItem>
                                                                <MenuItem value="low">Low</MenuItem>
                                                                <MenuItem value="critical">Critical</MenuItem>
                                                            </Select>
                                                        </FormControl>
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            type="date"
                                                            size="small"
                                                            value={result.date}
                                                            onChange={(e) => {
                                                                const newResults = [...results];
                                                                newResults[index].date = e.target.value;
                                                                setFormData(prev => ({
                                                                    ...prev,
                                                                    labResults: {
                                                                        ...prev.labResults,
                                                                        [category]: newResults
                                                                    }
                                                                }));
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <IconButton
                                                            size="small"
                                                            color="error"
                                                            onClick={() => {
                                                                const newResults = results.filter((_, i) => i !== index);
                                                                setFormData(prev => ({
                                                                    ...prev,
                                                                    labResults: {
                                                                        ...prev.labResults,
                                                                        [category]: newResults
                                                                    }
                                                                }));
                                                            }}
                                                        >
                                                            <RemoveIcon />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );

    const renderMedicalHistoryTab = () => (
        <Grid container spacing={3}>
            {/* Allergies */}
            <Grid item xs={12}>
                <Card variant="outlined">
                    <CardContent>
                        <Typography variant="h6" gutterBottom>Allergies</Typography>
                        <Autocomplete
                            multiple
                            freeSolo
                            options={allergyTypes}
                            value={formData.medicalHistory.allergies}
                            onChange={(e, newValue) => handleInputChange('medicalHistory', 'allergies', newValue)}
                            renderInput={(params) => (
                                <TextField {...params} label="Known Allergies" placeholder="Add allergy" />
                            )}
                            renderTags={(tagValue, getTagProps) =>
                                tagValue.map((option, index) => (
                                    <Chip
                                        label={option}
                                        {...getTagProps({ index })}
                                        key={index}
                                        color="error"
                                        size="small"
                                    />
                                ))
                            }
                        />
                    </CardContent>
                </Card>
            </Grid>

            {/* Chronic Conditions */}
            <Grid item xs={12}>
                <Card variant="outlined">
                    <CardContent>
                        <Typography variant="h6" gutterBottom>Chronic Conditions</Typography>
                        <Autocomplete
                            multiple
                            options={chronicConditions}
                            value={formData.medicalHistory.chronicConditions}
                            onChange={(e, newValue) => handleInputChange('medicalHistory', 'chronicConditions', newValue)}
                            renderInput={(params) => (
                                <TextField {...params} label="Chronic Medical Conditions" />
                            )}
                            renderTags={(tagValue, getTagProps) =>
                                tagValue.map((option, index) => (
                                    <Chip
                                        label={option}
                                        {...getTagProps({ index })}
                                        key={index}
                                        color="warning"
                                        size="small"
                                    />
                                ))
                            }
                        />
                    </CardContent>
                </Card>
            </Grid>

            {/* Social History */}
            <Grid item xs={12}>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h6">Social History</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container spacing={2}>
                            {/* Smoking History */}
                            <Grid item xs={12} md={6}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography variant="subtitle1" gutterBottom>
                                            <SmokingIcon sx={{ mr: 1 }} />
                                            Smoking History
                                        </Typography>
                                        <FormControl fullWidth margin="dense">
                                            <RadioGroup
                                                value={formData.medicalHistory.socialHistory.smoking.status}
                                                onChange={(e) => {
                                                    const newSocialHistory = {
                                                        ...formData.medicalHistory.socialHistory,
                                                        smoking: {
                                                            ...formData.medicalHistory.socialHistory.smoking,
                                                            status: e.target.value
                                                        }
                                                    };
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        medicalHistory: {
                                                            ...prev.medicalHistory,
                                                            socialHistory: newSocialHistory
                                                        }
                                                    }));
                                                }}
                                                row
                                            >
                                                <FormControlLabel value="never" control={<Radio />} label="Never" />
                                                <FormControlLabel value="former" control={<Radio />} label="Former" />
                                                <FormControlLabel value="current" control={<Radio />} label="Current" />
                                            </RadioGroup>
                                        </FormControl>

                                        {formData.medicalHistory.socialHistory.smoking.status !== 'never' && (
                                            <>
                                                <TextField
                                                    fullWidth
                                                    margin="dense"
                                                    type="number"
                                                    label="Packs per day"
                                                    value={formData.medicalHistory.socialHistory.smoking.packsPerDay}
                                                    onChange={(e) => {
                                                        const newSocialHistory = {
                                                            ...formData.medicalHistory.socialHistory,
                                                            smoking: {
                                                                ...formData.medicalHistory.socialHistory.smoking,
                                                                packsPerDay: parseFloat(e.target.value) || 0
                                                            }
                                                        };
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            medicalHistory: {
                                                                ...prev.medicalHistory,
                                                                socialHistory: newSocialHistory
                                                            }
                                                        }));
                                                    }}
                                                />
                                                <TextField
                                                    fullWidth
                                                    margin="dense"
                                                    type="number"
                                                    label="Years smoked"
                                                    value={formData.medicalHistory.socialHistory.smoking.yearsSmoked}
                                                    onChange={(e) => {
                                                        const newSocialHistory = {
                                                            ...formData.medicalHistory.socialHistory,
                                                            smoking: {
                                                                ...formData.medicalHistory.socialHistory.smoking,
                                                                yearsSmoked: parseInt(e.target.value) || 0
                                                            }
                                                        };
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            medicalHistory: {
                                                                ...prev.medicalHistory,
                                                                socialHistory: newSocialHistory
                                                            }
                                                        }));
                                                    }}
                                                />
                                            </>
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* Alcohol History */}
                            <Grid item xs={12} md={6}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography variant="subtitle1" gutterBottom>
                                            <AlcoholIcon sx={{ mr: 1 }} />
                                            Alcohol History
                                        </Typography>
                                        <FormControl fullWidth margin="dense">
                                            <InputLabel>Frequency</InputLabel>
                                            <Select
                                                value={formData.medicalHistory.socialHistory.alcohol.frequency}
                                                onChange={(e) => {
                                                    const newSocialHistory = {
                                                        ...formData.medicalHistory.socialHistory,
                                                        alcohol: {
                                                            ...formData.medicalHistory.socialHistory.alcohol,
                                                            frequency: e.target.value
                                                        }
                                                    };
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        medicalHistory: {
                                                            ...prev.medicalHistory,
                                                            socialHistory: newSocialHistory
                                                        }
                                                    }));
                                                }}
                                                label="Frequency"
                                            >
                                                <MenuItem value="never">Never</MenuItem>
                                                <MenuItem value="rarely">Rarely</MenuItem>
                                                <MenuItem value="weekly">Weekly</MenuItem>
                                                <MenuItem value="daily">Daily</MenuItem>
                                            </Select>
                                        </FormControl>

                                        {formData.medicalHistory.socialHistory.alcohol.frequency !== 'never' && (
                                            <TextField
                                                fullWidth
                                                margin="dense"
                                                type="number"
                                                label="Drinks per week"
                                                value={formData.medicalHistory.socialHistory.alcohol.drinksPerWeek}
                                                onChange={(e) => {
                                                    const newSocialHistory = {
                                                        ...formData.medicalHistory.socialHistory,
                                                        alcohol: {
                                                            ...formData.medicalHistory.socialHistory.alcohol,
                                                            drinksPerWeek: parseInt(e.target.value) || 0
                                                        }
                                                    };
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        medicalHistory: {
                                                            ...prev.medicalHistory,
                                                            socialHistory: newSocialHistory
                                                        }
                                                    }));
                                                }}
                                            />
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* Exercise and Nutrition */}
                            <Grid item xs={12}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography variant="subtitle1" gutterBottom>
                                            <ActivityIcon sx={{ mr: 1 }} />
                                            Exercise & Nutrition
                                        </Typography>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} md={6}>
                                                <FormControl fullWidth>
                                                    <InputLabel>Exercise Frequency</InputLabel>
                                                    <Select
                                                        value={formData.medicalHistory.socialHistory.exercise.frequency}
                                                        onChange={(e) => {
                                                            const newSocialHistory = {
                                                                ...formData.medicalHistory.socialHistory,
                                                                exercise: {
                                                                    ...formData.medicalHistory.socialHistory.exercise,
                                                                    frequency: e.target.value
                                                                }
                                                            };
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                medicalHistory: {
                                                                    ...prev.medicalHistory,
                                                                    socialHistory: newSocialHistory
                                                                }
                                                            }));
                                                        }}
                                                        label="Exercise Frequency"
                                                    >
                                                        <MenuItem value="sedentary">Sedentary</MenuItem>
                                                        <MenuItem value="light">Light (1-2 times/week)</MenuItem>
                                                        <MenuItem value="moderate">Moderate (3-4 times/week)</MenuItem>
                                                        <MenuItem value="vigorous">Vigorous (5+ times/week)</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <FormControl fullWidth>
                                                    <InputLabel>Diet Type</InputLabel>
                                                    <Select
                                                        value={formData.medicalHistory.socialHistory.diet.type}
                                                        onChange={(e) => {
                                                            const newSocialHistory = {
                                                                ...formData.medicalHistory.socialHistory,
                                                                diet: {
                                                                    ...formData.medicalHistory.socialHistory.diet,
                                                                    type: e.target.value
                                                                }
                                                            };
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                medicalHistory: {
                                                                    ...prev.medicalHistory,
                                                                    socialHistory: newSocialHistory
                                                                }
                                                            }));
                                                        }}
                                                        label="Diet Type"
                                                    >
                                                        <MenuItem value="balanced">Balanced</MenuItem>
                                                        <MenuItem value="vegetarian">Vegetarian</MenuItem>
                                                        <MenuItem value="vegan">Vegan</MenuItem>
                                                        <MenuItem value="ketogenic">Ketogenic</MenuItem>
                                                        <MenuItem value="mediterranean">Mediterranean</MenuItem>
                                                        <MenuItem value="other">Other</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </AccordionDetails>
                </Accordion>
            </Grid>
        </Grid>
    );

    const renderResearchIntegration = () => (
        <Dialog
            open={researchDialog}
            onClose={() => setResearchDialog(false)}
            maxWidth="md"
            fullWidth
        >
            <DialogTitle>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SearchIcon />
                    Medical Research Integration
                </Box>
            </DialogTitle>
            <DialogContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    Searching for latest research and guidelines related to: <strong>{formData.diagnosis}</strong>
                </Typography>

                {loadingResearch && (
                    <Box sx={{ mt: 2 }}>
                        <LinearProgress />
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            Searching PubMed, UpToDate, and clinical guidelines...
                        </Typography>
                    </Box>
                )}

                {/* Research results would be displayed here */}
                <Alert severity="info" sx={{ mt: 2 }}>
                    Research integration feature ready for implementation with medical databases
                </Alert>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setResearchDialog(false)}>Close</Button>
            </DialogActions>
        </Dialog>
    );

    const tabs = [
        { label: 'Basic Info', icon: <CheckIcon /> },
        { label: 'Vital Signs', icon: <HeartIcon /> },
        { label: 'Physical Exam', icon: <EyeIcon /> },
        { label: 'Medical History', icon: <TimeIcon /> },
        { label: 'Lab Results', icon: <LabIcon /> },
        { label: 'Medications', icon: <MedicationIcon /> },
        { label: 'Assessment', icon: <BrainIcon /> }
    ];

    if (!open) return null;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xl"
            fullWidth
            PaperProps={{
                sx: { height: '90vh' }
            }}
        >
            <DialogTitle>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h5">
                        Advanced Health Data Entry System
                    </Typography>
                    <Button
                        startIcon={<SearchIcon />}
                        onClick={handleResearchIntegration}
                        variant="outlined"
                        size="small"
                        disabled={!formData.diagnosis}
                    >
                        Research Integration
                    </Button>
                </Box>
            </DialogTitle>

            <DialogContent sx={{ p: 0 }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs
                        value={activeTab}
                        onChange={(e, newValue) => setActiveTab(newValue)}
                        variant="scrollable"
                        scrollButtons="auto"
                    >
                        {tabs.map((tab, index) => (
                            <Tab
                                key={index}
                                icon={tab.icon}
                                label={tab.label}
                                iconPosition="start"
                            />
                        ))}
                    </Tabs>
                </Box>

                <Box sx={{ p: 3, height: '100%', overflow: 'auto' }}>
                    {activeTab === 0 && (
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom>Basic Record Information</Typography>
                            </Grid>
                            {/* Basic info form fields here - similar to previous implementation */}
                        </Grid>
                    )}
                    {activeTab === 1 && renderVitalSignsTab()}
                    {activeTab === 2 && renderPhysicalExamTab()}
                    {activeTab === 3 && renderMedicalHistoryTab()}
                    {activeTab === 4 && renderLabResultsTab()}
                    {activeTab === 5 && (
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom>Comprehensive Medication Management</Typography>
                                {/* Comprehensive medication form */}
                            </Grid>
                        </Grid>
                    )}
                    {activeTab === 6 && (
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom>Clinical Assessment & Care Plan</Typography>
                                {/* Assessment and care plan */}
                            </Grid>
                        </Grid>
                    )}
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                <Button onClick={onClose} variant="outlined">
                    Cancel
                </Button>
                <Button onClick={() => onSubmit(formData)} variant="contained" startIcon={<CheckIcon />}>
                    Save Complete Health Record
                </Button>
            </DialogActions>

            {renderResearchIntegration()}
        </Dialog>
    );
};

export default AdvancedHealthDataEntry;