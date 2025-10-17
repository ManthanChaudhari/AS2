'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  Building2, 
  Settings, 
  Shield, 
  Mail,
  CheckCircle, 
  Loader2,
  ArrowLeft,
  ArrowRight,
  Upload,
  FileText,
  AlertTriangle
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import ApiService from '@/lib/ApiServiceFunctions'
import { transformCreatePartnerData } from '@/lib/partnerDataTransform'

// Step schemas
const step1Schema = z.object({
  partnerName: z.string().min(2, 'Partner name must be at least 2 characters'),
  organizationType: z.string().min(1, 'Please select an organization type'),
  as2Identifier: z.string().min(3, 'AS2 identifier must be at least 3 characters'),
  contactName: z.string().min(2, 'Contact name must be at least 2 characters'),
  contactEmail: z.string().email('Please enter a valid email address'),
  contactPhone: z.string().optional(),
  notes: z.string().optional()
})

const step2Schema = z.object({
  as2StationId: z.string().min(3, 'AS2 Station ID must be at least 3 characters'),
  partnerUrl: z.string().url('Please enter a valid URL'),
  subjectTemplate: z.string().min(1, 'Subject template is required'),
  encryptionAlgorithm: z.string().min(1, 'Please select an encryption algorithm'),
  signingAlgorithm: z.string().min(1, 'Please select a signing algorithm'),
  compression: z.boolean().default(false)
})

const step3Schema = z.object({
  encryptionCert: z.any().optional(),
  signingCert: z.any().optional(),
  useSameCert: z.boolean().default(false)
})

const step4Schema = z.object({
  requestSignedMdn: z.boolean().default(true),
  mdnDeliveryMethod: z.string().min(1, 'Please select MDN delivery method'),
  mdnTimeout: z.number().min(5).max(60),
  mdnSigningAlgorithm: z.string().min(1, 'Please select MDN signing algorithm'),
  enableRetry: z.boolean().default(true),
  maxRetries: z.number().min(1).max(5),
  retryInterval: z.number().min(1).max(60)
})

// Dummy data
const organizationTypes = [
  { value: 'regulatory', label: 'Regulatory Agency' },
  { value: 'mah', label: 'Marketing Authorization Holder' },
  { value: 'cro', label: 'Contract Research Organization' },
  { value: 'other', label: 'Other' }
]

const encryptionAlgorithms = [
  { value: 'aes128', label: 'AES-128' },
  { value: 'aes192', label: 'AES-192' },
  { value: 'aes256', label: 'AES-256' },
  { value: '3des', label: '3DES' }
]

const signingAlgorithms = [
  { value: 'sha1', label: 'SHA-1' },
  { value: 'sha256', label: 'SHA-256' },
  { value: 'sha384', label: 'SHA-384' },
  { value: 'sha512', label: 'SHA-512' }
]

