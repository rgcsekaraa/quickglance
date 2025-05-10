// 'use client';
// import { useState } from 'react';
// import {
//   Container,
//   Typography,
//   Button,
//   Box,
//   Modal,
//   Paper,
//   IconButton,
// } from '@mui/material';
// import useSupabaseClient from '@supabase/ssr';
// import GoogleIcon from '@mui/icons-material/Google';
// import CloseIcon from '@mui/icons-material/Close';

// export default function Home() {
//   const supabase = useSupabaseClient();
//   const [open, setOpen] = useState(false);

//   const handleOpen = () => setOpen(true);
//   const handleClose = () => setOpen(false);

//   const signInWithGoogle = async () => {
//     try {
//       await supabase.auth.signInWithOAuth({
//         provider: 'google',
//         options: { redirectTo: `${window.location.origin}/auth/callback` },
//       });
//     } catch (error) {
//       console.error('Login error:', error);
//     }
//   };

//   return (
//     <Container
//       maxWidth={false}
//       sx={{
//         minHeight: '100vh',
//         display: 'flex',
//         flexDirection: 'column',
//         justifyContent: 'center',
//         alignItems: 'center',
//         bgcolor: 'background.default',
//         textAlign: 'center',
//         px: 2,
//       }}
//     >
//       <Typography
//         variant="h2"
//         gutterBottom
//         sx={{ color: 'text.primary', fontWeight: 'bold' }}
//       >
//         QuickGlance
//       </Typography>
//       <Typography
//         variant="h5"
//         sx={{ color: 'text.secondary', mb: 4, maxWidth: 600 }}
//       >
//         Your ultimate tool for job preparation. Organize programming topics like
//         JavaScript and TypeScript with ease.
//       </Typography>
//       <Button
//         variant="contained"
//         color="primary"
//         size="large"
//         onClick={handleOpen}
//         sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}
//       >
//         Sign In with Google
//       </Button>

//       {/* Login Modal */}
//       <Modal open={open} onClose={handleClose}>
//         <Paper
//           sx={{
//             position: 'absolute',
//             top: '50%',
//             left: '50%',
//             transform: 'translate(-50%, -50%)',
//             p: 4,
//             minWidth: { xs: 280, sm: 400 },
//             maxWidth: 400,
//             textAlign: 'center',
//             bgcolor: 'background.paper',
//           }}
//         >
//           <IconButton
//             onClick={handleClose}
//             sx={{ position: 'absolute', top: 8, right: 8 }}
//           >
//             <CloseIcon />
//           </IconButton>
//           <Typography variant="h6" gutterBottom sx={{ color: 'text.primary' }}>
//             Sign In to QuickGlance
//           </Typography>
//           <Button
//             variant="outlined"
//             color="secondary"
//             startIcon={<GoogleIcon />}
//             onClick={signInWithGoogle}
//             fullWidth
//             sx={{ mt: 2 }}
//           >
//             Sign In with Google
//           </Button>
//         </Paper>
//       </Modal>
//     </Container>
//   );
// }
'use client';
import { signOut } from '@/utils/supabase/actions';
import React from 'react';

const page = () => {
  return (
    <div>
      <h1> dashboard</h1>
      <p>This is the dashboard page for QuickGlance.</p>
      <h1>Authenticated</h1>
      <p>Welcome to the dashboard! You are authenticated.</p>
      <p>Here you can manage your topics and progress.</p>
      <button onClick={async () => await signOut()} type="submit">
        Sign out
      </button>
    </div>
  );
};

export default page;
