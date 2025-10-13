'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { 
  Eye, 
  EyeOff, 
  Type, 
  Contrast, 
  Keyboard,
  Volume2,
  VolumeX
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'

// Accessibility context and hooks
export function AccessibilityProvider({ children }) {
  const [settings, setSettings] = useState({
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    screenReader: false,
    keyboardNavigation: true,
    fontSize: 16,
    soundEnabled: true
  })

  useEffect(() => {
    // Load accessibility settings from localStorage
    const savedSettings = localStorage.getItem('accessibility-settings')
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }

    // Apply initial settings
    applyAccessibilitySettings(settings)
  }, [])

  const applyAccessibilitySettings = (newSettings) => {
    const root = document.documentElement

    // High contrast mode
    if (newSettings.highContrast) {
      root.classList.add('high-contrast')
    } else {
      root.classList.remove('high-contrast')
    }

    // Large text
    if (newSettings.largeText) {
      root.classList.add('large-text')
    } else {
      root.classList.remove('large-text')
    }

    // Reduced motion
    if (newSettings.reducedMotion) {
      root.classList.add('reduced-motion')
    } else {
      root.classList.remove('reduced-motion')
    }

    // Font size
    root.style.fontSize = `${newSettings.fontSize}px`

    // Save to localStorage
    localStorage.setItem('accessibility-settings', JSON.stringify(newSettings))
  }

  const updateSetting = (key, value) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    applyAccessibilitySettings(newSettings)
  }

  return (
    <div>
      {children}
      <AccessibilityPanel settings={settings} updateSetting={updateSetting} />
    </div>
  )
}

