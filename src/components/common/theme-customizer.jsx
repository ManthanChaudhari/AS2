'use client'

import { useState } from 'react'
import { useTheme } from 'next-themes'
import { 
  Palette, 
  Sun, 
  Moon, 
  Monitor,
  Upload,
  Download,
  RotateCcw,
  Check
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

// AS2 Portal theme presets
const themePresets = [
  {
    id: 'default',
    name: 'AS2 Default',
    description: 'Standard AS2 Portal theme',
    colors: {
      primary: '#3b82f6',
      secondary: '#64748b',
      accent: '#8b5cf6',
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444'
    }
  },
  {
    id: 'pharmaceutical',
    name: 'Pharmaceutical Blue',
    description: 'Professional pharmaceutical industry theme',
    colors: {
      primary: '#1e40af',
      secondary: '#475569',
      accent: '#0ea5e9',
      success: '#059669',
      warning: '#d97706',
      error: '#dc2626'
    }
  },
  {
    id: 'regulatory',
    name: 'Regulatory Green',
    description: 'Government and regulatory theme',
    colors: {
      primary: '#16a34a',
      secondary: '#6b7280',
      accent: '#0d9488',
      success: '#15803d',
      warning: '#ca8a04',
      error: '#b91c1c'
    }
  },
  {
    id: 'corporate',
    name: 'Corporate Purple',
    description: 'Modern corporate theme',
    colors: {
      primary: '#7c3aed',
      secondary: '#64748b',
      accent: '#c026d3',
      success: '#16a34a',
      warning: '#ea580c',
      error: '#dc2626'
    }
  }
]

// Organization branding options
const brandingOptions = {
  logoPositions: [
    { value: 'left', label: 'Left' },
    { value: 'center', label: 'Center' },
    { value: 'right', label: 'Right' }
  ],
  logoSizes: [
    { value: 'small', label: 'Small (32px)' },
    { value: 'medium', label: 'Medium (40px)' },
    { value: 'large', label: 'Large (48px)' }
  ]
}

function ColorPicker({ label, value, onChange }) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="flex items-center space-x-2">
        <div 
          className="w-8 h-8 rounded border-2 border-border cursor-pointer"
          style={{ backgroundColor: value }}
          onClick={() => document.getElementById(`color-${label}`).click()}
        />
        <Input
          id={`color-${label}`}
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-16 h-8 p-0 border-0"
        />
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="font-mono text-sm"
          placeholder="#000000"
        />
      </div>
    </div>
  )
}

function ThemePreview({ colors }) {
  return (
    <div className="space-y-4 p-4 border rounded-lg bg-card">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Theme Preview</h3>
        <Badge variant="outline">Live Preview</Badge>
      </div>
      
      {/* Header Preview */}
      <div 
        className="h-12 rounded flex items-center px-4 text-white"
        style={{ backgroundColor: colors.primary }}
      >
        <div className="w-6 h-6 bg-white/20 rounded mr-3" />
        <span className="font-medium">AS2 Portal</span>
      </div>

      {/* Content Preview */}
      <div className="space-y-3">
        <div className="flex space-x-2">
          <div 
            className="px-3 py-1 rounded text-white text-sm"
            style={{ backgroundColor: colors.primary }}
          >
            Primary Button
          </div>
          <div 
            className="px-3 py-1 rounded text-white text-sm"
            style={{ backgroundColor: colors.secondary }}
          >
            Secondary
          </div>
          <div 
            className="px-3 py-1 rounded text-white text-sm"
            style={{ backgroundColor: colors.accent }}
          >
            Accent
          </div>
        </div>

        <div className="flex space-x-2">
          <div 
            className="px-2 py-1 rounded text-white text-xs"
            style={{ backgroundColor: colors.success }}
          >
            Success
          </div>
          <div 
            className="px-2 py-1 rounded text-white text-xs"
            style={{ backgroundColor: colors.warning }}
          >
            Warning
          </div>
          <div 
            className="px-2 py-1 rounded text-white text-xs"
            style={{ backgroundColor: colors.error }}
          >
            Error
          </div>
        </div>

        {/* Sample content */}
        <div className="p-3 border rounded">
          <div className="flex items-center space-x-2 mb-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: colors.success }}
            />
            <span className="text-sm font-medium">Sample Message Status</span>
          </div>
          <p className="text-sm text-muted-foreground">
            This is how your content will look with the selected theme colors.
          </p>
        </div>
      </div>
    </div>
  )
}

