'use client'

import { useState } from 'react'
import { 
  MoreHorizontal, 
  Edit, 
  Trash2,
  UserCheck,
  UserX,
  Search,
  SortAsc,
  SortDesc,
  ChevronLeft,
  ChevronRight,
  Shield,
  User,
  Settings,
  Eye
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

// Dummy users data
const usersData = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@acmepharma.com',
    role: 'system_admin',
    status: 'active',
    lastLogin: '2024-10-13T09:30:00Z',
    createdAt: '2024-01-15T10:00:00Z',
    avatar: null,
    permissions: ['user_management', 'system_settings', 'audit_logs', 'partner_management', 'certificate_management'],
    department: 'IT',
    phone: '+1 (555) 123-4567'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@acmepharma.com',
    role: 'pharmacovigilance_manager',
    status: 'active',
    lastLogin: '2024-10-13T08:15:00Z',
    createdAt: '2024-02-01T14:30:00Z',
    avatar: null,
    permissions: ['partner_management', 'message_management', 'reporting'],
    department: 'Pharmacovigilance',
    phone: '+1 (555) 234-5678'
  },
  {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike.johnson@acmepharma.com',
    role: 'security_officer',
    status: 'active',
    lastLogin: '2024-10-12T16:45:00Z',
    createdAt: '2024-03-10T11:20:00Z',
    avatar: null,
    permissions: ['certificate_management', 'audit_logs', 'security_settings'],
    department: 'Security',
    phone: '+1 (555) 345-6789'
  },
  {
    id: 4,
    name: 'Sarah Wilson',
    email: 'sarah.wilson@acmepharma.com',
    role: 'operator',
    status: 'active',
    lastLogin: '2024-10-13T07:20:00Z',
    createdAt: '2024-04-05T09:15:00Z',
    avatar: null,
    permissions: ['message_management', 'basic_reporting'],
    department: 'Operations',
    phone: '+1 (555) 456-7890'
  },
  {
    id: 5,
    name: 'David Brown',
    email: 'david.brown@acmepharma.com',
    role: 'operator',
    status: 'inactive',
    lastLogin: '2024-09-15T14:30:00Z',
    createdAt: '2024-05-20T13:45:00Z',
    avatar: null,
    permissions: ['message_management'],
    department: 'Operations',
    phone: '+1 (555) 567-8901'
  },
  {
    id: 6,
    name: 'Lisa Davis',
    email: 'lisa.davis@acmepharma.com',
    role: 'auditor',
    status: 'active',
    lastLogin: '2024-10-11T12:00:00Z',
    createdAt: '2024-06-12T10:30:00Z',
    avatar: null,
    permissions: ['audit_logs', 'reporting', 'read_only_access'],
    department: 'Compliance',
    phone: '+1 (555) 678-9012'
  },
  {
    id: 7,
    name: 'Robert Garcia',
    email: 'robert.garcia@acmepharma.com',
    role: 'pharmacovigilance_manager',
    status: 'pending',
    lastLogin: null,
    createdAt: '2024-10-10T15:20:00Z',
    avatar: null,
    permissions: ['partner_management', 'message_management', 'reporting'],
    department: 'Pharmacovigilance',
    phone: '+1 (555) 789-0123'
  },
  {
    id: 8,
    name: 'Emily Chen',
    email: 'emily.chen@acmepharma.com',
    role: 'operator',
    status: 'suspended',
    lastLogin: '2024-10-01T11:30:00Z',
    createdAt: '2024-07-18T16:45:00Z',
    avatar: null,
    permissions: ['message_management'],
    department: 'Operations',
    phone: '+1 (555) 890-1234'
  }
]

const roleLabels = {
  system_admin: 'System Administrator',
  pharmacovigilance_manager: 'Pharmacovigilance Manager',
  security_officer: 'Security Officer',
  operator: 'Operator',
  auditor: 'Auditor'
}

const statusLabels = {
  active: 'Active',
  inactive: 'Inactive',
  pending: 'Pending',
  suspended: 'Suspended'
}

