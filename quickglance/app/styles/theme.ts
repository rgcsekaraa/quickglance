// app/styles/theme.ts
'use client';
import { createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#42a5f5',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ffffff',
      contrastText: '#121212',
    },
    background: {
      default: '#121212',
      paper: 'rgba(30, 30, 35, 0.8)',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255,255,255,0.7)',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '4rem',
      fontWeight: 900,
      letterSpacing: '-1px',
      lineHeight: 1.1,
    },
    h5: {
      fontSize: '1.5rem',
      fontWeight: 400,
    },
    h6: {
      fontSize: '1.25rem',
      fontWeight: 700,
    },
    body2: {
      fontSize: '0.875rem',
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 30,
          padding: '8px 24px',
        },
        containedPrimary: {
          '&:hover': {
            boxShadow: '0 15px 30px rgba(25, 118, 210, 0.5)',
          },
        },
        outlinedPrimary: {
          borderColor: '#42a5f5',
          color: '#42a5f5',
          '&:hover': {
            backgroundColor: 'rgba(66, 165, 245, 0.1)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(30, 30, 35, 0.8)',
          backdropFilter: 'blur(10px)',
          borderRadius: 16,
          border: '1px solid rgba(66, 165, 245, 0.2)',
          boxShadow:
            '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 15px rgba(66, 165, 245, 0.15)',
          '&:hover': {
            boxShadow:
              '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 25px rgba(66, 165, 245, 0.25)',
          },
        },
      },
    },
  },
});

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#000000',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#000000',
      secondary: '#555555',
    },
  },
  typography: darkTheme.typography,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 30,
          padding: '8px 24px',
        },
        containedPrimary: {
          '&:hover': {
            boxShadow: '0 15px 30px rgba(0, 0, 0, 0.3)',
          },
        },
        outlinedPrimary: {
          borderColor: '#1976d2',
          color: '#1976d2',
          '&:hover': {
            backgroundColor: 'rgba(25, 118, 210, 0.1)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          borderRadius: 16,
          border: '1px solid rgba(0,0,0,0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          },
        },
      },
    },
  },
});

export { darkTheme, lightTheme };