export default function AddPartnerPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [partnerCreated, setPartnerCreated] = useState(false)
  const [createdPartnerId, setCreatedPartnerId] = useState(null)
  const [encryptionCertFile, setEncryptionCertFile] = useState(null)
  const [signingCertFile, setSigningCertFile] = useState(null)

  // Forms for each step
  const step1Form = useForm({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      partnerName: '',
      organizationType: '',
      as2Identifier: '',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      notes: ''
    }
  })

  const step2Form = useForm({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      as2StationId: '',
      partnerUrl: '',
      subjectTemplate: 'ICSR Submission - {filename} - {date}',
      encryptionAlgorithm: 'aes256',
      signingAlgorithm: 'sha256',
      compression: false
    }
  })

  const step3Form = useForm({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      useSameCert: false
    }
  })

  const step4Form = useForm({
    resolver: zodResolver(step4Schema),
    defaultValues: {
      requestSignedMdn: true,
      mdnDeliveryMethod: 'sync',
      mdnTimeout: 15,
      mdnSigningAlgorithm: 'sha256',
      enableRetry: true,
      maxRetries: 3,
      retryInterval: 5
    }
  })

  const steps = [
    { number: 1, title: 'Basic Information', icon: Building2, form: step1Form },
    { number: 2, title: 'AS2 Configuration', icon: Settings, form: step2Form },
    { number: 3, title: 'Certificate Upload', icon: Shield, form: step3Form },
    { number: 4, title: 'MDN Settings', icon: Mail, form: step4Form }
  ]

  const currentForm = steps[currentStep - 1]?.form

  const onStepSubmit = async (data) => {
    setIsLoading(true)
    setError('')

    try {
      if (currentStep === 4) {
        // Final step - create the partner
        await createPartner()
        return
      }

      // Move to next step
      setCurrentStep(prev => prev + 1)

    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const createPartner = async () => {
    try {
      // Collect all form data
      const step1Data = step1Form.getValues()
      const step2Data = step2Form.getValues()
      const step3Data = step3Form.getValues()
      const step4Data = step4Form.getValues()

      // Validate that certificates are uploaded
      if (!encryptionCertFile) {
        setError('Encryption certificate is required')
        setCurrentStep(3)
        return
      }

      if (!step3Data.useSameCert && !signingCertFile) {
        setError('Signing certificate is required')
        setCurrentStep(3)
        return
      }

      // Combine all form data
      const formData = {
        ...step1Data,
        ...step2Data,
        ...step4Data,
        encryptionCert: encryptionCertFile,
        signingCert: step3Data.useSameCert ? encryptionCertFile : signingCertFile
      }

      // Transform to API format
      const apiFormData = transformCreatePartnerData(formData)

      // Call API to create partner
      const response = await ApiService.createPartner(apiFormData)

      if (response.error) {
        // Handle validation errors
        if (response.error.status === 422) {
          setError('Please check your input data and try again.')
        } else {
          setError(response.error.message || 'Failed to create partner')
        }
        return
      }

      // Success - partner created
      setCreatedPartnerId(response.data.id)
      setPartnerCreated(true)

    } catch (err) {
      setError(err.message || 'Failed to create partner. Please try again.')
    }
  }

  const handleCertificateUpload = (file, type) => {
    if (!file) return

    // Validate file type
    const allowedTypes = ['.pem', '.crt', '.cer']
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase()
    
    if (!allowedTypes.includes(fileExtension)) {
      setError(`Invalid file type. Please upload a ${allowedTypes.join(', ')} file.`)
      return
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      setError('File size too large. Please upload a file smaller than 5MB.')
      return
    }

    // Clear any previous errors
    setError('')

    // Set the file
    if (type === 'encryption') {
      setEncryptionCertFile(file)
    } else if (type === 'signing') {
      setSigningCertFile(file)
    }
  }

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const viewPartner = () => {
    if (createdPartnerId) {
      router.push(`/partners/${createdPartnerId}`)
    } else {
      router.push('/partners')
    }
  }

  if (partnerCreated) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl text-green-600 dark:text-green-400">
              Partner Created Successfully!
            </CardTitle>
            <CardDescription>
              Your partner has been created and is ready for use.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-4">
              <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                What's Next?
              </h3>
              <ul className="text-sm text-green-700 dark:text-green-300 space-y-1 text-left">
                <li>• Partner configuration has been saved</li>
                <li>• Certificates have been validated and stored</li>
                <li>• Partner is ready for AS2 communication</li>
                <li>• You can now view and manage the partner</li>
              </ul>
            </div>

            <div className="flex justify-center space-x-4 pt-4">
              <Button onClick={viewPartner}>
                View Partner Details
              </Button>
              <Button variant="outline" asChild>
                <Link href="/partners">
                  View All Partners
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/partners">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Partner</h1>
          <p className="text-muted-foreground">
            Configure a new AS2 trading partner with step-by-step guidance
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                {React.createElement(steps[currentStep - 1].icon, { 
                  className: "h-4 w-4" 
                })}
              </div>
              <div>
                <CardTitle className="text-xl">
                  Step {currentStep} of 4: {steps[currentStep - 1].title}
                </CardTitle>
                <CardDescription>
                  Complete all steps to add your trading partner
                </CardDescription>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <Progress value={(currentStep / 4) * 100} className="w-full" />
            <div className="flex justify-between text-xs text-muted-foreground">
              {steps.map((step) => (
                <span 
                  key={step.number}
                  className={currentStep >= step.number ? 'text-primary' : ''}
                >
                  {step.title}
                </span>
              ))}
            </div>
          </div>
        </CardHeader>

        <form onSubmit={currentForm?.handleSubmit(onStepSubmit)}>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="partnerName">Partner Name *</Label>
                    <Input
                      id="partnerName"
                      placeholder="FDA FAERS"
                      {...step1Form.register('partnerName')}
                      disabled={isLoading}
                    />
                    {step1Form.formState.errors.partnerName && (
                      <p className="text-sm text-red-600">
                        {step1Form.formState.errors.partnerName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="organizationType">Organization Type *</Label>
                    <Select
                      onValueChange={(value) => step1Form.setValue('organizationType', value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select organization type" />
                      </SelectTrigger>
                      <SelectContent>
                        {organizationTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {step1Form.formState.errors.organizationType && (
                      <p className="text-sm text-red-600">
                        {step1Form.formState.errors.organizationType.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="as2Identifier">AS2 Identifier *</Label>
                  <Input
                    id="as2Identifier"
                    placeholder="FDA-FAERS-001"
                    {...step1Form.register('as2Identifier')}
                    disabled={isLoading}
                  />
                  {step1Form.formState.errors.as2Identifier && (
                    <p className="text-sm text-red-600">
                      {step1Form.formState.errors.as2Identifier.message}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Unique identifier for AS2 communication
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactName">Contact Name *</Label>
                    <Input
                      id="contactName"
                      placeholder="John Smith"
                      {...step1Form.register('contactName')}
                      disabled={isLoading}
                    />
                    {step1Form.formState.errors.contactName && (
                      <p className="text-sm text-red-600">
                        {step1Form.formState.errors.contactName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Contact Email *</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      placeholder="john.smith@fda.gov"
                      {...step1Form.register('contactEmail')}
                      disabled={isLoading}
                    />
                    {step1Form.formState.errors.contactEmail && (
                      <p className="text-sm text-red-600">
                        {step1Form.formState.errors.contactEmail.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    placeholder="+1 (555) 123-4567"
                    {...step1Form.register('contactPhone')}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Additional notes about this partner..."
                    {...step1Form.register('notes')}
                    disabled={isLoading}
                  />
                </div>
              </div>
            )}

            {/* Step 2: AS2 Configuration */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="as2StationId">AS2 Station ID *</Label>
                    <Input
                      id="as2StationId"
                      placeholder="YOUR-COMPANY-001"
                      {...step2Form.register('as2StationId')}
                      disabled={isLoading}
                    />
                    {step2Form.formState.errors.as2StationId && (
                      <p className="text-sm text-red-600">
                        {step2Form.formState.errors.as2StationId.message}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Your identifier to the partner
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="partnerUrl">Partner AS2 URL *</Label>
                    <Input
                      id="partnerUrl"
                      placeholder="https://partner.example.com:8443/as2"
                      {...step2Form.register('partnerUrl')}
                      disabled={isLoading}
                    />
                    {step2Form.formState.errors.partnerUrl && (
                      <p className="text-sm text-red-600">
                        {step2Form.formState.errors.partnerUrl.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subjectTemplate">Message Subject Template *</Label>
                  <Input
                    id="subjectTemplate"
                    {...step2Form.register('subjectTemplate')}
                    disabled={isLoading}
                  />
                  <p className="text-xs text-muted-foreground">
                    Use {'{filename}'} and {'{date}'} as variables
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="encryptionAlgorithm">Encryption Algorithm *</Label>
                    <Select
                      onValueChange={(value) => step2Form.setValue('encryptionAlgorithm', value)}
                      defaultValue="aes256"
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {encryptionAlgorithms.map((alg) => (
                          <SelectItem key={alg.value} value={alg.value}>
                            {alg.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signingAlgorithm">Signing Algorithm *</Label>
                    <Select
                      onValueChange={(value) => step2Form.setValue('signingAlgorithm', value)}
                      defaultValue="sha256"
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {signingAlgorithms.map((alg) => (
                          <SelectItem key={alg.value} value={alg.value}>
                            {alg.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="compression"
                    {...step2Form.register('compression')}
                    disabled={isLoading}
                  />
                  <Label htmlFor="compression">Enable ZLIB compression</Label>
                </div>
              </div>
            )}

            {/* Step 3: Certificate Upload */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="useSameCert"
                    {...step3Form.register('useSameCert')}
                    disabled={isLoading}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        // Clear signing certificate when using same cert
                        setSigningCertFile(null)
                      }
                    }}
                  />
                  <Label htmlFor="useSameCert">Use same certificate for encryption and signing</Label>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Partner's Encryption Certificate *</Label>
                    <div 
                      className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors"
                      onDragOver={(e) => {
                        e.preventDefault()
                        e.currentTarget.classList.add('border-primary')
                      }}
                      onDragLeave={(e) => {
                        e.preventDefault()
                        e.currentTarget.classList.remove('border-primary')
                      }}
                      onDrop={(e) => {
                        e.preventDefault()
                        e.currentTarget.classList.remove('border-primary')
                        const files = e.dataTransfer.files
                        if (files.length > 0) {
                          handleCertificateUpload(files[0], 'encryption')
                        }
                      }}
                    >
                      <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">
                        {encryptionCertFile ? (
                          <span className="text-green-600 font-medium">{encryptionCertFile.name}</span>
                        ) : (
                          'Drag and drop certificate file here, or click to browse'
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Accepts .pem, .crt, .cer files (max 5MB)
                      </p>
                      <input
                        type="file"
                        accept=".pem,.crt,.cer"
                        onChange={(e) => handleCertificateUpload(e.target.files[0], 'encryption')}
                        className="hidden"
                        id="encryption-cert-upload"
                        disabled={isLoading}
                      />
                      <Button 
                        variant="outline" 
                        type = "button"
                        className="mt-2" 
                        disabled={isLoading}
                        onClick={() => document.getElementById('encryption-cert-upload').click()}
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        {encryptionCertFile ? 'Change File' : 'Browse Files'}
                      </Button>
                    </div>
                  </div>

                  {!step3Form.watch('useSameCert') && (
                    <div className="space-y-2">
                      <Label>Partner's Signing Certificate *</Label>
                      <div 
                        className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors"
                        onDragOver={(e) => {
                          e.preventDefault()
                          e.currentTarget.classList.add('border-primary')
                        }}
                        onDragLeave={(e) => {
                          e.preventDefault()
                          e.currentTarget.classList.remove('border-primary')
                        }}
                        onDrop={(e) => {
                          e.preventDefault()
                          e.currentTarget.classList.remove('border-primary')
                          const files = e.dataTransfer.files
                          if (files.length > 0) {
                            handleCertificateUpload(files[0], 'signing')
                          }
                        }}
                      >
                        <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground mb-2">
                          {signingCertFile ? (
                            <span className="text-green-600 font-medium">{signingCertFile.name}</span>
                          ) : (
                            'Drag and drop certificate file here, or click to browse'
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Accepts .pem, .crt, .cer files (max 5MB)
                        </p>
                        <input
                          type="file"
                          accept=".pem,.crt,.cer"
                          onChange={(e) => handleCertificateUpload(e.target.files[0], 'signing')}
                          className="hidden"
                          id="signing-cert-upload"
                          disabled={isLoading}
                        />
                        <Button 
                          variant="outline" 
                        type = "button"
                          className="mt-2" 
                          disabled={isLoading}
                          onClick={() => document.getElementById('signing-cert-upload').click()}
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          {signingCertFile ? 'Change File' : 'Browse Files'}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    Certificates will be automatically validated for format, expiry date, and key strength (≥2048 bits).
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {/* Step 4: MDN Settings */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="requestSignedMdn"
                      {...step4Form.register('requestSignedMdn')}
                      disabled={isLoading}
                      defaultChecked
                    />
                    <Label htmlFor="requestSignedMdn">Request Signed MDN</Label>
                  </div>

                  <div className="space-y-2">
                    <Label>MDN Delivery Method *</Label>
                    <RadioGroup
                      defaultValue="sync"
                      onValueChange={(value) => step4Form.setValue('mdnDeliveryMethod', value)}
                      disabled={isLoading}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="sync" id="sync" />
                        <Label htmlFor="sync">Synchronous</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="async" id="async" />
                        <Label htmlFor="async">Asynchronous</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="mdnTimeout">MDN Receipt Timeout (minutes) *</Label>
                      <Input
                        id="mdnTimeout"
                        type="number"
                        min="5"
                        max="60"
                        defaultValue="15"
                        {...step4Form.register('mdnTimeout', { valueAsNumber: true })}
                        disabled={isLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mdnSigningAlgorithm">MDN Signing Algorithm *</Label>
                      <Select
                        onValueChange={(value) => step4Form.setValue('mdnSigningAlgorithm', value)}
                        defaultValue="sha256"
                        disabled={isLoading}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {signingAlgorithms.map((alg) => (
                            <SelectItem key={alg.value} value={alg.value}>
                              {alg.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 p-4 border rounded-lg">
                  <h4 className="font-medium">Retry Settings</h4>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="enableRetry"
                      {...step4Form.register('enableRetry')}
                      disabled={isLoading}
                      defaultChecked
                    />
                    <Label htmlFor="enableRetry">Enable auto-retry on MDN timeout</Label>
                  </div>

                  {step4Form.watch('enableRetry') && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="maxRetries">Max Retry Attempts</Label>
                        <Input
                          id="maxRetries"
                          type="number"
                          min="1"
                          max="5"
                          defaultValue="3"
                          {...step4Form.register('maxRetries', { valueAsNumber: true })}
                          disabled={isLoading}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="retryInterval">Retry Interval (minutes)</Label>
                        <Input
                          id="retryInterval"
                          type="number"
                          min="1"
                          max="60"
                          defaultValue="5"
                          {...step4Form.register('retryInterval', { valueAsNumber: true })}
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 5: Testing */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="text-center">
                  <TestTube className="mx-auto h-12 w-12 text-primary mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Connection Test</h3>
                  <p className="text-muted-foreground">
                    We'll test the connection to ensure everything is configured correctly
                  </p>
                </div>

                {testResults && (
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-medium mb-3">Test Progress:</h4>
                    <div className="space-y-1 font-mono text-sm">
                      {testResults.map((result, index) => (
                        <div key={index} className={result.startsWith('✅') ? 'text-green-600' : ''}>
                          {result}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {!testResults && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      The test will send a sample E2B(R3) XML file to verify the connection, 
                      encryption, signing, and MDN receipt.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </CardContent>

          <div className="flex justify-between p-6 pt-0">
            <Button
              type="button"
              variant="outline"
              onClick={goBack}
              disabled={currentStep === 1 || isLoading}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            <Button 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {currentStep === 5 ? 'Run Test' : 'Continue'}
              {currentStep < 5 && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}