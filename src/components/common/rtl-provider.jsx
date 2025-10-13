'use client'

import { useEffect } from 'react'
import { isRtlLocale } from '@/lib/i18n'

export function RTLProvider({ locale, children }) {
  useEffect(() => {
    const isRtl = isRtlLocale(locale)
    
    // Set document direction
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr'
    
    // Add RTL class to body for styling
    if (isRtl) {
      document.body.classList.add('rtl')
    } else {
      document.body.classList.remove('rtl')
    }
    
    // Set language attribute
    document.documentElement.lang = locale
    
    return () => {
      // Cleanup on unmount
      document.body.classList.remove('rtl')
    }
  }, [locale])

  return children
}