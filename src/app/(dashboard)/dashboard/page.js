'use client'

import { StatsCards } from '@/components/dashboard/stats-cards'
import { ActivityTimeline } from '@/components/dashboard/activity-timeline'
import { SystemHealth } from '@/components/dashboard/system-health'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { 
  MessageVolumeChart, 
  SuccessRateChart, 
  TopPartnersChart, 
  TransmissionTrendsChart 
} from '@/components/dashboard/charts'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg border border-ocean-200 dark:border-ocean-800 p-6">
        <h1 className="text-3xl font-bold tracking-tight text-ocean-800 dark:text-ocean-200">Dashboard</h1>
        <p className="text-ocean-600 dark:text-ocean-400 mt-2">
          Welcome to your AS2 Pharmacovigilance Portal. Monitor your file transmissions and system health.
        </p>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      {/* Quick Actions */}
      <QuickActions />

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <MessageVolumeChart />
        <SuccessRateChart />
      </div>

      {/* Secondary Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <TopPartnersChart />
        <TransmissionTrendsChart />
      </div>

      {/* Activity and Health Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ActivityTimeline />
        <SystemHealth />
      </div>
    </div>
  )
}