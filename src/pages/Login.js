import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, Paper, TextField, Button, Typography, Alert,
  IconButton, Tooltip, alpha, useTheme, styled, InputAdornment,
  useMediaQuery, Drawer, List, ListItem, ListItemIcon, ListItemText,
  ListItemButton, Divider
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brightness7 as LightIcon,
  DarkMode as DarkIcon,
  SettingsBrightness as SystemIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  ArrowForward as ArrowIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  ChevronLeft,
  ChevronRight,
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useThemeMode } from '../context/ThemeModeContext';

// Styled components
const GlassPaper = styled(Paper)(({ theme }) => ({
  background: theme.palette.mode === 'dark' 
    ? 'rgba(30, 41, 59, 0.8)' 
    : 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(20px)',
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  borderRadius: 24,
}));

const GradientText = styled(Typography)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
}));

// Carousel slides content
const carouselSlides = [
  {
    emoji: "🚀",
    title: "Lightning Fast",
    subtitle: "Built with modern tech stack for blazing performance",
    gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
  },
  {
    emoji: "🎨",
    title: "Beautiful UI",
    subtitle: "Stunning animations and glassmorphism design",
    gradient: 'linear-gradient(135deg, #ec4899, #f43f5e)',
  },
  {
    emoji: "🌙",
    title: "Dark & Light",
    subtitle: "Automatic theme detection with smooth transitions",
    gradient: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
  },
  {
    emoji: "📱",
    title: "Fully Responsive",
    subtitle: "Perfect experience on any device size",
    gradient: 'linear-gradient(135deg, #10b981, #14b8a6)',
  },
];

// Animation variants
const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

// Theme toggle icon
const ThemeToggleIcon = ({ modePreference }) => {
  switch (modePreference) {
    case 'light': return <LightIcon />;
    case 'dark': return <DarkIcon />;
    default: return <SystemIcon />;
  }
};

// Auto-playing carousel component
const HeroCarousel = () => {
  const [[page, direction], setPage] = useState([0, 0]);
  const [isHovered, setIsHovered] = useState(false);

  const slideIndex = Math.abs(page % carouselSlides.length);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setPage([page + 1, 1]);
    }, 4000);
    return () => clearInterval(timer);
  }, [page, isHovered]);

  const slide = carouselSlides[slideIndex];

  return (
    <Box
      sx={{ position: 'relative', width: '100%', mx: 'auto', height: 320, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Box sx={{ 
        height: 260, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        overflow: 'hidden',
        borderRadius: 4,
      }}>
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={page}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            style={{ width: '100%', textAlign: 'center', padding: '20px', position: 'absolute' }}
          >
            <Typography variant="h1" sx={{ fontSize: { xs: '3rem', md: '4rem' }, mb: 2 }}>
              {slide.emoji}
            </Typography>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 800,
                mb: 2,
                background: slide.gradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: { xs: '1.5rem', md: '2rem' },
              }}
            >
              {slide.title}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: '0.9rem', md: '1rem' } }}>
              {slide.subtitle}
            </Typography>
          </motion.div>
        </AnimatePresence>
      </Box>

      {/* Navigation arrows - dots */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 3 }}>
        {carouselSlides.map((_, index) => (
          <Box
            key={index}
            onClick={() => setPage([index, index > slideIndex ? 1 : -1])}
            sx={{
              width: slideIndex === index ? 24 : 8,
              height: 8,
              borderRadius: 4,
              bgcolor: slideIndex === index ? 'primary.main' : 'divider',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          />
        ))}
      </Box>

      {/* Left/Right Arrow Buttons */}
      <Box sx={{ 
        display: { xs: 'none', md: 'flex' }, 
        justifyContent: 'space-between', 
        position: 'absolute', 
        top: '50%', 
        left: 0, 
        right: 0,
        transform: 'translateY(-50%)',
        px: 1,
        pointerEvents: 'none',
        '& > *': { pointerEvents: 'auto' }
      }}>
        <IconButton 
          onClick={() => setPage([page - 1, -1])}
          sx={{ 
            bgcolor: 'background.paper',
            boxShadow: 2,
            '&:hover': { bgcolor: 'background.paper' }
          }}
        >
          <ChevronLeft />
        </IconButton>
        <IconButton 
          onClick={() => setPage([page + 1, 1])}
          sx={{ 
            bgcolor: 'background.paper',
            boxShadow: 2,
            '&:hover': { bgcolor: 'background.paper' }
          }}
        >
          <ChevronRight />
        </IconButton>
      </Box>
    </Box>
  );
};

