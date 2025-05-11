// components/ThemeToggleButton.tsx
'use client';
import { useContext } from 'react';
import { IconButton } from '@mui/material';
import { LightMode, DarkMode } from '@mui/icons-material';
import { ThemeContext } from './ThemeProviderWrapper';

export default function ThemeToggleButton() {
  const { mode, toggleTheme } = useContext(ThemeContext);

  return (
    <IconButton
      onClick={toggleTheme}
      sx={{
        color: 'text.secondary',
        '&:hover': { color: 'primary.main' },
      }}
      aria-label="Toggle theme"
    >
      {mode === 'light' ? <DarkMode /> : <LightMode />}
    </IconButton>
  );
}
