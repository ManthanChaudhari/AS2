# AS2 Pharmacovigilance Portal - API Documentation

## Overview

This document provides comprehensive API documentation for the AS2 Pharmacovigilance Portal backend services. The API follows RESTful principles and supports the complete workflow for secure file transmission between pharmaceutical organizations and regulatory agencies using the AS2 protocol.

**Base URL:** `https://api.as2-portal.com/api/v1`
**Authentication:** Bearer JWT tokens
**Content-Type:** `application/json` (unless specified otherwise)

## Authentication APIs

### POST /auth/login
Authenticate user with email/password and optional MFA.

**Request Body:**
```json
{
  "email": "user@pharma.com",
  "password": "securePassword123",
  "mfaCode": "123456",
  "rememberMe": true
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_here",
    "user": {
      "id": "user-123",
      "email": "user@pharma.com",
      "name": "John Doe",
      "role": "admin",
      "tenantId": "tenant-456",
      "permissions": ["read:partners", "write:partners", "read:messages"]
    },
    "expiresIn": 3600
  }
}
```

### POST /auth/register
Register new organization with multi-step wizard data.

**Request Body:**
```json
{
  "company": {
    "name": "Pharma Corp",
    "address": "123 Main St",
    "country": "US",
    "industryType": "pharmaceutical"
  },
  "admin": {
    "name": "John Doe",
    "email": "admin@pharma.com",
    "password": "securePassword123"
  },
  "verificationCode": "ABC123",
  "termsAccepted": true
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "tenantId": "tenant-789",
    "userId": "user-456",
    "status": "pending_verification"
  }
}
```

### POST /auth/refresh
Refresh JWT token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "refresh_token_here"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "new_jwt_token",
    "expiresIn": 3600
  }
}
```

## Dashboard APIs

### GET /dashboard/stats
Get real-time dashboard statistics.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "messagesSentToday": {
      "count": 47,
      "percentageChange": 12.5
    },
    "messagesReceivedToday": {
      "count": 23,
      "percentageChange": -5.2
    },
    "pendingMDNs": {
      "count": 3,
      "alertLevel": "normal"
    },
    "expiringCertificates": {
      "count": 2,
      "alertLevel": "warning"
    }
  }
}
```

### GET /dashboard/recent-activity
Get recent AS2 transaction activity.

**Query Parameters:**
- `limit` (optional): Number of activities to return (default: 10)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "activity-123",
      "type": "message_sent",
      "messageId": "MSG-20251012-101530-XYZ",
      "partner": "FDA",
      "filename": "icsr_batch_001.xml",
      "status": "mdn_received",
      "timestamp": "2025-10-12T10:15:30Z"
    },
    {
      "id": "activity-124",
      "type": "message_received",
      "messageId": "MSG-20251012-101245-ABC",
      "partner": "EMA",
      "filename": "ack_response.xml",
      "status": "validated",
      "timestamp": "2025-10-12T10:12:45Z"
    }
  ]
}
```

### GET /dashboard/system-health
Get system health status for all services.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "transferFamily": {
      "status": "healthy",
      "responseTime": 150,
      "lastCheck": "2025-10-12T10:30:00Z"
    },
    "s3": {
      "status": "healthy",
      "responseTime": 45,
      "lastCheck": "2025-10-12T10:30:00Z"
    },
    "lambda": {
      "status": "degraded",
      "responseTime": 2500,
      "lastCheck": "2025-10-12T10:30:00Z",
      "issues": ["High latency detected"]
    },
    "overallStatus": "degraded"
  }
}
```

### GET /dashboard/charts
Get chart data for dashboard analytics.

