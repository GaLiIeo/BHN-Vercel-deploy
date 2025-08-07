import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
    Box,
    Button,
    Container,
    Grid,
    Paper,
    Typography,
    useTheme,
    TextField,
    FormControl,
    FormControlLabel,
    FormLabel,
    Radio,
    RadioGroup,
    Checkbox,
    MenuItem,
    Snackbar,
    Alert,
} from '@mui/material';
import styled from 'styled-components';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const HeroSection = styled(Box)`
  background-color: #000000;
  color: #FFFFFF;
  padding: 160px 0 100px;
  position: relative;
  overflow: hidden;
`;

const PageTitle = styled(Typography)`
  font-weight: 800;
  margin-bottom: 16px;
  position: relative;
  letter-spacing: -0.02em;
`;

const SectionSubtitle = styled(Typography)`
  color: #FFD100;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 16px;
  font-size: 14px;
`;

const FormContainer = styled(Paper)`
  padding: 48px;
  border: none;
  background-color: #FFFFFF;
  
  @media (max-width: 600px) {
    padding: 32px 24px;
  }
`;

const StyledTextField = styled(TextField)`
  margin-bottom: 24px;
  
  .MuiInputLabel-root {
    font-weight: 500;
  }
  
  .MuiOutlinedInput-root {
    background-color: #F5F5F5;
    
    &:hover .MuiOutlinedInput-notchedOutline {
      border-color: rgba(0, 0, 0, 0.3);
    }
    
    &.Mui-focused .MuiOutlinedInput-notchedOutline {
      border-color: #FFD100;
    }
  }
`;

const SubmitButton = styled(Button)`
  padding: 12px 32px;
  font-weight: 600;
`;

const StepCard = styled(Paper)`
  padding: 32px;
  height: 100%;
  background-color: #F5F5F5;
  border: none;
  position: relative;
  
  .step-number {
    position: absolute;
    top: 24px;
    right: 24px;
    font-size: 48px;
    font-weight: 800;
    color: #FFD100;
    opacity: 0.5;
    line-height: 1;
  }
  
  .step-title {
    font-weight: 700;
    margin-bottom: 16px;
  }
`;