const Login = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const { modePreference, toggleMode } = useThemeMode();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Login failed');
    }
    
    setLoading(false);
  };

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      sx={{
        minHeight: '100vh',
        display: 'flex',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated background gradient blobs */}
      <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0 }}>
        <Box
          component={motion.div}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          sx={{
            position: 'absolute',
            top: '-20%',
            left: '-10%',
            width: '50%',
            height: '50%',
            borderRadius: '50%',
            background: alpha(theme.palette.primary.main, 0.15),
            filter: 'blur(60px)',
          }}
        />
        <Box
          component={motion.div}
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [0, -90, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          sx={{
            position: 'absolute',
            bottom: '-20%',
            right: '-10%',
            width: '60%',
            height: '60%',
            borderRadius: '50%',
            background: alpha(theme.palette.secondary.main, 0.15),
            filter: 'blur(80px)',
          }}
        />
      </Box>

      {/* Left side - Carousel (hidden on mobile) */}
      {!isMobile && (
        <Box 
          sx={{ 
            flex: { md: '1 1 50%', lg: '1 1 55%' },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 6,
            zIndex: 1,
            minWidth: 0,
          }}
        >
          <HeroCarousel />
        </Box>
      )}

      {/* Right side - Login form */}
      <Box 
        sx={{ 
          flex: { xs: 1, md: '0 0 45%', lg: '0 0 40%' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 2, sm: 3 },
          zIndex: 1,
        }}
      >
        {/* Theme toggle */}
        <Box sx={{ position: 'absolute', top: { xs: 12, sm: 20 }, right: { xs: 12, sm: 20 } }}>
          <Tooltip title={`Theme: ${modePreference}`}>
            <IconButton 
              onClick={toggleMode}
              sx={{ 
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                backdropFilter: 'blur(10px)',
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.2),
                },
              }}
            >
              <ThemeToggleIcon modePreference={modePreference} />
            </IconButton>
          </Tooltip>
        </Box>

        <GlassPaper 
          component={motion.form}
          variants={stagger}
          initial="hidden"
          animate="visible"
          onSubmit={handleSubmit}
          sx={{ 
            p: { xs: 3, sm: 4 }, 
            width: '100%',
            maxWidth: 400,
            mx: 2,
          }}
        >
          <motion.div variants={fadeInUp}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 800,
                  mb: 1,
                  fontSize: { xs: '1.75rem', sm: '2rem' },
                }}
              >
                🦞 DronePath
              </Typography>
              <GradientText variant="body1" fontWeight={600}>
                Welcome back
              </GradientText>
            </Box>
          </motion.div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
              >
                <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div variants={fadeInUp}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{ 
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                }
              }}
            />
          </motion.div>

          <motion.div variants={fadeInUp}>
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{ 
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                }
              }}
            />
          </motion.div>

          <motion.div variants={fadeInUp}>
            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={loading}
              size="large"
              endIcon={<ArrowIcon />}
              sx={{ 
                py: 1.5,
                borderRadius: 3,
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '1rem',
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <Typography variant="body2" sx={{ mt: 3, textAlign: 'center', color: 'text.secondary' }}>
              Demo: Use any email/password
            </Typography>
          </motion.div>
        </GlassPaper>
      </Box>
    </Box>
  );
};

export default Login;