**Query Parameters:**
- `period` (optional): Time period (7d, 30d, 90d) (default: 7d)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "messageVolume": [
      {
        "date": "2025-10-06",
        "sent": 45,
        "received": 23
      },
      {
        "date": "2025-10-07",
        "sent": 52,
        "received": 31
      }
    ],
    "successRate": {
      "successful": 95.2,
      "failed": 4.8
    },
    "topPartners": [
      {
        "partner": "FDA",
        "messageCount": 156
      },
      {
        "partner": "EMA",
        "messageCount": 89
      }
    ]
  }
}
```

## Partner Management APIs

### GET /partners
Get list of trading partners with filtering and pagination.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 25)
- `status` (optional): Filter by status (active, testing, inactive)
- `organizationType` (optional): Filter by org type
- `search` (optional): Search by name or AS2 ID

**Response (200):**
```json
{
  "success": true,
  "data": {
    "partners": [
      {
        "id": "partner-123",
        "name": "FDA FAERS",
        "as2Id": "FDA-FAERS-PROD",
        "organizationType": "regulatory_agency",
        "status": "active",
        "contactEmail": "contact@fda.gov",
        "certificateExpiry": "2025-12-15T00:00:00Z",
        "lastMessage": "2025-10-12T09:30:00Z",
        "messageCount": 156,
        "createdAt": "2024-01-15T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 25,
      "total": 47,
      "totalPages": 2
    }
  }
}
```

### POST /partners
Create new trading partner.

**Request Body:**
```json
{
  "name": "EMA EudraVigilance",
  "as2Id": "EMA-EV-PROD",
  "organizationType": "regulatory_agency",
  "contactName": "Jane Smith",
  "contactEmail": "jane.smith@ema.europa.eu",
  "contactPhone": "+31-20-123-4567",
  "notes": "Primary EU regulatory contact",
  "as2Config": {
    "stationId": "PHARMA-CORP-001",
    "endpointUrl": "https://ema.europa.eu/as2/receive",
    "subjectTemplate": "ICSR Submission - {filename} - {date}",
    "encryptionAlgorithm": "AES-256",
    "signingAlgorithm": "SHA-256",
    "compressionEnabled": true
  },
  "mdnSettings": {
    "requestSignedMDN": true,
    "deliveryMethod": "synchronous",
    "receiptTimeout": 15,
    "signingAlgorithm": "SHA-256",
    "retryEnabled": true,
    "maxRetries": 3,
    "retryInterval": 5
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "partner-456",
    "name": "EMA EudraVigilance",
    "as2Id": "EMA-EV-PROD",
    "status": "testing",
    "createdAt": "2025-10-12T10:45:00Z"
  }
}
```

### GET /partners/{partnerId}
Get detailed partner information.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "partner-123",
    "name": "FDA FAERS",
    "as2Id": "FDA-FAERS-PROD",
    "organizationType": "regulatory_agency",
    "status": "active",
    "contactName": "John Doe",
    "contactEmail": "john.doe@fda.gov",
    "contactPhone": "+1-301-555-0123",
    "notes": "Primary US regulatory contact",
    "as2Config": {
      "stationId": "PHARMA-CORP-001",
      "endpointUrl": "https://fda.gov/as2/receive",
      "subjectTemplate": "ICSR Submission - {filename} - {date}",
      "encryptionAlgorithm": "AES-256",
      "signingAlgorithm": "SHA-256",
      "compressionEnabled": true
    },
    "mdnSettings": {
      "requestSignedMDN": true,
      "deliveryMethod": "synchronous",
      "receiptTimeout": 15,
      "signingAlgorithm": "SHA-256",
      "retryEnabled": true,
      "maxRetries": 3,
      "retryInterval": 5
    },
    "certificates": [
      {
        "id": "cert-789",
        "type": "encryption",
        "subjectDN": "CN=FDA-FAERS-PROD,O=FDA,C=US",
        "expiryDate": "2025-12-15T00:00:00Z",
        "status": "active"
      }
    ],
    "stats": {
      "totalMessagesSent": 156,
      "totalMessagesReceived": 89,
      "successRate": 98.5,
      "lastMessage": "2025-10-12T09:30:00Z"
    },
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2025-10-12T08:15:00Z"
  }
}
```

### PUT /partners/{partnerId}
Update partner configuration.

**Request Body:** (Same structure as POST /partners)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "partner-123",
    "updatedAt": "2025-10-12T10:50:00Z"
  }
}
```

### POST /partners/{partnerId}/test
Test connection to partner.

**Request Body:**
```json
{
  "testType": "quick|full|custom",
  "customFile": "base64_encoded_file_data"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "testId": "test-789",
    "status": "passed",
    "results": {
      "connectionStatus": "success",
      "responseTime": 2.3,
      "encryptionStatus": "success",
      "signingStatus": "success",
      "mdnReceived": true,
      "mdnSignatureVerified": true,
      "micMatch": true,
      "micValue": "aB3xK9mP2qR7sT4u...",
      "partnerEndpoint": "reachable"
    },
    "logs": [
      "[10:15:30] Test initiated...",
      "[10:15:31] Loading test file...",
      "[10:15:32] Encrypting with partner certificate...",
      "[10:15:33] Signing with our private key...",
      "[10:15:34] Sending to https://partner.axway.com:8443/as2...",
      "[10:15:36] HTTP 200 OK received",
      "[10:15:36] MDN received (synchronous)",
      "[10:15:37] Verifying MDN signature...",
      "[10:15:37] Comparing MIC values...",
      "[10:15:37] ✅ TEST PASSED - All checks successful!"
    ],
    "testedAt": "2025-10-12T10:15:37Z",
    "testedBy": "user-123"
  }
}
```

### GET /partners/{partnerId}/messages
Get message history for specific partner.

**Query Parameters:**
- `page`, `limit`, `direction` (sent/received), `status`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": "msg-123",
        "messageId": "MSG-20251012-101530-XYZ",
        "direction": "outbound",
        "filename": "icsr_batch_001.xml",
        "status": "mdn_received",
        "sentAt": "2025-10-12T10:15:30Z",
        "fileSize": 1024000
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 156
    }
  }
}
```

