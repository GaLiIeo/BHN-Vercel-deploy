import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import {
    Box,
    Container,
    Grid,
    Paper,
    Typography,
    Button,
    Avatar,
    TextField,
    Divider,
    Tab,
    Tabs,
    Alert,
    Snackbar,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import styled from 'styled-components';
import { useAuth } from '../../../context/AuthContext';
import { userAPI } from '../../../utils/api';
import { validateForm, formatPhoneNumber, formatDate } from '../../../utils/formValidation';

// Icons
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import LockIcon from '@mui/icons-material/Lock';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

const ProfileContainer = styled(Box)`
  padding: 100px 0;
  background-color: #F5F5F5;
  min-height: 100vh;
`;

const PageTitle = styled(Typography)`
  font-weight: 700;
  margin-bottom: 32px;
`;

const ProfileAvatar = styled(Avatar)`
  width: 120px;
  height: 120px;
  margin-bottom: 16px;
  background-color: #0066CC;
  font-size: 48px;
`;

const ProfileCard = styled(Paper)`
  padding: 32px;
  height: 100%;
`;

const TabPanel = (props) => {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`profile-tabpanel-${index}`}
            aria-labelledby={`profile-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ pt: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
};

const PatientProfile = () => {
    const { currentUser, logout } = useAuth();
    const [activeTab, setActiveTab] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success',
    });
    const [formErrors, setFormErrors] = useState({});

    const [profileData, setProfileData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        emergencyContact: '',
        emergencyPhone: '',
        bloodType: '',
        allergies: '',
        medications: '',
        insuranceProvider: '',
        insuranceNumber: '',
        primaryDoctor: '',
    });

    useEffect(() => {
        const fetchProfileData = async () => {
            setLoading(true);
            try {
                // In a real app, this would call an API
                // For demo purposes, we'll use the current user data
                if (currentUser) {
                    setProfileData({
                        ...profileData,
                        firstName: currentUser.firstName || '',
                        lastName: currentUser.lastName || '',
                        email: currentUser.email || '',
                        phone: currentUser.phone || '',
                    });
                }
            } catch (error) {
                console.error('Error fetching profile data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [currentUser]);

    // Redirect if not logged in
    if (!currentUser) {
        return <Navigate to="/login" />;
    }

    // Redirect if not a patient
    if (currentUser.userType !== 'patient') {
        return <Navigate to="/dashboard" />;
    }

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData({
            ...profileData,
            [name]: value,
        });
    };

    const handleEditToggle = () => {
        if (isEditing) {
            // Cancel editing, reset form
            setIsEditing(false);
            setFormErrors({});
        } else {
            setIsEditing(true);
        }
    };

    const handleSaveProfile = async () => {
        // Validate form
        const validation = validateForm(profileData);
        if (!validation.isValid) {
            setFormErrors(validation.errors);
            return;
        }

        setLoading(true);
        try {
            // In a real app, this would call an API
            // For demo purposes, we'll simulate a successful update
            setTimeout(() => {
                setSnackbar({
                    open: true,
                    message: 'Profile updated successfully',
                    severity: 'success',
                });
                setIsEditing(false);
                setFormErrors({});
                setLoading(false);
            }, 1000);
        } catch (error) {
            console.error('Error updating profile:', error);
            setSnackbar({
                open: true,
                message: 'An error occurred while updating your profile',
                severity: 'error',
            });
            setLoading(false);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({
            ...snackbar,
            open: false,
        });
    };

    const getInitials = (firstName, lastName) => {
        return firstName && lastName
            ? `${firstName[0]}${lastName[0]}`.toUpperCase()
            : <PersonIcon />;
    };

    const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'];
    const states = [
        'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
        'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
        'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
        'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
        'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
    ];

    return (
        <ProfileContainer>
            <Container maxWidth="lg">
                <PageTitle variant="h4">
                    My Profile
                </PageTitle>

                <Grid container spacing={4}>
                    {/* Profile Summary */}
                    <Grid item xs={12} md={4}>
                        <ProfileCard elevation={1}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                                <ProfileAvatar>
                                    {getInitials(profileData.firstName, profileData.lastName)}
                                </ProfileAvatar>
                                <Typography variant="h5" fontWeight={600} gutterBottom>
                                    {profileData.firstName} {profileData.lastName}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Patient
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Member since {formatDate(profileData.createdAt || '2023-01-01')}
                                </Typography>
                            </Box>

                            <Divider sx={{ my: 3 }} />

                            <Box>
                                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                    Contact Information
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    <strong>Email:</strong> {profileData.email}
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    <strong>Phone:</strong> {formatPhoneNumber(profileData.phone)}
                                </Typography>
                            </Box>

                            <Divider sx={{ my: 3 }} />

                            <Box>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    startIcon={isEditing ? <CancelIcon /> : <EditIcon />}
                                    onClick={handleEditToggle}
                                    sx={{ mb: 2 }}
                                >
                                    {isEditing ? 'Cancel Editing' : 'Edit Profile'}
                                </Button>
                                {isEditing && (
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        fullWidth
                                        startIcon={<SaveIcon />}
                                        onClick={handleSaveProfile}
                                        disabled={loading}
                                    >
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                )}
                            </Box>
                        </ProfileCard>
                    </Grid>

                    {/* Profile Details */}
                    <Grid item xs={12} md={8}>
                        <ProfileCard elevation={1}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs value={activeTab} onChange={handleTabChange} aria-label="profile tabs">
                                    <Tab label="Personal Information" />
                                    <Tab label="Medical Information" />
                                    <Tab label="Insurance" />
                                </Tabs>
                            </Box>

                            <TabPanel value={activeTab} index={0}>
                                {/* Personal Information Tab */}
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="First Name"
                                            name="firstName"
                                            value={profileData.firstName}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            error={Boolean(formErrors.firstName)}
                                            helperText={formErrors.firstName}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Last Name"
                                            name="lastName"
                                            value={profileData.lastName}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            error={Boolean(formErrors.lastName)}
                                            helperText={formErrors.lastName}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Email"
                                            name="email"
                                            value={profileData.email}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            error={Boolean(formErrors.email)}
                                            helperText={formErrors.email}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Phone"
                                            name="phone"
                                            value={profileData.phone}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            error={Boolean(formErrors.phone)}
                                            helperText={formErrors.phone}
                                        />
                                    </Grid>
                                </Grid>
                            </TabPanel>
                        </ProfileCard>
                    </Grid>
                </Grid>

                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                >
                    <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Container>
        </ProfileContainer>
    );
};

export default PatientProfile;