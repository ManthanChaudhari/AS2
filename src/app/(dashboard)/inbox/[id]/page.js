'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { 
  ArrowLeft, 
  Inbox, 
  Download, 
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  FileText,
  Package,
  Activity,
  Copy,
  RotateCcw
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'

// Dummy message data
const messageData = {
  id: 'MSG-20241013-112030-001',
  messageId: 'MSG-20241013-112030-001',
  from: 'FDA FAERS',
  fromAs2Id: 'FDA-FAERS-001',
  filename: 'acknowledgment_20241013_001.xml',
  fileSize: 23456,
  receivedAt: '2024-10-13T11:20:30Z',
  status: 'routed',
  validationStatus: 'passed',
  routingStatus: 'routed',
  priority: 'normal',
  messageType: 'acknowledgment',
  
  // Sender Details
  senderOrganization: 'U.S. Food and Drug Administration',
  senderContact: 'faers-support@fda.gov',
  
  // Validation Results
  validationResults: {
    xsdValidation: 'passed',
    businessRules: 'passed',
    schemaVersion: 'E2B(R3) v1.1',
    validatedAt: '2024-10-13T11:20:35Z',
    validationTime: '2.3 seconds'
  },
  
  // Routing Information
  routingInfo: {
    routedTo: 'Veeva Vault Safety',
    routedAt: '2024-10-13T11:21:00Z',
    routingRule: 'Acknowledgment messages → Veeva Vault',
    routingTime: '1.2 seconds'
  },
  
  // File Details
  originalFilename: 'acknowledgment_20241013_001.xml',
  fileSha256: '2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890ab',
  contentType: 'application/xml',
  encoding: 'UTF-8',
  
  // E2B Metadata
  e2bMetadata: {
    messageType: 'acknowledgment',
    senderId: 'FDA-FAERS-001',
    receiverId: 'ACME-PHARMA-001',
    messageNumber: 'ACK-20241013-001',
    transmissionDate: '2024-10-13T11:20:30Z',
    acknowledgedMessageId: 'MSG-20241012-163045-004',
    acknowledgmentType: 'receipt_acknowledgment',
    processingStatus: 'accepted'
  }
}

// Dummy timeline data
const timelineData = [
  {
    timestamp: '2024-10-13T11:20:30Z',
    event: 'Message received from FDA FAERS',
    status: 'info'
  },
  {
    timestamp: '2024-10-13T11:20:32Z',
    event: 'File extracted and stored',
    status: 'success'
  },
  {
    timestamp: '2024-10-13T11:20:33Z',
    event: 'XSD validation started',
    status: 'info'
  },
  {
    timestamp: '2024-10-13T11:20:35Z',
    event: 'XSD validation passed ✅',
    status: 'success'
  },
  {
    timestamp: '2024-10-13T11:20:36Z',
    event: 'Business rules validation started',
    status: 'info'
  },
  {
    timestamp: '2024-10-13T11:20:38Z',
    event: 'Business rules validation passed ✅',
    status: 'success'
  },
  {
    timestamp: '2024-10-13T11:20:40Z',
    event: 'Message marked as validated',
    status: 'success'
  },
  {
    timestamp: '2024-10-13T11:21:00Z',
    event: 'Routing to Veeva Vault initiated',
    status: 'info'
  },
  {
    timestamp: '2024-10-13T11:21:01Z',
    event: 'Successfully routed to Veeva Vault ✅',
    status: 'success'
  },
  {
    timestamp: '2024-10-13T11:21:02Z',
    event: 'Processing complete',
    status: 'success'
  }
]

// Dummy validation errors (for failed messages)
const validationErrors = [
  {
    type: 'XSD Validation Error',
    severity: 'error',
    message: 'Missing required element: safetyReport/sender/senderOrganization',
    location: 'Line 45, Column 12',
    suggestion: 'Add the required senderOrganization element'
  },
  {
    type: 'Business Rule Violation',
    severity: 'warning',
    message: 'Case ID format does not match expected pattern',
    location: 'safetyReport/primarySource/reporterGivenName',
    suggestion: 'Use format: CASE-YYYY-NNNNNN'
  }
]