function getStatusBadge(status) {
  switch (status) {
    case 'active':
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Active</Badge>
    case 'inactive':
      return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300">Inactive</Badge>
    case 'pending':
      return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Pending</Badge>
    case 'suspended':
      return <Badge variant="destructive">Suspended</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

function getRoleIcon(role) {
  switch (role) {
    case 'system_admin':
      return <Settings className="h-4 w-4 text-red-600" />
    case 'security_officer':
      return <Shield className="h-4 w-4 text-blue-600" />
    default:
      return <User className="h-4 w-4 text-gray-600" />
  }
}

function UserActions({ user }) {
  const handleView = () => {
    console.log('View user:', user.id)
  }

  const handleEdit = () => {
    console.log('Edit user:', user.id)
  }

  const handleActivate = () => {
    console.log('Activate user:', user.id)
  }

  const handleDeactivate = () => {
    console.log('Deactivate user:', user.id)
  }

  const handleDelete = () => {
    console.log('Delete user:', user.id)
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
          Edit User
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {user.status === 'active' ? (
          <DropdownMenuItem onClick={handleDeactivate}>
            <UserX className="mr-2 h-4 w-4" />
            Deactivate User
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={handleActivate}>
            <UserCheck className="mr-2 h-4 w-4" />
            Activate User
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDelete} className="text-red-600">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete User
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function UserTable() {
  const [users, setUsers] = useState(usersData)
  const [selectedUsers, setSelectedUsers] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [departmentFilter, setDepartmentFilter] = useState('all')
  const [sortField, setSortField] = useState('name')
  const [sortDirection, setSortDirection] = useState('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)

  // Get unique departments for filter
  const uniqueDepartments = [...new Set(users.map(u => u.department))]

  // Filter and sort users
  const filteredUsers = users
    .filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           user.department.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesRole = roleFilter === 'all' || user.role === roleFilter
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter
      const matchesDepartment = departmentFilter === 'all' || user.department === departmentFilter
      
      return matchesSearch && matchesRole && matchesStatus && matchesDepartment
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
  const totalPages = Math.ceil(filteredUsers.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + pageSize)

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
      setSelectedUsers(paginatedUsers.map(u => u.id))
    } else {
      setSelectedUsers([])
    }
  }

  const handleSelectUser = (userId, checked) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId])
    } else {
      setSelectedUsers(selectedUsers.filter(id => id !== userId))
    }
  }

  const handleBulkActivate = () => {
    console.log('Bulk activate users:', selectedUsers)
  }

  const handleBulkDeactivate = () => {
    console.log('Bulk deactivate users:', selectedUsers)
  }

  const getSortIcon = (field) => {
    if (sortField !== field) return null
    return sortDirection === 'asc' ? 
      <SortAsc className="ml-2 h-4 w-4" /> : 
      <SortDesc className="ml-2 h-4 w-4" />
  }

  const formatLastLogin = (timestamp) => {
    if (!timestamp) return 'Never'
    
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

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>User Management</CardTitle>
          <div className="flex items-center space-x-2">
            {selectedUsers.length > 0 && (
              <>
                <Button variant="outline" size="sm" onClick={handleBulkActivate}>
                  <UserCheck className="mr-2 h-4 w-4" />
                  Activate Selected ({selectedUsers.length})
                </Button>
                <Button variant="outline" size="sm" onClick={handleBulkDeactivate}>
                  <UserX className="mr-2 h-4 w-4" />
                  Deactivate Selected
                </Button>
              </>
            )}
            <Button size="sm">
              Add User
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
                placeholder="Search by name, email, or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="system_admin">System Administrator</SelectItem>
              <SelectItem value="pharmacovigilance_manager">PV Manager</SelectItem>
              <SelectItem value="security_officer">Security Officer</SelectItem>
              <SelectItem value="operator">Operator</SelectItem>
              <SelectItem value="auditor">Auditor</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {uniqueDepartments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
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
                      checked={selectedUsers.length === paginatedUsers.length && paginatedUsers.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                  <th className="p-4 text-left">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('name')}
                      className="h-auto p-0 font-medium"
                    >
                      User
                      {getSortIcon('name')}
                    </Button>
                  </th>
                  <th className="p-4 text-left">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('role')}
                      className="h-auto p-0 font-medium"
                    >
                      Role
                      {getSortIcon('role')}
                    </Button>
                  </th>
                  <th className="p-4 text-left">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('department')}
                      className="h-auto p-0 font-medium"
                    >
                      Department
                      {getSortIcon('department')}
                    </Button>
                  </th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('lastLogin')}
                      className="h-auto p-0 font-medium"
                    >
                      Last Login
                      {getSortIcon('lastLogin')}
                    </Button>
                  </th>
                  <th className="p-4 text-left">Permissions</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-muted/50">
                    <td className="p-4">
                      <Checkbox
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={(checked) => handleSelectUser(user.id, checked)}
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        {getRoleIcon(user.role)}
                        <span className="text-sm">{roleLabels[user.role]}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline">{user.department}</Badge>
                    </td>
                    <td className="p-4">{getStatusBadge(user.status)}</td>
                    <td className="p-4">
                      <div className="text-sm">
                        {formatLastLogin(user.lastLogin)}
                      </div>
                      {user.lastLogin && (
                        <div className="text-xs text-muted-foreground">
                          {new Date(user.lastLogin).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="text-sm">
                        {user.permissions.length} permission{user.permissions.length !== 1 ? 's' : ''}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {user.permissions.slice(0, 2).join(', ')}
                        {user.permissions.length > 2 && ` +${user.permissions.length - 2} more`}
                      </div>
                    </td>
                    <td className="p-4">
                      <UserActions user={user} />
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
              Showing {startIndex + 1} to {Math.min(startIndex + pageSize, filteredUsers.length)} of {filteredUsers.length} users
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