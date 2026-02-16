import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, Drawer, AppBar, Toolbar, List, Typography, 
  ListItem, ListItemButton, ListItemIcon, ListItemText,
  IconButton, Tooltip, useTheme, alpha, Avatar, Menu, MenuItem,
  useMediaQuery, Divider, Badge
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Dashboard as DashboardIcon, 
  Inventory as ItemsIcon, 
  Logout as LogoutIcon,
  Brightness7 as LightIcon,
  DarkMode as DarkIcon,
  SettingsBrightness as SystemIcon,
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  ChevronLeft as ChevronLeftIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useThemeMode } from '../context/ThemeModeContext';

// Theme toggle icon
const ThemeToggleIcon = ({ modePreference }) => {
  switch (modePreference) {
    case 'light': return <LightIcon />;
    case 'dark': return <DarkIcon />;
    default: return <SystemIcon />;
  }
};

// Get tooltip text
const getThemeTooltip = (modePreference) => {
  switch (modePreference) {
    case 'light': return 'Light mode';
    case 'dark': return 'Dark mode';
    default: return 'System mode';
  }
};

const Layout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { modePreference, toggleMode } = useThemeMode();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    setAnchorEl(null);
    logout();
    navigate('/login');
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Items', icon: <ItemsIcon />, path: '/items' },
  ];

  const drawerWidth = 280;

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo area */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>🦞</Typography>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>DronePath</Typography>
        </Box>
        {isMobile && (
          <IconButton onClick={handleDrawerToggle}>
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Box>
      
      <Divider sx={{ mx: 2 }} />
      
      {/* Navigation */}
      <List sx={{ flex: 1, px: 1.5, py: 2 }}>
        {menuItems.map((item, index) => (
          <motion.div
            key={item.text}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ListItem disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton 
                selected={location.pathname === item.path}
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) handleDrawerToggle();
                }}
                component={motion.div}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                sx={{
                  borderRadius: 3,
                  mx: 1,
                  '&.Mui-selected': {
                    bgcolor: alpha(theme.palette.primary.main, 0.15),
                    color: theme.palette.primary.main,
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.2),
                    },
                    '& .MuiListItemIcon-root': {
                      color: theme.palette.primary.main,
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 44 }}>{item.icon}</ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ fontWeight: 500 }}
                />
              </ListItemButton>
            </ListItem>
          </motion.div>
        ))}
      </List>
      
      {/* Theme info at bottom */}
      <Box sx={{ p: 2, mx: 2, mb: 2, borderRadius: 3,
        bgcolor: alpha(theme.palette.primary.main, 0.1),
      }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
          Theme
        </Typography>
        <Typography variant="body2" fontWeight={600} sx={{ textTransform: 'capitalize' }}>
          {modePreference}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: theme.palette.mode === 'dark' 
            ? alpha(theme.palette.background.paper, 0.8)
            : alpha('#fff', 0.9),
          color: theme.palette.text.primary,
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }}>
          {/* Menu button - mobile only */}
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, display: { xs: 'none', sm: 'block' } }}>
              🦞
            </Typography>
            <Typography variant="h6" noWrap sx={{ fontWeight: 700, display: { xs: 'none', sm: 'block' } }}>
              DronePath
            </Typography>
          </Box>
          
          <Box sx={{ flexGrow: 1 }} />
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0, sm: 1 } }}>
            <Tooltip title="Notifications">
              <IconButton color="inherit" sx={{ display: { xs: 'none', sm: 'flex' } }}>
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            
            <Tooltip title={getThemeTooltip(modePreference)}>
              <IconButton 
                onClick={toggleMode}
                sx={{ 
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.2),
                  },
                }}
              >
                <ThemeToggleIcon modePreference={modePreference} />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Profile">
              <IconButton 
                onClick={(e) => setAnchorEl(e.currentTarget)}
                sx={{ ml: { xs: 0, sm: 1 } }}
              >
                <Avatar 
                  sx={{ 
                    width: { xs: 32, sm: 36 }, 
                    height: { xs: 32, sm: 36 },
                    bgcolor: theme.palette.primary.main,
                    fontSize: { xs: '0.8rem', sm: '0.9rem' },
                    fontWeight: 600,
                  }}
                >
                  {user?.email?.[0]?.toUpperCase() || 'U'}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 180,
                borderRadius: 2,
                boxShadow: theme.shadows[8],
              }
            }}
          >
            <MenuItem disabled>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                {user?.email}
              </Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      
      {/* Sidebar - desktop */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              bgcolor: theme.palette.mode === 'dark'
                ? alpha(theme.palette.background.paper, 0.5)
                : alpha('#fff', 0.5),
              backdropFilter: 'blur(20px)',
            },
          }}
        >
          <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }} />
          {drawerContent}
        </Drawer>
      )}
      
      {/* Sidebar - mobile drawer */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width: 280,
              boxSizing: 'border-box',
              borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              bgcolor: theme.palette.mode === 'dark'
                ? alpha(theme.palette.background.paper, 0.95)
                : alpha('#fff', 0.95),
              backdropFilter: 'blur(20px)',
            },
          }}
        >
          <Toolbar sx={{ minHeight: 56 }} />
          {drawerContent}
        </Drawer>
      )}
      
      {/* Main Content */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          minHeight: '100vh',
          bgcolor: theme.palette.mode === 'dark'
            ? alpha(theme.palette.background.default, 0.5)
            : alpha(theme.palette.background.default, 0.3),
          width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }} />
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;