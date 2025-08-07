import React from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CardMedia,
    IconButton,
    Chip,
} from '@mui/material';
import styled from 'styled-components';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import CodeIcon from '@mui/icons-material/Code';
import StorageIcon from '@mui/icons-material/Storage';
import CloudIcon from '@mui/icons-material/Cloud';
import BugReportIcon from '@mui/icons-material/BugReport';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import TwitterIcon from '@mui/icons-material/Twitter';

const PageHeader = styled(Box)`
  background-color: #0066CC;
  color: white;
  padding: 80px 0 40px;
  background-image: linear-gradient(135deg, #0066CC 0%, #004494 100%);
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url('https://via.placeholder.com/1920x600?text=Team+Background');
    background-size: cover;
    background-position: center;
    opacity: 0.15;
  }
`;

const SectionTitle = styled(Typography)`
  position: relative;
  margin-bottom: 40px;
  font-weight: 700;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -12px;
    left: 0;
    width: 60px;
    height: 3px;
    background-color: #0066CC;
    border-radius: 3px;
  }
`;

const TeamMemberCard = styled(Card)`
  height: 100%;
  transition: all 0.3s ease;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  border: none;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  background-color: white;
  max-width: 280px;
  margin: 0 auto;
  padding-top: 15px;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const MemberImage = styled(CardMedia)`
  transition: transform 0.5s ease;
  height: 100px;
  width: 100px !important;
  border-radius: 50%;
  margin: 10px auto;
  object-fit: cover;
  object-position: center;
  border: 3px solid #f0f0f0;
`;

const SocialIconsContainer = styled(Box)`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 15px;
`;

const SocialIcon = styled(IconButton)`
  background-color: #f0f0f0;
  width: 36px;
  height: 36px;
  padding: 0;
  
  &:hover {
    background-color: ${props => props.color};
    color: white;
  }
`;

const ProfileCardsSection = styled(Box)`
  background-color: #f5f5f5;
  padding: 60px 0;
  width: 100%;
`;

const ProfileCardsTitle = styled(Typography)`
  text-align: center;
  margin-bottom: 40px;
  font-weight: 600;
  color: #333;
