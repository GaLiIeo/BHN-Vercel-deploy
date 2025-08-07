# Birth Health Network (BHN) - API Documentation

## Table of Contents

1. [Authentication APIs](#authentication-apis)
2. [User Management APIs](#user-management-apis)
3. [Patient APIs](#patient-apis)
4. [Doctor APIs](#doctor-apis)
5. [Birth Registration APIs](#birth-registration-apis)
6. [Health Records APIs](#health-records-apis)
7. [Appointment APIs](#appointment-apis)
8. [Document Management APIs](#document-management-apis)
9. [Notification APIs](#notification-apis)
10. [Analytics & Dashboard APIs](#analytics--dashboard-apis)
11. [AWS Integration APIs](#aws-integration-apis)
12. [System Configuration APIs](#system-configuration-apis)

---

## Base URL
 

---

## Authentication APIs

### 1. User Registration
```http
POST /auth/register
```

**Request Body:**
```json
{
  "firstName": "Sarah",
  "lastName": "Johnson",
  "email": "sarah.johnson@example.com",
  "password": "SecurePassword123!",
  "userType": "patient",
  "phone": "+1-555-123-4567",
  "dateOfBirth": "1985-06-15",
  "agreeToTerms": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "sarah.johnson@example.com",
      "userType": "patient",
      "status": "pending_verification"
    },
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token",
    "expiresIn": 7200
  }
}
```

### 2. User Login
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "sarah.johnson@example.com",
  "password": "SecurePassword123!",
  "rememberMe": true
}
```

### 3. Refresh Token
```http
POST /auth/refresh
```

**Request Body:**
```json
{
  "refreshToken": "refresh_token"
}
```

### 4. Logout
```http
POST /auth/logout
```

### 5. Password Reset Request
```http
POST /auth/forgot-password
```

**Request Body:**
```json
{
  "email": "sarah.johnson@example.com"
}
```

### 6. Password Reset Confirm
```http
POST /auth/reset-password
```

**Request Body:**
```json
{
  "token": "reset_token",
  "newPassword": "NewSecurePassword123!"
}
```

### 7. Two-Factor Authentication Setup
```http
POST /auth/2fa/setup
```

### 8. Two-Factor Authentication Verify
```http
POST /auth/2fa/verify
```

---

## User Management APIs

### 1. Get Current User Profile
```http
GET /users/profile
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "sarah.johnson@example.com",
    "userType": "patient",
    "profile": {
      "firstName": "Sarah",
      "lastName": "Johnson",
      "phone": "+1-555-123-4567",
      "address": "123 Main Street",
      "city": "Springfield",
      "state": "IL",
      "zipCode": "62704"
    },
    "preferences": {
      "language": "en",
      "timezone": "America/Toronto",
      "notifications": {
        "email": true,
        "sms": false,
        "push": true
      }
    }
  }
}
```

### 2. Update User Profile
```http
PUT /users/profile
```

### 3. Change Password
```http
POST /users/change-password
```

### 4. Update Preferences
```http
PUT /users/preferences
```

---

## Patient APIs

### 1. Get Patient Dashboard
```http
GET /patients/dashboard
```

**Response:**
```json
{
  "success": true,
  "data": {
    "upcomingAppointments": [
      {
        "id": "uuid",
        "doctorName": "Dr. Emily Chen",
        "date": "2025-01-20",
        "time": "10:00",
        "type": "Prenatal Checkup"
      }
    ],
    "recentRecords": [],
    "medications": [],
    "statistics": {
      "totalAppointments": 8,
      "completedAppointments": 6,
      "activeRecords": 12
    }
  }
}
```

### 2. Get Patient Medical History
```http
GET /patients/medical-history
```

### 3. Get Patient Medications
```http
GET /patients/medications
```

### 4. Add Emergency Contact
```http
POST /patients/emergency-contacts
```

### 5. Update Insurance Information
```http
PUT /patients/insurance
```

---

## Doctor APIs

### 1. Get Doctor Dashboard
```http
GET /doctors/dashboard
```

**Response:**
```json
{
  "success": true,
  "data": {
    "todaySchedule": [
      {
        "appointmentId": "uuid",
        "patientName": "Sarah Johnson",
        "time": "10:00",
        "type": "Prenatal Checkup",
        "status": "confirmed"
      }
    ],
    "statistics": {
      "todayAppointments": 8,
      "completedToday": 3,
      "pendingRecords": 2,
      "activePatients": 124
    },
    "urgentCases": []
  }
}
```

### 2. Get Doctor's Patients
```http
GET /doctors/patients
```

### 3. Update Doctor Profile
```http
PUT /doctors/profile
```

### 4. Set Availability
```http
POST /doctors/availability
```

---

## Birth Registration APIs

### 1. Create Birth Registration
```http
POST /birth-registrations
```

**Request Body:**
```json
{
  "childInfo": {
    "firstName": "Emma",
    "lastName": "Johnson",
    "gender": "female",
    "birthDate": "2025-01-15",
    "birthTime": "14:30",
    "birthWeight": 3.2,
    "birthLength": 50.5,
    "birthLocation": "Springfield Memorial Hospital"
  },
  "motherInfo": {
    "firstName": "Sarah",
    "lastName": "Johnson",
    "dateOfBirth": "1985-06-15",
    "occupation": "Teacher"
  },
  "fatherInfo": {
    "firstName": "Michael",
    "lastName": "Johnson",
    "dateOfBirth": "1983-03-22",
    "occupation": "Engineer"
  },
  "medicalInfo": {
    "deliveryType": "Natural",
    "apgarScore1min": 9,
    "apgarScore5min": 10,
    "attendingPhysicianId": "uuid"
  }
}
```

### 2. Get Birth Registrations
```http
GET /birth-registrations
```

### 3. Update Registration Status
```http
PUT /birth-registrations/{id}/status
```

### 4. Generate BHN Certificate
```http
POST /birth-registrations/{id}/generate-certificate
```

---

## Health Records APIs

### 1. Create Health Record
```http
POST /health-records
```

**Request Body:**
```json
{
  "patientId": "uuid",
  "recordType": "prenatal",
  "title": "32-week Prenatal Checkup",
  "visitDate": "2025-01-15",
  "vitalSigns": {
    "bloodPressure": {
      "systolic": 120,
      "diastolic": 80
    },
    "heartRate": 72,
    "temperature": 98.6,
    "weight": 65.5
  },
  "diagnosis": "Normal pregnancy progression",
  "treatmentPlan": "Continue prenatal vitamins, next appointment in 2 weeks",
  "urgencyLevel": "normal"
}
```

### 2. Get Health Records
```http
GET /health-records?patientId={uuid}&type={record_type}&limit=10&offset=0
```

### 3. Update Health Record
```http
PUT /health-records/{id}
```

### 4. Add Lab Results
```http
POST /health-records/{id}/lab-results
```

### 5. Add Medication
```http
POST /health-records/{id}/medications
```

---

## Appointment APIs

### 1. Schedule Appointment
```http
POST /appointments
```

**Request Body:**
```json
{
  "patientId": "uuid",
  "doctorId": "uuid",
  "appointmentDate": "2025-01-20",
  "appointmentTime": "10:00",
  "appointmentType": "checkup",
  "reason": "Routine prenatal checkup",
  "duration": 30
}
```

### 2. Get Appointments
```http
GET /appointments?patientId={uuid}&doctorId={uuid}&status={status}&date={date}
```

### 3. Update Appointment
```http
PUT /appointments/{id}
```

### 4. Cancel Appointment
```http
POST /appointments/{id}/cancel
```

### 5. Confirm Appointment
```http
POST /appointments/{id}/confirm
```

### 6. Get Available Time Slots
```http
GET /appointments/available-slots?doctorId={uuid}&date={date}
```

---

## Document Management APIs

### 1. Upload Document
```http
POST /documents/upload
```

**Request (Multipart Form):**
```
file: [binary file]
documentType: "birth_certificate"
title: "Birth Certificate - Emma Johnson"
description: "Official birth certificate"
patientId: "uuid"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "documentId": "uuid",
    "filename": "birth_cert_emma_johnson.pdf",
    "url": "https://s3.amazonaws.com/bhn-documents/...",
    "thumbnailUrl": "https://s3.amazonaws.com/bhn-thumbnails/...",
    "size": 1048576,
    "uploadedAt": "2025-01-15T10:30:00Z"
  }
}
```

### 2. Get Documents
```http
GET /documents?patientId={uuid}&type={document_type}&limit=20&offset=0
```

### 3. Download Document
```http
GET /documents/{id}/download
```

### 4. Delete Document
```http
DELETE /documents/{id}
```

### 5. Get Document Metadata
```http
GET /documents/{id}
```

---

## Notification APIs

### 1. Get Notifications
```http
GET /notifications?limit=20&offset=0&unreadOnly=true
```

### 2. Mark Notification as Read
```http
PUT /notifications/{id}/read
```

### 3. Mark All as Read
```http
PUT /notifications/mark-all-read
```

### 4. Delete Notification
```http
DELETE /notifications/{id}
```

### 5. Create System Notification
```http
POST /notifications
```

---

## Analytics & Dashboard APIs

### 1. Get Dashboard Statistics
```http
GET /analytics/dashboard-stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalPatients": 1247,
    "totalDoctors": 89,
    "todayAppointments": 156,
    "pendingRegistrations": 23,
    "systemHealth": {
      "uptime": "99.9%",
      "responseTime": "245ms",
      "errorRate": "0.1%"
    }
  }
}
```

### 2. Get System Metrics
```http
GET /analytics/system-metrics?period=7d
```

### 3. Get Usage Reports
```http
GET /analytics/usage-reports?startDate={date}&endDate={date}
```

---

## AWS Integration APIs

### 1. S3 File Operations

#### Get Pre-signed URL for Upload
```http
POST /aws/s3/presigned-upload
```

**Request Body:**
```json
{
  "fileName": "document.pdf",
  "fileType": "application/pdf",
  "fileSize": 1048576,
  "documentType": "birth_certificate"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "uploadUrl": "https://s3.amazonaws.com/...",
    "key": "documents/uuid/document.pdf",
    "expiresIn": 3600
  }
}
```

#### Get Pre-signed URL for Download
```http
POST /aws/s3/presigned-download
```

### 2. AWS Cognito Integration

#### Sync User with Cognito
```http
POST /aws/cognito/sync-user
```

#### Update Cognito User Attributes
```http
PUT /aws/cognito/user-attributes
```

### 3. AWS SES Email Service

#### Send Email
```http
POST /aws/ses/send-email
```

**Request Body:**
```json
{
  "to": ["sarah.johnson@example.com"],
  "templateName": "appointment_reminder",
  "templateData": {
    "patientName": "Sarah Johnson",
    "appointmentDate": "2025-01-20",
    "doctorName": "Dr. Emily Chen"
  }
}
```

### 4. AWS SNS Notifications

#### Send SMS
```http
POST /aws/sns/send-sms
```

#### Send Push Notification
```http
POST /aws/sns/send-push
```

### 5. AWS CloudWatch Monitoring

#### Log Custom Metric
```http
POST /aws/cloudwatch/custom-metric
```

#### Get System Health
```http
GET /aws/cloudwatch/health-status
```

---

## System Configuration APIs

### 1. Get System Settings
```http
GET /admin/settings
```

### 2. Update System Settings
```http
PUT /admin/settings
```

### 3. Get Audit Logs
```http
GET /admin/audit-logs?userId={uuid}&action={action}&limit=50
```

### 4. System Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-01-15T10:30:00Z",
  "services": {
    "database": "healthy",
    "redis": "healthy",
    "s3": "healthy",
    "cognito": "healthy"
  },
  "version": "1.0.0"
}
```

---

## Error Handling

### Standard Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The provided data is invalid",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  },
  "timestamp": "2025-01-15T10:30:00Z"
}
```

### Common Error Codes
- `VALIDATION_ERROR`: Invalid input data
- `AUTHENTICATION_ERROR`: Invalid credentials
- `AUTHORIZATION_ERROR`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `CONFLICT`: Resource already exists
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `INTERNAL_SERVER_ERROR`: Server error
- `SERVICE_UNAVAILABLE`: External service unavailable

---

## Authentication & Authorization

### JWT Token Structure
```json
{
  "sub": "user_uuid",
  "email": "sarah.johnson@example.com",
  "userType": "patient",
  "permissions": ["read:profile", "write:profile"],
  "iat": 1642166400,
  "exp": 1642173600
}
```

### Permission System
- `read:profile` - Read own profile
- `write:profile` - Update own profile
- `read:patients` - Read patient data (doctors only)
- `write:health_records` - Create/update health records
- `admin:all` - Full admin access

---

## Rate Limiting

| Endpoint Category | Rate Limit |
|------------------|------------|
| Authentication | 5 requests/minute |
| File Upload | 10 requests/minute |
| API Calls | 100 requests/minute |
| Admin Operations | 20 requests/minute |

---

## WebSocket Events

### Real-time Notifications
```javascript
// Connect to WebSocket
const socket = io('wss://api.birthhealthnetwork.org', {
  auth: {
    token: 'jwt_token'
  }
});

// Listen for appointment updates
socket.on('appointment:updated', (data) => {
  console.log('Appointment updated:', data);
});

// Listen for new notifications
socket.on('notification:new', (notification) => {
  console.log('New notification:', notification);
});

// Listen for health record updates
socket.on('health_record:created', (record) => {
  console.log('New health record:', record);
});
```

---

## API Versioning

### Current Version: v1
- Base URL includes `/api/v1`
- Backwards compatibility maintained for 12 months
- Deprecation notices provided 6 months in advance

### Version History
- **v1.0** (Current) - Initial release
- **v0.9** (Deprecated) - Beta version

---

## Testing Endpoints

### Health Check
```http
GET /health
```

### API Status
```http
GET /status
```

### Load Test Endpoint
```http
GET /test/load?duration=60&concurrency=10
```

---

## Integration Examples

### Frontend React Integration
```javascript
// API Service Class
class BHNApiService {
  constructor(baseURL, token) {
    this.baseURL = baseURL;
    this.token = token;
  }

  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`,
      ...options.headers
    };

    const response = await fetch(url, {
      ...options,
      headers
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  // Get user profile
  async getUserProfile() {
    return this.makeRequest('/users/profile');
  }

  // Schedule appointment
  async scheduleAppointment(appointmentData) {
    return this.makeRequest('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData)
    });
  }
}
```

### Node.js Backend Integration
```javascript
const express = require('express');
const { BHNApiClient } = require('./bhn-api-client');

const app = express();
const bhnApi = new BHNApiClient(process.env.BHN_API_URL);

// Middleware for authentication
app.use(async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const user = await bhnApi.verifyToken(token);
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

// Example endpoint
app.get('/api/dashboard', async (req, res) => {
  try {
    const dashboardData = await bhnApi.getDashboardData(req.user.id);
    res.json(dashboardData);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

---

## Security Considerations

### Data Encryption
- All data transmitted over HTTPS/TLS 1.3
- Sensitive data encrypted at rest using AES-256
- Database-level encryption for PII fields

### Input Validation
- All inputs validated server-side
- SQL injection prevention using parameterized queries
- XSS prevention through input sanitization

### Access Control
- Role-based access control (RBAC)
- Resource-level permissions
- Audit logging for all operations

### Compliance
- HIPAA compliant data handling
- PIPEDA compliance for Canadian users
- SOC 2 Type II certified infrastructure

---

This API documentation covers all the endpoints needed for your Birth Health Network application, including integration with AWS services and comprehensive security measures. Each API follows RESTful principles and includes proper error handling, authentication, and authorization mechanisms. 