'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { 
  Upload, 
  FileText, 
  Send, 
  CheckCircle, 
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  X
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

// Validation schema
const sendFileSchema = z.object({
  partnerId: z.string().min(1, 'Please select a partner'),
  file: z.any().refine((file) => file && file.size > 0, 'Please select a file'),
  subject: z.string().min(1, 'Subject is required'),
  priority: z.enum(['normal', 'urgent']),
  notes: z.string().optional()
})

// Dummy partners data
const partnersData = [
  {
    id: '1',
    name: 'FDA FAERS',
    as2Id: 'FDA-FAERS-001',
    organizationType: 'regulatory',
    status: 'active',
    certificateStatus: 'valid'
  },
  {
    id: '2',
    name: 'EMA EudraVigilance',
    as2Id: 'EMA-EV-002',
    organizationType: 'regulatory',
    status: 'active',
    certificateStatus: 'valid'
  },
  {
    id: '3',
    name: 'Health Canada',
    as2Id: 'HC-CANADA-001',
    organizationType: 'regulatory',
    status: 'active',
    certificateStatus: 'valid'
  },
  {
    id: '4',
    name: 'Pfizer Inc.',
    as2Id: 'PFIZER-001',
    organizationType: 'mah',
    status: 'active',
    certificateStatus: 'expiring'
  }
]

const steps = [
  { number: 1, title: 'Select Partner', description: 'Choose the recipient' },
  { number: 2, title: 'Upload File', description: 'Select file to send' },
  { number: 3, title: 'Configure Message', description: 'Set message details' },
  { number: 4, title: 'Review & Send', description: 'Confirm and send' },
  { number: 5, title: 'Confirmation', description: 'Send complete' }
]

