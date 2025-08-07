import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Grid,
    Link,
    Typography,
    useTheme,
    Rating,
    Stack,
    Chip,
} from '@mui/material';
import { motion } from 'framer-motion';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import SecurityIcon from '@mui/icons-material/Security';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const Home = () => {
    const theme = useTheme();

    const features = [
        {
            title: 'Secure Health Records',
            description: 'Access and manage your medical history securely.',
            icon: <SecurityIcon />,
            link: '/dashboard',
        },
        {
            title: 'Healthcare Team',
            description: 'Meet our dedicated healthcare professionals.',
            icon: <ConnectWithoutContactIcon />,
            link: '/team',
        },
        {
            title: 'Project & Development',
            description: 'Innovative digital healthcare platform development.',
            icon: <AccessTimeFilledIcon />,
            link: '/project',
        },
        {
            title: 'Appointment Booking',
            description: 'Schedule your healthcare appointments easily.',
            icon: <LocalHospitalIcon />,
            link: '/appointment',
        },
    ];

    const news = [
        {
            title: 'Canada Health Infoway Interoperability Roadmap 2024',
            date: 'January 2025',
            description: 'New guidelines for connecting healthcare systems.',
            link: 'https://www.infoway-inforoute.ca/',
            source: 'Canada Health Infoway',
            category: 'Policy',
        },
        {
            title: 'Healthcare Digitization Progress',
            date: 'December 2024',
            description: 'Advancements in digital health record systems.',
            link: '/project',
            source: 'BHN Team',
            category: 'Development',
        },
        {
            title: 'Healthcare Innovation in Canada',
            date: 'November 2024',
            description: 'New initiatives to improve patient care delivery.',
            link: 'https://www.canada.ca/en/health-canada.html',
            source: 'Health Canada',
            category: 'Research',
        },
    ];

    return (
        <Box>
            {/* Hero Section */}
            <Box
                sx={{
                    background: 'linear-gradient(135deg, rgba(0, 102, 204, 0.95) 0%, rgba(0, 132, 61, 0.85) 100%)',
                    color: 'white',
                    py: { xs: 12, md: 16 },
                    minHeight: { xs: '70vh', md: '80vh' },
                    display: 'flex',
                    alignItems: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    // Add accessibility
                    role: 'banner',
                    'aria-label': 'Hero section',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        inset: 0,
                        background: `
                            radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                            radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                            radial-gradient(circle at 50% 50%, rgba(255, 209, 0, 0.05) 0%, transparent 50%)
                        `,
                    },
                }}
            >
                <Container maxWidth="xl">
                    <Grid container spacing={4} alignItems="center" justifyContent="center" sx={{ minHeight: '80vh' }}>
                        <Grid item xs={12} md={8} sx={{ textAlign: 'center' }}>
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                <Chip
                                    label="🏥 Digital Healthcare Solutions"
                                    sx={{
                                        bgcolor: 'rgba(255, 255, 255, 0.15)',
                                        color: 'white',
                                        fontWeight: 600,
                                        fontSize: '14px',
                                        mb: 3,
                                        border: '1px solid rgba(255, 255, 255, 0.3)',
                                    }}
                                />
                                <Typography
                                    variant="h1"
                                    sx={{
                                        mb: 3,
                                        fontWeight: 800,
                                        fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem', lg: '4rem' },
                                        lineHeight: 1.1,
                                        background: 'linear-gradient(135deg, #ffffff 0%, #e3f2fd 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                    }}
                                >
                                    We Care{' '}
                                    <Box component="span" sx={{ color: '#FFD100' }}>
                                        We Provide!
                                    </Box>
                                </Typography>
                                <Typography
                                    variant="h5"
                                    sx={{
                                        mb: 4,
                                        fontWeight: 400,
                                        maxWidth: '600px',
                                        mx: 'auto',
                                        opacity: 0.95,
                                        lineHeight: 1.5,
                                        fontSize: { xs: '1.1rem', md: '1.3rem' },
                                    }}
                                >
                                    Advancing Canadian healthcare through innovative digital solutions.
                                </Typography>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.3 }}
                            >
                                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3, justifyContent: 'center' }}>
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button
                                            variant="contained"
                                            size="large"
                                            component={RouterLink}
                                            to="/register"
                                            sx={{
                                                bgcolor: '#FFD100',
                                                color: '#000',
                                                fontWeight: 700,
                                                fontSize: '1.1rem',
                                                py: 1.5,
                                                px: 4,
                                                borderRadius: '50px',
                                                boxShadow: '0 8px 32px rgba(255, 209, 0, 0.3)',
                                                '&:hover': {
                                                    bgcolor: '#FFA000',
                                                    boxShadow: '0 12px 40px rgba(255, 209, 0, 0.4)',
                                                },
                                            }}
                                            endIcon={<ArrowForwardIcon />}
                                            aria-label="Get started with registration"
                                        >
                                            Get Started
                                        </Button>
                                    </motion.div>
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button
                                            variant="outlined"
                                            size="large"
                                            component={RouterLink}
                                            to="/project"
                                            sx={{
                                                color: 'white',
                                                borderColor: 'rgba(255, 255, 255, 0.7)',
                                                fontWeight: 600,
                                                fontSize: '1.1rem',
                                                py: 1.5,
                                                px: 4,
                                                borderRadius: '50px',
                                                borderWidth: '2px',
                                                '&:hover': {
                                                    borderColor: 'white',
                                                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                                                },
                                            }}
                                            startIcon={<ArrowForwardIcon />}
                                            aria-label="Learn more about the project"
                                        >
                                            Learn More
                                        </Button>
                                    </motion.div>
                                </Box>
                            </motion.div>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Quick Access Section */}
            <Box sx={{ py: 6, bgcolor: 'white' }}>
                <Container maxWidth="xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <Typography variant="h4" align="center" fontWeight={700} sx={{ mb: 1, color: '#333' }}>
                            Quick Access
                        </Typography>
                        <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 5, maxWidth: '600px', mx: 'auto' }}>
                            Get instant access to essential healthcare services.
                        </Typography>
                    </motion.div>

                    <Grid container spacing={3} justifyContent="center">
                        {[
                            {
                                title: 'Book Appointment',
                                description: 'Schedule appointments with healthcare providers.',
                                link: '/appointment',
                                color: '#0066CC',
                                icon: <MedicalServicesIcon sx={{ fontSize: 40 }} />,
                                action: 'Book Now',
                            },
                            {
                                title: 'Health Dashboard',
                                description: 'Access your health information securely.',
                                link: '/dashboard',
                                color: '#00843D',
                                icon: <HealthAndSafetyIcon sx={{ fontSize: 40 }} />,
                                action: 'View Dashboard',
                            },
                            {
                                title: 'Healthcare Team',
                                description: 'Meet our dedicated healthcare professionals.',
                                link: '/team',
                                color: '#FFA000',
                                icon: <ChildCareIcon sx={{ fontSize: 40 }} />,
                                action: 'Meet Team',
                            },
                            {
                                title: 'Project Overview',
                                description: 'Learn about our digital healthcare platform.',
                                link: '/project',
                                color: '#D32F2F',
                                icon: <AccessTimeFilledIcon sx={{ fontSize: 40 }} />,
                                action: 'View Project',
                            },
                        ].map((item, index) => (
                            <Grid item xs={12} sm={6} md={6} lg={3} xl={3} key={index}>
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <Card
                                        sx={{
                                            height: '100%',
                                            borderRadius: '16px',
                                            bgcolor: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12)',
                                                transform: 'translateY(-8px)',
                                            },
                                            '&::before': {
                                                content: '""',
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                height: '4px',
                                                bgcolor: item.color,
                                                borderRadius: '16px 16px 0 0',
                                            },
                                        }}
                                    >
                                        <CardContent sx={{ p: 4 }}>
                                            <Box
                                                sx={{
                                                    width: 64,
                                                    height: 64,
                                                    borderRadius: '16px',
                                                    bgcolor: `${item.color}15`,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    mb: 3,
                                                    color: item.color,
                                                }}
                                            >
                                                {item.icon}
                                            </Box>
                                            <Typography variant="h6" fontWeight={700} sx={{ mb: 2, color: '#333' }}>
                                                {item.title}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                                                {item.description}
                                            </Typography>
                                            <Link
                                                component={RouterLink}
                                                to={item.link}
                                                sx={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    color: item.color,
                                                    fontWeight: 700,
                                                    fontSize: '14px',
                                                    textDecoration: 'none',
                                                    '&:hover': {
                                                        transform: 'translateX(4px)',
                                                    },
                                                }}
                                                aria-label={`Navigate to ${item.title}`}
                                            >
                                                {item.action}
                                                <ArrowForwardIcon sx={{ ml: 1, fontSize: 18 }} />
                                            </Link>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Healthcare Services Section */}
            <Box sx={{ py: 10, bgcolor: '#F8FAFC' }}>
                <Container maxWidth="xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <Typography
                            variant="h3"
                            align="center"
                            fontWeight={700}
                            sx={{
                                mb: 3,
                                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            Healthcare Services
                        </Typography>
                        <Typography
                            variant="h6"
                            align="center"
                            color="text.secondary"
                            sx={{ mb: 8, maxWidth: '800px', mx: 'auto' }}
                        >
                            Comprehensive healthcare solutions designed to improve patient outcomes
                        </Typography>
                    </motion.div>

                    <Grid container spacing={4}>
                        {features.map((feature, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <Card
                                        sx={{
                                            height: '100%',
                                            borderRadius: '20px',
                                            bgcolor: 'white',
                                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
                                                transform: 'translateY(-8px)',
                                            },
                                        }}
                                    >
                                        <CardContent sx={{ p: 4, textAlign: 'center' }}>
                                            <Box
                                                sx={{
                                                    width: 80,
                                                    height: 80,
                                                    borderRadius: '20px',
                                                    bgcolor: '#0066CC15',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    mx: 'auto',
                                                    mb: 3,
                                                    color: '#0066CC',
                                                }}
                                            >
                                                {feature.icon}
                                            </Box>
                                            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                                                {feature.title}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                                                {feature.description}
                                            </Typography>
                                            <Link
                                                component={RouterLink}
                                                to={feature.link}
                                                sx={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    color: '#0066CC',
                                                    fontWeight: 600,
                                                    textDecoration: 'none',
                                                }}
                                                aria-label={`Learn more about ${feature.title}`}
                                            >
                                                Learn More
                                                <ArrowForwardIcon sx={{ ml: 1, fontSize: 18 }} />
                                            </Link>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Latest News Section */}
            <Box sx={{ py: 10, bgcolor: 'white' }}>
                <Container maxWidth="xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <Typography variant="h3" align="center" fontWeight={700} sx={{ mb: 3 }}>
                            Latest Updates
                        </Typography>
                        <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 8, maxWidth: '600px', mx: 'auto' }}>
                            Stay informed about healthcare technology developments
                        </Typography>
                    </motion.div>

                    <Grid container spacing={4}>
                        {news.map((item, index) => (
                            <Grid item xs={12} md={4} key={index}>
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <Card
                                        sx={{
                                            height: '100%',
                                            borderRadius: '16px',
                                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12)',
                                                transform: 'translateY(-8px)',
                                            },
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                height: 200,
                                                bgcolor: '#e3f2fd',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                position: 'relative',
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    top: 16,
                                                    right: 16,
                                                    bgcolor: '#0066CC',
                                                    color: 'white',
                                                    px: 2,
                                                    py: 1,
                                                    borderRadius: '8px',
                                                    fontSize: '12px',
                                                    fontWeight: 600,
                                                }}
                                            >
                                                {item.category}
                                            </Box>
                                            <MonitorHeartIcon sx={{ fontSize: 60, color: '#0066CC', opacity: 0.7 }} />
                                        </Box>
                                        <CardContent sx={{ p: 4 }}>
                                            <Chip
                                                label={item.source}
                                                size="small"
                                                sx={{ mb: 2, bgcolor: '#00843D15', color: '#00843D' }}
                                            />
                                            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                                                {item.title}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                                {item.description}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {item.date}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Feedback Section */}
            <Box sx={{ py: 10, background: 'linear-gradient(135deg, #0066CC 0%, #00843D 100%)', color: 'white' }}>
                <Container maxWidth="lg">
                    <Grid container spacing={6} justifyContent="center">
                        <Grid item xs={12} md={6} lg={5}>
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                            >
                                <Typography variant="h3" fontWeight={800} sx={{ mb: 3, textAlign: 'center' }}>
                                    Explore Our Project
                                </Typography>
                                <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, textAlign: 'center' }}>
                                    Discover our innovative digital healthcare platform.
                                </Typography>
                                <Stack spacing={2} sx={{ maxWidth: 400, mx: 'auto' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <CheckCircleIcon sx={{ color: '#FFD100' }} />
                                        <Typography>Advanced healthcare technology solutions</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <CheckCircleIcon sx={{ color: '#FFD100' }} />
                                        <Typography>Secure digital health records</Typography>
                                    </Box>
                                </Stack>
                            </motion.div>
                        </Grid>
                        <Grid item xs={12} md={6} lg={5}>
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                            >
                                <Card
                                    sx={{
                                        p: 4,
                                        borderRadius: '20px',
                                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                                        backdropFilter: 'blur(10px)',
                                    }}
                                >
                                    <Typography variant="h5" fontWeight={700} sx={{ mb: 3, color: 'white' }}>
                                        Project Access
                                    </Typography>
                                    <Stack spacing={3}>
                                        <Box>
                                            <Typography variant="body2" sx={{ mb: 2, color: 'white', opacity: 0.9 }}>
                                                Learn about our platform
                                            </Typography>
                                            <Rating
                                                defaultValue={0}
                                                size="large"
                                                sx={{
                                                    '& .MuiRating-iconFilled': { color: '#FFD100' },
                                                    '& .MuiRating-iconEmpty': { color: 'rgba(255, 255, 255, 0.3)' },
                                                }}
                                            />
                                        </Box>
                                        <Button
                                            variant="contained"
                                            fullWidth
                                            component={RouterLink}
                                            to="/project"
                                            sx={{
                                                bgcolor: '#FFD100',
                                                color: '#000',
                                                fontWeight: 700,
                                                '&:hover': { bgcolor: '#FFA000' },
                                            }}
                                        >
                                            View Project
                                        </Button>
                                    </Stack>
                                </Card>
                            </motion.div>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Box>
    );
};

export default Home; 