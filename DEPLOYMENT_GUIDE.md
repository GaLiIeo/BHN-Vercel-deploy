# 🚀 Birth Health Network - Complete Deployment Guide

## 📋 Table of Contents
1. [Pre-Deployment Setup](#pre-deployment-setup)
2. [Database Setup & Verification](#database-setup--verification)
3. [Environment Configuration](#environment-configuration)
4. [Local Testing](#local-testing)
5. [AWS Deployment](#aws-deployment)
6. [GitHub Setup](#github-setup)
7. [Post-Deployment Verification](#post-deployment-verification)
8. [HIPAA Compliance Checklist](#hipaa-compliance-checklist)

---

## 🔧 Pre-Deployment Setup

### 1. Install Required Dependencies

```bash
# Install Node.js (v18 or later)
# Install PostgreSQL (v13 or later)
# Install Git

# Clone and setup project
git clone <your-repo>
cd bhn-v1
npm install
```

### 2. Generate Secure Keys

```bash
# Generate JWT Secret (64+ characters)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Generate Session Secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate Encryption Key (32 characters for AES-256)
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```

---

## 🗄️ Database Setup & Verification

### 1. PostgreSQL Installation & Setup

#### Windows:
```powershell
# Install PostgreSQL
# Download from: https://www.postgresql.org/download/windows/

# Create database user
psql -U postgres
CREATE USER bhn_user WITH PASSWORD 'your_secure_password';
CREATE DATABASE birth_health_network;
GRANT ALL PRIVILEGES ON DATABASE birth_health_network TO bhn_user;
ALTER USER bhn_user CREATEDB;
```

#### macOS:
```bash
# Install via Homebrew
brew install postgresql
brew services start postgresql

# Create database
createdb birth_health_network
psql birth_health_network
CREATE USER bhn_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE birth_health_network TO bhn_user;
```

#### Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

sudo -u postgres psql
CREATE USER bhn_user WITH PASSWORD 'your_secure_password';
CREATE DATABASE birth_health_network;
GRANT ALL PRIVILEGES ON DATABASE birth_health_network TO bhn_user;
```

### 2. Database Schema Creation

```bash
# Run database setup script
npm run setup-db

# Or manually run schema
psql -U bhn_user -d birth_health_network -f database_schema.sql
```

### 3. Database Verification Commands

```sql
-- Connect to database
psql -U bhn_user -d birth_health_network

-- Verify tables exist
\dt

-- Check user profiles table structure
\d user_profiles

-- Check patients table structure
\d patients

-- Check health records table structure
\d health_records

-- Verify sample data (if seeded)
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM patients;
SELECT COUNT(*) FROM health_records;

-- Check HIPAA audit tables
SELECT COUNT(*) FROM audit_logs;

-- Test BHN ID format validation
INSERT INTO patients (user_id, bhn_id) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'BHN20250000000001');
```

### 4. Database Performance Checks

```sql
-- Check database size
SELECT pg_size_pretty(pg_database_size('birth_health_network'));

-- Check table sizes
SELECT 
    tablename,
    pg_size_pretty(pg_total_relation_size(tablename::regclass)) as size
FROM pg_tables 
WHERE schemaname = 'public';

-- Check active connections
SELECT count(*) FROM pg_stat_activity WHERE datname = 'birth_health_network';
```

---

## ⚙️ Environment Configuration

### 1. Create .env file

```bash
# Copy template
cp env.template .env

# Edit with your actual values
nano .env  # or your preferred editor
```

### 2. Required Environment Variables

```env
# Database (REQUIRED)
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=birth_health_network
DB_USER=bhn_user
DB_PASSWORD=your_actual_password

# Security (REQUIRED)
JWT_SECRET=your_generated_64_char_secret
SESSION_SECRET=your_generated_32_char_secret
ENCRYPTION_KEY=your_generated_16_char_key

# Server (REQUIRED)
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000

# Email (REQUIRED for password reset)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

---

## 🧪 Local Testing

### 1. Start Services

```bash
# Terminal 1 - Start Backend
npm start

# Terminal 2 - Start Frontend  
npm run start:frontend

# Or use the batch file (Windows)
start-bhn.bat
```

### 2. Verify Application Health

```bash
# Health check endpoint
curl http://localhost:3001/health

# API endpoints test
curl http://localhost:3001/api/dashboard/stats
curl http://localhost:3001/api/auth/status
```

### 3. Frontend Verification

- Navigate to: `http://localhost:3001`
- Test login/registration
- Test dashboard access
- Test health record creation
- Test BHN ID search functionality

### 4. Database Connection Test

```bash
# Test database connectivity
node -e "
const { Pool } = require('pg');
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'birth_health_network',
  user: 'bhn_user',
  password: 'your_password'
});
pool.query('SELECT NOW()', (err, res) => {
  if (err) console.error('DB Error:', err);
  else console.log('DB Connected:', res.rows[0]);
  pool.end();
});
"
```

---

## ☁️ AWS Deployment

### 1. AWS Setup Prerequisites

```bash
# Install AWS CLI
# Configure AWS credentials
aws configure

# Install Elastic Beanstalk CLI
pip install awsebcli
```

### 2. RDS Database Setup

```bash
# Create RDS PostgreSQL instance
aws rds create-db-instance \
  --db-instance-identifier bhn-production \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --engine-version 13.7 \
  --allocated-storage 20 \
  --db-name birth_health_network \
  --master-username bhnmaster \
  --master-user-password your_secure_password \
  --vpc-security-group-ids sg-xxxxxxxx \
  --backup-retention-period 7 \
  --storage-encrypted
```

### 3. Elastic Beanstalk Deployment

```bash
# Initialize EB application
eb init

# Create environment
eb create bhn-production

# Deploy application
eb deploy

# Set environment variables
eb setenv NODE_ENV=production
eb setenv DB_HOST=your-rds-endpoint
eb setenv DB_NAME=birth_health_network
eb setenv DB_USER=bhnmaster
eb setenv DB_PASSWORD=your_secure_password
eb setenv JWT_SECRET=your_production_jwt_secret
```

### 4. S3 Bucket for File Storage

```bash
# Create S3 bucket for documents
aws s3 mb s3://bhn-documents-prod

# Set bucket policy for HIPAA compliance
aws s3api put-bucket-encryption \
  --bucket bhn-documents-prod \
  --server-side-encryption-configuration \
  '{"Rules":[{"ApplyServerSideEncryptionByDefault":{"SSEAlgorithm":"AES256"}}]}'
```

### 5. CloudFront Distribution

```bash
# Create CloudFront distribution for static assets
aws cloudfront create-distribution \
  --distribution-config file://cloudfront-config.json
```

---

## 📂 GitHub Setup

### 1. Repository Setup

```bash
# Initialize git repository
git init

# Add GitHub remote
git remote add origin https://github.com/yourusername/bhn-v1.git

# Create .gitignore
echo "
node_modules/
.env
.env.local
.env.production
logs/
*.log
dist/
build/
coverage/
.DS_Store
Thumbs.db
" > .gitignore

# Initial commit
git add .
git commit -m "Initial commit: Birth Health Network application"
git push -u origin main
```

### 2. GitHub Actions CI/CD

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to AWS

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run tests
      run: npm test
      
    - name: Deploy to AWS
      env:
        AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
        AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
      run: |
        pip install awsebcli
        eb deploy bhn-production
```

### 3. Environment Secrets

Add these secrets in GitHub Settings → Secrets:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `JWT_SECRET`
- `DB_PASSWORD`
- `EMAIL_PASSWORD`

---

## ✅ Post-Deployment Verification

### 1. Application Health Checks

```bash
# Production health check
curl https://your-domain.com/health

# Database connectivity
curl https://your-domain.com/api/health/db

# Authentication endpoint
curl https://your-domain.com/api/auth/status
```

### 2. HIPAA Compliance Verification

```sql
-- Verify audit logging is working
SELECT COUNT(*) FROM audit_logs WHERE created_at > NOW() - INTERVAL '1 hour';

-- Check data encryption
SELECT encrypted_data IS NOT NULL FROM health_records LIMIT 5;

-- Verify access controls
SELECT user_type, COUNT(*) FROM users GROUP BY user_type;
```

### 3. Performance Testing

```bash
# Load testing with Apache Bench
ab -n 100 -c 10 https://your-domain.com/api/dashboard/stats

# Database performance
psql -c "EXPLAIN ANALYZE SELECT * FROM health_records WHERE bhn_id = 'BHN20250000000001';"
```

---

## 🔒 HIPAA Compliance Checklist

### ✅ Technical Safeguards
- [ ] Data encryption at rest (AES-256)
- [ ] Data encryption in transit (TLS 1.2+)
- [ ] User authentication (JWT tokens)
- [ ] Access controls (role-based)
- [ ] Audit logging (all data access)
- [ ] Session timeouts
- [ ] Password complexity requirements

### ✅ Physical Safeguards
- [ ] AWS infrastructure compliance
- [ ] Secure data centers
- [ ] Access controls to servers
- [ ] Environmental controls

### ✅ Administrative Safeguards
- [ ] Security officer designated
- [ ] Workforce training completed
- [ ] Access management procedures
- [ ] Incident response plan
- [ ] Risk assessment conducted

### ✅ Data Protection
- [ ] Minimum necessary standard
- [ ] Data backup procedures
- [ ] Data retention policies
- [ ] Secure data disposal

---

## 🆘 Troubleshooting

### Common Issues:

1. **Database Connection Failed**
```bash
# Check PostgreSQL service
sudo systemctl status postgresql

# Test connection
psql -U bhn_user -d birth_health_network -c "SELECT 1;"
```

2. **JWT Token Issues**
```bash
# Verify JWT secret is set
echo $JWT_SECRET

# Check token expiration
node -e "console.log(require('jsonwebtoken').decode('your_token'))"
```

3. **File Upload Issues**
```bash
# Check S3 permissions
aws s3api get-bucket-acl --bucket bhn-documents-prod

# Verify file size limits
curl -X POST -F "file=@large_file.pdf" http://localhost:3001/api/upload
```

---

## 📞 Support

For deployment issues:
1. Check application logs: `tail -f logs/application.log`
2. Check database logs: `tail -f /var/log/postgresql/postgresql.log`
3. Monitor AWS CloudWatch for production issues
4. Use GitHub Issues for bug reports

---

**🔐 Remember: Always prioritize HIPAA compliance and patient data security in all deployment decisions.**
