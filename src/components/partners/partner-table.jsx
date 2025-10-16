'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  MoreHorizontal, 
  Edit, 
  Eye, 
  Trash2,
  Download,
  Search,
  SortAsc,
  SortDesc,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle
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
import { Alert, AlertDescription } from '@/components/ui/alert'
import ApiService from '@/lib/ApiServiceFunctions'
import { transformPartnersResponse, getCertificateStatus } from '@/lib/partnerDataTransform'

// Organization type labels for display
const organizationTypeLabels = {
  regulatory: 'Regulatory Agency',
  mah: 'MAH',
  cro: 'CRO',
  other: 'Other'
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
        <DropdownMenuItem asChild>
          <Link href={`/partners/${partner.id}`}>
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/partners/${partner.id}`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Partner
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-600">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Partner
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function PartnerTable() {
  const [partners, setPartners] = useState([])
  const [selectedPartners, setSelectedPartners] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [orgTypeFilter, setOrgTypeFilter] = useState('all')
  const [sortField, setSortField] = useState('name')
  const [sortDirection, setSortDirection] = useState('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [totalCount, setTotalCount] = useState(0)

  // Fetch partners from API
  const fetchPartners = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const params = {
        page: currentPage,
        size: pageSize
      }
      
      // Add search parameter if provided
      if (searchQuery.trim()) {
        params.search = searchQuery.trim()
      }
      
      // Add status filter if not 'all'
      if (statusFilter !== 'all') {
        params.status = statusFilter
      }
      
      // Add organization type filter if not 'all'
      if (orgTypeFilter !== 'all') {
        params.organization_type = orgTypeFilter
      }
      
      const response = await ApiService.getPartners(params)
      
      if (response.error) {
        setError(response.error.message)
        setPartners([])
        setTotalCount(0)
      } else {
        // Transform API response to UI format
        const transformedPartners = transformPartnersResponse(response.data.items || response.data.data || [])
        setPartners(transformedPartners)
        setTotalCount(response.data.total || transformedPartners.length)
      }
    } catch (err) {
      setError('Failed to fetch partners. Please try again.')
      setPartners([])
      setTotalCount(0)
    } finally {
      setLoading(false)
    }
  }

  // Fetch partners on component mount and when filters change
  useEffect(() => {
    fetchPartners()
  }, [currentPage, pageSize, searchQuery, statusFilter, orgTypeFilter])

  // Reset to first page when filters change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1)
    }
  }, [searchQuery, statusFilter, orgTypeFilter])

  // Calculate pagination info
  const totalPages = Math.ceil(totalCount / pageSize)
  const startIndex = (currentPage - 1) * pageSize

  const handleSort = (field) => {
    // Note: For now we'll handle sorting client-side
    // In the future, this could be moved to server-side sorting via API
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
    
    // Sort the current partners array
    const sortedPartners = [...partners].sort((a, b) => {
      const aValue = a[field]
      const bValue = b[field]
      
      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })
    
    setPartners(sortedPartners)
  }

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedPartners(partners.map(p => p.id))
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

  const handleExport = async () => {
    try {
      // Fetch all partners for export (not just current page)
      const exportParams = {
        size: 1000 // Large number to get all partners
      }
      
      // Apply current filters to export
      if (searchQuery.trim()) {
        exportParams.search = searchQuery.trim()
      }
      if (statusFilter !== 'all') {
        exportParams.status = statusFilter
      }
      if (orgTypeFilter !== 'all') {
        exportParams.organization_type = orgTypeFilter
      }

      const response = await ApiService.getPartners(exportParams)
      
      if (response.error) {
        console.error('Failed to fetch partners for export:', response.error)
        return
      }

      const exportPartners = transformPartnersResponse(response.data.items || response.data.data || [])
      
      // Create CSV content
      const csvHeaders = [
        'Name',
        'AS2 ID', 
        'Organization Type',
        'Status',
        'Contact Name',
        'Contact Email',
        'Contact Phone',
        'Partner URL',
        'Encryption Algorithm',
        'Signing Algorithm',
        'Compression',
        'MDN Mode',
        'Created At',
        'Updated At'
      ]
      
      const csvRows = exportPartners.map(partner => [
        partner.name || '',
        partner.as2Id || '',
        organizationTypeLabels[partner.organizationType] || partner.organizationType || '',
        partner.status || '',
        partner.contactName || '',
        partner.contactEmail || '',
        partner.contactPhone || '',
        partner.partnerUrl || '',
        partner.encryptionAlgorithm || '',
        partner.signingAlgorithm || '',
        partner.compression ? 'Yes' : 'No',
        partner.mdnDeliveryMethod || '',
        partner.createdAt ? new Date(partner.createdAt).toLocaleDateString() : '',
        partner.updatedAt ? new Date(partner.updatedAt).toLocaleDateString() : ''
      ])
      
      // Combine headers and rows
      const csvContent = [csvHeaders, ...csvRows]
        .map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
        .join('\n')
      
      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `partners-export-${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
    } catch (err) {
      console.error('Export failed:', err)
    }
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
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

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
                      checked={selectedPartners.length === partners.length && partners.length > 0}
                      onCheckedChange={handleSelectAll}
                      disabled={loading}
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
                {loading ? (
                  <tr>
                    <td colSpan="9" className="p-8 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Loading partners...</span>
                      </div>
                    </td>
                  </tr>
                ) : partners.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="p-8 text-center text-muted-foreground">
                      {error ? 'Failed to load partners.' : 'No partners found.'}
                    </td>
                  </tr>
                ) : (
                  partners.map((partner) => {
                    // Use the earliest expiring certificate for display
                    const encryptionStatus = getCertificateStatus(partner.encryptionCertExpiry)
                    const signingStatus = getCertificateStatus(partner.signingCertExpiry)
                    const certStatus = encryptionStatus.status === 'expired' || encryptionStatus.status === 'expiring' ? encryptionStatus : signingStatus
                    
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
                            {organizationTypeLabels[partner.organizationType] || partner.organizationType}
                          </Badge>
                        </td>
                        <td className="p-4">{getStatusBadge(partner.status)}</td>
                        <td className="p-4">
                          <span className={certStatus.color}>
                            {certStatus.text}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">
                          {partner.updatedAt ? formatLastMessage(partner.updatedAt) : 'Never'}
                        </td>
                        <td className="p-4">
                          <span className="text-muted-foreground">
                            N/A
                          </span>
                        </td>
                        <td className="p-4">
                          <PartnerActions partner={partner} />
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2">
            <p className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(startIndex + pageSize, totalCount)} of {totalCount} partners
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
              disabled={currentPage === 1 || loading}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages || loading}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}