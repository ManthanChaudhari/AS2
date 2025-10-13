'use client'

import { useState } from 'react'
import { 
  Upload, 
  FileText, 
  Send, 
  CheckCircle, 
  AlertTriangle,
  X,
  Loader2,
  Play,
  Pause,
  Square,
  Download
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'

// Dummy partners data
const partnersData = [
  { id: '1', name: 'FDA FAERS', as2Id: 'FDA-FAERS-001' },
  { id: '2', name: 'EMA EudraVigilance', as2Id: 'EMA-EV-002' },
  { id: '3', name: 'Health Canada', as2Id: 'HC-CANADA-001' },
  { id: '4', name: 'Pfizer Inc.', as2Id: 'PFIZER-001' }
]

export default function BatchUploadPage() {
  const [files, setFiles] = useState([])
  const [selectedFiles, setSelectedFiles] = useState([])
  const [bulkPartner, setBulkPartner] = useState('')
  const [bulkPriority, setBulkPriority] = useState('normal')
  const [isSending, setIsSending] = useState(false)
  const [sendProgress, setSendProgress] = useState(0)
  const [sendResults, setSendResults] = useState(null)
  const [isPaused, setIsPaused] = useState(false)

  const handleFileUpload = (event) => {
    const uploadedFiles = Array.from(event.target.files)
    const newFiles = uploadedFiles.map((file, index) => ({
      id: Date.now() + index,
      file,
      name: file.name,
      size: file.size,
      partnerId: bulkPartner,
      priority: bulkPriority,
      status: 'pending',
      error: null
    }))
    
    setFiles(prev => [...prev, ...newFiles])
  }

  const removeFile = (fileId) => {
    setFiles(files.filter(f => f.id !== fileId))
    setSelectedFiles(selectedFiles.filter(id => id !== fileId))
  }

  const updateFilePartner = (fileId, partnerId) => {
    setFiles(files.map(f => 
      f.id === fileId ? { ...f, partnerId } : f
    ))
  }

  const updateFilePriority = (fileId, priority) => {
    setFiles(files.map(f => 
      f.id === fileId ? { ...f, priority } : f
    ))
  }

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedFiles(files.map(f => f.id))
    } else {
      setSelectedFiles([])
    }
  }

  const handleSelectFile = (fileId, checked) => {
    if (checked) {
      setSelectedFiles([...selectedFiles, fileId])
    } else {
      setSelectedFiles(selectedFiles.filter(id => id !== fileId))
    }
  }

  const setBulkPartnerForSelected = () => {
    if (bulkPartner && selectedFiles.length > 0) {
      setFiles(files.map(f => 
        selectedFiles.includes(f.id) ? { ...f, partnerId: bulkPartner } : f
      ))
    }
  }

  const setBulkPriorityForSelected = () => {
    if (selectedFiles.length > 0) {
      setFiles(files.map(f => 
        selectedFiles.includes(f.id) ? { ...f, priority: bulkPriority } : f
      ))
    }
  }

  const removeSelectedFiles = () => {
    setFiles(files.filter(f => !selectedFiles.includes(f.id)))
    setSelectedFiles([])
  }

  const startBatchSend = async () => {
    setIsSending(true)
    setSendProgress(0)
    setIsPaused(false)
    
    const validFiles = files.filter(f => f.partnerId && f.status === 'pending')
    let successCount = 0
    let failureCount = 0
    
    for (let i = 0; i < validFiles.length; i++) {
      if (isPaused) break
      
      const file = validFiles[i]
      
      // Update file status to sending
      setFiles(prev => prev.map(f => 
        f.id === file.id ? { ...f, status: 'sending' } : f
      ))
      
      try {
        // Simulate sending
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Simulate random success/failure
        const success = Math.random() > 0.1 // 90% success rate
        
        if (success) {
          successCount++
          setFiles(prev => prev.map(f => 
            f.id === file.id ? { 
              ...f, 
              status: 'success',
              messageId: `MSG-${Date.now()}-${i}`
            } : f
          ))
        } else {
          failureCount++
          setFiles(prev => prev.map(f => 
            f.id === file.id ? { 
              ...f, 
              status: 'failed',
              error: 'Connection timeout'
            } : f
          ))
        }
      } catch (error) {
        failureCount++
        setFiles(prev => prev.map(f => 
          f.id === file.id ? { 
            ...f, 
            status: 'failed',
            error: error.message
          } : f
        ))
      }
      
      setSendProgress(((i + 1) / validFiles.length) * 100)
    }
    
    setSendResults({
      total: validFiles.length,
      success: successCount,
      failed: failureCount
    })
    
    setIsSending(false)
  }

  const pauseSending = () => {
    setIsPaused(true)
  }

  const resumeSending = () => {
    setIsPaused(false)
    // In real implementation, would resume from where it left off
  }

  const cancelSending = () => {
    setIsSending(false)
    setIsPaused(false)
    setSendProgress(0)
    // Reset pending files
    setFiles(files.map(f => 
      f.status === 'sending' ? { ...f, status: 'pending' } : f
    ))
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>
      case 'sending':
        return <Badge className="bg-blue-100 text-blue-800">Sending</Badge>
      case 'success':
        return <Badge className="bg-green-100 text-green-800">Success</Badge>
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const validFiles = files.filter(f => f.partnerId)
  const totalSize = files.reduce((sum, f) => sum + f.size, 0)
  const partnersInvolved = new Set(files.map(f => f.partnerId).filter(Boolean)).size

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Batch Upload</h1>
        <p className="text-muted-foreground">
          Send multiple files to one or more trading partners
        </p>
      </div>

      {/* File Upload Zone */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Files</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Drop multiple files here</h3>
            <p className="text-muted-foreground mb-4">
              or click to browse files (max 100 files)
            </p>
            <input
              type="file"
              accept=".xml"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              id="batch-file-upload"
              disabled={files.length >= 100}
            />
            <Button asChild disabled={files.length >= 100}>
              <label htmlFor="batch-file-upload" className="cursor-pointer">
                <FileText className="mr-2 h-4 w-4" />
                Browse Files
              </label>
            </Button>
            <p className="text-xs text-muted-foreground mt-4">
              XML files only • {files.length}/100 files uploaded
            </p>
          </div>
        </CardContent>
      </Card>   
   {/* Bulk Actions */}
      {files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Bulk Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Assign Partner to Selected</Label>
                <div className="flex space-x-2">
                  <Select value={bulkPartner} onValueChange={setBulkPartner}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select partner" />
                    </SelectTrigger>
                    <SelectContent>
                      {partnersData.map((partner) => (
                        <SelectItem key={partner.id} value={partner.id}>
                          {partner.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button 
                    variant="outline" 
                    onClick={setBulkPartnerForSelected}
                    disabled={!bulkPartner || selectedFiles.length === 0}
                  >
                    Apply
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Set Priority for Selected</Label>
                <div className="flex space-x-2">
                  <Select value={bulkPriority} onValueChange={setBulkPriority}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    variant="outline" 
                    onClick={setBulkPriorityForSelected}
                    disabled={selectedFiles.length === 0}
                  >
                    Apply
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Remove Selected</Label>
                <Button 
                  variant="outline" 
                  onClick={removeSelectedFiles}
                  disabled={selectedFiles.length === 0}
                  className="w-full"
                >
                  Remove Selected ({selectedFiles.length})
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* File List */}
      {files.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>File List ({files.length} files)</CardTitle>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={selectedFiles.length === files.length && files.length > 0}
                  onCheckedChange={handleSelectAll}
                />
                <Label>Select All</Label>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {files.map((file) => (
                <div key={file.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                  <Checkbox
                    checked={selectedFiles.includes(file.id)}
                    onCheckedChange={(checked) => handleSelectFile(file.id, checked)}
                  />
                  
                  <FileText className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Select
                      value={file.partnerId || ''}
                      onValueChange={(value) => updateFilePartner(file.id, value)}
                      disabled={isSending}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Select partner" />
                      </SelectTrigger>
                      <SelectContent>
                        {partnersData.map((partner) => (
                          <SelectItem key={partner.id} value={partner.id}>
                            {partner.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select
                      value={file.priority}
                      onValueChange={(value) => updateFilePriority(file.id, value)}
                      disabled={isSending}
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    {getStatusBadge(file.status)}
                    
                    {!isSending && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(file.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Queue Preview */}
      {files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Queue Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{files.length}</div>
                <div className="text-sm text-muted-foreground">Total Files</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{validFiles.length}</div>
                <div className="text-sm text-muted-foreground">Ready to Send</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{formatFileSize(totalSize)}</div>
                <div className="text-sm text-muted-foreground">Total Size</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{partnersInvolved}</div>
                <div className="text-sm text-muted-foreground">Partners</div>
              </div>
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Estimated send time: ~{Math.ceil(validFiles.length * 2 / 60)} minutes
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Send Controls */}
      {files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Send Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {validFiles.length === 0 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  No files are ready to send. Please assign partners to your files.
                </AlertDescription>
              </Alert>
            )}
            
            {isSending && (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Sending files...</span>
                    <span>{Math.round(sendProgress)}%</span>
                  </div>
                  <Progress value={sendProgress} className="w-full" />
                </div>
                
                <div className="flex justify-center space-x-2">
                  {!isPaused ? (
                    <Button variant="outline" onClick={pauseSending}>
                      <Pause className="mr-2 h-4 w-4" />
                      Pause
                    </Button>
                  ) : (
                    <Button variant="outline" onClick={resumeSending}>
                      <Play className="mr-2 h-4 w-4" />
                      Resume
                    </Button>
                  )}
                  <Button variant="outline" onClick={cancelSending}>
                    <Square className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              </div>
            )}
            
            {!isSending && validFiles.length > 0 && (
              <div className="text-center">
                <Button onClick={startBatchSend} className="bg-green-600 hover:bg-green-700">
                  <Send className="mr-2 h-4 w-4" />
                  Start Batch Send ({validFiles.length} files)
                </Button>
              </div>
            )}
            
            {sendResults && (
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">Batch Send Complete</h4>
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Files:</span>
                    <span className="font-medium">{sendResults.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Successful:</span>
                    <span className="font-medium text-green-600">{sendResults.success}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Failed:</span>
                    <span className="font-medium text-red-600">{sendResults.failed}</span>
                  </div>
                </div>
                
                <div className="flex justify-center space-x-2 mt-4">
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download Report
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href="/outbox">View in Outbox</a>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}