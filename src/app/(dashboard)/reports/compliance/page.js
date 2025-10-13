'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft,
  Shield, 
  Download, 
  Calendar,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  Clock,
  Users,
  Activity,
  BarChart3
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Dummy compliance data
const complianceMetrics = [
  {
    title: 'Regulatory Submissions',
    value: '1,247',
    target: '1,200',
    status: 'compliant',
    percentage: 103.9
  },
  {
    title: 'On-Time Submissions',
    value: '98.5%',
    target: '95%',
    status: 'compliant',
    percentage: 98.5
  },
  {
    title: 'Data Integrity Checks',
    value: '99.2%',
    target: '99%',
    status: 'compliant',
    percentage: 99.2
  },
  {
    title: 'Audit Trail Completeness',
    value: '100%',
    target: '100%',
    status: 'compliant',
    percentage: 100
  }
]

const regulatorySubmissions = [
  {
    id: 1,
    agency: 'FDA FAERS',
    region: 'United States',
    submissionType: 'ICSR',
    period: 'Q3 2024',
    dueDate: '2024-10-15',
    submittedDate: '2024-10-12',
    status: 'submitted',
    caseCount: 156,
    complianceScore: 98.5
  },
  {
    id: 2,
    agency: 'EMA EudraVigilance',
    region: 'European Union',
    submissionType: 'ICSR',
    period: 'Q3 2024',
    dueDate: '2024-10-20',
    submittedDate: '2024-10-18',
    status: 'submitted',
    caseCount: 134,
    complianceScore: 97.8
  },
  {
    id: 3,
    agency: 'Health Canada',
    region: 'Canada',
    submissionType: 'ICSR',
    period: 'Q3 2024',
    dueDate: '2024-10-25',
    submittedDate: '2024-10-23',
    status: 'submitted',
    caseCount: 89,
    complianceScore: 96.2
  },
  {
    id: 4,
    agency: 'MHRA',
    region: 'United Kingdom',
    submissionType: 'ICSR',
    period: 'Q3 2024',
    dueDate: '2024-10-30',
    submittedDate: null,
    status: 'pending',
    caseCount: 67,
    complianceScore: null
  },
  {
    id: 5,
    agency: 'TGA',
    region: 'Australia',
    submissionType: 'ICSR',
    period: 'Q3 2024',
    dueDate: '2024-11-05',
    submittedDate: null,
    status: 'in_progress',
    caseCount: 45,
    complianceScore: null
  }
]

const auditTrailSummary = [
  {
    category: 'User Authentication',
    totalEvents: 2456,
    compliantEvents: 2456,
    complianceRate: 100,
    lastAudit: '2024-10-01'
  },
  {
    category: 'Data Modifications',
    totalEvents: 1834,
    compliantEvents: 1829,
    complianceRate: 99.7,
    lastAudit: '2024-10-01'
  },
  {
    category: 'File Transmissions',
    totalEvents: 3245,
    compliantEvents: 3241,
    complianceRate: 99.9,
    lastAudit: '2024-10-01'
  },
  {
    category: 'System Configuration',
    totalEvents: 156,
    compliantEvents: 156,
    complianceRate: 100,
    lastAudit: '2024-10-01'
  },
  {
    category: 'Certificate Management',
    totalEvents: 89,
    compliantEvents: 89,
    complianceRate: 100,
    lastAudit: '2024-10-01'
  }
]

const complianceReportTemplates = [
  {
    id: 1,
    name: 'FDA 21 CFR Part 11 Compliance Report',
    description: 'Electronic records and signatures compliance for FDA submissions',
    agency: 'FDA',
    frequency: 'Quarterly',
    lastGenerated: '2024-10-01',
    status: 'active'
  },
  {
    id: 2,
    name: 'EMA GVP Module VI Compliance Report',
    description: 'Good Pharmacovigilance Practice compliance for EMA',
    agency: 'EMA',
    frequency: 'Quarterly',
    lastGenerated: '2024-10-01',
    status: 'active'
  },
  {
    id: 3,
    name: 'ICH E2B(R3) Data Quality Report',
    description: 'Data quality and integrity report for ICH E2B submissions',
    agency: 'Multiple',
    frequency: 'Monthly',
    lastGenerated: '2024-10-01',
    status: 'active'
  },
  {
    id: 4,
    name: 'GDPR Data Processing Report',
    description: 'Data protection and privacy compliance report',
    agency: 'EU',
    frequency: 'Annual',
    lastGenerated: '2024-01-01',
    status: 'active'
  }
]

