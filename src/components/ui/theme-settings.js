"use client";

import React from 'react';
import { useTheme } from '@/lib/theme-context';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Sun, Moon, Palette, Zap, ZapOff } from 'lucide-react';

export const ThemeSettings = ({ className = "" }) => {
  const {
    theme,
    oceanBlueVariant,
    animationsEnabled,
    reducedMotion,
    toggleTheme,
    setOceanBlueVariant,
    toggleAnimations,
  } = useTheme();

  const oceanVariants = [
    { value: 'primary', label: 'Deep Ocean', description: 'Rich, professional blue' },
    { value: 'secondary', label: 'Ocean Breeze', description: 'Lighter, calming blue' },
    { value: 'light', label: 'Sky Blue', description: 'Soft, gentle blue' },
  ];

  return (
    <Card className={`w-full max-w-md ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5 text-ocean-600" />
          Theme Settings
        </CardTitle>
        <CardDescription>
          Customize your AS2 Portal appearance and animations
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Theme Toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-sm font-medium">Theme Mode</Label>
            <p className="text-xs text-muted-foreground">
              Switch between light and dark mode
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            className="transition-colors-minimal"
          >
            {theme === 'light' ? (
              <>
                <Moon className="h-4 w-4 mr-2" />
                Dark
              </>
            ) : (
              <>
                <Sun className="h-4 w-4 mr-2" />
                Light
              </>
            )}
          </Button>
        </div>

        {/* Ocean Blue Variant */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Ocean Blue Variant</Label>
          <Select value={oceanBlueVariant} onValueChange={setOceanBlueVariant}>
            <SelectTrigger className="transition-colors-minimal">
              <SelectValue placeholder="Select ocean blue variant" />
            </SelectTrigger>
            <SelectContent>
              {oceanVariants.map((variant) => (
                <SelectItem key={variant.value} value={variant.value}>
                  <div className="flex flex-col">
                    <span className="font-medium">{variant.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {variant.description}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Animation Toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-sm font-medium">Animations</Label>
            <p className="text-xs text-muted-foreground">
              {reducedMotion 
                ? 'Disabled due to system preference' 
                : 'Enable smooth transitions and hover effects'
              }
            </p>
          </div>
          <div className="flex items-center gap-2">
            {animationsEnabled ? (
              <Zap className="h-4 w-4 text-ocean-600" />
            ) : (
              <ZapOff className="h-4 w-4 text-muted-foreground" />
            )}
            <Switch
              checked={animationsEnabled}
              onCheckedChange={toggleAnimations}
              disabled={reducedMotion}
            />
          </div>
        </div>

        {/* Color Preview */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Color Preview</Label>
          <div className="grid grid-cols-5 gap-2">
            {[50, 200, 400, 600, 800].map((shade) => (
              <div
                key={shade}
                className={`h-8 rounded border border-border bg-ocean-${shade}`}
                title={`Ocean ${shade}`}
              />
            ))}
          </div>
        </div>

        {/* Reset Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setOceanBlueVariant('primary');
            if (!reducedMotion) {
              toggleAnimations();
            }
          }}
          className="w-full transition-colors-minimal"
        >
          Reset to Defaults
        </Button>
      </CardContent>
    </Card>
  );
};

// Compact theme toggle for headers/toolbars
export const ThemeToggle = ({ className = "" }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className={`transition-colors-minimal ${className}`}
    >
      {theme === 'light' ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

// Ocean variant selector for quick switching
export const OceanVariantSelector = ({ className = "" }) => {
  const { oceanBlueVariant, setOceanBlueVariant } = useTheme();

  const variants = [
    { value: 'primary', color: 'bg-ocean-600', label: 'Deep' },
    { value: 'secondary', color: 'bg-ocean-400', label: 'Breeze' },
    { value: 'light', color: 'bg-ocean-300', label: 'Sky' },
  ];

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {variants.map((variant) => (
        <Button
          key={variant.value}
          variant={oceanBlueVariant === variant.value ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setOceanBlueVariant(variant.value)}
          className="transition-colors-minimal"
        >
          <div className={`w-3 h-3 rounded-full ${variant.color} mr-2`} />
          {variant.label}
        </Button>
      ))}
    </div>
  );
};