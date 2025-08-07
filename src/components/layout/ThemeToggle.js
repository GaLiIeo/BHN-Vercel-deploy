import React from 'react';
import {
    Box,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Tooltip,
    Typography
} from '@mui/material';
import { useTheme, THEME_MODES } from '../../context/ThemeContext';

// Icons
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import ContrastIcon from '@mui/icons-material/Contrast';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const ThemeToggle = () => {
    const { themeMode, setThemeMode } = useTheme();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleThemeChange = (mode) => {
        setThemeMode(mode);
        handleClose();
    };

    // Get the current theme icon and name
    const getThemeIcon = () => {
        switch (themeMode) {
            case THEME_MODES.DARK:
                return <DarkModeIcon fontSize="small" sx={{ color: 'inherit' }} />;
            case THEME_MODES.HIGH_CONTRAST:
                return <ContrastIcon fontSize="small" sx={{ color: 'inherit' }} />;
            default:
                return <LightModeIcon fontSize="small" sx={{ color: 'inherit' }} />;
        }
    };

    const getThemeName = () => {
        switch (themeMode) {
            case THEME_MODES.DARK:
                return 'Dark';
            case THEME_MODES.HIGH_CONTRAST:
                return 'High Contrast';
            default:
                return 'Light';
        }
    };

    const themeToggleButtonStyles = {
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        p: 1,
        borderRadius: 2,
        transition: 'all 0.3s ease',
        color: 'white',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        minWidth: { xs: '40px', sm: '100px' },
        '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
        },
    };

    return (
        <>
            <Tooltip title="Change theme">
                <Box
                    onClick={handleClick}
                    aria-controls={open ? 'theme-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    sx={themeToggleButtonStyles}
                >
                    {getThemeIcon()}
                    <Typography
                        variant="body2"
                        sx={{
                            ml: 1,
                            display: { xs: 'none', sm: 'block' },
                            color: 'inherit',
                            fontWeight: 500
                        }}
                    >
                        {getThemeName()}
                    </Typography>
                    <ExpandMoreIcon fontSize="small" sx={{ ml: 0.5, color: 'inherit' }} />
                </Box>
            </Tooltip>

            <Menu
                id="theme-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'theme-button',
                }}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                sx={{
                    '& .MuiPaper-root': {
                        borderRadius: 2,
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
                        border: '1px solid rgba(0, 0, 0, 0.1)',
                        minWidth: 160,
                    }
                }}
            >
                <MenuItem
                    onClick={() => handleThemeChange(THEME_MODES.LIGHT)}
                    selected={themeMode === THEME_MODES.LIGHT}
                    sx={{
                        '&:hover': {
                            backgroundColor: 'rgba(25, 118, 210, 0.1)',
                        },
                        '&.Mui-selected': {
                            backgroundColor: 'rgba(25, 118, 210, 0.2)',
                            '&:hover': {
                                backgroundColor: 'rgba(25, 118, 210, 0.3)',
                            }
                        }
                    }}
                >
                    <ListItemIcon>
                        <LightModeIcon fontSize="small" color="primary" />
                    </ListItemIcon>
                    <ListItemText>Light Mode</ListItemText>
                </MenuItem>

                <MenuItem
                    onClick={() => handleThemeChange(THEME_MODES.DARK)}
                    selected={themeMode === THEME_MODES.DARK}
                    sx={{
                        '&:hover': {
                            backgroundColor: 'rgba(25, 118, 210, 0.1)',
                        },
                        '&.Mui-selected': {
                            backgroundColor: 'rgba(25, 118, 210, 0.2)',
                            '&:hover': {
                                backgroundColor: 'rgba(25, 118, 210, 0.3)',
                            }
                        }
                    }}
                >
                    <ListItemIcon>
                        <DarkModeIcon fontSize="small" color="primary" />
                    </ListItemIcon>
                    <ListItemText>Dark Mode</ListItemText>
                </MenuItem>

                <MenuItem
                    onClick={() => handleThemeChange(THEME_MODES.HIGH_CONTRAST)}
                    selected={themeMode === THEME_MODES.HIGH_CONTRAST}
                    sx={{
                        '&:hover': {
                            backgroundColor: 'rgba(25, 118, 210, 0.1)',
                        },
                        '&.Mui-selected': {
                            backgroundColor: 'rgba(25, 118, 210, 0.2)',
                            '&:hover': {
                                backgroundColor: 'rgba(25, 118, 210, 0.3)',
                            }
                        }
                    }}
                >
                    <ListItemIcon>
                        <ContrastIcon fontSize="small" color="primary" />
                    </ListItemIcon>
                    <ListItemText>High Contrast</ListItemText>
                </MenuItem>
            </Menu>
        </>
    );
};

export default ThemeToggle; 