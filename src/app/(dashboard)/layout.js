'use client'

import { ThemeProvider } from "next-themes"
import { Header } from '@/components/layout/header'
import { Sidebar } from '@/components/layout/sidebar'
import { motion } from "framer-motion"
import RouteGuard from '@/components/auth/RouteGuard';


export default function DashboardLayout({ children }) {
    const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };
  return (
    <RouteGuard requireAuth={true} redirectTo="/login">
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <div className="min-h-screen bg-background">
          <div className="flex">
            <Sidebar />
            <div className="flex-1 flex flex-col">
              <Header />
              <section className="flex-1 overflow-auto py-6 px-9 from-slate-50 via-white to-blue-50">
              <motion.div variants={itemVariants} className="relative">
                <div className="absolute z-10 -top-6 -left-6 w-24 h-24 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
                <div className="absolute z-10 -top-6 -right-6 w-24 h-24 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
              </motion.div>
              {children}
            </section>
            </div>
          </div>
        </div>
      </ThemeProvider>
    </RouteGuard>
  )
}