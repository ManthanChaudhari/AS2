'use client'

import { PageTransition } from "@/components/ui/animations"

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen ocean-gradient-light dark:bg-gradient-to-br dark:from-gray-900 dark:to-ocean-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, oklch(0.43 0.20 220) 0%, transparent 50%), 
                           radial-gradient(circle at 75% 75%, oklch(0.54 0.24 220) 0%, transparent 50%)`,
          backgroundSize: '400px 400px'
        }} />
      </div>
      
      {/* Content container */}
      <div className="w-full max-w-md relative z-10">
        <PageTransition>
          {children}
        </PageTransition>
      </div>
    </div>
  )
}