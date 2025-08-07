import React from 'react';
import { Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Logo = ({ size = 'medium', withLink = true, sx = {} }) => {
  const sizeValues = {
    small: 55,
    medium: 65,
    large: 80
  };

  const currentSize = sizeValues[size] || sizeValues.medium;

  const logoComponent = (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease',
        py: 0.5,
        '&:hover': {
          transform: 'scale(1.05)',
        },
        ...sx
      }}
    >
      <img
        src="/logo.png"
        alt="Birth Health Network"
        style={{
          height: currentSize,
          width: currentSize,
          objectFit: 'contain',
          transition: 'all 0.3s ease',
          filter: 'drop-shadow(0 2px 8px rgba(0, 102, 204, 0.2))',
        }}
      />
    </Box>
  );

  if (withLink) {
    return (
      <RouterLink to="/" style={{ textDecoration: 'none', display: 'flex' }}>
        {logoComponent}
      </RouterLink>
    );
  }

  return logoComponent;
};

export default Logo; 