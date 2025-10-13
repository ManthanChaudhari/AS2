'use client'

import { useState } from 'react'
import { 
  BarChart3, 
  Download, 
  Calendar,
  TrendingUp,
  TrendingDown,
  Users,
  Send,
  Inbox,
  CheckCircle,
  XCircle,
  Clock,
  Filter
} from 'lucide-react'
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Dummy report data
const transmissionVolumeData = [
  { date: '2024-10-01', sent: 45, received: 38, failed: 2 },
  { date: '2024-10-02', sent: 52, received: 41, failed: 1 },
  { date: '2024-10-03', sent: 48, received: 45, failed: 3 },
  { date: '2024-10-04', sent: 61, received: 52, failed: 2 },
  { date: '2024-10-05', sent: 55, received: 48, failed: 1 },
  { date: '2024-10-06', sent: 67, received: 58, failed: 4 },
  { date: '2024-10-07', sent: 73, received: 62, failed: 2 },
  { date: '2024-10-08', sent: 69, received: 55, failed: 3 },
  { date: '2024-10-09', sent: 78, received: 67, failed: 1 },
  { date: '2024-10-10', sent: 82, received: 71, failed: 2 },
  { date: '2024-10-11', sent: 76, received: 64, failed: 5 },
  { date: '2024-10-12', sent: 89, received: 78, failed: 3 },
  { date: '2024-10-13', sent: 94, received: 82, failed: 2 }
]

const partnerActivityData = [
  { partner: 'FDA FAERS', sent: 156, received: 89, successRate: 98.5, avgResponseTime: 1.2 },
  { partner: 'EMA EudraVigilance', sent: 134, received: 67, successRate: 97.8, avgResponseTime: 1.8 },
  { partner: 'Health Canada', sent: 89, received: 45, successRate: 96.2, avgResponseTime: 2.1 },
  { partner: 'MHRA', sent: 67, received: 34, successRate: 99.1, avgResponseTime: 1.5 },
  { partner: 'Pfizer Inc.', sent: 45, received: 123, successRate: 100, avgResponseTime: 0.9 },
  { partner: 'Johnson & Johnson', sent: 78, received: 156, successRate: 99.1, avgResponseTime: 1.1 },
  { partner: 'Novartis AG', sent: 56, received: 89, successRate: 98.9, avgResponseTime: 1.3 }
]

const successRateData = [
  { name: 'Successful', value: 892, color: '#22c55e' },
  { name: 'Failed', value: 45, color: '#ef4444' },
  { name: 'Pending', value: 23, color: '#f59e0b' }
]

const slaMetricsData = [
  { metric: 'Message Delivery Time', target: '< 5 seconds', actual: '2.3 seconds', status: 'good' },
  { metric: 'MDN Receipt Time', target: '< 15 minutes', actual: '3.2 minutes', status: 'good' },
  { metric: 'System Availability', target: '> 99.5%', actual: '99.8%', status: 'good' },
  { metric: 'Certificate Expiry Alerts', target: '30 days notice', actual: '45 days notice', status: 'good' },
  { metric: 'Failed Transmission Rate', target: '< 2%', actual: '1.2%', status: 'good' },
  { metric: 'Partner Response Time', target: '< 10 seconds', actual: '12.5 seconds', status: 'warning' }
]

const monthlyTrendsData = [
  { month: 'Jan 2024', volume: 1245, successRate: 97.8, partners: 12 },
  { month: 'Feb 2024', volume: 1389, successRate: 98.1, partners: 13 },
  { month: 'Mar 2024', volume: 1567, successRate: 97.9, partners: 14 },
  { month: 'Apr 2024', volume: 1423, successRate: 98.3, partners: 15 },
  { month: 'May 2024', volume: 1678, successRate: 98.0, partners: 16 },
  { month: 'Jun 2024', volume: 1834, successRate: 98.5, partners: 17 },
  { month: 'Jul 2024', volume: 1756, successRate: 98.2, partners: 18 },
  { month: 'Aug 2024', volume: 1923, successRate: 98.7, partners: 19 },
  { month: 'Sep 2024', volume: 2045, successRate: 98.4, partners: 20 },
  { month: 'Oct 2024', volume: 2156, successRate: 98.6, partners: 21 }
]

