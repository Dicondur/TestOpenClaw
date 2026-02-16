import React, { useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeModeProvider, useThemeMode } from './context/ThemeModeContext';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Items from './pages/Items';

// Components
import Layout from './components/Layout';

// Create theme based on mode
const useAppTheme = (mode) => {
  return useMemo(() => createTheme({
    palette: {
      mode,
      ...(mode === 'light' ? {
        primary: { main: '#7c3aed', light: '#a78bfa', dark: '#5b21b6' }, // Violet
        secondary: { main: '#f43f5e', light: '#fb7185', dark: '#e11d48' }, // Rose/Coral
        error: { main: '#ef4444' },
        warning: { main: '#f59e0b' },
        info: { main: '#0ea5e9' },
        success: { main: '#10b981' },
        background: {
          default: '#fafafa',
          paper: '#ffffff',
        },
        text: {
          primary: '#18181b',
          secondary: '#71717a',
        },
      } : {
        primary: { main: '#a78bfa', light: '#c4b5fd', dark: '#7c3aed' }, // Light violet
        secondary: { main: '#fb7185', light: '#fda4af', dark: '#f43f5e' }, // Light rose
        error: { main: '#f87171' },
        warning: { main: '#fbbf24' },
        info: { main: '#38bdf8' },
        success: { main: '#34d399' },
        background: {
          default: '#09090b',
          paper: '#18181b',
        },
        text: {
          primary: '#fafafa',
          secondary: '#a1a1aa',
        },
      }),
      // Gradient primary for accents
      gradient: {
        primary: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
        secondary: 'linear-gradient(135deg, #f43f5e 0%, #fb7185 100%)',
      },
    },
    typography: {
      fontFamily: '"Plus Jakarta Sans", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: { fontWeight: 800 },
      h2: { fontWeight: 700 },
      h3: { fontWeight: 700 },
      h4: { fontWeight: 700 },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
    },
    shape: {
      borderRadius: 16,
    },
    shadows: [
      'none',
      '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      '0 10px 15px -3px rgb(0 0 0 / 0.1)',
      '0 20px 25px -5px rgb(0 0 0 / 0.1)',
      '0 25px 50px -12px rgb(0 0 0 / 0.25)',
      ...Array(19).fill('0 25px 50px -12px rgb(0 0 0 / 0.25)'),
    ],
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 12,
            padding: '10px 20px',
          },
          contained: {
            boxShadow: '0 4px 14px 0 rgb(124 58 237 / 0.39)',
            '&:hover': {
              boxShadow: '0 6px 20px rgb(124 58 237 / 0.23)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 20,
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 12,
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 500,
          },
        },
      },
    },
  }), [mode]);
};

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  
  return children;
};

const ThemedApp = () => {
  const { actualMode } = useThemeMode();
  const theme = useAppTheme(actualMode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="items" element={<Items />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

function App() {
  return (
    <ThemeModeProvider>
      <ThemedApp />
    </ThemeModeProvider>
  );
}

export default App;