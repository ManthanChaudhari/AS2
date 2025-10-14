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

// Dummy stats data
const statsData = [
  {
    title: 'Messages Sent Today',
    value: 247,
    change: +12.5,
    changeType: 'increase',
    icon: Send,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100 dark:bg-blue-900',
    description: 'vs yesterday'
  },
  {
    title: 'Messages Received Today',
    value: 189,
    change: +8.2,
    changeType: 'increase',
    icon: Inbox,
    color: 'text-green-600',
    bgColor: 'bg-green-100 dark:bg-green-900',
    description: 'vs yesterday'
  },
  {
    title: 'Pending MDN Acknowledgments',
    value: 23,
    change: -2.1,
    changeType: 'decrease',
    icon: AlertTriangle,
    color: 'text-orange-600',
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
    color: 'text-red-600',
    bgColor: 'bg-red-100 dark:bg-red-900',
    description: 'expiring in <30 days',
    alert: true
  }
]

function StatsCard({ stat }) {
  const Icon = stat.icon;
  
  const getTrendIcon = () => {
    if (stat.changeType === 'increase') {
      return <TrendingUp className="h-3 w-3" />;
    } else if (stat.changeType === 'decrease') {
      return <TrendingDown className="h-3 w-3" />;
    } else {
      return <Minus className="h-3 w-3" />;
    }
  };

  const getChangeColor = () => {
    if (stat.changeType === 'increase') {
      return 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/30';
    } else if (stat.changeType === 'decrease') {
      return 'text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/30';
    } else {
      return 'text-slate-600 bg-slate-50 dark:text-slate-400 dark:bg-slate-950/30';
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
      {/* Gradient background accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-slate-50/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:to-slate-800/20" />
      
      {/* Alert Badge */}
      {/* {stat.alert && stat.value > 10 && (
        <div className="absolute top-4 right-4 z-10">
          <span className="inline-flex items-center rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-semibold text-rose-800 dark:bg-rose-950 dark:text-rose-200">
            Alert
          </span>
        </div>
      )}
       */}
      {/* Header */}
      <div className="relative flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">
            {stat.title}
          </h3>
          {/* Alert Badge - positioned below title */}
          {stat.alert && stat.value > 10 && (
            <span className="inline-flex items-center rounded-full bg-rose-100 px-2 py-0.5 text-xs font-semibold text-rose-800 dark:bg-rose-950 dark:text-rose-200 mt-1.5">
              Alert
            </span>
          )}
        </div>
        <div className={`rounded-lg p-2.5 transition-transform duration-300 group-hover:scale-110 ${stat.bgColor}`}>
          <Icon className={`h-5 w-5 ${stat.color}`} />
        </div>
      </div>
      
      {/* Value and Change */}
      <div className="relative">
        <div className="flex items-end justify-between">
          <div className="text-3xl font-bold text-slate-900 dark:text-slate-100 transition-all duration-300 group-hover:scale-105">
            {stat.value.toLocaleString()}
          </div>
          {stat.change !== 0 && (
            <div className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${getChangeColor()}`}>
              {getTrendIcon()}
              <span>{Math.abs(stat.change)}%</span>
            </div>
          )}
        </div>
        
        {/* Description */}
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
          {stat.description}
        </p>
      </div>
      
      {/* Bottom accent line */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.changeType === 'increase' ? 'from-emerald-500 to-emerald-600' : stat.changeType === 'decrease' ? 'from-rose-500 to-rose-600' : 'from-slate-400 to-slate-500'} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
    </div>
  );
}

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat, index) => (
        <StatsCard key={index} stat={stat} />
      ))}
    </div>
  )
}