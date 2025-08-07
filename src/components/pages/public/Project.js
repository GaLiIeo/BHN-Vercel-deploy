import React from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Chip,
    Button,
    Stack,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
} from '@mui/material';
import { motion } from 'framer-motion';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import SecurityIcon from '@mui/icons-material/Security';
import CloudIcon from '@mui/icons-material/Cloud';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import DataUsageIcon from '@mui/icons-material/DataUsage';
import GroupsIcon from '@mui/icons-material/Groups';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const Project = () => {
    const projectFeatures = [
        {
            title: 'Digital Health Records',
            description: 'Secure, comprehensive digital health record management system',
            icon: <HealthAndSafetyIcon />,
            color: '#0066CC',
        },
        {
            title: 'Data Security',
            description: 'HIPAA and PIPEDA compliant data protection and encryption',
            icon: <SecurityIcon />,
            color: '#00843D',
        },
        {
            title: 'Cloud Infrastructure',
            description: 'Scalable AWS cloud infrastructure for reliable performance',
            icon: <CloudIcon />,
            color: '#FFA000',
        },
        {
            title: 'System Integration',
            description: 'Seamless integration with existing healthcare systems',
            icon: <IntegrationInstructionsIcon />,
            color: '#D32F2F',
        },
    ];

    const technicalSpecs = [
        'React.js frontend with Material-UI components',
        'Node.js backend with Express.js framework',
        'PostgreSQL database with encrypted data storage',
        'AWS cloud hosting with S3, RDS, and CloudFront',
        'JWT-based authentication and authorization',
        'Real-time notifications and updates',
        'Mobile-responsive design',
        'API-first architecture for extensibility',
    ];

    const projectGoals = [
        'Improve patient care through digital health records',
        'Enhance healthcare provider efficiency',
        'Ensure data security and privacy compliance',
        'Enable seamless healthcare system integration',
        'Provide scalable and reliable healthcare solutions',
        'Support maternal and infant health initiatives',
    ];

    const keyMetrics = [
        { label: 'Healthcare Providers', value: '500+', icon: <GroupsIcon /> },
        { label: 'Patient Records', value: '10,000+', icon: <DataUsageIcon /> },
        { label: 'System Uptime', value: '99.9%', icon: <TrendingUpIcon /> },
        { label: 'Data Security', value: '100%', icon: <SecurityIcon /> },
    ];

    return (
        <Box>
            {/* Hero Section */}
            <Box
                sx={{
                    background: 'linear-gradient(135deg, rgba(0, 102, 204, 0.95) 0%, rgba(0, 132, 61, 0.85) 100%)',
                    color: 'white',
                    py: { xs: 8, md: 12 },
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                <Container maxWidth="xl">
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={8}>
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                <Chip
                                    label="🚀 Healthcare Innovation Project"
                                    sx={{
                                        bgcolor: 'rgba(255, 255, 255, 0.15)',
                                        color: 'white',
                                        fontWeight: 600,
                                        mb: 3,
                                        border: '1px solid rgba(255, 255, 255, 0.3)',
                                    }}
                                />
                                <Typography
                                    variant="h2"
                                    sx={{
                                        mb: 3,
                                        fontWeight: 800,
                                        fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                                        lineHeight: 1.2,
                                    }}
                                >
                                    Birth Health Network
                                    <Box component="span" sx={{ color: '#FFD100', display: 'block' }}>
                                        Digital Platform
                                    </Box>
                                </Typography>
                                <Typography
                                    variant="h5"
                                    sx={{
                                        mb: 4,
                                        fontWeight: 400,
                                        opacity: 0.95,
                                        lineHeight: 1.5,
                                        fontSize: { xs: '1.1rem', md: '1.3rem' },
                                    }}
                                >
                                    A comprehensive digital healthcare platform designed to revolutionize
                                    maternal and infant care through innovative technology solutions.
                                </Typography>
                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                    <Button
                                        variant="contained"
                                        size="large"
                                        sx={{
                                            bgcolor: '#FFD100',
                                            color: '#000',
                                            fontWeight: 700,
                                            px: 4,
                                            borderRadius: '50px',
                                            '&:hover': { bgcolor: '#FFA000' },
                                        }}
                                    >
                                        View Technical Specs
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        size="large"
                                        sx={{
                                            color: 'white',
                                            borderColor: 'white',
                                            fontWeight: 600,
                                            px: 4,
                                            borderRadius: '50px',
                                            '&:hover': {
                                                borderColor: '#FFD100',
                                                color: '#FFD100',
                                            },
                                        }}
                                    >
                                        Learn More
                                    </Button>
                                </Stack>
                            </motion.div>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.3 }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        height: '300px',
                                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                                        borderRadius: '20px',
                                        backdropFilter: 'blur(10px)',
                                    }}
                                >
                                    <HealthAndSafetyIcon sx={{ fontSize: '150px', opacity: 0.8 }} />
                                </Box>
                            </motion.div>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Key Features Section */}
            <Box sx={{ py: 10, bgcolor: '#F8FAFC' }}>
                <Container maxWidth="xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <Typography variant="h3" align="center" fontWeight={700} sx={{ mb: 3 }}>
                            Project Features
                        </Typography>
                        <Typography
                            variant="h6"
                            align="center"
                            color="text.secondary"
                            sx={{ mb: 8, maxWidth: '800px', mx: 'auto' }}
                        >
                            Advanced healthcare technology solutions designed for modern healthcare delivery
                        </Typography>
                    </motion.div>

                    <Grid container spacing={4}>
                        {projectFeatures.map((feature, index) => (
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
                                                    bgcolor: `${feature.color}15`,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    mx: 'auto',
                                                    mb: 3,
                                                    color: feature.color,
                                                }}
                                            >
                                                {feature.icon}
                                            </Box>
                                            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                                                {feature.title}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                                                {feature.description}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Technical Specifications */}
            <Box sx={{ py: 10, bgcolor: 'white' }}>
                <Container maxWidth="xl">
                    <Grid container spacing={6}>
                        <Grid item xs={12} md={6}>
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                            >
                                <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
                                    Technical Specifications
                                </Typography>
                                <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
                                    Built with modern technologies and best practices to ensure scalability,
                                    security, and performance.
                                </Typography>
                                <List>
                                    {technicalSpecs.map((spec, index) => (
                                        <ListItem key={index} sx={{ py: 1, px: 0 }}>
                                            <ListItemIcon>
                                                <CheckCircleIcon sx={{ color: '#00843D' }} />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={spec}
                                                primaryTypographyProps={{
                                                    fontSize: '0.95rem',
                                                    fontWeight: 500,
                                                }}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </motion.div>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                            >
                                <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
                                    Project Goals
                                </Typography>
                                <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
                                    Our mission is to transform healthcare delivery through innovative
                                    digital solutions that prioritize patient care and data security.
                                </Typography>
                                <List>
                                    {projectGoals.map((goal, index) => (
                                        <ListItem key={index} sx={{ py: 1, px: 0 }}>
                                            <ListItemIcon>
                                                <CheckCircleIcon sx={{ color: '#0066CC' }} />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={goal}
                                                primaryTypographyProps={{
                                                    fontSize: '0.95rem',
                                                    fontWeight: 500,
                                                }}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </motion.div>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Key Metrics */}
            <Box sx={{ py: 10, bgcolor: '#F8FAFC' }}>
                <Container maxWidth="xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <Typography variant="h3" align="center" fontWeight={700} sx={{ mb: 3 }}>
                            Project Impact
                        </Typography>
                        <Typography
                            variant="h6"
                            align="center"
                            color="text.secondary"
                            sx={{ mb: 8, maxWidth: '600px', mx: 'auto' }}
                        >
                            Measurable results and achievements from our digital healthcare platform
                        </Typography>
                    </motion.div>

                    <Grid container spacing={4}>
                        {keyMetrics.map((metric, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <Card
                                        sx={{
                                            textAlign: 'center',
                                            p: 4,
                                            borderRadius: '16px',
                                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12)',
                                                transform: 'translateY(-4px)',
                                            },
                                        }}
                                    >
                                        <Box sx={{ color: '#0066CC', mb: 2 }}>
                                            {metric.icon}
                                        </Box>
                                        <Typography variant="h3" fontWeight={800} sx={{ mb: 1, color: '#0066CC' }}>
                                            {metric.value}
                                        </Typography>
                                        <Typography variant="body1" fontWeight={600} color="text.secondary">
                                            {metric.label}
                                        </Typography>
                                    </Card>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* CTA Section */}
            <Box
                sx={{
                    py: 10,
                    background: 'linear-gradient(135deg, #0066CC 0%, #00843D 100%)',
                    color: 'white',
                }}
            >
                <Container maxWidth="lg">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h3" fontWeight={800} sx={{ mb: 3 }}>
                                Ready to Transform Healthcare?
                            </Typography>
                            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, maxWidth: '600px', mx: 'auto' }}>
                                Join us in revolutionizing healthcare delivery through innovative digital solutions.
                            </Typography>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                                <Button
                                    variant="contained"
                                    size="large"
                                    sx={{
                                        bgcolor: '#FFD100',
                                        color: '#000',
                                        fontWeight: 700,
                                        px: 4,
                                        borderRadius: '50px',
                                        '&:hover': { bgcolor: '#FFA000' },
                                    }}
                                >
                                    Get Started
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="large"
                                    sx={{
                                        color: 'white',
                                        borderColor: 'white',
                                        fontWeight: 600,
                                        px: 4,
                                        borderRadius: '50px',
                                        '&:hover': {
                                            borderColor: '#FFD100',
                                            color: '#FFD100',
                                        },
                                    }}
                                >
                                    Contact Us
                                </Button>
                            </Stack>
                        </Box>
                    </motion.div>
                </Container>
            </Box>
        </Box>
    );
};

export default Project;