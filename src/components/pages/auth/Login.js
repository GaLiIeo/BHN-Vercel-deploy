import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    CardContent,
    Container,
    Divider,
    FormControl,
    FormHelperText,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    Link,
    OutlinedInput,
    Stack,
    Typography,
    Alert,
    useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import MedicalServicesOutlinedIcon from '@mui/icons-material/MedicalServicesOutlined';
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

const LoginCard = styled(motion.div)`
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.12);
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

const StyledButton = styled(motion.button)`
  width: 100%;
  padding: 14px;
  font-weight: 600;
  background: linear-gradient(90deg, #0066CC, #0052a3);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 102, 204, 0.3);
  
  &:hover {
    box-shadow: 0 6px 16px rgba(0, 102, 204, 0.4);
    transform: translateY(-2px);
  }
  
  &:disabled {
    background: #cccccc;
    box-shadow: none;
    transform: none;
  }
`;

const DemoCredentials = styled(motion.div)`
  background: linear-gradient(135deg, #e8f4fd 0%, #d1e6fa 100%);
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 28px;
  border-left: 4px solid #0066CC;
`;

const StyledFormControl = styled(FormControl)`
  & .MuiOutlinedInput-root {
    transition: all 0.3s ease;
    
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

const StyledDivider = styled(Divider)`
  &::before, &::after {
    border-top: thin solid rgba(0, 0, 0, 0.08);
  }
`;

const BrandLogo = styled(Box)`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
`;

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const theme = useTheme();

    const [values, setValues] = useState({
        directorName: '',
        email: '',
        token: '',
        showToken: false,
    });

    const [errors, setErrors] = useState({
        directorName: '',
        email: '',
        token: '',
    });

    const [loading, setLoading] = useState(false);
    const [loginError, setLoginError] = useState('');
    const [formFilled, setFormFilled] = useState(false);

    useEffect(() => {
        // Check if form is filled for animation purposes
        if (values.email && values.token) {
            setFormFilled(true);
        } else {
            setFormFilled(false);
        }
    }, [values.email, values.token]);

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
        setErrors({ ...errors, [prop]: '' });
        setLoginError('');
    };

    const handleClickShowPassword = () => {
        setValues({ ...values, showToken: !values.showToken });
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = { directorName: '', email: '', token: '' };

        if (!values.directorName) {
            newErrors.directorName = 'Director name is required';
            isValid = false;
        }

        if (!values.email) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(values.email)) {
            newErrors.email = 'Email is invalid';
            isValid = false;
        }

        if (!values.token) {
            newErrors.token = 'Token is required';
            isValid = false;
        } else if (values.token.length < 6) {
            newErrors.token = 'Token must be at least 6 characters';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setLoginError('');

        try {
            const result = await login(values.email, values.token, values.directorName);

            if (result.success) {
                navigate('/dashboard');
            } else {
                setLoginError(result.error || 'Failed to login. Please check your credentials.');
            }
        } catch (error) {
            setLoginError('An unexpected error occurred. Please try again.');
            console.error('Login error:', error);
        } finally {
            setLoading(false);
        }
    };

    const fillDemoCredentials = () => {
        setValues({
            ...values,
            directorName: 'Dr. Sarah Johnson',
            email: 'doctor@example.com',
            token: 'password123'
        });
        setErrors({ directorName: '', email: '', token: '' });
        setLoginError('');
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.6,
                when: "beforeChildren",
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100
            }
        }
    };

    const buttonVariants = {
        idle: { scale: 1 },
        hover: {
            scale: 1.03,
            boxShadow: "0 6px 20px rgba(0, 102, 204, 0.4)"
        },
        tap: { scale: 0.98 }
    };

    return (
        <PageContainer>
            {/* Background circles for visual effect */}
            <BackgroundCircle
                sx={{
                    width: '500px',
                    height: '500px',
                    top: '-100px',
                    right: '-100px'
                }}
            />
            <BackgroundCircle
                sx={{
                    width: '400px',
                    height: '400px',
                    bottom: '-50px',
                    left: '-100px'
                }}
            />

            <Container maxWidth="sm">
                <LoginCard
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                >
                    <CardHeader>
                        <motion.div variants={itemVariants}>
                            <BrandLogo>
                                <Logo size="small" withLink={false} />
                                <Typography variant="h5" fontWeight={600} sx={{ ml: 1 }}>
                                    Birth Health Network
                                </Typography>
                            </BrandLogo>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <Typography variant="h4" fontWeight={700} gutterBottom>
                                Welcome Back
                            </Typography>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                Sign in to access your Birth Health Network account
                            </Typography>
                        </motion.div>
                    </CardHeader>

                    <FormContainer>
                        <motion.div variants={itemVariants}>
                            <DemoCredentials
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                    Demo Credentials
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={() => fillDemoCredentials()}
                                        startIcon={<MedicalServicesOutlinedIcon />}
                                        sx={{
                                            borderRadius: '8px',
                                            minWidth: '200px',
                                            fontWeight: 600
                                        }}
                                    >
                                        Doctor Account
                                    </Button>
                                </Box>
                            </DemoCredentials>
                        </motion.div>

                        {loginError && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Alert severity="error" sx={{ mb: 3, borderRadius: '8px' }}>
                                    {loginError}
                                </Alert>
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <Stack spacing={3}>
                                <motion.div variants={itemVariants}>
                                    <StyledFormControl variant="outlined" fullWidth error={Boolean(errors.directorName)}>
                                        <InputLabel htmlFor="directorName">Director Name</InputLabel>
                                        <OutlinedInput
                                            id="directorName"
                                            type="text"
                                            value={values.directorName}
                                            onChange={handleChange('directorName')}
                                            label="Director Name"
                                            sx={{ borderRadius: '8px' }}
                                        />
                                        {errors.directorName && <FormHelperText error>{errors.directorName}</FormHelperText>}
                                    </StyledFormControl>
                                </motion.div>

                                <motion.div variants={itemVariants}>
                                    <StyledFormControl variant="outlined" fullWidth error={Boolean(errors.email)}>
                                        <InputLabel htmlFor="email">Email Address</InputLabel>
                                        <OutlinedInput
                                            id="email"
                                            type="email"
                                            value={values.email}
                                            onChange={handleChange('email')}
                                            label="Email Address"
                                            sx={{ borderRadius: '8px' }}
                                            startAdornment={
                                                <InputAdornment position="start">
                                                    <EmailOutlinedIcon sx={{ color: 'text.secondary' }} />
                                                </InputAdornment>
                                            }
                                        />
                                        {errors.email && <FormHelperText error>{errors.email}</FormHelperText>}
                                    </StyledFormControl>
                                </motion.div>

                                <motion.div variants={itemVariants}>
                                    <StyledFormControl variant="outlined" fullWidth error={Boolean(errors.token)}>
                                        <InputLabel htmlFor="token">Token</InputLabel>
                                        <OutlinedInput
                                            id="token"
                                            type={values.showToken ? 'text' : 'password'}
                                            value={values.token}
                                            onChange={handleChange('token')}
                                            label="Token"
                                            sx={{ borderRadius: '8px' }}
                                            startAdornment={
                                                <InputAdornment position="start">
                                                    <LockOutlinedIcon sx={{ color: 'text.secondary' }} />
                                                </InputAdornment>
                                            }
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={handleClickShowPassword}
                                                        edge="end"
                                                        sx={{ color: theme.palette.primary.main }}
                                                    >
                                                        {values.showToken ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                        />
                                        {errors.token && <FormHelperText error>{errors.token}</FormHelperText>}
                                    </StyledFormControl>
                                </motion.div>

                                <motion.div variants={itemVariants}>
                                    <Box sx={{ textAlign: 'right' }}>
                                        <Link
                                            component={RouterLink}
                                            to="/forgot-password"
                                            variant="body2"
                                            color="primary"
                                            underline="hover"
                                            sx={{ fontWeight: 500 }}
                                        >
                                            Forgot password?
                                        </Link>
                                    </Box>
                                </motion.div>

                                <motion.div variants={itemVariants}>
                                    <StyledButton
                                        type="submit"
                                        disabled={loading}
                                        variants={buttonVariants}
                                        initial="idle"
                                        whileHover="hover"
                                        whileTap="tap"
                                        animate={formFilled ? "hover" : "idle"}
                                    >
                                        {loading ? 'Signing in...' : 'Sign In'}
                                    </StyledButton>
                                </motion.div>
                            </Stack>
                        </form>

                        <motion.div variants={itemVariants}>
                            <Box sx={{ mt: 4, textAlign: 'center' }}>
                                <Typography variant="body2" color="text.secondary">
                                    Don't have an account?{' '}
                                    <Link
                                        component={RouterLink}
                                        to="/register"
                                        variant="body2"
                                        color="primary"
                                        underline="hover"
                                        fontWeight={600}
                                    >
                                        Register
                                    </Link>
                                </Typography>
                            </Box>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <StyledDivider sx={{ my: 4 }}>
                                <Typography variant="body2" color="text.secondary" sx={{ px: 2 }}>
                                    OR
                                </Typography>
                            </StyledDivider>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <Grid container spacing={2} justifyContent="center">
                                <Grid item xs={12}>
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        color="primary"
                                        sx={{
                                            py: 1.2,
                                            borderRadius: '8px',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)'
                                            }
                                        }}
                                        startIcon={<MedicalServicesOutlinedIcon />}
                                    >
                                        Healthcare Provider
                                    </Button>
                                </Grid>
                            </Grid>
                        </motion.div>
                    </FormContainer>
                </LoginCard>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                >
                    <Box sx={{ mt: 4, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                            By signing in, you agree to our{' '}
                            <Link component={RouterLink} to="/terms" color="primary" underline="hover">
                                Terms of Service
                            </Link>{' '}
                            and{' '}
                            <Link component={RouterLink} to="/privacy" color="primary" underline="hover">
                                Privacy Policy
                            </Link>
                        </Typography>
                    </Box>
                </motion.div>
            </Container>
        </PageContainer>
    );
};

export default Login; 