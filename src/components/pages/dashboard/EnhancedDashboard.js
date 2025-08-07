import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Grid,
    Button,
    TextField,
    Stack,
    Chip,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
    IconButton,
    AppBar,
    Toolbar,
    Avatar,
    Menu,
    MenuItem,
    useTheme,
    useMediaQuery,
    Alert,
    Snackbar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Fab,
    Tooltip,
    Stepper,
    Step,
    StepLabel,
    FormControl,
    InputLabel,
    Select,
    FormControlLabel,
    Switch,
    Slider,
    Autocomplete,
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    FolderOpen as FolderIcon,
    Settings as SettingsIcon,
    Menu as MenuIcon,
    AccountCircle,
    ExitToApp as LogoutIcon,
    Search as SearchIcon,
    Security as SecurityIcon,
    HealthAndSafety as HealthAndSafetyIcon,
    Add as AddIcon,
    UploadFile as UploadFileIcon,
    CloudUpload as CloudUploadIcon,
    AttachFile as AttachFileIcon,
    Person as PersonIcon,
    Favorite as HeartIcon,
    Thermostat as TempIcon,
    Scale as WeightIcon,
    Height as HeightIcon,
    Bloodtype as BloodIcon,
    Medication as MedicationIcon,
    LocalHospital as HospitalIcon,
    Psychology as BrainIcon,
    Assessment as AssessmentIcon,
    FamilyRestroom as FamilyRestroomIcon,
    VerifiedUser as VerifiedUserIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import Logo from '../../layout/Logo';
import { useAuth } from '../../../context/AuthContext';
import {
    dashboardAPI,
    healthRecordsAPI,
    patientsAPI,
    medicationsAPI,
    documentsAPI
} from '../../../utils/api';

const drawerWidth = 280;

const DashboardContainer = styled(Box)({
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f5f7fa',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
});

const MainContent = styled(Box)(({ theme }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    marginTop: '64px',
    [theme.breakpoints.up('md')]: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
    },
}));

const StyledAppBar = styled(AppBar)(({ theme }) => ({
    backgroundColor: 'white',
    color: theme.palette.text.primary,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    zIndex: theme.zIndex.drawer + 1,
}));

const StyledDrawer = styled(Drawer)(({ theme }) => ({
    width: drawerWidth,
    flexShrink: 0,
    '& .MuiDrawer-paper': {
        width: drawerWidth,
        boxSizing: 'border-box',
        backgroundColor: '#0066CC',
        color: 'white',
        paddingTop: '64px',
    },
}));

const WelcomeCard = styled(Card)({
    background: 'linear-gradient(135deg, #0066CC 0%, #42A5F5 50%, #00843D 100%)',
    color: 'white',
    marginBottom: '32px',
    borderRadius: '20px',
    boxShadow: '0 12px 40px rgba(0, 102, 204, 0.4)',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)',
        pointerEvents: 'none',
    },
});

const QuickActionFab = styled(Fab)({
    position: 'fixed',
    bottom: 24,
    right: 24,
    backgroundColor: '#0066CC',
    color: 'white',
    '&:hover': {
        backgroundColor: '#0052A3',
    },
});

