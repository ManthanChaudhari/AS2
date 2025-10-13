'use client'

import { useState } from 'react'
import { 
  MoreHorizontal, 
  Download, 
  Upload, 
  Archive, 
  Eye, 
  Search,
  Filter,
  SortAsc,
  SortDesc,
  ChevronLeft,
  ChevronRight,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle
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

// Dummy certificate data
const certificatesData = [
  {
    id: 1,
    name: 'FDA FAERS Encryption',
    owner: 'FDA FAERS',
    ownerType: 'partner',
    type: 'encryption',
    subjectDn: 'CN=FDA FAERS, O=U.S. Food and Drug Administration, C=US',
    issuer: 'DigiCert SHA2 High Assurance Server CA',
    validFrom: '2024-01-01T00:00:00Z',
    validTo: '2024-12-31T23:59:59Z',
    keySize: '2048-bit RSA',
    serialNumber: '0A1B2C3D4E5F6789',
    status: 'active',
    uploadedAt: '2024-01-15T10:30:00Z',
    uploadedBy: 'John Doe'
  },
  {
    id: 2,
    name: 'FDA FAERS Signing',
    owner: 'FDA FAERS',
    ownerType: 'partner',
    type: 'signing',
    subjectDn: 'CN=FDA FAERS, O=U.S. Food and Drug Administration, C=US',
    issuer: 'DigiCert SHA2 High Assurance Server CA',
    validFrom: '2024-01-01T00:00:00Z',
    validTo: '2024-12-31T23:59:59Z',
    keySize: '2048-bit RSA',
    serialNumber: '0A1B2C3D4E5F6790',
    status: 'active',
    uploadedAt: '2024-01-15T10:30:00Z',
    uploadedBy: 'John Doe'
  },
  {
    id: 3,
    name: 'Acme Pharma Signing Certificate',
    owner: 'Your Organization',
    ownerType: 'self',
    type: 'signing',
    subjectDn: 'CN=Acme Pharmaceuticals, O=Acme Pharmaceuticals Inc, C=US',
    issuer: 'GlobalSign RSA OV SSL CA 2018',
    validFrom: '2024-06-01T00:00:00Z',
    validTo: '2025-06-01T23:59:59Z',
    keySize: '3072-bit RSA',
    serialNumber: '1F2E3D4C5B6A7890',
    status: 'active',
    uploadedAt: '2024-06-01T09:00:00Z',
    uploadedBy: 'Jane Smith'
  },
  {
    id: 4,
    name: 'Acme Pharma Encryption Certificate',
    owner: 'Your Organization',
    ownerType: 'self',
    type: 'encryption',
    subjectDn: 'CN=Acme Pharmaceuticals, O=Acme Pharmaceuticals Inc, C=US',
    issuer: 'GlobalSign RSA OV SSL CA 2018',
    validFrom: '2024-06-01T00:00:00Z',
    validTo: '2025-06-01T23:59:59Z',
    keySize: '3072-bit RSA',
    serialNumber: '1F2E3D4C5B6A7891',
    status: 'active',
    uploadedAt: '2024-06-01T09:00:00Z',
    uploadedBy: 'Jane Smith'
  },
  {
    id: 5,
    name: 'Pfizer Encryption Certificate',
    owner: 'Pfizer Inc.',
    ownerType: 'partner',
    type: 'encryption',
    subjectDn: 'CN=Pfizer Inc, O=Pfizer Inc, C=US',
    issuer: 'Entrust Certification Authority - L1K',
    validFrom: '2024-01-15T00:00:00Z',
    validTo: '2024-10-28T23:59:59Z',
    keySize: '2048-bit RSA',
    serialNumber: '2A3B4C5D6E7F8901',
    status: 'expiring',
    uploadedAt: '2024-01-15T14:20:00Z',
    uploadedBy: 'Mike Johnson'
  },
  {
    id: 6,
    name: 'Old EMA Certificate',
    owner: 'EMA EudraVigilance',
    ownerType: 'partner',
    type: 'signing',
    subjectDn: 'CN=EMA EudraVigilance, O=European Medicines Agency, C=NL',
    issuer: 'QuoVadis Global SSL ICA G3',
    validFrom: '2023-01-01T00:00:00Z',
    validTo: '2024-01-01T23:59:59Z',
    keySize: '2048-bit RSA',
    serialNumber: '3B4C5D6E7F890123',
    status: 'expired',
    uploadedAt: '2023-01-01T10:00:00Z',
    uploadedBy: 'Sarah Wilson'
  },
  {
    id: 7,
    name: 'Health Canada Signing',
    owner: 'Health Canada',
    ownerType: 'partner',
    type: 'signing',
    subjectDn: 'CN=Health Canada, O=Government of Canada, C=CA',
    issuer: 'Sectigo RSA Organization Validation Secure Server CA',
    validFrom: '2024-03-01T00:00:00Z',
    validTo: '2025-03-01T23:59:59Z',
    keySize: '2048-bit RSA',
    serialNumber: '4C5D6E7F89012345',
    status: 'active',
    uploadedAt: '2024-03-01T11:30:00Z',
    uploadedBy: 'David Brown'
  },
  {
    id: 8,
    name: 'MHRA Archived Certificate',
    owner: 'MHRA',
    ownerType: 'partner',
    type: 'encryption',
    subjectDn: 'CN=MHRA, O=Medicines and Healthcare products Regulatory Agency, C=GB',
    issuer: 'Comodo RSA Organization Validation Secure Server CA',
    validFrom: '2023-06-01T00:00:00Z',
    validTo: '2024-06-01T23:59:59Z',
    keySize: '2048-bit RSA',
    serialNumber: '5D6E7F8901234567',
    status: 'archived',
    uploadedAt: '2023-06-01T15:45:00Z',
    uploadedBy: 'Lisa Davis'
  }
]

const ownerTypeLabels = {
  self: 'Your Organization',
  partner: 'Partner'
}

const typeLabels = {
  encryption: 'Encryption',
  signing: 'Signing',
  both: 'Both'
}

const statusLabels = {
  active: 'Active',
  expiring: 'Expiring Soon',
  expired: 'Expired',
  archived: 'Archived',
  revoked: 'Revoked'
}

function getStatusBadge(status, validTo) {
  const expiry = new Date(validTo)
  const now = new Date()
  const daysUntilExpiry = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24))
  
  if (status === 'archived') {
    return <Badge variant="secondary">Archived</Badge>
  } else if (status === 'revoked') {
    return <Badge variant="destructive">Revoked</Badge>
  } else if (daysUntilExpiry < 0) {
    return <Badge variant="destructive">Expired</Badge>
  } else if (daysUntilExpiry <= 30) {
    return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
      Expiring Soon
    </Badge>
  } else {
    return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
      Active
    </Badge>
  }
}

