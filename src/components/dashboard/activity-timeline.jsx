'use client'

import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Send,
  Inbox,
  Shield,
  Users
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MinimalCard } from '@/components/ui/minimal-animations'
import { FadeIn } from '@/components/ui/animations'

// Dummy activity data
const recentActivities = [
  {
    id: 1,
    type: 'message_sent',
    title: 'ICSR file sent to FDA',
    description: 'case_report_20241013_001.xml',
    timestamp: '2 minutes ago',
    status: 'success',
    icon: Send,
    partner: 'FDA FAERS'
  },
  {
    id: 2,
    type: 'message_received',
    title: 'Business ACK received',
    description: 'Message MSG-20241013-101530-XYZ accepted',
    timestamp: '5 minutes ago',
    status: 'success',
    icon: CheckCircle,
    partner: 'EMA EudraVigilance'
  },
  {
    id: 3,
    type: 'certificate_warning',
    title: 'Certificate expiring soon',
    description: 'Pfizer encryption certificate expires in 15 days',
    timestamp: '1 hour ago',
    status: 'warning',
    icon: Shield,
    partner: 'Pfizer Inc.'
  },
  {
    id: 4,
    type: 'message_failed',
    title: 'Message transmission failed',
    description: 'Connection timeout to partner endpoint',
    timestamp: '2 hours ago',
    status: 'error',
    icon: XCircle,
    partner: 'Health Canada'
  },
  {
    id: 5,
    type: 'partner_added',
    title: 'New partner added',
    description: 'Novartis AG successfully configured',
    timestamp: '3 hours ago',
    status: 'success',
    icon: Users,
    partner: 'Novartis AG'
  },
  {
    id: 6,
    type: 'message_received',
    title: 'ICSR received from partner',
    description: 'adverse_event_report_20241013.xml',
    timestamp: '4 hours ago',
    status: 'success',
    icon: Inbox,
    partner: 'Johnson & Johnson'
  },
  {
    id: 7,
    type: 'mdn_timeout',
    title: 'MDN acknowledgment timeout',
    description: 'No MDN received within 15 minutes',
    timestamp: '5 hours ago',
    status: 'warning',
    icon: Clock,
    partner: 'MHRA'
  },
  {
    id: 8,
    type: 'message_sent',
    title: 'Batch transmission completed',
    description: '15 files sent successfully',
    timestamp: '6 hours ago',
    status: 'success',
    icon: Send,
    partner: 'Multiple Partners'
  }
]

function ActivityItem({ activity }) {
  const Icon = activity.icon

  const getStatusColor = () => {
    switch (activity.status) {
      case 'success':
        return 'text-green-600 bg-green-100 dark:bg-green-900'
      case 'warning':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900'
      case 'error':
        return 'text-red-600 bg-red-100 dark:bg-red-900'
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900'
    }
  }

  const getStatusBadge = () => {
    switch (activity.status) {
      case 'success':
        return <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Success</Badge>
      case 'warning':
        return <Badge variant="default" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Warning</Badge>
      case 'error':
        return <Badge variant="destructive">Error</Badge>
      default:
        return <Badge variant="secondary">Info</Badge>
    }
  }

  return (
    <div className="flex items-start space-x-3 pb-4">
      <div className={`flex h-8 w-8 items-center justify-center rounded-full ${getStatusColor()}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-ocean-800 dark:text-ocean-200">
            {activity.title}
          </p>
          {getStatusBadge()}
        </div>
        <p className="text-sm text-ocean-600 dark:text-ocean-400 mt-1">
          {activity.description}
        </p>
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-ocean-500 dark:text-ocean-500">
            {activity.partner}
          </p>
          <p className="text-xs text-ocean-500 dark:text-ocean-500">
            {activity.timestamp}
          </p>
        </div>
      </div>
    </div>
  )
}

export function ActivityTimeline() {
  return (
    <FadeIn delay={500}>
      <MinimalCard className="border-ocean-200 dark:border-ocean-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-ocean-800 dark:text-ocean-200">
            Recent Activity
            <Badge variant="secondary" className="ml-2 bg-ocean-100 text-ocean-800 dark:bg-ocean-900 dark:text-ocean-200">
              Live
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <FadeIn key={activity.id} delay={600 + index * 50}>
                  <ActivityItem activity={activity} />
                </FadeIn>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </MinimalCard>
    </FadeIn>
  )
}