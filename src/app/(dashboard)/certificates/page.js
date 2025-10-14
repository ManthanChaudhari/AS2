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