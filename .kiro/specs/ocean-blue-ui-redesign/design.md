# Design Document

## Overview

The Ocean Blue UI Redesign will transform the AS2 Pharmacovigilance Portal into a modern, visually appealing, and user-friendly application. The design leverages the existing Next.js 15, Tailwind CSS 4, Radix UI, and Framer Motion stack to implement a cohesive ocean blue theme with smooth animations and improved user experience across all components.

The design maintains all existing functionality while introducing:
- A calming ocean blue color palette with proper accessibility
- Modern iconography using Lucide React icons
- Smooth animations and micro-interactions via Framer Motion
- Enhanced layouts with better visual hierarchy
- Responsive design optimizations
- Improved authentication flow design

## Architecture

### Design System Foundation

**Color Palette**
```css
/* Primary Ocean Blue Colors */
--ocean-primary: #0077BE;     /* Deep ocean blue */
--ocean-secondary: #4A90E2;   /* Medium ocean blue */
--ocean-light: #87CEEB;       /* Light sky blue */
--ocean-accent: #005A8B;      /* Darker accent */

/* Neutral Colors */
--neutral-white: #FFFFFF;
--neutral-50: #F8F9FA;
--neutral-100: #E9ECEF;
--neutral-200: #DEE2E6;
--neutral-300: #CED4DA;

/* Semantic Colors */
--success: #10B981;           /* Ocean-friendly green */
--warning: #F59E0B;           /* Warm amber */
--error: #EF4444;             /* Clear red */
--info: #3B82F6;              /* Complementary blue */
```

**Typography Scale**
```css
/* Font Sizes */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */

/* Line Heights */
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.625;
```

**Spacing System**
```css
/* Consistent spacing scale */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-12: 3rem;     /* 48px */
```

### Animation System

**Transition Durations**
```css
--duration-fast: 150ms;
--duration-normal: 200ms;
--duration-slow: 300ms;
--duration-slower: 500ms;
```

**Easing Functions**
```css
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

## Components and Interfaces

### 1. Theme Configuration

**Tailwind CSS Configuration Enhancement**
```javascript
// tailwind.config.js additions
module.exports = {
  theme: {
    extend: {
      colors: {
        ocean: {
          50: '#F0F9FF',
          100: '#E0F2FE', 
          200: '#BAE6FD',
          300: '#87CEEB',
          400: '#4A90E2',
          500: '#0077BE',
          600: '#005A8B',
          700: '#0C4A6E',
          800: '#075985',
          900: '#0C4A6E',
        }
      },
      animation: {
        'fade-in': 'fadeIn 300ms ease-out',
        'slide-in': 'slideIn 200ms ease-out',
        'scale-in': 'scaleIn 150ms ease-out',
      }
    }
  }
}
```

### 2. Enhanced Authentication Pages

**Login Page Enhancements**
- Ocean blue gradient background with subtle wave pattern
- Centered card layout with enhanced shadows
- Floating label animations for form inputs
- Loading button states with ocean-themed spinners
- Improved error state styling with smooth transitions

**Registration Wizard Improvements**
- Progress indicator with ocean blue theming
- Step-by-step cards with smooth transitions
- Enhanced form validation with inline feedback
- Success state with celebration micro-animation

### 3. Dashboard Layout System

**Main Layout Structure**
```jsx
<div className="min-h-screen bg-gradient-to-br from-ocean-50 to-neutral-50">
  <Sidebar />
  <MainContent>
    <Header />
    <PageContent />
  </MainContent>
</div>
```

**Sidebar Navigation**
- Ocean blue accent colors for active states
- Smooth hover animations with scale effects
- Icon integration with consistent sizing
- Collapsible functionality with smooth transitions

**Dashboard Cards**
- Subtle shadow system: `shadow-sm hover:shadow-md transition-shadow`
- Ocean blue accent borders for important metrics
- Hover effects with gentle lift animations
- Loading skeleton states with ocean-themed shimmer

### 4. Icon System Integration

**Icon Categories and Usage**
```jsx
// Navigation Icons
import { 
  LayoutDashboard,    // Dashboard
  Users,              // Partners
  Shield,             // Certificates
  FileText,           // Files
  Settings,           // Admin
  BarChart3,          // Reports
  Bell,               // Notifications
  HelpCircle          // Help
} from 'lucide-react';

// Action Icons
import {
  Plus,               // Add/Create
  Edit,               // Edit
  Trash2,             // Delete
  Download,           // Download
  Upload,             // Upload
  Send,               // Send
  Eye,                // View
  Search              // Search
} from 'lucide-react';

