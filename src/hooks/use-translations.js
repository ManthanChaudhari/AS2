'use client'

import { useTranslations } from 'next-intl'

// Custom hook for common translations
export function useCommonTranslations() {
  return useTranslations('common')
}

export function useNavigationTranslations() {
  return useTranslations('navigation')
}

export function useAuthTranslations() {
  return useTranslations('auth')
}

export function useDashboardTranslations() {
  return useTranslations('dashboard')
}

export function usePartnersTranslations() {
  return useTranslations('partners')
}

export function useCertificatesTranslations() {
  return useTranslations('certificates')
}

export function useTransmissionTranslations() {
  return useTranslations('transmission')
}

export function useAdminTranslations() {
  return useTranslations('admin')
}

export function useReportsTranslations() {
  return useTranslations('reports')
}

export function useStatusTranslations() {
  return useTranslations('status')
}

export function useErrorTranslations() {
  return useTranslations('errors')
}

// Format date according to locale
export function useLocalizedDate() {
  return (date, locale = 'en') => {
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date))
  }
}

// Format numbers according to locale
export function useLocalizedNumber() {
  return (number, locale = 'en') => {
    return new Intl.NumberFormat(locale).format(number)
  }
}

// Format currency according to locale
export function useLocalizedCurrency() {
  return (amount, currency = 'USD', locale = 'en') => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    }).format(amount)
  }
}