`;

const Team = () => {
    // Team members data with actual information
    const teamMembers = [
        {
            name: "Aniket Mishra",
            role: "Project Lead & Full Stack Developer",
            bio: "Responsible for frontend development, backend APIs, and AWS integration. Led the team with task delegation, application management, and coordination. Developed core React components and managed data flow.",
            image: "/aniket .png",
            skills: ["React", "Node.js", "AWS", "API Design"],
            icon: <CodeIcon fontSize="large" />,
            color: "#3498db"
        },
        {
            name: "Abu Taber Shareef",
            role: "Cloud DevSecOps Engineer",
            bio: "Managed core cloud infrastructure (AWS) with a focus on security, scalability, and automation. Led advanced DevOps practices using Terraform, Kubernetes, Jenkins, and Docker.",
            image: "/taber.jpg",
            skills: ["AWS", "DevOps", "Cloud Architecture", "Security"],
            icon: <CloudIcon fontSize="large" />,
            color: "#2ecc71"
        },
        {
            name: "Krushang Mankad",
            role: "Database Architect & App Developer",
            bio: "Built and optimized the relational database schema. Developed the mobile application prototype and API endpoints. Coordinated between backend and frontend for data integrity.",
            image: "/krushang.jpg",
            skills: ["Database Design", "Mobile Development", "API", "SQL"],
            icon: <StorageIcon fontSize="large" />,
            color: "#e74c3c"
        },
        {
            name: "Aman Patel",
            role: "QA & Testing / Backend Support",
            bio: "Designed test cases, performed unit and integration testing. Helped debug backend logic and ensured system reliability. Validated APIs and database outputs for consistency.",
            image: "/aman.png",
            skills: ["Testing", "QA", "Backend", "Debugging"],
            icon: <BugReportIcon fontSize="large" />,
            color: "#f39c12"
        },
        {
            name: "Geetanjali Sharma",
            role: "UI/UX Designer & Documentation Lead",
            bio: "Designed wireframes, user flows, and UI elements. Created project documentation and branding materials. Led the visual identity and content structure.",
            image: "/geet.png",
            skills: ["UI/UX", "Wireframing", "Documentation", "Branding"],
            icon: <DesignServicesIcon fontSize="large" />,
            color: "#9b59b6"
        }
    ];

    return (
        <Box>
            {/* Enhanced Page Header */}
            <Box sx={{
                background: 'linear-gradient(135deg, #0066CC 0%, #004499 50%, #002266 100%)',
                color: 'white',
                padding: { xs: '60px 0 40px', md: '100px 0 60px' },
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'url("data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.03"%3E%3Cpath d="M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat',
                    opacity: 0.1
                },
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '100px',
                    background: 'linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.1) 100%)',
                    pointerEvents: 'none'
                }
            }}>
                <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
                    <Box sx={{ textAlign: 'center', maxWidth: '900px', mx: 'auto' }}>
                        <Typography
                            variant="h1"
                            sx={{
                                mb: 4,
                                fontWeight: 800,
                                fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                                fontFamily: '"Open Sans", "Roboto", "Arial", sans-serif',
                                textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                                lineHeight: 1.2,
                                background: 'linear-gradient(135deg, #ffffff 0%, #f0f8ff 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text'
                            }}
                        >
                            Meet the Minds Behind BHN
                        </Typography>
                        <Typography
                            variant="h5"
                            sx={{
                                maxWidth: '800px',
                                mx: 'auto',
                                fontWeight: 400,
                                opacity: 0.95,
                                fontSize: { xs: '1.2rem', md: '1.4rem' },
                                lineHeight: 1.6,
                                fontFamily: '"Open Sans", "Roboto", "Arial", sans-serif',
                                textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
                                mb: 3
                            }}
                        >
                            We're a team of passionate developers, analysts, and designers committed to creating a meaningful solution to one of the most fundamental healthcare challenges—birth registration.
                        </Typography>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: 2,
                            mt: 4
                        }}>
                            <Box sx={{
                                width: 60,
                                height: 2,
                                background: 'linear-gradient(90deg, transparent, white, transparent)',
                                borderRadius: 1
                            }} />
                            <Typography variant="body1" sx={{
                                fontWeight: 500,
                                fontSize: '1.1rem',
                                opacity: 0.8
                            }}>
                                Innovation • Collaboration • Excellence
                            </Typography>
                            <Box sx={{
                                width: 60,
                                height: 2,
                                background: 'linear-gradient(90deg, transparent, white, transparent)',
                                borderRadius: 1
                            }} />
                        </Box>
                    </Box>
                </Container>
            </Box>

            {/* Enhanced Team Introduction */}
            <Box sx={{
                py: { xs: 8, md: 12 },
                bgcolor: '#f8f9fa',
                background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                position: 'relative'
            }}>
                <Container maxWidth="xl">
                    <Grid container spacing={{ xs: 4, md: 8 }} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Box sx={{ pr: { md: 4 } }}>
                                <Typography
                                    variant="h3"
                                    sx={{
                                        fontWeight: 700,
                                        fontSize: { xs: '2rem', md: '2.8rem' },
                                        fontFamily: '"Open Sans", "Roboto", "Arial", sans-serif',
                                        color: '#2c3e50',
                                        mb: 4,
                                        position: 'relative',
                                        '&::after': {
                                            content: '""',
                                            position: 'absolute',
                                            bottom: -12,
                                            left: 0,
                                            width: 60,
                                            height: 4,
                                            background: 'linear-gradient(135deg, #0066CC 0%, #004499 100%)',
                                            borderRadius: 2
                                        }
                                    }}
                                >
                                    Our Multi-Disciplinary Team
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        fontSize: { xs: '1.1rem', md: '1.2rem' },
                                        lineHeight: 1.8,
                                        color: '#4a5568',
                                        mb: 3,
                                        fontWeight: 400,
                                        fontFamily: '"Open Sans", "Roboto", "Arial", sans-serif'
                                    }}
                                >
                                    Our multi-disciplinary team worked together on database architecture, frontend/backend development, cloud deployment, and UI/UX design to create a comprehensive solution for birth health registration.
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        fontSize: { xs: '1.1rem', md: '1.2rem' },
                                        lineHeight: 1.8,
                                        color: '#4a5568',
                                        mb: 4,
                                        fontWeight: 400,
                                        fontFamily: '"Open Sans", "Roboto", "Arial", sans-serif'
                                    }}
                                >
                                    Each member brings unique expertise to the table, allowing us to approach challenges from different perspectives and create innovative solutions that address real healthcare needs.
                                </Typography>

                                {/* Enhanced Stats Section */}
                                <Grid container spacing={3} sx={{ mt: 2 }}>
                                    <Grid item xs={4}>
                                        <Box sx={{ textAlign: 'center' }}>
                                            <Typography
                                                variant="h4"
                                                sx={{
                                                    fontWeight: 700,
                                                    color: '#0066CC',
                                                    fontSize: { xs: '1.5rem', md: '2rem' }
                                                }}
                                            >
                                                5
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: '#6b7280',
                                                    fontSize: { xs: '0.9rem', md: '1rem' },
                                                    fontWeight: 500
                                                }}
                                            >
                                                Team Members
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Box sx={{ textAlign: 'center' }}>
                                            <Typography
                                                variant="h4"
                                                sx={{
                                                    fontWeight: 700,
                                                    color: '#0066CC',
                                                    fontSize: { xs: '1.5rem', md: '2rem' }
                                                }}
                                            >
                                                4
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: '#6b7280',
                                                    fontSize: { xs: '0.9rem', md: '1rem' },
                                                    fontWeight: 500
                                                }}
                                            >
                                                Disciplines
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Box sx={{ textAlign: 'center' }}>
                                            <Typography
                                                variant="h4"
                                                sx={{
                                                    fontWeight: 700,
                                                    color: '#0066CC',
                                                    fontSize: { xs: '1.5rem', md: '2rem' }
                                                }}
                                            >
                                                1
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: '#6b7280',
                                                    fontSize: { xs: '0.9rem', md: '1rem' },
                                                    fontWeight: 500
                                                }}
                                            >
                                                Shared Vision
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box
                                sx={{
                                    height: { xs: 300, md: 450 },
                                    borderRadius: 4,
                                    overflow: 'hidden',
                                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                                    position: 'relative',
                                    border: '3px solid white',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-5px)',
                                        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.2)'
                                    }
                                }}
                            >
                                <Box
                                    sx={{
                                        width: '100%',
                                        height: '100%',
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        position: 'relative',
                                        '&::after': {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat',
                                            opacity: 0.3
                                        }
                                    }}
                                >
                                    <Box sx={{ textAlign: 'center', color: 'white', zIndex: 1 }}>
                                        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                                            BHN Team
                                        </Typography>
                                        <Typography variant="body1" sx={{ opacity: 0.9, fontSize: '1.1rem' }}>
                                            Building the Future of Healthcare
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Team Members Section */}
            <ProfileCardsSection>
                <Container maxWidth="xl">
                    <ProfileCardsTitle variant="h4" component="h2">
                        Our Team
                    </ProfileCardsTitle>

                    <Grid container spacing={4} justifyContent="center">
                        {teamMembers.map((member, index) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                                <TeamMemberCard>
                                    <MemberImage
                                        component="img"
                                        image={member.image}
                                        alt={member.name}
                                        className="member-image"
                                        sx={{ borderColor: `${member.color}30` }}
                                    />
                                    <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
                                        <Typography variant="h6" fontWeight={600} gutterBottom>
                                            {member.name}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: member.color,
                                                fontWeight: 600,
                                                mb: 2,
                                                fontSize: '0.85rem'
                                            }}
                                        >
                                            {member.role}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{
                                            mb: 3,
                                            fontSize: '0.8rem',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 6,
                                            WebkitBoxOrient: 'vertical',
                                            lineHeight: 1.6,
                                            textAlign: 'left'
                                        }}>
                                            {member.bio}
                                        </Typography>

                                        <SocialIconsContainer>
                                            <SocialIcon size="small" color="#1DA1F2">
                                                <TwitterIcon fontSize="small" />
                                            </SocialIcon>
                                            <SocialIcon size="small" color="#0077B5">
                                                <LinkedInIcon fontSize="small" />
                                            </SocialIcon>
                                            <SocialIcon size="small" color="#333">
                                                <GitHubIcon fontSize="small" />
                                            </SocialIcon>
                                        </SocialIconsContainer>
                                    </CardContent>
                                </TeamMemberCard>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </ProfileCardsSection>

            {/* Enhanced Team Values Section */}
            <Box sx={{
                py: { xs: 6, md: 10 },
                bgcolor: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat',
                    opacity: 0.3
                }
            }}>
                <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
                    {/* Enhanced Section Header */}
                    <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
                        <Typography
                            variant="h3"
                            sx={{
                                fontFamily: '"Open Sans", "Roboto", "Arial", sans-serif',
                                fontWeight: 800,
                                fontSize: { xs: '2.5rem', md: '3.5rem' },
                                background: 'linear-gradient(135deg, #0066CC 0%, #004C99 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                mb: 3,
                                position: 'relative',
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    bottom: -16,
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: 80,
                                    height: 4,
                                    background: 'linear-gradient(135deg, #0066CC 0%, #004C99 100%)',
                                    borderRadius: 2
                                }
                            }}
                        >
                            Our Approach
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{
                                fontFamily: '"Open Sans", "Roboto", "Arial", sans-serif',
                                color: 'text.secondary',
                                fontSize: { xs: '1.1rem', md: '1.3rem' },
                                fontWeight: 400,
                                maxWidth: '600px',
                                mx: 'auto',
                                lineHeight: 1.6,
                                mt: 4
                            }}
                        >
                            Our methodology drives innovation through proven principles and collaborative excellence
                        </Typography>
                    </Box>

                    {/* Enhanced Approach Cards */}
                    <Grid container spacing={{ xs: 3, md: 4 }} justifyContent="center">
                        {[
                            {
                                title: "Innovation",
                                description: "We leverage cutting-edge technologies to create solutions that address real healthcare challenges with modern approaches.",
                                color: "#3498db",
                                icon: "🚀"
                            },
                            {
                                title: "Collaboration",
                                description: "Our multi-disciplinary approach ensures that all aspects of the project are considered and integrated seamlessly.",
                                color: "#2ecc71",
                                icon: "🤝"
                            },
                            {
                                title: "User-Centered",
                                description: "We design with the end users in mind, ensuring our solutions are intuitive, accessible, and user-friendly.",
                                color: "#e74c3c",
                                icon: "👥"
                            },
                            {
                                title: "Data Security",
                                description: "We prioritize the protection of sensitive health information with robust security measures and compliance standards.",
                                color: "#f39c12",
                                icon: "🔒"
                            }
                        ].map((value, index) => (
                            <Grid item xs={12} sm={6} lg={3} key={index}>
                                <Card sx={{
                                    height: '100%',
                                    borderRadius: { xs: 3, md: 4 },
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                    border: `2px solid ${value.color}20`,
                                    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        height: 4,
                                        background: `linear-gradient(135deg, ${value.color} 0%, ${value.color}cc 100%)`,
                                        opacity: 0.8
                                    },
                                    '&:hover': {
                                        transform: 'translateY(-8px) scale(1.02)',
                                        boxShadow: `0 20px 40px rgba(${parseInt(value.color.slice(1, 3), 16)}, ${parseInt(value.color.slice(3, 5), 16)}, ${parseInt(value.color.slice(5, 7), 16)}, 0.25)`,
                                        border: `2px solid ${value.color}40`,
                                        '& .approach-icon': {
                                            transform: 'scale(1.2) rotate(5deg)',
                                        },
                                        '& .approach-number': {
                                            background: `linear-gradient(135deg, ${value.color} 0%, ${value.color}cc 100%)`,
                                            color: 'white',
                                            transform: 'scale(1.1)'
                                        }
                                    }
                                }}>
                                    <CardContent sx={{ p: { xs: 3, md: 4 }, textAlign: 'center' }}>
                                        {/* Enhanced Icon Container */}
                                        <Box
                                            sx={{
                                                width: { xs: 70, md: 80 },
                                                height: { xs: 70, md: 80 },
                                                borderRadius: '50%',
                                                bgcolor: `${value.color}15`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                mx: 'auto',
                                                mb: 3,
                                                position: 'relative',
                                                border: `3px solid ${value.color}30`,
                                                transition: 'all 0.3s ease'
                                            }}
                                        >
                                            <Typography
                                                variant="h3"
                                                className="approach-icon"
                                                sx={{
                                                    fontSize: { xs: '2rem', md: '2.5rem' },
                                                    transition: 'all 0.3s ease',
                                                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                                                }}
                                            >
                                                {value.icon}
                                            </Typography>
                                            <Box
                                                className="approach-number"
                                                sx={{
                                                    position: 'absolute',
                                                    bottom: -8,
                                                    right: -8,
                                                    width: 28,
                                                    height: 28,
                                                    borderRadius: '50%',
                                                    bgcolor: `${value.color}20`,
                                                    color: value.color,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '0.9rem',
                                                    fontWeight: 700,
                                                    transition: 'all 0.3s ease',
                                                    border: '2px solid white',
                                                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                                                }}
                                            >
                                                {index + 1}
                                            </Box>
                                        </Box>

                                        {/* Enhanced Title */}
                                        <Typography
                                            variant="h5"
                                            sx={{
                                                fontFamily: '"Open Sans", "Roboto", "Arial", sans-serif',
                                                fontWeight: 700,
                                                fontSize: { xs: '1.3rem', md: '1.5rem' },
                                                color: value.color,
                                                mb: 2,
                                                textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                                            }}
                                        >
                                            {value.title}
                                        </Typography>

                                        {/* Enhanced Description */}
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                fontFamily: '"Open Sans", "Roboto", "Arial", sans-serif',
                                                color: 'text.secondary',
                                                fontSize: { xs: '0.95rem', md: '1rem' },
                                                lineHeight: 1.7,
                                                fontWeight: 400,
                                                textAlign: 'center'
                                            }}
                                        >
                                            {value.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Enhanced Bottom Section */}
                    <Box sx={{ textAlign: 'center', mt: { xs: 6, md: 8 } }}>
                        <Typography
                            variant="h6"
                            sx={{
                                fontFamily: '"Open Sans", "Roboto", "Arial", sans-serif',
                                color: 'text.primary',
                                fontSize: { xs: '1.1rem', md: '1.2rem' },
                                fontWeight: 500,
                                fontStyle: 'italic',
                                opacity: 0.8
                            }}
                        >
                            "Together, we're building the future of healthcare technology"
                        </Typography>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
};

export default Team; 