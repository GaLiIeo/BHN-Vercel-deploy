#Complete Setup Guide - Birth Health Network

## 📋 **Prerequisites**

Before we start, make sure you have:
- **Docker & Docker Compose** installed
- **Node.js 18+** (for local development)
- **Git** for version control
- **PostgreSQL** (will be handled by Docker)

---

## 🔧 **Step 1: Environment Configuration**

### **1.1 Backend Environment Setup**
```bash
# Navigate to backend directory
cd backend

# Create environment file
cp .env.example .env

# Edit the .env file with your settings
notepad .env  # On Windows
# OR
nano .env     # On Linux/Mac
```

**Edit `backend/.env` file:**
```env
# Database Configuration
DB_HOST=postgres
DB_PORT=5432
DB_NAME=birth_health_network
DB_USER=bhn_user
DB_PASSWORD=your_secure_password_123

# JWT Configuration (IMPORTANT: Use strong secrets)
JWT_SECRET=your_super_secure_jwt_secret_key_minimum_32_characters_here
JWT_EXPIRE=24h
JWT_REFRESH_SECRET=your_super_secure_refresh_secret_key_minimum_32_characters_here
JWT_REFRESH_EXPIRE=7d

# Server Configuration
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Security Configuration
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

### **1.2 Frontend Environment Setup**
```bash
# Navigate to frontend directory
cd ../frontend

# Create environment file
echo "REACT_APP_API_URL=http://localhost:3001/api" > .env.local
```

---

## 🗄️ **Step 2: Database Setup**

### **Option A: Using Docker (Recommended)**
```bash
# From production-bhn directory
cd production-bhn

# Start only PostgreSQL first
docker-compose up -d postgres

# Wait for database to be ready (about 30 seconds)
docker-compose logs postgres

# Verify database is running
docker-compose exec postgres pg_isready -U bhn_user
```

### **Option B: Manual PostgreSQL Setup**
If you prefer manual setup:

```bash
# Install PostgreSQL 15+
# Create database and user
psql -U postgres
CREATE DATABASE birth_health_network;
CREATE USER bhn_user WITH PASSWORD 'your_secure_password_123';
GRANT ALL PRIVILEGES ON DATABASE birth_health_network TO bhn_user;
\q

# Run the schema
psql -U bhn_user -d birth_health_network -f database_schema.sql
```

---

## 🔗 **Step 3: Backend API Setup**

### **3.1 Install Dependencies**
```bash
cd backend

# Install Node.js dependencies
npm install

# Verify all packages are installed
npm list
```

### **3.2 Test Database Connection**
```bash
# Test the backend server
npm run dev

# You should see:
# 🚀 BHN Backend Server running on port 3001
# ✅ Database connection established successfully
# 📊 Database models synchronized
```

### **3.3 Verify API Endpoints**
Open another terminal and test:
```bash
# Test health endpoint
curl http://localhost:3001/health

# Test API documentation
curl http://localhost:3001/api

# Expected response:
# {
#   "status": "healthy",
#   "timestamp": "2025-01-08T...",
#   "version": "1.0.0"
# }
```

---

## 🎨 **Step 4: Frontend Setup**

### **4.1 Install Dependencies**
```bash
cd frontend

# Install React dependencies
npm install

# Verify installation
npm list react react-dom @mui/material
```

### **4.2 Update API Integration**
Update `frontend/src/utils/api.js` to connect to your backend:

```javascript
// Add this to the top of the file
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Update the API service
class HealthcareAPI {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('accessToken');
  }

  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Authentication
  async login(email, password) {
    const response = await this.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    if (response.success) {
      this.token = response.data.accessToken;
      localStorage.setItem('accessToken', this.token);
    }
    
    return response;
  }

  // Dashboard
  async getDashboardData() {
    return await this.makeRequest('/dashboard');
  }

  // Health Records
  async createHealthRecord(recordData) {
    return await this.makeRequest('/health-records', {
      method: 'POST',
      body: JSON.stringify(recordData)
    });
  }

  async searchHealthRecords(bhnId) {
    return await this.makeRequest(`/health-records/search?bhnId=${bhnId}`);
  }

  // Research Integration
  async searchMedicalResearch(query) {
    return await this.makeRequest('/research/comprehensive', {
      method: 'POST',
      body: JSON.stringify({ query })
    });
  }

  // Patients List
  async getPatientsList() {
    return await this.makeRequest('/dashboard/patients');
  }
}

export const healthcareAPI = new HealthcareAPI();
```

### **4.3 Start Frontend Development Server**
```bash
# Start React development server
npm start

# Frontend will open at: http://localhost:3000
```

---

## 🔄 **Step 5: Complete Integration Testing**

### **5.1 Test Full Stack Connection**
```bash
# Terminal 1: Backend (if not already running)
cd backend
npm run dev

# Terminal 2: Frontend (if not already running)
cd frontend
npm start

# Terminal 3: Database check
cd production-bhn
docker-compose exec postgres psql -U bhn_user -d birth_health_network
\dt  # Should show all tables
\q
```

### **5.2 Test User Registration and Login**
1. Open http://localhost:3000
2. Go to Register page
3. Create a test user:
   ```json
   {
     "firstName": "Dr. John",
     "lastName": "Smith",
     "email": "doctor@test.com",
     "password": "TestPassword123!",
     "userType": "doctor"
   }
   ```
4. Login with the created credentials
5. Access the Dashboard

### **5.3 Test Health Records Creation**
1. Login as a doctor
2. Go to Dashboard
3. Click "Add Health Record"
4. Fill in comprehensive health data
5. Submit and verify data is saved

---

## 🐳 **Step 6: Docker Production Setup**

### **6.1 Build and Start All Services**
```bash
# From production-bhn directory
docker-compose up --build -d