### DELETE /partners/{partnerId}
Soft delete partner (deactivate).

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "partner-123",
    "status": "inactive",
    "deactivatedAt": "2025-10-12T10:55:00Z"
  }
}
```

## Certificate Management APIs

### GET /certificates
Get list of all certificates with filtering.

**Query Parameters:**
- `owner` (optional): Filter by owner (self, partner, all)
- `type` (optional): Filter by type (encryption, signing, both)
- `status` (optional): Filter by status (active, expiring, expired)
- `expiringIn` (optional): Days until expiry filter

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "cert-123",
      "name": "FDA FAERS Encryption Certificate",
      "partnerId": "partner-123",
      "partnerName": "FDA FAERS",
      "type": "encryption",
      "subjectDN": "CN=FDA-FAERS-PROD,O=FDA,C=US",
      "issuerDN": "CN=DigiCert SHA2 High Assurance Server CA,OU=www.digicert.com,O=DigiCert Inc,C=US",
      "validFrom": "2024-01-15T00:00:00Z",
      "validTo": "2025-12-15T23:59:59Z",
      "daysUntilExpiry": 64,
      "status": "active",
      "keySize": 3072,
      "serialNumber": "0A1B2C3D4E5F6789",
      "fingerprint": "SHA256:1A2B3C4D5E6F7890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890"
    }
  ]
}
```

### POST /certificates/upload
Upload new certificate for partner.

**Request Body (multipart/form-data):**
```
partnerId: partner-123
certificateType: encryption|signing
file: [certificate file]
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "cert-456",
    "partnerId": "partner-123",
    "type": "encryption",
    "subjectDN": "CN=FDA-FAERS-PROD,O=FDA,C=US",
    "validFrom": "2025-01-01T00:00:00Z",
    "validTo": "2026-12-31T23:59:59Z",
    "status": "active",
    "uploadedAt": "2025-10-12T11:00:00Z"
  }
}
```

### GET /certificates/{certId}
Get detailed certificate information.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "cert-123",
    "name": "FDA FAERS Encryption Certificate",
    "partnerId": "partner-123",
    "partnerName": "FDA FAERS",
    "type": "encryption",
    "subjectDN": "CN=FDA-FAERS-PROD,O=FDA,C=US",
    "issuerDN": "CN=DigiCert SHA2 High Assurance Server CA,OU=www.digicert.com,O=DigiCert Inc,C=US",
    "validFrom": "2024-01-15T00:00:00Z",
    "validTo": "2025-12-15T23:59:59Z",
    "keySize": 3072,
    "serialNumber": "0A1B2C3D4E5F6789",
    "fingerprint": "SHA256:1A2B3C4D5E6F7890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890",
    "version": 3,
    "signatureAlgorithm": "SHA256withRSA",
    "publicKeyAlgorithm": "RSA",
    "extensions": {
      "keyUsage": ["digitalSignature", "keyEncipherment"],
      "extendedKeyUsage": ["clientAuth", "serverAuth"],
      "subjectAltName": ["DNS:fda-faers-prod.fda.gov"]
    },
    "usage": {
      "partnersUsing": ["partner-123"],
      "messagesEncrypted": 1547,
      "lastUsed": "2025-10-12T09:30:00Z"
    },
    "validation": {
      "notExpired": true,
      "keyStrengthAdequate": true,
      "signatureValid": true,
      "chainValid": true
    },
    "uploadedAt": "2024-01-15T10:00:00Z",
    "uploadedBy": "user-456"
  }
}
```

### GET /certificates/self
Get organization's own certificates.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "signingCertificate": {
      "id": "cert-self-001",
      "subjectDN": "CN=PHARMA-CORP-AS2,O=Pharma Corp,C=US",
      "issuerDN": "CN=DigiCert SHA2 High Assurance Server CA",
      "validFrom": "2024-06-01T00:00:00Z",
      "validTo": "2026-05-31T23:59:59Z",
      "keySize": 3072,
      "daysUntilExpiry": 231,
      "privateKeyStored": true,
      "kmsKeyId": "arn:aws:kms:us-east-1:123456789012:key/12345678-1234-1234-1234-123456789012"
    },
    "encryptionCertificate": {
      "id": "cert-self-002",
      "subjectDN": "CN=PHARMA-CORP-AS2,O=Pharma Corp,C=US",
      "issuerDN": "CN=DigiCert SHA2 High Assurance Server CA",
      "validFrom": "2024-06-01T00:00:00Z",
      "validTo": "2026-05-31T23:59:59Z",
      "keySize": 3072,
      "daysUntilExpiry": 231,
      "privateKeyStored": true,
      "kmsKeyId": "arn:aws:kms:us-east-1:123456789012:key/87654321-4321-4321-4321-210987654321"
    }
  }
}
```

