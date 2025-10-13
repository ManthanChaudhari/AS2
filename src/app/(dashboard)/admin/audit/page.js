'use client'

import { useState } from 'react'
import { 
  Search, 
  Filter, 
  Download, 
  Calendar,
  User,
  Activity,
  Shield,
  FileText,
  Settings,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  SortAsc,
  SortDesc,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

// Dummy audit log data
const auditLogs = [
  {
    id: 1,
    timestamp: '2024-10-13T10:15:30Z',
    user: 'john.doe@acmepharma.com',
    userName: 'John Doe',
    action: 'Partner Created',
    category: 'partner_management',
    resource: 'FDA FAERS',
    resourceId: 'partner-001',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    status: 'success',
    details: {
      partnerName: 'FDA FAERS',
      organizationType: 'regulatory',
      as2Id: 'FDA-FAERS-001'
    },
    sessionId: 'sess_abc123def456'
  },
  {
    id: 2,
    timestamp: '2024-10-13T09:45:22Z',
    user: 'jane.smith@acmepharma.com',
    userName: 'Jane Smith',
    action: 'Certificate Uploaded',
    category: 'certificate_management',
    resource: 'Pfizer Encryption Certificate',
    resourceId: 'cert-002',
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    status: 'success',
    details: {
      certificateType: 'encryption',
      owner: 'Pfizer Inc.',
      serialNumber: '2A3B4C5D6E7F8901',
      validTo: '2024-10-28T23:59:59Z'
    },
    sessionId: 'sess_def456ghi789'
  },
  {
    id: 3,
    timestamp: '2024-10-13T08:30:15Z',
    user: 'mike.johnson@acmepharma.com',
    userName: 'Mike Johnson',
    action: 'Message Sent',
    category: 'transmission',
    resource: 'case_report_20241013_001.xml',
    resourceId: 'msg-001',
    ipAddress: '192.168.1.102',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    status: 'success',
    details: {
      partner: 'FDA FAERS',
      fileSize: '45.2 KB',
      messageId: 'MSG-20241013-083015-001',
      encryption: 'AES-256',
      signing: 'SHA-256'
    },
    sessionId: 'sess_ghi789jkl012'
  },
  {
    id: 4,
    timestamp: '2024-10-12T16:20:45Z',
    user: 'sarah.wilson@acmepharma.com',
    userName: 'Sarah Wilson',
    action: 'Login Failed',
    category: 'authentication',
    resource: 'User Login',
    resourceId: 'auth-001',
    ipAddress: '203.0.113.45',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
    status: 'failure',
    details: {
      reason: 'Invalid password',
      attemptCount: 3,
      accountLocked: false
    },
    sessionId: null
  },
  {
    id: 5,
    timestamp: '2024-10-12T14:55:30Z',
    user: 'admin@acmepharma.com',
    userName: 'System Administrator',
    action: 'User Role Updated',
    category: 'user_management',
    resource: 'David Brown',
    resourceId: 'user-005',
    ipAddress: '192.168.1.103',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    status: 'success',
    details: {
      previousRole: 'user',
      newRole: 'partner_manager',
      updatedBy: 'System Administrator'
    },
    sessionId: 'sess_jkl012mno345'
  },
  {
    id: 6,
    timestamp: '2024-10-12T13:10:18Z',
    user: 'lisa.davis@acmepharma.com',
    userName: 'Lisa Davis',
    action: 'System Settings Updated',
    category: 'system_configuration',
    resource: 'AS2 Configuration',
    resourceId: 'config-001',
    ipAddress: '192.168.1.104',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    status: 'success',
    details: {
      setting: 'MDN Timeout',
      previousValue: '10 minutes',
      newValue: '15 minutes'
    },
    sessionId: 'sess_mno345pqr678'
  },
  {
    id: 7,
    timestamp: '2024-10-12T11:25:42Z',
    user: 'david.brown@acmepharma.com',
    userName: 'David Brown',
    action: 'Partner Connection Test',
    category: 'partner_management',
    resource: 'Health Canada',
    resourceId: 'partner-003',
    ipAddress: '192.168.1.105',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    status: 'failure',
    details: {
      testType: 'connection_test',
      error: 'Connection timeout',
      responseTime: '30000ms',
      endpoint: 'https://healthcanada.gc.ca:8443/as2'
    },
    sessionId: 'sess_pqr678stu901'
  },
  {
    id: 8,
    timestamp: '2024-10-11T15:40:33Z',
    user: 'john.doe@acmepharma.com',
    userName: 'John Doe',
    action: 'Certificate Rotated',
    category: 'certificate_management',
    resource: 'Acme Pharma Signing Certificate',
    resourceId: 'cert-001',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    status: 'success',
    details: {
      oldCertificate: 'Serial: 0A1B2C3D4E5F6789',
      newCertificate: 'Serial: 1F2E3D4C5B6A7890',
      rotationType: 'scheduled',
      validTo: '2025-06-01T23:59:59Z'
    },
    sessionId: 'sess_stu901vwx234'
  }
]

const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'authentication', label: 'Authentication' },
  { value: 'user_management', label: 'User Management' },
  { value: 'partner_management', label: 'Partner Management' },
  { value: 'certificate_management', label: 'Certificate Management' },
  { value: 'transmission', label: 'File Transmission' },
  { value: 'system_configuration', label: 'System Configuration' }
]

