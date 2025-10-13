# Design Document

## Overview

The AS2 Pharmacovigilance Portal frontend is a Next.js 15 application using the App Router, shadcn/ui components, and Tailwind CSS. The application follows a modern, responsive design pattern with a sidebar navigation layout and supports both light and dark themes. The design emphasizes usability, security, and real-time data visualization for pharmaceutical file transmission management.

## Architecture

### Technology Stack
- **Framework:** Next.js 15 with App Router
- **Styling:** Tailwind CSS 4 with shadcn/ui components (New York style)
- **State Management:** Redux Toolkit + React Context for authentication
- **Icons:** Lucide React
- **Forms:** React Hook Form with Zod validation
- **Tables:** TanStack React Table
- **Charts:** Recharts (to be added)
- **Real-time:** WebSocket connections for live updates
- **Theme:** next-themes for dark/light mode support

### Project Structure
```
src/
├── app/                          # Next.js App Router pages
│   ├── (auth)/                   # Authentication group
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/              # Main application group
│   │   ├── dashboard/
│   │   ├── partners/
│   │   ├── certificates/
│   │   ├── send/
│   │   ├── inbox/
│   │   ├── outbox/
│   │   ├── admin/
│   │   └── reports/
│   ├── globals.css
│   ├── layout.js                 # Root layout
│   └── page.js                   # Landing page
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── layout/                   # Layout components
│   │   ├── sidebar.jsx
│   │   ├── header.jsx
│   │   └── footer.jsx
│   ├── dashboard/                # Dashboard widgets
│   ├── partners/                 # Partner management components
│   ├── certificates/             # Certificate components
│   ├── transmission/             # File transmission components
│   └── common/                   # Shared components
├── lib/
│   ├── utils.js                  # Utility functions
│   ├── api.js                    # API client
│   └── constants.js              # Application constants
├── hooks/                        # Custom React hooks
├── store/                        # Redux store
└── context/                      # React contexts
```

## Components and Interfaces

### Layout Components

#### Main Layout (`app/layout.js`)
- Root layout with theme provider
- Authentication provider wrapper
- Global styles and metadata
- Responsive viewport configuration

#### Dashboard Layout (`app/(dashboard)/layout.js`)
- Sidebar navigation with collapsible menu
- Header with user profile, notifications, and theme toggle
- Breadcrumb navigation
- Main content area with proper spacing

#### Sidebar Navigation
```javascript
// Navigation structure
const navigationItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard
  },
  {
    title: "Partners",
    icon: Users,
    items: [
      { title: "Directory", href: "/partners" },
      { title: "Add Partner", href: "/partners/new" }
    ]
  },
  {
    title: "Certificates",
    icon: Shield,
    items: [
      { title: "Certificate Vault", href: "/certificates" },
      { title: "Your Certificates", href: "/certificates/self" }
    ]
  },
  {
    title: "Transmission",
    icon: Send,
    items: [
      { title: "Send File", href: "/send" },
      { title: "Batch Upload", href: "/send/batch" },
      { title: "Outbox", href: "/outbox" },
      { title: "Inbox", href: "/inbox" }
    ]
  },
  {
    title: "Administration",
    icon: Settings,
    items: [
      { title: "Users", href: "/admin/users" },
      { title: "System Settings", href: "/admin/settings" },
      { title: "Audit Logs", href: "/admin/audit" }
    ]
  },
  {
    title: "Reports",
    href: "/reports",
    icon: BarChart3
  }
]
```

### Page Components

#### Authentication Pages
- **Login Page:** Clean form with email/password, MFA support, SSO options
- **Registration Page:** Multi-step wizard with progress indicator
- Form validation using React Hook Form + Zod
- Loading states and error handling

#### Dashboard Components
- **Stats Cards:** Real-time metrics with trend indicators
- **Activity Timeline:** Recent transactions with status badges
- **System Health:** Service status indicators with tooltips
- **Quick Actions:** Prominent action buttons
- **Charts:** Interactive charts using Recharts library

#### Partner Management
- **Partner Directory:** Advanced data table with filtering, sorting, pagination
- **Partner Wizard:** Step-by-step form with validation and testing
- **Partner Details:** Tabbed interface with comprehensive information
- **Certificate Management:** Upload, validation, and rotation workflows

#### File Transmission
- **Send File:** Drag-and-drop upload with partner selection
- **Batch Upload:** Multi-file handling with progress tracking
- **Message Lists:** Sortable tables with real-time status updates
- **Message Details:** Comprehensive transmission information

### UI Component Library Extensions

