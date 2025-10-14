"use client";

import { useAnimations } from './theme-context';

// Animation utility functions
export const getTransitionClasses = (type = 'default') => {
  const transitions = {
    default: 'transition-minimal',
    colors: 'transition-colors-minimal',
    shadow: 'transition-shadow-minimal',
    transform: 'transition-transform duration-200 ease-out',
    all: 'transition-all duration-200 ease-out',
  };
  
  return transitions[type] || transitions.default;
};

// Get animation classes based on user preferences
export const getAnimationClasses = (animationType = 'fade') => {
  const animations = {
    fade: 'animate-fade-in',
    slide: 'animate-slide-in',
    pulse: 'animate-pulse-slow',
    none: '',
  };
  
  return animations[animationType] || animations.fade;
};

// Hover effect utilities
export const getHoverClasses = (effect = 'lift') => {
  const effects = {
    lift: 'hover-lift',
    scale: 'hover:scale-105 transition-transform duration-200',
    glow: 'hover:shadow-ocean transition-shadow-minimal',
    none: '',
  };
  
  return effects[effect] || effects.lift;
};

// Custom hook for conditional animations
export const useConditionalAnimation = (animationType = 'fade') => {
  const { shouldAnimate } = useAnimations();
  
  return shouldAnimate ? getAnimationClasses(animationType) : '';
};

// Custom hook for conditional transitions
export const useConditionalTransition = (transitionType = 'default') => {
  const { shouldAnimate } = useAnimations();
  
  return shouldAnimate ? getTransitionClasses(transitionType) : '';
};

// Ocean blue color utilities
export const getOceanColorClass = (shade = 600, property = 'bg') => {
  return `${property}-ocean-${shade}`;
};

export const getOceanGradientClass = (type = 'primary') => {
  const gradients = {
    primary: 'ocean-gradient-primary',
    light: 'ocean-gradient-light',
    subtle: 'ocean-gradient-subtle',
  };
  
  return gradients[type] || gradients.primary;
};

// Status color utilities for AS2 Portal
export const getStatusColorClass = (status, property = 'text') => {
  const statusColors = {
    success: `${property}-green-600 dark:${property}-green-400`,
    warning: `${property}-yellow-600 dark:${property}-yellow-400`,
    error: `${property}-red-600 dark:${property}-red-400`,
    info: `${property}-blue-600 dark:${property}-blue-400`,
    pending: `${property}-gray-600 dark:${property}-gray-400`,
    // AS2 specific statuses
    sending: `${property}-gray-600 dark:${property}-gray-400`,
    sent: `${property}-blue-600 dark:${property}-blue-400`,
    'mdn-received': `${property}-green-600 dark:${property}-green-400`,
    'business-ack': `${property}-green-700 dark:${property}-green-300`,
    failed: `${property}-red-600 dark:${property}-red-400`,
    timeout: `${property}-yellow-600 dark:${property}-yellow-400`,
    rejected: `${property}-orange-600 dark:${property}-orange-400`,
  };
  
  return statusColors[status] || statusColors.pending;
};

// Certificate status utilities
export const getCertStatusClass = (daysUntilExpiry) => {
  if (daysUntilExpiry < 0) {
    return 'cert-status-expired';
  } else if (daysUntilExpiry <= 30) {
    return 'cert-status-expiring';
  } else {
    return 'cert-status-valid';
  }
};

// Loading state utilities
export const getLoadingSkeletonClass = (variant = 'default') => {
  const variants = {
    default: 'loading-skeleton h-4',
    text: 'loading-skeleton h-4 w-3/4',
    title: 'loading-skeleton h-6 w-1/2',
    avatar: 'loading-skeleton h-10 w-10 rounded-full',
    button: 'loading-skeleton h-10 w-24 rounded-md',
    card: 'loading-skeleton h-32 w-full rounded-lg',
  };
  
  return variants[variant] || variants.default;
};

// Form validation state utilities
export const getValidationClasses = (isValid, hasError, isTouched) => {
  if (!isTouched) return '';
  
  if (hasError) {
    return 'border-red-500 focus:border-red-500 focus:ring-red-500';
  }
  
  if (isValid) {
    return 'border-green-500 focus:border-green-500 focus:ring-green-500';
  }
  
  return '';
};

// Responsive animation utilities
export const getResponsiveAnimationClass = (mobile = 'fade', desktop = 'slide') => {
  return `${getAnimationClasses(mobile)} md:${getAnimationClasses(desktop)}`;
};

// Stagger animation utilities for lists
export const getStaggerDelay = (index, baseDelay = 100) => {
  return `${index * baseDelay}ms`;
};

// Animation presets for common UI patterns
export const animationPresets = {
  // Button animations
  button: {
    primary: 'transition-colors-minimal hover:bg-primary/90',
    secondary: 'transition-colors-minimal hover:bg-secondary/80',
    ghost: 'transition-colors-minimal hover:bg-accent hover:text-accent-foreground',
    ocean: 'transition-colors-minimal hover:bg-ocean-700',
  },
  
  // Card animations
  card: {
    static: 'transition-shadow-minimal',
    hoverable: 'hover-lift cursor-pointer',
    interactive: 'hover-lift cursor-pointer transition-colors-minimal hover:bg-accent/50',
  },
  
  // Input animations
  input: {
    default: 'transition-colors-minimal focus:ring-2 focus:ring-ring focus:ring-offset-2',
    ocean: 'transition-colors-minimal focus:ring-2 focus:ring-ocean-600 focus:ring-offset-2',
  },
  
  // Modal/Dialog animations
  modal: {
    overlay: 'animate-fade-in',
    content: 'animate-slide-in',
  },
  
  // Navigation animations
  nav: {
    item: 'transition-colors-minimal hover:bg-accent hover:text-accent-foreground',
    active: 'bg-accent text-accent-foreground',
  },
};

// Export all utilities as a single object for easy importing
export const animationUtils = {
  getTransitionClasses,
  getAnimationClasses,
  getHoverClasses,
  getOceanColorClass,
  getOceanGradientClass,
  getStatusColorClass,
  getCertStatusClass,
  getLoadingSkeletonClass,
  getValidationClasses,
  getResponsiveAnimationClass,
  getStaggerDelay,
  animationPresets,
};