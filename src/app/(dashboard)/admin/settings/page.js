'use client'

import { useState } from 'react'
import { 
  Save, 
  Download, 
  Upload, 
  Settings, 
  Globe, 
  Clock, 
  Shield, 
  Bell,
  Database,
  RefreshCw,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'

// Dummy system settings data
const systemSettings = {
  as2: {
    endpointUrl: 'https://your-company.com:8443/as2',
    stationId: 'ACME-PHARMA-001',
    defaultEncryption: 'aes256',
    defaultSigning: 'sha256',
    compression: true,
    mdnTimeout: 15,
    maxRetries: 3,
    retryInterval: 5
  },
  notifications: {
    emailEnabled: true,
    smtpServer: 'smtp.company.com',
    smtpPort: 587,
    smtpUsername: 'notifications@company.com',
    certificateExpiry: true,
    transmissionFailures: true,
    systemAlerts: true,
    dailyReports: false
  },
  monitoring: {
    healthCheckInterval: 5,
    logRetention: 90,
    metricsRetention: 365,
    alertThresholds: {
      failureRate: 5,
      responseTime: 10000,
      diskUsage: 85
    }
  },
  security: {
    sessionTimeout: 30,
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true
    },
    mfaRequired: false,
    ipWhitelist: []
  }
}

