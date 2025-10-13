'use client'

import { useState } from 'react'
import { 
  Search, 
  Book, 
  Users, 
  Shield, 
  Send, 
  Inbox, 
  Settings,
  ChevronRight,
  Play,
  FileText,
  HelpCircle,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'

// Dummy guide data
const guideCategories = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: Play,
    description: 'Learn the basics of the AS2 Portal',
    articles: [
      { title: 'Portal Overview', duration: '5 min', difficulty: 'Beginner' },
      { title: 'First Login', duration: '3 min', difficulty: 'Beginner' },
      { title: 'Dashboard Navigation', duration: '7 min', difficulty: 'Beginner' },
      { title: 'User Roles and Permissions', duration: '10 min', difficulty: 'Intermediate' }
    ]
  },
  {
    id: 'partner-management',
    title: 'Partner Management',
    icon: Users,
    description: 'Managing trading partners and configurations',
    articles: [
      { title: 'Adding a New Partner', duration: '15 min', difficulty: 'Intermediate' },
      { title: 'Partner Configuration', duration: '20 min', difficulty: 'Advanced' },
      { title: 'Testing Partner Connections', duration: '10 min', difficulty: 'Intermediate' },
      { title: 'Partner Status Management', duration: '8 min', difficulty: 'Beginner' }
    ]
  },
  {
    id: 'certificates',
    title: 'Certificate Management',
    icon: Shield,
    description: 'Managing security certificates',
    articles: [
      { title: 'Certificate Basics', duration: '12 min', difficulty: 'Beginner' },
      { title: 'Uploading Certificates', duration: '8 min', difficulty: 'Intermediate' },
      { title: 'Certificate Rotation', duration: '15 min', difficulty: 'Advanced' },
      { title: 'Troubleshooting Certificate Issues', duration: '18 min', difficulty: 'Advanced' }
    ]
  },
  {
    id: 'file-transmission',
    title: 'File Transmission',
    icon: Send,
    description: 'Sending and receiving files',
    articles: [
      { title: 'Sending Your First File', duration: '10 min', difficulty: 'Beginner' },
      { title: 'Batch File Upload', duration: '12 min', difficulty: 'Intermediate' },
      { title: 'Understanding Message Status', duration: '8 min', difficulty: 'Beginner' },
      { title: 'Handling Failed Transmissions', duration: '15 min', difficulty: 'Intermediate' }
    ]
  },
  {
    id: 'troubleshooting',
    title: 'Troubleshooting',
    icon: AlertTriangle,
    description: 'Common issues and solutions',
    articles: [
      { title: 'Connection Issues', duration: '10 min', difficulty: 'Intermediate' },
      { title: 'Certificate Errors', duration: '12 min', difficulty: 'Advanced' },
      { title: 'File Format Issues', duration: '8 min', difficulty: 'Beginner' },
      { title: 'Performance Optimization', duration: '20 min', difficulty: 'Advanced' }
    ]
  }
]

const faqData = [
  {
    category: 'General',
    questions: [
      {
        question: 'What is AS2 and why do we use it?',
        answer: 'AS2 (Applicability Statement 2) is a specification for secure, reliable transport of business documents over the internet. It provides encryption, digital signatures, and message disposition notifications (MDNs) to ensure secure file transmission between trading partners.'
      },
      {
        question: 'How do I reset my password?',
        answer: 'Click on "Forgot Password" on the login page, enter your email address, and follow the instructions sent to your email. If you don\'t receive an email, contact your system administrator.'
      },
      {
        question: 'What file formats are supported?',
        answer: 'The portal primarily supports XML files, especially E2B(R3) format for ICSR submissions. Files must be less than 100MB in size. Contact support for other format requirements.'
      }
    ]
  },
  {
    category: 'Partners',
    questions: [
      {
        question: 'How long does partner setup take?',
        answer: 'Partner setup typically takes 15-30 minutes depending on complexity. This includes configuration, certificate upload, and connection testing. Allow additional time for partner coordination.'
      },
      {
        question: 'What information do I need to add a partner?',
        answer: 'You need the partner\'s AS2 ID, endpoint URL, contact information, encryption/signing certificates, and MDN preferences. Your partner should provide most of this information.'
      },
      {
        question: 'Can I test a partner connection before going live?',
        answer: 'Yes, the portal includes a built-in connection test feature that sends a test file and verifies the complete AS2 handshake including MDN receipt.'
      }
    ]
  },
  {
    category: 'Certificates',
    questions: [
      {
        question: 'How often should certificates be rotated?',
        answer: 'Certificates should be rotated before expiry, typically 30-60 days in advance. The portal will alert you when certificates are approaching expiration.'
      },
      {
        question: 'What certificate formats are accepted?',
        answer: 'The portal accepts PEM (.pem), CRT (.crt), and CER (.cer) certificate formats. Private keys should be in PEM format and are stored securely in AWS KMS.'
      },
      {
        question: 'Can I use the same certificate for multiple partners?',
        answer: 'Yes, you can use the same certificate for multiple partners, but each partner may have different certificate requirements. Check with each partner for their specific needs.'
      }
    ]
  }
]