# Check all services are running
docker-compose ps

# Expected output:
# postgres    healthy
# backend     healthy  
# frontend    healthy
# redis       healthy
```

### **6.2 Verify Production Deployment**
```bash
# Test frontend
curl http://localhost/health

# Test backend API
curl http://localhost:3001/health

# Test database connection
docker-compose exec backend npm run health-check
```

---

## 🔍 **Step 7: Troubleshooting Common Issues**

### **Database Connection Issues**
```bash
# Check database logs
docker-compose logs postgres

# Test database connectivity
docker-compose exec postgres pg_isready -U bhn_user

# Reset database if needed
docker-compose down -v
docker-compose up -d postgres
```

### **Backend API Issues**
```bash
# Check backend logs
docker-compose logs backend

# Test backend directly
curl -v http://localhost:3001/health

# Check environment variables
docker-compose exec backend printenv | grep DB_
```

### **Frontend Connection Issues**
```bash
# Check frontend logs
docker-compose logs frontend

# Verify API URL configuration
echo $REACT_APP_API_URL

# Test API connectivity from frontend container
docker-compose exec frontend curl http://backend:3001/health
```

### **CORS Issues**
If you get CORS errors, update `backend/server.js`:
```javascript
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
```

---

## 📊 **Step 8: Data Flow Verification**

### **8.1 Test Complete Data Flow**
1. **Registration**: User creates account → Database stores user
2. **Login**: User authenticates → JWT token generated
3. **Dashboard**: User accesses dashboard → Backend fetches data
4. **Health Records**: User creates record → Data saved to database
5. **Research**: User searches research → External APIs queried

### **8.2 API Testing with Postman/Curl**

**Test Authentication:**
```bash
# Register user
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Dr. Jane",
    "lastName": "Doe",
    "email": "jane@test.com",
    "password": "TestPassword123!",
    "userType": "doctor"
  }'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@test.com",
    "password": "TestPassword123!"
  }'
```

**Test Health Records (with JWT token):**
```bash
# Get health records
curl -X GET http://localhost:3001/api/health-records \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"

# Create health record
curl -X POST http://localhost:3001/api/health-records \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "patientId": "patient-uuid",
    "recordType": "consultation",
    "title": "Test Health Record",
    "visitDate": "2025-01-08",
    "vitalSigns": {
      "bloodPressure": {"systolic": 120, "diastolic": 80},
      "heartRate": 72,
      "temperature": 98.6
    }
  }'
```

---

## 🎯 **Step 9: Manual Setup Checklist**

### **Before You Start:**
- [ ] Docker installed and running
- [ ] Node.js 18+ installed
- [ ] Git repository cloned
- [ ] Environment files created

### **Database Setup:**
- [ ] PostgreSQL running (Docker or manual)
- [ ] Database schema applied
- [ ] Connection successful
- [ ] Tables created

### **Backend Setup:**
- [ ] Dependencies installed (`npm install`)
- [ ] Environment variables configured
- [ ] Server starts without errors
- [ ] Database connection established
- [ ] API endpoints responding

### **Frontend Setup:**
- [ ] Dependencies installed (`npm install`)
- [ ] API URL configured
- [ ] Development server starts
- [ ] Can access login/register pages
- [ ] API calls working

### **Integration Testing:**
- [ ] User registration works
- [ ] User login successful
- [ ] Dashboard loads data
- [ ] Health records can be created
- [ ] Research integration works
- [ ] All forms submit correctly

---

## 🚀 **Step 10: Going Live**

### **Development to Production:**
```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Start production services
docker-compose -f docker-compose.prod.yml up -d

# Monitor logs
docker-compose -f docker-compose.prod.yml logs -f
```

### **Domain and SSL Setup:**
1. Point your domain to your server
2. Update `FRONTEND_URL` in environment
3. Configure SSL certificates
4. Update CORS origins

---

## 📞 **Need Help?**

### **Common Commands:**
```bash
# Restart all services
docker-compose restart

# View logs
docker-compose logs -f [service-name]

# Access database
docker-compose exec postgres psql -U bhn_user -d birth_health_network

# Access backend container
docker-compose exec backend bash

# Check service status
docker-compose ps
```

### **Quick Fixes:**
```bash
# Reset everything
docker-compose down -v
docker-compose up --build -d

# Clear Node.js cache
rm -rf node_modules package-lock.json
npm install

# Database reset
docker-compose exec postgres dropdb -U bhn_user birth_health_network
docker-compose exec postgres createdb -U bhn_user birth_health_network
docker-compose exec postgres psql -U bhn_user -d birth_health_network -f /docker-entrypoint-initdb.d/01-schema.sql
```

---

**🎉 Once completed, you'll have a fully functional healthcare management system with comprehensive data entry, research integration, and HIPAA/PIPEDA compliance!**

**Access Points:**
- **Frontend**: http://localhost:3000 (Development) / http://localhost (Production)
- **Backend API**: http://localhost:3001
- **Database**: localhost:5432
- **API Documentation**: http://localhost:3001/api