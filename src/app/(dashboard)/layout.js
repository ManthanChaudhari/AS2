'use client'

import { Header } from '@/components/layout/header'
import { Sidebar } from '@/components/layout/sidebar'
import { PageTransition } from '@/components/ui/animations'

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen ocean-gradient-light dark:bg-gradient-to-br dark:from-gray-900 dark:to-ocean-950">
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
            <PageTransition>
              {children}
            </PageTransition>
          </main>
        </div>
      </div>
    </div>
  )
}