function AccessibilityPanel({ settings, updateSetting }) {
  const [isOpen, setIsOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-full shadow-lg"
            aria-label="Accessibility options"
          >
            <Eye className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel>Accessibility Options</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <div className="p-4 space-y-4">
            {/* High Contrast */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Contrast className="h-4 w-4" />
                <Label htmlFor="high-contrast">High Contrast</Label>
              </div>
              <Switch
                id="high-contrast"
                checked={settings.highContrast}
                onCheckedChange={(checked) => updateSetting('highContrast', checked)}
              />
            </div>

            {/* Large Text */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Type className="h-4 w-4" />
                <Label htmlFor="large-text">Large Text</Label>
              </div>
              <Switch
                id="large-text"
                checked={settings.largeText}
                onCheckedChange={(checked) => updateSetting('largeText', checked)}
              />
            </div>

            {/* Font Size */}
            <div className="space-y-2">
              <Label>Font Size: {settings.fontSize}px</Label>
              <Slider
                value={[settings.fontSize]}
                onValueChange={([value]) => updateSetting('fontSize', value)}
                min={12}
                max={24}
                step={1}
                className="w-full"
              />
            </div>

            {/* Reduced Motion */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <EyeOff className="h-4 w-4" />
                <Label htmlFor="reduced-motion">Reduce Motion</Label>
              </div>
              <Switch
                id="reduced-motion"
                checked={settings.reducedMotion}
                onCheckedChange={(checked) => updateSetting('reducedMotion', checked)}
              />
            </div>

            {/* Keyboard Navigation */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Keyboard className="h-4 w-4" />
                <Label htmlFor="keyboard-nav">Enhanced Keyboard Navigation</Label>
              </div>
              <Switch
                id="keyboard-nav"
                checked={settings.keyboardNavigation}
                onCheckedChange={(checked) => updateSetting('keyboardNavigation', checked)}
              />
            </div>

            {/* Sound */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {settings.soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                <Label htmlFor="sound">Sound Feedback</Label>
              </div>
              <Switch
                id="sound"
                checked={settings.soundEnabled}
                onCheckedChange={(checked) => updateSetting('soundEnabled', checked)}
              />
            </div>

            <DropdownMenuSeparator />

            {/* Theme Toggle */}
            <div className="space-y-2">
              <Label>Theme</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={theme === 'light' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTheme('light')}
                >
                  Light
                </Button>
                <Button
                  variant={theme === 'dark' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTheme('dark')}
                >
                  Dark
                </Button>
                <Button
                  variant={theme === 'system' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTheme('system')}
                >
                  System
                </Button>
              </div>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

// Skip to content link
export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:shadow-lg"
    >
      Skip to main content
    </a>
  )
}

// Screen reader announcements
export function ScreenReaderAnnouncement({ message, priority = 'polite' }) {
  return (
    <div
      role="status"
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  )
}

// Focus trap for modals
export function FocusTrap({ children, active = true }) {
  useEffect(() => {
    if (!active) return

    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    const handleTabKey = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus()
            e.preventDefault()
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus()
            e.preventDefault()
          }
        }
      }
    }

    document.addEventListener('keydown', handleTabKey)
    firstElement?.focus()

    return () => {
      document.removeEventListener('keydown', handleTabKey)
    }
  }, [active])

  return <>{children}</>
}

// Keyboard navigation helper
export function useKeyboardNavigation() {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Escape key to close modals/dropdowns
      if (e.key === 'Escape') {
        const openDropdowns = document.querySelectorAll('[data-state="open"]')
        openDropdowns.forEach(dropdown => {
          const closeButton = dropdown.querySelector('[aria-label*="close"], [aria-label*="Close"]')
          closeButton?.click()
        })
      }

      // Arrow key navigation for lists
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        const focusedElement = document.activeElement
        if (focusedElement?.getAttribute('role') === 'menuitem' || 
            focusedElement?.closest('[role="menu"]')) {
          e.preventDefault()
          const menuItems = Array.from(
            focusedElement.closest('[role="menu"]')?.querySelectorAll('[role="menuitem"]') || []
          )
          const currentIndex = menuItems.indexOf(focusedElement)
          const nextIndex = e.key === 'ArrowDown' 
            ? (currentIndex + 1) % menuItems.length
            : (currentIndex - 1 + menuItems.length) % menuItems.length
          menuItems[nextIndex]?.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])
}

// High contrast mode styles
export const highContrastStyles = `
  .high-contrast {
    --background: #000000;
    --foreground: #ffffff;
    --card: #000000;
    --card-foreground: #ffffff;
    --popover: #000000;
    --popover-foreground: #ffffff;
    --primary: #ffffff;
    --primary-foreground: #000000;
    --secondary: #333333;
    --secondary-foreground: #ffffff;
    --muted: #333333;
    --muted-foreground: #cccccc;
    --accent: #ffffff;
    --accent-foreground: #000000;
    --destructive: #ff0000;
    --destructive-foreground: #ffffff;
    --border: #ffffff;
    --input: #333333;
    --ring: #ffffff;
  }

  .high-contrast * {
    border-color: #ffffff !important;
  }

  .high-contrast button {
    border: 2px solid #ffffff !important;
  }

  .high-contrast input, .high-contrast textarea, .high-contrast select {
    border: 2px solid #ffffff !important;
    background: #000000 !important;
    color: #ffffff !important;
  }
`

// Large text styles
export const largeTextStyles = `
  .large-text {
    font-size: 18px !important;
  }

  .large-text h1 { font-size: 2.5rem !important; }
  .large-text h2 { font-size: 2rem !important; }
  .large-text h3 { font-size: 1.75rem !important; }
  .large-text h4 { font-size: 1.5rem !important; }
  .large-text h5 { font-size: 1.25rem !important; }
  .large-text h6 { font-size: 1.125rem !important; }
  
  .large-text .text-sm { font-size: 1rem !important; }
  .large-text .text-xs { font-size: 0.875rem !important; }
`

// Reduced motion styles
export const reducedMotionStyles = `
  .reduced-motion *,
  .reduced-motion *::before,
  .reduced-motion *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
`