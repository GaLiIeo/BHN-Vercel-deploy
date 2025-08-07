import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Divider,
  Grid,
  IconButton,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Simple footer links based on available pages
  const footerLinks = {
    company: [
      { name: 'Our Team', path: '/team' },
      { name: 'Project Overview', path: '/project' },
    ],
    resources: [
      { name: 'Project Documentation', path: '/project' },
    ]
  };

  // Updated contact info
  const contactInfo = [
    { icon: <EmailIcon />, text: 'mishraaniket267@gmail.com' },
    { icon: <PhoneIcon />, text: '+1 (437) 987-6041' },
    { icon: <LocationOnIcon />, text: 'Birth Health Network Headquarters' },
  ];

  const footerContainerStyles = {
    backgroundColor: '#0066CC',
    color: 'white',
    py: 10,
    pb: 5,
    '@keyframes pulse': {
      '0%': {
        boxShadow: '0 0 0 0 rgba(76, 175, 80, 0.7)',
      },
      '70%': {
        boxShadow: '0 0 0 10px rgba(76, 175, 80, 0)',
      },
      '100%': {
        boxShadow: '0 0 0 0 rgba(76, 175, 80, 0)',
      },
    },
  };

  const footerTitleStyles = {
    fontWeight: 600,
    mb: 3,
    position: 'relative',
    display: 'inline-block',
    color: 'white',
    textAlign: 'center',
    fontFamily: '"Open Sans", "Roboto", "Arial", sans-serif',
    '&:after': {
      content: '""',
      position: 'absolute',
      bottom: '-8px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '40px',
      height: '2px',
      background: 'white',
      borderRadius: '2px',
    },
  };

  const footerLinkStyles = {
    color: 'rgba(255, 255, 255, 0.9)',
    transition: 'all 0.3s ease',
    fontSize: '15px',
    fontFamily: '"Open Sans", "Roboto", "Arial", sans-serif',
    px: 2,
    py: 1,
    '&:hover': {
      color: 'white',
      textDecoration: 'underline',
    },
  };

  const socialIconButtonStyles = {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: 'white',
    mr: 1.5,
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: 'white',
      color: '#0066CC',
      transform: 'translateY(-3px)',
    },
  };

  const contactItemStyles = {
    display: 'flex',
    alignItems: 'center',
    mb: 2,
    '& .icon': {
      color: 'white',
      mr: 2,
    },
  };

  return (
    <Box sx={footerContainerStyles}>
      <Container maxWidth="xl">
        {/* Simple Footer Layout */}
        <Grid container spacing={6} sx={{ py: 4, justifyContent: 'center' }}>
          {/* Company Section */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'white', textAlign: 'center' }}>
              Company
            </Typography>
            <Stack spacing={1} sx={{ alignItems: 'center' }}>
              {footerLinks.company.map((link, index) => (
                <Link
                  key={index}
                  component={RouterLink}
                  to={link.path}
                  underline="none"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '0.875rem',
                    '&:hover': {
                      color: 'white',
                    },
                  }}
                >
                  {link.name}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Resources Section */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'white', textAlign: 'center' }}>
              Resources
            </Typography>
            <Stack spacing={1} sx={{ alignItems: 'center' }}>
              {footerLinks.resources.map((link, index) => (
                <Link
                  key={index}
                  component={RouterLink}
                  to={link.path}
                  underline="none"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '0.875rem',
                    '&:hover': {
                      color: 'white',
                    },
                  }}
                >
                  {link.name}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Contact Information Section */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'white', textAlign: 'center' }}>
              Contact Information
            </Typography>
            <Stack spacing={1} sx={{ alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailIcon sx={{ fontSize: '1rem', color: 'rgba(255, 255, 255, 0.8)' }} />
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.875rem' }}>
                  mishraaniket267@gmail.com
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhoneIcon sx={{ fontSize: '1rem', color: 'rgba(255, 255, 255, 0.8)' }} />
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.875rem' }}>
                  +1 (437) 987-6041
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOnIcon sx={{ fontSize: '1rem', color: 'rgba(255, 255, 255, 0.8)' }} />
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.875rem' }}>
                  Birth Health Network Headquarters
                </Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        {/* Divider */}
        <Divider sx={{ my: 2, bgcolor: 'rgba(255, 255, 255, 0.2)' }} />

        {/* Bottom Footer */}
        <Box sx={{ py: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                © {currentYear} Birth Health Network. All rights reserved. | We Care We Provide!
              </Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: '#4CAF50',
                }} />
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  System Status: Operational
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                PIPEDA & HIPAA Compliant
              </Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Stack direction="row" spacing={1} justifyContent={{ xs: 'center', md: 'flex-end' }}>
                <IconButton
                  aria-label="Facebook"
                  sx={{
                    color: 'white',
                    '&:hover': { color: '#FFD100' },
                    p: 1
                  }}
                >
                  <FacebookIcon />
                </IconButton>
                <IconButton
                  aria-label="Twitter"
                  sx={{
                    color: 'white',
                    '&:hover': { color: '#FFD100' },
                    p: 1
                  }}
                >
                  <TwitterIcon />
                </IconButton>
                <IconButton
                  aria-label="Instagram"
                  sx={{
                    color: 'white',
                    '&:hover': { color: '#FFD100' },
                    p: 1
                  }}
                >
                  <InstagramIcon />
                </IconButton>
                <IconButton
                  aria-label="LinkedIn"
                  sx={{
                    color: 'white',
                    '&:hover': { color: '#FFD100' },
                    p: 1
                  }}
                >
                  <LinkedInIcon />
                </IconButton>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 