### POST /certificates/self/generate-csr
Generate Certificate Signing Request.

**Request Body:**
```json
{
  "commonName": "PHARMA-CORP-AS2",
  "organization": "Pharma Corp",
  "country": "US",
  "keySize": 3072
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "csr": "-----BEGIN CERTIFICATE REQUEST-----\nMIICijCCAXICAQAwRTELMAkGA1UEBhMCVVMxEzARBgNVBAgMCkNhbGlmb3JuaWEx\n...",
    "privateKeyId": "arn:aws:kms:us-east-1:123456789012:key/new-key-id",
    "generatedAt": "2025-10-12T11:15:00Z"
  }
}
```

### POST /certificates/{certId}/download
Download certificate file.

**Response (200):**
```
Content-Type: application/x-pem-file
Content-Disposition: attachment; filename="fda-faers-encryption.pem"

-----BEGIN CERTIFICATE-----
MIIFXTCCBEWgAwIBAgIQDxcK...
-----END CERTIFICATE-----
```

## File Transmission APIs

### POST /messages/send
Send file to partner via AS2.

**Request Body (multipart/form-data):**
```
partnerId: partner-123
file: [XML file]
subject: ICSR Submission - Batch 001
priority: normal|urgent
notes: Q4 submission batch 1
requestMDN: true
mdnDeliveryMethod: synchronous|asynchronous
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "messageId": "MSG-20251012-101530-XYZ",
    "status": "sent",
    "sentAt": "2025-10-12T10:15:30Z",
    "awaitingMDN": true,
    "estimatedDeliveryTime": "2025-10-12T10:15:45Z",
    "fileSize": 1024000,
    "encryptionAlgorithm": "AES-256",
    "signingAlgorithm": "SHA-256"
  }
}
```

### GET /messages/outbox
Get list of sent messages.