export function ThemeCustomizer() {
  const { theme, setTheme } = useTheme()
  const [selectedPreset, setSelectedPreset] = useState('default')
  const [customColors, setCustomColors] = useState(themePresets[0].colors)
  const [organizationName, setOrganizationName] = useState('Acme Pharmaceuticals')
  const [logoFile, setLogoFile] = useState(null)
  const [logoPosition, setLogoPosition] = useState('left')
  const [logoSize, setLogoSize] = useState('medium')

  const handlePresetChange = (presetId) => {
    setSelectedPreset(presetId)
    const preset = themePresets.find(p => p.id === presetId)
    if (preset) {
      setCustomColors(preset.colors)
    }
  }

  const handleColorChange = (colorKey, value) => {
    setCustomColors(prev => ({
      ...prev,
      [colorKey]: value
    }))
  }

  const handleLogoUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      setLogoFile(file)
      console.log('Logo uploaded:', file.name)
    }
  }

  const handleApplyTheme = () => {
    console.log('Applying theme:', {
      preset: selectedPreset,
      colors: customColors,
      branding: {
        organizationName,
        logoFile: logoFile?.name,
        logoPosition,
        logoSize
      }
    })
    
    // In real app: Apply theme to CSS variables
    const root = document.documentElement
    root.style.setProperty('--primary', customColors.primary)
    root.style.setProperty('--secondary', customColors.secondary)
    root.style.setProperty('--accent', customColors.accent)
    root.style.setProperty('--success', customColors.success)
    root.style.setProperty('--warning', customColors.warning)
    root.style.setProperty('--error', customColors.error)
  }

  const handleExportTheme = () => {
    const themeConfig = {
      preset: selectedPreset,
      colors: customColors,
      branding: {
        organizationName,
        logoPosition,
        logoSize
      },
      exportedAt: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(themeConfig, null, 2)], {
      type: 'application/json'
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'as2-portal-theme.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImportTheme = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const themeConfig = JSON.parse(e.target.result)
          setSelectedPreset(themeConfig.preset || 'custom')
          setCustomColors(themeConfig.colors)
          setOrganizationName(themeConfig.branding?.organizationName || '')
          setLogoPosition(themeConfig.branding?.logoPosition || 'left')
          setLogoSize(themeConfig.branding?.logoSize || 'medium')
          console.log('Theme imported successfully')
        } catch (error) {
          console.error('Failed to import theme:', error)
        }
      }
      reader.readAsText(file)
    }
  }

  const handleResetTheme = () => {
    setSelectedPreset('default')
    setCustomColors(themePresets[0].colors)
    setOrganizationName('Acme Pharmaceuticals')
    setLogoFile(null)
    setLogoPosition('left')
    setLogoSize('medium')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Theme Customization</h2>
          <p className="text-muted-foreground">
            Customize the appearance and branding of your AS2 Portal
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleResetTheme}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button variant="outline" onClick={handleExportTheme}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" onClick={() => document.getElementById('import-theme').click()}>
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <input
            id="import-theme"
            type="file"
            accept=".json"
            onChange={handleImportTheme}
            className="hidden"
          />
          <Button onClick={handleApplyTheme}>
            <Check className="mr-2 h-4 w-4" />
            Apply Theme
          </Button>
        </div>
      </div>

      <Tabs defaultValue="colors" className="space-y-6">
        <TabsList>
          <TabsTrigger value="colors">Colors & Theme</TabsTrigger>
          <TabsTrigger value="branding">Organization Branding</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        {/* Colors & Theme Tab */}
        <TabsContent value="colors" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="mr-2 h-5 w-5" />
                  Theme Mode
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={theme === 'light' ? 'default' : 'outline'}
                    onClick={() => setTheme('light')}
                    className="flex flex-col items-center p-4 h-auto"
                  >
                    <Sun className="h-4 w-4 mb-2" />
                    Light
                  </Button>
                  <Button
                    variant={theme === 'dark' ? 'default' : 'outline'}
                    onClick={() => setTheme('dark')}
                    className="flex flex-col items-center p-4 h-auto"
                  >
                    <Moon className="h-4 w-4 mb-2" />
                    Dark
                  </Button>
                  <Button
                    variant={theme === 'system' ? 'default' : 'outline'}
                    onClick={() => setTheme('system')}
                    className="flex flex-col items-center p-4 h-auto"
                  >
                    <Monitor className="h-4 w-4 mb-2" />
                    System
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Theme Presets</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {themePresets.map((preset) => (
                  <div
                    key={preset.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedPreset === preset.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                    }`}
                    onClick={() => handlePresetChange(preset.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{preset.name}</h4>
                        <p className="text-sm text-muted-foreground">{preset.description}</p>
                      </div>
                      <div className="flex space-x-1">
                        {Object.values(preset.colors).slice(0, 4).map((color, index) => (
                          <div
                            key={index}
                            className="w-4 h-4 rounded border"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Custom Colors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <ColorPicker
                  label="Primary"
                  value={customColors.primary}
                  onChange={(value) => handleColorChange('primary', value)}
                />
                <ColorPicker
                  label="Secondary"
                  value={customColors.secondary}
                  onChange={(value) => handleColorChange('secondary', value)}
                />
                <ColorPicker
                  label="Accent"
                  value={customColors.accent}
                  onChange={(value) => handleColorChange('accent', value)}
                />
                <ColorPicker
                  label="Success"
                  value={customColors.success}
                  onChange={(value) => handleColorChange('success', value)}
                />
                <ColorPicker
                  label="Warning"
                  value={customColors.warning}
                  onChange={(value) => handleColorChange('warning', value)}
                />
                <ColorPicker
                  label="Error"
                  value={customColors.error}
                  onChange={(value) => handleColorChange('error', value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Organization Branding Tab */}
        <TabsContent value="branding" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Organization Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="orgName">Organization Name</Label>
                  <Input
                    id="orgName"
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    placeholder="Your Organization Name"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Logo Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Upload Logo</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    {logoFile ? (
                      <div className="space-y-2">
                        <div className="w-12 h-12 bg-primary/10 rounded mx-auto flex items-center justify-center">
                          <Upload className="h-6 w-6 text-primary" />
                        </div>
                        <p className="text-sm font-medium">{logoFile.name}</p>
                        <Button variant="outline" size="sm" onClick={() => setLogoFile(null)}>
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          Drag and drop your logo here, or click to browse
                        </p>
                        <Button variant="outline" onClick={() => document.getElementById('logo-upload').click()}>
                          Browse Files
                        </Button>
                        <input
                          id="logo-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Logo Position</Label>
                    <Select value={logoPosition} onValueChange={setLogoPosition}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {brandingOptions.logoPositions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Logo Size</Label>
                    <Select value={logoSize} onValueChange={setLogoSize}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {brandingOptions.logoSizes.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Preview Tab */}
        <TabsContent value="preview" className="space-y-6">
          <ThemePreview colors={customColors} />
        </TabsContent>
      </Tabs>
    </div>
  )
}