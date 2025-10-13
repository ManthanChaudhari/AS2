'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Shield, 
  Download, 
  Upload, 
  FileText, 
  Calendar,
  Key,
  AlertTriangle,
  CheckCircle,
  Clock,
  Settings
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

// Dummy organization certificate data
const organizationCertificates = {
  signing: {
    id: 1,
    type: 'Signing Certificate',
    subjectDn: 'CN=Acme Pharmaceuticals, O=Acme Pharmaceuticals Inc, C=US',
    issuer: 'GlobalSign RSA OV SSL CA 2018',
    validFrom: '2024-06-01T00:00:00Z',
    validTo: '2025-06-01T23:59:59Z',
    keySize: '3072-bit RSA',
    serialNumber: '1F2E3D4C5B6A7890',
    fingerprint: 'SHA256:A1B2C3D4E5F6789012345678901234567890123456789012345678901234567890',
    status: 'active',
    privateKeyStored: true,
    uploadedAt: '2024-06-01T09:00:00Z',
    uploadedBy: 'Jane Smith'
  },
  encryption: {
    id: 2,
    type: 'Encryption Certificate',
    subjectDn: 'CN=Acme Pharmaceuticals, O=Acme Pharmaceuticals Inc, C=US',
    issuer: 'GlobalSign RSA OV SSL CA 2018',
    validFrom: '2024-06-01T00:00:00Z',
    validTo: '2025-06-01T23:59:59Z',
    keySize: '3072-bit RSA',
    serialNumber: '1F2E3D4C5B6A7891',
    fingerprint: 'SHA256:B2C3D4E5F6789012345678901234567890123456789012345678901234567890A1',
    status: 'active',
    privateKeyStored: true,
    uploadedAt: '2024-06-01T09:00:00Z',
    uploadedBy: 'Jane Smith'
  }
}

// Dummy certificate history
const certificateHistory = [
  {
    id: 1,
    type: 'Signing Certificate',
    action: 'Certificate Rotated',
    oldCert: 'Serial: 0A1B2C3D4E5F6789',
    newCert: 'Serial: 1F2E3D4C5B6A7890',
    rotatedAt: '2024-06-01T09:00:00Z',
    rotatedBy: 'Jane Smith',
    reason: 'Scheduled rotation before expiry'
  },
  {
    id: 2,
    type: 'Encryption Certificate',
    action: 'Certificate Imported',
    newCert: 'Serial: 1F2E3D4C5B6A7891',
    rotatedAt: '2024-06-01T09:05:00Z',
    rotatedBy: 'Jane Smith',
    reason: 'Initial certificate setup'
  },
  {
    id: 3,
    type: 'Signing Certificate',
    action: 'CSR Generated',
    csrDetails: 'CN=Acme Pharmaceuticals, 3072-bit RSA',
    rotatedAt: '2024-05-15T14:30:00Z',
    rotatedBy: 'John Doe',
    reason: 'Certificate renewal preparation'
  }
]

function getCertificateStatus(validTo) {
  const expiry = new Date(validTo)
  const now = new Date()
  const daysUntilExpiry = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24))
  
  if (daysUntilExpiry < 0) {
    return { status: 'expired', color: 'text-red-600', text: 'Expired', icon: AlertTriangle }
  } else if (daysUntilExpiry <= 30) {
    return { status: 'expiring', color: 'text-yellow-600', text: `Expires in ${daysUntilExpiry} days`, icon: AlertTriangle }
  } else {
    return { status: 'valid', color: 'text-green-600', text: `Valid for ${daysUntilExpiry} days`, icon: CheckCircle }
  }
}