const Appointment = () => {
    const theme = useTheme();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        organization: '',
        role: '',
        organizationType: '',
        numberOfUsers: '',
        existingSystems: '',
        implementationTimeline: '',
        additionalInfo: '',
        agreeToTerms: false,
    });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success',
    });

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Here you would typically handle the form submission to a backend
        console.log('Form submitted:', formData);

        // Show success message
        setSnackbar({
            open: true,
            message: 'Your request has been submitted successfully! Our team will contact you soon to discuss next steps.',
            severity: 'success',
        });

        // Reset form
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            organization: '',
            role: '',
            organizationType: '',
            numberOfUsers: '',
            existingSystems: '',
            implementationTimeline: '',
            additionalInfo: '',
            agreeToTerms: false,
        });
    };

    const handleCloseSnackbar = () => {
        setSnackbar((prev) => ({
            ...prev,
            open: false,
        }));
    };

    const organizationTypes = [
        'Hospital',
        'Clinic',
        'Healthcare Network',
        'Research Institution',
        'Government Agency',
        'Non-profit Organization',
        'Other',
    ];

    const userRanges = [
        'Less than 10',
        '10-50',
        '51-100',
        '101-500',
        'More than 500',
    ];

    const implementationTimeframes = [
        'Within 1 month',
        '1-3 months',
        '3-6 months',
        '6-12 months',
        'More than 12 months',
    ];

    const steps = [
        {
            number: "1",
            title: "Submit Request Form",
            description: "Fill out the request form with details about your organization and implementation needs."
        },
        {
            number: "2",
            title: "Initial Consultation",
            description: "Our team will contact you to discuss your specific needs and answer any questions you may have."
        },
        {
            number: "3",
            title: "Proposal and Agreement",
            description: "We'll provide a customized proposal based on your requirements and establish a formal agreement."
        },
        {
            number: "4",
            title: "Implementation Planning",
            description: "Once approved, we'll work with your team to develop a detailed implementation plan and timeline."
        },
    ];

    return (
        <>
            <HeroSection>
                <Container maxWidth="xl">
                    <Grid container spacing={4} justifyContent="center" textAlign="center">
                        <Grid item xs={12} md={8}>
                            <SectionSubtitle>
                                GET ACCESS
                            </SectionSubtitle>
                            <PageTitle variant="h1" gutterBottom className="heading-xl">
                                Request access to Birth Health Network
                            </PageTitle>
                            <Typography variant="h6" sx={{ mb: 4, fontWeight: 400, opacity: 0.9, maxWidth: '800px', mx: 'auto' }}>
                                Complete the form below to request access to the Birth Health Network system for your healthcare organization.
                            </Typography>
                        </Grid>
                    </Grid>
                </Container>
            </HeroSection>

            <Box sx={{ py: { xs: 10, md: 15 } }}>
                <Container maxWidth="xl">
                    <Grid container spacing={8}>
                        <Grid item xs={12} md={5}>
                            <SectionSubtitle>
                                HOW IT WORKS
                            </SectionSubtitle>
                            <PageTitle variant="h2" gutterBottom>
                                The access request process
                            </PageTitle>
                            <Typography variant="body1" paragraph sx={{ mb: 5 }}>
                                Getting access to the Birth Health Network system is a straightforward process. Here's what to expect after submitting your request:
                            </Typography>

                            <Grid container spacing={3}>
                                {steps.map((step, index) => (
                                    <Grid item xs={12} key={index}>
                                        <StepCard>
                                            <Box className="step-number">{step.number}</Box>
                                            <Typography variant="h5" className="step-title">
                                                {step.title}
                                            </Typography>
                                            <Typography variant="body1" color="text.secondary">
                                                {step.description}
                                            </Typography>
                                        </StepCard>
                                    </Grid>
                                ))}
                            </Grid>

                            <Box sx={{ mt: 5 }}>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                                    Have questions before requesting access?
                                </Typography>
                                <Typography variant="body1" paragraph>
                                    Our team is available to answer any questions you may have about the Birth Health Network system and implementation process.
                                </Typography>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    size="large"
                                    component={RouterLink}
                                    to="/contact"
                                    sx={{ mt: 2 }}
                                >
                                    Contact Us
                                </Button>
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={7}>
                            <FormContainer elevation={0}>
                                <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
                                    Access Request Form
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
                                    Please provide the following information to help us understand your organization's needs.
                                </Typography>

                                <form onSubmit={handleSubmit}>
                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                                        Contact Information
                                    </Typography>

                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={6}>
                                            <StyledTextField
                                                fullWidth
                                                label="First Name"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                required
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <StyledTextField
                                                fullWidth
                                                label="Last Name"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                required
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <StyledTextField
                                                fullWidth
                                                label="Email Address"
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <StyledTextField
                                                fullWidth
                                                label="Phone Number"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                variant="outlined"
                                            />
                                        </Grid>
                                    </Grid>

                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3, mt: 5 }}>
                                        Organization Information
                                    </Typography>

                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>
                                            <StyledTextField
                                                fullWidth
                                                label="Organization Name"
                                                name="organization"
                                                value={formData.organization}
                                                onChange={handleChange}
                                                required
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <StyledTextField
                                                fullWidth
                                                label="Your Role"
                                                name="role"
                                                value={formData.role}
                                                onChange={handleChange}
                                                required
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <StyledTextField
                                                fullWidth
                                                select
                                                label="Organization Type"
                                                name="organizationType"
                                                value={formData.organizationType}
                                                onChange={handleChange}
                                                required
                                                variant="outlined"
                                            >
                                                {organizationTypes.map((option) => (
                                                    <MenuItem key={option} value={option}>
                                                        {option}
                                                    </MenuItem>
                                                ))}
                                            </StyledTextField>
                                        </Grid>
                                    </Grid>

                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3, mt: 5 }}>
                                        Implementation Details
                                    </Typography>

                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={6}>
                                            <StyledTextField
                                                fullWidth
                                                select
                                                label="Estimated Number of Users"
                                                name="numberOfUsers"
                                                value={formData.numberOfUsers}
                                                onChange={handleChange}
                                                required
                                                variant="outlined"
                                            >
                                                {userRanges.map((option) => (
                                                    <MenuItem key={option} value={option}>
                                                        {option}
                                                    </MenuItem>
                                                ))}
                                            </StyledTextField>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <StyledTextField
                                                fullWidth
                                                select
                                                label="Desired Implementation Timeline"
                                                name="implementationTimeline"
                                                value={formData.implementationTimeline}
                                                onChange={handleChange}
                                                required
                                                variant="outlined"
                                            >
                                                {implementationTimeframes.map((option) => (
                                                    <MenuItem key={option} value={option}>
                                                        {option}
                                                    </MenuItem>
                                                ))}
                                            </StyledTextField>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <StyledTextField
                                                fullWidth
                                                label="Existing Healthcare Systems (EMR, HIS, etc.)"
                                                name="existingSystems"
                                                value={formData.existingSystems}
                                                onChange={handleChange}
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <StyledTextField
                                                fullWidth
                                                label="Additional Information or Requirements"
                                                name="additionalInfo"
                                                value={formData.additionalInfo}
                                                onChange={handleChange}
                                                multiline
                                                rows={4}
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        name="agreeToTerms"
                                                        checked={formData.agreeToTerms}
                                                        onChange={handleChange}
                                                        required
                                                        color="primary"
                                                    />
                                                }
                                                label={
                                                    <Typography variant="body2">
                                                        I agree to the <RouterLink to="/terms" style={{ color: theme.palette.primary.main }}>Terms of Service</RouterLink> and <RouterLink to="/privacy" style={{ color: theme.palette.primary.main }}>Privacy Policy</RouterLink>
                                                    </Typography>
                                                }
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <SubmitButton
                                                type="submit"
                                                variant="contained"
                                                color="secondary"
                                                size="large"
                                                endIcon={<ArrowForwardIcon />}
                                            >
                                                Submit Request
                                            </SubmitButton>
                                        </Grid>
                                    </Grid>
                                </form>
                            </FormContainer>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default Appointment; 