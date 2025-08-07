import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    FormControl,
    FormHelperText,
    InputAdornment,
    InputLabel,
    Link,
    OutlinedInput,
    Typography,
    Alert,
} from '@mui/material';
import styled from 'styled-components';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useAuth } from '../../../context/AuthContext';

const PageContainer = styled(Box)`
  min-height: calc(100vh - 64px - 300px);
  display: flex;
  align-items: center;
  padding: 80px 0;
  background-color: #F5F7FA;
`;

const ForgotPasswordCard = styled(Card)`
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
`;

const CardHeader = styled(Box)`
  background-color: #0066CC;
  color: white;
  padding: 24px;
  text-align: center;
`;

const FormContainer = styled(CardContent)`
  padding: 32px 40px;
`;

const StyledButton = styled(Button)`
  padding: 12px;
  font-weight: 600;
`;

const SuccessIcon = styled(CheckCircleOutlineIcon)`
  font-size: 64px;
  color: #00843D;
  margin-bottom: 16px;
`;

const DemoCredentials = styled(Box)`
  background-color: #e8f4fd;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
`;

const ForgotPassword = () => {
    const { resetPassword } = useAuth();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setError('');
    };

    const validateForm = () => {
        if (!email) {
            setError('Email is required');
            return false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Email is invalid');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const result = await resetPassword(email);

            if (result.success) {
                setSubmitted(true);
            } else {
                setError(result.error || 'Failed to send password reset email. Please try again.');
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
            console.error('Password reset error:', err);
        } finally {
            setLoading(false);
        }
    };

    const fillDemoEmail = () => {
        setEmail('patient@example.com');
        setError('');
    };

    return (
        <PageContainer>
            <Container maxWidth="sm">
                <ForgotPasswordCard>
                    <CardHeader>
                        <Typography variant="h4" fontWeight={700} gutterBottom>
                            Reset Password
                        </Typography>
                        <Typography variant="body2">
                            We'll send you instructions to reset your password
                        </Typography>
                    </CardHeader>

                    <FormContainer>
                        {!submitted ? (
                            <>
                                <DemoCredentials>
                                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                        Demo Reset
                                    </Typography>
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        onClick={fillDemoEmail}
                                    >
                                        Use Demo Email
                                    </Button>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                                        For demo purposes, use: patient@example.com
                                    </Typography>
                                </DemoCredentials>

                                {error && (
                                    <Alert severity="error" sx={{ mb: 3 }}>
                                        {error}
                                    </Alert>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <FormControl variant="outlined" fullWidth error={Boolean(error)} sx={{ mb: 3 }}>
                                        <InputLabel htmlFor="email">Email Address</InputLabel>
                                        <OutlinedInput
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={handleEmailChange}
                                            label="Email Address"
                                            startAdornment={
                                                <InputAdornment position="start">
                                                    <EmailOutlinedIcon sx={{ color: 'text.secondary' }} />
                                                </InputAdornment>
                                            }
                                        />
                                        {error && <FormHelperText error>{error}</FormHelperText>}
                                    </FormControl>

                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                        Enter the email address associated with your account and we'll send you a link to reset your password.
                                    </Typography>

                                    <StyledButton
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        color="primary"
                                        size="large"
                                        disabled={loading}
                                    >
                                        {loading ? 'Sending...' : 'Send Reset Link'}
                                    </StyledButton>
                                </form>
                            </>
                        ) : (
                            <Box sx={{ textAlign: 'center', py: 3 }}>
                                <SuccessIcon />
                                <Typography variant="h5" fontWeight={600} gutterBottom>
                                    Check your email
                                </Typography>
                                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                                    We've sent a password reset link to <strong>{email}</strong>
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                                    If you don't see the email in your inbox, please check your spam folder or request another reset link.
                                </Typography>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    component={RouterLink}
                                    to="/login"
                                    sx={{ mr: 2 }}
                                >
                                    Back to Login
                                </Button>
                                <Button
                                    variant="text"
                                    color="primary"
                                    onClick={() => setSubmitted(false)}
                                >
                                    Resend Email
                                </Button>
                            </Box>
                        )}

                        <Box sx={{ mt: 4, textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary">
                                Remember your password?{' '}
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
                </ForgotPasswordCard>

                <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                        Need help?{' '}
                        <Link
                            component={RouterLink}
                            to="/contact"
                            variant="body2"
                            color="primary"
                            underline="hover"
                        >
                            Contact Support
                        </Link>
                    </Typography>
                </Box>
            </Container>
        </PageContainer>
    );
};

export default ForgotPassword; 