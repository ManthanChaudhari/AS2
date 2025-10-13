'use client'

import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Cloud,
  Database,
  Zap,
  RefreshCw
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

// Dummy system health data
const systemServices = [
  {
    name: 'AWS Transfer Family',
    status: 'healthy',
    description: 'AS2 message processing',
    uptime: 99.9,
    lastCheck: '30 seconds ago',
    icon: Cloud,
    metrics: {
      messagesProcessed: 1247,
      avgResponseTime: '1.2s'
    }
  },
  {
    name: 'S3 Storage',
    status: 'healthy',
    description: 'File storage and retrieval',
    uptime: 100,
    lastCheck: '1 minute ago',
    icon: Database,
    metrics: {
      storageUsed: '2.4 TB',
      availableSpace: '97.6 TB'
    }
  },
  {
    name: 'Lambda Functions',
    status: 'degraded',
    description: 'Certificate validation & processing',
    uptime: 98.5,
    lastCheck: '2 minutes ago',
    icon: Zap,
    metrics: {
      executionsToday: 892,
      avgDuration: '850ms'
    }
  }
]

const overallHealth = {
  status: 'healthy',
  uptime: 99.2,
  lastIncident: '3 days ago',
  nextMaintenance: 'Sunday 2:00 AM UTC'
}

function ServiceStatus({ service }) {
  const Icon = service.icon

  const getStatusIcon = () => {
    switch (service.status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'degraded':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case 'down':
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <CheckCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusBadge = () => {
    switch (service.status) {
      case 'healthy':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Healthy</Badge>
      case 'degraded':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Degraded</Badge>
      case 'down':
        return <Badge variant="destructive">Down</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getUptimeColor = () => {
    if (service.uptime >= 99.5) return 'text-green-600'
    if (service.uptime >= 98) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="flex items-start space-x-3 p-4 border rounded-lg">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <h3 className="font-medium">{service.name}</h3>
          </div>
          {getStatusBadge()}
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {service.description}
        </p>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
            <span className={`font-medium ${getUptimeColor()}`}>
              {service.uptime}% uptime
            </span>
            <span>Last check: {service.lastCheck}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-3 text-xs">
          {Object.entries(service.metrics).map(([key, value]) => (
            <div key={key}>
              <span className="text-muted-foreground">
                {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
              </span>
              <span className="ml-1 font-medium">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function SystemHealth() {
  const handleRefresh = () => {
    console.log('Refreshing system health...')
    // In real app: trigger health check refresh
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>System Health</CardTitle>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Health Summary */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-medium">Overall System Status</span>
            </div>
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
              Operational
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>System Uptime</span>
              <span className="font-medium text-green-600">{overallHealth.uptime}%</span>
            </div>
            <Progress value={overallHealth.uptime} className="h-2" />
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4 text-xs text-muted-foreground">
            <div>
              <span>Last incident: </span>
              <span className="font-medium">{overallHealth.lastIncident}</span>
            </div>
            <div>
              <span>Next maintenance: </span>
              <span className="font-medium">{overallHealth.nextMaintenance}</span>
            </div>
          </div>
        </div>

        {/* Individual Services */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-muted-foreground">Service Status</h4>
          {systemServices.map((service, index) => (
            <ServiceStatus key={index} service={service} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}