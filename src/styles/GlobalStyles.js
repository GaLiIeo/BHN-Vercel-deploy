import { GlobalStyles as MuiGlobalStyles } from '@mui/material';

const GlobalStyles = () => (
  <MuiGlobalStyles
    styles={{
      ':root': {
        /* Primary Colors */
        '--color-primary': '#0066CC',
        '--color-primary-light': '#4D94DB',
        '--color-primary-dark': '#004C99',

        /* Secondary Colors */
        '--color-secondary': '#00843D',
        '--color-secondary-light': '#4DA675',
        '--color-secondary-dark': '#006330',

        /* Text Colors */
        '--color-text-primary': '#333333',
        '--color-text-secondary': '#666666',
        '--color-text-disabled': '#999999',

        /* Background Colors */
        '--color-background': '#FFFFFF',
        '--color-background-light': '#F5F7FA',
        '--color-background-dark': '#F0F0F0',

        /* Accent Colors */
        '--color-accent-red': '#D32F2F',
        '--color-accent-orange': '#FFA000',
        '--color-accent-blue': '#0288D1',

        /* Border Colors */
        '--color-border': '#E0E0E0',
        '--color-border-light': '#F0F0F0',

        /* Shadow */
        '--shadow-sm': '0px 1px 3px rgba(0, 0, 0, 0.08)',
        '--shadow-md': '0px 2px 8px rgba(0, 0, 0, 0.08)',
        '--shadow-lg': '0px 8px 16px rgba(0, 0, 0, 0.1)',

        /* Spacing */
        '--spacing-xs': '4px',
        '--spacing-sm': '8px',
        '--spacing-md': '16px',
        '--spacing-lg': '24px',
        '--spacing-xl': '32px',
        '--spacing-xxl': '48px',

        /* Border Radius */
        '--border-radius-sm': '4px',
        '--border-radius-md': '8px',
        '--border-radius-lg': '16px',
        '--border-radius-xl': '24px',

        /* Transitions */
        '--transition-fast': '0.2s ease',
        '--transition-normal': '0.3s ease',
        '--transition-slow': '0.5s ease',
      },

      '*': {
        margin: 0,
        padding: 0,
        boxSizing: 'border-box',
      },

      'html, body': {
        fontFamily: '"Open Sans", "Roboto", "Arial", sans-serif',
        fontSize: '16px',
        lineHeight: 1.6,
        color: 'var(--color-text-primary)',
        backgroundColor: 'var(--color-background)',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        scrollBehavior: 'smooth',
      },

      '#root': {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      },

      'h1, h2, h3, h4, h5, h6': {
        marginBottom: '0.5em',
        fontWeight: 700,
        lineHeight: 1.2,
        color: 'var(--color-text-primary)',
      },

      'p': {
        marginBottom: '1rem',
      },

      'a': {
        color: 'var(--color-primary)',
        textDecoration: 'none',
        transition: 'color var(--transition-fast)',

        '&:hover': {
          color: 'var(--color-primary-dark)',
          textDecoration: 'underline',
        },
      },

      'img': {
        maxWidth: '100%',
        height: 'auto',
      },

      'button': {
        cursor: 'pointer',
        fontFamily: 'inherit',
      },

      /* Section Styles */
      '.section': {
        padding: 'var(--spacing-xxl) 0',

        '&.section-sm': {
          padding: 'var(--spacing-lg) 0',
        },

        '&.section-lg': {
          padding: 'calc(var(--spacing-xxl) * 1.5) 0',
        },

        '&.section-alt': {
          backgroundColor: 'var(--color-background-light)',
        },
      },

      /* Container Styles */
      '.container': {
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 var(--spacing-lg)',

        '@media (max-width: 768px)': {
          padding: '0 var(--spacing-md)',
        },
      },

      /* Utility Classes */
      '.text-center': {
        textAlign: 'center',
      },

      '.text-right': {
        textAlign: 'right',
      },

      '.text-primary': {
        color: 'var(--color-primary)',
      },

      '.text-secondary': {
        color: 'var(--color-secondary)',
      },

      '.bg-primary': {
        backgroundColor: 'var(--color-primary)',
        color: 'white',
      },

      '.bg-secondary': {
        backgroundColor: 'var(--color-secondary)',
        color: 'white',
      },

      '.bg-light': {
        backgroundColor: 'var(--color-background-light)',
      },
    }}
  />
);

export default GlobalStyles;