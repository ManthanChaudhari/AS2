'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, Trash2, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  description = 'Are you sure you want to perform this action?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default', // 'default', 'destructive'
  isLoading = false,
  children
}) {
  const [isConfirming, setIsConfirming] = useState(false)

  const handleConfirm = async () => {
    setIsConfirming(true)
    try {
      await onConfirm()
      onClose()
    } catch (error) {
      console.error('Confirmation action failed:', error)
    } finally {
      setIsConfirming(false)
    }
  }

  const getIcon = () => {
    switch (variant) {
      case 'destructive':
        return <AlertTriangle className="h-6 w-6 text-red-600" />
      default:
        return null
    }
  }

  const getConfirmButtonVariant = () => {
    switch (variant) {
      case 'destructive':
        return 'destructive'
      default:
        return 'default'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <DialogHeader>
            <div className="flex items-center space-x-3">
              {getIcon()}
              <DialogTitle>{title}</DialogTitle>
            </div>
            <DialogDescription className="mt-2">
              {description}
            </DialogDescription>
          </DialogHeader>

          {children && (
            <div className="py-4">
              {children}
            </div>
          )}

          <DialogFooter className="flex space-x-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isConfirming || isLoading}
            >
              {cancelText}
            </Button>
            <Button
              variant={getConfirmButtonVariant()}
              onClick={handleConfirm}
              disabled={isConfirming || isLoading}
            >
              {(isConfirming || isLoading) && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"
                />
              )}
              {confirmText}
            </Button>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}

// Specialized delete confirmation dialog
export function DeleteConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  itemType = 'item',
  isLoading = false
}) {
  return (
    <ConfirmationDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title={`Delete ${itemType}`}
      description={`Are you sure you want to delete "${itemName}"? This action cannot be undone.`}
      confirmText="Delete"
      cancelText="Cancel"
      variant="destructive"
      isLoading={isLoading}
    >
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <Trash2 className="h-5 w-5 text-red-600" />
          <div>
            <h4 className="text-sm font-medium text-red-800 dark:text-red-200">
              This action is permanent
            </h4>
            <p className="text-sm text-red-700 dark:text-red-300 mt-1">
              The {itemType} will be permanently deleted and cannot be recovered.
            </p>
          </div>
        </div>
      </div>
    </ConfirmationDialog>
  )
}

// Hook for managing confirmation dialogs
export function useConfirmationDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [config, setConfig] = useState({})

  const showConfirmation = (confirmationConfig) => {
    setConfig(confirmationConfig)
    setIsOpen(true)
  }

  const hideConfirmation = () => {
    setIsOpen(false)
    setConfig({})
  }

  const ConfirmationComponent = () => (
    <ConfirmationDialog
      isOpen={isOpen}
      onClose={hideConfirmation}
      {...config}
    />
  )

  return {
    showConfirmation,
    hideConfirmation,
    ConfirmationDialog: ConfirmationComponent,
    isOpen
  }
}