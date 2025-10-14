'use client'

import { Send, CheckCircle, Clock, XCircle, AlertTriangle } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { OutboxTable } from '@/components/transmission/outbox-table'

// Dummy outbox stats
const outboxStats = [
  {
    title: 'Total Sent Today',
    value: 47,
    icon: Send,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100 dark:bg-blue-900'
  },
  {
    title: 'Successful Deliveries',
    value: 42,
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-100 dark:bg-green-900'
  },
  {
    title: 'Awaiting MDN',
    value: 3,
    icon: Clock,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900'
  },
  {
    title: 'Failed/Timeout',
    value: 2,
    icon: AlertTriangle,
    color: 'text-red-600',
    bgColor: 'bg-red-100 dark:bg-red-900'
  }
]

function StatCard({ stat }) {
  const Icon = stat.icon;

  return (
    <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
      {/* Gradient background accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-slate-50/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:to-slate-800/20" />

      {/* Header */}
      <div className="relative flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">
          {stat.title}
        </h3>
        <div
          className={`rounded-lg p-2.5 transition-transform duration-300 group-hover:scale-110 ${stat.bgColor}`}
        >
          <Icon className={`h-5 w-5 ${stat.color}`} />
        </div>
      </div>

      {/* Value */}
      <div className="relative">
        <div className="text-3xl font-bold text-slate-900 dark:text-slate-100 transition-all duration-300 group-hover:scale-105">
          {stat.value}
        </div>
      </div>

      {/* Bottom accent line */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-slate-400 to-slate-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
      />
    </div>
  );
}
export default function OutboxPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Outbox</h1>
        <p className="text-muted-foreground">
          Track all sent messages and their delivery status
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {outboxStats.map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
      </div>

      {/* Outbox Table */}
      <OutboxTable />
    </div>
  )
}