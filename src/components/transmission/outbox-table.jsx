'use client'

import { useState } from 'react'
import { 
  MoreHorizontal, 
  Eye, 
  Download, 
  RefreshCw,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Send
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

// Dummy outbox messages data
const outboxMessages = [
  {
    id: 'MSG-20241013-101530-001',
    recipient: 'FDA FAERS',
    filename: 'case_report_20241013_001.xml',
    sentAt: '2024-10-13T10:15:30Z',
    status: 'mdn_received',
    mdnStatus: 'received',
    ack2Status: 'accepted',
    priority: 'normal',
    size: 45678,
    messageId: 'MSG-20241013-101530-001'
  },
  {
    id: 'MSG-20241013-094520-002',
    recipient: 'EMA EudraVigilance',
    filename: 'adverse_event_20241013_002.xml',
    sentAt: '2024-10-13T09:45:20Z',
    status: 'business_ack',
    mdnStatus: 'received',
    ack2Status: 'accepted',
    priority: 'urgent',
    size: 67890,
    messageId: 'MSG-20241013-094520-002'
  },
  {
    id: 'MSG-20241013-083015-003',
    recipient: 'Health Canada',
    filename: 'icsr_batch_20241013_003.xml',
    sentAt: '2024-10-13T08:30:15Z',
    status: 'awaiting_mdn',
    mdnStatus: 'awaiting',
    ack2Status: 'pending',
    priority: 'normal',
    size: 123456,
    messageId: 'MSG-20241013-083015-003'
  },
  {
    id: 'MSG-20241012-163045-004',
    recipient: 'MHRA',
    filename: 'safety_report_20241012_004.xml',
    sentAt: '2024-10-12T16:30:45Z',
    status: 'failed',
    mdnStatus: 'timeout',
    ack2Status: 'failed',
    priority: 'normal',
    size: 34567,
    messageId: 'MSG-20241012-163045-004'
  },
  {
    id: 'MSG-20241012-142210-005',
    recipient: 'Pfizer Inc.',
    filename: 'acknowledgment_20241012_005.xml',
    sentAt: '2024-10-12T14:22:10Z',
    status: 'mdn_received',
    mdnStatus: 'received',
    ack2Status: 'pending',
    priority: 'normal',
    size: 23456,
    messageId: 'MSG-20241012-142210-005'
  },
  {
    id: 'MSG-20241012-111530-006',
    recipient: 'Johnson & Johnson',
    filename: 'case_followup_20241012_006.xml',
    sentAt: '2024-10-12T11:15:30Z',
    status: 'business_ack',
    mdnStatus: 'received',
    ack2Status: 'accepted',
    priority: 'urgent',
    size: 78901,
    messageId: 'MSG-20241012-111530-006'
  },
  {
    id: 'MSG-20241011-095520-007',
    recipient: 'Novartis AG',
    filename: 'periodic_report_20241011_007.xml',
    sentAt: '2024-10-11T09:55:20Z',
    status: 'mdn_timeout',
    mdnStatus: 'timeout',
    ack2Status: 'failed',
    priority: 'normal',
    size: 56789,
    messageId: 'MSG-20241011-095520-007'
  },
  {
    id: 'MSG-20241011-073015-008',
    recipient: 'Roche Holding AG',
    filename: 'clinical_trial_20241011_008.xml',
    sentAt: '2024-10-11T07:30:15Z',
    status: 'ack2_rejected',
    mdnStatus: 'received',
    ack2Status: 'rejected',
    priority: 'normal',
    size: 89012,
    messageId: 'MSG-20241011-073015-008'
  }
]

const statusLabels = {
  sending: 'Sending',
  sent: 'Sent',
  mdn_received: 'MDN Received',
  business_ack: 'Business ACK',
  failed: 'Failed',
  awaiting_mdn: 'Awaiting MDN',
  mdn_timeout: 'MDN Timeout',
  ack2_rejected: 'ACK2 Rejected'
}

function getStatusBadge(status) {
  switch (status) {
    case 'sending':
      return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300">Sending</Badge>
    case 'sent':
      return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Sent</Badge>
    case 'mdn_received':
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">MDN Received</Badge>
    case 'business_ack':
      return <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300">Business ACK</Badge>
    case 'failed':
      return <Badge variant="destructive">Failed</Badge>
    case 'awaiting_mdn':
      return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Awaiting MDN</Badge>
    case 'mdn_timeout':
      return <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">MDN Timeout</Badge>
    case 'ack2_rejected':
      return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">ACK2 Rejected</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

function getStatusIcon(status) {
  switch (status) {
    case 'sending':
      return <Clock className="h-4 w-4 text-gray-600" />
    case 'sent':
      return <Send className="h-4 w-4 text-blue-600" />
    case 'mdn_received':
      return <CheckCircle className="h-4 w-4 text-green-600" />
    case 'business_ack':
      return <CheckCircle className="h-4 w-4 text-emerald-600" />
    case 'failed':
      return <XCircle className="h-4 w-4 text-red-600" />
    case 'awaiting_mdn':
      return <Clock className="h-4 w-4 text-yellow-600" />
    case 'mdn_timeout':
      return <AlertTriangle className="h-4 w-4 text-orange-600" />
    case 'ack2_rejected':
      return <XCircle className="h-4 w-4 text-red-600" />
    default:
      return <Clock className="h-4 w-4 text-gray-600" />
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

  const handleResend = () => {
    console.log('Resend message:', message.id)
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
        {(message.status === 'failed' || message.status === 'mdn_timeout') && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleResend}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Resend Message
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function OutboxTable() {
  const [messages, setMessages] = useState(outboxMessages)
  const [selectedMessages, setSelectedMessages] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [partnerFilter, setPartnerFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [sortField, setSortField] = useState('sentAt')
  const [sortDirection, setSortDirection] = useState('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  // Get unique partners for filter
  const uniquePartners = [...new Set(messages.map(m => m.recipient))]

  // Filter and sort messages
  const filteredMessages = messages
    .filter(message => {
      const matchesSearch = message.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           message.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           message.messageId.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === 'all' || message.status === statusFilter
      const matchesPartner = partnerFilter === 'all' || message.recipient === partnerFilter
      const matchesPriority = priorityFilter === 'all' || message.priority === priorityFilter
      
      return matchesSearch && matchesStatus && matchesPartner && matchesPriority
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

  const handleBulkResend = () => {
    console.log('Bulk resend messages:', selectedMessages)
  }

  const handleRefresh = () => {
    setLastUpdated(new Date())
    console.log('Refreshing outbox data...')
    // In real app: fetch latest data
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
            <CardTitle>Outbox Messages</CardTitle>
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
                <Button variant="outline" size="sm" onClick={handleBulkResend}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Resend Selected
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
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
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
              <SelectItem value="mdn_received">MDN Received</SelectItem>
              <SelectItem value="business_ack">Business ACK</SelectItem>
              <SelectItem value="awaiting_mdn">Awaiting MDN</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="mdn_timeout">MDN Timeout</SelectItem>
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
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
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
                      onClick={() => handleSort('recipient')}
                      className="h-auto p-0 font-medium"
                    >
                      Recipient
                      {getSortIcon('recipient')}
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
                      onClick={() => handleSort('sentAt')}
                      className="h-auto p-0 font-medium"
                    >
                      Sent At
                      {getSortIcon('sentAt')}
                    </Button>
                  </th>
                  <th className="p-4 text-left">MDN Status</th>
                  <th className="p-4 text-left">ACK2 Status</th>
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
                      {message.priority === 'urgent' && (
                        <Badge variant="destructive" className="text-xs mt-1">Urgent</Badge>
                      )}
                    </td>
                    <td className="p-4 font-medium">{message.recipient}</td>
                    <td className="p-4">
                      <div className="font-medium">{message.filename}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatFileSize(message.size)}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">
                        {new Date(message.sentAt).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatTimestamp(message.sentAt)}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-1">
                        {message.mdnStatus === 'received' && <CheckCircle className="h-4 w-4 text-green-600" />}
                        {message.mdnStatus === 'awaiting' && <Clock className="h-4 w-4 text-yellow-600" />}
                        {message.mdnStatus === 'timeout' && <AlertTriangle className="h-4 w-4 text-orange-600" />}
                        <span className="text-sm capitalize">{message.mdnStatus}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-1">
                        {message.ack2Status === 'accepted' && <CheckCircle className="h-4 w-4 text-green-600" />}
                        {message.ack2Status === 'pending' && <Clock className="h-4 w-4 text-yellow-600" />}
                        {message.ack2Status === 'rejected' && <XCircle className="h-4 w-4 text-red-600" />}
                        {message.ack2Status === 'failed' && <XCircle className="h-4 w-4 text-red-600" />}
                        <span className="text-sm capitalize">{message.ack2Status}</span>
                      </div>
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