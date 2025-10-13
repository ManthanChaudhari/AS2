'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'

// Mobile-optimized multi-step form component
export function MobileWizard({ 
  steps, 
  currentStep, 
  onStepChange, 
  children,
  title,
  description 
}) {
  const progress = (currentStep / steps.length) * 100

  return (
    <div className="min-h-screen bg-background md:min-h-0">
      {/* Mobile Header */}
      <div className="sticky top-0 z-10 bg-background border-b md:hidden">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            {currentStep > 1 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onStepChange(currentStep - 1)}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            )}
            <div>
              <h1 className="font-semibold">{title}</h1>
              <p className="text-sm text-muted-foreground">
                Step {currentStep} of {steps.length}
              </p>
            </div>
          </div>
        </div>
        <div className="px-4 pb-4">
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-0">
        {children}
      </div>

      {/* Mobile Footer */}
      <div className="sticky bottom-0 bg-background border-t p-4 md:hidden">
        <div className="flex justify-between space-x-4">
          <Button
            variant="outline"
            onClick={() => onStepChange(currentStep - 1)}
            disabled={currentStep === 1}
            className="flex-1"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button
            onClick={() => onStepChange(currentStep + 1)}
            disabled={currentStep === steps.length}
            className="flex-1"
          >
            {currentStep === steps.length ? 'Complete' : 'Continue'}
            {currentStep < steps.length && <ChevronRight className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  )
}

// Mobile-optimized form section
export function MobileFormSection({ title, description, children, className = "" }) {
  return (
    <Card className={`mb-4 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{title}</CardTitle>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {children}
      </CardContent>
    </Card>
  )
}

// Mobile-optimized input group
export function MobileInputGroup({ children, columns = 1 }) {
  const gridClass = columns === 2 ? 'grid grid-cols-1 sm:grid-cols-2 gap-4' : 'space-y-4'
  
  return (
    <div className={gridClass}>
      {children}
    </div>
  )
}

// Touch-friendly file upload component
export function MobileFriendlyUpload({ 
  onFileSelect, 
  accept = "*", 
  multiple = false,
  className = "" 
}) {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    onFileSelect(files)
  }

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files)
    onFileSelect(files)
  }

  return (
    <div
      className={`
        border-2 border-dashed rounded-lg p-8 text-center transition-colors
        ${isDragOver ? 'border-primary bg-primary/5' : 'border-border'}
        ${className}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="space-y-4">
        <div className="text-4xl">📁</div>
        <div>
          <p className="text-sm font-medium">
            Tap to select files or drag and drop
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {multiple ? 'Multiple files supported' : 'Single file only'}
          </p>
        </div>
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInput}
          className="hidden"
          id="mobile-file-input"
        />
        <Button
          variant="outline"
          onClick={() => document.getElementById('mobile-file-input').click()}
          className="w-full sm:w-auto"
        >
          Choose Files
        </Button>
      </div>
    </div>
  )
}

// Mobile-optimized data display
export function MobileDataCard({ title, data, actions }) {
  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{title}</CardTitle>
          {actions && (
            <div className="flex space-x-2">
              {actions}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="flex justify-between items-start">
              <span className="text-sm text-muted-foreground capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}:
              </span>
              <span className="text-sm font-medium text-right ml-4">
                {typeof value === 'object' ? JSON.stringify(value) : value}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}