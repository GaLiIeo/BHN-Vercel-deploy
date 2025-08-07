import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Divider,
    FormControl,
    FormControlLabel,
    FormHelperText,
    FormLabel,
    Grid,
    InputAdornment,
    InputLabel,
    Link,
    OutlinedInput,
    Radio,
    RadioGroup,
    Stack,
    Typography,
    Alert,
    Stepper,
    Step,
    StepLabel,
    StepConnector,
    useTheme,
    alpha,
} from '@mui/material';
import styled from 'styled-components';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import BadgeIcon from '@mui/icons-material/Badge';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useAuth } from '../../../context/AuthContext';
import Logo from '../../layout/Logo';

const PageContainer = styled(Box)`
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 40px 0;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4ecfb 100%);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 8px;
    background: linear-gradient(90deg, #0066CC, #00843D, #0066CC);
    z-index: 2;
  }
`;

const BackgroundCircle = styled(Box)`
  position: absolute;
  border-radius: 50%;
  opacity: 0.05;
  background: linear-gradient(135deg, #0066CC 0%, #00843D 100%);
`;

const RegisterCard = styled(Card)`
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  background: white;
  backdrop-filter: blur(10px);
  transform-style: preserve-3d;
  perspective: 1000px;
`;

const CardHeader = styled(Box)`
  background: linear-gradient(135deg, #0066CC 0%, #004C99 100%);
  color: white;
  padding: 32px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 60%);
    transform: rotate(-45deg);
  }
`;

const FormContainer = styled(CardContent)`
  padding: 40px;
  position: relative;
  z-index: 1;
`;

const StyledButton = styled(Button)`
  padding: 14px;
  font-weight: 600;
  background: ${props => props.variant === 'contained' ? 'linear-gradient(90deg, #0066CC, #0052a3)' : 'transparent'};
  box-shadow: ${props => props.variant === 'contained' ? '0 4px 12px rgba(0, 102, 204, 0.3)' : 'none'};
  transition: all 0.3s ease;
  border-radius: 8px;
  
  &:hover {
    box-shadow: ${props => props.variant === 'contained' ? '0 6px 16px rgba(0, 102, 204, 0.4)' : 'none'};
    transform: translateY(-2px);
  }
`;

const DemoCredentials = styled(Box)`
  background: linear-gradient(135deg, #e8f4fd 0%, #d1e6fa 100%);
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 28px;
  border-left: 4px solid #0066CC;
`;

const StyledFormControl = styled(FormControl)`
  & .MuiOutlinedInput-root {
    transition: all 0.3s ease;
    border-radius: 8px;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
    }
    
    &.Mui-focused {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 102, 204, 0.1);
    }
  }
`;

const StyledStepper = styled(Stepper)`
  margin-bottom: 36px;
  
  .MuiStepConnector-line {
    border-color: rgba(0, 102, 204, 0.2);
  }
  
  .MuiStepLabel-label {
    font-weight: 500;
  }
  
  .MuiStepLabel-label.Mui-active {
    color: #0066CC;
    font-weight: 600;
  }
  
  .MuiStepLabel-label.Mui-completed {
    color: #00843D;
    font-weight: 600;
  }
  
  .MuiStepIcon-root.Mui-active {
    color: #0066CC;
  }
  
  .MuiStepIcon-root.Mui-completed {
    color: #00843D;
  }
`;

const AccountTypeCard = styled(Box)`
  border: 2px solid ${props => props.selected ? '#0066CC' : 'rgba(0, 0, 0, 0.08)'};
  border-radius: 12px;
  padding: 24px;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  background: ${props => props.selected ? 'rgba(0, 102, 204, 0.05)' : 'white'};
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.06);
  }
  
  .account-icon {
    font-size: 48px;
    color: ${props => props.selected ? '#0066CC' : 'rgba(0, 0, 0, 0.4)'};
    margin-bottom: 16px;
    transition: all 0.3s ease;
  }
  
  .check-icon {
    position: absolute;
    top: 16px;
    right: 16px;
    color: #0066CC;
    font-size: 24px;
    opacity: ${props => props.selected ? 1 : 0};
    transform: ${props => props.selected ? 'scale(1)' : 'scale(0)'};
    transition: all 0.3s ease;
  }
`;

