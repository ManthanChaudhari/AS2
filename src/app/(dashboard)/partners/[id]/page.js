'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { 
  ArrowLeft, 
  Edit, 
  TestTube, 
  Trash2,
  Building2,
  Settings,
  Shield,
  MessageSquare,
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Upload,
  AlertTriangle
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'

// Dummy partner data
const partnerData = {
  id: 1,
  name: 'FDA FAERS',
  as2Id: 'FDA-FAERS-001',
  organizationType: 'regulatory',
  status: 'active',
  contactName: 'John Smith',
  contactEmail: 'john.smith@fda.gov',
  contactPhone: '+1 (555) 123-4567',
  notes: 'Primary regulatory partner for US ICSR submissions',
  as2StationId: 'ACME-PHARMA-001',
  partnerUrl: 'https://fda.gov:8443/as2',
  subjectTemplate: 'ICSR Submission - {filename} - {date}',
  encryptionAlgorithm: 'AES-256',
  signingAlgorithm: 'SHA-256',
  compression: true,
  requestSignedMdn: true,
  mdnDeliveryMethod: 'Synchronous',
  mdnTimeout: 15,
  mdnSigningAlgorithm: 'SHA-256',
  enableRetry: true,
  maxRetries: 3,
  retryInterval: 5,
  createdAt: '2024-01-15T10:30:00Z',
  lastModified: '2024-10-01T14:20:00Z',
  lastTest: '2024-10-10T09:15:00Z',
  lastTestStatus: 'success'
}

// Dummy certificates data
const certificatesData = [
  {
    id: 1,
    type: 'Encryption',
    subjectDn: 'CN=FDA FAERS, O=U.S. Food and Drug Administration, C=US',
    issuerDn: 'CN=DigiCert SHA2 High Assurance Server CA, O=DigiCert Inc, C=US',
    validFrom: '2024-01-01T00:00:00Z',
    validTo: '2024-12-31T23:59:59Z',
    keySize: '2048-bit RSA',
    serialNumber: '0A1B2C3D4E5F6789',
    fingerprint: 'SHA256:1A2B3C4D5E6F7890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890',
    status: 'valid',
    uploadedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    type: 'Signing',
    subjectDn: 'CN=FDA FAERS, O=U.S. Food and Drug Administration, C=US',
    issuerDn: 'CN=DigiCert SHA2 High Assurance Server CA, O=DigiCert Inc, C=US',
    validFrom: '2024-01-01T00:00:00Z',
    validTo: '2024-12-31T23:59:59Z',
    keySize: '2048-bit RSA',
    serialNumber: '0A1B2C3D4E5F6789',
    fingerprint: 'SHA256:1A2B3C4D5E6F7890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890',
    status: 'valid',
    uploadedAt: '2024-01-15T10:30:00Z'
  }
]

// Dummy message history
const messageHistory = [
  {
    id: 'MSG-20241013-101530-001',
    direction: 'outbound',
    filename: 'case_report_20241013_001.xml',
    status: 'success',
    sentAt: '2024-10-13T10:15:30Z',
    mdnReceived: true,
    businessAck: 'accepted'
  },
  {
    id: 'MSG-20241012-143020-002',
    direction: 'outbound',
    filename: 'case_report_20241012_002.xml',
    status: 'success',
    sentAt: '2024-10-12T14:30:20Z',
    mdnReceived: true,
    businessAck: 'accepted'
  },
  {
    id: 'MSG-20241011-091545-003',
    direction: 'inbound',
    filename: 'acknowledgment_20241011.xml',
    status: 'success',
    receivedAt: '2024-10-11T09:15:45Z',
    validated: true
  }
]

// Dummy activity log
const activityLog = [
  {
    id: 1,
    action: 'Connection test successful',
    user: 'John Doe',
    timestamp: '2024-10-10T09:15:00Z',
    details: 'Test file sent and MDN received successfully'
  },
  {
    id: 2,
    action: 'Configuration updated',
    user: 'Jane Smith',
    timestamp: '2024-10-01T14:20:00Z',
    details: 'Updated MDN timeout from 10 to 15 minutes'
  },
  {
    id: 3,
    action: 'Certificate rotated',
    user: 'John Doe',
    timestamp: '2024-09-15T11:30:00Z',
    details: 'Replaced expiring encryption certificate'
  }
]

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

