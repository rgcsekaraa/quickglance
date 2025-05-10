'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark', // Enable dark mode
    primary: {
      main: '#FFD700', // Yellow for buttons, accents
      contrastText: '#000000', // Black text on yellow for readability
    },
    secondary: {
      main: '#FFFFFF', // White for secondary elements
      contrastText: '#121212', // Dark background contrast
    },
    background: {
      default: '#121212', // Black background
      paper: '#1E1E1E', // Slightly lighter for cards, modals
    },
    text: {
      primary: '#FFFFFF', // White for main text
      secondary: '#B0B0B0', // Light gray for secondary text
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
    },
  },
  components: {
    // Customize buttons
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Remove uppercase
          borderRadius: 8, // Rounded corners
          padding: '8px 16px',
        },
        containedPrimary: {
          backgroundColor: '#FFD700', // Yellow button
          color: '#000000', // Black text
          '&:hover': {
            backgroundColor: '#FFC107', // Slightly darker yellow
          },
        },
        outlinedSecondary: {
          borderColor: '#FFFFFF', // White border
          color: '#FFFFFF', // White text
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)', // Subtle hover effect
          },
        },
      },
    },
    // Customize modals
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#1E1E1E', // Darker modal background
          color: '#FFFFFF', // White text
          borderRadius: 12,
        },
      },
    },
    // Customize text fields
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#B0B0B0', // Gray border
            },
            '&:hover fieldset': {
              borderColor: '#FFD700', // Yellow on hover
            },
            '&.Mui-focused fieldset': {
              borderColor: '#FFD700', // Yellow when focused
            },
          },
          '& .MuiInputBase-input': {
            color: '#FFFFFF', // White text
          },
        },
      },
    },
  },
});

export default theme;