function CertificateCard({ certificate }) {
  const certStatus = getCertificateStatus(certificate.validTo)
  const StatusIcon = certStatus.icon

  const handleDownload = () => {
    console.log('Downloading certificate:', certificate.id)
  }

  const handleReplace = () => {
    console.log('Replacing certificate:', certificate.id)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5" />
            {certificate.type}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <StatusIcon className={`h-4 w-4 ${certStatus.color}`} />
            <span className={`text-sm font-medium ${certStatus.color}`}>
              {certStatus.text}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <div>
              <Label className="text-sm text-muted-foreground">Subject DN</Label>
              <p className="font-mono text-sm">{certificate.subjectDn}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Issuer</Label>
              <p className="text-sm">{certificate.issuer}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Serial Number</Label>
              <p className="font-mono text-sm">{certificate.serialNumber}</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <Label className="text-sm text-muted-foreground">Valid From</Label>
              <p className="text-sm">{new Date(certificate.validFrom).toLocaleDateString()}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Valid To</Label>
              <p className="text-sm">{new Date(certificate.validTo).toLocaleDateString()}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Key Size</Label>
              <p className="text-sm">{certificate.keySize}</p>
            </div>
          </div>
        </div>

        <div>
          <Label className="text-sm text-muted-foreground">Private Key Status</Label>
          <div className="flex items-center space-x-2 mt-1">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-600">Stored securely in AWS KMS</span>
          </div>
        </div>

        <div>
          <Label className="text-sm text-muted-foreground">Fingerprint (SHA-256)</Label>
          <p className="font-mono text-xs break-all mt-1">{certificate.fingerprint}</p>
        </div>

        <div className="flex space-x-2 pt-4">
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download Public Certificate
          </Button>
          <Button variant="outline" size="sm" onClick={handleReplace}>
            <Upload className="mr-2 h-4 w-4" />
            Replace Certificate
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function CSRGeneratorDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [csrData, setCsrData] = useState({
    commonName: 'Acme Pharmaceuticals',
    organization: 'Acme Pharmaceuticals Inc',
    country: 'US',
    keySize: '3072'
  })

  const handleGenerate = () => {
    console.log('Generating CSR with data:', csrData)
    // In real app: generate CSR and download
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FileText className="mr-2 h-4 w-4" />
          Generate CSR
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Generate Certificate Signing Request</DialogTitle>
          <DialogDescription>
            Create a CSR to submit to your Certificate Authority
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="commonName">Common Name (AS2 ID) *</Label>
            <Input
              id="commonName"
              value={csrData.commonName}
              onChange={(e) => setCsrData({...csrData, commonName: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="organization">Organization *</Label>
            <Input
              id="organization"
              value={csrData.organization}
              onChange={(e) => setCsrData({...csrData, organization: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Country *</Label>
            <Input
              id="country"
              value={csrData.country}
              onChange={(e) => setCsrData({...csrData, country: e.target.value})}
              maxLength={2}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="keySize">Key Size *</Label>
            <Select value={csrData.keySize} onValueChange={(value) => setCsrData({...csrData, keySize: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2048">2048-bit RSA</SelectItem>
                <SelectItem value="3072">3072-bit RSA</SelectItem>
                <SelectItem value="4096">4096-bit RSA</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleGenerate}>
            Generate & Download CSR
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function CertificateImportDialog() {
  const [isOpen, setIsOpen] = useState(false)

  const handleImport = () => {
    console.log('Importing certificate')
    // In real app: handle certificate import
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Import Certificate
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Import New Certificate</DialogTitle>
          <DialogDescription>
            Upload a signed certificate from your Certificate Authority
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Certificate File *</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground mb-2">
                Drag and drop certificate file here, or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                Accepts .pem, .crt, .cer files
              </p>
              <Button variant="outline" className="mt-2">
                <FileText className="mr-2 h-4 w-4" />
                Browse Files
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Private Key File (Optional)</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
              <Key className="mx-auto h-6 w-6 text-muted-foreground mb-2" />
              <p className="text-xs text-muted-foreground mb-2">
                Upload private key or leave empty if already in AWS KMS
              </p>
              <Button variant="outline" size="sm">
                <FileText className="mr-2 h-3 w-3" />
                Browse
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleImport}>
            Import Certificate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function RotationSchedulerDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [rotationData, setRotationData] = useState({
    rotationDate: '',
    notifyDays: '30',
    assignedUser: '',
    notes: ''
  })

  const handleSchedule = () => {
    console.log('Scheduling rotation:', rotationData)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Calendar className="mr-2 h-4 w-4" />
          Schedule Rotation
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Schedule Certificate Rotation</DialogTitle>
          <DialogDescription>
            Set up automatic certificate rotation before expiry
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="rotationDate">Rotation Date *</Label>
            <Input
              id="rotationDate"
              type="date"
              value={rotationData.rotationDate}
              onChange={(e) => setRotationData({...rotationData, rotationDate: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notifyDays">Notify Before (days) *</Label>
            <Select value={rotationData.notifyDays} onValueChange={(value) => setRotationData({...rotationData, notifyDays: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 days</SelectItem>
                <SelectItem value="15">15 days</SelectItem>
                <SelectItem value="30">30 days</SelectItem>
                <SelectItem value="60">60 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="assignedUser">Assign to User</Label>
            <Select value={rotationData.assignedUser} onValueChange={(value) => setRotationData({...rotationData, assignedUser: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select user" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="john.doe">John Doe</SelectItem>
                <SelectItem value="jane.smith">Jane Smith</SelectItem>
                <SelectItem value="mike.johnson">Mike Johnson</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Additional notes for the rotation..."
              value={rotationData.notes}
              onChange={(e) => setRotationData({...rotationData, notes: e.target.value})}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSchedule}>
            Schedule Rotation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function YourCertificatesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/certificates">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Your Certificates</h1>
            <p className="text-muted-foreground">
              Manage your organization's AS2 certificates and private keys
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <CSRGeneratorDialog />
          <CertificateImportDialog />
        </div>
      </div>

      {/* Certificate Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="mr-2 h-5 w-5" />
            Certificate Management Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex flex-col items-center text-center p-4 border rounded-lg">
              <FileText className="h-8 w-8 text-blue-600 mb-2" />
              <h3 className="font-medium mb-1">Generate CSR</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Create a Certificate Signing Request for your CA
              </p>
              <CSRGeneratorDialog />
            </div>
            <div className="flex flex-col items-center text-center p-4 border rounded-lg">
              <Upload className="h-8 w-8 text-green-600 mb-2" />
              <h3 className="font-medium mb-1">Import Certificate</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Upload a signed certificate from your CA
              </p>
              <CertificateImportDialog />
            </div>
            <div className="flex flex-col items-center text-center p-4 border rounded-lg">
              <Calendar className="h-8 w-8 text-purple-600 mb-2" />
              <h3 className="font-medium mb-1">Schedule Rotation</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Set up automatic certificate rotation
              </p>
              <RotationSchedulerDialog />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Certificates */}
      <div className="grid gap-6 lg:grid-cols-2">
        <CertificateCard certificate={organizationCertificates.signing} />
        <CertificateCard certificate={organizationCertificates.encryption} />
      </div>

      {/* Certificate History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="mr-2 h-5 w-5" />
            Certificate History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {certificateHistory.map((entry) => (
              <div key={entry.id} className="flex items-start space-x-3 pb-4 border-b last:border-b-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <Shield className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">{entry.action}</p>
                    <Badge variant="outline" className="text-xs">
                      {entry.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{entry.reason}</p>
                  {entry.oldCert && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Replaced: {entry.oldCert} → {entry.newCert}
                    </p>
                  )}
                  {entry.newCert && !entry.oldCert && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Certificate: {entry.newCert}
                    </p>
                  )}
                  {entry.csrDetails && (
                    <p className="text-xs text-muted-foreground mt-1">
                      CSR: {entry.csrDetails}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    {entry.rotatedBy} • {new Date(entry.rotatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Security Notice:</strong> All private keys are stored securely in AWS Key Management Service (KMS) 
          with FIPS 140-2 Level 3 compliance. Certificate operations are logged and audited for compliance purposes.
        </AlertDescription>
      </Alert>
    </div>
  )
}