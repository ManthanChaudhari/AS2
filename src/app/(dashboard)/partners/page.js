'use client'

import Link from 'next/link'
import { Plus, Users, AlertTriangle, CheckCircle, Clock } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PartnerTable } from '@/components/partners/partner-table'

// Dummy summary stats
const partnerStats = [
  {
    title: 'Total Partners',
    value: 8,
    icon: Users,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100 dark:bg-blue-900'
  },
  {
    title: 'Active Partners',
    value: 5,
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-100 dark:bg-green-900'
  },
  {
    title: 'Testing Partners',
    value: 2,
    icon: Clock,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900'
  },
  {
    title: 'Certificate Alerts',
    value: 3,
    icon: AlertTriangle,
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

export default function PartnersPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Partners</h1>
          <p className="text-muted-foreground">
            Manage your AS2 trading partners and their configurations
          </p>
        </div>
        <Button asChild>
          <Link href="/partners/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Partner
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {partnerStats.map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
      </div>

      {/* Partner Table */}
      <PartnerTable />
    </div>
  )
}