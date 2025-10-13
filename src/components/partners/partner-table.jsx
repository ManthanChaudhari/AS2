'use client'

import { useState } from 'react'
import { 
  MoreHorizontal, 
  Edit, 
  TestTube, 
  Eye, 
  Trash2,
  Download,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  ChevronLeft,
  ChevronRight
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

// Dummy partner data
const partnersData = [
  {
    id: 1,
    name: 'FDA FAERS',
    as2Id: 'FDA-FAERS-001',
    organizationType: 'regulatory',
    status: 'active',
    certificateExpiry: '2024-12-15',
    lastMessage: '2024-10-13T10:30:00Z',
    messagesCount: 1247,
    successRate: 98.5
  },
  {
    id: 2,
    name: 'EMA EudraVigilance',
    as2Id: 'EMA-EV-002',
    organizationType: 'regulatory',
    status: 'active',
    certificateExpiry: '2024-11-20',
    lastMessage: '2024-10-13T09:15:00Z',
    messagesCount: 892,
    successRate: 97.8
  },
  {
    id: 3,
    name: 'Pfizer Inc.',
    as2Id: 'PFIZER-001',
    organizationType: 'mah',
    status: 'active',
    certificateExpiry: '2024-10-28',
    lastMessage: '2024-10-12T16:45:00Z',
    messagesCount: 456,
    successRate: 100
  },
  {
    id: 4,
    name: 'Health Canada',
    as2Id: 'HC-CANADA-001',
    organizationType: 'regulatory',
    status: 'testing',
    certificateExpiry: '2025-03-10',
    lastMessage: '2024-10-11T14:20:00Z',
    messagesCount: 234,
    successRate: 96.2
  },
  {
    id: 5,
    name: 'Johnson & Johnson',
    as2Id: 'JNJ-001',
    organizationType: 'mah',
    status: 'active',
    certificateExpiry: '2025-01-15',
    lastMessage: '2024-10-13T08:30:00Z',
    messagesCount: 678,
    successRate: 99.1
  },
  {
    id: 6,
    name: 'MHRA',
    as2Id: 'MHRA-UK-001',
    organizationType: 'regulatory',
    status: 'inactive',
    certificateExpiry: '2024-10-20',
    lastMessage: '2024-10-10T12:00:00Z',
    messagesCount: 123,
    successRate: 94.5
  },
  {
    id: 7,
    name: 'Novartis AG',
    as2Id: 'NOVARTIS-001',
    organizationType: 'mah',
    status: 'active',
    certificateExpiry: '2025-02-28',
    lastMessage: '2024-10-13T11:45:00Z',
    messagesCount: 345,
    successRate: 98.9
  },
  {
    id: 8,
    name: 'Roche Holding AG',
    as2Id: 'ROCHE-001',
    organizationType: 'mah',
    status: 'testing',
    certificateExpiry: '2025-04-12',
    lastMessage: '2024-10-12T15:30:00Z',
    messagesCount: 89,
    successRate: 97.8
  }
]

const organizationTypeLabels = {
  regulatory: 'Regulatory Agency',
  mah: 'MAH',
  cro: 'CRO',
  other: 'Other'
}

const statusLabels = {
  active: 'Active',
  testing: 'Testing',
  inactive: 'Inactive'
}

function getStatusBadge(status) {
  switch (status) {
    case 'active':
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Active</Badge>
    case 'testing':
      return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Testing</Badge>
    case 'inactive':
      return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300">Inactive</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

function getCertificateStatus(expiryDate) {
  const expiry = new Date(expiryDate)
  const now = new Date()
  const daysUntilExpiry = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24))
  
  if (daysUntilExpiry < 0) {
    return { status: 'expired', color: 'text-red-600 dark:text-red-400', text: 'Expired' }
  } else if (daysUntilExpiry <= 30) {
    return { status: 'expiring', color: 'text-yellow-600 dark:text-yellow-400', text: `${daysUntilExpiry} days` }
  } else {
    return { status: 'valid', color: 'text-green-600 dark:text-green-400', text: `${daysUntilExpiry} days` }
  }
}

function formatLastMessage(timestamp) {
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

function PartnerActions({ partner }) {
  const handleEdit = () => {
    console.log('Edit partner:', partner.id)
  }

  const handleTest = () => {
    console.log('Test connection:', partner.id)
  }

  const handleView = () => {
    console.log('View partner:', partner.id)
  }

  const handleDelete = () => {
    console.log('Delete partner:', partner.id)
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
        <DropdownMenuItem onClick={handleEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Partner
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleTest}>
          <TestTube className="mr-2 h-4 w-4" />
          Test Connection
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDelete} className="text-red-600">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Partner
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function PartnerTable() {
  const [partners, setPartners] = useState(partnersData)
  const [selectedPartners, setSelectedPartners] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [orgTypeFilter, setOrgTypeFilter] = useState('all')
  const [sortField, setSortField] = useState('name')
  const [sortDirection, setSortDirection] = useState('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)

  // Filter and sort partners
  const filteredPartners = partners
    .filter(partner => {
      const matchesSearch = partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           partner.as2Id.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === 'all' || partner.status === statusFilter
      const matchesOrgType = orgTypeFilter === 'all' || partner.organizationType === orgTypeFilter
      
      return matchesSearch && matchesStatus && matchesOrgType
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
  const totalPages = Math.ceil(filteredPartners.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const paginatedPartners = filteredPartners.slice(startIndex, startIndex + pageSize)

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
      setSelectedPartners(paginatedPartners.map(p => p.id))
    } else {
      setSelectedPartners([])
    }
  }

  const handleSelectPartner = (partnerId, checked) => {
    if (checked) {
      setSelectedPartners([...selectedPartners, partnerId])
    } else {
      setSelectedPartners(selectedPartners.filter(id => id !== partnerId))
    }
  }

  const handleBulkTest = () => {
    console.log('Bulk test connections:', selectedPartners)
  }

  const handleExport = () => {
    console.log('Export partners data')
  }

  const getSortIcon = (field) => {
    if (sortField !== field) return null
    return sortDirection === 'asc' ? 
      <SortAsc className="ml-2 h-4 w-4" /> : 
      <SortDesc className="ml-2 h-4 w-4" />
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Partner Directory</CardTitle>
          <div className="flex items-center space-x-2">
            {selectedPartners.length > 0 && (
              <>
                <Button variant="outline" size="sm" onClick={handleBulkTest}>
                  <TestTube className="mr-2 h-4 w-4" />
                  Test Selected ({selectedPartners.length})
                </Button>
              </>
            )}
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
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
                placeholder="Search by name or AS2 ID..."
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
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="testing">Testing</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Select value={orgTypeFilter} onValueChange={setOrgTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="regulatory">Regulatory Agency</SelectItem>
              <SelectItem value="mah">MAH</SelectItem>
              <SelectItem value="cro">CRO</SelectItem>
              <SelectItem value="other">Other</SelectItem>
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
                      checked={selectedPartners.length === paginatedPartners.length && paginatedPartners.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                  <th className="p-4 text-left">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('name')}
                      className="h-auto p-0 font-medium"
                    >
                      Partner Name
                      {getSortIcon('name')}
                    </Button>
                  </th>
                  <th className="p-4 text-left">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('as2Id')}
                      className="h-auto p-0 font-medium"
                    >
                      AS2 ID
                      {getSortIcon('as2Id')}
                    </Button>
                  </th>
                  <th className="p-4 text-left">Organization Type</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Certificate Expiry</th>
                  <th className="p-4 text-left">Last Message</th>
                  <th className="p-4 text-left">Success Rate</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPartners.map((partner) => {
                  const certStatus = getCertificateStatus(partner.certificateExpiry)
                  
                  return (
                    <tr key={partner.id} className="border-b hover:bg-muted/50">
                      <td className="p-4">
                        <Checkbox
                          checked={selectedPartners.includes(partner.id)}
                          onCheckedChange={(checked) => handleSelectPartner(partner.id, checked)}
                        />
                      </td>
                      <td className="p-4 font-medium">{partner.name}</td>
                      <td className="p-4 font-mono text-sm">{partner.as2Id}</td>
                      <td className="p-4">
                        <Badge variant="outline">
                          {organizationTypeLabels[partner.organizationType]}
                        </Badge>
                      </td>
                      <td className="p-4">{getStatusBadge(partner.status)}</td>
                      <td className="p-4">
                        <span className={certStatus.color}>
                          {certStatus.text}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {formatLastMessage(partner.lastMessage)}
                      </td>
                      <td className="p-4">
                        <span className={partner.successRate >= 98 ? 'text-green-600' : partner.successRate >= 95 ? 'text-yellow-600' : 'text-red-600'}>
                          {partner.successRate}%
                        </span>
                      </td>
                      <td className="p-4">
                        <PartnerActions partner={partner} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2">
            <p className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(startIndex + pageSize, filteredPartners.length)} of {filteredPartners.length} partners
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