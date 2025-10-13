'use client'

import { Inbox, CheckCircle, Clock, XCircle, AlertTriangle } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { InboxTable } from '@/components/transmission/inbox-table'

// Dummy inbox stats
const inboxStats = [
  {
    title: 'New Messages Today',
    value: 23,
    icon: Inbox,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100 dark:bg-blue-900'
  },
  {
    title: 'Successfully Processed',
    value: 18,
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-100 dark:bg-green-900'
  },
  {
    title: 'Awaiting Processing',
    value: 5,
    icon: Clock,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900'
  },
  {
    title: 'Validation Failures',
    value: 2,
    icon: XCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-100 dark:bg-red-900'
  }
]

function StatCard({ stat }) {
  const Icon = stat.icon
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {stat.title}
        </CardTitle>
        <div className={`rounded-full p-2 ${stat.bgColor}`}>
          <Icon className={`h-4 w-4 ${stat.color}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{stat.value}</div>
      </CardContent>
    </Card>
  )
}

export default function InboxPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Inbox</h1>
        <p className="text-muted-foreground">
          View and process received messages from trading partners
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {inboxStats.map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
      </div>

      {/* Inbox Table */}
      <InboxTable />
    </div>
  )
}