// Status Icons
import {
  CheckCircle,        // Success
  AlertTriangle,      // Warning
  XCircle,            // Error
  Clock,              // Pending
  Loader2             // Loading
} from 'lucide-react';
```

### 5. Animation Components

**Page Transition Wrapper**
```jsx
import { motion } from 'framer-motion';

const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
);
```

**Button Hover Effects**
```jsx
const AnimatedButton = ({ children, ...props }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    transition={{ duration: 0.15 }}
    {...props}
  >
    {children}
  </motion.button>
);
```

**Card Hover Animations**
```jsx
const AnimatedCard = ({ children, ...props }) => (
  <motion.div
    whileHover={{ 
      y: -2,
      boxShadow: '0 10px 25px rgba(0, 119, 190, 0.1)'
    }}
    transition={{ duration: 0.2 }}
    {...props}
  >
    {children}
  </motion.div>
);
```

## Data Models

### Theme Context
```typescript
interface ThemeContextType {
  theme: 'light' | 'dark';
  oceanBlueVariant: 'primary' | 'secondary' | 'light';
  animationsEnabled: boolean;
  toggleAnimations: () => void;
}
```

### Animation Preferences
```typescript
interface AnimationPreferences {
  reducedMotion: boolean;
  transitionDuration: 'fast' | 'normal' | 'slow';
  enableMicroInteractions: boolean;
}
```

### Component Variants
```typescript
interface ComponentVariants {
  button: {
    ocean: string;
    oceanSecondary: string;
    oceanOutline: string;
  };
  card: {
    elevated: string;
    flat: string;
    interactive: string;
  };
  input: {
    ocean: string;
    floating: string;
  };
}
```

## Error Handling

### Animation Error Boundaries
- Graceful fallbacks when animations fail
- Respect user's `prefers-reduced-motion` settings
- Fallback to CSS transitions when Framer Motion fails

### Theme Loading States
- Skeleton loaders with ocean blue shimmer effects
- Progressive enhancement for theme application
- Fallback to system colors during theme loading

### Accessibility Error Prevention
- Automatic contrast ratio validation
- Focus trap management for modals
- Screen reader announcements for dynamic content

## Testing Strategy

### Visual Regression Testing
```javascript
// Example test structure
describe('Ocean Blue Theme', () => {
  test('maintains proper contrast ratios', () => {
    // Test WCAG AA compliance
  });
  
  test('animations respect reduced motion', () => {
    // Test prefers-reduced-motion handling
  });
  
  test('responsive layouts work across breakpoints', () => {
    // Test mobile, tablet, desktop layouts
  });
});
```

### Animation Testing
- Performance testing for 60fps animations
- Interaction testing for hover/focus states
- Accessibility testing for animation preferences

### Component Integration Testing
- Theme consistency across all components
- Icon rendering and accessibility
- Form validation with new styling

### Cross-Browser Compatibility
- CSS Grid and Flexbox fallbacks
- Animation performance across browsers
- Color rendering consistency

## Implementation Phases

### Phase 1: Foundation
1. Update Tailwind configuration with ocean blue palette
2. Create base animation utilities and components
3. Implement theme context and preferences system

### Phase 2: Authentication Enhancement
1. Redesign login page with ocean blue theme
2. Enhance registration wizard with animations
3. Add loading states and micro-interactions

### Phase 3: Dashboard Transformation
1. Update main layout with new color scheme
2. Enhance sidebar navigation with icons and animations
3. Redesign dashboard cards and widgets

### Phase 4: Component Library Update
1. Update all Radix UI components with ocean theme
2. Add consistent iconography throughout
3. Implement hover and focus animations

### Phase 5: Responsive Optimization
1. Enhance mobile layouts
2. Optimize tablet experience
3. Test and refine across all breakpoints

### Phase 6: Accessibility & Polish
1. Comprehensive accessibility audit
2. Performance optimization for animations
3. Final visual polish and consistency check

## Performance Considerations

### Animation Performance
- Use `transform` and `opacity` for smooth animations
- Implement `will-change` property judiciously
- Lazy load Framer Motion components when possible

### Bundle Size Optimization
- Tree-shake unused Lucide icons
- Optimize Framer Motion imports
- Use CSS animations for simple transitions

### Loading Performance
- Progressive theme application
- Skeleton loaders for better perceived performance
- Optimize image assets and gradients

## Accessibility Compliance

### WCAG 2.1 AA Standards
- Minimum contrast ratio of 4.5:1 for normal text
- Minimum contrast ratio of 3:1 for large text
- Focus indicators with 3:1 contrast ratio

### Motion Accessibility
- Respect `prefers-reduced-motion: reduce`
- Provide alternative feedback for animations
- Ensure functionality without animations

### Screen Reader Support
- Proper ARIA labels for all interactive elements
- Semantic HTML structure maintenance
- Live region announcements for dynamic content