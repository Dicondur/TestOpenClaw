import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const ThemeModeContext = createContext();

// Theme mode options: 'light', 'dark', 'system'
const getSystemPreference = () => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'dark'; // fallback
};

const getStoredPreference = () => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('themeMode');
    // Valid values: 'light', 'dark', 'system'
    if (['light', 'dark', 'system'].includes(stored)) {
      return stored;
    }
  }
  return 'system'; // default to system
};

export const ThemeModeProvider = ({ children }) => {
  const [modePreference, setModePreference] = useState('system');
  const [systemMode, setSystemMode] = useState(getSystemPreference);

  // Load stored preference on mount
  useEffect(() => {
    const stored = getStoredPreference();
    setModePreference(stored);
  }, []);

  // Listen for system preference changes
  useEffect(() => {
    if (!window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      setSystemMode(e.matches ? 'dark' : 'light');
    };

    // Set initial value
    setSystemMode(mediaQuery.matches ? 'dark' : 'light');

    // Listen for changes
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Determine actual mode
  const actualMode = useMemo(() => {
    if (modePreference === 'system') {
      return systemMode;
    }
    return modePreference;
  }, [modePreference, systemMode]);

  // Update preference and save to localStorage
  const setMode = (newMode) => {
    setModePreference(newMode);
    localStorage.setItem('themeMode', newMode);
  };

  // Cycle through modes: system -> light -> dark -> system
  const toggleMode = () => {
    const modes = ['system', 'light', 'dark'];
    const currentIndex = modes.indexOf(modePreference);
    const nextIndex = (currentIndex + 1) % modes.length;
    setMode(modes[nextIndex]);
  };

  const value = useMemo(() => ({
    modePreference, // 'light', 'dark', or 'system'
    actualMode,     // 'light' or 'dark' (resolved)
    setMode,
    toggleMode,
  }), [modePreference, actualMode]);

  return (
    <ThemeModeContext.Provider value={value}>
      {children}
    </ThemeModeContext.Provider>
  );
};

export const useThemeMode = () => {
  const context = useContext(ThemeModeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within a ThemeModeProvider');
  }
  return context;
};

export default ThemeModeContext;