import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme as useMuiTheme,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../../context/AuthContext';
import Logo from './Logo';
import SearchDialog from '../common/SearchDialog';

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const { currentUser, logout } = useAuth();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Team', href: '/team' },
    { name: 'Project', href: '/project' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleProfileMenuClose();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const appBarStyles = {
    background: isScrolled ? 'white' : 'transparent',
    boxShadow: isScrolled ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
    borderBottom: isScrolled ? '1px solid rgba(0, 0, 0, 0.1)' : 'none',
    transition: 'all 0.3s ease',
    color: 'black',
  };

  const navLinkStyles = (active) => ({
    padding: '4px 8px',
    position: 'relative',
    transition: 'all 0.3s ease',
    fontFamily: '"Open Sans", "Roboto", "Arial", sans-serif',
    fontSize: '16px',
    fontWeight: 500,
    color: active ? '#0066CC' : 'black',
    textDecoration: 'none',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: '-2px',
      left: 0,
      width: active ? '100%' : '0',
      height: '2px',
      backgroundColor: '#0066CC',
      transition: 'width 0.3s ease',
    },
    '&:hover': {
      color: '#0066CC',
      textDecoration: 'none',
      '&::after': {
        width: '100%',
      },
    },
  });

  const actionButtonStyles = {
    ml: 1,
    py: 0.75,
    px: 1.5,
    fontWeight: 600,
    letterSpacing: '0.02em',
    fontSize: '14px',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
    },
  };

  const drawer = (
    <Box sx={{ width: 280, p: 3, bgcolor: 'var(--color-primary-light)', color: 'white' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Logo />
        <IconButton onClick={handleDrawerToggle} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <List>
        {navigation.map((item) => (
          <ListItem
            key={item.name}
            component={RouterLink}
            to={item.href}
            onClick={handleDrawerToggle}
            sx={{
              py: 1.5,
              px: 3,
              borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
              backgroundColor: isActive(item.href) ? 'rgba(0, 102, 204, 0.08)' : 'transparent',
            }}
          >
            <ListItemText
              primary={item.name}
              primaryTypographyProps={{
                fontWeight: isActive(item.href) ? 600 : 500,
                fontSize: '1rem',
                color: isActive(item.href) ? '#0066CC' : 'inherit',
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="fixed" sx={appBarStyles}>
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between', py: 1, minHeight: '70px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              <Logo size="medium" />
            </Box>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 2 }}>
                {navigation.map((item) => (
                  <Box
                    key={item.name}
                    component={RouterLink}
                    to={item.href}
                    sx={navLinkStyles(isActive(item.href))}
                  >
                    {item.name}
                  </Box>
                ))}
              </Box>
            )}

            {/* Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                onClick={() => setSearchOpen(true)}
                variant="outlined"
                size="small"
                sx={{
                  borderRadius: 5,
                  border: '1px solid #E0E0E0',
                  py: 0.5,
                  px: 2,
                  color: '#666666',
                  textTransform: 'none',
                  fontWeight: 400,
                  '&:hover': {
                    bgcolor: '#f8f9fa',
                    borderColor: '#0066CC',
                    color: '#0066CC',
                  },
                }}
                startIcon={<SearchIcon sx={{ fontSize: '16px' }} />}
              >
                Search
              </Button>

              {currentUser ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Button
                    component={RouterLink}
                    to="/appointment"
                    variant="outlined"
                    size="small"
                    sx={{
                      color: 'white',
                      borderColor: 'rgba(255, 255, 255, 0.7)',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      px: 2,
                      py: 0.5,
                      borderRadius: '20px',
                      '&:hover': {
                        borderColor: 'white',
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                      },
                    }}
                  >
                    Book Appointment
                  </Button>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'pointer',
                      p: 0.75,
                      borderRadius: 3,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      },
                    }}
                    onClick={handleProfileMenuOpen}
                  >
                    <Avatar
                      sx={{
                        width: 36,
                        height: 36,
                        bgcolor: 'white',
                        color: 'var(--color-primary-light)',
                        mr: 1,
                      }}
                    >
                      {currentUser.fullName?.charAt(0).toUpperCase() || 'U'}
                    </Avatar>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        fontSize: '14px',
                        mr: 0.5,
                        color: 'white',
                      }}
                    >
                      {currentUser.fullName}
                    </Typography>
                    <ExpandMoreIcon sx={{ fontSize: '16px' }} />
                  </Box>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    component={RouterLink}
                    to="/login"
                    variant="outlined"
                    size="small"
                    sx={actionButtonStyles}
                  >
                    Login
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/register"
                    variant="contained"
                    size="small"
                    sx={actionButtonStyles}
                  >
                    Register
                  </Button>
                </Box>
              )}

              {/* Mobile Menu Button */}
              {isMobile && (
                <IconButton
                  edge="end"
                  onClick={handleDrawerToggle}
                  sx={{ color: 'black' }}
                >
                  <MenuIcon />
                </IconButton>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Toolbar spacer to prevent content overlap */}
      <Toolbar />

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: 280,
            bgcolor: 'var(--color-primary-light)',
            color: 'white',
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* User Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        sx={{
          mt: 1.5,
          '& .MuiPaper-root': {
            minWidth: 200,
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        <MenuItem onClick={() => { navigate('/dashboard'); handleProfileMenuClose(); }}>
          <DashboardIcon sx={{ mr: 1 }} />
          Dashboard
        </MenuItem>
        <MenuItem onClick={() => {
          navigate(currentUser?.userType === 'doctor' || currentUser?.userType === 'provider' ? '/doctor-profile' : '/patient-profile');
          handleProfileMenuClose();
        }}>
          <PersonOutlineIcon sx={{ mr: 1 }} />
          Profile
        </MenuItem>
        <MenuItem onClick={() => { navigate('/settings'); handleProfileMenuClose(); }}>
          <SettingsIcon sx={{ mr: 1 }} />
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <LogoutIcon sx={{ mr: 1 }} />
          Logout
        </MenuItem>
      </Menu>

      {/* Search Dialog */}
      <SearchDialog
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </>
  );
};

export default Header; 