function getStatusBadge(status) {
  switch (status) {
    case 'new':
      return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">New</Badge>
    case 'processing':
      return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Processing</Badge>
    case 'validated':
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Validated</Badge>
    case 'validation_failed':
      return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Validation Failed</Badge>
    case 'routed':
      return <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">Routed</Badge>
    case 'routing_failed':
      return <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">Routing Failed</Badge>
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

function ValidationError({ error }) {
  const getIcon = () => {
    switch (error.severity) {
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-start space-x-3">
        {getIcon()}
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h4 className="font-medium text-sm">{error.type}</h4>
            <Badge variant={error.severity === 'error' ? 'destructive' : 'secondary'}>
              {error.severity}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{error.message}</p>
          <p className="text-xs text-muted-foreground mt-1">Location: {error.location}</p>
          <p className="text-xs text-blue-600 mt-2">💡 {error.suggestion}</p>
        </div>
      </div>
    </div>
  )
}

export default function InboxMessageDetailPage() {
  const params = useParams()

  const handleDownload = () => {
    console.log('Downloading file:', params.id)
  }

  const handleRevalidate = () => {
    console.log('Revalidating message:', params.id)
  }

  const handleReroute = () => {
    console.log('Rerouting message:', params.id)
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
            <Link href="/inbox">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl font-bold tracking-tight">{messageData.filename}</h1>
              {getStatusBadge(messageData.status)}
            </div>
            <p className="text-muted-foreground">
              Message ID: {messageData.messageId} • From {messageData.from}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download File
          </Button>
          {messageData.validationStatus === 'failed' && (
            <Button variant="outline" onClick={handleRevalidate}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Re-validate
            </Button>
          )}
          {messageData.routingStatus === 'failed' && (
            <Button onClick={handleReroute}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Re-route
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="validation">Validation Results</TabsTrigger>
          <TabsTrigger value="routing">Routing Status</TabsTrigger>
          <TabsTrigger value="file-details">File Details</TabsTrigger>
          <TabsTrigger value="timeline">Processing Timeline</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Inbox className="mr-2 h-5 w-5" />
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
                  <Label className="text-sm text-muted-foreground">From</Label>
                  <p className="font-medium">{messageData.from}</p>
                  <p className="text-sm text-muted-foreground">AS2 ID: {messageData.fromAs2Id}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Received At</Label>
                  <p className="text-sm">{new Date(messageData.receivedAt).toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Message Type</Label>
                  <Badge variant="outline">{messageData.messageType}</Badge>
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
                <CardTitle>Processing Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium">Validation</span>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                      Passed
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {messageData.validationResults.validationTime}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Package className="h-5 w-5 text-purple-600" />
                    <span className="font-medium">Routing</span>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                      Routed
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {messageData.routingInfo.routedTo}
                    </p>
                  </div>
                </div>
                
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-sm font-medium text-green-800 dark:text-green-200">
                    Processing Complete
                  </p>
                  <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                    Message successfully processed and routed to target system
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Validation Results Tab */}
        <TabsContent value="validation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
                Validation Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-sm text-muted-foreground">XSD Validation</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-600">Passed</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Business Rules</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-600">Passed</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Schema Version</Label>
                  <p className="text-sm">{messageData.validationResults.schemaVersion}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Validation Time</Label>
                  <p className="text-sm">{messageData.validationResults.validationTime}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Validated At</Label>
                  <p className="text-sm">{new Date(messageData.validationResults.validatedAt).toLocaleString()}</p>
                </div>
              </div>

              {/* Show validation errors if any (for demo purposes, showing empty state) */}
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-3">Validation Issues</h4>
                <div className="text-center py-8">
                  <CheckCircle className="mx-auto h-12 w-12 text-green-600 mb-4" />
                  <p className="text-muted-foreground">
                    No validation issues found. All checks passed successfully.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Routing Status Tab */}
        <TabsContent value="routing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="mr-2 h-5 w-5 text-purple-600" />
                Routing Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-sm text-muted-foreground">Routing Status</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <CheckCircle className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-600">Successfully Routed</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Target System</Label>
                  <p className="text-sm font-medium">{messageData.routingInfo.routedTo}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Routing Rule</Label>
                  <p className="text-sm">{messageData.routingInfo.routingRule}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Routing Time</Label>
                  <p className="text-sm">{messageData.routingInfo.routingTime}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Routed At</Label>
                  <p className="text-sm">{new Date(messageData.routingInfo.routedAt).toLocaleString()}</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-3">Downstream System Information</h4>
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Package className="h-5 w-5 text-purple-600" />
                    <span className="font-medium text-purple-800 dark:text-purple-200">
                      {messageData.routingInfo.routedTo}
                    </span>
                  </div>
                  <p className="text-sm text-purple-700 dark:text-purple-300">
                    Message successfully delivered to the target system for further processing.
                    The downstream system will handle case processing and regulatory reporting.
                  </p>
                </div>
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
                  <Label className="text-sm text-muted-foreground">Content Type</Label>
                  <p className="text-sm">{messageData.contentType}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Encoding</Label>
                  <p className="text-sm">{messageData.encoding}</p>
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
                    <Label className="text-sm text-muted-foreground">Message Type</Label>
                    <p className="text-sm">{messageData.e2bMetadata.messageType}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Sender ID</Label>
                    <p className="font-mono text-sm">{messageData.e2bMetadata.senderId}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Receiver ID</Label>
                    <p className="font-mono text-sm">{messageData.e2bMetadata.receiverId}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Message Number</Label>
                    <p className="font-mono text-sm">{messageData.e2bMetadata.messageNumber}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Acknowledged Message ID</Label>
                    <p className="font-mono text-sm">{messageData.e2bMetadata.acknowledgedMessageId}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Processing Status</Label>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                      {messageData.e2bMetadata.processingStatus}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2 pt-4">
                <Button variant="outline" onClick={handleDownload}>
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
                Processing Timeline
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