**Query Parameters:**
- `page`, `limit`, `partnerId`, `status`, `dateFrom`, `dateTo`, `priority`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": "msg-123",
        "messageId": "MSG-20251012-101530-XYZ",
        "partnerId": "partner-123",
        "partnerName": "FDA FAERS",
        "filename": "icsr_batch_001.xml",
        "fileSize": 1024000,
        "status": "mdn_received",
        "priority": "normal",
        "sentAt": "2025-10-12T10:15:30Z",
        "mdnStatus": "received",
        "mdnReceivedAt": "2025-10-12T10:15:32Z",
        "ack2Status": "accepted",
        "ack2ReceivedAt": "2025-10-12T10:18:45Z",
        "sentBy": "user-123"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 156
    }
  }
}
```

### GET /messages/{messageId}
Get detailed message information.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "msg-123",
    "messageId": "MSG-20251012-101530-XYZ",
    "direction": "outbound",
    "partnerId": "partner-123",
    "partnerName": "FDA FAERS",
    "partnerAs2Id": "FDA-FAERS-PROD",
    "filename": "icsr_batch_001.xml",
    "originalFilename": "icsr_batch_001.xml",
    "fileSize": 1024000,
    "fileSha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "status": "mdn_received",
    "priority": "normal",
    "subject": "ICSR Submission - icsr_batch_001.xml - 2025-10-12",
    "notes": "Q4 submission batch 1",
    "sentAt": "2025-10-12T10:15:30Z",
    "sentBy": "user-123",
    "as2Headers": {
      "AS2-From": "PHARMA-CORP-AS2",
      "AS2-To": "FDA-FAERS-PROD",
      "Message-ID": "MSG-20251012-101530-XYZ",
      "Content-Type": "application/pkcs7-mime; smime-type=enveloped-data",
      "Content-Disposition": "attachment; filename=\"icsr_batch_001.xml.p7m\"",
      "Disposition-Notification-To": "https://pharma-corp.com/as2/mdn",
      "Disposition-Notification-Options": "signed-receipt-protocol=required,pkcs7-signature; signed-receipt-micalg=required,sha256"
    },
    "transmission": {
      "endpointUrl": "https://fda.gov/as2/receive",
      "encryptionAlgorithm": "AES-256-CBC",
      "signingAlgorithm": "SHA-256",
      "compressionUsed": true,
      "httpStatus": 200,
      "responseTime": 2.3
    },
    "mdn": {
      "status": "received",
      "receivedAt": "2025-10-12T10:15:32Z",
      "disposition": "automatic-action/MDN-sent-automatically; processed",
      "signatureStatus": "verified",
      "micSent": "aB3xK9mP2qR7sT4u...",
      "micReceived": "aB3xK9mP2qR7sT4u...",
      "micMatch": true,
      "mdnMessageId": "MDN-20251012-101532-ABC"
    },
    "businessAck": {
      "status": "accepted",
      "receivedAt": "2025-10-12T10:18:45Z",
      "processingStatus": "Accepted by FDA FAERS",
      "validationResults": {
        "schemaValid": true,
        "businessRulesValid": true
      }
    },
    "e2bMetadata": {
      "senderSafetyReportUniqueId": "PHARMA-CORP-2025-001234",
      "messageNumber": "1",
      "senderOrganization": "Pharma Corp",
      "caseIds": ["CASE-2025-001234"],
      "transmissionDate": "2025-10-12"
    },
    "timeline": [
      {
        "timestamp": "2025-10-12T10:15:30Z",
        "event": "file_uploaded",
        "description": "File uploaded by John Doe",
        "user": "user-123"
      },
      {
        "timestamp": "2025-10-12T10:15:31Z",
        "event": "file_encrypted",
        "description": "File encrypted with partner certificate"
      },
      {
        "timestamp": "2025-10-12T10:15:32Z",
        "event": "file_signed",
        "description": "File signed with private key"
      },
      {
        "timestamp": "2025-10-12T10:15:32Z",
        "event": "as2_sent",
        "description": "AS2 message sent to partner endpoint"
      },
      {
        "timestamp": "2025-10-12T10:15:32Z",
        "event": "http_response",
        "description": "HTTP 200 OK received from partner"
      },
      {
        "timestamp": "2025-10-12T10:15:32Z",
        "event": "mdn_received",
        "description": "MDN received (synchronous)"
      },
      {
        "timestamp": "2025-10-12T10:15:33Z",
        "event": "mdn_verified",
        "description": "MDN signature verified ✅"
      },
      {
        "timestamp": "2025-10-12T10:15:33Z",
        "event": "mic_verified",
        "description": "MIC verified ✅"
      },
      {
        "timestamp": "2025-10-12T10:15:33Z",
        "event": "transmission_complete",
        "description": "Transmission marked as successful"
      },
      {
        "timestamp": "2025-10-12T10:18:45Z",
        "event": "business_ack_received",
        "description": "Business ACK (ACK2) received"
      },
      {
        "timestamp": "2025-10-12T10:18:45Z",
        "event": "ack2_processed",
        "description": "ACK2 Status: ACCEPTED by FDA FAERS"
      },
      {
        "timestamp": "2025-10-12T10:18:45Z",
        "event": "lifecycle_complete",
        "description": "Message lifecycle complete ✅"
      }
    ]
  }
}
```

### POST /messages/{messageId}/resend
Resend failed message.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "newMessageId": "MSG-20251012-111530-DEF",
    "status": "sent",
    "resentAt": "2025-10-12T11:15:30Z"
  }
}
```

### GET /messages/inbox
Get list of received messages.

**Query Parameters:**
- `page`, `limit`, `partnerId`, `status`, `validationStatus`, `routingStatus`, `dateFrom`, `dateTo`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": "msg-456",
        "messageId": "MSG-20251012-091245-ABC",
        "partnerId": "partner-123",
        "partnerName": "FDA FAERS",
        "filename": "ack_response.xml",
        "fileSize": 512000,
        "status": "validated",
        "validationStatus": "passed",
        "routingStatus": "routed",
        "receivedAt": "2025-10-12T09:12:45Z",
        "processedAt": "2025-10-12T09:13:15Z",
        "routedTo": "Veeva Vault"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 89
    },
    "stats": {
      "newToday": 23,
      "validationFailuresToday": 2,
      "awaitingRouting": 5,
      "totalThisMonth": 847
    }
  }
}
```