const statuses = [
  { value: 'all', label: 'All Statuses' },
  { value: 'success', label: 'Success' },
  { value: 'failure', label: 'Failure' },
  { value: 'warning', label: 'Warning' }
]

function getActionIcon(category) {
  switch (category) {
    case 'authentication':
      return <Shield className="h-4 w-4" />
    case 'user_management':
      return <User className="h-4 w-4" />
    case 'partner_management':
      return <User className="h-4 w-4" />
    case 'certificate_management':
      return <Shield className="h-4 w-4" />
    case 'transmission':
      return <FileText className="h-4 w-4" />
    case 'system_configuration':
      return <Settings className="h-4 w-4" />
    default:
      return <Activity className="h-4 w-4" />
  }
}

function getStatusBadge(status) {
  switch (status) {
    case 'success':
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Success</Badge>
    case 'failure':
      return <Badge variant="destructive">Failure</Badge>
    case 'warning':
      return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Warning</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

function getStatusIcon(status) {
  switch (status) {
    case 'success':
      return <CheckCircle className="h-4 w-4 text-green-600" />
    case 'failure':
      return <XCircle className="h-4 w-4 text-red-600" />
    case 'warning':
      return <AlertTriangle className="h-4 w-4 text-yellow-600" />
    default:
      return <Activity className="h-4 w-4 text-gray-600" />
  }
}

function AuditLogDetailDialog({ log }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Audit Log Details</DialogTitle>
          <DialogDescription>
            Detailed information for audit log entry #{log.id}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground">Timestamp</Label>
              <p className="font-medium">{new Date(log.timestamp).toLocaleString()}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">User</Label>
              <p className="font-medium">{log.userName}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Action</Label>
              <p className="font-medium">{log.action}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Status</Label>
              {getStatusBadge(log.status)}
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Category</Label>
              <p className="font-medium">{log.category.replace('_', ' ')}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Resource</Label>
              <p className="font-medium">{log.resource}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">IP Address</Label>
              <p className="font-mono text-sm">{log.ipAddress}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Session ID</Label>
              <p className="font-mono text-sm">{log.sessionId || 'N/A'}</p>
            </div>
          </div>
          
          <div>
            <Label className="text-sm text-muted-foreground">User Agent</Label>
            <p className="font-mono text-xs break-all">{log.userAgent}</p>
          </div>

          {log.details && (
            <div>
              <Label className="text-sm text-muted-foreground">Additional Details</Label>
              <div className="mt-2 p-3 bg-muted rounded-lg">
                <pre className="text-xs whitespace-pre-wrap">
                  {JSON.stringify(log.details, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState(auditLogs)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateRange, setDateRange] = useState('7days')
  const [sortField, setSortField] = useState('timestamp')
  const [sortDirection, setSortDirection] = useState('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)

  // Filter and sort logs
  const filteredLogs = logs
    .filter(log => {
      const matchesSearch = log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           log.resource.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = categoryFilter === 'all' || log.category === categoryFilter
      const matchesStatus = statusFilter === 'all' || log.status === statusFilter
      
      // Date range filter
      let matchesDate = true
      if (dateRange !== 'all') {
        const logDate = new Date(log.timestamp)
        const now = new Date()
        const daysAgo = {
          '1day': 1,
          '7days': 7,
          '30days': 30,
          '90days': 90
        }[dateRange] || 7
        
        const cutoffDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000))
        matchesDate = logDate >= cutoffDate
      }
      
      return matchesSearch && matchesCategory && matchesStatus && matchesDate
    })
    .sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]
      
      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const paginatedLogs = filteredLogs.slice(startIndex, startIndex + pageSize)

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const handleExport = () => {
    console.log('Exporting audit logs...')
    // In real app: generate and download CSV/PDF
  }

  const getSortIcon = (field) => {
    if (sortField !== field) return null
    return sortDirection === 'asc' ? 
      <SortAsc className="ml-2 h-4 w-4" /> : 
      <SortDesc className="ml-2 h-4 w-4" />
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
          <p className="text-muted-foreground">
            Comprehensive activity tracking and compliance logging
          </p>
        </div>
        <Button onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Export Logs
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredLogs.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {Math.round((filteredLogs.filter(l => l.status === 'success').length / filteredLogs.length) * 100)}%
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Events</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {filteredLogs.filter(l => l.status === 'failure').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Users</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(filteredLogs.map(l => l.user)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-5">
            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Date Range</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1day">Last 24 hours</SelectItem>
                  <SelectItem value="7days">Last 7 days</SelectItem>
                  <SelectItem value="30days">Last 30 days</SelectItem>
                  <SelectItem value="90days">Last 90 days</SelectItem>
                  <SelectItem value="all">All time</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Page Size</Label>
              <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Audit Log Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-4 text-left">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort('timestamp')}
                        className="h-auto p-0 font-medium"
                      >
                        Timestamp
                        {getSortIcon('timestamp')}
                      </Button>
                    </th>
                    <th className="p-4 text-left">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort('user')}
                        className="h-auto p-0 font-medium"
                      >
                        User
                        {getSortIcon('user')}
                      </Button>
                    </th>
                    <th className="p-4 text-left">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort('action')}
                        className="h-auto p-0 font-medium"
                      >
                        Action
                        {getSortIcon('action')}
                      </Button>
                    </th>
                    <th className="p-4 text-left">Resource</th>
                    <th className="p-4 text-left">Status</th>
                    <th className="p-4 text-left">IP Address</th>
                    <th className="p-4 text-left">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedLogs.map((log) => (
                    <tr key={log.id} className="border-b hover:bg-muted/50">
                      <td className="p-4">
                        <div className="text-sm">
                          {new Date(log.timestamp).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-sm">{log.userName}</div>
                        <div className="text-xs text-muted-foreground font-mono">{log.user}</div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          {getActionIcon(log.category)}
                          <div>
                            <div className="font-medium text-sm">{log.action}</div>
                            <div className="text-xs text-muted-foreground">
                              {log.category.replace('_', ' ')}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-sm">{log.resource}</div>
                        <div className="text-xs text-muted-foreground font-mono">{log.resourceId}</div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(log.status)}
                          {getStatusBadge(log.status)}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-mono text-sm">{log.ipAddress}</span>
                      </td>
                      <td className="p-4">
                        <AuditLogDetailDialog log={log} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-2">
              <p className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to {Math.min(startIndex + pageSize, filteredLogs.length)} of {filteredLogs.length} entries
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}