import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    Box,
    CircularProgress,
    Typography,
    Container,
} from '@mui/material';

/**
 * ProtectedRoute component that handles authentication-based route protection
 * @param {React.ReactNode} children - The component(s) to render if authenticated
 * @param {string[]} allowedUserTypes - Array of user types allowed to access this route
 * @param {string} redirectTo - Path to redirect unauthenticated users
 * @param {boolean} requireVerification - Whether email verification is required
 */
const ProtectedRoute = ({
    children,
    allowedUserTypes = [],
    redirectTo = '/login',
    requireVerification = false
}) => {
    const { currentUser, loading, isAuthenticated } = useAuth();
    const location = useLocation();

    // Show loading spinner while authentication is being checked
    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '60vh',
                    gap: 2,
                }}
            >
                <CircularProgress
                    size={48}
                    sx={{
                        color: '#0066CC',
                        mb: 2,
                    }}
                />
                <Typography
                    variant="h6"
                    sx={{
                        color: 'text.secondary',
                        fontWeight: 500,
                    }}
                >
                    Verifying authentication...
                </Typography>
            </Box>
        );
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated || !currentUser) {
        return (
            <Navigate
                to={redirectTo}
                state={{ from: location.pathname }}
                replace
            />
        );
    }

    // Check if email verification is required
    if (requireVerification && !currentUser.emailVerified) {
        return (
            <Container maxWidth="md" sx={{ mt: 8, textAlign: 'center' }}>
                <Box
                    sx={{
                        p: 4,
                        borderRadius: '16px',
                        bgcolor: '#fff3cd',
                        border: '1px solid #ffeaa7',
                        mb: 3,
                    }}
                >
                    <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: '#856404' }}>
                        Email Verification Required
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#856404', mb: 3 }}>
                        Please verify your email address to access this feature. Check your inbox for a verification link.
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6c5ce7' }}>
                        Didn't receive an email? Check your spam folder or contact support.
                    </Typography>
                </Box>
            </Container>
        );
    }

    // Check if user type is allowed
    if (allowedUserTypes.length > 0 && !allowedUserTypes.includes(currentUser.userType)) {
        return (
            <Container maxWidth="md" sx={{ mt: 8, textAlign: 'center' }}>
                <Box
                    sx={{
                        p: 4,
                        borderRadius: '16px',
                        bgcolor: '#f8d7da',
                        border: '1px solid #f5c6cb',
                        mb: 3,
                    }}
                >
                    <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: '#721c24' }}>
                        Access Denied
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#721c24', mb: 2 }}>
                        You don't have permission to access this page.
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#856404' }}>
                        Required access level: {allowedUserTypes.join(', ')}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#856404' }}>
                        Your access level: {currentUser.userType}
                    </Typography>
                </Box>
            </Container>
        );
    }

    // If all checks pass, render the protected content
    return children;
};

export default ProtectedRoute;