#### Custom Components to Build
```javascript
// Status indicators
<StatusBadge status="success|warning|error|pending" />
<CertificateStatus expiryDate={date} />
<TransmissionStatus status="sent|mdn-received|failed" />

// Data visualization
<StatsCard title="Messages Sent" value={123} change={+5.2} />
<ActivityTimeline items={activities} />
<SystemHealthIndicator services={healthData} />

// File handling
<FileUploadZone onUpload={handleUpload} accept=".xml" />
<FilePreview file={fileData} />
<ProgressTracker steps={wizardSteps} currentStep={2} />

// Advanced tables
<DataTable 
  data={partners} 
  columns={partnerColumns}
  filters={filterConfig}
  sorting={sortConfig}
  pagination={paginationConfig}
/>

// Forms
<WizardForm steps={steps} onComplete={handleComplete} />
<SearchableSelect options={partners} />
<DateRangePicker onChange={handleDateChange} />
```

## Data Models

### Frontend State Management

#### Authentication State
```javascript
const authState = {
  user: {
    id: string,
    email: string,
    name: string,
    role: string,
    tenantId: string,
    permissions: string[]
  },
  token: string,
  isAuthenticated: boolean,
  isLoading: boolean
}
```

#### Dashboard State
```javascript
const dashboardState = {
  stats: {
    messagesSentToday: number,
    messagesReceivedToday: number,
    pendingMDNs: number,
    expiringCertificates: number
  },
  recentActivity: Activity[],
  systemHealth: {
    transferFamily: 'healthy|degraded|down',
    s3: 'healthy|degraded|down',
    lambda: 'healthy|degraded|down',
    lastCheck: Date
  },
  charts: {
    messageVolume: ChartData[],
    successRate: ChartData[],
    topPartners: ChartData[]
  }
}
```

#### Partner State
```javascript
const partnerState = {
  partners: Partner[],
  selectedPartner: Partner | null,
  filters: {
    status: string[],
    organizationType: string[],
    search: string
  },
  pagination: {
    page: number,
    limit: number,
    total: number
  }
}
```

### API Integration Patterns

#### API Client Configuration
```javascript
// lib/api.js
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor for auth token
apiClient.interceptors.request.use((config) => {
  const token = getAuthToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle token expiry
      logout()
    }
    return Promise.reject(error)
  }
)
```

#### Real-time Updates
```javascript
// hooks/useWebSocket.js
const useWebSocket = (endpoint) => {
  const [data, setData] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  
  useEffect(() => {
    const ws = new WebSocket(`${WS_URL}${endpoint}`)
    
    ws.onopen = () => setIsConnected(true)
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      setData(data)
    }
    ws.onclose = () => setIsConnected(false)
    
    return () => ws.close()
  }, [endpoint])
  
  return { data, isConnected }
}
```

## Error Handling

### Error Boundary Implementation
```javascript
// components/ErrorBoundary.jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    // Log to monitoring service
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />
    }
    return this.props.children
  }
}
```

### API Error Handling
- Centralized error handling in API client
- User-friendly error messages with toast notifications
- Retry mechanisms for transient failures
- Offline state detection and handling

### Form Validation
- Client-side validation using Zod schemas
- Real-time validation feedback
- Server-side validation error display
- Accessibility-compliant error messages

## Testing Strategy

### Component Testing
- Unit tests for individual components using Jest + React Testing Library
- Focus on user interactions and accessibility
- Mock API calls and external dependencies
- Test error states and edge cases

### Integration Testing
- Test complete user workflows (login, send file, manage partners)
- API integration testing with mock server
- Form submission and validation flows
- Navigation and routing tests

### Visual Testing
- Storybook for component documentation and visual testing
- Responsive design testing across breakpoints
- Theme testing (light/dark mode)
- Cross-browser compatibility testing

### Performance Testing
- Bundle size analysis and optimization
- Core Web Vitals monitoring
- Large dataset rendering performance
- WebSocket connection stability testing

## Security Considerations

### Authentication & Authorization
- JWT token management with secure storage
- Role-based access control (RBAC)
- Session timeout and refresh token handling
- Multi-factor authentication support

### Data Protection
- Input sanitization and XSS prevention
- CSRF protection for form submissions
- Secure file upload handling
- Sensitive data masking in logs

### API Security
- Request/response encryption (HTTPS)
- API rate limiting on frontend
- Token expiry handling
- Secure credential storage

## Performance Optimization

### Code Splitting
- Route-based code splitting with Next.js
- Component lazy loading for large tables
- Dynamic imports for heavy libraries
- Optimized bundle sizes

### Caching Strategy
- Next.js static generation where possible
- API response caching with SWR or React Query
- Image optimization with Next.js Image component
- Browser caching for static assets

### Real-time Updates
- Efficient WebSocket connection management
- Debounced search and filtering
- Virtual scrolling for large datasets
- Optimistic UI updates

## Accessibility

### WCAG 2.1 AA Compliance
- Semantic HTML structure
- Proper ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility

### Design Considerations
- High contrast color schemes
- Scalable font sizes
- Focus indicators
- Alternative text for images

### Testing
- Automated accessibility testing with axe-core
- Manual testing with screen readers
- Keyboard-only navigation testing
- Color contrast validation