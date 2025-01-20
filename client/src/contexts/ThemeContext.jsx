import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material';

const ThemeContext = createContext();

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    try {
      const savedMode = localStorage.getItem('themeMode');
      return savedMode || 'light';
    } catch {
      return 'light';
    }
  });

  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      primary: {
        main: '#4f46e5',
        light: '#6366f1',
        dark: '#4338ca',
      },
      secondary: {
        main: '#ec4899',
        light: '#f472b6',
        dark: '#db2777',
      },
      background: {
        default: mode === 'light' ? '#f3f4f6' : '#111827',
        paper: mode === 'light' ? '#ffffff' : '#1f2937',
      },
      text: {
        primary: mode === 'light' ? '#111827' : '#f9fafb',
        secondary: mode === 'light' ? '#4b5563' : '#9ca3af',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: { fontWeight: 700 },
      h2: { fontWeight: 700 },
      h3: { fontWeight: 600 },
      h4: { fontWeight: 600 },
      h5: { fontWeight: 500 },
      h6: { fontWeight: 500 },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 500,
            borderRadius: 8,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
    },
  }), [mode]);

  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    try {
      localStorage.setItem('themeMode', newMode);
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };

  useEffect(() => {
    document.documentElement.style.colorScheme = mode;
  }, [mode]);

  const value = useMemo(() => ({ mode, toggleTheme }), [mode]);

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