function getCertificateStatus(validTo) {
  const expiry = new Date(validTo)
  const now = new Date()
  const daysUntilExpiry = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24))
  
  if (daysUntilExpiry < 0) {
    return { status: 'expired', color: 'text-red-600', text: 'Expired' }
  } else if (daysUntilExpiry <= 30) {
    return { status: 'expiring', color: 'text-yellow-600', text: `Expires in ${daysUntilExpiry} days` }
  } else {
    return { status: 'valid', color: 'text-green-600', text: `Valid for ${daysUntilExpiry} days` }
  }
}

function getMessageStatusIcon(status) {
  switch (status) {
    case 'success':
      return <CheckCircle className="h-4 w-4 text-green-600" />
    case 'failed':
      return <XCircle className="h-4 w-4 text-red-600" />
    case 'pending':
      return <Clock className="h-4 w-4 text-yellow-600" />
    default:
      return <Clock className="h-4 w-4 text-gray-600" />
  }
}

export default function PartnerDetailsPage() {
  const params = useParams()
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState(partnerData)

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = () => {
    console.log('Saving partner data:', editData)
    setIsEditing(false)
    // In real app: save to API
  }

  const handleCancel = () => {
    setEditData(partnerData)
    setIsEditing(false)
  }

  const handleTest = () => {
    console.log('Testing connection to partner:', params.id)
    // In real app: trigger connection test
  }

  const handleDelete = () => {
    console.log('Deleting partner:', params.id)
    // In real app: show confirmation dialog and delete
  }

  const handleCertificateDownload = (certId) => {
    console.log('Downloading certificate:', certId)
  }

  const handleCertificateReplace = (certId) => {
    console.log('Replacing certificate:', certId)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/partners">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl font-bold tracking-tight">{partnerData.name}</h1>
              {getStatusBadge(partnerData.status)}
            </div>
            <p className="text-muted-foreground">
              AS2 ID: {partnerData.as2Id} • {partnerData.organizationType === 'regulatory' ? 'Regulatory Agency' : 'MAH'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleTest}>
            <TestTube className="mr-2 h-4 w-4" />
            Test Connection
          </Button>
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Configuration
          </Button>
          <Button variant="outline" onClick={handleDelete} className="text-red-600 hover:text-red-700">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Partner
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="mr-2 h-5 w-5" />
                  Partner Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Partner Name</Label>
                      <Input
                        id="name"
                        value={editData.name}
                        onChange={(e) => setEditData({...editData, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactName">Contact Name</Label>
                      <Input
                        id="contactName"
                        value={editData.contactName}
                        onChange={(e) => setEditData({...editData, contactName: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">Contact Email</Label>
                      <Input
                        id="contactEmail"
                        value={editData.contactEmail}
                        onChange={(e) => setEditData({...editData, contactEmail: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactPhone">Contact Phone</Label>
                      <Input
                        id="contactPhone"
                        value={editData.contactPhone}
                        onChange={(e) => setEditData({...editData, contactPhone: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        value={editData.notes}
                        onChange={(e) => setEditData({...editData, notes: e.target.value})}
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={handleSave}>Save Changes</Button>
                      <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm text-muted-foreground">Contact Name</Label>
                      <p className="font-medium">{partnerData.contactName}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Contact Email</Label>
                      <p className="font-medium">{partnerData.contactEmail}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Contact Phone</Label>
                      <p className="font-medium">{partnerData.contactPhone}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Notes</Label>
                      <p className="text-sm">{partnerData.notes}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">1,247</div>
                    <div className="text-sm text-muted-foreground">Messages Sent</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">98.5%</div>
                    <div className="text-sm text-muted-foreground">Success Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">189</div>
                    <div className="text-sm text-muted-foreground">Messages Received</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">2h</div>
                    <div className="text-sm text-muted-foreground">Last Message</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activityLog.slice(0, 3).map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <Activity className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.details}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.user} • {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configuration Tab */}
        <TabsContent value="configuration" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="mr-2 h-5 w-5" />
                AS2 Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">AS2 Station ID</Label>
                    <p className="font-medium font-mono">{partnerData.as2StationId}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Partner URL</Label>
                    <p className="font-medium font-mono text-sm">{partnerData.partnerUrl}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Subject Template</Label>
                    <p className="font-medium text-sm">{partnerData.subjectTemplate}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Encryption Algorithm</Label>
                    <p className="font-medium">{partnerData.encryptionAlgorithm}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Signing Algorithm</Label>
                    <p className="font-medium">{partnerData.signingAlgorithm}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Compression</Label>
                    <p className="font-medium">{partnerData.compression ? 'Enabled (ZLIB)' : 'Disabled'}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-medium mb-4">MDN Settings</h4>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">Request Signed MDN</Label>
                      <p className="font-medium">{partnerData.requestSignedMdn ? 'Yes' : 'No'}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Delivery Method</Label>
                      <p className="font-medium">{partnerData.mdnDeliveryMethod}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Timeout</Label>
                      <p className="font-medium">{partnerData.mdnTimeout} minutes</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">Signing Algorithm</Label>
                      <p className="font-medium">{partnerData.mdnSigningAlgorithm}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Auto Retry</Label>
                      <p className="font-medium">{partnerData.enableRetry ? 'Enabled' : 'Disabled'}</p>
                    </div>
                    {partnerData.enableRetry && (
                      <div>
                        <Label className="text-sm text-muted-foreground">Retry Settings</Label>
                        <p className="font-medium">{partnerData.maxRetries} attempts, {partnerData.retryInterval}min interval</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Certificates Tab */}
        <TabsContent value="certificates" className="space-y-6">
          <div className="grid gap-6">
            {certificatesData.map((cert) => {
              const certStatus = getCertificateStatus(cert.validTo)
              
              return (
                <Card key={cert.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center">
                        <Shield className="mr-2 h-5 w-5" />
                        {cert.type} Certificate
                      </CardTitle>
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-medium ${certStatus.color}`}>
                          {certStatus.text}
                        </span>
                        <Button variant="outline" size="sm" onClick={() => handleCertificateDownload(cert.id)}>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleCertificateReplace(cert.id)}>
                          <Upload className="mr-2 h-4 w-4" />
                          Replace
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm text-muted-foreground">Subject DN</Label>
                          <p className="font-mono text-sm">{cert.subjectDn}</p>
                        </div>
                        <div>
                          <Label className="text-sm text-muted-foreground">Issuer DN</Label>
                          <p className="font-mono text-sm">{cert.issuerDn}</p>
                        </div>
                        <div>
                          <Label className="text-sm text-muted-foreground">Serial Number</Label>
                          <p className="font-mono text-sm">{cert.serialNumber}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm text-muted-foreground">Valid From</Label>
                          <p className="text-sm">{new Date(cert.validFrom).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <Label className="text-sm text-muted-foreground">Valid To</Label>
                          <p className="text-sm">{new Date(cert.validTo).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <Label className="text-sm text-muted-foreground">Key Size</Label>
                          <p className="text-sm">{cert.keySize}</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Fingerprint (SHA-256)</Label>
                      <p className="font-mono text-xs break-all">{cert.fingerprint}</p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Messages Tab */}
        <TabsContent value="messages" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="mr-2 h-5 w-5" />
                Message History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {messageHistory.map((message) => (
                  <div key={message.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      {getMessageStatusIcon(message.status)}
                      <div>
                        <p className="font-medium">{message.filename}</p>
                        <p className="text-sm text-muted-foreground">
                          {message.id} • {message.direction === 'outbound' ? 'Sent' : 'Received'} {' '}
                          {new Date(message.sentAt || message.receivedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {message.mdnReceived && (
                        <Badge variant="outline" className="text-green-600">MDN ✓</Badge>
                      )}
                      {message.businessAck === 'accepted' && (
                        <Badge variant="outline" className="text-green-600">ACK2 ✓</Badge>
                      )}
                      {message.validated && (
                        <Badge variant="outline" className="text-green-600">Validated ✓</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="mr-2 h-5 w-5" />
                Activity Log
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activityLog.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 pb-4 border-b last:border-b-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <Activity className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground mt-1">{activity.details}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {activity.user} • {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}