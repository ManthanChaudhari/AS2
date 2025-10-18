'use client'

import { Plus, Users, UserCheck, UserX, Shield } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UserTable } from '@/components/admin/user-table'

// Dummy user stats
const userStats = [
  {
    title: 'Total Users',
    value: 8,
    icon: Users,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100 dark:bg-blue-900'
  },
  {
    title: 'Active Users',
    value: 5,
    icon: UserCheck,
    color: 'text-green-600',
    bgColor: 'bg-green-100 dark:bg-green-900'
  },
  {
    title: 'Inactive Users',
    value: 2,
    icon: UserX,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100 dark:bg-gray-900'
  },
  {
    title: 'Admin Users',
    value: 1,
    icon: Shield,
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

export default function UsersPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage user accounts, roles, and permissions
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {userStats.map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
      </div>

      {/* User Table */}
      <UserTable />
    </div>
  )
}