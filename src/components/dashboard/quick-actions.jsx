'use client'

import Link from 'next/link'
import { 
  Send, 
  Inbox, 
  UserPlus,
  Upload,
  FileText,
  BarChart3
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MinimalCard } from '@/components/ui/minimal-animations'
import { FadeIn } from '@/components/ui/animations'

// Quick action items
const quickActions = [
  {
    title: 'Send File',
    description: 'Send ICSR or other files to partners',
    href: '/send',
    icon: Send,
    color: 'bg-ocean-600 hover:bg-ocean-700',
    primary: true
  },
  {
    title: 'View Inbox',
    description: 'Check received messages and files',
    href: '/inbox',
    icon: Inbox,
    color: 'bg-green-500 hover:bg-green-600'
  },
  {
    title: 'Add Partner',
    description: 'Configure new trading partner',
    href: '/partners/new',
    icon: UserPlus,
    color: 'bg-ocean-500 hover:bg-ocean-600'
  },
  {
    title: 'Batch Upload',
    description: 'Send multiple files at once',
    href: '/send/batch',
    icon: Upload,
    color: 'bg-orange-500 hover:bg-orange-600'
  },
  {
    title: 'Certificates',
    description: 'Manage security certificates',
    href: '/certificates',
    icon: FileText,
    color: 'bg-red-500 hover:bg-red-600'
  },
  {
    title: 'Reports',
    description: 'View transmission analytics',
    href: '/reports',
    icon: BarChart3,
    color: 'bg-ocean-400 hover:bg-ocean-500'
  }
]

export function QuickActions() {
  return (
    <FadeIn delay={400}>
      <MinimalCard className="border-ocean-200 dark:border-ocean-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-ocean-800 dark:text-ocean-200">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              
              return (
                <FadeIn key={action.href} delay={500 + index * 50}>
                  <Button
                    asChild
                    variant={action.primary ? "default" : "outline"}
                    className={`h-auto p-4 flex flex-col items-center space-y-2 transition-colors-minimal border-ocean-200 dark:border-ocean-700 hover:border-ocean-300 dark:hover:border-ocean-600 ${
                      action.primary ? action.color : 'hover:bg-ocean-50 dark:hover:bg-ocean-900'
                    }`}
                  >
                    <Link href={action.href}>
                      <div className={`p-2 rounded-full ${
                        action.primary 
                          ? 'bg-white/20' 
                          : `${action.color.split(' ')[0]} text-white`
                      }`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="text-center">
                        <div className={`font-medium text-sm ${
                          action.primary ? 'text-white' : 'text-ocean-800 dark:text-ocean-200'
                        }`}>{action.title}</div>
                        <div className={`text-xs ${
                          action.primary 
                            ? 'text-white/80' 
                            : 'text-ocean-600 dark:text-ocean-400'
                        }`}>
                          {action.description}
                        </div>
                      </div>
                    </Link>
                  </Button>
                </FadeIn>
              )
            })}
          </div>
        </CardContent>
      </MinimalCard>
    </FadeIn>
  )
}