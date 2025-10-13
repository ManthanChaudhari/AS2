import { notFound } from 'next/navigation'
import { getRequestConfig } from 'next-intl/server'

// Can be imported from a shared config
export const locales = ['en', 'es', 'fr', 'de', 'ja', 'zh']
export const defaultLocale = 'en'

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale)) notFound()

  return {
    messages: (await import(`../messages/${locale}.json`)).default
  }
})

export const localeNames = {
  en: 'English',
  es: 'Español',
  fr: 'Français', 
  de: 'Deutsch',
  ja: '日本語',
  zh: '中文'
}

export const rtlLocales = ['ar', 'he', 'fa']

export function isRtlLocale(locale) {
  return rtlLocales.includes(locale)
}