### POST /batches/create
Create new batch upload session.

**Request Body:**
```json
{
  "name": "Q4 ICSR Batch Upload",
  "description": "Quarterly submission to multiple agencies"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "batchId": "batch-789",
    "name": "Q4 ICSR Batch Upload",
    "status": "created",
    "createdAt": "2025-10-12T11:20:00Z"
  }
}
```

### POST /batches/{batchId}/upload
Upload files to batch.

**Request Body (multipart/form-data):**
```
files: [multiple XML files]
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "batchId": "batch-789",
    "uploadedFiles": [
      {
        "id": "file-001",
        "filename": "icsr_001.xml",
        "size": 1024000,
        "status": "uploaded"
      },
      {
        "id": "file-002",
        "filename": "icsr_002.xml",
        "size": 987654,
        "status": "uploaded"
      }
    ],
    "totalFiles": 47,
    "totalSize": 23500000
  }
}
```

### POST /batches/{batchId}/assign-partners
Assign partners to batch files.

**Request Body:**
```json
{
  "assignments": [
    {
      "fileId": "file-001",
      "partnerId": "partner-123",
      "priority": "normal"
    },
    {
      "fileId": "file-002",
      "partnerId": "partner-456",
      "priority": "urgent"
    }
  ],
  "bulkAssignment": {
    "partnerId": "partner-123",
    "priority": "normal",
    "applyToAll": false
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "batchId": "batch-789",
    "assignedFiles": 47,
    "validationSummary": {
      "valid": 45,
      "warnings": 2,
      "errors": 0
    }
  }
}
```

### POST /batches/{batchId}/send
Start batch sending process.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "batchId": "batch-789",
    "status": "sending",
    "totalFiles": 47,
    "estimatedCompletionTime": "2025-10-12T11:23:00Z",
    "websocketUrl": "wss://api.as2-portal.com/ws/batches/batch-789/progress"
  }
}
```

### GET /batches/{batchId}/status
Get batch sending progress (also available via WebSocket).

**Response (200):**
```json
{
  "success": true,
  "data": {
    "batchId": "batch-789",
    "status": "completed",
    "progress": {
      "totalFiles": 47,
      "sentSuccessfully": 45,
      "failed": 2,
      "currentFile": null,
      "percentComplete": 100
    },
    "summary": {
      "startedAt": "2025-10-12T11:20:30Z",
      "completedAt": "2025-10-12T11:23:15Z",
      "duration": "00:02:45",
      "successfulFiles": [
        {
          "fileId": "file-001",
          "messageId": "MSG-20251012-112031-XYZ",
          "partnerId": "partner-123",
          "status": "mdn_received"
        }
      ],
      "failedFiles": [
        {
          "fileId": "file-047",
          "partnerId": "partner-789",
          "error": "Partner endpoint unreachable",
          "retryable": true
        }
      ]
    }
  }
}
```

## Administration APIs

### GET /admin/users
Get list of users in organization.

**Query Parameters:**
- `page`, `limit`, `role`, `status`, `search`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "user-123",
        "name": "John Doe",
        "email": "john.doe@pharma.com",
        "role": "admin",
        "status": "active",
        "lastLogin": "2025-10-12T09:00:00Z",
        "createdAt": "2024-01-15T10:00:00Z",
        "permissions": ["read:partners", "write:partners", "read:messages", "write:messages"]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 25,
      "total": 12
    }
  }
}
```

