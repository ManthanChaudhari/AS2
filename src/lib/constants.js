import { 
  LayoutDashboard, 
  Users, 
  Shield, 
  Send, 
  Settings, 
  BarChart3,
  Inbox,
  FileText,
  UserPlus,
  Upload,
  Download,
  HelpCircle,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle
} from "lucide-react"

// Navigation structure for the AS2 Portal
export const navigationItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard
  },
  {
    title: "Partners",
    icon: Users,
    items: [
      { title: "Directory", href: "/partners", icon: Users },
      { title: "Add Partner", href: "/partners/new", icon: UserPlus }
    ]
  },
  {
    title: "Certificates",
    icon: Shield,
    items: [
      { title: "Certificate Vault", href: "/certificates", icon: Shield },
      { title: "Your Certificates", href: "/certificates/self", icon: FileText }
    ]
  },
  {
    title: "Transmission",
    icon: Send,
    items: [
      { title: "Send File", href: "/send", icon: Upload },
      { title: "Batch Upload", href: "/send/batch", icon: Upload },
      { title: "Outbox", href: "/outbox", icon: Send },
      { title: "Inbox", href: "/inbox", icon: Inbox }
    ]
  },
  {
    title: "Administration",
    icon: Settings,
    items: [
      { title: "Users", href: "/admin/users", icon: Users },
      { title: "System Settings", href: "/admin/settings", icon: Settings },
      { title: "Audit Logs", href: "/admin/audit", icon: Activity }
    ]
  },
  {
    title: "Reports",
    href: "/reports",
    icon: BarChart3
  },
  {
    title: "Help",
    icon: HelpCircle,
    items: [
      { title: "User Guide", href: "/help/guide", icon: HelpCircle },
      { title: "API Documentation", href: "/help/api", icon: FileText }
    ]
  }
]

// Status configurations
export const statusConfig = {
  transmission: {
    sending: { label: "Sending", color: "bg-gray-500", icon: Clock },
    sent: { label: "Sent", color: "bg-blue-500", icon: Send },
    mdnReceived: { label: "MDN Received", color: "bg-green-500", icon: CheckCircle },
    businessAck: { label: "Business ACK", color: "bg-emerald-600", icon: CheckCircle },
    failed: { label: "Failed", color: "bg-red-500", icon: XCircle },
    timeout: { label: "Timeout", color: "bg-orange-500", icon: AlertTriangle },
    rejected: { label: "Rejected", color: "bg-orange-600", icon: AlertTriangle }
  },
  partner: {
    active: { label: "Active", color: "bg-green-500" },
    testing: { label: "Testing", color: "bg-yellow-500" },
    inactive: { label: "Inactive", color: "bg-gray-500" }
  },
  certificate: {
    valid: { label: "Valid", color: "bg-green-500" },
    expiring: { label: "Expiring Soon", color: "bg-yellow-500" },
    expired: { label: "Expired", color: "bg-red-500" },
    revoked: { label: "Revoked", color: "bg-gray-500" }
  },
  validation: {
    passed: { label: "Passed", color: "bg-green-500", icon: CheckCircle },
    failed: { label: "Failed", color: "bg-red-500", icon: XCircle },
    processing: { label: "Processing", color: "bg-blue-500", icon: Clock }
  }
}

// Organization types
export const organizationTypes = [
  { value: "regulatory", label: "Regulatory Agency" },
  { value: "mah", label: "Marketing Authorization Holder" },
  { value: "cro", label: "Contract Research Organization" },
  { value: "other", label: "Other" }
]

// AS2 Configuration options
export const as2Config = {
  encryptionAlgorithms: [
    { value: "aes128", label: "AES-128" },
    { value: "aes192", label: "AES-192" },
    { value: "aes256", label: "AES-256" },
    { value: "3des", label: "3DES" }
  ],
  signingAlgorithms: [
    { value: "sha1", label: "SHA-1" },
    { value: "sha256", label: "SHA-256" },
    { value: "sha384", label: "SHA-384" },
    { value: "sha512", label: "SHA-512" }
  ],
  mdnDeliveryMethods: [
    { value: "sync", label: "Synchronous" },
    { value: "async", label: "Asynchronous" }
  ]
}

// File upload constraints
export const fileConstraints = {
  maxSize: 100 * 1024 * 1024, // 100MB
  allowedTypes: ['.xml'],
  batchMaxFiles: 100
}

// Theme colors for AS2 Portal
export const themeColors = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a'
  },
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d'
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f'
  },
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d'
  }
}

// API endpoints (will be configured based on environment)
export const apiEndpoints = {
  auth: {
    login: '/api/v1/auth/login',
    register: '/api/v1/auth/register',
    logout: '/api/v1/auth/logout',
    refresh: '/api/v1/auth/refresh'
  },
  dashboard: {
    stats: '/api/v1/dashboard/stats',
    activity: '/api/v1/dashboard/recent-activity',
    health: '/api/v1/dashboard/health',
    charts: '/api/v1/dashboard/charts'
  },
  partners: {
    list: '/api/v1/partners',
    create: '/api/v1/partners',
    get: '/api/v1/partners/:id',
    update: '/api/v1/partners/:id',
    delete: '/api/v1/partners/:id',
    test: '/api/v1/partners/:id/test'
  },
  certificates: {
    list: '/api/v1/certificates',
    upload: '/api/v1/certificates/upload',
    get: '/api/v1/certificates/:id',
    rotate: '/api/v1/certificates/:id/rotate'
  },
  messages: {
    send: '/api/v1/messages/send',
    outbox: '/api/v1/messages/outbox',
    inbox: '/api/v1/messages/inbox',
    get: '/api/v1/messages/:id'
  }
}

// Default pagination settings
export const paginationDefaults = {
  pageSize: 25,
  pageSizeOptions: [10, 25, 50, 100]
}

// WebSocket endpoints
export const wsEndpoints = {
  dashboard: '/ws/dashboard',
  transmission: '/ws/transmission',
  health: '/ws/health'
}