function getStatusBadge(status) {
  switch (status) {
    case 'submitted':
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Submitted</Badge>
    case 'pending':
      return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Pending</Badge>
    case 'in_progress':
      return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">In Progress</Badge>
    case 'overdue':
      return <Badge variant="destructive">Overdue</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

function getComplianceStatusIcon(status) {
  switch (status) {
    case 'compliant':
      return <CheckCircle className="h-4 w-4 text-green-600" />
    case 'warning':
      return <AlertTriangle className="h-4 w-4 text-yellow-600" />
    case 'non_compliant':
      return <XCircle className="h-4 w-4 text-red-600" />
    default:
      return <Clock className="h-4 w-4 text-gray-600" />
  }
}

function ComplianceMetricCard({ metric }) {
  const getStatusColor = () => {
    if (metric.status === 'compliant') {
      return 'text-green-600'
    } else if (metric.status === 'warning') {
      return 'text-yellow-600'
    } else {
      return 'text-red-600'
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {metric.title}
        </CardTitle>
        {getComplianceStatusIcon(metric.status)}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-baseline space-x-2">
            <div className="text-2xl font-bold">{metric.value}</div>
            <div className="text-sm text-muted-foreground">/ {metric.target}</div>
          </div>
          <Progress value={Math.min(metric.percentage, 100)} className="h-2" />
          <div className={`text-xs font-medium ${getStatusColor()}`}>
            {metric.percentage}% of target
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ComplianceReportingPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('q3_2024')
  const [selectedAgency, setSelectedAgency] = useState('all')

  const handleGenerateReport = (templateId) => {
    console.log('Generating compliance report for template:', templateId)
  }

  const handleScheduleReport = (templateId) => {
    console.log('Scheduling compliance report for template:', templateId)
  }

  const handleExportAuditTrail = () => {
    console.log('Exporting audit trail documentation')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/reports">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Compliance Reporting</h1>
            <p className="text-muted-foreground">
              Regulatory compliance tracking and audit trail documentation
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleExportAuditTrail}>
            <Download className="mr-2 h-4 w-4" />
            Export Audit Trail
          </Button>
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Compliance Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {complianceMetrics.map((metric, index) => (
          <ComplianceMetricCard key={index} metric={metric} />
        ))}
      </div>

      {/* Report Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Report Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Reporting Period</Label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="q1_2024">Q1 2024</SelectItem>
                  <SelectItem value="q2_2024">Q2 2024</SelectItem>
                  <SelectItem value="q3_2024">Q3 2024</SelectItem>
                  <SelectItem value="q4_2024">Q4 2024</SelectItem>
                  <SelectItem value="2024">Full Year 2024</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Regulatory Agency</Label>
              <Select value={selectedAgency} onValueChange={setSelectedAgency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Agencies</SelectItem>
                  <SelectItem value="fda">FDA</SelectItem>
                  <SelectItem value="ema">EMA</SelectItem>
                  <SelectItem value="hc">Health Canada</SelectItem>
                  <SelectItem value="mhra">MHRA</SelectItem>
                  <SelectItem value="tga">TGA</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button className="w-full">
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Tabs */}
      <Tabs defaultValue="submissions" className="space-y-6">
        <TabsList>
          <TabsTrigger value="submissions">Regulatory Submissions</TabsTrigger>
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
          <TabsTrigger value="templates">Report Templates</TabsTrigger>
          <TabsTrigger value="schedule">Scheduled Reports</TabsTrigger>
        </TabsList>

        {/* Regulatory Submissions Tab */}
        <TabsContent value="submissions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Regulatory Submission Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {regulatorySubmissions.map((submission) => (
                  <div key={submission.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-medium">{submission.agency}</h3>
                        {getStatusBadge(submission.status)}
                      </div>
                      <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">Region:</span> {submission.region}
                        </div>
                        <div>
                          <span className="font-medium">Period:</span> {submission.period}
                        </div>
                        <div>
                          <span className="font-medium">Cases:</span> {submission.caseCount}
                        </div>
                        <div>
                          <span className="font-medium">Due:</span> {new Date(submission.dueDate).toLocaleDateString()}
                        </div>
                      </div>
                      {submission.submittedDate && (
                        <div className="mt-1 text-sm text-muted-foreground">
                          <span className="font-medium">Submitted:</span> {new Date(submission.submittedDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      {submission.complianceScore && (
                        <div className="text-lg font-bold text-green-600">
                          {submission.complianceScore}%
                        </div>
                      )}
                      <div className="text-sm text-muted-foreground">
                        {submission.complianceScore ? 'Compliance Score' : 'Pending'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audit Trail Tab */}
        <TabsContent value="audit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Audit Trail Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auditTrailSummary.map((category, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium">{category.category}</h3>
                      <div className="mt-2 flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>Total Events: {category.totalEvents.toLocaleString()}</span>
                        <span>Compliant: {category.compliantEvents.toLocaleString()}</span>
                        <span>Last Audit: {new Date(category.lastAudit).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        {category.complianceRate === 100 ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : category.complianceRate >= 99 ? (
                          <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        <span className="text-lg font-bold">{category.complianceRate}%</span>
                      </div>
                      <div className="text-sm text-muted-foreground">Compliance Rate</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Report Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Report Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {complianceReportTemplates.map((template) => (
                  <Card key={template.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <Badge variant="outline">{template.agency}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        {template.description}
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Frequency:</span>
                        <span className="font-medium">{template.frequency}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Last Generated:</span>
                        <span className="font-medium">{new Date(template.lastGenerated).toLocaleDateString()}</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" onClick={() => handleGenerateReport(template.id)}>
                          Generate Now
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleScheduleReport(template.id)}>
                          <Calendar className="mr-2 h-4 w-4" />
                          Schedule
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Scheduled Reports Tab */}
        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Compliance Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Scheduled Reports</h3>
                <p className="text-muted-foreground mb-4">
                  Set up automated compliance report generation to ensure timely regulatory submissions.
                </p>
                <Button>
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule New Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}