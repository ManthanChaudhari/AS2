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

// Quick action items
const quickActions = [
  {
    title: 'Send File',
    description: 'Send ICSR or other files to partners',
    href: '/send',
    icon: Send,
    color: 'bg-primary hover:bg-primary/90',
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
    color: 'bg-purple-500 hover:bg-purple-600'
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
    color: 'bg-indigo-500 hover:bg-indigo-600'
  }
]

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon
            
            return (
              <Button
                key={action.href}
                asChild
                variant={action.primary ? "default" : "outline"}
                className={`h-auto p-4 flex flex-col items-center space-y-2 ${
                  action.primary ? action.color : ''
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
                    <div className="font-medium text-sm">{action.title}</div>
                    <div className={`text-xs ${
                      action.primary 
                        ? 'text-white/80' 
                        : 'text-muted-foreground'
                    }`}>
                      {action.description}
                    </div>
                  </div>
                </Link>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}