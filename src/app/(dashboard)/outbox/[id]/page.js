'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { 
  ArrowLeft, 
  Send, 
  Download, 
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  FileText,
  Shield,
  Mail,
  Activity,
  Copy,
  Eye,
  EyeOff
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'

// Dummy message data
const messageData = {
  id: 'MSG-20241013-101530-001',
  messageId: 'MSG-20241013-101530-001',
  status: 'business_ack',
  recipient: 'FDA FAERS',
  recipientAs2Id: 'FDA-FAERS-001',
  filename: 'case_report_20241013_001.xml',
  fileSize: 45678,
  subject: 'ICSR Submission - case_report_20241013_001.xml - 2024-10-13',
  priority: 'normal',
  sentAt: '2024-10-13T10:15:30Z',
  sentBy: 'John Doe',
  
  // AS2 Details
  as2From: 'ACME-PHARMA-001',
  as2To: 'FDA-FAERS-001',
  partnerUrl: 'https://fda.gov:8443/as2',
  encryptionAlgorithm: 'AES-256-CBC',
  signingAlgorithm: 'SHA-256',
  compression: true,
  contentType: 'application/xml',
  
  // MDN Information
  mdnStatus: 'received',
  mdnReceivedAt: '2024-10-13T10:15:32Z',
  mdnDisposition: 'automatic-action/MDN-sent-automatically; processed',
  mdnSignatureStatus: 'verified',
  sentMic: 'aB3xK9mP2qR7sT4u5vW8xY1zA2bC3dE4fF5gG6hH7iI8jJ9kK0lL1mM2nN3oO4pP',
  receivedMic: 'aB3xK9mP2qR7sT4u5vW8xY1zA2bC3dE4fF5gG6hH7iI8jJ9kK0lL1mM2nN3oO4pP',
  mdnMessageId: 'MDN-20241013-101532-001',
  
  // Business ACK Information
  ack2Status: 'accepted',
  ack2ReceivedAt: '2024-10-13T10:18:45Z',
  ack2ProcessingStatus: 'Accepted by FDA FAERS System',
  ack2ValidationResults: 'All validation checks passed',
  
  // File Details
  originalFilename: 'case_report_20241013_001.xml',
  fileSha256: '1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890',
  e2bMetadata: {
    senderId: 'ACME-PHARMA-001',
    messageNumber: 'MSG-20241013-101530-001',
    senderOrganization: 'Acme Pharmaceuticals Inc',
    caseIds: ['CASE-2024-001', 'CASE-2024-002'],
    transmissionDate: '2024-10-13T10:15:30Z'
  }
}

// Dummy timeline data
const timelineData = [
  {
    timestamp: '2024-10-13T10:15:30Z',
    event: 'File uploaded by John Doe',
    status: 'info'
  },
  {
    timestamp: '2024-10-13T10:15:31Z',
    event: 'File encrypted with partner certificate',
    status: 'info'
  },
  {
    timestamp: '2024-10-13T10:15:32Z',
    event: 'File signed with private key',
    status: 'info'
  },
  {
    timestamp: '2024-10-13T10:15:32Z',
    event: 'AS2 message sent to partner endpoint',
    status: 'success'
  },
  {
    timestamp: '2024-10-13T10:15:32Z',
    event: 'HTTP 200 OK received from partner',
    status: 'success'
  },
  {
    timestamp: '2024-10-13T10:15:32Z',
    event: 'MDN received (synchronous)',
    status: 'success'
  },
  {
    timestamp: '2024-10-13T10:15:33Z',
    event: 'MDN signature verified ✅',
    status: 'success'
  },
  {
    timestamp: '2024-10-13T10:15:33Z',
    event: 'MIC verified ✅',
    status: 'success'
  },
  {
    timestamp: '2024-10-13T10:15:33Z',
    event: 'Transmission marked as successful',
    status: 'success'
  },
  {
    timestamp: '2024-10-13T10:18:45Z',
    event: 'Business ACK (ACK2) received',
    status: 'success'
  },
  {
    timestamp: '2024-10-13T10:18:45Z',
    event: 'ACK2 Status: ACCEPTED by FDA FAERS',
    status: 'success'
  },
  {
    timestamp: '2024-10-13T10:18:45Z',
    event: 'Message lifecycle complete ✅',
    status: 'success'
  }
]