function getStatusIcon(status, validTo) {
  const expiry = new Date(validTo)
  const now = new Date()
  const daysUntilExpiry = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24))
  
  if (status === 'archived' || status === 'revoked') {
    return <Archive className="h-4 w-4 text-gray-600" />
  } else if (daysUntilExpiry < 0) {
    return <XCircle className="h-4 w-4 text-red-600" />
  } else if (daysUntilExpiry <= 30) {
    return <AlertTriangle className="h-4 w-4 text-yellow-600" />
  } else {
    return <CheckCircle className="h-4 w-4 text-green-600" />
  }
}

function getExpiryText(validTo) {
  const expiry = new Date(validTo)
  const now = new Date()
  const daysUntilExpiry = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24))
  
  if (daysUntilExpiry < 0) {
    return `Expired ${Math.abs(daysUntilExpiry)} days ago`
  } else if (daysUntilExpiry === 0) {
    return 'Expires today'
  } else if (daysUntilExpiry <= 30) {
    return `Expires in ${daysUntilExpiry} days`
  } else {
    return `Valid for ${daysUntilExpiry} days`
  }
}

function CertificateActions({ certificate }) {
  const handleView = () => {
    console.log('View certificate:', certificate.id)
  }

  const handleDownload = () => {
    console.log('Download certificate:', certificate.id)
  }

  const handleReplace = () => {
    console.log('Replace certificate:', certificate.id)
  }

  const handleArchive = () => {
    console.log('Archive certificate:', certificate.id)
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
          Download Certificate
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleReplace}>
          <Upload className="mr-2 h-4 w-4" />
          Replace Certificate
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleArchive}>
          <Archive className="mr-2 h-4 w-4" />
          Archive Certificate
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function CertificateTable() {
  const [certificates, setCertificates] = useState(certificatesData)
  const [selectedCertificates, setSelectedCertificates] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [ownerFilter, setOwnerFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortField, setSortField] = useState('name')
  const [sortDirection, setSortDirection] = useState('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)

  // Filter and sort certificates
  const filteredCertificates = certificates
    .filter(cert => {
      const matchesSearch = cert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           cert.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           cert.subjectDn.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesOwner = ownerFilter === 'all' || cert.ownerType === ownerFilter
      const matchesType = typeFilter === 'all' || cert.type === typeFilter
      
      let matchesStatus = true
      if (statusFilter !== 'all') {
        const expiry = new Date(cert.validTo)
        const now = new Date()
        const daysUntilExpiry = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24))
        
        if (statusFilter === 'active') {
          matchesStatus = cert.status === 'active' && daysUntilExpiry > 30
        } else if (statusFilter === 'expiring') {
          matchesStatus = daysUntilExpiry <= 30 && daysUntilExpiry >= 0
        } else if (statusFilter === 'expired') {
          matchesStatus = daysUntilExpiry < 0
        } else {
          matchesStatus = cert.status === statusFilter
        }
      }
      
      return matchesSearch && matchesOwner && matchesType && matchesStatus
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
  const totalPages = Math.ceil(filteredCertificates.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const paginatedCertificates = filteredCertificates.slice(startIndex, startIndex + pageSize)

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
      setSelectedCertificates(paginatedCertificates.map(c => c.id))
    } else {
      setSelectedCertificates([])
    }
  }

  const handleSelectCertificate = (certId, checked) => {
    if (checked) {
      setSelectedCertificates([...selectedCertificates, certId])
    } else {
      setSelectedCertificates(selectedCertificates.filter(id => id !== certId))
    }
  }

  const handleBulkDownload = () => {
    console.log('Bulk download certificates:', selectedCertificates)
  }

  const handleBulkArchive = () => {
    console.log('Bulk archive certificates:', selectedCertificates)
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
          <CardTitle>Certificate Vault</CardTitle>
          <div className="flex items-center space-x-2">
            {selectedCertificates.length > 0 && (
              <>
                <Button variant="outline" size="sm" onClick={handleBulkDownload}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Selected ({selectedCertificates.length})
                </Button>
                <Button variant="outline" size="sm" onClick={handleBulkArchive}>
                  <Archive className="mr-2 h-4 w-4" />
                  Archive Selected
                </Button>
              </>
            )}
            <Button size="sm">
              <Upload className="mr-2 h-4 w-4" />
              Upload Certificate
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
                placeholder="Search certificates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={ownerFilter} onValueChange={setOwnerFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by owner" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Owners</SelectItem>
              <SelectItem value="self">Your Organization</SelectItem>
              <SelectItem value="partner">Partners</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="encryption">Encryption</SelectItem>
              <SelectItem value="signing">Signing</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="expiring">Expiring Soon</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
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
                      checked={selectedCertificates.length === paginatedCertificates.length && paginatedCertificates.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                  <th className="p-4 text-left">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('name')}
                      className="h-auto p-0 font-medium"
                    >
                      Certificate Name
                      {getSortIcon('name')}
                    </Button>
                  </th>
                  <th className="p-4 text-left">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('owner')}
                      className="h-auto p-0 font-medium"
                    >
                      Owner
                      {getSortIcon('owner')}
                    </Button>
                  </th>
                  <th className="p-4 text-left">Type</th>
                  <th className="p-4 text-left">Issuer</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Expiry</th>
                  <th className="p-4 text-left">Key Size</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCertificates.map((certificate) => (
                  <tr key={certificate.id} className="border-b hover:bg-muted/50">
                    <td className="p-4">
                      <Checkbox
                        checked={selectedCertificates.includes(certificate.id)}
                        onCheckedChange={(checked) => handleSelectCertificate(certificate.id, checked)}
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(certificate.status, certificate.validTo)}
                        <div>
                          <div className="font-medium">{certificate.name}</div>
                          <div className="text-sm text-muted-foreground font-mono">
                            {certificate.serialNumber}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <div className="font-medium">{certificate.owner}</div>
                        <Badge variant="outline" className="text-xs">
                          {ownerTypeLabels[certificate.ownerType]}
                        </Badge>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline">
                        {typeLabels[certificate.type]}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="max-w-48 truncate text-sm">
                        {certificate.issuer}
                      </div>
                    </td>
                    <td className="p-4">
                      {getStatusBadge(certificate.status, certificate.validTo)}
                    </td>
                    <td className="p-4">
                      <div className="text-sm">
                        <div>{new Date(certificate.validTo).toLocaleDateString()}</div>
                        <div className="text-muted-foreground">
                          {getExpiryText(certificate.validTo)}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm">{certificate.keySize}</td>
                    <td className="p-4">
                      <CertificateActions certificate={certificate} />
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
              Showing {startIndex + 1} to {Math.min(startIndex + pageSize, filteredCertificates.length)} of {filteredCertificates.length} certificates
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