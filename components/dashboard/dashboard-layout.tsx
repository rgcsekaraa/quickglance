'use client';

import { useState, useEffect, useContext } from 'react';
import type React from 'react';
import {
  AppBar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  Toolbar,
  Typography,
  Avatar,
  useTheme,
  useMediaQuery,
  Menu,
  MenuItem,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';
import CategoryTree from '@/components/dashboard/category-tree';
import { createClient } from '@/utils/supabase/client';
import { ThemeContext } from '@/components/ThemeProviderWrapper';
import type { Category } from '@/components/dashboard/category-tree';
import { categoriesData as defaultCategoriesData } from '@/lib/dummy-data';

const drawerWidth = 280;

interface DashboardLayoutProps {
  children: React.ReactNode;
  categoriesData?: Category[];
  onEditCategory?: (id: string, newName: string) => void;
  onDeleteCategory?: (id: string) => void;
  onAddSubcategory?: (parentId: string, name: string) => void;
}

export default function DashboardLayout({
  children,
  categoriesData = defaultCategoriesData,
  onEditCategory,
  onDeleteCategory,
  onAddSubcategory,
}: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [userName, setUserName] = useState<string>('User');
  const [avatarInitial, setAvatarInitial] = useState<string>('U');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Use ThemeContext for theme management
  const { mode, toggleTheme } = useContext(ThemeContext);

  // Initialize Supabase client
  const supabase = createClient();

  // Fetch user data and listen for auth state changes
  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        console.error('Error fetching user:', error);
        setUserName('Guest');
        setAvatarInitial('G');
        window.location.href = '/'; // Align with middleware
        return;
      }

      // Extract user data from Google SSO metadata
      const fullName =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.user_metadata?.given_name ||
        user.email?.split('@')[0] ||
        'User';
      setUserName(fullName);
      setAvatarInitial(fullName.charAt(0).toUpperCase());
    };

    fetchUserData();

    // Subscribe to auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT') {
          window.location.href = '/';
        } else if (event === 'SIGNED_IN' && session?.user) {
          const fullName =
            session.user.user_metadata?.full_name ||
            session.user.user_metadata?.name ||
            session.user.user_metadata?.given_name ||
            session.user.email?.split('@')[0] ||
            'User';
          setUserName(fullName);
          setAvatarInitial(fullName.charAt(0).toUpperCase());
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  // Handle logout
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error);
    } else {
      window.location.href = '/';
    }
    handleProfileMenuClose();
  };

  // Count total categories including subcategories (unchanged)
  const countAllCategories = (cats: Category[]): number => {
    let count = cats.length;
    for (const cat of cats) {
      if (cat.subcategories && cat.subcategories.length > 0) {
        count += countAllCategories(cat.subcategories);
      }
    }
    return count;
  };

  const totalCategoriesCount = countAllCategories(categoriesData);

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img
            src="logo.png"
            alt="QuickGlance logo"
            style={{ height: '40px' }}
          />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              color: 'primary.main',
              letterSpacing: '-0.5px',
            }}
          >
            QuickGlance
          </Typography>
        </Box>
      </Toolbar>
      <Divider />
      <List sx={{ flexGrow: 1, px: 2 }}>
        <ListItem disablePadding>
          <ListItemButton selected>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>
        <CategoryTree
          categories={categoriesData}
          totalCount={totalCategoriesCount}
          onEditCategory={onEditCategory}
          onDeleteCategory={onDeleteCategory}
          onAddSubcategory={onAddSubcategory}
        />
      </List>
      <Divider />
      <List>
        <ListItem>
          <FormControlLabel
            control={
              <Switch
                checked={mode === 'dark'}
                onChange={toggleTheme}
                color="primary"
              />
            }
            label={mode === 'dark' ? 'Dark Mode' : 'Light Mode'}
          />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box
      sx={{
        display: 'flex',
        bgcolor: 'background.default',
        minHeight: '100vh',
      }}
    >
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          boxShadow: 'none',
          backdropFilter: 'blur(10px)',
          backgroundColor: 'background.paper',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          {userName !== 'User' && (
            <Typography variant="body1" color="text.secondary" sx={{ mr: 2 }}>
              Logged in as: <span style={{ fontWeight: 800 }}>{userName}</span>
            </Typography>
          )}
          <IconButton onClick={handleProfileMenuOpen} color="inherit">
            <Avatar sx={{ width: 32, height: 32 }}>{avatarInitial}</Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: '64px',
        }}
      >
        <>{children}</>
      </Box>
    </Box>
  );
}

import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
