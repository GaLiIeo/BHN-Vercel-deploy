import { createTheme } from '@mui/material/styles';

// Ontario Health inspired theme
const theme = createTheme({
    palette: {
        primary: {
            main: '#0066CC', // Ontario Health blue
            light: '#4D94DB',
            dark: '#004C99',
            contrastText: '#FFFFFF',
        },
        secondary: {
            main: '#00843D', // Ontario Health green
            light: '#4DA675',
            dark: '#006330',
            contrastText: '#FFFFFF',
        },
        error: {
            main: '#D32F2F',
            light: '#EF5350',
            dark: '#C62828',
        },
        warning: {
            main: '#FFA000',
            light: '#FFB333',
            dark: '#CC8000',
            contrastText: '#000000',
        },
        info: {
            main: '#0288D1',
            light: '#4DABF5',
            dark: '#01579B',
        },
        success: {
            main: '#00843D',
            light: '#4DA675',
            dark: '#006330',
        },
        text: {
            primary: '#333333',
            secondary: '#666666',
            disabled: '#999999',
        },
        background: {
            default: '#FFFFFF',
            paper: '#FFFFFF',
            light: '#F5F7FA',
            dark: '#F0F0F0',
        },
        grey: {
            50: '#FAFAFA',
            100: '#F5F5F5',
            200: '#EEEEEE',
            300: '#E0E0E0',
            400: '#BDBDBD',
            500: '#9E9E9E',
            600: '#757575',
            700: '#616161',
            800: '#424242',
            900: '#212121',
        },
    },
    typography: {
        fontFamily: '"Open Sans", "Roboto", "Arial", sans-serif',
        h1: {
            fontSize: '2.5rem',
            fontWeight: 700,
            lineHeight: 1.2,
            '@media (max-width:600px)': {
                fontSize: '2rem',
            },
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 700,
            lineHeight: 1.3,
            '@media (max-width:600px)': {
                fontSize: '1.75rem',
            },
        },
        h3: {
            fontSize: '1.75rem',
            fontWeight: 600,
            lineHeight: 1.4,
            '@media (max-width:600px)': {
                fontSize: '1.5rem',
            },
        },
        h4: {
            fontSize: '1.5rem',
            fontWeight: 600,
            lineHeight: 1.4,
        },
        h5: {
            fontSize: '1.25rem',
            fontWeight: 600,
            lineHeight: 1.4,
        },
        h6: {
            fontSize: '1.125rem',
            fontWeight: 600,
            lineHeight: 1.4,
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.6,
        },
        body2: {
            fontSize: '0.875rem',
            lineHeight: 1.6,
        },
        button: {
            textTransform: 'none',
            fontWeight: 600,
        },
        subtitle1: {
            fontSize: '1.125rem',
            fontWeight: 500,
            lineHeight: 1.5,
        },
        subtitle2: {
            fontSize: '0.875rem',
            fontWeight: 500,
            lineHeight: 1.5,
        },
    },
    shape: {
        borderRadius: 4,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 4,
                    padding: '10px 20px',
                    fontWeight: 600,
                    textTransform: 'none',
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                    },
                },
                containedPrimary: {
                    background: '#0066CC',
                    '&:hover': {
                        background: '#004C99',
                    },
                },
                containedSecondary: {
                    background: '#00843D',
                    '&:hover': {
                        background: '#006330',
                    },
                },
                outlined: {
                    borderWidth: '1px',
                    '&:hover': {
                        borderWidth: '1px',
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
                    backgroundColor: '#FFFFFF',
                    color: '#333333',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
                    borderRadius: 8,
                    overflow: 'hidden',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                        boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1)',
                        transform: 'translateY(-4px)',
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 4,
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    fontWeight: 500,
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                rounded: {
                    borderRadius: 8,
                },
                elevation1: {
                    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.08)',
                },
            },
        },
        MuiContainer: {
            styleOverrides: {
                root: {
                    paddingLeft: '24px',
                    paddingRight: '24px',
                    '@media (min-width: 600px)': {
                        paddingLeft: '32px',
                        paddingRight: '32px',
                    },
                },
            },
        },
        MuiDivider: {
            styleOverrides: {
                root: {
                    borderColor: 'rgba(0, 0, 0, 0.08)',
                },
            },
        },
        MuiButtonBase: {
            defaultProps: {
                disableRipple: false,
            },
            styleOverrides: {
                root: {
                    '&.Mui-focusVisible': {
                        outline: '2px solid #0066CC',
                        outlineOffset: '2px',
                    },
                },
            },
        },
    },
});

export default theme; 