### POST /admin/users
Create new user.

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane.smith@pharma.com",
  "role": "operator",
  "permissions": ["read:partners", "read:messages", "write:messages"],
  "sendWelcomeEmail": true
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "user-456",
    "name": "Jane Smith",
    "email": "jane.smith@pharma.com",
    "role": "operator",
    "status": "pending_activation",
    "createdAt": "2025-10-12T11:30:00Z",
    "activationToken": "act_token_here"
  }
}
```

### GET /admin/settings
Get system configuration settings.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "as2Config": {
      "organizationAs2Id": "PHARMA-CORP-AS2",
      "endpointUrl": "https://pharma-corp.com/as2/receive",
      "defaultEncryption": "AES-256",
      "defaultSigning": "SHA-256",
      "defaultMdnTimeout": 15,
      "maxFileSize": 104857600,
      "allowedFileTypes": [".xml"]
    },
    "notifications": {
      "emailEnabled": true,
      "certificateExpiryDays": [30, 15, 7, 1],
      "transmissionFailureEnabled": true,
      "systemHealthEnabled": true,
      "recipients": ["admin@pharma.com", "ops@pharma.com"]
    },
    "security": {
      "sessionTimeout": 3600,
      "maxLoginAttempts": 5,
      "lockoutDuration": 900,
      "mfaRequired": false,
      "passwordPolicy": {
        "minLength": 12,
        "requireUppercase": true,
        "requireLowercase": true,
        "requireNumbers": true,
        "requireSpecialChars": true
      }
    },
    "integration": {
      "downstreamSystems": [
        {
          "name": "Veeva Vault",
          "type": "veeva",
          "enabled": true,
          "endpoint": "https://pharma-corp.veevavault.com/api"
        },
        {
          "name": "Oracle Argus",
          "type": "argus",
          "enabled": true,
          "endpoint": "https://argus.pharma-corp.com/api"
        }
      ]
    }
  }
}
```

### PUT /admin/settings
Update system configuration.

**Request Body:** (Same structure as GET response)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "updatedAt": "2025-10-12T11:35:00Z",
    "updatedBy": "user-123"
  }
}
```

### GET /admin/audit-logs
Get audit log entries.

**Query Parameters:**
- `page`, `limit`, `userId`, `action`, `resource`, `dateFrom`, `dateTo`, `search`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "id": "log-123",
        "timestamp": "2025-10-12T10:15:30Z",
        "userId": "user-123",
        "userName": "John Doe",
        "action": "message_sent",
        "resource": "message",
        "resourceId": "msg-123",
        "details": {
          "messageId": "MSG-20251012-101530-XYZ",
          "partnerId": "partner-123",
          "filename": "icsr_batch_001.xml"
        },
        "ipAddress": "192.168.1.100",
        "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 15847
    }
  }
}
```

## Reporting APIs

### GET /reports/transmission
Generate transmission reports.

**Query Parameters:**
- `dateFrom`, `dateTo`, `partnerId`, `status`, `format` (json|csv|pdf)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "reportId": "report-123",
    "period": {
      "from": "2025-10-01T00:00:00Z",
      "to": "2025-10-12T23:59:59Z"
    },
    "summary": {
      "totalMessages": 1547,
      "successfulMessages": 1473,
      "failedMessages": 74,
      "successRate": 95.2,
      "averageResponseTime": 2.1,
      "totalDataTransferred": 1572864000
    },
    "partnerBreakdown": [
      {
        "partnerId": "partner-123",
        "partnerName": "FDA FAERS",
        "messagesSent": 456,
        "messagesReceived": 234,
        "successRate": 98.5,
        "averageResponseTime": 1.8
      }
    ],
    "dailyVolume": [
      {
        "date": "2025-10-01",
        "sent": 45,
        "received": 23,
        "failed": 2
      }
    ],
    "generatedAt": "2025-10-12T11:40:00Z"
  }
}
```

### GET /reports/compliance
Generate compliance reports for regulatory submissions.

**Query Parameters:**
- `dateFrom`, `dateTo`, `regulatoryAgency`, `submissionType`, `format`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "reportId": "compliance-456",
    "period": {
      "from": "2025-07-01T00:00:00Z",
      "to": "2025-09-30T23:59:59Z"
    },
    "regulatorySubmissions": [
      {
        "agency": "FDA",
        "submissionType": "ICSR",
        "totalSubmissions": 456,
        "onTimeSubmissions": 454,
        "lateSubmissions": 2,
        "complianceRate": 99.6,
        "averageSubmissionTime": "2.3 hours"
      },
      {
        "agency": "EMA",
        "submissionType": "ICSR",
        "totalSubmissions": 234,
        "onTimeSubmissions": 234,
        "lateSubmissions": 0,
        "complianceRate": 100.0,
        "averageSubmissionTime": "1.8 hours"
      }
    ],
    "auditTrail": {
      "totalTransactions": 690,
      "fullyDocumented": 690,
      "documentationRate": 100.0
    },
    "slaCompliance": {
      "target": "95%",
      "achieved": "99.1%",
      "status": "compliant"
    },
    "generatedAt": "2025-10-12T11:45:00Z"
  }
}
```

## WebSocket APIs

### Connection: /ws/dashboard
Real-time dashboard updates.

