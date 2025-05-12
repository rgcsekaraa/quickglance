// components/ThemeProviderWrapper.tsx
'use client';
import { createContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { darkTheme, lightTheme } from '@/app/styles/theme';

// Define context type
interface ThemeContextType {
  mode: 'light' | 'dark';
  toggleTheme: () => void;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

// Create context
export const ThemeContext = createContext<ThemeContextType>({
  mode: 'dark',
  toggleTheme: () => {},
  isLoginModalOpen: false,
  openLoginModal: () => {},
  closeLoginModal: () => {},
});

// Theme provider wrapper component
interface ThemeProviderWrapperProps {
  children: ReactNode;
}

export default function ThemeProviderWrapper({
  children,
}: ThemeProviderWrapperProps) {
  // Theme mode state
  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme === 'light' || savedTheme === 'dark'
        ? savedTheme
        : 'dark';
    }
    return 'dark';
  });

  // Login modal state
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

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

  // Open/close login modal
  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  // Select theme based on mode
  const theme = useMemo(
    () => (mode === 'light' ? lightTheme : darkTheme),
    [mode]
  );

  // Memoize context value
  const contextValue = useMemo(
    () => ({
      mode,
      toggleTheme,
      isLoginModalOpen,
      openLoginModal,
      closeLoginModal,
    }),
    [mode, isLoginModalOpen]
  );

  // Prevent rendering until mounted to avoid hydration mismatch
  if (!isMounted) {
    return null;
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
