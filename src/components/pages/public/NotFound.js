import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Container,
    Typography,
    useTheme,
    Stack,
    Card,
    CardContent,
} from '@mui/material';
import { motion } from 'framer-motion';
import HomeIcon from '@mui/icons-material/Home';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';

const NotFound = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    const quickLinks = [
        { name: 'Home', path: '/', icon: <HomeIcon /> },
        { name: 'Our Team', path: '/team', icon: <SearchIcon /> },
        { name: 'Project', path: '/project', icon: <ContactSupportIcon /> },
        { name: 'Dashboard', path: '/dashboard', icon: <ContactSupportIcon /> },
    ];

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                display: 'flex',
                alignItems: 'center',
                py: 8,
            }}
        >
            <Container maxWidth="lg">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <Box sx={{ textAlign: 'center', mb: 6 }}>
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <Typography
                                variant="h1"
                                sx={{
                                    fontSize: { xs: '8rem', md: '12rem' },
                                    fontWeight: 800,
                                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    mb: 2,
                                    lineHeight: 1,
                                }}
                            >
                                404
                            </Typography>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <Typography
                                variant="h3"
                                sx={{
                                    fontWeight: 700,
                                    color: '#333',
                                    mb: 2,
                                    fontSize: { xs: '2rem', md: '3rem' },
                                }}
                            >
                                Page Not Found
                            </Typography>
                            <Typography
                                variant="h6"
                                sx={{
                                    color: 'text.secondary',
                                    mb: 4,
                                    maxWidth: '600px',
                                    mx: 'auto',
                                    fontSize: { xs: '1.1rem', md: '1.25rem' },
                                }}
                            >
                                The page you're looking for doesn't exist or has been moved.
                                Don't worry, our Birth Health Network system is here to help you find what you need.
                            </Typography>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                        >
                            <Stack
                                direction={{ xs: 'column', sm: 'row' }}
                                spacing={2}
                                justifyContent="center"
                                sx={{ mb: 6 }}
                            >
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={() => navigate(-1)}
                                    startIcon={<ArrowBackIcon />}
                                    sx={{
                                        bgcolor: theme.palette.primary.main,
                                        color: 'white',
                                        fontWeight: 600,
                                        px: 4,
                                        py: 1.5,
                                        borderRadius: '50px',
                                        '&:hover': {
                                            bgcolor: theme.palette.primary.dark,
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 8px 25px rgba(0, 102, 204, 0.3)',
                                        },
                                        transition: 'all 0.3s ease',
                                    }}
                                >
                                    Go Back
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="large"
                                    component={RouterLink}
                                    to="/"
                                    startIcon={<HomeIcon />}
                                    sx={{
                                        borderColor: theme.palette.primary.main,
                                        color: theme.palette.primary.main,
                                        fontWeight: 600,
                                        px: 4,
                                        py: 1.5,
                                        borderRadius: '50px',
                                        borderWidth: '2px',
                                        '&:hover': {
                                            bgcolor: theme.palette.primary.main,
                                            color: 'white',
                                            borderWidth: '2px',
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 8px 25px rgba(0, 102, 204, 0.2)',
                                        },
                                        transition: 'all 0.3s ease',
                                    }}
                                >
                                    Go Home
                                </Button>
                            </Stack>
                        </motion.div>
                    </Box>

                    {/* Quick Links Section */}
                    <Box>
                        <Typography
                            variant="h5"
                            sx={{
                                textAlign: 'center',
                                fontWeight: 700,
                                color: '#333',
                                mb: 4,
                            }}
                        >
                            Quick Navigation
                        </Typography>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.8 }}
                        >
                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                                    gap: 3,
                                    maxWidth: '800px',
                                    mx: 'auto',
                                }}
                            >
                                {quickLinks.map((link, index) => (
                                    <motion.div
                                        key={link.name}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                                    >
                                        <Card
                                            component={RouterLink}
                                            to={link.path}
                                            sx={{
                                                textDecoration: 'none',
                                                height: '100%',
                                                borderRadius: '16px',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-8px)',
                                                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                                                },
                                            }}
                                        >
                                            <CardContent
                                                sx={{
                                                    textAlign: 'center',
                                                    p: 3,
                                                    '&:last-child': { pb: 3 },
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        width: 60,
                                                        height: 60,
                                                        borderRadius: '16px',
                                                        bgcolor: `${theme.palette.primary.main}15`,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        mx: 'auto',
                                                        mb: 2,
                                                        color: theme.palette.primary.main,
                                                    }}
                                                >
                                                    {link.icon}
                                                </Box>
                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        fontWeight: 600,
                                                        color: '#333',
                                                        fontSize: '1rem',
                                                    }}
                                                >
                                                    {link.name}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </Box>
                        </motion.div>
                    </Box>
                </motion.div>
            </Container>
        </Box>
    );
};

export default NotFound;