const quickStartSteps = [
  {
    step: 1,
    title: 'Complete Your Profile',
    description: 'Set up your user profile and organization information',
    duration: '5 minutes',
    completed: true
  },
  {
    step: 2,
    title: 'Add Your First Partner',
    description: 'Configure a trading partner for file exchange',
    duration: '15 minutes',
    completed: false
  },
  {
    step: 3,
    title: 'Upload Certificates',
    description: 'Upload partner certificates for secure communication',
    duration: '10 minutes',
    completed: false
  },
  {
    step: 4,
    title: 'Send Test File',
    description: 'Send your first test file to verify the setup',
    duration: '5 minutes',
    completed: false
  }
]

function getDifficultyBadge(difficulty) {
  switch (difficulty) {
    case 'Beginner':
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Beginner</Badge>
    case 'Intermediate':
      return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Intermediate</Badge>
    case 'Advanced':
      return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Advanced</Badge>
    default:
      return <Badge variant="secondary">{difficulty}</Badge>
  }
}

function GuideCategory({ category }) {
  const Icon = category.icon

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Icon className="mr-2 h-5 w-5 text-primary" />
          {category.title}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{category.description}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {category.articles.map((article, index) => (
            <div key={index} className="flex items-center justify-between p-2 rounded hover:bg-muted/50">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{article.title}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-muted-foreground">{article.duration}</span>
                {getDifficultyBadge(article.difficulty)}
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function QuickStartGuide() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Play className="mr-2 h-5 w-5" />
          Quick Start Guide
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Get up and running with the AS2 Portal in 4 simple steps
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {quickStartSteps.map((step) => (
            <div key={step.step} className="flex items-start space-x-4">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                step.completed 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                  : 'bg-primary text-primary-foreground'
              }`}>
                {step.completed ? <CheckCircle className="h-4 w-4" /> : step.step}
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-xs text-muted-foreground">{step.duration}</span>
                  {!step.completed && (
                    <Button size="sm" variant="outline">
                      Start Step
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default function UserGuidePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)

  const filteredCategories = guideCategories.filter(category =>
    category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.articles.some(article => 
      article.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  )

  const filteredFAQ = faqData.map(category => ({
    ...category,
    questions: category.questions.filter(q =>
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Guide</h1>
        <p className="text-muted-foreground">
          Learn how to use the AS2 Pharmacovigilance Portal effectively
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search guides and FAQs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <Tabs defaultValue="guides" className="space-y-6">
        <TabsList>
          <TabsTrigger value="guides">User Guides</TabsTrigger>
          <TabsTrigger value="quickstart">Quick Start</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>

        {/* User Guides Tab */}
        <TabsContent value="guides" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCategories.map((category) => (
              <GuideCategory key={category.id} category={category} />
            ))}
          </div>

          {filteredCategories.length === 0 && (
            <div className="text-center py-8">
              <HelpCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                No guides found matching your search.
              </p>
            </div>
          )}
        </TabsContent>

        {/* Quick Start Tab */}
        <TabsContent value="quickstart" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <QuickStartGuide />
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <HelpCircle className="h-4 w-4" />
                  <AlertDescription>
                    If you get stuck during setup, our support team is here to help. 
                    Contact us through the help desk or schedule a guided setup session.
                  </AlertDescription>
                </Alert>
                <div className="space-y-2">
                  <Button className="w-full">
                    Contact Support
                  </Button>
                  <Button variant="outline" className="w-full">
                    Schedule Setup Session
                  </Button>
                  <Button variant="outline" className="w-full">
                    Watch Video Tutorial
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-6">
          {filteredFAQ.map((category) => (
            <Card key={category.category}>
              <CardHeader>
                <CardTitle>{category.category} Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((faq, index) => (
                    <AccordionItem key={index} value={`${category.category}-${index}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}

          {filteredFAQ.length === 0 && (
            <div className="text-center py-8">
              <HelpCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                No FAQ entries found matching your search.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}