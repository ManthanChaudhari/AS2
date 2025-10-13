'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { 
  ArrowLeft, 
  Shield, 
  Download, 
  Upload, 
  Archive,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Copy,
  Users,
  MessageSquare,
  Activity,
  Calendar
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Textarea } from '@/components/ui/textarea'

// Dummy certificate data
const certificateData = {
  id: 1,
  name: 'FDA FAERS Encryption Certificate',
  owner: 'FDA FAERS',
  ownerType: 'partner',
  type: 'encryption',
  subjectDn: 'CN=FDA FAERS, O=U.S. Food and Drug Administration, OU=Center for Drug Evaluation and Research, L=Silver Spring, ST=Maryland, C=US',
  issuerDn: 'CN=DigiCert SHA2 High Assurance Server CA, OU=www.digicert.com, O=DigiCert Inc, C=US',
  validFrom: '2024-01-01T00:00:00Z',
  validTo: '2024-12-31T23:59:59Z',
  keySize: '2048-bit RSA',
  serialNumber: '0A1B2C3D4E5F67890123456789ABCDEF',
  fingerprint: {
    sha1: '1A:2B:3C:4D:5E:6F:78:90:AB:CD:EF:12:34:56:78:90:AB:CD:EF:12',
    sha256: 'A1:B2:C3:D4:E5:F6:78:90:12:34:56:78:90:AB:CD:EF:12:34:56:78:90:AB:CD:EF:12:34:56:78:90:AB:CD:EF'
  },
  version: 3,
  signatureAlgorithm: 'SHA256withRSA',
  publicKeyAlgorithm: 'RSA',
  keyUsage: ['Digital Signature', 'Key Encipherment', 'Data Encipherment'],
  extendedKeyUsage: ['Server Authentication', 'Client Authentication'],
  basicConstraints: 'CA:FALSE',
  subjectAlternativeNames: ['DNS:fda.gov', 'DNS:*.fda.gov'],
  authorityKeyIdentifier: '51:68:FF:90:AF:02:07:75:3C:CC:D9:65:64:62:A2:12:B8:59:72:3B',
  subjectKeyIdentifier: '3B:72:59:B8:12:A2:62:64:65:D9:CC:3C:75:07:02:AF:90:FF:68:51',
  crlDistributionPoints: ['http://crl3.digicert.com/sha2-ha-server-g6.crl', 'http://crl4.digicert.com/sha2-ha-server-g6.crl'],
  authorityInfoAccess: {
    ocsp: 'http://ocsp.digicert.com',
    caIssuers: 'http://cacerts.digicert.com/DigiCertSHA2HighAssuranceServerCA.crt'
  },
  status: 'active',
  uploadedAt: '2024-01-15T10:30:00Z',
  uploadedBy: 'John Doe'
}

// Dummy certificate chain
const certificateChain = [
  {
    level: 0,
    name: 'FDA FAERS Certificate',
    subjectDn: 'CN=FDA FAERS, O=U.S. Food and Drug Administration, C=US',
    issuerDn: 'CN=DigiCert SHA2 High Assurance Server CA, O=DigiCert Inc, C=US',
    type: 'End Entity'
  },
  {
    level: 1,
    name: 'DigiCert SHA2 High Assurance Server CA',
    subjectDn: 'CN=DigiCert SHA2 High Assurance Server CA, OU=www.digicert.com, O=DigiCert Inc, C=US',
    issuerDn: 'CN=DigiCert High Assurance EV Root CA, OU=www.digicert.com, O=DigiCert Inc, C=US',
    type: 'Intermediate CA'
  },
  {
    level: 2,
    name: 'DigiCert High Assurance EV Root CA',
    subjectDn: 'CN=DigiCert High Assurance EV Root CA, OU=www.digicert.com, O=DigiCert Inc, C=US',
    issuerDn: 'CN=DigiCert High Assurance EV Root CA, OU=www.digicert.com, O=DigiCert Inc, C=US',
    type: 'Root CA'
  }
]

// Dummy usage information
const usageInfo = {
  partnersUsing: [
    { name: 'FDA FAERS', type: 'Regulatory Agency', lastUsed: '2024-10-13T10:15:30Z' },
    { name: 'EMA EudraVigilance', type: 'Regulatory Agency', lastUsed: '2024-10-12T14:30:20Z' }
  ],
  messagesCount: {
    encrypted: 1247,
    signed: 892,
    total: 2139
  },
  lastUsed: '2024-10-13T10:15:30Z'
}

// Dummy validation results
const validationResults = [
  { check: 'Certificate not expired', status: 'pass', message: 'Valid until December 31, 2024' },
  { check: 'Key strength adequate', status: 'pass', message: '2048-bit RSA meets minimum requirements' },
  { check: 'Signature valid', status: 'pass', message: 'Certificate signature verified successfully' },
  { check: 'Chain of trust', status: 'pass', message: 'Complete certificate chain validated' },
  { check: 'Revocation status', status: 'pass', message: 'Certificate not revoked (OCSP verified)' }
]

