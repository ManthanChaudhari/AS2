'use client'

import { useState } from 'react'
import { 
  MoreHorizontal, 
  Eye, 
  Download, 
  RefreshCw,
  Search,
  SortAsc,
  SortDesc,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Inbox,
  Package,
  RotateCcw
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// Dummy inbox messages data
const inboxMessages = [
  {
    id: 'MSG-20241013-112030-001',
    messageId: 'MSG-20241013-112030-001',
    from: 'FDA FAERS',
    fromAs2Id: 'FDA-FAERS-001',
    filename: 'acknowledgment_20241013_001.xml',
    receivedAt: '2024-10-13T11:20:30Z',
    status: 'validated',
    validationStatus: 'passed',
    routingStatus: 'routed',
    fileSize: 23456,
    priority: 'normal',
    messageType: 'acknowledgment'
  },
  {
    id: 'MSG-20241013-103015-002',
    messageId: 'MSG-20241013-103015-002',
    from: 'EMA EudraVigilance',
    fromAs2Id: 'EMA-EV-002',
    filename: 'icsr_response_20241013_002.xml',
    receivedAt: '2024-10-13T10:30:15Z',
    status: 'processing',
    validationStatus: 'processing',
    routingStatus: 'pending',
    fileSize: 67890,
    priority: 'urgent',
    messageType: 'icsr'
  },
  {
    id: 'MSG-20241013-094520-003',
    messageId: 'MSG-20241013-094520-003',
    from: 'Health Canada',
    fromAs2Id: 'HC-CANADA-001',
    filename: 'safety_update_20241013_003.xml',
    receivedAt: '2024-10-13T09:45:20Z',
    status: 'validation_failed',
    validationStatus: 'failed',
    routingStatus: 'failed',
    fileSize: 45678,
    priority: 'normal',
    messageType: 'safety_report',
    validationErrors: ['XSD validation failed: Missing required element', 'Business rule violation: Invalid case ID format']
  },
  {
    id: 'MSG-20241012-163045-004',
    messageId: 'MSG-20241012-163045-004',
    from: 'Pfizer Inc.',
    fromAs2Id: 'PFIZER-001',
    filename: 'periodic_report_20241012_004.xml',
    receivedAt: '2024-10-12T16:30:45Z',
    status: 'routed',
    validationStatus: 'passed',
    routingStatus: 'routed',
    fileSize: 123456,
    priority: 'normal',
    messageType: 'periodic_report',
    routedTo: 'Veeva Vault'
  },
  {
    id: 'MSG-20241012-142210-005',
    messageId: 'MSG-20241012-142210-005',
    from: 'Johnson & Johnson',
    fromAs2Id: 'JNJ-001',
    filename: 'case_followup_20241012_005.xml',
    receivedAt: '2024-10-12T14:22:10Z',
    status: 'routing_failed',
    validationStatus: 'passed',
    routingStatus: 'failed',
    fileSize: 78901,
    priority: 'urgent',
    messageType: 'icsr',
    routingError: 'Target system unavailable'
  },
  {
    id: 'MSG-20241012-111530-006',
    messageId: 'MSG-20241012-111530-006',
    from: 'Novartis AG',
    fromAs2Id: 'NOVARTIS-001',
    filename: 'clinical_data_20241012_006.xml',
    receivedAt: '2024-10-12T11:15:30Z',
    status: 'new',
    validationStatus: 'pending',
    routingStatus: 'pending',
    fileSize: 89012,
    priority: 'normal',
    messageType: 'clinical_data'
  },
  {
    id: 'MSG-20241011-095520-007',
    messageId: 'MSG-20241011-095520-007',
    from: 'Roche Holding AG',
    fromAs2Id: 'ROCHE-001',
    filename: 'adverse_event_20241011_007.xml',
    receivedAt: '2024-10-11T09:55:20Z',
    status: 'routed',
    validationStatus: 'passed',
    routingStatus: 'routed',
    fileSize: 56789,
    priority: 'normal',
    messageType: 'icsr',
    routedTo: 'Argus Safety'
  },
  {
    id: 'MSG-20241011-073015-008',
    messageId: 'MSG-20241011-073015-008',
    from: 'MHRA',
    fromAs2Id: 'MHRA-UK-001',
    filename: 'regulatory_query_20241011_008.xml',
    receivedAt: '2024-10-11T07:30:15Z',
    status: 'validated',
    validationStatus: 'passed',
    routingStatus: 'pending',
    fileSize: 34567,
    priority: 'urgent',
    messageType: 'regulatory_query'
  }
]

const messageTypeLabels = {
  icsr: 'ICSR',
  acknowledgment: 'Acknowledgment',
  safety_report: 'Safety Report',
  periodic_report: 'Periodic Report',
  clinical_data: 'Clinical Data',
  regulatory_query: 'Regulatory Query'
}

function getStatusBadge(status) {
  switch (status) {
    case 'new':
      return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">New</Badge>
    case 'processing':
      return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Processing</Badge>
    case 'validated':
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Validated</Badge>
    case 'validation_failed':
      return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Validation Failed</Badge>
    case 'routed':
      return <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">Routed</Badge>
    case 'routing_failed':
      return <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">Routing Failed</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

function getStatusIcon(status) {
  switch (status) {
    case 'new':
      return <Inbox className="h-4 w-4 text-blue-600" />
    case 'processing':
      return <Clock className="h-4 w-4 text-yellow-600" />
    case 'validated':
      return <CheckCircle className="h-4 w-4 text-green-600" />
    case 'validation_failed':
      return <XCircle className="h-4 w-4 text-red-600" />
    case 'routed':
      return <Package className="h-4 w-4 text-purple-600" />
    case 'routing_failed':
      return <AlertTriangle className="h-4 w-4 text-orange-600" />
    default:
      return <Clock className="h-4 w-4 text-gray-600" />
  }
}

function getValidationStatusBadge(status) {
  switch (status) {
    case 'passed':
      return <Badge variant="outline" className="text-green-600 border-green-600">Passed</Badge>
    case 'failed':
      return <Badge variant="outline" className="text-red-600 border-red-600">Failed</Badge>
    case 'processing':
      return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Processing</Badge>
    case 'pending':
      return <Badge variant="outline" className="text-gray-600 border-gray-600">Pending</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

function getRoutingStatusBadge(status, routedTo) {
  switch (status) {
    case 'routed':
      return (
        <div className="flex flex-col">
          <Badge variant="outline" className="text-purple-600 border-purple-600">Routed</Badge>
          {routedTo && <span className="text-xs text-muted-foreground mt-1">{routedTo}</span>}
        </div>
      )
    case 'failed':
      return <Badge variant="outline" className="text-red-600 border-red-600">Failed</Badge>
    case 'pending':
      return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Pending</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

function MessageActions({ message }) {
  const handleView = () => {
    console.log('View message:', message.id)
    // In real app: navigate to message detail page
  }

  const handleDownload = () => {
    console.log('Download message:', message.id)
  }

  const handleRevalidate = () => {
    console.log('Revalidate message:', message.id)
  }

  const handleReroute = () => {
    console.log('Reroute message:', message.id)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={handleView}>
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDownload}>
          <Download className="mr-2 h-4 w-4" />
          Download File
        </DropdownMenuItem>
        {message.validationStatus === 'failed' && (
          <DropdownMenuItem onClick={handleRevalidate}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Re-validate
          </DropdownMenuItem>
        )}
        {message.routingStatus === 'failed' && (
          <DropdownMenuItem onClick={handleReroute}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Re-route
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function InboxTable() {
  const [messages, setMessages] = useState(inboxMessages)
  const [selectedMessages, setSelectedMessages] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [partnerFilter, setPartnerFilter] = useState('all')
  const [validationFilter, setValidationFilter] = useState('all')
  const [routingFilter, setRoutingFilter] = useState('all')
  const [sortField, setSortField] = useState('receivedAt')
  const [sortDirection, setSortDirection] = useState('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  // Get unique partners for filter
  const uniquePartners = [...new Set(messages.map(m => m.from))]

  // Filter and sort messages
  const filteredMessages = messages
    .filter(message => {
      const matchesSearch = message.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           message.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           message.messageId.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === 'all' || message.status === statusFilter
      const matchesPartner = partnerFilter === 'all' || message.from === partnerFilter
      const matchesValidation = validationFilter === 'all' || message.validationStatus === validationFilter
      const matchesRouting = routingFilter === 'all' || message.routingStatus === routingFilter
      
      return matchesSearch && matchesStatus && matchesPartner && matchesValidation && matchesRouting
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
  const totalPages = Math.ceil(filteredMessages.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const paginatedMessages = filteredMessages.slice(startIndex, startIndex + pageSize)

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedMessages(paginatedMessages.map(m => m.id))
    } else {
      setSelectedMessages([])
    }
  }

  const handleSelectMessage = (messageId, checked) => {
    if (checked) {
      setSelectedMessages([...selectedMessages, messageId])
    } else {
      setSelectedMessages(selectedMessages.filter(id => id !== messageId))
    }
  }

  const handleBulkDownload = () => {
    console.log('Bulk download messages:', selectedMessages)
  }

  const handleBulkRevalidate = () => {
    console.log('Bulk revalidate messages:', selectedMessages)
  }

  const handleBulkReroute = () => {
    console.log('Bulk reroute messages:', selectedMessages)
  }

  const handleRefresh = () => {
    setLastUpdated(new Date())
    console.log('Refreshing inbox data...')
    // In real app: fetch latest data and show notification for new messages
  }

  const getSortIcon = (field) => {
    if (sortField !== field) return null
    return sortDirection === 'asc' ? 
      <SortAsc className="ml-2 h-4 w-4" /> : 
      <SortDesc className="ml-2 h-4 w-4" />
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      return 'Just now'
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays}d ago`
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <CardTitle>Inbox Messages</CardTitle>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="mr-1 h-4 w-4" />
              Last updated: {formatTimestamp(lastUpdated.toISOString())}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {selectedMessages.length > 0 && (
              <>
                <Button variant="outline" size="sm" onClick={handleBulkDownload}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Selected ({selectedMessages.length})
                </Button>
                <Button variant="outline" size="sm" onClick={handleBulkRevalidate}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Re-validate Selected
                </Button>
                <Button variant="outline" size="sm" onClick={handleBulkReroute}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Re-route Selected
                </Button>
              </>
            )}
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by filename, partner, or message ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="validated">Validated</SelectItem>
                <SelectItem value="validation_failed">Validation Failed</SelectItem>
                <SelectItem value="routed">Routed</SelectItem>
                <SelectItem value="routing_failed">Routing Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={partnerFilter} onValueChange={setPartnerFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by partner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Partners</SelectItem>
                {uniquePartners.map((partner) => (
                  <SelectItem key={partner} value={partner}>
                    {partner}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={validationFilter} onValueChange={setValidationFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Validation status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Validation</SelectItem>
                <SelectItem value="passed">Passed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Select value={routingFilter} onValueChange={setRoutingFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Routing status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Routing</SelectItem>
                <SelectItem value="routed">Routed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-4 text-left">
                    <Checkbox
                      checked={selectedMessages.length === paginatedMessages.length && paginatedMessages.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('messageId')}
                      className="h-auto p-0 font-medium"
                    >
                      Message ID
                      {getSortIcon('messageId')}
                    </Button>
                  </th>
                  <th className="p-4 text-left">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('from')}
                      className="h-auto p-0 font-medium"
                    >
                      From
                      {getSortIcon('from')}
                    </Button>
                  </th>
                  <th className="p-4 text-left">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('filename')}
                      className="h-auto p-0 font-medium"
                    >
                      Filename
                      {getSortIcon('filename')}
                    </Button>
                  </th>
                  <th className="p-4 text-left">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('receivedAt')}
                      className="h-auto p-0 font-medium"
                    >
                      Received At
                      {getSortIcon('receivedAt')}
                    </Button>
                  </th>
                  <th className="p-4 text-left">Validation</th>
                  <th className="p-4 text-left">Routing</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedMessages.map((message) => (
                  <tr key={message.id} className="border-b hover:bg-muted/50">
                    <td className="p-4">
                      <Checkbox
                        checked={selectedMessages.includes(message.id)}
                        onCheckedChange={(checked) => handleSelectMessage(message.id, checked)}
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(message.status)}
                        {getStatusBadge(message.status)}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-mono text-sm">{message.messageId}</div>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {messageTypeLabels[message.messageType] || message.messageType}
                        </Badge>
                        {message.priority === 'urgent' && (
                          <Badge variant="destructive" className="text-xs">Urgent</Badge>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium">{message.from}</div>
                      <div className="text-sm text-muted-foreground font-mono">
                        {message.fromAs2Id}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium">{message.filename}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatFileSize(message.fileSize)}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">
                        {new Date(message.receivedAt).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatTimestamp(message.receivedAt)}
                      </div>
                    </td>
                    <td className="p-4">
                      {getValidationStatusBadge(message.validationStatus)}
                      {message.validationErrors && (
                        <div className="text-xs text-red-600 mt-1">
                          {message.validationErrors.length} error(s)
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      {getRoutingStatusBadge(message.routingStatus, message.routedTo)}
                      {message.routingError && (
                        <div className="text-xs text-red-600 mt-1">
                          {message.routingError}
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <MessageActions message={message} />
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
              Showing {startIndex + 1} to {Math.min(startIndex + pageSize, filteredMessages.length)} of {filteredMessages.length} messages
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
              <SelectTrigger className="w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
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
  )
}