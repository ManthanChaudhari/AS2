'use client'

import { useState } from 'react'
import { 
  Search, 
  Code, 
  Play, 
  Copy, 
  ExternalLink,
  Book,
  Zap,
  Shield,
  Globe,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// Dummy API documentation data
const apiEndpoints = [
  {
    category: 'Authentication',
    endpoints: [
      {
        method: 'POST',
        path: '/api/v1/auth/login',
        description: 'Authenticate user and get access token',
        parameters: [
          { name: 'email', type: 'string', required: true, description: 'User email address' },
          { name: 'password', type: 'string', required: true, description: 'User password' },
          { name: 'mfaCode', type: 'string', required: false, description: 'MFA code if enabled' }
        ],
        response: {
          success: {
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            user: {
              id: 'user-123',
              email: 'user@example.com',
              name: 'John Doe',
              role: 'admin'
            },
            expiresIn: 3600
          }
        }
      },
      {
        method: 'POST',
        path: '/api/v1/auth/refresh',
        description: 'Refresh access token',
        parameters: [],
        response: {
          success: {
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            expiresIn: 3600
          }
        }
      }
    ]
  },
  {
    category: 'Partners',
    endpoints: [
      {
        method: 'GET',
        path: '/api/v1/partners',
        description: 'Get list of trading partners',
        parameters: [
          { name: 'page', type: 'number', required: false, description: 'Page number (default: 1)' },
          { name: 'limit', type: 'number', required: false, description: 'Items per page (default: 25)' },
          { name: 'status', type: 'string', required: false, description: 'Filter by status (active, testing, inactive)' },
          { name: 'search', type: 'string', required: false, description: 'Search by name or AS2 ID' }
        ],
        response: {
          success: {
            partners: [
              {
                id: 'partner-123',
                name: 'FDA FAERS',
                as2Id: 'FDA-FAERS-001',
                status: 'active',
                organizationType: 'regulatory',
                createdAt: '2024-01-15T10:30:00Z'
              }
            ],
            pagination: {
              page: 1,
              limit: 25,
              total: 100,
              pages: 4
            }
          }
        }
      },
      {
        method: 'POST',
        path: '/api/v1/partners',
        description: 'Create new trading partner',
        parameters: [
          { name: 'name', type: 'string', required: true, description: 'Partner name' },
          { name: 'as2Id', type: 'string', required: true, description: 'AS2 identifier' },
          { name: 'organizationType', type: 'string', required: true, description: 'Organization type' },
          { name: 'contactEmail', type: 'string', required: true, description: 'Contact email' }
        ],
        response: {
          success: {
            id: 'partner-456',
            name: 'New Partner',
            as2Id: 'NEW-PARTNER-001',
            status: 'testing',
            createdAt: '2024-10-13T10:30:00Z'
          }
        }
      }
    ]
  },
  {
    category: 'Messages',
    endpoints: [
      {
        method: 'POST',
        path: '/api/v1/messages/send',
        description: 'Send file to trading partner',
        parameters: [
          { name: 'partnerId', type: 'string', required: true, description: 'Target partner ID' },
          { name: 'file', type: 'file', required: true, description: 'File to send (multipart/form-data)' },
          { name: 'subject', type: 'string', required: false, description: 'Message subject' },
          { name: 'priority', type: 'string', required: false, description: 'Message priority (normal, urgent)' }
        ],
        response: {
          success: {
            messageId: 'MSG-20241013-101530-XYZ',
            status: 'sent',
            sentAt: '2024-10-13T10:15:30Z',
            awaitingMdn: true
          }
        }
      },
      {
        method: 'GET',
        path: '/api/v1/messages/outbox',
        description: 'Get sent messages',
        parameters: [
          { name: 'page', type: 'number', required: false, description: 'Page number' },
          { name: 'partnerId', type: 'string', required: false, description: 'Filter by partner' },
          { name: 'status', type: 'string', required: false, description: 'Filter by status' }
        ],
        response: {
          success: {
            messages: [
              {
                id: 'MSG-20241013-101530-XYZ',
                partnerId: 'partner-123',
                partnerName: 'FDA FAERS',
                filename: 'case_report.xml',
                status: 'mdn_received',
                sentAt: '2024-10-13T10:15:30Z'
              }
            ]
          }
        }
      }
    ]
  }
]

const webhookEvents = [
  {
    event: 'message.sent',
    description: 'Triggered when a message is successfully sent',
    payload: {
      messageId: 'MSG-20241013-101530-XYZ',
      partnerId: 'partner-123',
      status: 'sent',
      sentAt: '2024-10-13T10:15:30Z'
    }
  },
  {
    event: 'message.mdn_received',
    description: 'Triggered when MDN is received for a sent message',
    payload: {
      messageId: 'MSG-20241013-101530-XYZ',
      mdnStatus: 'processed',
      receivedAt: '2024-10-13T10:15:32Z'
    }
  },
  {
    event: 'certificate.expiring',
    description: 'Triggered when a certificate is expiring within 30 days',
    payload: {
      certificateId: 'cert-123',
      partnerName: 'FDA FAERS',
      expiresAt: '2024-11-15T23:59:59Z',
      daysUntilExpiry: 15
    }
  }
]

const integrationExamples = [
  {
    title: 'JavaScript/Node.js',
    language: 'javascript',
    code: `// Send a file using the AS2 Portal API
const FormData = require('form-data');
const fs = require('fs');
const axios = require('axios');

async function sendFile(partnerId, filePath, accessToken) {
  const form = new FormData();
  form.append('partnerId', partnerId);
  form.append('file', fs.createReadStream(filePath));
  form.append('subject', 'ICSR Submission');
  form.append('priority', 'normal');

  try {
    const response = await axios.post(
      'https://api.as2portal.com/v1/messages/send',
      form,
      {
        headers: {
          ...form.getHeaders(),
          'Authorization': \`Bearer \${accessToken}\`
        }
      }
    );
    
    console.log('Message sent:', response.data.messageId);
    return response.data;
  } catch (error) {
    console.error('Send failed:', error.response.data);
    throw error;
  }
}`
  },
  {
    title: 'Python',
    language: 'python',
    code: `import requests
import json

def send_file(partner_id, file_path, access_token):
    """Send a file using the AS2 Portal API"""
    
    url = 'https://api.as2portal.com/v1/messages/send'
    
    headers = {
        'Authorization': f'Bearer {access_token}'
    }
    
    data = {
        'partnerId': partner_id,
        'subject': 'ICSR Submission',
        'priority': 'normal'
    }
    
    with open(file_path, 'rb') as file:
        files = {'file': file}
        
        response = requests.post(
            url, 
            headers=headers, 
            data=data, 
            files=files
        )
        
        if response.status_code == 200:
            result = response.json()
            print(f"Message sent: {result['messageId']}")
            return result
        else:
            print(f"Send failed: {response.text}")
            response.raise_for_status()`
  },
  {
    title: 'cURL',
    language: 'bash',
    code: `# Send a file using cURL
curl -X POST https://api.as2portal.com/v1/messages/send \\
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \\
  -F "partnerId=partner-123" \\
  -F "file=@/path/to/your/file.xml" \\
  -F "subject=ICSR Submission" \\
  -F "priority=normal"

# Get sent messages
curl -X GET "https://api.as2portal.com/v1/messages/outbox?page=1&limit=25" \\
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \\
  -H "Content-Type: application/json"`
  }
]

function getMethodBadge(method) {
  const colors = {
    GET: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    POST: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    PUT: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    DELETE: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
  }
  
  return (
    <Badge className={colors[method] || 'bg-gray-100 text-gray-800'}>
      {method}
    </Badge>
  )
}

function EndpointCard({ endpoint }) {
  const [showExample, setShowExample] = useState(false)
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getMethodBadge(endpoint.method)}
            <code className="text-sm font-mono">{endpoint.path}</code>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowExample(!showExample)}
          >
            <Play className="mr-2 h-4 w-4" />
            Try It
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">{endpoint.description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Parameters */}
        {endpoint.parameters.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Parameters</h4>
            <div className="space-y-2">
              {endpoint.parameters.map((param, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center space-x-2">
                    <code className="text-sm">{param.name}</code>
                    <Badge variant="outline" className="text-xs">{param.type}</Badge>
                    {param.required && (
                      <Badge variant="destructive" className="text-xs">Required</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{param.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Response Example */}
        <div>
          <h4 className="font-medium mb-2">Response Example</h4>
          <div className="bg-muted rounded p-3">
            <pre className="text-sm overflow-x-auto">
              <code>{JSON.stringify(endpoint.response.success, null, 2)}</code>
            </pre>
          </div>
        </div>

        {/* Interactive Example */}
        {showExample && (
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Try This Endpoint</h4>
            <div className="space-y-3">
              {endpoint.parameters.map((param, index) => (
                <div key={index} className="space-y-1">
                  <Label className="text-sm">{param.name}</Label>
                  <Input placeholder={`Enter ${param.name}`} />
                </div>
              ))}
              <Button className="w-full">
                <Play className="mr-2 h-4 w-4" />
                Send Request
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function APIDocumentationPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('javascript')

  const filteredEndpoints = apiEndpoints.map(category => ({
    ...category,
    endpoints: category.endpoints.filter(endpoint =>
      endpoint.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      endpoint.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.endpoints.length > 0)

  const handleCopyCode = async (code) => {
    await navigator.clipboard.writeText(code)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">API Documentation</h1>
        <p className="text-muted-foreground">
          Integrate with the AS2 Portal using our REST API
        </p>
      </div>

      {/* Quick Info */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-base">
              <Globe className="mr-2 h-4 w-4" />
              Base URL
            </CardTitle>
          </CardHeader>
          <CardContent>
            <code className="text-sm">https://api.as2portal.com/v1</code>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-base">
              <Shield className="mr-2 h-4 w-4" />
              Authentication
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Bearer Token (JWT)</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-base">
              <Zap className="mr-2 h-4 w-4" />
              Rate Limit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">1000 requests/hour</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search API endpoints..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <Tabs defaultValue="endpoints" className="space-y-6">
        <TabsList>
          <TabsTrigger value="endpoints">API Endpoints</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="examples">Integration Examples</TabsTrigger>
        </TabsList>

        {/* API Endpoints Tab */}
        <TabsContent value="endpoints" className="space-y-6">
          {filteredEndpoints.map((category) => (
            <div key={category.category} className="space-y-4">
              <h2 className="text-2xl font-semibold">{category.category}</h2>
              <div className="grid gap-4">
                {category.endpoints.map((endpoint, index) => (
                  <EndpointCard key={index} endpoint={endpoint} />
                ))}
              </div>
            </div>
          ))}

          {filteredEndpoints.length === 0 && (
            <div className="text-center py-8">
              <Code className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                No API endpoints found matching your search.
              </p>
            </div>
          )}
        </TabsContent>

        {/* Webhooks Tab */}
        <TabsContent value="webhooks" className="space-y-6">
          <Alert>
            <Zap className="h-4 w-4" />
            <AlertDescription>
              Configure webhook endpoints in your account settings to receive real-time notifications 
              about message status changes and system events.
            </AlertDescription>
          </Alert>

          <div className="grid gap-4">
            {webhookEvents.map((webhook, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="mr-2 h-5 w-5 text-primary" />
                    {webhook.event}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{webhook.description}</p>
                </CardHeader>
                <CardContent>
                  <div>
                    <h4 className="font-medium mb-2">Payload Example</h4>
                    <div className="bg-muted rounded p-3">
                      <pre className="text-sm overflow-x-auto">
                        <code>{JSON.stringify(webhook.payload, null, 2)}</code>
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Integration Examples Tab */}
        <TabsContent value="examples" className="space-y-6">
          <div className="flex items-center space-x-2 mb-4">
            <Label>Language:</Label>
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="javascript">JavaScript/Node.js</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="bash">cURL</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {integrationExamples
            .filter(example => example.language === selectedLanguage)
            .map((example, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{example.title}</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyCode(example.code)}
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Code
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted rounded p-4">
                    <pre className="text-sm overflow-x-auto">
                      <code>{example.code}</code>
                    </pre>
                  </div>
                </CardContent>
              </Card>
            ))}

          <Alert>
            <Book className="h-4 w-4" />
            <AlertDescription>
              <strong>Need more examples?</strong> Check out our{' '}
              <Button variant="link" className="p-0 h-auto">
                GitHub repository
                <ExternalLink className="ml-1 h-3 w-3" />
              </Button>
              {' '}for complete integration examples and SDKs.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  )
}