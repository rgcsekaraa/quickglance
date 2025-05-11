// app/page.tsx
'use client';
import { useRouter } from 'next/navigation';
import {
  Typography,
  Button,
  Box,
  Grid,
  Paper,
  useMediaQuery,
} from '@mui/material';
import { Code, Dashboard, Speed } from '@mui/icons-material';
import { useContext } from 'react';
import ThemeToggleButton from '@/components/ThemeToggleButton';
import { ThemeContext } from '@/components/ThemeProviderWrapper';

export default function Home() {
  const router = useRouter();
  const { mode } = useContext(ThemeContext);
  const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));

  // Features for the landing page
  const features = [
    {
      icon: <Code sx={{ fontSize: 32, color: 'primary.main' }} />,
      title: 'Flexible Categorization',
      description:
        'Build unlimited categories, subcategories, and nested structures to organize your notes and prep materials.',
    },
    {
      icon: <Dashboard sx={{ fontSize: 32, color: 'primary.main' }} />,
      title: 'Question & Answer Hub',
      description:
        'Create, store, and manage questions with answers for self-analysis, interviews, or study notes.',
    },
    {
      icon: <Speed sx={{ fontSize: 32, color: 'primary.main' }} />,
      title: 'Rapid Review',
      description:
        'Quickly revisit your prepared answers and notes with an intuitive, streamlined interface.',
    },
  ];

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

      {/* Enhanced Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: { xs: 2, md: 4 },
          py: 2,
          position: 'relative',
          zIndex: 2,
          bgcolor: 'background.paper',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          borderBottom: '1px solid',
          borderColor:
            mode === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.08)',
          transition: 'background-color 0.3s, border-color 0.3s',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              color: 'primary.main',
              letterSpacing: '-0.5px',
            }}
          >
            QuickGlance
          </Typography>
        </Box>
        <Box
          sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2 } }}
        >
          {!isMobile && <Box sx={{ display: 'flex', gap: 3, mr: 2 }}></Box>}
          <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={() => router.push('/auth')}
            sx={{
              borderRadius: '20px',
              textTransform: 'none',
              px: 2,
              display: { xs: 'none', sm: 'inline-flex' },
            }}
          >
            Sign In
          </Button>
          <ThemeToggleButton />
        </Box>
      </Box>

      {/* Main Content Area */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          position: 'relative',
          zIndex: 1,
          px: { xs: 2, md: 6 },
          bgcolor: 'background.default',
          transition: 'background-color 0.3s',
        }}
      >
        {/* Left Content - Hero Text */}
        <Box
          sx={{
            width: { xs: '100%', md: '50%' },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            pr: { md: 4 },
            zIndex: 2,
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontWeight: 900,
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
              letterSpacing: '-1px',
              mb: 2,
              background:
                mode === 'light'
                  ? 'linear-gradient(45deg, #1976d2, #42a5f5)'
                  : 'linear-gradient(45deg, #42a5f5, #90caf9)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1.1,
            }}
          >
            Organize. Prepare. Review.
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: 'text.secondary',
              mb: 4,
              fontWeight: 400,
              maxWidth: '600px',
            }}
          >
            Create structured categories and Q&A sets for self-analysis,
            interview prep, or note-taking. Review your answers instantly for
            confident preparation.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => router.push('/auth')}
              sx={{
                borderRadius: '30px',
                textTransform: 'none',
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
              }}
            >
              Get Started
            </Button>
          </Box>
        </Box>

        {/* Right Content - Feature Cards (only visible on larger screens) */}
        {!isMobile && (
          <Box
            sx={{
              width: '50%',
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Grid
              container
              spacing={2}
              sx={{
                transform: 'perspective(1000px) rotateY(-10deg) rotateX(5deg)',
                transformStyle: 'preserve-3d',
              }}
            >
              {features.map((feature, index) => (
                <Grid item xs={12} key={index}>
                  <Paper
                    elevation={6}
                    sx={{
                      p: 3,
                      transform: `translateZ(${(index + 1) * 10}px)`,
                      transition:
                        'transform 0.3s ease-in-out, background-color 0.3s, box-shadow 0.3s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      bgcolor: 'background.paper',
                    }}
                  >
                    <Box
                      sx={{
                        bgcolor:
                          mode === 'light'
                            ? 'rgba(25,118,210,0.1)'
                            : 'rgba(66, 165, 245, 0.2)',
                        p: 1.5,
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow:
                          mode === 'light'
                            ? '0 0 15px rgba(25,118,210,0.2)'
                            : '0 0 15px rgba(66, 165, 245, 0.2)',
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          mb: 0.5,
                          color: 'text.primary',
                        }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: 'text.secondary' }}
                      >
                        {feature.description}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Box>

      {/* Bottom area with feature highlights - Mobile only */}
      {isMobile && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 3,
            pb: 4,
            px: 2,
            bgcolor: 'background.default',
            transition: 'background-color 0.3s',
          }}
        >
          {features.map((feature, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  bgcolor:
                    mode === 'light'
                      ? 'rgba(25,118,210,0.1)'
                      : 'rgba(66, 165, 245, 0.2)',
                  p: 1,
                  borderRadius: '50%',
                  mb: 1,
                  display: 'flex',
                  boxShadow:
                    mode === 'light'
                      ? '0 0 15px rgba(25,118,210,0.2)'
                      : '0 0 15px rgba(66, 165, 245, 0.2)',
                }}
              >
                {feature.icon}
              </Box>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 600,
                  textAlign: 'center',
                  color: 'text.primary',
                }}
              >
                {feature.title}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      {/* Footer */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          borderTop: '1px solid',
          borderColor:
            mode === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.08)',
          bgcolor: 'background.paper',
          backdropFilter: 'blur(5px)',
          transition: 'background-color 0.3s, border-color 0.3s',
        }}
      >
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          © {new Date().getFullYear()} QuickGlance
        </Typography>
        {!isMobile && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Terms
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Privacy
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Contact
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
