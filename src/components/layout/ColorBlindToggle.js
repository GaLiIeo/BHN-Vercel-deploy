import React, { useState } from 'react';
import { Box, Button, Typography, Tooltip, Fade, Paper } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme, THEME_MODES } from '../../context/ThemeContext';

const ColorBlindToggle = () => {
    const { themeMode, setThemeMode } = useTheme();
    const [expanded, setExpanded] = useState(false);

    const toggleExpanded = () => {
        setExpanded(!expanded);
    };

    const handleModeChange = (mode) => {
        setThemeMode(mode);
    };

    // Color blindness types with their descriptions
    const colorBlindnessModes = [
        {
            name: 'Standard',
            mode: THEME_MODES.LIGHT,
            description: 'Default color mode'
        },
        {
            name: 'Dark Mode',
            mode: THEME_MODES.DARK,
            description: 'Reduced brightness, easier on the eyes'
        },
        {
            name: 'High Contrast',
            mode: THEME_MODES.HIGH_CONTRAST,
            description: 'Maximum contrast for visual impairments'
        }
    ];

    const toggleContainerStyles = {
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        p: 1.5,
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        maxWidth: '95%',
        width: 'auto',
    };

    const toggleButtonStyles = (active) => ({
        m: 0.75,
        py: 1.25,
        px: 2,
        borderRadius: 1,
        minWidth: '160px',
        fontWeight: active ? 700 : 500,
        boxShadow: active ? '0 0 0 2px currentColor' : 'none',
    });

    const closeButtonStyles = {
        position: 'absolute',
        top: 8,
        right: 8,
        minWidth: 0,
        p: 0.5,
        color: 'inherit',
    };

    return (
        <>
            {/* Collapsed toggle button */}
            {!expanded && (
                <Tooltip title="Accessibility Options" placement="top">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={toggleExpanded}
                        sx={{
                            position: 'fixed',
                            bottom: '20px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            zIndex: 1000,
                            borderRadius: '30px',
                            py: 1,
                            px: 2,
                            boxShadow: 3,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}
                    >
                        <VisibilityIcon fontSize="small" />
                        <Typography variant="body2" fontWeight={500}>
                            Accessibility Options
                        </Typography>
                    </Button>
                </Tooltip>
            )}

            {/* Expanded panel */}
            <Fade in={expanded}>
                <Paper elevation={6} sx={toggleContainerStyles}>
                    <Button
                        size="small"
                        onClick={toggleExpanded}
                        aria-label="Close accessibility panel"
                        sx={closeButtonStyles}
                    >
                        <CloseIcon fontSize="small" />
                    </Button>

                    <Box sx={{ mb: 2, textAlign: 'center' }}>
                        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                            Accessibility Options
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Select the display mode that works best for you
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, flexWrap: 'wrap', justifyContent: 'center' }}>
                        {colorBlindnessModes.map((mode) => (
                            <Button
                                key={mode.mode}
                                variant={themeMode === mode.mode ? "contained" : "outlined"}
                                color="primary"
                                onClick={() => handleModeChange(mode.mode)}
                                sx={toggleButtonStyles(themeMode === mode.mode)}
                            >
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="body2" fontWeight={500}>
                                        {mode.name}
                                    </Typography>
                                    <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                                        {mode.description}
                                    </Typography>
                                </Box>
                            </Button>
                        ))}
                    </Box>
                </Paper>
            </Fade>
        </>
    );
};

export default ColorBlindToggle; 