const EnhancedDashboard = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();
    const { currentUser, isAuthenticated, logout } = useAuth();

    // State management
    const [mobileOpen, setMobileOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState('dashboard');
    const [currentView, setCurrentView] = useState('dashboard');
    const [bhnSearchQuery, setBhnSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [recordDetailOpen, setRecordDetailOpen] = useState(false);

    // Dashboard data
    const [dashboardStats, setDashboardStats] = useState({
        totalPatients: 0,
        totalRecords: 0,
        activeUsers: 0,
        systemHealth: '100%'
    });

    // Dialog states
    const [dataEntryOpen, setDataEntryOpen] = useState(false);
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    // Enhanced form states
    const [formStep, setFormStep] = useState(0);
    const [patientsList, setPatientsList] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);

    const [healthDataForm, setHealthDataForm] = useState({
        // Basic Information
        patientId: '',
        bhnId: '',
        recordType: 'consultation',
        title: '',
        description: '',
        visitDate: new Date().toISOString().split('T')[0],
        visitTime: new Date().toTimeString().slice(0, 5),
        urgencyLevel: 'normal',

        // Patient Demographics (for new patients)
        isNewPatient: false,
        patientInfo: {
            firstName: '',
            lastName: '',
            middleName: '',
            dateOfBirth: '',
            gender: '',
            phone: '',
            email: '',
            address: '',
            city: '',
            province: '',
            postalCode: '',
        },

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
            bloodSugar: '',
            bmi: ''
        },

        // Clinical Assessment
        diagnosis: '',
        treatmentPlan: '',
        notes: '',
        followUpDate: '',
        followUpInstructions: '',

        // Medical History
        allergies: [],
        currentMedications: [],
        medicalConditions: [],

        // Family Medical History
        familyHistory: {
            cardiovascular: false,
            diabetes: false,
            cancer: false,
            mentalHealth: false,
            neurologicalDisorders: false,
            autoimmune: false,
            other: ''
        },

        // Social History
        socialHistory: {
            smoking: 'never', // never, former, current
            alcohol: 'none', // none, occasional, moderate, heavy
            exercise: 'sedentary', // sedentary, light, moderate, active
            diet: 'balanced', // balanced, vegetarian, vegan, other
            maritalStatus: 'single',
            occupation: '',
            emergencyContact: {
                name: '',
                relationship: '',
                phone: ''
            }
        },

        // Insurance & Administrative
        insurance: {
            provider: '',
            policyNumber: '',
            groupNumber: '',
            membershipNumber: ''
        },

        // Birth Specific Information (if applicable)
        birthInfo: {
            isPregnancyRelated: false,
            gestationalAge: '',
            deliveryType: '',
            birthWeight: '',
            birthLength: '',
            apgarScore: '',
            complications: ''
        },
    });

    const [uploadFiles, setUploadFiles] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(0);

    // Menu items for sidebar
    const menuItems = [
        { id: 'dashboard', text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
        { id: 'records', text: 'Health Records', icon: <FolderIcon />, path: '/dashboard' },
        { id: 'patients', text: 'Patient Management', icon: <HealthAndSafetyIcon />, path: '/dashboard' },
        { id: 'settings', text: 'Account Settings', icon: <SettingsIcon />, path: '/dashboard' },
    ];

    // Helper functions
    const generateBHNId = () => {
        const year = new Date().getFullYear();
        const timestamp = Date.now().toString().slice(-3);
        const randomSuffix = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
        return `BHN${year}${timestamp}${randomSuffix}`;
    };

    const calculateBMI = (weight, height) => {
        if (!weight || !height) return '';
        const weightKg = parseFloat(weight);
        const heightM = parseFloat(height) / 100; // Convert cm to m
        const bmi = weightKg / (heightM * heightM);
        return bmi.toFixed(1);
    };

    const resetHealthDataForm = () => {
        setHealthDataForm({
            // Basic Information
            patientId: '',
            bhnId: '',
            recordType: 'consultation',
            title: '',
            description: '',
            visitDate: new Date().toISOString().split('T')[0],
            visitTime: new Date().toTimeString().slice(0, 5),
            urgencyLevel: 'normal',

            // Patient Demographics (for new patients)
            isNewPatient: false,
            patientInfo: {
                firstName: '',
                lastName: '',
                middleName: '',
                dateOfBirth: '',
                gender: '',
                phone: '',
                email: '',
                address: '',
                city: '',
                province: '',
                postalCode: '',
            },

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
                bloodSugar: '',
                bmi: ''
            },

            // Clinical Assessment
            diagnosis: '',
            treatmentPlan: '',
            notes: '',
            followUpDate: '',
            followUpInstructions: '',

            // Medical History
            allergies: [],
            currentMedications: [],
            medicalConditions: [],

            // Family Medical History
            familyHistory: {
                cardiovascular: false,
                diabetes: false,
                cancer: false,
                mentalHealth: false,
                neurologicalDisorders: false,
                autoimmune: false,
                other: ''
            },

            // Social History
            socialHistory: {
                smoking: 'never',
                alcohol: 'none',
                exercise: 'sedentary',
                diet: 'balanced',
                maritalStatus: 'single',
                occupation: '',
                emergencyContact: {
                    name: '',
                    relationship: '',
                    phone: ''
                }
            },

            // Insurance & Administrative
            insurance: {
                provider: '',
                policyNumber: '',
                groupNumber: '',
                membershipNumber: ''
            },

            // Birth Specific Information (if applicable)
            birthInfo: {
                isPregnancyRelated: false,
                gestationalAge: '',
                deliveryType: '',
                birthWeight: '',
                birthLength: '',
                apgarScore: '',
                complications: ''
            },
        });
        setFormStep(0);
    };

    // Load dashboard data on mount
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        const loadDashboardData = async () => {
            try {
                setLoading(true);

                // Load dashboard statistics
                const statsResponse = await dashboardAPI.getStats(currentUser?.userType);
                if (statsResponse.success) {
                    setDashboardStats(statsResponse.data);
                }

                // Load patients list if user is a healthcare provider
                if (currentUser?.userType === 'provider') {
                    const patientsResponse = await patientsAPI.getPatients();
                    if (patientsResponse.success) {
                        setPatientsList(patientsResponse.data);
                    }
                }

            } catch (error) {
                console.error('Error loading dashboard data:', error);
                setSnackbarMessage('Error loading dashboard data');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, [isAuthenticated, navigate, currentUser]);

    // HIPAA/PIPEDA compliant health record search by BHN ID only
    const searchHealthRecordsByBHN = async (bhnId) => {
        if (!bhnId || bhnId.length < 3) {
            setSearchResults([]);
            return;
        }

        try {
            const response = await healthRecordsAPI.getRecords(null, { bhnId: bhnId });
            if (response.success) {
                const sanitizedResults = response.data.map(record => ({
                    id: record.id,
                    bhnId: record.bhnId,
                    recordType: record.recordType,
                    title: record.title,
                    visitDate: record.visitDate,
                    urgencyLevel: record.urgencyLevel,
                    status: record.status,
                    doctorName: 'Healthcare Provider'
                }));
                setSearchResults(sanitizedResults);
            }
        } catch (error) {
            console.error('Error searching health records:', error);
            setSnackbarMessage('Error searching health records');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    // Handle sidebar navigation
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleListItemClick = (item) => {
        setSelectedItem(item.id);
        setCurrentView(item.id);
        if (item.path && item.path !== '/dashboard') {
            navigate(item.path);
        }
        if (isMobile) {
            setMobileOpen(false);
        }
    };

    // Handle user menu
    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleProfileMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    // Handle form submissions
    const handleDataEntrySubmit = async () => {
        try {
            setLoading(true);

            // If it's a new patient, create patient first
            if (healthDataForm.isNewPatient) {
                const bhnId = generateBHNId();

                // Create patient record
                const patientData = {
                    ...healthDataForm.patientInfo,
                    bhnId: bhnId,
                    bloodType: 'unknown',
                    allergies: healthDataForm.allergies.join(', '),
                    currentMedications: healthDataForm.currentMedications.join(', '),
                    medicalConditions: healthDataForm.medicalConditions.join(', ')
                };

                const patientResponse = await patientsAPI.createPatient(patientData);
                if (patientResponse.success) {
                    healthDataForm.patientId = patientResponse.data.id;
                    healthDataForm.bhnId = bhnId;

                    // Update patients list
                    setPatientsList(prev => [...prev, patientResponse.data]);
                }
            }

            // Calculate BMI if weight and height are provided
            if (healthDataForm.vitalSigns.weight && healthDataForm.vitalSigns.height) {
                healthDataForm.vitalSigns.bmi = calculateBMI(
                    healthDataForm.vitalSigns.weight,
                    healthDataForm.vitalSigns.height
                );
            }

            // Create health record
            const recordData = {
                patientId: healthDataForm.patientId,
                recordType: healthDataForm.recordType,
                title: healthDataForm.title,
                description: healthDataForm.description,
                diagnosis: healthDataForm.diagnosis,
                treatmentPlan: healthDataForm.treatmentPlan,
                notes: healthDataForm.notes,
                vitalSigns: healthDataForm.vitalSigns,
                visitDate: healthDataForm.visitDate,
                visitTime: healthDataForm.visitTime,
                urgencyLevel: healthDataForm.urgencyLevel,
                followUpDate: healthDataForm.followUpDate,
                followUpInstructions: healthDataForm.followUpInstructions
            };

            const response = await healthRecordsAPI.createRecord(recordData);
            if (response.success) {
                setSnackbarMessage('Health record created successfully');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
                setDataEntryOpen(false);
                resetHealthDataForm();
            }
        } catch (error) {
            console.error('Error creating health record:', error);
            setSnackbarMessage('Error creating health record');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        } finally {
            setLoading(false);
        }
    };

    // Sidebar content
    const drawer = (
        <Box>
            <Box sx={{ p: 3, textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.05)' }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mb: 2
                }}>
                    <Box sx={{
                        width: 56,
                        height: 56,
                        borderRadius: '50%',
                        backgroundColor: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}>
                        <Logo size="small" withLink={false} sx={{
                            '& img': { width: '32px', height: '32px' },
                            '& svg': { width: '32px', height: '32px', color: '#0066CC' }
                        }} />
                    </Box>
                    <Typography variant="h6" fontWeight={700} sx={{ color: 'white', lineHeight: 1.2 }}>
                        Birth Health Network
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>
                        Healthcare Dashboard
                    </Typography>
                </Box>
                <Chip
                    icon={<SecurityIcon sx={{ fontSize: '14px !important' }} />}
                    label="HIPAA Compliant"
                    size="small"
                    sx={{
                        backgroundColor: 'rgba(76, 175, 80, 0.2)',
                        color: '#4CAF50',
                        border: '1px solid rgba(76, 175, 80, 0.3)',
                        fontSize: '0.75rem',
                        fontWeight: 600
                    }}
                />
            </Box>

            <List sx={{ px: 2, py: 2 }}>
                {menuItems.map((item) => (
                    <ListItem key={item.id} disablePadding sx={{ mb: 1 }}>
                        <ListItemButton
                            selected={selectedItem === item.id}
                            onClick={() => handleListItemClick(item)}
                            sx={{
                                borderRadius: '12px',
                                '&.Mui-selected': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                    },
                                },
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                },
                            }}
                        >
                            <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.text}
                                primaryTypographyProps={{
                                    fontSize: '0.875rem',
                                    fontWeight: selectedItem === item.id ? 600 : 400
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <DashboardContainer>
            {/* App Bar */}
            <StyledAppBar position="fixed">
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { md: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, color: '#0066CC', fontWeight: 600 }}>
                        Enhanced Dashboard
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Chip
                            icon={<SecurityIcon />}
                            label="HIPAA Compliant"
                            color="success"
                            variant="outlined"
                            size="small"
                        />

                        <IconButton
                            size="large"
                            edge="end"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen}
                            color="inherit"
                        >
                            <Avatar sx={{ bgcolor: '#0066CC', width: 32, height: 32 }}>
                                {currentUser?.firstName?.charAt(0) || 'U'}
                            </Avatar>
                        </IconButton>
                    </Box>
                </Toolbar>
            </StyledAppBar>

            {/* User Menu */}
            <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleProfileMenuClose}
            >
                <MenuItem onClick={handleProfileMenuClose}>
                    <ListItemIcon>
                        <AccountCircle fontSize="small" />
                    </ListItemIcon>
                    Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                        <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>

            {/* Sidebar */}
            <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
                <StyledDrawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                    }}
                >
                    {drawer}
                </StyledDrawer>
                <StyledDrawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', md: 'block' },
                    }}
                    open
                >
                    {drawer}
                </StyledDrawer>
            </Box>

            {/* Main Content */}
            <MainContent>
                <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {/* Dashboard View */}
                    {currentView === 'dashboard' && (
                        <>
                            <WelcomeCard>
                                <CardContent sx={{ p: 4 }}>
                                    <Grid container spacing={3} alignItems="center">
                                        <Grid item xs={12} md={8}>
                                            <Typography variant="h3" fontWeight={700} sx={{ mb: 1, fontFamily: '"Inter", "Roboto", sans-serif' }}>
                                                Welcome, {currentUser?.firstName || 'User'}
                                            </Typography>
                                            <Typography variant="h6" sx={{ mb: 3, opacity: 0.9, fontFamily: '"Inter", "Roboto", sans-serif' }}>
                                                {currentUser?.userType === 'provider' ? 'Healthcare Provider' : 'Patient'} Dashboard
                                            </Typography>
                                            <Typography variant="body1" sx={{ opacity: 0.8, mb: 3, fontFamily: '"Inter", "Roboto", sans-serif' }}>
                                                Comprehensive health record management with automated BHN ID generation.
                                            </Typography>
                                            <Stack direction="row" spacing={2} flexWrap="wrap">
                                                <Button
                                                    variant="contained"
                                                    sx={{
                                                        bgcolor: 'white',
                                                        color: '#0066CC',
                                                        fontWeight: 600,
                                                        px: 3,
                                                        py: 1.5,
                                                        borderRadius: '25px',
                                                        fontFamily: '"Inter", "Roboto", sans-serif',
                                                        '&:hover': { bgcolor: '#f5f5f5' }
                                                    }}
                                                    startIcon={<AddIcon />}
                                                    onClick={() => setDataEntryOpen(true)}
                                                >
                                                    Add Health Record
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    sx={{
                                                        borderColor: 'white',
                                                        color: 'white',
                                                        fontWeight: 600,
                                                        px: 3,
                                                        py: 1.5,
                                                        borderRadius: '25px',
                                                        fontFamily: '"Inter", "Roboto", sans-serif',
                                                        '&:hover': {
                                                            borderColor: 'white',
                                                            bgcolor: 'rgba(255, 255, 255, 0.1)'
                                                        }
                                                    }}
                                                    startIcon={<PersonIcon />}
                                                    onClick={() => setCurrentView('patients')}
                                                >
                                                    Manage Patients
                                                </Button>
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <Box sx={{ textAlign: 'center', p: 3 }}>
                                                <HealthAndSafetyIcon sx={{ fontSize: 80, opacity: 0.3, mb: 2 }} />
                                                <Typography variant="h6" sx={{ opacity: 0.8, fontFamily: '"Inter", "Roboto", sans-serif' }}>
                                                    Secure Health Management
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </WelcomeCard>



                            <Card sx={{
                                mb: 3,
                                borderRadius: '16px',
                                boxShadow: '0 4px 20px rgba(0, 102, 204, 0.1)',
                                background: 'linear-gradient(145deg, #ffffff 0%, #f8faff 100%)'
                            }}>
                                <CardContent sx={{ p: 4 }}>
                                    <Typography variant="h5" fontWeight={600} gutterBottom sx={{
                                        fontFamily: '"Inter", "Roboto", sans-serif',
                                        color: '#1a1a1a',
                                        textAlign: 'center',
                                        mb: 1
                                    }}>
                                        Quick Actions
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary" sx={{
                                        mb: 4,
                                        textAlign: 'center',
                                        fontFamily: '"Inter", "Roboto", sans-serif'
                                    }}>
                                        Access frequently used features and tools
                                    </Typography>
                                    <Grid container spacing={3} justifyContent="center">
                                        <Grid item xs={12} sm={6} md={4}>
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                startIcon={<SearchIcon />}
                                                onClick={() => setCurrentView('records')}
                                                sx={{
                                                    py: 2,
                                                    borderRadius: '12px',
                                                    background: 'linear-gradient(135deg, #0066CC 0%, #42A5F5 100%)',
                                                    fontFamily: '"Inter", "Roboto", sans-serif',
                                                    fontWeight: 600,
                                                    textTransform: 'none',
                                                    boxShadow: '0 4px 15px rgba(0, 102, 204, 0.3)',
                                                    '&:hover': {
                                                        background: 'linear-gradient(135deg, #0052A3 0%, #1E88E5 100%)',
                                                        boxShadow: '0 6px 20px rgba(0, 102, 204, 0.4)',
                                                        transform: 'translateY(-2px)'
                                                    },
                                                    transition: 'all 0.3s ease'
                                                }}
                                            >
                                                Search Health Records
                                            </Button>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4}>
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                startIcon={<PersonIcon />}
                                                onClick={() => setCurrentView('patients')}
                                                sx={{
                                                    py: 2,
                                                    borderRadius: '12px',
                                                    background: 'linear-gradient(135deg, #00843D 0%, #4CAF50 100%)',
                                                    fontFamily: '"Inter", "Roboto", sans-serif',
                                                    fontWeight: 600,
                                                    textTransform: 'none',
                                                    boxShadow: '0 4px 15px rgba(0, 132, 61, 0.3)',
                                                    '&:hover': {
                                                        background: 'linear-gradient(135deg, #00632B 0%, #388E3C 100%)',
                                                        boxShadow: '0 6px 20px rgba(0, 132, 61, 0.4)',
                                                        transform: 'translateY(-2px)'
                                                    },
                                                    transition: 'all 0.3s ease'
                                                }}
                                            >
                                                Patient Management
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </>
                    )}

                    {/* Health Records Search View */}
                    {currentView === 'records' && (
                        <>
                            <Typography variant="h4" fontWeight={600} sx={{ mb: 3, fontFamily: '"Inter", "Roboto", sans-serif' }}>
                                Health Records Search
                            </Typography>
                            <Card sx={{ mb: 3 }}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom sx={{ fontFamily: '"Inter", "Roboto", sans-serif' }}>
                                        Search by BHN ID
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                        Enter Birth Health Network ID to search for health records (PIPEDA & HIPAA Compliant)
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        label="BHN ID (e.g., BHN20250000000001)"
                                        value={bhnSearchQuery}
                                        onChange={(e) => {
                                            setBhnSearchQuery(e.target.value);
                                            searchHealthRecordsByBHN(e.target.value);
                                        }}
                                        placeholder="Enter 17-digit BHN ID to search..."
                                        sx={{ mb: 3 }}
                                    />
                                    {searchResults.length > 0 && (
                                        <Box>
                                            <Typography variant="h6" gutterBottom sx={{ fontFamily: '"Inter", "Roboto", sans-serif' }}>
                                                Search Results ({searchResults.length} records found)
                                            </Typography>
                                            <Stack spacing={2}>
                                                {searchResults.map((record) => (
                                                    <Card key={record.id} variant="outlined" sx={{ mb: 2 }}>
                                                        <CardContent>
                                                            <Grid container spacing={3}>
                                                                {/* Header Information */}
                                                                <Grid item xs={12}>
                                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                                                        <Typography variant="h6" fontWeight={600} sx={{ fontFamily: '"Inter", "Roboto", sans-serif' }}>
                                                                            {record.title}
                                                                        </Typography>
                                                                        <Chip
                                                                            label={record.urgencyLevel || 'Normal'}
                                                                            size="small"
                                                                            color={record.urgencyLevel === 'high' ? 'error' : record.urgencyLevel === 'urgent' ? 'warning' : 'success'}
                                                                        />
                                                                    </Box>
                                                                </Grid>

                                                                {/* Basic Information */}
                                                                <Grid item xs={12} md={6}>
                                                                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#0066CC' }}>
                                                                        Basic Information
                                                                    </Typography>
                                                                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                                                                        <strong>Type:</strong> {record.recordType}
                                                                    </Typography>
                                                                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                                                                        <strong>Date:</strong> {record.visitDate}
                                                                    </Typography>
                                                                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                                                                        <strong>Time:</strong> {record.visitTime || 'Not specified'}
                                                                    </Typography>
                                                                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                                                                        <strong>Provider:</strong> {record.doctorName || 'Unknown'}
                                                                    </Typography>
                                                                    <Typography variant="body2">
                                                                        <strong>Status:</strong> {record.status || 'Active'}
                                                                    </Typography>
                                                                </Grid>

                                                                {/* Vital Signs */}
                                                                <Grid item xs={12} md={6}>
                                                                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#0066CC' }}>
                                                                        Vital Signs
                                                                    </Typography>
                                                                    {record.vitalSigns ? (
                                                                        <>
                                                                            {record.vitalSigns.bloodPressure && (
                                                                                <Typography variant="body2" sx={{ mb: 0.5 }}>
                                                                                    <strong>Blood Pressure:</strong> {record.vitalSigns.bloodPressure.systolic}/{record.vitalSigns.bloodPressure.diastolic} mmHg
                                                                                </Typography>
                                                                            )}
                                                                            {record.vitalSigns.heartRate && (
                                                                                <Typography variant="body2" sx={{ mb: 0.5 }}>
                                                                                    <strong>Heart Rate:</strong> {record.vitalSigns.heartRate} bpm
                                                                                </Typography>
                                                                            )}
                                                                            {record.vitalSigns.temperature && (
                                                                                <Typography variant="body2" sx={{ mb: 0.5 }}>
                                                                                    <strong>Temperature:</strong> {record.vitalSigns.temperature}°C
                                                                                </Typography>
                                                                            )}
                                                                            {record.vitalSigns.weight && (
                                                                                <Typography variant="body2" sx={{ mb: 0.5 }}>
                                                                                    <strong>Weight:</strong> {record.vitalSigns.weight} kg
                                                                                </Typography>
                                                                            )}
                                                                            {record.vitalSigns.height && (
                                                                                <Typography variant="body2" sx={{ mb: 0.5 }}>
                                                                                    <strong>Height:</strong> {record.vitalSigns.height} cm
                                                                                </Typography>
                                                                            )}
                                                                            {record.vitalSigns.bmi && (
                                                                                <Typography variant="body2" sx={{ mb: 0.5 }}>
                                                                                    <strong>BMI:</strong> {record.vitalSigns.bmi}
                                                                                </Typography>
                                                                            )}
                                                                        </>
                                                                    ) : (
                                                                        <Typography variant="body2" color="text.secondary">
                                                                            No vital signs recorded
                                                                        </Typography>
                                                                    )}
                                                                </Grid>

                                                                {/* Description & Notes */}
                                                                {record.description && (
                                                                    <Grid item xs={12}>
                                                                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#0066CC' }}>
                                                                            Description
                                                                        </Typography>
                                                                        <Typography variant="body2" sx={{ mb: 2 }}>
                                                                            {record.description}
                                                                        </Typography>
                                                                    </Grid>
                                                                )}

                                                                {/* Diagnosis & Treatment */}
                                                                <Grid item xs={12} md={6}>
                                                                    {record.diagnosis && (
                                                                        <>
                                                                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#0066CC' }}>
                                                                                Diagnosis
                                                                            </Typography>
                                                                            <Typography variant="body2" sx={{ mb: 2 }}>
                                                                                {record.diagnosis}
                                                                            </Typography>
                                                                        </>
                                                                    )}
                                                                </Grid>

                                                                <Grid item xs={12} md={6}>
                                                                    {record.treatmentPlan && (
                                                                        <>
                                                                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#0066CC' }}>
                                                                                Treatment Plan
                                                                            </Typography>
                                                                            <Typography variant="body2" sx={{ mb: 2 }}>
                                                                                {record.treatmentPlan}
                                                                            </Typography>
                                                                        </>
                                                                    )}
                                                                </Grid>

                                                                {/* Follow-up Information */}
                                                                {(record.followUpDate || record.followUpInstructions) && (
                                                                    <Grid item xs={12}>
                                                                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#0066CC' }}>
                                                                            Follow-up
                                                                        </Typography>
                                                                        {record.followUpDate && (
                                                                            <Typography variant="body2" sx={{ mb: 0.5 }}>
                                                                                <strong>Next Appointment:</strong> {record.followUpDate}
                                                                            </Typography>
                                                                        )}
                                                                        {record.followUpInstructions && (
                                                                            <Typography variant="body2">
                                                                                <strong>Instructions:</strong> {record.followUpInstructions}
                                                                            </Typography>
                                                                        )}
                                                                    </Grid>
                                                                )}

                                                                {/* Additional Notes */}
                                                                {record.notes && (
                                                                    <Grid item xs={12}>
                                                                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#0066CC' }}>
                                                                            Additional Notes
                                                                        </Typography>
                                                                        <Typography variant="body2">
                                                                            {record.notes}
                                                                        </Typography>
                                                                    </Grid>
                                                                )}

                                                                {/* Action Buttons */}
                                                                <Grid item xs={12} sx={{ mt: 2 }}>
                                                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                                                        <Button
                                                                            variant="outlined"
                                                                            size="small"
                                                                            onClick={() => {
                                                                                setSelectedRecord(record);
                                                                                setRecordDetailOpen(true);
                                                                            }}
                                                                            sx={{
                                                                                borderColor: '#0066CC',
                                                                                color: '#0066CC',
                                                                                '&:hover': {
                                                                                    backgroundColor: '#0066CC',
                                                                                    color: 'white'
                                                                                }
                                                                            }}
                                                                        >
                                                                            View Full Details
                                                                        </Button>
                                                                    </Box>
                                                                </Grid>
                                                            </Grid>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </Stack>
                                        </Box>
                                    )}
                                    {bhnSearchQuery && searchResults.length === 0 && (
                                        <Box sx={{ textAlign: 'center', py: 3 }}>
                                            <Typography variant="body1" color="text.secondary">
                                                No records found for BHN ID: {bhnSearchQuery}
                                            </Typography>
                                        </Box>
                                    )}
                                </CardContent>
                            </Card>
                        </>
                    )}

                    {/* Patient Management View */}
                    {currentView === 'patients' && (
                        <>
                            <Typography variant="h4" fontWeight={600} sx={{ mb: 3, fontFamily: '"Inter", "Roboto", sans-serif' }}>
                                Patient Management
                            </Typography>

                            {/* Patient Registration Card */}
                            <Card sx={{ mb: 3 }}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom sx={{ fontFamily: '"Inter", "Roboto", sans-serif' }}>
                                        Register New Patient
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                        Register a new patient with automatic BHN ID generation
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        startIcon={<AddIcon />}
                                        onClick={() => {
                                            setHealthDataForm(prev => ({ ...prev, isNewPatient: true }));
                                            setDataEntryOpen(true);
                                        }}
                                        sx={{
                                            bgcolor: '#0066CC',
                                            '&:hover': { bgcolor: '#0052A3' },
                                            py: 1.5,
                                            fontFamily: '"Inter", "Roboto", sans-serif'
                                        }}
                                    >
                                        Register New Patient
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Patient List */}
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom sx={{ fontFamily: '"Inter", "Roboto", sans-serif' }}>
                                        Registered Patients ({patientsList.length})
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                        View and manage patient records
                                    </Typography>

                                    {patientsList.length === 0 ? (
                                        <Box sx={{ textAlign: 'center', py: 4 }}>
                                            <HealthAndSafetyIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                                            <Typography variant="body1" color="text.secondary">
                                                No patients registered yet
                                            </Typography>
                                        </Box>
                                    ) : (
                                        <Grid container spacing={2}>
                                            {patientsList.map((patient) => (
                                                <Grid item xs={12} md={6} lg={4} key={patient.id}>
                                                    <Card variant="outlined" sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'grey.50' } }}>
                                                        <CardContent>
                                                            <Typography variant="subtitle1" fontWeight={600} sx={{ fontFamily: '"Inter", "Roboto", sans-serif' }}>
                                                                {patient.firstName} {patient.lastName}
                                                            </Typography>
                                                            <Typography variant="body2" color="primary" sx={{ mb: 1 }}>
                                                                BHN ID: {patient.bhnId}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                                DOB: {patient.dateOfBirth}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                                Phone: {patient.phone}
                                                            </Typography>
                                                            <Stack direction="row" spacing={1}>
                                                                <Button
                                                                    size="small"
                                                                    variant="outlined"
                                                                    onClick={() => {
                                                                        setSelectedPatient(patient);
                                                                        setHealthDataForm(prev => ({
                                                                            ...prev,
                                                                            patientId: patient.id,
                                                                            bhnId: patient.bhnId
                                                                        }));
                                                                        setDataEntryOpen(true);
                                                                    }}
                                                                >
                                                                    Add Record
                                                                </Button>
                                                                <Button
                                                                    size="small"
                                                                    variant="text"
                                                                    onClick={() => {
                                                                        setBhnSearchQuery(patient.bhnId);
                                                                        setCurrentView('records');
                                                                    }}
                                                                >
                                                                    View Records
                                                                </Button>
                                                            </Stack>
                                                        </CardContent>
                                                    </Card>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    )}
                                </CardContent>
                            </Card>
                        </>
                    )}

                    {/* Account Settings View */}
                    {currentView === 'settings' && (
                        <>
                            <Typography variant="h4" fontWeight={600} sx={{ mb: 3, fontFamily: '"Inter", "Roboto", sans-serif' }}>
                                Account Settings
                            </Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom sx={{ fontFamily: '"Inter", "Roboto", sans-serif' }}>
                                                Change Password
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                                Update your password to keep your account secure
                                            </Typography>
                                            <Stack spacing={3}>
                                                <TextField
                                                    fullWidth
                                                    type="password"
                                                    label="Current Password"
                                                    variant="outlined"
                                                />
                                                <TextField
                                                    fullWidth
                                                    type="password"
                                                    label="New Password"
                                                    variant="outlined"
                                                />
                                                <TextField
                                                    fullWidth
                                                    type="password"
                                                    label="Confirm New Password"
                                                    variant="outlined"
                                                />
                                                <Button
                                                    variant="contained"
                                                    sx={{
                                                        bgcolor: '#0066CC',
                                                        '&:hover': { bgcolor: '#0052A3' },
                                                        py: 1.5,
                                                        fontFamily: '"Inter", "Roboto", sans-serif'
                                                    }}
                                                >
                                                    Update Password
                                                </Button>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom sx={{ fontFamily: '"Inter", "Roboto", sans-serif' }}>
                                                Privacy & Security
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                                Your privacy is protected under PIPEDA & HIPAA regulations
                                            </Typography>
                                            <Stack spacing={2}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Typography variant="body2">Two-Factor Authentication</Typography>
                                                    <Chip label="Enabled" color="success" size="small" />
                                                </Box>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Typography variant="body2">Data Encryption</Typography>
                                                    <Chip label="AES-256" color="success" size="small" />
                                                </Box>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Typography variant="body2">Compliance Status</Typography>
                                                    <Chip label="PIPEDA/HIPAA" color="success" size="small" />
                                                </Box>
                                                <Button
                                                    variant="outlined"
                                                    sx={{
                                                        borderColor: '#0066CC',
                                                        color: '#0066CC',
                                                        '&:hover': { bgcolor: 'rgba(0, 102, 204, 0.04)' },
                                                        py: 1.5,
                                                        fontFamily: '"Inter", "Roboto", sans-serif'
                                                    }}
                                                >
                                                    View Privacy Policy
                                                </Button>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </>
                    )}
                </Container>
            </MainContent>

            {/* Quick Action Floating Button */}
            <QuickActionFab
                onClick={() => setDataEntryOpen(true)}
                aria-label="Add health record"
            >
                <AddIcon />
            </QuickActionFab>

            {/* Comprehensive Health Data Entry Dialog */}
            <Dialog
                open={dataEntryOpen}
                onClose={() => {
                    setDataEntryOpen(false);
                    resetHealthDataForm();
                }}
                maxWidth="lg"
                fullWidth
                sx={{ '& .MuiDialog-paper': { height: '90vh' } }}
            >
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <HospitalIcon />
                        <Typography variant="h5" fontWeight={700}>
                            {healthDataForm.isNewPatient ? 'Register New Patient & Add Health Record' : 'Add Health Record'}
                        </Typography>
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ px: 3 }}>
                    <Box sx={{ mt: 2 }}>
                        {/* Multi-step form stepper */}
                        <Stepper activeStep={formStep} sx={{ mb: 4 }} alternativeLabel>
                            <Step>
                                <StepLabel>Patient Info</StepLabel>
                            </Step>
                            <Step>
                                <StepLabel>Vital Signs</StepLabel>
                            </Step>
                            <Step>
                                <StepLabel>Medical History</StepLabel>
                            </Step>
                            <Step>
                                <StepLabel>Social & Insurance</StepLabel>
                            </Step>
                            <Step>
                                <StepLabel>Clinical Assessment</StepLabel>
                            </Step>
                            <Step>
                                <StepLabel>Review & Submit</StepLabel>
                            </Step>
                        </Stepper>

                        {/* Step Content - Part 1 will be added in next file */}
                        {formStep === 0 && (
                            <Box>
                                {/* New Patient Toggle */}
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={healthDataForm.isNewPatient}
                                            onChange={(e) => setHealthDataForm(prev => ({ ...prev, isNewPatient: e.target.checked }))}
                                            color="primary"
                                        />
                                    }
                                    label="Register New Patient"
                                    sx={{ mb: 3 }}
                                />

                                {/* Patient Selection */}
                                {!healthDataForm.isNewPatient && (
                                    <Autocomplete
                                        options={patientsList}
                                        getOptionLabel={(option) => `${option.firstName} ${option.lastName} (${option.bhnId})`}
                                        value={selectedPatient}
                                        onChange={(event, newValue) => {
                                            setSelectedPatient(newValue);
                                            if (newValue) {
                                                setHealthDataForm(prev => ({
                                                    ...prev,
                                                    patientId: newValue.id,
                                                    bhnId: newValue.bhnId
                                                }));
                                            }
                                        }}
                                        renderInput={(params) => (
                                            <TextField {...params} label="Select Patient" required />
                                        )}
                                        sx={{ mb: 3 }}
                                    />
                                )}

                                {/* Patient Information for new patients */}
                                {healthDataForm.isNewPatient && (
                                    <Grid container spacing={3} sx={{ mb: 3 }}>
                                        <Grid item xs={12} md={4}>
                                            <TextField
                                                fullWidth
                                                label="First Name"
                                                required
                                                value={healthDataForm.patientInfo.firstName}
                                                onChange={(e) => setHealthDataForm(prev => ({
                                                    ...prev,
                                                    patientInfo: { ...prev.patientInfo, firstName: e.target.value }
                                                }))}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <TextField
                                                fullWidth
                                                label="Last Name"
                                                required
                                                value={healthDataForm.patientInfo.lastName}
                                                onChange={(e) => setHealthDataForm(prev => ({
                                                    ...prev,
                                                    patientInfo: { ...prev.patientInfo, lastName: e.target.value }
                                                }))}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <TextField
                                                fullWidth
                                                label="Date of Birth"
                                                type="date"
                                                required
                                                InputLabelProps={{ shrink: true }}
                                                value={healthDataForm.patientInfo.dateOfBirth}
                                                onChange={(e) => setHealthDataForm(prev => ({
                                                    ...prev,
                                                    patientInfo: { ...prev.patientInfo, dateOfBirth: e.target.value }
                                                }))}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <FormControl fullWidth>
                                                <InputLabel>Gender</InputLabel>
                                                <Select
                                                    value={healthDataForm.patientInfo.gender}
                                                    onChange={(e) => setHealthDataForm(prev => ({
                                                        ...prev,
                                                        patientInfo: { ...prev.patientInfo, gender: e.target.value }
                                                    }))}
                                                >
                                                    <MenuItem value="male">Male</MenuItem>
                                                    <MenuItem value="female">Female</MenuItem>
                                                    <MenuItem value="other">Other</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                fullWidth
                                                label="Phone Number"
                                                required
                                                value={healthDataForm.patientInfo.phone}
                                                onChange={(e) => setHealthDataForm(prev => ({
                                                    ...prev,
                                                    patientInfo: { ...prev.patientInfo, phone: e.target.value }
                                                }))}
                                            />
                                        </Grid>
                                    </Grid>
                                )}

                                {/* Record Information */}
                                <Typography variant="h6" gutterBottom>Record Information</Typography>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            label="Record Title"
                                            required
                                            value={healthDataForm.title}
                                            onChange={(e) => setHealthDataForm(prev => ({ ...prev, title: e.target.value }))}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <FormControl fullWidth>
                                            <InputLabel>Record Type</InputLabel>
                                            <Select
                                                value={healthDataForm.recordType}
                                                onChange={(e) => setHealthDataForm(prev => ({ ...prev, recordType: e.target.value }))}
                                            >
                                                <MenuItem value="consultation">Consultation</MenuItem>
                                                <MenuItem value="emergency">Emergency</MenuItem>
                                                <MenuItem value="surgery">Surgery</MenuItem>
                                                <MenuItem value="lab_results">Lab Results</MenuItem>
                                                <MenuItem value="vaccination">Vaccination</MenuItem>
                                                <MenuItem value="vital_signs">Vital Signs</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <TextField
                                            fullWidth
                                            label="Visit Date"
                                            type="date"
                                            required
                                            InputLabelProps={{ shrink: true }}
                                            value={healthDataForm.visitDate}
                                            onChange={(e) => setHealthDataForm(prev => ({ ...prev, visitDate: e.target.value }))}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <TextField
                                            fullWidth
                                            label="Visit Time"
                                            type="time"
                                            InputLabelProps={{ shrink: true }}
                                            value={healthDataForm.visitTime}
                                            onChange={(e) => setHealthDataForm(prev => ({ ...prev, visitTime: e.target.value }))}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <FormControl fullWidth>
                                            <InputLabel>Urgency Level</InputLabel>
                                            <Select
                                                value={healthDataForm.urgencyLevel}
                                                onChange={(e) => setHealthDataForm(prev => ({ ...prev, urgencyLevel: e.target.value }))}
                                            >
                                                <MenuItem value="low">Low</MenuItem>
                                                <MenuItem value="normal">Normal</MenuItem>
                                                <MenuItem value="high">High</MenuItem>
                                                <MenuItem value="urgent">Urgent</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Description"
                                            multiline
                                            rows={3}
                                            value={healthDataForm.description}
                                            onChange={(e) => setHealthDataForm(prev => ({ ...prev, description: e.target.value }))}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                        )}

                        {/* Step 2: Vital Signs */}
                        {formStep === 1 && (
                            <Box>
                                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <HeartIcon /> Vital Signs
                                </Typography>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle2" gutterBottom>Blood Pressure (mmHg)</Typography>
                                        <Stack direction="row" spacing={2}>
                                            <TextField
                                                label="Systolic"
                                                type="number"
                                                value={healthDataForm.vitalSigns.bloodPressure.systolic}
                                                onChange={(e) => setHealthDataForm(prev => ({
                                                    ...prev,
                                                    vitalSigns: {
                                                        ...prev.vitalSigns,
                                                        bloodPressure: { ...prev.vitalSigns.bloodPressure, systolic: e.target.value }
                                                    }
                                                }))}
                                            />
                                            <TextField
                                                label="Diastolic"
                                                type="number"
                                                value={healthDataForm.vitalSigns.bloodPressure.diastolic}
                                                onChange={(e) => setHealthDataForm(prev => ({
                                                    ...prev,
                                                    vitalSigns: {
                                                        ...prev.vitalSigns,
                                                        bloodPressure: { ...prev.vitalSigns.bloodPressure, diastolic: e.target.value }
                                                    }
                                                }))}
                                            />
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <TextField
                                            fullWidth
                                            label="Heart Rate (bpm)"
                                            type="number"
                                            value={healthDataForm.vitalSigns.heartRate}
                                            onChange={(e) => setHealthDataForm(prev => ({
                                                ...prev,
                                                vitalSigns: { ...prev.vitalSigns, heartRate: e.target.value }
                                            }))}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <TextField
                                            fullWidth
                                            label="Temperature (°C)"
                                            type="number"
                                            step="0.1"
                                            value={healthDataForm.vitalSigns.temperature}
                                            onChange={(e) => setHealthDataForm(prev => ({
                                                ...prev,
                                                vitalSigns: { ...prev.vitalSigns, temperature: e.target.value }
                                            }))}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <TextField
                                            fullWidth
                                            label="Weight (kg)"
                                            type="number"
                                            step="0.1"
                                            value={healthDataForm.vitalSigns.weight}
                                            onChange={(e) => {
                                                const weight = e.target.value;
                                                setHealthDataForm(prev => ({
                                                    ...prev,
                                                    vitalSigns: {
                                                        ...prev.vitalSigns,
                                                        weight,
                                                        bmi: calculateBMI(weight, prev.vitalSigns.height)
                                                    }
                                                }));
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <TextField
                                            fullWidth
                                            label="Height (cm)"
                                            type="number"
                                            value={healthDataForm.vitalSigns.height}
                                            onChange={(e) => {
                                                const height = e.target.value;
                                                setHealthDataForm(prev => ({
                                                    ...prev,
                                                    vitalSigns: {
                                                        ...prev.vitalSigns,
                                                        height,
                                                        bmi: calculateBMI(prev.vitalSigns.weight, height)
                                                    }
                                                }));
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <TextField
                                            fullWidth
                                            label="BMI"
                                            value={healthDataForm.vitalSigns.bmi}
                                            InputProps={{ readOnly: true }}
                                            helperText="Calculated automatically"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography gutterBottom>Pain Level (0-10)</Typography>
                                        <Slider
                                            value={healthDataForm.vitalSigns.painLevel}
                                            onChange={(e, newValue) => setHealthDataForm(prev => ({
                                                ...prev,
                                                vitalSigns: { ...prev.vitalSigns, painLevel: newValue }
                                            }))}
                                            min={0}
                                            max={10}
                                            step={1}
                                            marks
                                            valueLabelDisplay="on"
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                        )}

                        {/* Step 3: Medical History */}
                        {formStep === 2 && (
                            <Box>
                                <Typography variant="h6" gutterBottom sx={{ color: '#0066CC', fontWeight: 700, mb: 3 }}>
                                    Medical History & Allergies
                                </Typography>
                                <Grid container spacing={3}>
                                    {/* Allergies */}
                                    <Grid item xs={12}>
                                        <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
                                            <Typography variant="subtitle1" gutterBottom fontWeight={600}>
                                                <BloodIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                                                Allergies & Reactions
                                            </Typography>
                                            <TextField
                                                fullWidth
                                                multiline
                                                rows={3}
                                                label="Known Allergies (medications, food, environmental)"
                                                placeholder="e.g., Penicillin - causes rash, Peanuts - anaphylaxis"
                                                value={healthDataForm.allergies.join(', ')}
                                                onChange={(e) => setHealthDataForm(prev => ({
                                                    ...prev,
                                                    allergies: e.target.value.split(',').map(item => item.trim()).filter(item => item)
                                                }))}
                                            />
                                        </Card>
                                    </Grid>

                                    {/* Current Medications */}
                                    <Grid item xs={12}>
                                        <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
                                            <Typography variant="subtitle1" gutterBottom fontWeight={600}>
                                                <MedicationIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                                                Current Medications
                                            </Typography>
                                            <TextField
                                                fullWidth
                                                multiline
                                                rows={3}
                                                label="Current Medications & Dosages"
                                                placeholder="e.g., Lisinopril 10mg daily, Metformin 500mg twice daily"
                                                value={healthDataForm.currentMedications.join(', ')}
                                                onChange={(e) => setHealthDataForm(prev => ({
                                                    ...prev,
                                                    currentMedications: e.target.value.split(',').map(item => item.trim()).filter(item => item)
                                                }))}
                                            />
                                        </Card>
                                    </Grid>

                                    {/* Family History */}
                                    <Grid item xs={12}>
                                        <Card variant="outlined" sx={{ p: 2 }}>
                                            <Typography variant="subtitle1" gutterBottom fontWeight={600}>
                                                <FamilyRestroomIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                                                Family Medical History
                                            </Typography>
                                            <Grid container spacing={2}>
                                                {[
                                                    { key: 'cardiovascular', label: 'Heart Disease' },
                                                    { key: 'diabetes', label: 'Diabetes' },
                                                    { key: 'cancer', label: 'Cancer' },
                                                    { key: 'mentalHealth', label: 'Mental Health' },
                                                    { key: 'neurologicalDisorders', label: 'Neurological Disorders' },
                                                    { key: 'autoimmune', label: 'Autoimmune Conditions' }
                                                ].map((condition) => (
                                                    <Grid item xs={12} sm={6} md={4} key={condition.key}>
                                                        <FormControlLabel
                                                            control={
                                                                <Switch
                                                                    checked={healthDataForm.familyHistory[condition.key]}
                                                                    onChange={(e) => setHealthDataForm(prev => ({
                                                                        ...prev,
                                                                        familyHistory: {
                                                                            ...prev.familyHistory,
                                                                            [condition.key]: e.target.checked
                                                                        }
                                                                    }))}
                                                                    color="primary"
                                                                />
                                                            }
                                                            label={condition.label}
                                                        />
                                                    </Grid>
                                                ))}
                                                <Grid item xs={12}>
                                                    <TextField
                                                        fullWidth
                                                        label="Other Family History"
                                                        placeholder="Additional family medical history details"
                                                        value={healthDataForm.familyHistory.other}
                                                        onChange={(e) => setHealthDataForm(prev => ({
                                                            ...prev,
                                                            familyHistory: { ...prev.familyHistory, other: e.target.value }
                                                        }))}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Card>
                                    </Grid>
                                </Grid>
                            </Box>
                        )}

                        {/* Step 4: Social History & Insurance */}
                        {formStep === 3 && (
                            <Box>
                                <Typography variant="h6" gutterBottom sx={{ color: '#0066CC', fontWeight: 700, mb: 3 }}>
                                    Social History & Insurance Information
                                </Typography>
                                <Grid container spacing={3}>
                                    {/* Social History */}
                                    <Grid item xs={12} md={6}>
                                        <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
                                            <Typography variant="subtitle1" gutterBottom fontWeight={600}>
                                                <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                                                Lifestyle & Social History
                                            </Typography>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12}>
                                                    <FormControl fullWidth>
                                                        <InputLabel>Smoking Status</InputLabel>
                                                        <Select
                                                            value={healthDataForm.socialHistory.smoking}
                                                            onChange={(e) => setHealthDataForm(prev => ({
                                                                ...prev,
                                                                socialHistory: { ...prev.socialHistory, smoking: e.target.value }
                                                            }))}
                                                        >
                                                            <MenuItem value="never">Never</MenuItem>
                                                            <MenuItem value="former">Former smoker</MenuItem>
                                                            <MenuItem value="current">Current smoker</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <FormControl fullWidth>
                                                        <InputLabel>Alcohol Use</InputLabel>
                                                        <Select
                                                            value={healthDataForm.socialHistory.alcohol}
                                                            onChange={(e) => setHealthDataForm(prev => ({
                                                                ...prev,
                                                                socialHistory: { ...prev.socialHistory, alcohol: e.target.value }
                                                            }))}
                                                        >
                                                            <MenuItem value="none">None</MenuItem>
                                                            <MenuItem value="occasional">Occasional</MenuItem>
                                                            <MenuItem value="moderate">Moderate</MenuItem>
                                                            <MenuItem value="heavy">Heavy</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <FormControl fullWidth>
                                                        <InputLabel>Exercise Level</InputLabel>
                                                        <Select
                                                            value={healthDataForm.socialHistory.exercise}
                                                            onChange={(e) => setHealthDataForm(prev => ({
                                                                ...prev,
                                                                socialHistory: { ...prev.socialHistory, exercise: e.target.value }
                                                            }))}
                                                        >
                                                            <MenuItem value="sedentary">Sedentary</MenuItem>
                                                            <MenuItem value="light">Light activity</MenuItem>
                                                            <MenuItem value="moderate">Moderate activity</MenuItem>
                                                            <MenuItem value="active">Very active</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        fullWidth
                                                        label="Occupation"
                                                        value={healthDataForm.socialHistory.occupation}
                                                        onChange={(e) => setHealthDataForm(prev => ({
                                                            ...prev,
                                                            socialHistory: { ...prev.socialHistory, occupation: e.target.value }
                                                        }))}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Card>
                                    </Grid>

                                    {/* Insurance Information */}
                                    <Grid item xs={12} md={6}>
                                        <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
                                            <Typography variant="subtitle1" gutterBottom fontWeight={600}>
                                                <SecurityIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                                                Insurance Information
                                            </Typography>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        fullWidth
                                                        label="Insurance Provider"
                                                        placeholder="e.g., Blue Cross Blue Shield"
                                                        value={healthDataForm.insurance.provider}
                                                        onChange={(e) => setHealthDataForm(prev => ({
                                                            ...prev,
                                                            insurance: { ...prev.insurance, provider: e.target.value }
                                                        }))}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        fullWidth
                                                        label="Policy Number"
                                                        value={healthDataForm.insurance.policyNumber}
                                                        onChange={(e) => setHealthDataForm(prev => ({
                                                            ...prev,
                                                            insurance: { ...prev.insurance, policyNumber: e.target.value }
                                                        }))}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        fullWidth
                                                        label="Group Number"
                                                        value={healthDataForm.insurance.groupNumber}
                                                        onChange={(e) => setHealthDataForm(prev => ({
                                                            ...prev,
                                                            insurance: { ...prev.insurance, groupNumber: e.target.value }
                                                        }))}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Card>
                                    </Grid>

                                    {/* Emergency Contact */}
                                    <Grid item xs={12}>
                                        <Card variant="outlined" sx={{ p: 2 }}>
                                            <Typography variant="subtitle1" gutterBottom fontWeight={600}>
                                                Emergency Contact Information
                                            </Typography>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} md={4}>
                                                    <TextField
                                                        fullWidth
                                                        label="Emergency Contact Name"
                                                        value={healthDataForm.socialHistory.emergencyContact.name}
                                                        onChange={(e) => setHealthDataForm(prev => ({
                                                            ...prev,
                                                            socialHistory: {
                                                                ...prev.socialHistory,
                                                                emergencyContact: { ...prev.socialHistory.emergencyContact, name: e.target.value }
                                                            }
                                                        }))}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={4}>
                                                    <TextField
                                                        fullWidth
                                                        label="Relationship"
                                                        value={healthDataForm.socialHistory.emergencyContact.relationship}
                                                        onChange={(e) => setHealthDataForm(prev => ({
                                                            ...prev,
                                                            socialHistory: {
                                                                ...prev.socialHistory,
                                                                emergencyContact: { ...prev.socialHistory.emergencyContact, relationship: e.target.value }
                                                            }
                                                        }))}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={4}>
                                                    <TextField
                                                        fullWidth
                                                        label="Phone Number"
                                                        value={healthDataForm.socialHistory.emergencyContact.phone}
                                                        onChange={(e) => setHealthDataForm(prev => ({
                                                            ...prev,
                                                            socialHistory: {
                                                                ...prev.socialHistory,
                                                                emergencyContact: { ...prev.socialHistory.emergencyContact, phone: e.target.value }
                                                            }
                                                        }))}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Card>
                                    </Grid>
                                </Grid>
                            </Box>
                        )}

                        {/* Step 5: Clinical Assessment */}
                        {formStep === 4 && (
                            <Box>
                                <Typography variant="h6" gutterBottom>Clinical Assessment</Typography>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Diagnosis"
                                            multiline
                                            rows={3}
                                            value={healthDataForm.diagnosis}
                                            onChange={(e) => setHealthDataForm(prev => ({ ...prev, diagnosis: e.target.value }))}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Treatment Plan"
                                            multiline
                                            rows={3}
                                            value={healthDataForm.treatmentPlan}
                                            onChange={(e) => setHealthDataForm(prev => ({ ...prev, treatmentPlan: e.target.value }))}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Clinical Notes"
                                            multiline
                                            rows={4}
                                            value={healthDataForm.notes}
                                            onChange={(e) => setHealthDataForm(prev => ({ ...prev, notes: e.target.value }))}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                        )}

                        {/* Step 6: Review & Submit */}
                        {formStep === 5 && (
                            <Box>
                                <Typography variant="h6" gutterBottom>Review & Submit</Typography>
                                <Card variant="outlined" sx={{ p: 2 }}>
                                    <Typography variant="subtitle1" gutterBottom fontWeight={600}>
                                        Record Summary
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="body2"><strong>Title:</strong> {healthDataForm.title}</Typography>
                                            <Typography variant="body2"><strong>Type:</strong> {healthDataForm.recordType}</Typography>
                                            <Typography variant="body2"><strong>Date:</strong> {healthDataForm.visitDate}</Typography>
                                            <Typography variant="body2"><strong>Urgency:</strong> {healthDataForm.urgencyLevel}</Typography>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            {healthDataForm.vitalSigns.bloodPressure.systolic && (
                                                <Typography variant="body2">
                                                    <strong>Blood Pressure:</strong> {healthDataForm.vitalSigns.bloodPressure.systolic}/{healthDataForm.vitalSigns.bloodPressure.diastolic} mmHg
                                                </Typography>
                                            )}
                                            {healthDataForm.vitalSigns.heartRate && (
                                                <Typography variant="body2">
                                                    <strong>Heart Rate:</strong> {healthDataForm.vitalSigns.heartRate} bpm
                                                </Typography>
                                            )}
                                            {healthDataForm.vitalSigns.bmi && (
                                                <Typography variant="body2">
                                                    <strong>BMI:</strong> {healthDataForm.vitalSigns.bmi}
                                                </Typography>
                                            )}
                                        </Grid>
                                    </Grid>
                                </Card>
                            </Box>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3, justifyContent: 'space-between' }}>
                    <Button
                        onClick={() => {
                            setDataEntryOpen(false);
                            resetHealthDataForm();
                        }}
                    >
                        Cancel
                    </Button>
                    <Box>
                        {formStep > 0 && (
                            <Button
                                onClick={() => setFormStep(prev => prev - 1)}
                                sx={{ mr: 1 }}
                            >
                                Back
                            </Button>
                        )}
                        {formStep < 5 ? (
                            <Button
                                onClick={() => setFormStep(prev => prev + 1)}
                                variant="contained"
                                sx={{ bgcolor: '#0066CC' }}
                            >
                                Next
                            </Button>
                        ) : (
                            <Button
                                onClick={handleDataEntrySubmit}
                                variant="contained"
                                disabled={loading}
                                sx={{ bgcolor: '#0066CC' }}
                            >
                                {loading ? 'Saving...' : 'Save Health Record'}
                            </Button>
                        )}
                    </Box>
                </DialogActions>
            </Dialog>

            {/* Success/Error Snackbar */}
            {/* Comprehensive Health Record Detail Dialog */}
            <Dialog
                open={recordDetailOpen}
                onClose={() => setRecordDetailOpen(false)}
                maxWidth="lg"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '16px',
                        maxHeight: '90vh'
                    }
                }}
            >
                <DialogTitle sx={{
                    bgcolor: '#0066CC',
                    color: 'white',
                    py: 3,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <Box>
                        <Typography variant="h5" fontWeight={600}>
                            Complete Health Record Details
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                            HIPAA Compliant • Secure Access
                        </Typography>
                    </Box>
                    <Chip
                        label="CONFIDENTIAL"
                        size="small"
                        sx={{
                            bgcolor: 'rgba(255, 255, 255, 0.2)',
                            color: 'white',
                            fontWeight: 600
                        }}
                    />
                </DialogTitle>

                {selectedRecord && (
                    <DialogContent sx={{ p: 4 }}>
                        <Grid container spacing={4}>
                            {/* Patient Demographics Section */}
                            <Grid item xs={12}>
                                <Card sx={{ mb: 3, backgroundColor: '#f8faff', border: '1px solid #e3f2fd' }}>
                                    <CardContent sx={{ p: 3 }}>
                                        <Typography variant="h6" sx={{ color: '#0066CC', fontWeight: 600, mb: 2 }}>
                                            🏥 Patient Demographics & Contact Information
                                        </Typography>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12} md={6}>
                                                <Typography variant="body2" sx={{ mb: 1 }}>
                                                    <strong>Full Name:</strong> {selectedRecord.patientInfo?.firstName || 'N/A'} {selectedRecord.patientInfo?.middleName || ''} {selectedRecord.patientInfo?.lastName || 'N/A'}
                                                </Typography>
                                                <Typography variant="body2" sx={{ mb: 1 }}>
                                                    <strong>BHN ID:</strong> {selectedRecord.bhnId || 'N/A'}
                                                </Typography>
                                                <Typography variant="body2" sx={{ mb: 1 }}>
                                                    <strong>Date of Birth:</strong> {selectedRecord.patientInfo?.dateOfBirth || 'N/A'}
                                                </Typography>
                                                <Typography variant="body2" sx={{ mb: 1 }}>
                                                    <strong>Gender:</strong> {selectedRecord.patientInfo?.gender || 'N/A'}
                                                </Typography>
                                                <Typography variant="body2" sx={{ mb: 1 }}>
                                                    <strong>Phone:</strong> {selectedRecord.patientInfo?.phone || 'N/A'}
                                                </Typography>
                                                <Typography variant="body2">
                                                    <strong>Email:</strong> {selectedRecord.patientInfo?.email || 'N/A'}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <Typography variant="body2" sx={{ mb: 1 }}>
                                                    <strong>Address:</strong> {selectedRecord.patientInfo?.address || 'N/A'}
                                                </Typography>
                                                <Typography variant="body2" sx={{ mb: 1 }}>
                                                    <strong>City:</strong> {selectedRecord.patientInfo?.city || 'N/A'}
                                                </Typography>
                                                <Typography variant="body2" sx={{ mb: 1 }}>
                                                    <strong>Province:</strong> {selectedRecord.patientInfo?.province || 'N/A'}
                                                </Typography>
                                                <Typography variant="body2" sx={{ mb: 1 }}>
                                                    <strong>Postal Code:</strong> {selectedRecord.patientInfo?.postalCode || 'N/A'}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* HIPAA Compliance Notice */}
                            <Grid item xs={12}>
                                <Alert severity="info" sx={{ mb: 2 }}>
                                    <Typography variant="body2">
                                        <strong>HIPAA Compliance Notice:</strong> This health information is protected by federal privacy laws.
                                        Unauthorized access, use, or disclosure is prohibited and may result in civil and criminal penalties.
                                    </Typography>
                                </Alert>
                            </Grid>
                        </Grid>
                    </DialogContent>
                )}

                <DialogActions sx={{ p: 3, backgroundColor: '#f5f5f5' }}>
                    <Button
                        onClick={() => setRecordDetailOpen(false)}
                        variant="contained"
                        sx={{
                            bgcolor: '#0066CC',
                            '&:hover': { bgcolor: '#0052A3' },
                            borderRadius: '8px',
                            px: 3
                        }}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Alert
                    onClose={() => setSnackbarOpen(false)}
                    severity={snackbarSeverity}
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </DashboardContainer>
    );
};

export default EnhancedDashboard;