function getCertificateStatus(validTo) {
  const expiry = new Date(validTo)
  const now = new Date()
  const daysUntilExpiry = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24))
  
  if (daysUntilExpiry < 0) {
    return { status: 'expired', color: 'text-red-600', bgColor: 'bg-red-100 dark:bg-red-900', text: 'Expired', icon: XCircle }
  } else if (daysUntilExpiry <= 30) {
    return { status: 'expiring', color: 'text-yellow-600', bgColor: 'bg-yellow-100 dark:bg-yellow-900', text: `Expires in ${daysUntilExpiry} days`, icon: AlertTriangle }
  } else {
    return { status: 'valid', color: 'text-green-600', bgColor: 'bg-green-100 dark:bg-green-900', text: `Valid for ${daysUntilExpiry} days`, icon: CheckCircle }
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

function ValidationStatus({ result }) {
  const getStatusIcon = () => {
    switch (result.status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case 'fail':
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <CheckCircle className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="flex items-start space-x-3 p-3 border rounded-lg">
      {getStatusIcon()}
      <div className="flex-1">
        <p className="font-medium text-sm">{result.check}</p>
        <p className="text-sm text-muted-foreground">{result.message}</p>
      </div>
    </div>
  )
}

export default function CertificateDetailPage() {
  const params = useParams()
  const [showRawCert, setShowRawCert] = useState(false)
  const certStatus = getCertificateStatus(certificateData.validTo)
  const StatusIcon = certStatus.icon

  const handleDownload = (format) => {
    console.log(`Downloading certificate in ${format} format:`, params.id)
  }

  const handleReplace = () => {
    console.log('Replacing certificate:', params.id)
  }

  const handleRevoke = () => {
    console.log('Revoking certificate:', params.id)
  }

  const handleArchive = () => {
    console.log('Archiving certificate:', params.id)
  }

  // Dummy raw certificate data
  const rawCertificate = `-----BEGIN CERTIFICATE-----
MIIFjTCCBHWgAwIBAgIQDHBLS9nDlSeWvjDZBSWLajANBgkqhkiG9w0BAQsFADBN
MQswCQYDVQQGEwJVUzEVMBMGA1UEChMMRGlnaUNlcnQgSW5jMScwJQYDVQQDEx5E
aWdpQ2VydCBTSEEyIEhpZ2ggQXNzdXJhbmNlIFNlcnZlciBDQTAeFw0yNDAxMDEw
MDAwMDBaFw0yNDEyMzEyMzU5NTlaMFkxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpD
YWxpZm9ybmlhMRYwFAYDVQQHEw1TYW4gRnJhbmNpc2NvMR0wGwYDVQQKExRGb29k
IGFuZCBEcnVnIEFkbWluMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA
xGBbvkKt9NX4FUaZwKXSizykHlgppQhQcQN+ESab4D6+2lp7EvWKtjx9+Jd5V8sK
...
-----END CERTIFICATE-----`

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
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl font-bold tracking-tight">{certificateData.name}</h1>
              <StatusIcon className={`h-6 w-6 ${certStatus.color}`} />
            </div>
            <p className="text-muted-foreground">
              {certificateData.owner} • {certificateData.type} Certificate
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => handleDownload('pem')}>
            <Download className="mr-2 h-4 w-4" />
            Download PEM
          </Button>
          <Button variant="outline" onClick={() => handleDownload('der')}>
            <Download className="mr-2 h-4 w-4" />
            Download DER
          </Button>
          <Button variant="outline" onClick={handleReplace}>
            <Upload className="mr-2 h-4 w-4" />
            Replace
          </Button>
          <Button variant="outline" onClick={handleArchive}>
            <Archive className="mr-2 h-4 w-4" />
            Archive
          </Button>
        </div>
      </div>

      {/* Status Alert */}
      {certStatus.status === 'expiring' && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Certificate Expiring Soon:</strong> This certificate will expire in less than 30 days. 
            Consider scheduling a rotation to avoid service disruption.
          </AlertDescription>
        </Alert>
      )}

      {/* Tabs */}
      <Tabs defaultValue="details" className="space-y-6">
        <TabsList>
          <TabsTrigger value="details">Certificate Details</TabsTrigger>
          <TabsTrigger value="chain">Certificate Chain</TabsTrigger>
          <TabsTrigger value="usage">Usage Information</TabsTrigger>
          <TabsTrigger value="validation">Validation Status</TabsTrigger>
          <TabsTrigger value="raw">Raw Certificate</TabsTrigger>
        </TabsList>

        {/* Certificate Details Tab */}
        <TabsContent value="details" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Certificate Name</Label>
                  <p className="font-medium">{certificateData.name}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Owner</Label>
                  <p className="font-medium">{certificateData.owner}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Type</Label>
                  <Badge variant="outline">{certificateData.type}</Badge>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Status</Label>
                  <div className="flex items-center space-x-2">
                    <StatusIcon className={`h-4 w-4 ${certStatus.color}`} />
                    <span className={`font-medium ${certStatus.color}`}>{certStatus.text}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Uploaded</Label>
                  <p className="text-sm">
                    {new Date(certificateData.uploadedAt).toLocaleString()} by {certificateData.uploadedBy}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Certificate Properties</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Version</Label>
                  <p className="font-medium">v{certificateData.version}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Signature Algorithm</Label>
                  <p className="font-medium">{certificateData.signatureAlgorithm}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Public Key Algorithm</Label>
                  <p className="font-medium">{certificateData.publicKeyAlgorithm}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Key Size</Label>
                  <p className="font-medium">{certificateData.keySize}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Valid From</Label>
                  <p className="font-medium">{new Date(certificateData.validFrom).toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Valid To</Label>
                  <p className="font-medium">{new Date(certificateData.validTo).toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Distinguished Names</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CopyableField 
                label="Subject DN" 
                value={certificateData.subjectDn} 
                mono={true}
              />
              <CopyableField 
                label="Issuer DN" 
                value={certificateData.issuerDn} 
                mono={true}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Identifiers & Fingerprints</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CopyableField 
                label="Serial Number" 
                value={certificateData.serialNumber} 
                mono={true}
              />
              <CopyableField 
                label="SHA-1 Fingerprint" 
                value={certificateData.fingerprint.sha1} 
                mono={true}
              />
              <CopyableField 
                label="SHA-256 Fingerprint" 
                value={certificateData.fingerprint.sha256} 
                mono={true}
              />
              <CopyableField 
                label="Authority Key Identifier" 
                value={certificateData.authorityKeyIdentifier} 
                mono={true}
              />
              <CopyableField 
                label="Subject Key Identifier" 
                value={certificateData.subjectKeyIdentifier} 
                mono={true}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Extensions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm text-muted-foreground">Key Usage</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {certificateData.keyUsage.map((usage, index) => (
                    <Badge key={index} variant="outline">{usage}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Extended Key Usage</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {certificateData.extendedKeyUsage.map((usage, index) => (
                    <Badge key={index} variant="outline">{usage}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Basic Constraints</Label>
                <p className="font-mono text-sm">{certificateData.basicConstraints}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Subject Alternative Names</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {certificateData.subjectAlternativeNames.map((san, index) => (
                    <Badge key={index} variant="outline">{san}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Certificate Chain Tab */}
        <TabsContent value="chain" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Certificate Chain Visualization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {certificateChain.map((cert, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-4 h-4 rounded-full ${
                        cert.type === 'Root CA' ? 'bg-red-500' :
                        cert.type === 'Intermediate CA' ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`} />
                      {index < certificateChain.length - 1 && (
                        <div className="w-0.5 h-8 bg-border mt-2" />
                      )}
                    </div>
                    <div className="flex-1 p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{cert.name}</h3>
                          <Badge variant="outline" className="mt-1">{cert.type}</Badge>
                        </div>
                        <Shield className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="mt-3 space-y-2">
                        <div>
                          <Label className="text-xs text-muted-foreground">Subject</Label>
                          <p className="font-mono text-xs">{cert.subjectDn}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Issuer</Label>
                          <p className="font-mono text-xs">{cert.issuerDn}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Usage Information Tab */}
        <TabsContent value="usage" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Partners Using This Certificate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {usageInfo.partnersUsing.map((partner, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{partner.name}</p>
                        <p className="text-sm text-muted-foreground">{partner.type}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Last used</p>
                        <p className="text-sm">{new Date(partner.lastUsed).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Message Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{usageInfo.messagesCount.encrypted}</div>
                      <div className="text-sm text-muted-foreground">Messages Encrypted</div>
                    </div>
                    <div className="text-center p-3 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{usageInfo.messagesCount.signed}</div>
                      <div className="text-sm text-muted-foreground">Messages Signed</div>
                    </div>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{usageInfo.messagesCount.total}</div>
                    <div className="text-sm text-muted-foreground">Total Messages</div>
                  </div>
                  <div className="pt-2">
                    <Label className="text-sm text-muted-foreground">Last Used</Label>
                    <p className="font-medium">{new Date(usageInfo.lastUsed).toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Validation Status Tab */}
        <TabsContent value="validation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
                Certificate Validation Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {validationResults.map((result, index) => (
                  <ValidationStatus key={index} result={result} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Raw Certificate Tab */}
        <TabsContent value="raw" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Raw Certificate Data</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowRawCert(!showRawCert)}
                >
                  {showRawCert ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
                  {showRawCert ? 'Hide' : 'Show'} Certificate
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {showRawCert ? (
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">PEM Format</Label>
                    <Textarea
                      value={rawCertificate}
                      readOnly
                      className="font-mono text-xs h-64 mt-2"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={() => handleDownload('pem')}>
                      <Download className="mr-2 h-4 w-4" />
                      Download PEM
                    </Button>
                    <Button variant="outline" onClick={() => handleDownload('der')}>
                      <Download className="mr-2 h-4 w-4" />
                      Download DER
                    </Button>
                    <Button variant="outline" onClick={async () => {
                      await navigator.clipboard.writeText(rawCertificate)
                    }}>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy to Clipboard
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Shield className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Click "Show Certificate" to view the raw certificate data
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}