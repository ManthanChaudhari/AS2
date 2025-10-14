"use client";

import { motion } from 'framer-motion';
import { useTheme } from '@/lib/theme-context';

// Page transition wrapper with minimal animation
export const PageTransition = ({ children, className = "" }) => {
  const { animationsEnabled } = useTheme();

  if (!animationsEnabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Minimal button animation wrapper
export const AnimatedButton = ({ children, className = "", ...props }) => {
  const { animationsEnabled } = useTheme();

  if (!animationsEnabled) {
    return (
      <button className={`transition-colors-minimal ${className}`} {...props}>
        {children}
      </button>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className={`transition-colors-minimal ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

// Minimal card hover animation
export const AnimatedCard = ({ children, className = "", ...props }) => {
  const { animationsEnabled } = useTheme();

  if (!animationsEnabled) {
    return (
      <div className={`transition-shadow-minimal ${className}`} {...props}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{ 
        y: -2,
        boxShadow: '0 8px 25px oklch(0.43 0.20 220 / 0.15)'
      }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`transition-shadow-minimal ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Fade in animation for content
export const FadeIn = ({ children, delay = 0, className = "" }) => {
  const { animationsEnabled } = useTheme();

  if (!animationsEnabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Slide in animation for sidebars/modals
export const SlideIn = ({ children, direction = 'left', className = "" }) => {
  const { animationsEnabled } = useTheme();

  if (!animationsEnabled) {
    return <div className={className}>{children}</div>;
  }

  const variants = {
    left: { x: -20, opacity: 0 },
    right: { x: 20, opacity: 0 },
    up: { y: -20, opacity: 0 },
    down: { y: 20, opacity: 0 },
  };

  return (
    <motion.div
      initial={variants[direction]}
      animate={{ x: 0, y: 0, opacity: 1 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Loading spinner with ocean blue theme
export const LoadingSpinner = ({ size = 'md', className = "" }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <motion.div
        className="w-full h-full border-2 border-ocean-200 border-t-ocean-600 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
};

// Stagger children animation for lists
export const StaggerContainer = ({ children, className = "" }) => {
  const { animationsEnabled } = useTheme();

  if (!animationsEnabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem = ({ children, className = "" }) => {
  const { animationsEnabled } = useTheme();

  if (!animationsEnabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};