function StatCard({ title, value, change, changeType, icon: Icon, color }) {
  const getChangeColor = () => {
    if (changeType === 'increase') {
      return 'text-green-600 dark:text-green-400'
    } else if (changeType === 'decrease') {
      return 'text-red-600 dark:text-red-400'
    } else {
      return 'text-gray-600 dark:text-gray-400'
    }
  }

  const getChangeIcon = () => {
    if (changeType === 'increase') {
      return <TrendingUp className="h-3 w-3" />
    } else if (changeType === 'decrease') {
      return <TrendingDown className="h-3 w-3" />
    } else {
      return null
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline space-x-2">
          <div className="text-2xl font-bold">{value}</div>
          {change && (
            <div className={`flex items-center space-x-1 text-xs ${getChangeColor()}`}>
              {getChangeIcon()}
              <span>{Math.abs(change)}%</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function SLAMetricCard({ metric }) {
  const getStatusColor = () => {
    switch (metric.status) {
      case 'good':
        return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300'
      case 'warning':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300'
      case 'critical':
        return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300'
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const getStatusIcon = () => {
    switch (metric.status) {
      case 'good':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'warning':
        return <Clock className="h-4 w-4 text-yellow-600" />
      case 'critical':
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-sm">{metric.metric}</h3>
          {getStatusIcon()}
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Target:</span>
            <span className="font-medium">{metric.target}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Actual:</span>
            <span className={`font-medium ${getStatusColor()}`}>{metric.actual}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('30days')
  const [selectedPartner, setSelectedPartner] = useState('all')
  const [reportType, setReportType] = useState('summary')

  const handleExport = (format) => {
    console.log(`Exporting report in ${format} format`)
    // In real app: generate and download report
  }

  const handleGenerateReport = () => {
    console.log('Generating custom report with filters:', { dateRange, selectedPartner, reportType })
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transmission Reports</h1>
          <p className="text-muted-foreground">
            Analytics and reporting for AS2 file transmissions
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => handleExport('csv')}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={() => handleExport('pdf')}>
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          <Button onClick={() => handleExport('excel')}>
            <Download className="mr-2 h-4 w-4" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Report Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Report Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label>Date Range</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 days</SelectItem>
                  <SelectItem value="30days">Last 30 days</SelectItem>
                  <SelectItem value="90days">Last 90 days</SelectItem>
                  <SelectItem value="1year">Last year</SelectItem>
                  <SelectItem value="custom">Custom range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Partner</Label>
              <Select value={selectedPartner} onValueChange={setSelectedPartner}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Partners</SelectItem>
                  <SelectItem value="fda">FDA FAERS</SelectItem>
                  <SelectItem value="ema">EMA EudraVigilance</SelectItem>
                  <SelectItem value="hc">Health Canada</SelectItem>
                  <SelectItem value="mhra">MHRA</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="summary">Summary Report</SelectItem>
                  <SelectItem value="detailed">Detailed Report</SelectItem>
                  <SelectItem value="compliance">Compliance Report</SelectItem>
                  <SelectItem value="performance">Performance Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button onClick={handleGenerateReport} className="w-full">
                Generate Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Messages"
          value="2,156"
          change={12.5}
          changeType="increase"
          icon={Send}
          color="text-blue-600"
        />
        <StatCard
          title="Success Rate"
          value="98.6%"
          change={0.3}
          changeType="increase"
          icon={CheckCircle}
          color="text-green-600"
        />
        <StatCard
          title="Active Partners"
          value="21"
          change={5.0}
          changeType="increase"
          icon={Users}
          color="text-purple-600"
        />
        <StatCard
          title="Avg Response Time"
          value="2.3s"
          change={-8.2}
          changeType="decrease"
          icon={Clock}
          color="text-orange-600"
        />
      </div>

      {/* Report Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="volume">Volume Analysis</TabsTrigger>
          <TabsTrigger value="partners">Partner Activity</TabsTrigger>
          <TabsTrigger value="sla">SLA Metrics</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Daily Transmission Volume</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={transmissionVolumeData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="date" 
                      className="text-muted-foreground"
                      tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis className="text-muted-foreground" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="sent" stroke="#3b82f6" strokeWidth={2} name="Messages Sent" />
                    <Line type="monotone" dataKey="received" stroke="#22c55e" strokeWidth={2} name="Messages Received" />
                    <Line type="monotone" dataKey="failed" stroke="#ef4444" strokeWidth={2} name="Failed Messages" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Success Rate Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={successRateData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {successRateData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center space-x-6 mt-4">
                  {successRateData.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-muted-foreground">
                        {item.name}: {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Volume Analysis Tab */}
        <TabsContent value="volume" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Transmission Volume Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={transmissionVolumeData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="date" 
                    className="text-muted-foreground"
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis className="text-muted-foreground" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="sent" 
                    stackId="1"
                    stroke="#3b82f6" 
                    fill="#3b82f6"
                    fillOpacity={0.6}
                    name="Messages Sent"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="received" 
                    stackId="2"
                    stroke="#22c55e" 
                    fill="#22c55e"
                    fillOpacity={0.6}
                    name="Messages Received"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Partner Activity Tab */}
        <TabsContent value="partners" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Partner Activity Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {partnerActivityData.map((partner, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium">{partner.partner}</h3>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                        <span>Sent: {partner.sent}</span>
                        <span>Received: {partner.received}</span>
                        <span>Avg Response: {partner.avgResponseTime}s</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">{partner.successRate}%</div>
                      <div className="text-sm text-muted-foreground">Success Rate</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SLA Metrics Tab */}
        <TabsContent value="sla" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {slaMetricsData.map((metric, index) => (
              <SLAMetricCard key={index} metric={metric} />
            ))}
          </div>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={monthlyTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-muted-foreground" />
                  <YAxis yAxisId="left" className="text-muted-foreground" />
                  <YAxis yAxisId="right" orientation="right" className="text-muted-foreground" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar yAxisId="left" dataKey="volume" fill="#3b82f6" name="Message Volume" />
                  <Line yAxisId="right" type="monotone" dataKey="successRate" stroke="#22c55e" strokeWidth={2} name="Success Rate %" />
                  <Line yAxisId="right" type="monotone" dataKey="partners" stroke="#8b5cf6" strokeWidth={2} name="Active Partners" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}