// Dummy AS2 headers
const as2Headers = {
  'AS2-Version': '1.0',
  'AS2-From': 'ACME-PHARMA-001',
  'AS2-To': 'FDA-FAERS-001',
  'Message-ID': '<MSG-20241013-101530-001@acmepharma.com>',
  'Subject': 'ICSR Submission - case_report_20241013_001.xml - 2024-10-13',
  'Date': 'Sun, 13 Oct 2024 10:15:30 GMT',
  'Content-Type': 'application/pkcs7-mime; smime-type=enveloped-data; name="smime.p7m"',
  'Content-Disposition': 'attachment; filename="smime.p7m"',
  'Content-Transfer-Encoding': 'base64',
  'Disposition-Notification-To': 'https://acmepharma.com/as2/mdn',
  'Disposition-Notification-Options': 'signed-receipt-protocol=required,pkcs7-signature; signed-receipt-micalg=required,sha256'
}

function getStatusBadge(status) {
  switch (status) {
    case 'business_ack':
      return <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300">Business ACK Received</Badge>
    case 'mdn_received':
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">MDN Received</Badge>
    case 'failed':
      return <Badge variant="destructive">Failed</Badge>
    case 'awaiting_mdn':
      return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Awaiting MDN</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

function CopyableField({ label, value, mono = false }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-2">
      <Label className="text-sm text-muted-foreground">{label}</Label>
      <div className="flex items-center space-x-2">
        <div className={`flex-1 p-2 bg-muted rounded text-sm ${mono ? 'font-mono' : ''} break-all`}>
          {value}
        </div>
        <Button variant="outline" size="sm" onClick={handleCopy}>
          <Copy className="h-3 w-3" />
          {copied ? 'Copied!' : 'Copy'}
        </Button>
      </div>
    </div>
  )
}

function TimelineItem({ item }) {
  const getStatusIcon = () => {
    switch (item.status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      default:
        return <Clock className="h-4 w-4 text-blue-600" />
    }
  }

  return (
    <div className="flex items-start space-x-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
        {getStatusIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{item.event}</p>
        <p className="text-xs text-muted-foreground">
          {new Date(item.timestamp).toLocaleString()}
        </p>
      </div>
    </div>
  )
}

export default function OutboxMessageDetailPage() {
  const params = useParams()
  const [showHeaders, setShowHeaders] = useState(false)

  const handleResend = () => {
    console.log('Resending message:', params.id)
  }

  const handleDownloadFile = () => {
    console.log('Downloading original file:', params.id)
  }

  const handleDownloadMDN = () => {
    console.log('Downloading MDN:', params.id)
  }

  const handleDownloadAll = () => {
    console.log('Downloading all files:', params.id)
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/outbox">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl font-bold tracking-tight">{messageData.filename}</h1>
              {getStatusBadge(messageData.status)}
            </div>
            <p className="text-muted-foreground">
              Message ID: {messageData.messageId} • Sent to {messageData.recipient}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleDownloadAll}>
            <Download className="mr-2 h-4 w-4" />
            Download All Files
          </Button>
          {(messageData.status === 'failed' || messageData.status === 'mdn_timeout') && (
            <Button onClick={handleResend}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Resend Message
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="as2-details">AS2 Details</TabsTrigger>
          <TabsTrigger value="mdn-info">MDN Information</TabsTrigger>
          <TabsTrigger value="file-details">File Details</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Send className="mr-2 h-5 w-5" />
                  Message Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Message ID</Label>
                  <p className="font-mono text-sm">{messageData.messageId}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Status</Label>
                  <div className="mt-1">{getStatusBadge(messageData.status)}</div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Recipient</Label>
                  <p className="font-medium">{messageData.recipient}</p>
                  <p className="text-sm text-muted-foreground">AS2 ID: {messageData.recipientAs2Id}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Sent At</Label>
                  <p className="text-sm">{new Date(messageData.sentAt).toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Sent By</Label>
                  <p className="text-sm">{messageData.sentBy}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Priority</Label>
                  <Badge variant={messageData.priority === 'urgent' ? 'destructive' : 'secondary'}>
                    {messageData.priority}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Delivery Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium">MDN Received</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {new Date(messageData.mdnReceivedAt).toLocaleString()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium">Business ACK Received</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {new Date(messageData.ack2ReceivedAt).toLocaleString()}
                  </span>
                </div>
                
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-sm font-medium text-green-800 dark:text-green-200">
                    {messageData.ack2ProcessingStatus}
                  </p>
                  <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                    {messageData.ack2ValidationResults}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* AS2 Details Tab */}
        <TabsContent value="as2-details" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                AS2 Transmission Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-sm text-muted-foreground">AS2-From</Label>
                  <p className="font-mono text-sm">{messageData.as2From}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">AS2-To</Label>
                  <p className="font-mono text-sm">{messageData.as2To}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Partner Endpoint URL</Label>
                  <p className="font-mono text-sm break-all">{messageData.partnerUrl}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Content-Type</Label>
                  <p className="font-mono text-sm">{messageData.contentType}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Encryption Algorithm</Label>
                  <p className="text-sm">{messageData.encryptionAlgorithm}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Signing Algorithm</Label>
                  <p className="text-sm">{messageData.signingAlgorithm}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Compression</Label>
                  <p className="text-sm">{messageData.compression ? 'Enabled (ZLIB)' : 'Disabled'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Full AS2 Headers</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowHeaders(!showHeaders)}
                >
                  {showHeaders ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
                  {showHeaders ? 'Hide' : 'Show'} Headers
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {showHeaders ? (
                <div className="space-y-2">
                  {Object.entries(as2Headers).map(([key, value]) => (
                    <div key={key} className="grid grid-cols-3 gap-4 py-2 border-b">
                      <div className="font-mono text-sm font-medium">{key}:</div>
                      <div className="col-span-2 font-mono text-sm break-all">{value}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Click "Show Headers" to view the full AS2 headers
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* MDN Information Tab */}
        <TabsContent value="mdn-info" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="mr-2 h-5 w-5" />
                MDN (Message Disposition Notification)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-sm text-muted-foreground">MDN Status</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-600">Received</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">MDN Received At</Label>
                  <p className="text-sm">{new Date(messageData.mdnReceivedAt).toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">
                    (2 seconds after send)
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">MDN Disposition</Label>
                  <p className="font-mono text-sm">{messageData.mdnDisposition}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">MDN Signature Status</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-600">Verified</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">MDN Message-ID</Label>
                  <p className="font-mono text-sm">{messageData.mdnMessageId}</p>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h4 className="font-medium">Message Integrity Check (MIC)</h4>
                <CopyableField 
                  label="Sent MIC" 
                  value={messageData.sentMic} 
                  mono={true}
                />
                <CopyableField 
                  label="Received MIC" 
                  value={messageData.receivedMic} 
                  mono={true}
                />
                <div className="flex items-center space-x-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-green-800 dark:text-green-200">
                    MIC values match - Message integrity verified
                  </span>
                </div>
              </div>

              <div className="flex space-x-2 pt-4">
                <Button variant="outline" onClick={handleDownloadMDN}>
                  <Download className="mr-2 h-4 w-4" />
                  Download MDN
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* File Details Tab */}
        <TabsContent value="file-details" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                File Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-sm text-muted-foreground">Original Filename</Label>
                  <p className="font-medium">{messageData.originalFilename}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">File Size</Label>
                  <p className="text-sm">{formatFileSize(messageData.fileSize)}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Subject Line</Label>
                  <p className="text-sm">{messageData.subject}</p>
                </div>
              </div>

              <CopyableField 
                label="SHA-256 Hash" 
                value={messageData.fileSha256} 
                mono={true}
              />

              <div className="space-y-4 pt-4 border-t">
                <h4 className="font-medium">E2B(R3) Metadata</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label className="text-sm text-muted-foreground">Sender ID</Label>
                    <p className="font-mono text-sm">{messageData.e2bMetadata.senderId}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Message Number</Label>
                    <p className="font-mono text-sm">{messageData.e2bMetadata.messageNumber}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Sender Organization</Label>
                    <p className="text-sm">{messageData.e2bMetadata.senderOrganization}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Transmission Date</Label>
                    <p className="text-sm">{new Date(messageData.e2bMetadata.transmissionDate).toLocaleString()}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Case IDs</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {messageData.e2bMetadata.caseIds.map((caseId, index) => (
                      <Badge key={index} variant="outline">{caseId}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex space-x-2 pt-4">
                <Button variant="outline" onClick={handleDownloadFile}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Original File
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="mr-2 h-5 w-5" />
                Message Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {timelineData.map((item, index) => (
                  <div key={index} className="relative">
                    <TimelineItem item={item} />
                    {index < timelineData.length - 1 && (
                      <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-border" />
                    )}
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