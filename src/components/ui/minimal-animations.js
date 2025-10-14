"use client";

import React from 'react';
import { useAnimations } from '@/lib/theme-context';
import { cn } from '@/lib/utils';

// Minimal button with CSS-only hover effects
export const MinimalButton = React.forwardRef(({ 
  className, 
  variant = 'default',
  size = 'default',
  children, 
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors-minimal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline",
    ocean: "bg-ocean-600 text-white hover:bg-ocean-700",
  };

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  };

  return (
    <button
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

MinimalButton.displayName = "MinimalButton";

// Minimal card with subtle hover effects
export const MinimalCard = React.forwardRef(({ 
  className, 
  hoverable = false,
  children, 
  ...props 
}, ref) => {
  const baseClasses = "rounded-lg border bg-card text-card-foreground shadow-sm";
  const hoverClasses = hoverable ? "hover-lift cursor-pointer" : "";

  return (
    <div
      ref={ref}
      className={cn(baseClasses, hoverClasses, className)}
      {...props}
    >
      {children}
    </div>
  );
});

MinimalCard.displayName = "MinimalCard";

// Minimal input with focus animations
export const MinimalInput = React.forwardRef(({ 
  className, 
  type = "text",
  ...props 
}, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors-minimal",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

MinimalInput.displayName = "MinimalInput";

// Loading skeleton with ocean blue theme
export const LoadingSkeleton = ({ className, ...props }) => {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-ocean-100 dark:bg-ocean-900", className)}
      {...props}
    />
  );
};

// Minimal badge component
export const MinimalBadge = ({ 
  className, 
  variant = 'default',
  children, 
  ...props 
}) => {
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/80",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/80",
    outline: "text-foreground border border-input hover:bg-accent hover:text-accent-foreground",
    ocean: "bg-ocean-600 text-white hover:bg-ocean-700",
    success: "bg-green-600 text-white hover:bg-green-700",
    warning: "bg-yellow-600 text-white hover:bg-yellow-700",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors-minimal focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// Minimal alert component
export const MinimalAlert = React.forwardRef(({ 
  className, 
  variant = 'default',
  children, 
  ...props 
}, ref) => {
  const variants = {
    default: "bg-background text-foreground border-border",
    destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
    ocean: "border-ocean-200 bg-ocean-50 text-ocean-800 dark:border-ocean-800 dark:bg-ocean-950 dark:text-ocean-200",
    success: "border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200",
    warning: "border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-200",
  };

  return (
    <div
      ref={ref}
      role="alert"
      className={cn(
        "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground transition-colors-minimal",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

MinimalAlert.displayName = "MinimalAlert";

// Minimal progress bar
export const MinimalProgress = React.forwardRef(({ 
  className, 
  value = 0,
  max = 100,
  variant = 'default',
  ...props 
}, ref) => {
  const variants = {
    default: "bg-primary",
    ocean: "bg-ocean-600",
    success: "bg-green-600",
    warning: "bg-yellow-600",
    destructive: "bg-destructive",
  };

  return (
    <div
      ref={ref}
      className={cn(
        "relative h-4 w-full overflow-hidden rounded-full bg-secondary transition-colors-minimal",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "h-full w-full flex-1 transition-all duration-300 ease-out",
          variants[variant]
        )}
        style={{ transform: `translateX(-${100 - (value / max) * 100}%)` }}
      />
    </div>
  );
});

MinimalProgress.displayName = "MinimalProgress";

// Minimal tooltip (CSS-only)
export const MinimalTooltip = ({ children, content, className }) => {
  return (
    <div className="group relative inline-block">
      {children}
      <div className={cn(
        "absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 rounded-md bg-popover px-2 py-1 text-xs text-popover-foreground shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none",
        className
      )}>
        {content}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-popover" />
      </div>
    </div>
  );
};

// Minimal spinner
export const MinimalSpinner = ({ className, size = 'default' }) => {
  const sizes = {
    sm: 'h-4 w-4',
    default: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <div className={cn("animate-spin rounded-full border-2 border-current border-t-transparent", sizes[size], className)}>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

// Minimal fade-in wrapper (CSS-only)
export const FadeInWrapper = ({ children, className, delay = 0 }) => {
  return (
    <div 
      className={cn("animate-fade-in", className)}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// Minimal slide-in wrapper (CSS-only)
export const SlideInWrapper = ({ children, className, direction = 'left' }) => {
  const directions = {
    left: 'animate-slide-in',
    right: 'animate-slide-in-right',
    up: 'animate-slide-in-up',
    down: 'animate-slide-in-down',
  };

  return (
    <div className={cn(directions[direction] || directions.left, className)}>
      {children}
    </div>
  );
};