export default function SendFilePage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedPartner, setSelectedPartner] = useState(null)
  const [uploadedFile, setUploadedFile] = useState(null)
  const [fileMetadata, setFileMetadata] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [sendResult, setSendResult] = useState(null)

  const form = useForm({
    resolver: zodResolver(sendFileSchema),
    defaultValues: {
      partnerId: '',
      subject: '',
      priority: 'normal',
      notes: ''
    }
  })

  const handlePartnerSelect = (partnerId) => {
    const partner = partnersData.find(p => p.id === partnerId)
    setSelectedPartner(partner)
    form.setValue('partnerId', partnerId)
    
    // Auto-generate subject based on partner
    const defaultSubject = `ICSR Submission - {filename} - ${new Date().toISOString().split('T')[0]}`
    form.setValue('subject', defaultSubject)
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      // Validate file
      if (!file.name.endsWith('.xml')) {
        setError('Only XML files are allowed')
        return
      }
      if (file.size > 100 * 1024 * 1024) { // 100MB
        setError('File size must be less than 100MB')
        return
      }

      setUploadedFile(file)
      form.setValue('file', file)
      setError('')

      // Extract metadata (dummy)
      setFileMetadata({
        filename: file.name,
        size: file.size,
        type: file.type,
        lastModified: new Date(file.lastModified),
        // Dummy E2B metadata
        senderId: 'ACME-PHARMA-001',
        messageNumber: 'MSG-' + Date.now(),
        caseIds: ['CASE-2024-001', 'CASE-2024-002'],
        transmissionDate: new Date().toISOString()
      })

      // Update subject with actual filename
      const currentSubject = form.getValues('subject')
      const updatedSubject = currentSubject.replace('{filename}', file.name)
      form.setValue('subject', updatedSubject)
    }
  }

  const handleFileDrop = (event) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file) {
      const fakeEvent = { target: { files: [file] } }
      handleFileUpload(fakeEvent)
    }
  }

  const handleDragOver = (event) => {
    event.preventDefault()
  }

  const removeFile = () => {
    setUploadedFile(null)
    setFileMetadata(null)
    form.setValue('file', null)
    setError('')
  }

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const onSubmit = async (data) => {
    setIsLoading(true)
    setError('')

    try {
      // Simulate file sending
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simulate success
      setSendResult({
        messageId: 'MSG-20241013-' + Date.now(),
        status: 'sent',
        sentAt: new Date().toISOString(),
        awaitingMdn: true,
        partner: selectedPartner.name,
        filename: uploadedFile.name
      })

      nextStep() // Go to confirmation step
    } catch (err) {
      setError(err.message || 'Failed to send file. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Send File</h1>
        <p className="text-muted-foreground">
          Send ICSR or other pharmacovigilance files to your trading partners
        </p>
      </div>

      {/* Progress Steps */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <CardTitle>Step {currentStep} of 5: {steps[currentStep - 1].title}</CardTitle>
            <div className="text-sm text-muted-foreground">
              {steps[currentStep - 1].description}
            </div>
          </div>
          <Progress value={(currentStep / 5) * 100} className="w-full" />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            {steps.map((step) => (
              <span 
                key={step.number}
                className={currentStep >= step.number ? 'text-primary' : ''}
              >
                {step.title}
              </span>
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Step 1: Select Partner */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">Select Partner</Label>
                <p className="text-sm text-muted-foreground mb-4">
                  Choose the trading partner to send the file to
                </p>
              </div>

              <div className="grid gap-4">
                {partnersData.map((partner) => (
                  <div
                    key={partner.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedPartner?.id === partner.id 
                        ? 'border-primary bg-primary/5' 
                        : 'hover:border-primary/50'
                    }`}
                    onClick={() => handlePartnerSelect(partner.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{partner.name}</h3>
                        <p className="text-sm text-muted-foreground">AS2 ID: {partner.as2Id}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant="outline">
                            {partner.organizationType === 'regulatory' ? 'Regulatory Agency' : 'MAH'}
                          </Badge>
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                            {partner.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        {partner.certificateStatus === 'expiring' && (
                          <div className="flex items-center text-yellow-600 mb-2">
                            <AlertTriangle className="h-4 w-4 mr-1" />
                            <span className="text-xs">Cert Expiring</span>
                          </div>
                        )}
                        {selectedPartner?.id === partner.id && (
                          <CheckCircle className="h-5 w-5 text-primary" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Upload File */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">Upload File</Label>
                <p className="text-sm text-muted-foreground mb-4">
                  Select the XML file to send to {selectedPartner?.name}
                </p>
              </div>

              {!uploadedFile ? (
                <div
                  className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors"
                  onDrop={handleFileDrop}
                  onDragOver={handleDragOver}
                >
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Drop your file here</h3>
                  <p className="text-muted-foreground mb-4">
                    or click to browse files
                  </p>
                  <input
                    type="file"
                    accept=".xml"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <Button asChild>
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <FileText className="mr-2 h-4 w-4" />
                      Browse Files
                    </label>
                  </Button>
                  <p className="text-xs text-muted-foreground mt-4">
                    Accepts XML files up to 100MB
                  </p>
                </div>
              ) : (
                <div className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <FileText className="h-8 w-8 text-blue-600 mt-1" />
                      <div>
                        <h3 className="font-medium">{uploadedFile.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {formatFileSize(uploadedFile.size)} • XML File
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Modified: {new Date(uploadedFile.lastModified).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={removeFile}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {fileMetadata && (
                    <div className="mt-4 p-3 bg-muted/50 rounded">
                      <h4 className="font-medium text-sm mb-2">File Metadata</h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-muted-foreground">Sender ID:</span>
                          <span className="ml-1 font-mono">{fileMetadata.senderId}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Message Number:</span>
                          <span className="ml-1 font-mono">{fileMetadata.messageNumber}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Case IDs:</span>
                          <span className="ml-1">{fileMetadata.caseIds.join(', ')}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Transmission Date:</span>
                          <span className="ml-1">{new Date(fileMetadata.transmissionDate).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Configure Message */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">Configure Message</Label>
                <p className="text-sm text-muted-foreground mb-4">
                  Set message details and delivery options
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Message Subject *</Label>
                  <Input
                    id="subject"
                    {...form.register('subject')}
                    placeholder="ICSR Submission - filename - date"
                  />
                  {form.formState.errors.subject && (
                    <p className="text-sm text-red-600">
                      {form.formState.errors.subject.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Priority</Label>
                  <RadioGroup
                    value={form.watch('priority')}
                    onValueChange={(value) => form.setValue('priority', value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="normal" id="normal" />
                      <Label htmlFor="normal">Normal</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="urgent" id="urgent" />
                      <Label htmlFor="urgent">Urgent</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Optional Message Notes</Label>
                  <Textarea
                    id="notes"
                    {...form.register('notes')}
                    placeholder="Additional notes for this transmission..."
                    rows={3}
                  />
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium text-sm mb-2">Delivery Options</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Request Signed MDN:</span>
                      <Badge variant="outline">Yes</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>MDN Delivery Method:</span>
                      <Badge variant="outline">Synchronous</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Encryption:</span>
                      <Badge variant="outline">AES-256</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Signing:</span>
                      <Badge variant="outline">SHA-256</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review & Send */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">Review & Send</Label>
                <p className="text-sm text-muted-foreground mb-4">
                  Review all details before sending
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-3">Transmission Summary</h4>
                  <div className="grid gap-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Partner:</span>
                      <span className="font-medium">{selectedPartner?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">File:</span>
                      <span className="font-medium">{uploadedFile?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Size:</span>
                      <span>{uploadedFile ? formatFileSize(uploadedFile.size) : 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subject:</span>
                      <span className="font-medium">{form.watch('subject')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Priority:</span>
                      <Badge variant={form.watch('priority') === 'urgent' ? 'destructive' : 'secondary'}>
                        {form.watch('priority')}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Encryption:</span>
                      <span>AES-256</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Signing:</span>
                      <span>SHA-256</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Estimated Send Time:</span>
                      <span>~5 seconds</span>
                    </div>
                  </div>
                </div>

                {form.watch('notes') && (
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Message Notes</h4>
                    <p className="text-sm text-muted-foreground">{form.watch('notes')}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 5: Confirmation */}
          {currentStep === 5 && sendResult && (
            <div className="text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-600 dark:text-green-400">
                  Message Sent Successfully!
                </h3>
                <p className="text-muted-foreground">
                  Your file has been sent to {sendResult.partner}
                </p>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <span>Message ID:</span>
                    <span className="font-mono">{sendResult.messageId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sent to:</span>
                    <span className="font-medium">{sendResult.partner}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                      Awaiting MDN
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Timestamp:</span>
                    <span>{new Date(sendResult.sentAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-center space-x-4 pt-4">
                <Button asChild>
                  <a href="/outbox">View in Outbox</a>
                </Button>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Send Another File
                </Button>
              </div>
            </div>
          )}
        </CardContent>

        {/* Navigation */}
        {currentStep < 5 && (
          <div className="flex justify-between p-6 pt-0">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            {currentStep < 4 ? (
              <Button
                onClick={nextStep}
                disabled={
                  (currentStep === 1 && !selectedPartner) ||
                  (currentStep === 2 && !uploadedFile) ||
                  (currentStep === 3 && !form.watch('subject'))
                }
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={form.handleSubmit(onSubmit)}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Send className="mr-2 h-4 w-4" />
                Send File
              </Button>
            )}
          </div>
        )}
      </Card>
    </div>
  )
}