import React from 'react';
import { Breadcrumbs as MUIBreadcrumbs, Link, Typography, Box } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';

const Breadcrumbs = ({ sx = {} }) => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    // Route mappings for better display names
    const routeNames = {
        '': 'Home',
        'team': 'Our Team',
        'project': 'Project Overview',
        'appointment': 'Appointments',
        'dashboard': 'Dashboard',
        'login': 'Login',
        'register': 'Register',
        'forgot-password': 'Reset Password',
        'doctor-profile': 'Doctor Profile',
        'patient-profile': 'Patient Profile',
    };

    // Don't show breadcrumbs on the home page or if only one level deep
    if (pathnames.length === 0) {
        return null;
    }

    return (
        <Box
            sx={{
                bgcolor: '#f8f9fa',
                py: 2,
                px: { xs: 2, md: 4 },
                borderBottom: '1px solid #e9ecef',
                ...sx,
            }}
        >
            <MUIBreadcrumbs
                separator={<NavigateNextIcon fontSize="small" />}
                aria-label="breadcrumb"
                sx={{
                    maxWidth: '1200px',
                    mx: 'auto',
                    '& .MuiBreadcrumbs-ol': {
                        flexWrap: 'wrap',
                    },
                    '& .MuiBreadcrumbs-li': {
                        display: 'flex',
                        alignItems: 'center',
                    },
                    '& .MuiBreadcrumbs-separator': {
                        color: '#6c757d',
                        mx: 1,
                    },
                }}
            >
                {/* Home link */}
                <Link
                    component={RouterLink}
                    to="/"
                    underline="hover"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        color: '#0066CC',
                        fontWeight: 500,
                        fontSize: '0.875rem',
                        '&:hover': {
                            color: '#004399',
                        },
                    }}
                >
                    <HomeIcon sx={{ mr: 0.5, fontSize: '1rem' }} />
                    Home
                </Link>

                {/* Dynamic breadcrumb items */}
                {pathnames.map((path, index) => {
                    const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
                    const isLast = index === pathnames.length - 1;
                    const displayName = routeNames[path] || path.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

                    return isLast ? (
                        <Typography
                            key={routeTo}
                            sx={{
                                color: '#495057',
                                fontWeight: 600,
                                fontSize: '0.875rem',
                                textTransform: 'capitalize',
                            }}
                        >
                            {displayName}
                        </Typography>
                    ) : (
                        <Link
                            key={routeTo}
                            component={RouterLink}
                            to={routeTo}
                            underline="hover"
                            sx={{
                                color: '#0066CC',
                                fontWeight: 500,
                                fontSize: '0.875rem',
                                textTransform: 'capitalize',
                                '&:hover': {
                                    color: '#004399',
                                },
                            }}
                        >
                            {displayName}
                        </Link>
                    );
                })}
            </MUIBreadcrumbs>
        </Box>
    );
};

export default Breadcrumbs;