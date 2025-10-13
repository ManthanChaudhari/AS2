import axios from 'axios'

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage or your preferred storage
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Token expired or invalid
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token')
        window.location.href = '/login'
      }
    }
    
    if (error.response?.status === 403) {
      // Forbidden - insufficient permissions
      console.error('Access denied:', error.response.data)
    }
    
    if (error.response?.status >= 500) {
      // Server error
      console.error('Server error:', error.response.data)
    }
    
    return Promise.reject(error)
  }
)

// API helper functions
export const api = {
  // Authentication
  auth: {
    login: (credentials) => apiClient.post('/api/v1/auth/login', credentials),
    register: (userData) => apiClient.post('/api/v1/auth/register', userData),
    logout: () => apiClient.post('/api/v1/auth/logout'),
    refresh: () => apiClient.post('/api/v1/auth/refresh'),
    verifyEmail: (code) => apiClient.post('/api/v1/auth/verify-email', { code })
  },

  // Dashboard
  dashboard: {
    getStats: () => apiClient.get('/api/v1/dashboard/stats'),
    getActivity: () => apiClient.get('/api/v1/dashboard/recent-activity'),
    getHealth: () => apiClient.get('/api/v1/dashboard/health'),
    getCharts: () => apiClient.get('/api/v1/dashboard/charts')
  },

  // Partners
  partners: {
    list: (params) => apiClient.get('/api/v1/partners', { params }),
    create: (partnerData) => apiClient.post('/api/v1/partners', partnerData),
    get: (id) => apiClient.get(`/api/v1/partners/${id}`),
    update: (id, data) => apiClient.put(`/api/v1/partners/${id}`, data),
    delete: (id) => apiClient.delete(`/api/v1/partners/${id}`),
    test: (id, testData) => apiClient.post(`/api/v1/partners/${id}/test`, testData),
    getMessages: (id, params) => apiClient.get(`/api/v1/partners/${id}/messages`, { params }),
    getAuditLogs: (id, params) => apiClient.get(`/api/v1/partners/${id}/audit-logs`, { params })
  },

  // Certificates
  certificates: {
    list: (params) => apiClient.get('/api/v1/certificates', { params }),
    upload: (formData) => apiClient.post('/api/v1/certificates/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    get: (id) => apiClient.get(`/api/v1/certificates/${id}`),
    download: (id) => apiClient.get(`/api/v1/certificates/${id}/download`, {
      responseType: 'blob'
    }),
    rotate: (id, rotationData) => apiClient.post(`/api/v1/certificates/${id}/rotate`, rotationData),
    revoke: (id) => apiClient.put(`/api/v1/certificates/${id}/revoke`),
    archive: (id) => apiClient.put(`/api/v1/certificates/${id}/archive`),
    getSelf: () => apiClient.get('/api/v1/certificates/self'),
    generateCSR: (csrData) => apiClient.post('/api/v1/certificates/self/generate-csr', csrData),
    importCertificate: (formData) => apiClient.post('/api/v1/certificates/self/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },

  // Messages
  messages: {
    send: (formData) => apiClient.post('/api/v1/messages/send', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    getOutbox: (params) => apiClient.get('/api/v1/messages/outbox', { params }),
    getInbox: (params) => apiClient.get('/api/v1/messages/inbox', { params }),
    get: (id) => apiClient.get(`/api/v1/messages/${id}`),
    resend: (id) => apiClient.post(`/api/v1/messages/${id}/resend`),
    downloadFile: (id) => apiClient.get(`/api/v1/messages/${id}/download-file`, {
      responseType: 'blob'
    }),
    downloadMDN: (id) => apiClient.get(`/api/v1/messages/${id}/download-mdn`, {
      responseType: 'blob'
    }),
    getTimeline: (id) => apiClient.get(`/api/v1/messages/${id}/timeline`),
    revalidate: (id) => apiClient.post(`/api/v1/messages/${id}/revalidate`),
    reroute: (id) => apiClient.post(`/api/v1/messages/${id}/reroute`)
  },

  // Batch operations
  batch: {
    create: () => apiClient.post('/api/v1/batches/create'),
    upload: (batchId, formData) => apiClient.post(`/api/v1/batches/${batchId}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    send: (batchId) => apiClient.post(`/api/v1/batches/${batchId}/send`),
    getStatus: (batchId) => apiClient.get(`/api/v1/batches/${batchId}/status`)
  },

  // Administration
  admin: {
    users: {
      list: (params) => apiClient.get('/api/v1/admin/users', { params }),
      create: (userData) => apiClient.post('/api/v1/admin/users', userData),
      get: (id) => apiClient.get(`/api/v1/admin/users/${id}`),
      update: (id, data) => apiClient.put(`/api/v1/admin/users/${id}`, data),
      delete: (id) => apiClient.delete(`/api/v1/admin/users/${id}`),
      activate: (id) => apiClient.put(`/api/v1/admin/users/${id}/activate`),
      deactivate: (id) => apiClient.put(`/api/v1/admin/users/${id}/deactivate`)
    },
    settings: {
      get: () => apiClient.get('/api/v1/admin/settings'),
      update: (settings) => apiClient.put('/api/v1/admin/settings', settings),
      backup: () => apiClient.get('/api/v1/admin/settings/backup', {
        responseType: 'blob'
      }),
      restore: (formData) => apiClient.post('/api/v1/admin/settings/restore', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    },
    auditLogs: {
      list: (params) => apiClient.get('/api/v1/admin/audit-logs', { params }),
      export: (params) => apiClient.get('/api/v1/admin/audit-logs/export', {
        params,
        responseType: 'blob'
      })
    }
  },

  // Reports
  reports: {
    transmission: (params) => apiClient.get('/api/v1/reports/transmission', { params }),
    compliance: (params) => apiClient.get('/api/v1/reports/compliance', { params }),
    export: (type, params) => apiClient.get(`/api/v1/reports/${type}/export`, {
      params,
      responseType: 'blob'
    })
  }
}

// WebSocket helper
export class WebSocketClient {
  constructor(endpoint) {
    this.endpoint = endpoint
    this.ws = null
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
    this.reconnectInterval = 1000
    this.listeners = new Map()
  }

  connect() {
    try {
      const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001'}${this.endpoint}`
      this.ws = new WebSocket(wsUrl)

      this.ws.onopen = () => {
        console.log(`WebSocket connected to ${this.endpoint}`)
        this.reconnectAttempts = 0
        this.emit('connected')
      }

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          this.emit('message', data)
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error)
        }
      }

      this.ws.onclose = () => {
        console.log(`WebSocket disconnected from ${this.endpoint}`)
        this.emit('disconnected')
        this.attemptReconnect()
      }

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        this.emit('error', error)
      }
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error)
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  send(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data))
    }
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event).push(callback)
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event)
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => callback(data))
    }
  }

  attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      setTimeout(() => {
        console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
        this.connect()
      }, this.reconnectInterval * this.reconnectAttempts)
    }
  }
}

export default apiClient