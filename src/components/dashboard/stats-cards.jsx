'use client'

import { 
  Send, 
  Inbox, 
  AlertTriangle, 
  Shield,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MinimalCard } from '@/components/ui/minimal-animations'
import { FadeIn } from '@/components/ui/animations'

// Dummy stats data
const statsData = [
  {
    title: 'Messages Sent Today',
    value: 247,
    change: +12.5,
    changeType: 'increase',
    icon: Send,
    color: 'text-ocean-600 dark:text-ocean-400',
    bgColor: 'bg-ocean-100 dark:bg-ocean-900',
    description: 'vs yesterday'
  },
  {
    title: 'Messages Received Today',
    value: 189,
    change: +8.2,
    changeType: 'increase',
    icon: Inbox,
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900',
    description: 'vs yesterday'
  },
  {
    title: 'Pending MDN Acknowledgments',
    value: 23,
    change: -2.1,
    changeType: 'decrease',
    icon: AlertTriangle,
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-100 dark:bg-orange-900',
    description: 'awaiting response',
    alert: true
  },
  {
    title: 'Certificate Expiry Alerts',
    value: 5,
    change: 0,
    changeType: 'neutral',
    icon: Shield,
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-900',
    description: 'expiring in <30 days',
    alert: true
  }
]

function StatsCard({ stat }) {
  const Icon = stat.icon
  
  const getTrendIcon = () => {
    if (stat.changeType === 'increase') {
      return <TrendingUp className="h-3 w-3 text-green-600" />
    } else if (stat.changeType === 'decrease') {
      return <TrendingDown className="h-3 w-3 text-red-600" />
    } else {
      return <Minus className="h-3 w-3 text-gray-600" />
    }
  }

  const getChangeColor = () => {
    if (stat.changeType === 'increase') {
      return 'text-green-600 dark:text-green-400'
    } else if (stat.changeType === 'decrease') {
      return 'text-red-600 dark:text-red-400'
    } else {
      return 'text-gray-600 dark:text-gray-400'
    }
  }

  return (
    <MinimalCard hoverable className="relative overflow-hidden border-ocean-200 dark:border-ocean-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-ocean-700 dark:text-ocean-300">
          {stat.title}
        </CardTitle>
        <div className={`rounded-full p-2 ${stat.bgColor} ring-1 ring-ocean-200 dark:ring-ocean-700`}>
          <Icon className={`h-4 w-4 ${stat.color}`} />
        </div>
        {stat.alert && stat.value > 10 && (
          <Badge variant="destructive" className="absolute top-2 right-2">
            Alert
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline space-x-2">
          <div className="text-2xl font-bold text-ocean-800 dark:text-ocean-200">{stat.value.toLocaleString()}</div>
          {stat.change !== 0 && (
            <div className={`flex items-center space-x-1 text-xs ${getChangeColor()}`}>
              {getTrendIcon()}
              <span>{Math.abs(stat.change)}%</span>
            </div>
          )}
        </div>
        <p className="text-xs text-ocean-600 dark:text-ocean-400 mt-1">
          {stat.description}
        </p>
      </CardContent>
    </MinimalCard>
  )
}

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat, index) => (
        <FadeIn key={index} delay={index * 100}>
          <StatsCard stat={stat} />
        </FadeIn>
      ))}
    </div>
  )
}