**Connection URL:** `wss://api.as2-portal.com/ws/dashboard`

**Authentication:** Include JWT token in connection headers or query parameter

**Message Types:**
```json
// Stats update
{
  "type": "stats_update",
  "data": {
    "messagesSentToday": 48,
    "messagesReceivedToday": 24,
    "pendingMDNs": 2
  }
}

// New activity
{
  "type": "new_activity",
  "data": {
    "id": "activity-125",
    "type": "message_received",
    "messageId": "MSG-20251012-114530-DEF",
    "partner": "EMA",
    "filename": "response_001.xml",
    "status": "validated",
    "timestamp": "2025-10-12T11:45:30Z"
  }
}

// System health change
{
  "type": "health_update",
  "data": {
    "service": "lambda",
    "status": "healthy",
    "previousStatus": "degraded",
    "timestamp": "2025-10-12T11:46:00Z"
  }
}
```

### Connection: /ws/batches/{batchId}/progress
Real-time batch upload progress.

**Message Types:**
```json
// Progress update
{
  "type": "progress_update",
  "data": {
    "batchId": "batch-789",
    "currentFile": 15,
    "totalFiles": 47,
    "percentComplete": 31.9,
    "currentFileName": "icsr_015.xml",
    "status": "sending"
  }
}

// File completed
{
  "type": "file_completed",
  "data": {
    "batchId": "batch-789",
    "fileId": "file-015",
    "filename": "icsr_015.xml",
    "messageId": "MSG-20251012-112145-GHI",
    "status": "success",
    "mdnReceived": true
  }
}

// Batch completed
{
  "type": "batch_completed",
  "data": {
    "batchId": "batch-789",
    "status": "completed",
    "summary": {
      "totalFiles": 47,
      "successful": 45,
      "failed": 2,
      "duration": "00:02:45"
    }
  }
}
```

## Error Responses

All API endpoints follow consistent error response format:

### 400 Bad Request
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      },
      {
        "field": "password",
        "message": "Password must be at least 12 characters"
      }
    ]
  }
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired authentication token"
  }
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_PERMISSIONS",
    "message": "User does not have permission to perform this action",
    "requiredPermission": "write:partners"
  }
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Partner with ID 'partner-999' not found"
  }
}
```

### 409 Conflict
```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_CONFLICT",
    "message": "Partner with AS2 ID 'FDA-FAERS-PROD' already exists"
  }
}
```

### 422 Unprocessable Entity
```json
{
  "success": false,
  "error": {
    "code": "BUSINESS_RULE_VIOLATION",
    "message": "Cannot delete partner with active messages",
    "details": {
      "activeMessages": 15,
      "lastMessage": "2025-10-12T09:30:00Z"
    }
  }
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "An unexpected error occurred",
    "requestId": "req-123456789"
  }
}
```

## Rate Limiting

All API endpoints are subject to rate limiting:

- **Authentication endpoints:** 10 requests per minute per IP
- **File upload endpoints:** 100 requests per hour per user
- **General API endpoints:** 1000 requests per hour per user
- **WebSocket connections:** 10 concurrent connections per user

Rate limit headers are included in all responses:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1634567890
```

## API Versioning

The API uses URL versioning with the current version being `v1`. Future versions will be introduced as `v2`, `v3`, etc., with backward compatibility maintained for at least 12 months after a new version release.

## Pagination

All list endpoints support pagination with consistent parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 25, max: 100)

Pagination metadata is included in all list responses:
```json
{
  "pagination": {
    "page": 1,
    "limit": 25,
    "total": 156,
    "totalPages": 7,
    "hasNext": true,
    "hasPrevious": false
  }
}
```

## Summary

This API documentation covers **67 endpoints** across 8 main functional areas:

1. **Authentication (3 endpoints)** - Login, registration, token refresh
2. **Dashboard (4 endpoints)** - Real-time stats, activity, health, charts
3. **Partner Management (8 endpoints)** - CRUD operations, testing, message history
4. **Certificate Management (8 endpoints)** - Certificate vault, uploads, CSR generation
5. **File Transmission (12 endpoints)** - Send files, batch operations, outbox/inbox management
6. **Administration (4 endpoints)** - User management, system settings, audit logs
7. **Reporting (2 endpoints)** - Transmission and compliance reports
8. **WebSocket (2 connections)** - Real-time updates for dashboard and batch progress

The API supports the complete AS2 pharmacovigilance workflow from partner onboarding through secure file transmission to compliance reporting, with comprehensive error handling, rate limiting, and real-time capabilities.