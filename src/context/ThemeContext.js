import React, { createContext, useState, useContext, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import defaultTheme from '../styles/theme';

// Theme options
export const THEME_MODES = {
    LIGHT: 'light',
    DARK: 'dark',
    HIGH_CONTRAST: 'high-contrast'
};

// Create context
const ThemeContext = createContext({
    themeMode: THEME_MODES.LIGHT,
    toggleThemeMode: () => { },
    setThemeMode: () => { },
});

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

// Create theme based on mode
const createAppTheme = (mode) => {
    if (mode === THEME_MODES.DARK) {
        return createTheme({
            ...defaultTheme,
            palette: {
                ...defaultTheme.palette,
                mode: 'dark',
                background: {
                    default: '#121212',
                    paper: '#1E1E1E',
                    light: '#2D2D2D',
                    dark: '#0A0A0A',
                },
                text: {
                    primary: '#FFFFFF',
                    secondary: '#CCCCCC',
                },
            },
        });
    }

    return defaultTheme;
};

// Theme provider component
export const ThemeProvider = ({ children }) => {
    // Get saved theme from localStorage or use light mode as default
    const getSavedThemeMode = () => {
        const savedTheme = localStorage.getItem('bhn-theme-mode');
        return Object.values(THEME_MODES).includes(savedTheme)
            ? savedTheme
            : THEME_MODES.LIGHT;
    };

    const [themeMode, setThemeMode] = useState(getSavedThemeMode);

    // Generate the appropriate MUI theme based on current mode
    const theme = React.useMemo(() => {
        if (themeMode === THEME_MODES.HIGH_CONTRAST) {
            // Create high contrast theme for accessibility
            return createTheme({
                ...defaultTheme,
                palette: {
                    ...defaultTheme.palette,
                    mode: 'dark',
                    primary: {
                        main: '#FFFF00', // High contrast yellow
                        contrastText: '#000000',
                    },
                    secondary: {
                        main: '#00FFFF', // High contrast cyan
                        contrastText: '#000000',
                    },
                    background: {
                        default: '#000000',
                        paper: '#000000',
                    },
                    text: {
                        primary: '#FFFFFF',
                        secondary: '#FFFFFF',
                    },
                },
                typography: {
                    ...defaultTheme.typography,
                    allVariants: {
                        fontWeight: 700, // Bolder text for better readability
                    },
                },
                components: {
                    ...defaultTheme.components,
                    MuiButton: {
                        ...defaultTheme.components.MuiButton,
                        styleOverrides: {
                            ...defaultTheme.components.MuiButton.styleOverrides,
                            root: {
                                ...defaultTheme.components.MuiButton.styleOverrides.root,
                                border: '2px solid white', // More visible borders
                            },
                        },
                    },
                },
            });
        }

        return createAppTheme(themeMode);
    }, [themeMode]);

    // Toggle between light and dark mode
    const toggleThemeMode = () => {
        const newMode = themeMode === THEME_MODES.LIGHT
            ? THEME_MODES.DARK
            : THEME_MODES.LIGHT;
        setThemeMode(newMode);
    };

    // Set specific theme mode
    const handleSetThemeMode = (mode) => {
        if (Object.values(THEME_MODES).includes(mode)) {
            setThemeMode(mode);
        }
    };

    // Save theme preference to localStorage
    useEffect(() => {
        localStorage.setItem('bhn-theme-mode', themeMode);

        // Update body class for global styling
        document.body.classList.remove(
            'theme-light',
            'theme-dark',
            'theme-high-contrast'
        );
        document.body.classList.add(`theme-${themeMode}`);

        // Also update meta theme-color for mobile browsers
        const metaThemeColor = document.querySelector('meta[name=theme-color]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute(
                'content',
                themeMode === THEME_MODES.LIGHT ? '#FFFFFF' : '#121212'
            );
        }
    }, [themeMode]);

    return (
        <ThemeContext.Provider
            value={{
                themeMode,
                toggleThemeMode,
                setThemeMode: handleSetThemeMode,
            }}
        >
            <MuiThemeProvider theme={theme}>
                {children}
            </MuiThemeProvider>
        </ThemeContext.Provider>
    );
};

export default ThemeContext; 