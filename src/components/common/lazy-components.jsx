'use client'

import { lazy, Suspense } from 'react'
import { TableSkeleton, ChartSkeleton, CardSkeleton } from './loading-skeleton'

// Lazy load heavy components
export const LazyDataTable = lazy(() => 
  import('@/components/partners/partner-table').then(module => ({ 
    default: module.PartnerTable 
  }))
)

export const LazyCertificateTable = lazy(() => 
  import('@/components/certificates/certificate-table').then(module => ({ 
    default: module.CertificateTable 
  }))
)

export const LazyOutboxTable = lazy(() => 
  import('@/components/transmission/outbox-table').then(module => ({ 
    default: module.OutboxTable 
  }))
)

export const LazyInboxTable = lazy(() => 
  import('@/components/transmission/inbox-table').then(module => ({ 
    default: module.InboxTable 
  }))
)

export const LazyUserTable = lazy(() => 
  import('@/components/admin/user-table').then(module => ({ 
    default: module.UserTable 
  }))
)

export const LazyCharts = lazy(() => 
  import('@/components/dashboard/charts').then(module => ({
    default: {
      MessageVolumeChart: module.MessageVolumeChart,
      SuccessRateChart: module.SuccessRateChart,
      TopPartnersChart: module.TopPartnersChart,
      TransmissionTrendsChart: module.TransmissionTrendsChart
    }
  }))
)

// Wrapper components with suspense
export function DataTableWithSuspense({ component: Component, ...props }) {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <Component {...props} />
    </Suspense>
  )
}

export function ChartWithSuspense({ component: Component, ...props }) {
  return (
    <Suspense fallback={<ChartSkeleton />}>
      <Component {...props} />
    </Suspense>
  )
}

export function CardWithSuspense({ component: Component, ...props }) {
  return (
    <Suspense fallback={<CardSkeleton />}>
      <Component {...props} />
    </Suspense>
  )
}

// Pre-configured lazy components
export function LazyPartnerTable(props) {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <LazyDataTable {...props} />
    </Suspense>
  )
}

export function LazyCertTable(props) {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <LazyCertificateTable {...props} />
    </Suspense>
  )
}

export function LazyMessageVolumeChart(props) {
  return (
    <Suspense fallback={<ChartSkeleton />}>
      <LazyCharts.MessageVolumeChart {...props} />
    </Suspense>
  )
}