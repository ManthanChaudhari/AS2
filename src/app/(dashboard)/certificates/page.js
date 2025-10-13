'use client'

import Link from 'next/link'
import { Plus, Shield, AlertTriangle, CheckCircle, Archive } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CertificateTable } from '@/components/certificates/certificate-table'

// Dummy certificate stats
const certificateStats = [
  {
    title: 'Total Certificates',
    value: 8,
    icon: Shield,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100 dark:bg-blue-900'
  },
  {
    title: 'Active Certificates',
    value: 5,
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-100 dark:bg-green-900'
  },
  {
    title: 'Expiring Soon (<30 days)',
    value: 1,
    icon: AlertTriangle,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900'
  },
  {
    title: 'Expired/Archived',
    value: 2,
    icon: Archive,
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

export default function CertificatesPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Certificate Vault</h1>
          <p className="text-muted-foreground">
            Manage all certificates for secure AS2 communications
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" asChild>
            <Link href="/certificates/self">
              <Shield className="mr-2 h-4 w-4" />
              Your Certificates
            </Link>
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Upload Certificate
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {certificateStats.map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
      </div>

      {/* Certificate Table */}
      <CertificateTable />
    </div>
  )
}