const BrandLogo = styled(Box)`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
`;

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const theme = useTheme();

    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [registerError, setRegisterError] = useState('');
    const [animateStep, setAnimateStep] = useState(true);

    const [values, setValues] = useState({
        fullName: '',
        email: '',
        doctorEmail: '',
        healthcareDomain: '',
        directorName: '',
        password: '',
        confirmPassword: '',
        token: '',
        userType: 'provider',
        showPassword: false,
        showConfirmPassword: false,
        showToken: false,
    });

    const [errors, setErrors] = useState({
        fullName: '',
        email: '',
        doctorEmail: '',
        healthcareDomain: '',
        directorName: '',
        password: '',
        confirmPassword: '',
        token: '',
    });

    const steps = ['Account Type', 'Personal Information', 'Create Password'];

    useEffect(() => {
        setAnimateStep(true);
        const timer = setTimeout(() => {
            setAnimateStep(false);
        }, 500);
        return () => clearTimeout(timer);
    }, [activeStep]);

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
        setErrors({ ...errors, [prop]: '' });
        setRegisterError('');
    };

    const handleClickShowPassword = (field) => {
        if (field === 'password') {
            setValues({ ...values, showPassword: !values.showPassword });
        } else if (field === 'confirmPassword') {
            setValues({ ...values, showConfirmPassword: !values.showConfirmPassword });
        } else if (field === 'token') {
            setValues({ ...values, showToken: !values.showToken });
        }
    };

    const validateStep = (step) => {
        let isValid = true;
        const newErrors = { ...errors };

        if (step === 0) {
            // Account type validation (nothing to validate)
            return true;
        }

        if (step === 1) {
            // Personal information validation
            if (!values.fullName.trim()) {
                newErrors.fullName = 'Full name is required';
                isValid = false;
            }

            if (!values.directorName.trim()) {
                newErrors.directorName = 'Director name is required';
                isValid = false;
            }

            if (!values.email.trim()) {
                newErrors.email = 'Email is required';
                isValid = false;
            } else if (!/\S+@\S+\.\S+/.test(values.email)) {
                newErrors.email = 'Email is invalid';
                isValid = false;
            }

            if (!values.doctorEmail.trim()) {
                newErrors.doctorEmail = 'Doctor email is required';
                isValid = false;
            } else if (!/\S+@\S+\.\S+/.test(values.doctorEmail)) {
                newErrors.doctorEmail = 'Doctor email is invalid';
                isValid = false;
            }

            if (!values.healthcareDomain.trim()) {
                newErrors.healthcareDomain = 'Healthcare domain is required';
                isValid = false;
            }
        }

        if (step === 2) {
            // Password and token validation
            if (!values.password) {
                newErrors.password = 'Password is required';
                isValid = false;
            } else if (values.password.length < 8) {
                newErrors.password = 'Password must be at least 8 characters';
                isValid = false;
            }

            if (!values.confirmPassword) {
                newErrors.confirmPassword = 'Please confirm your password';
                isValid = false;
            } else if (values.password !== values.confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match';
                isValid = false;
            }

            if (!values.token) {
                newErrors.token = 'Token is required';
                isValid = false;
            } else if (values.token.length < 6) {
                newErrors.token = 'Token must be at least 6 characters';
                isValid = false;
            }
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleNext = () => {
        if (validateStep(activeStep)) {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateStep(activeStep)) {
            return;
        }

        setLoading(true);
        setRegisterError('');

        try {
            const userData = {
                fullName: values.fullName,
                email: values.email,
                doctorEmail: values.doctorEmail,
                healthcareDomain: values.healthcareDomain,
                directorName: values.directorName,
                password: values.password,
                token: values.token,
                userType: values.userType,
            };

            const result = await register(userData);

            if (result.success) {
                navigate('/dashboard');
            } else {
                setRegisterError(result.error || 'Failed to register. Please try again.');
            }
        } catch (error) {
            setRegisterError('An unexpected error occurred. Please try again.');
            console.error('Registration error:', error);
        } finally {
            setLoading(false);
        }
    };

    const fillDemoInfo = () => {
        setValues({
            ...values,
            fullName: 'Sarah Johnson',
            email: 'doctor@example.com',
            doctorEmail: 'dr.johnson@hospital.com',
            healthcareDomain: 'Pediatrics',
            directorName: 'Dr. Sarah Johnson',
            password: 'password123',
            confirmPassword: 'password123',
            token: 'token123',
        });
        setErrors({
            fullName: '',
            email: '',
            doctorEmail: '',
            healthcareDomain: '',
            directorName: '',
            password: '',
            confirmPassword: '',
            token: '',
        });
        setRegisterError('');
    };

    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Box className={animateStep ? 'animate-step' : ''} sx={{
                        opacity: animateStep ? 0 : 1,
                        transform: animateStep ? 'translateY(20px)' : 'translateY(0)',
                        transition: 'all 0.5s ease'
                    }}>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                            Select Account Type
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                            Healthcare Provider Registration
                        </Typography>

                        <Grid container spacing={3} justifyContent="center">
                            <Grid item xs={12} md={8}>
                                <AccountTypeCard
                                    selected={true}
                                    onClick={() => setValues({ ...values, userType: 'provider' })}
                                >
                                    <MedicalServicesIcon className="account-icon" />
                                    <CheckCircleOutlineIcon className="check-icon" />
                                    <Typography variant="h6" fontWeight={600} gutterBottom>
                                        Healthcare Provider
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        For doctors, nurses, and other healthcare professionals
                                    </Typography>
                                </AccountTypeCard>
                            </Grid>
                        </Grid>
                    </Box>
                );

            case 1:
                return (
                    <Box className={animateStep ? 'animate-step' : ''} sx={{
                        opacity: animateStep ? 0 : 1,
                        transform: animateStep ? 'translateY(20px)' : 'translateY(0)',
                        transition: 'all 0.5s ease'
                    }}>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                            Personal Information
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                            Enter your personal details
                        </Typography>

                        <Stack spacing={3}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <StyledFormControl variant="outlined" fullWidth error={Boolean(errors.fullName)}>
                                        <InputLabel htmlFor="fullName">Full Name</InputLabel>
                                        <OutlinedInput
                                            id="fullName"
                                            value={values.fullName}
                                            onChange={handleChange('fullName')}
                                            label="Full Name"
                                            startAdornment={
                                                <InputAdornment position="start">
                                                    <PersonOutlineIcon sx={{ color: 'text.secondary' }} />
                                                </InputAdornment>
                                            }
                                        />
                                        {errors.fullName && <FormHelperText error>{errors.fullName}</FormHelperText>}
                                    </StyledFormControl>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <StyledFormControl variant="outlined" fullWidth error={Boolean(errors.email)}>
                                        <InputLabel htmlFor="email">Email Address</InputLabel>
                                        <OutlinedInput
                                            id="email"
                                            type="email"
                                            value={values.email}
                                            onChange={handleChange('email')}
                                            label="Email Address"
                                            startAdornment={
                                                <InputAdornment position="start">
                                                    <EmailOutlinedIcon sx={{ color: 'text.secondary' }} />
                                                </InputAdornment>
                                            }
                                        />
                                        {errors.email && <FormHelperText error>{errors.email}</FormHelperText>}
                                    </StyledFormControl>
                                </Grid>
                            </Grid>

                            <StyledFormControl variant="outlined" fullWidth error={Boolean(errors.doctorEmail)}>
                                <InputLabel htmlFor="doctorEmail">Doctor Email</InputLabel>
                                <OutlinedInput
                                    id="doctorEmail"
                                    type="email"
                                    value={values.doctorEmail}
                                    onChange={handleChange('doctorEmail')}
                                    label="Doctor Email"
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <EmailOutlinedIcon sx={{ color: 'text.secondary' }} />
                                        </InputAdornment>
                                    }
                                />
                                {errors.doctorEmail && <FormHelperText error>{errors.doctorEmail}</FormHelperText>}
                            </StyledFormControl>

                            <StyledFormControl variant="outlined" fullWidth error={Boolean(errors.healthcareDomain)}>
                                <InputLabel htmlFor="healthcareDomain">Healthcare Domain</InputLabel>
                                <OutlinedInput
                                    id="healthcareDomain"
                                    value={values.healthcareDomain}
                                    onChange={handleChange('healthcareDomain')}
                                    label="Healthcare Domain"
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <BadgeIcon sx={{ color: 'text.secondary' }} />
                                        </InputAdornment>
                                    }
                                />
                                {errors.healthcareDomain && <FormHelperText error>{errors.healthcareDomain}</FormHelperText>}
                            </StyledFormControl>

                            <StyledFormControl variant="outlined" fullWidth error={Boolean(errors.directorName)}>
                                <InputLabel htmlFor="directorName">Director Name</InputLabel>
                                <OutlinedInput
                                    id="directorName"
                                    value={values.directorName}
                                    onChange={handleChange('directorName')}
                                    label="Director Name"
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <AccountCircleIcon sx={{ color: 'text.secondary' }} />
                                        </InputAdornment>
                                    }
                                />
                                {errors.directorName && <FormHelperText error>{errors.directorName}</FormHelperText>}
                            </StyledFormControl>
                        </Stack>
                    </Box>
                );

            case 2:
                return (
                    <Box className={animateStep ? 'animate-step' : ''} sx={{
                        opacity: animateStep ? 0 : 1,
                        transform: animateStep ? 'translateY(20px)' : 'translateY(0)',
                        transition: 'all 0.5s ease'
                    }}>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                            Create Password
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                            Create a secure password for your account
                        </Typography>

                        <Stack spacing={3}>
                            <StyledFormControl variant="outlined" fullWidth error={Boolean(errors.password)}>
                                <InputLabel htmlFor="password">Password</InputLabel>
                                <OutlinedInput
                                    id="password"
                                    type={values.showPassword ? 'text' : 'password'}
                                    value={values.password}
                                    onChange={handleChange('password')}
                                    label="Password"
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <LockOutlinedIcon sx={{ color: 'text.secondary' }} />
                                        </InputAdornment>
                                    }
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <Button
                                                aria-label="toggle password visibility"
                                                onClick={() => handleClickShowPassword('password')}
                                                edge="end"
                                                sx={{ color: theme.palette.primary.main }}
                                            >
                                                {values.showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                            </Button>
                                        </InputAdornment>
                                    }
                                />
                                {errors.password && <FormHelperText error>{errors.password}</FormHelperText>}
                            </StyledFormControl>

                            <StyledFormControl variant="outlined" fullWidth error={Boolean(errors.confirmPassword)}>
                                <InputLabel htmlFor="confirmPassword">Confirm Password</InputLabel>
                                <OutlinedInput
                                    id="confirmPassword"
                                    type={values.showConfirmPassword ? 'text' : 'password'}
                                    value={values.confirmPassword}
                                    onChange={handleChange('confirmPassword')}
                                    label="Confirm Password"
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <LockOutlinedIcon sx={{ color: 'text.secondary' }} />
                                        </InputAdornment>
                                    }
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <Button
                                                aria-label="toggle password visibility"
                                                onClick={() => handleClickShowPassword('confirmPassword')}
                                                edge="end"
                                                sx={{ color: theme.palette.primary.main }}
                                            >
                                                {values.showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                            </Button>
                                        </InputAdornment>
                                    }
                                />
                                {errors.confirmPassword && <FormHelperText error>{errors.confirmPassword}</FormHelperText>}
                            </StyledFormControl>

                            <StyledFormControl variant="outlined" fullWidth error={Boolean(errors.token)}>
                                <InputLabel htmlFor="token">Authorization Token</InputLabel>
                                <OutlinedInput
                                    id="token"
                                    type={values.showToken ? 'text' : 'password'}
                                    value={values.token}
                                    onChange={handleChange('token')}
                                    label="Authorization Token"
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <LockOutlinedIcon sx={{ color: 'text.secondary' }} />
                                        </InputAdornment>
                                    }
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <Button
                                                aria-label="toggle token visibility"
                                                onClick={() => handleClickShowPassword('token')}
                                                edge="end"
                                                sx={{ color: theme.palette.primary.main }}
                                            >
                                                {values.showToken ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                            </Button>
                                        </InputAdornment>
                                    }
                                />
                                {errors.token && <FormHelperText error>{errors.token}</FormHelperText>}
                            </StyledFormControl>

                            <Box sx={{
                                p: 3,
                                bgcolor: 'rgba(0, 102, 204, 0.05)',
                                borderRadius: 2,
                                border: '1px solid rgba(0, 102, 204, 0.1)'
                            }}>
                                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                    Password Requirements:
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    • At least 8 characters long<br />
                                    • Include at least one uppercase letter<br />
                                    • Include at least one number<br />
                                    • Include at least one special character
                                </Typography>
                            </Box>
                        </Stack>
                    </Box>
                );

            default:
                return 'Unknown step';
        }
    };

    return (
        <PageContainer>
            {/* Background circles for visual effect */}
            <BackgroundCircle
                sx={{
                    width: '600px',
                    height: '600px',
                    top: '-200px',
                    right: '-200px'
                }}
            />
            <BackgroundCircle
                sx={{
                    width: '500px',
                    height: '500px',
                    bottom: '-150px',
                    left: '-150px'
                }}
            />

            <Container maxWidth="md">
                <RegisterCard>
                    <CardHeader>
                        <BrandLogo>
                            <Logo size="small" withLink={false} />
                            <Typography variant="h5" fontWeight={600} sx={{ ml: 1 }}>
                                Birth Health Network
                            </Typography>
                        </BrandLogo>
                        <Typography variant="h4" fontWeight={700} gutterBottom>
                            Create Your Account
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                            Join Birth Health Network for better maternal and infant healthcare
                        </Typography>
                    </CardHeader>

                    <FormContainer>
                        <DemoCredentials>
                            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                Demo Registration
                            </Typography>
                            <Button
                                fullWidth
                                variant="outlined"
                                size="small"
                                onClick={fillDemoInfo}
                                sx={{ borderRadius: '8px' }}
                            >
                                Fill with Sample Data
                            </Button>
                            <Typography variant="body2" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                                Note: For demo purposes, you can also use existing account: doctor@example.com with password: password123
                            </Typography>
                        </DemoCredentials>

                        {registerError && (
                            <Alert severity="error" sx={{ mb: 3, borderRadius: '8px' }}>
                                {registerError}
                            </Alert>
                        )}

                        <StyledStepper activeStep={activeStep} alternativeLabel>
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </StyledStepper>

                        <form onSubmit={handleSubmit}>
                            {getStepContent(activeStep)}

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                                <StyledButton
                                    disabled={activeStep === 0}
                                    onClick={handleBack}
                                    variant="outlined"
                                    sx={{ px: 3, minWidth: '120px' }}
                                >
                                    Back
                                </StyledButton>

                                <Box>
                                    {activeStep === steps.length - 1 ? (
                                        <StyledButton
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            size="large"
                                            disabled={loading}
                                            sx={{ px: 4, minWidth: '180px' }}
                                        >
                                            {loading ? 'Creating Account...' : 'Create Account'}
                                        </StyledButton>
                                    ) : (
                                        <StyledButton
                                            variant="contained"
                                            color="primary"
                                            onClick={handleNext}
                                            sx={{ px: 3, minWidth: '120px' }}
                                        >
                                            Next
                                        </StyledButton>
                                    )}
                                </Box>
                            </Box>
                        </form>

                        <Box sx={{ mt: 4, textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary">
                                Already have an account?{' '}
                                <Link
                                    component={RouterLink}
                                    to="/login"
                                    variant="body2"
                                    color="primary"
                                    underline="hover"
                                    fontWeight={600}
                                >
                                    Sign In
                                </Link>
                            </Typography>
                        </Box>
                    </FormContainer>
                </RegisterCard>

                <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                        By creating an account, you agree to our{' '}
                        <Link component={RouterLink} to="/terms" color="primary" underline="hover">
                            Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link component={RouterLink} to="/privacy" color="primary" underline="hover">
                            Privacy Policy
                        </Link>
                    </Typography>
                </Box>
            </Container>
        </PageContainer>
    );
};

export default Register;