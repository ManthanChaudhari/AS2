"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({
  theme: 'light',
  oceanBlueVariant: 'primary',
  animationsEnabled: true,
  reducedMotion: false,
  mounted: false,
  setTheme: () => {},
  setOceanBlueVariant: () => {},
  toggleTheme: () => {},
  toggleAnimations: () => {},
  getOceanColor: () => {},
  getOceanGradient: () => {},
});

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Custom hook for ocean blue colors
export const useOceanColors = () => {
  const { oceanBlueVariant, getOceanColor, getOceanGradient } = useTheme();
  
  return {
    variant: oceanBlueVariant,
    primary: getOceanColor(600),
    secondary: getOceanColor(400),
    light: getOceanColor(300),
    accent: getOceanColor(700),
    gradient: {
      primary: getOceanGradient('primary'),
      light: getOceanGradient('light'),
      subtle: getOceanGradient('subtle'),
    },
  };
};

// Custom hook for animation preferences
export const useAnimations = () => {
  const { animationsEnabled, reducedMotion, toggleAnimations } = useTheme();
  
  return {
    enabled: animationsEnabled,
    reducedMotion,
    toggle: toggleAnimations,
    shouldAnimate: animationsEnabled && !reducedMotion,
  };
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [oceanBlueVariant, setOceanBlueVariant] = useState('primary');
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Detect user's reduced motion preference
  useEffect(() => {
    setMounted(true);
    
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    setAnimationsEnabled(!mediaQuery.matches);

    const handleChange = (e) => {
      setReducedMotion(e.matches);
      setAnimationsEnabled(!e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Load theme from localStorage
  useEffect(() => {
    if (!mounted) return;

    const savedTheme = localStorage.getItem('as2-portal-theme');
    const savedVariant = localStorage.getItem('as2-portal-ocean-variant');
    const savedAnimations = localStorage.getItem('as2-portal-animations');

    if (savedTheme) {
      setTheme(savedTheme);
    }
    if (savedVariant) {
      setOceanBlueVariant(savedVariant);
    }
    if (savedAnimations !== null) {
      setAnimationsEnabled(JSON.parse(savedAnimations));
    }
  }, [mounted]);

  // Apply theme to document
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    
    // Apply dark/light theme
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Apply ocean blue variant class
    root.classList.remove('ocean-primary', 'ocean-secondary', 'ocean-light');
    root.classList.add(`ocean-${oceanBlueVariant}`);

    // Apply animation preference
    if (!animationsEnabled || reducedMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }

    // Save to localStorage with prefixed keys
    localStorage.setItem('as2-portal-theme', theme);
    localStorage.setItem('as2-portal-ocean-variant', oceanBlueVariant);
    localStorage.setItem('as2-portal-animations', JSON.stringify(animationsEnabled));
  }, [theme, oceanBlueVariant, animationsEnabled, reducedMotion, mounted]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const toggleAnimations = () => {
    if (!reducedMotion) {
      setAnimationsEnabled(!animationsEnabled);
    }
  };

  // Ocean blue variant helpers
  const getOceanColor = (shade = 600) => {
    const variants = {
      primary: `oklch(0.43 0.20 220)`, // Ocean 600
      secondary: `oklch(0.65 0.18 220)`, // Ocean 400  
      light: `oklch(0.76 0.12 220)`, // Ocean 300
    };
    return variants[oceanBlueVariant] || variants.primary;
  };

  const getOceanGradient = (type = 'primary') => {
    const gradients = {
      primary: 'linear-gradient(135deg, oklch(0.54 0.24 220) 0%, oklch(0.43 0.20 220) 100%)',
      light: 'linear-gradient(135deg, oklch(0.98 0.01 220) 0%, oklch(0.94 0.03 220) 100%)',
      subtle: 'linear-gradient(135deg, oklch(0.86 0.06 220) 0%, oklch(0.76 0.12 220) 100%)',
    };
    return gradients[type] || gradients.primary;
  };

  const value = {
    theme,
    oceanBlueVariant,
    animationsEnabled,
    reducedMotion,
    mounted,
    setTheme,
    setOceanBlueVariant,
    toggleTheme,
    toggleAnimations,
    getOceanColor,
    getOceanGradient,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};