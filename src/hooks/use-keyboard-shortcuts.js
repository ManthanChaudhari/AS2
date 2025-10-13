'use client'

import { useEffect, useCallback } from 'react'

// Keyboard shortcuts hook
export function useKeyboardShortcuts(shortcuts) {
  const handleKeyDown = useCallback((event) => {
    const { key, ctrlKey, metaKey, shiftKey, altKey } = event
    
    // Check if we're in an input field
    const isInputField = ['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName) ||
                        event.target.contentEditable === 'true'
    
    for (const shortcut of shortcuts) {
      const {
        key: shortcutKey,
        ctrl = false,
        meta = false,
        shift = false,
        alt = false,
        callback,
        preventDefault = true,
        allowInInputs = false
      } = shortcut
      
      // Skip if in input field and not allowed
      if (isInputField && !allowInInputs) continue
      
      // Check if all modifiers match
      const modifiersMatch = 
        ctrlKey === ctrl &&
        metaKey === meta &&
        shiftKey === shift &&
        altKey === alt
      
      // Check if key matches (case insensitive)
      const keyMatches = key.toLowerCase() === shortcutKey.toLowerCase()
      
      if (modifiersMatch && keyMatches) {
        if (preventDefault) {
          event.preventDefault()
        }
        callback(event)
        break
      }
    }
  }, [shortcuts])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])
}

// Common keyboard shortcuts for the AS2 portal
export function useAS2KeyboardShortcuts({
  onSearch,
  onRefresh,
  onNewPartner,
  onSendFile,
  onHelp,
  onSettings
}) {
  const shortcuts = [
    // Global shortcuts
    {
      key: '/',
      callback: () => onSearch?.(),
      allowInInputs: false
    },
    {
      key: 'r',
      ctrl: true,
      callback: () => onRefresh?.(),
      allowInInputs: true
    },
    {
      key: 'F5',
      callback: () => onRefresh?.(),
      allowInInputs: true
    },
    {
      key: '?',
      shift: true,
      callback: () => onHelp?.(),
      allowInInputs: false
    },
    
    // Navigation shortcuts
    {
      key: 'n',
      ctrl: true,
      callback: () => onNewPartner?.(),
      allowInInputs: false
    },
    {
      key: 's',
      ctrl: true,
      shift: true,
      callback: () => onSendFile?.(),
      allowInInputs: false
    },
    {
      key: ',',
      ctrl: true,
      callback: () => onSettings?.(),
      allowInInputs: false
    },
    
    // Escape to close modals/dialogs
    {
      key: 'Escape',
      callback: (event) => {
        // Close any open modals or dialogs
        const openModal = document.querySelector('[role="dialog"]')
        if (openModal) {
          const closeButton = openModal.querySelector('[aria-label="Close"]') ||
                             openModal.querySelector('button[data-dismiss]')
          if (closeButton) {
            closeButton.click()
          }
        }
      },
      allowInInputs: true
    }
  ]

  useKeyboardShortcuts(shortcuts)
}

// Hook for table navigation shortcuts
export function useTableKeyboardShortcuts({
  onSelectAll,
  onDelete,
  onEdit,
  onView
}) {
  const shortcuts = [
    {
      key: 'a',
      ctrl: true,
      callback: () => onSelectAll?.(),
      allowInInputs: false
    },
    {
      key: 'Delete',
      callback: () => onDelete?.(),
      allowInInputs: false
    },
    {
      key: 'e',
      callback: () => onEdit?.(),
      allowInInputs: false
    },
    {
      key: 'Enter',
      callback: () => onView?.(),
      allowInInputs: false
    }
  ]

  useKeyboardShortcuts(shortcuts)
}

// Hook for form shortcuts
export function useFormKeyboardShortcuts({
  onSave,
  onCancel,
  onNext,
  onPrevious
}) {
  const shortcuts = [
    {
      key: 's',
      ctrl: true,
      callback: () => onSave?.(),
      allowInInputs: true
    },
    {
      key: 'Escape',
      callback: () => onCancel?.(),
      allowInInputs: true
    },
    {
      key: 'Tab',
      ctrl: true,
      callback: () => onNext?.(),
      allowInInputs: true
    },
    {
      key: 'Tab',
      ctrl: true,
      shift: true,
      callback: () => onPrevious?.(),
      allowInInputs: true
    }
  ]

  useKeyboardShortcuts(shortcuts)
}

// Keyboard shortcut display component
export function KeyboardShortcutHint({ shortcut, description, className = '' }) {
  const formatShortcut = (shortcut) => {
    const parts = []
    
    if (shortcut.ctrl) parts.push('Ctrl')
    if (shortcut.meta) parts.push('Cmd')
    if (shortcut.shift) parts.push('Shift')
    if (shortcut.alt) parts.push('Alt')
    
    parts.push(shortcut.key.toUpperCase())
    
    return parts.join(' + ')
  }

  return (
    <div className={`flex items-center justify-between text-sm ${className}`}>
      <span className="text-muted-foreground">{description}</span>
      <kbd className="px-2 py-1 text-xs font-mono bg-muted rounded border">
        {formatShortcut(shortcut)}
      </kbd>
    </div>
  )
}

// Keyboard shortcuts help modal content
export function KeyboardShortcutsHelp() {
  const shortcuts = [
    { key: '/', description: 'Focus search' },
    { key: 'Ctrl + R', description: 'Refresh page' },
    { key: 'Ctrl + N', description: 'New partner' },
    { key: 'Ctrl + Shift + S', description: 'Send file' },
    { key: 'Ctrl + ,', description: 'Open settings' },
    { key: 'Shift + ?', description: 'Show help' },
    { key: 'Escape', description: 'Close modal' },
    { key: 'Ctrl + A', description: 'Select all (in tables)' },
    { key: 'Delete', description: 'Delete selected' },
    { key: 'Enter', description: 'View details' },
    { key: 'E', description: 'Edit item' }
  ]

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Keyboard Shortcuts</h3>
      <div className="space-y-2">
        {shortcuts.map((shortcut, index) => (
          <div key={index} className="flex items-center justify-between py-2">
            <span className="text-sm text-muted-foreground">{shortcut.description}</span>
            <kbd className="px-2 py-1 text-xs font-mono bg-muted rounded border">
              {shortcut.key}
            </kbd>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-4">
        Note: Some shortcuts may not work when focused on input fields.
      </p>
    </div>
  )
}