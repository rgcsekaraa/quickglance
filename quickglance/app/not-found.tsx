'use client';
import { useRouter } from 'next/navigation';
import { Box, Typography, Button, useMediaQuery } from '@mui/material';
import { useContext } from 'react';
import { ThemeContext } from '@/components/ThemeProviderWrapper';

export default function NotFound() {
  const router = useRouter();
  const { mode } = useContext(ThemeContext);
  const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        position: 'relative',
        bgcolor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        px: { xs: 2, md: 4 },
        transition: 'background-color 0.3s',
      }}
    >
      {/* Background gradient overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            mode === 'light'
              ? 'linear-gradient(135deg, rgba(25,118,210,0.1) 0%, rgba(245,245,245,0.9) 100%)'
              : 'linear-gradient(135deg, rgba(25,118,210,0.15) 0%, rgba(10,10,15,0.95) 100%)',
          zIndex: 0,
        }}
      />

      {/* Content */}
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Typography
          variant={isMobile ? 'h3' : 'h1'}
          sx={{
            fontWeight: 900,
            letterSpacing: '-1px',
            mb: 2,
            background:
              mode === 'light'
                ? 'linear-gradient(45deg, #1976d2, #42a5f5)'
                : 'linear-gradient(45deg, #42a5f5, #90caf9)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          404 - Page Not Found
        </Typography>
        <Typography
          variant={isMobile ? 'body1' : 'h5'}
          sx={{
            color: 'text.secondary',
            mb: 4,
            maxWidth: '600px',
            mx: 'auto',
          }}
        >
          Oops! The page you’re looking for doesn’t exist or has been moved.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => router.push('/')}
          sx={{
            borderRadius: '30px',
            textTransform: 'none',
            px: 4,
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 600,
          }}
        >
          Back to Home
        </Button>
      </Box>
    </Box>
  );
}