export default function SystemSettingsPage() {
  const [settings, setSettings] = useState(systemSettings)
  const [isLoading, setIsLoading] = useState(false)
  const [lastSaved, setLastSaved] = useState('2024-10-13T10:30:00Z')

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      setLastSaved(new Date().toISOString())
      console.log('Settings saved:', settings)
    } catch (error) {
      console.error('Failed to save settings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackup = () => {
    console.log('Downloading configuration backup...')
    // In real app: generate and download backup file
  }

  const handleRestore = () => {
    console.log('Restoring configuration from backup...')
    // In real app: show file upload dialog for restore
  }

  const handleTestConnection = async () => {
    console.log('Testing AS2 connection...')
    // In real app: test AS2 endpoint connectivity
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
          <p className="text-muted-foreground">
            Configure AS2 portal settings and system parameters
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleBackup}>
            <Download className="mr-2 h-4 w-4" />
            Backup Config
          </Button>
          <Button variant="outline" onClick={handleRestore}>
            <Upload className="mr-2 h-4 w-4" />
            Restore Config
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Changes
          </Button>
        </div>
      </div>

      {/* Last Saved Info */}
      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          Settings last saved: {new Date(lastSaved).toLocaleString()}
        </AlertDescription>
      </Alert>

      {/* Settings Tabs */}
      <Tabs defaultValue="as2" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="as2">AS2 Configuration</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* AS2 Configuration Tab */}
        <TabsContent value="as2" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="mr-2 h-5 w-5" />
                AS2 Endpoint Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="endpointUrl">AS2 Endpoint URL *</Label>
                  <Input
                    id="endpointUrl"
                    value={settings.as2.endpointUrl}
                    onChange={(e) => setSettings({
                      ...settings,
                      as2: { ...settings.as2, endpointUrl: e.target.value }
                    })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Your organization's AS2 endpoint URL
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stationId">AS2 Station ID *</Label>
                  <Input
                    id="stationId"
                    value={settings.as2.stationId}
                    onChange={(e) => setSettings({
                      ...settings,
                      as2: { ...settings.as2, stationId: e.target.value }
                    })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Your organization's AS2 identifier
                  </p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="defaultEncryption">Default Encryption Algorithm</Label>
                  <Select
                    value={settings.as2.defaultEncryption}
                    onValueChange={(value) => setSettings({
                      ...settings,
                      as2: { ...settings.as2, defaultEncryption: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aes128">AES-128</SelectItem>
                      <SelectItem value="aes192">AES-192</SelectItem>
                      <SelectItem value="aes256">AES-256</SelectItem>
                      <SelectItem value="3des">3DES</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="defaultSigning">Default Signing Algorithm</Label>
                  <Select
                    value={settings.as2.defaultSigning}
                    onValueChange={(value) => setSettings({
                      ...settings,
                      as2: { ...settings.as2, defaultSigning: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sha1">SHA-1</SelectItem>
                      <SelectItem value="sha256">SHA-256</SelectItem>
                      <SelectItem value="sha384">SHA-384</SelectItem>
                      <SelectItem value="sha512">SHA-512</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="compression"
                  checked={settings.as2.compression}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    as2: { ...settings.as2, compression: checked }
                  })}
                />
                <Label htmlFor="compression">Enable ZLIB compression by default</Label>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-medium mb-4">Timeout & Retry Settings</h4>
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="mdnTimeout">MDN Timeout (minutes)</Label>
                    <Input
                      id="mdnTimeout"
                      type="number"
                      min="5"
                      max="60"
                      value={settings.as2.mdnTimeout}
                      onChange={(e) => setSettings({
                        ...settings,
                        as2: { ...settings.as2, mdnTimeout: parseInt(e.target.value) }
                      })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxRetries">Max Retry Attempts</Label>
                    <Input
                      id="maxRetries"
                      type="number"
                      min="1"
                      max="10"
                      value={settings.as2.maxRetries}
                      onChange={(e) => setSettings({
                        ...settings,
                        as2: { ...settings.as2, maxRetries: parseInt(e.target.value) }
                      })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="retryInterval">Retry Interval (minutes)</Label>
                    <Input
                      id="retryInterval"
                      type="number"
                      min="1"
                      max="60"
                      value={settings.as2.retryInterval}
                      onChange={(e) => setSettings({
                        ...settings,
                        as2: { ...settings.as2, retryInterval: parseInt(e.target.value) }
                      })}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button variant="outline" onClick={handleTestConnection}>
                  <Globe className="mr-2 h-4 w-4" />
                  Test AS2 Connection
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5" />
                Email Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="emailEnabled"
                  checked={settings.notifications.emailEnabled}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, emailEnabled: checked }
                  })}
                />
                <Label htmlFor="emailEnabled">Enable email notifications</Label>
              </div>

              {settings.notifications.emailEnabled && (
                <div className="space-y-4 pl-6 border-l-2 border-border">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="smtpServer">SMTP Server *</Label>
                      <Input
                        id="smtpServer"
                        value={settings.notifications.smtpServer}
                        onChange={(e) => setSettings({
                          ...settings,
                          notifications: { ...settings.notifications, smtpServer: e.target.value }
                        })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="smtpPort">SMTP Port *</Label>
                      <Input
                        id="smtpPort"
                        type="number"
                        value={settings.notifications.smtpPort}
                        onChange={(e) => setSettings({
                          ...settings,
                          notifications: { ...settings.notifications, smtpPort: parseInt(e.target.value) }
                        })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="smtpUsername">SMTP Username</Label>
                    <Input
                      id="smtpUsername"
                      value={settings.notifications.smtpUsername}
                      onChange={(e) => setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, smtpUsername: e.target.value }
                      })}
                    />
                  </div>
                </div>
              )}

              <div className="border-t pt-6">
                <h4 className="font-medium mb-4">Notification Types</h4>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="certificateExpiry"
                      checked={settings.notifications.certificateExpiry}
                      onCheckedChange={(checked) => setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, certificateExpiry: checked }
                      })}
                    />
                    <Label htmlFor="certificateExpiry">Certificate expiry alerts</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="transmissionFailures"
                      checked={settings.notifications.transmissionFailures}
                      onCheckedChange={(checked) => setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, transmissionFailures: checked }
                      })}
                    />
                    <Label htmlFor="transmissionFailures">Transmission failure alerts</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="systemAlerts"
                      checked={settings.notifications.systemAlerts}
                      onCheckedChange={(checked) => setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, systemAlerts: checked }
                      })}
                    />
                    <Label htmlFor="systemAlerts">System health alerts</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="dailyReports"
                      checked={settings.notifications.dailyReports}
                      onCheckedChange={(checked) => setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, dailyReports: checked }
                      })}
                    />
                    <Label htmlFor="dailyReports">Daily summary reports</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Monitoring Tab */}
        <TabsContent value="monitoring" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="mr-2 h-5 w-5" />
                System Monitoring
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="healthCheckInterval">Health Check Interval (minutes)</Label>
                  <Input
                    id="healthCheckInterval"
                    type="number"
                    min="1"
                    max="60"
                    value={settings.monitoring.healthCheckInterval}
                    onChange={(e) => setSettings({
                      ...settings,
                      monitoring: { ...settings.monitoring, healthCheckInterval: parseInt(e.target.value) }
                    })}
                  />
                  <p className="text-xs text-muted-foreground">
                    How often to check system health
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logRetention">Log Retention (days)</Label>
                  <Input
                    id="logRetention"
                    type="number"
                    min="30"
                    max="365"
                    value={settings.monitoring.logRetention}
                    onChange={(e) => setSettings({
                      ...settings,
                      monitoring: { ...settings.monitoring, logRetention: parseInt(e.target.value) }
                    })}
                  />
                  <p className="text-xs text-muted-foreground">
                    How long to keep audit logs
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="metricsRetention">Metrics Retention (days)</Label>
                <Input
                  id="metricsRetention"
                  type="number"
                  min="90"
                  max="1095"
                  value={settings.monitoring.metricsRetention}
                  onChange={(e) => setSettings({
                    ...settings,
                    monitoring: { ...settings.monitoring, metricsRetention: parseInt(e.target.value) }
                  })}
                />
                <p className="text-xs text-muted-foreground">
                  How long to keep performance metrics
                </p>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-medium mb-4">Alert Thresholds</h4>
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="failureRate">Failure Rate (%)</Label>
                    <Input
                      id="failureRate"
                      type="number"
                      min="1"
                      max="50"
                      value={settings.monitoring.alertThresholds.failureRate}
                      onChange={(e) => setSettings({
                        ...settings,
                        monitoring: {
                          ...settings.monitoring,
                          alertThresholds: {
                            ...settings.monitoring.alertThresholds,
                            failureRate: parseInt(e.target.value)
                          }
                        }
                      })}
                    />
                    <p className="text-xs text-muted-foreground">
                      Alert when failure rate exceeds this percentage
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="responseTime">Response Time (ms)</Label>
                    <Input
                      id="responseTime"
                      type="number"
                      min="1000"
                      max="60000"
                      value={settings.monitoring.alertThresholds.responseTime}
                      onChange={(e) => setSettings({
                        ...settings,
                        monitoring: {
                          ...settings.monitoring,
                          alertThresholds: {
                            ...settings.monitoring.alertThresholds,
                            responseTime: parseInt(e.target.value)
                          }
                        }
                      })}
                    />
                    <p className="text-xs text-muted-foreground">
                      Alert when response time exceeds this value
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="diskUsage">Disk Usage (%)</Label>
                    <Input
                      id="diskUsage"
                      type="number"
                      min="50"
                      max="95"
                      value={settings.monitoring.alertThresholds.diskUsage}
                      onChange={(e) => setSettings({
                        ...settings,
                        monitoring: {
                          ...settings.monitoring,
                          alertThresholds: {
                            ...settings.monitoring.alertThresholds,
                            diskUsage: parseInt(e.target.value)
                          }
                        }
                      })}
                    />
                    <p className="text-xs text-muted-foreground">
                      Alert when disk usage exceeds this percentage
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  min="5"
                  max="480"
                  value={settings.security.sessionTimeout}
                  onChange={(e) => setSettings({
                    ...settings,
                    security: { ...settings.security, sessionTimeout: parseInt(e.target.value) }
                  })}
                />
                <p className="text-xs text-muted-foreground">
                  Automatically log out users after this period of inactivity
                </p>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-medium mb-4">Password Policy</h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="minLength">Minimum Length</Label>
                    <Input
                      id="minLength"
                      type="number"
                      min="6"
                      max="32"
                      value={settings.security.passwordPolicy.minLength}
                      onChange={(e) => setSettings({
                        ...settings,
                        security: {
                          ...settings.security,
                          passwordPolicy: {
                            ...settings.security.passwordPolicy,
                            minLength: parseInt(e.target.value)
                          }
                        }
                      })}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="requireUppercase"
                        checked={settings.security.passwordPolicy.requireUppercase}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          security: {
                            ...settings.security,
                            passwordPolicy: {
                              ...settings.security.passwordPolicy,
                              requireUppercase: checked
                            }
                          }
                        })}
                      />
                      <Label htmlFor="requireUppercase">Require uppercase letters</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="requireLowercase"
                        checked={settings.security.passwordPolicy.requireLowercase}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          security: {
                            ...settings.security,
                            passwordPolicy: {
                              ...settings.security.passwordPolicy,
                              requireLowercase: checked
                            }
                          }
                        })}
                      />
                      <Label htmlFor="requireLowercase">Require lowercase letters</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="requireNumbers"
                        checked={settings.security.passwordPolicy.requireNumbers}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          security: {
                            ...settings.security,
                            passwordPolicy: {
                              ...settings.security.passwordPolicy,
                              requireNumbers: checked
                            }
                          }
                        })}
                      />
                      <Label htmlFor="requireNumbers">Require numbers</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="requireSpecialChars"
                        checked={settings.security.passwordPolicy.requireSpecialChars}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          security: {
                            ...settings.security,
                            passwordPolicy: {
                              ...settings.security.passwordPolicy,
                              requireSpecialChars: checked
                            }
                          }
                        })}
                      />
                      <Label htmlFor="requireSpecialChars">Require special characters</Label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Switch
                    id="mfaRequired"
                    checked={settings.security.mfaRequired}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      security: { ...settings.security, mfaRequired: checked }
                    })}
                  />
                  <Label htmlFor="mfaRequired">Require Multi-Factor Authentication</Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  When enabled, all users must set up MFA to access the system
                </p>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-medium mb-4">IP Whitelist</h4>
                <Textarea
                  placeholder="Enter IP addresses or ranges, one per line&#10;192.168.1.0/24&#10;10.0.0.1"
                  value={settings.security.ipWhitelist.join('\n')}
                  onChange={(e) => setSettings({
                    ...settings,
                    security: {
                      ...settings.security,
                      ipWhitelist: e.target.value.split('\n').filter(ip => ip.trim())
                    }
                  })}
                  className="min-h-[100px]"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Leave empty to allow access from any IP address
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}