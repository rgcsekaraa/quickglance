// components/LoginModal.tsx
'use client';
import { useContext, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Button,
  Box,
  IconButton,
  Fade,
  Paper,
  Divider,
} from '@mui/material';
import { ThemeContext } from './ThemeProviderWrapper';
import { signInWithGoogle } from '@/utils/supabase/actions';
import CloseIcon from '@mui/icons-material/Close';
// import GoogleIcon from '@mui/icons-material/Google';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { RemoveRedEye } from '@mui/icons-material';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

export default function LoginModal({ open, onClose }: LoginModalProps) {
  const { mode } = useContext(ThemeContext);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async (formData: FormData) => {
    try {
      setIsLoading(true);
      setError(null);
      await signInWithGoogle();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign-in failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      TransitionComponent={Fade}
      TransitionProps={{ timeout: 400 }}
      sx={{
        '& .MuiDialog-paper': {
          bgcolor: 'background.paper',
          borderRadius: 4,
          boxShadow:
            mode === 'light'
              ? '0 16px 50px rgba(0, 0, 0, 0.2), 0 0 30px rgba(25, 118, 210, 0.18)'
              : '0 16px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(66, 165, 245, 0.25)',
          border:
            mode === 'light'
              ? '1px solid rgba(25, 118, 210, 0.3)'
              : '1px solid rgba(66, 165, 245, 0.3)',
          backdropFilter: 'blur(16px)',
          transition:
            'background-color 0.3s, box-shadow 0.3s, border-color 0.3s',
          overflow: 'hidden',
        },
      }}
    >
      {/* Decorative top gradient bar */}
      <Box
        sx={{
          height: '6px',
          width: '100%',
          background:
            mode === 'light'
              ? 'linear-gradient(90deg, #1976d2, #42a5f5, #81d4fa)'
              : 'linear-gradient(90deg, #0d47a1, #1976d2, #42a5f5)',
        }}
      />

      <IconButton
        onClick={onClose}
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          color: 'text.secondary',
          bgcolor:
            mode === 'light'
              ? 'rgba(245, 245, 245, 0.8)'
              : 'rgba(30, 30, 35, 0.8)',
          '&:hover': {
            color: 'primary.main',
            bgcolor:
              mode === 'light'
                ? 'rgba(245, 245, 245, 0.95)'
                : 'rgba(30, 30, 35, 0.95)',
          },
          zIndex: 10,
        }}
        aria-label="Close"
      >
        <CloseIcon />
      </IconButton>

      {/* Logo/Icon Section */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: 5,
          pb: 2,
        }}
      >
        {/* <Paper
          elevation={4}
          sx={{
            width: 70,
            height: 70,
            borderRadius: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background:
              mode === 'light'
                ? 'linear-gradient(135deg, #1976d2, #42a5f5)'
                : 'linear-gradient(135deg, #0d47a1, #1976d2)',
            mb: 2,
          }}
        >
          <RemoveRedEye sx={{ fontSize: 36, color: 'white' }} />
        </Paper> */}

        <DialogTitle
          sx={{
            textAlign: 'center',
            color: 'text.primary',
            fontWeight: 700,
            background:
              mode === 'light'
                ? 'linear-gradient(45deg, #1976d2, #42a5f5)'
                : 'linear-gradient(45deg, #42a5f5, #90caf9)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            py: 1,
            px: 0,
            fontSize: '1.75rem',
          }}
        >
          Welcome Mate!
        </DialogTitle>
      </Box>

      {/* Content */}
      <DialogContent
        sx={{
          py: 3,
          px: { xs: 3, sm: 5 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            mb: 4,
            fontSize: { xs: '0.95rem', sm: '1.05rem' },
            textAlign: 'center',
            maxWidth: '85%',
          }}
        >
          Sign in to access your dashboard.
        </Typography>

        <Box
          component="form"
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Button
            variant="contained"
            size="large"
            formAction={handleGoogleSignIn}
            type="submit"
            disabled={isLoading}
            startIcon={
              <Box
                component="span"
                sx={{ display: 'flex', alignItems: 'center', mr: 1 }}
              >
                <svg
                  width="18"
                  height="18"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                >
                  <path
                    fill="#FFC107"
                    d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                  />
                  <path
                    fill="#FF3D00"
                    d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                  />
                  <path
                    fill="#4CAF50"
                    d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                  />
                  <path
                    fill="#1976D2"
                    d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                  />
                </svg>
              </Box>
            }
            sx={{
              borderRadius: '30px',
              textTransform: 'none',
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              width: '100%',
              maxWidth: '280px',
              background: mode === 'light' ? '#f5f5f5' : '#333333',
              color: mode === 'light' ? '#333333' : '#ffffff',
              border: mode === 'light' ? '1px solid #ccc' : '1px solid #555555',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: mode === 'light' ? '#f5f5f5' : '#333333',
              },
              '&:active': {
                transform: 'scale(0.98)',
              },
            }}
          >
            {isLoading ? 'Signing in...' : 'Continue with Google'}
          </Button>

          {error && (
            <Typography
              variant="body2"
              color="error"
              sx={{
                mt: 3,
                fontSize: '0.9rem',
                textAlign: 'center',
                p: 1.5,
                borderRadius: 2,
                bgcolor: 'rgba(244, 67, 54, 0.1)',
                border: '1px solid rgba(244, 67, 54, 0.3)',
                width: '100%',
                maxWidth: '280px',
              }}
            >
              {error}
            </Typography>
          )}
        </Box>

        <Box sx={{ position: 'relative', width: '100%', mt: 4, mb: 2 }}>
          <Divider
            sx={{
              '&::before, &::after': {
                borderColor:
                  mode === 'light'
                    ? 'rgba(0, 0, 0, 0.12)'
                    : 'rgba(255, 255, 255, 0.12)',
              },
            }}
          >
            <Typography variant="body2" sx={{ px: 1, color: 'text.secondary' }}>
              QuickGlance
            </Typography>
          </Divider>
        </Box>

        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            mt: 1,
            fontSize: '0.8rem',
            textAlign: 'center',
          }}
        >
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </Typography>
      </DialogContent>
    </Dialog>
  );
}
