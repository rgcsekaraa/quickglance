// components/ThemeProviderWrapper.tsx
'use client';
import { createContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { darkTheme, lightTheme } from '@/app/styles/theme';

// Define context type
interface ThemeContextType {
  mode: 'light' | 'dark';
  toggleTheme: () => void;
}

// Create context
export const ThemeContext = createContext<ThemeContextType>({
  mode: 'dark',
  toggleTheme: () => {},
});

// Theme provider wrapper component
interface ThemeProviderWrapperProps {
  children: ReactNode;
}

export default function ThemeProviderWrapper({
  children,
}: ThemeProviderWrapperProps) {
  // Initialize mode from localStorage before rendering
  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme === 'light' || savedTheme === 'dark'
        ? savedTheme
        : 'dark';
    }
    return 'dark';
  });

  // Track if component is mounted to prevent hydration mismatch
  const [isMounted, setIsMounted] = useState(false);

  // Set mounted state after initial render
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Update localStorage when mode changes
  useEffect(() => {
    localStorage.setItem('theme', mode);
  }, [mode]);

  // Toggle theme
  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  // Select theme based on mode
  const theme = useMemo(
    () => (mode === 'light' ? lightTheme : darkTheme),
    [mode]
  );

  // Memoize context value
  const contextValue = useMemo(() => ({ mode, toggleTheme }), [mode]);

  // Prevent rendering until mounted to avoid hydration mismatch
  if (!isMounted) {
    return null; // Or a minimal fallback UI
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}
