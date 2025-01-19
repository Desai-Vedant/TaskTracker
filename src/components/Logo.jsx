import React from 'react';
import { Box, SvgIcon } from '@mui/material';
import { useThemeContext } from '../contexts/ThemeContext';

const Logo = ({ size = 32 }) => {
  const { mode } = useThemeContext();
  
  return (
    <Box 
      sx={{ 
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}
    >
      <SvgIcon
        sx={{
          fontSize: size,
          color: mode === 'light' ? '#4f46e5' : '#6366f1'
        }}
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="M12,2 C17.5228475,2 22,6.4771525 22,12 C22,17.5228475 17.5228475,22 12,22 C6.4771525,22 2,17.5228475 2,12 C2,6.4771525 6.4771525,2 12,2 Z M12,4 C7.581722,4 4,7.581722 4,12 C4,16.418278 7.581722,20 12,20 C16.418278,20 20,16.418278 20,12 C20,7.581722 16.418278,4 12,4 Z M15.2928932,7.29289322 L16.7071068,8.70710678 L10,15.4142136 L7.29289322,12.7071068 L8.70710678,11.2928932 L10,12.5857864 L15.2928932,7.29289322 Z"
        />
      </SvgIcon>
    </Box>
  );
};

export default Logo;
