# 🏥 Birth Health Network (BHN) - Complete Web Application

**A comprehensive healthcare management system for birth health records, patient management, and medical documentation.**

![BHN Logo](./public/logo.png)

## 🌟 Features

### 🔐 **Authentication & Security**
- JWT-based authentication with refresh tokens
- Role-based access control (Patient, Doctor, Admin, etc.)
- HIPAA-compliant data encryption
- Two-factor authentication support
- Secure password policies

### 📊 **Dashboard & Analytics**
- Interactive healthcare dashboard
- Real-time health metrics
- Patient overview and statistics
- Health records visualization

### 🏥 **Health Records Management**
- Comprehensive patient records
- Birth registration system
- Medical history tracking
- Document management with encryption
- BHN ID system (14-digit unique identifiers)

### 👥 **User Management**
- Multiple user types: Patients, Doctors, Nurses, Admin
- Profile management
- Contact information and emergency contacts
- Healthcare provider profiles

### 📱 **Modern UI/UX**
- Responsive Material-UI design
- Dark/Light theme support
- Accessibility features
- Mobile-friendly interface

## 🛠️ **Technology Stack**

### **Frontend**
- **React 19** - Modern React with hooks
- **Material-UI (MUI)** - Component library
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **Framer Motion** - Animations
- **Styled Components** - Styling

### **Backend**
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Primary database
- **Sequelize** - ORM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Helmet** - Security middleware

### **DevOps & Deployment**
- **Docker** - Containerization
- **Docker Compose** - Multi-service orchestration
- **AWS Support** - S3, RDS, Elastic Beanstalk
- **GitHub Actions** - CI/CD ready

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18+
- PostgreSQL 13+
- Docker (optional)
- Git

### **1. Clone the Repository**
```bash
git clone https://github.com/taber-155/bhn_Project_ca.git
cd bhn_Project_ca
```

### **2. Environment Setup**
```bash
# Copy environment template
cp env.template .env

# Install dependencies
npm install
```

### **3. Database Setup**
```bash
# Create PostgreSQL database
createdb birth_health_network

# Create database user
psql -U postgres -c "CREATE USER bhn_user WITH PASSWORD 'your_password';"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE birth_health_network TO bhn_user;"
psql -U postgres -d birth_health_network -c "GRANT ALL ON SCHEMA public TO bhn_user;"
```

### **4. Configure Environment Variables**
Edit `.env` file with your settings:
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=birth_health_network
DB_USER=bhn_user
DB_PASSWORD=your_password

# JWT Secrets (use generated ones)
JWT_SECRET=your_jwt_secret_here
SESSION_SECRET=your_session_secret_here
ENCRYPTION_KEY=your_encryption_key_here
```

### **5. Start the Application**

#### **Development Mode**
```bash
# Start backend (port 3001)
npm start

# Start frontend (port 3000) - in new terminal
npm run start:frontend
```

#### **Docker Deployment**
```bash
# Development
docker-compose up -d

# Production
docker-compose -f docker-compose.prod.yml up -d
```

## 📁 **Project Structure**

```
bhn-v1/
├── 📂 src/                          # Frontend source
│   ├── 📂 components/
│   │   ├── 📂 layout/               # Header, Footer, Navigation
│   │   ├── 📂 pages/
│   │   │   ├── 📂 auth/             # Login, Register, ForgotPassword
│   │   │   ├── 📂 dashboard/        # Main dashboard
│   │   │   ├── 📂 profiles/         # User profiles
│   │   │   └── 📂 public/           # Public pages
│   │   └── 📂 common/               # Shared components
│   ├── 📂 context/                  # React contexts
│   ├── 📂 utils/                    # Utilities and helpers
│   └── 📂 styles/                   # Global styles and themes
├── 📂 backend/                      # Backend API (alternative structure)
├── 📂 src/                          # Backend source (main)
│   ├── 📂 controllers/              # Request handlers
│   ├── 📂 models/                   # Database models
│   ├── 📂 routes/                   # API routes
│   ├── 📂 middleware/               # Custom middleware
│   └── 📂 config/                   # Configuration files
├── 📂 scripts/                      # Utility scripts
├── 📂 DOCS/                         # Project documentation
├── 🐳 docker-compose.yml           # Docker development
├── 🐳 docker-compose.prod.yml      # Docker production
├── 🐳 Dockerfile                   # Main Dockerfile
└── 📄 Various config files
```

## 🔧 **API Endpoints**

### **Authentication**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/change-password` - Change password

### **Health Records**
- `GET /api/health-records` - Get health records
- `POST /api/health-records` - Create health record
- `GET /api/health-records/:id` - Get specific record
- `PUT /api/health-records/:id` - Update record
- `DELETE /api/health-records/:id` - Delete record

### **Dashboard**
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/recent-activity` - Recent activities

### **Patients & Doctors**
- `GET /api/patients` - Get patients list
- `GET /api/doctors` - Get doctors list
- `POST /api/patients` - Create patient
- `POST /api/doctors` - Create doctor

## 🐳 **Docker Support**

### **Development Setup**
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### **Production Deployment**
```bash
# Build and start production containers
docker-compose -f docker-compose.prod.yml up -d --build

# Scale services
docker-compose -f docker-compose.prod.yml up -d --scale frontend=2
```

### **Environment Variables for Docker**
```env
# Docker-specific variables
POSTGRES_DB=birth_health_network
POSTGRES_USER=bhn_user
POSTGRES_PASSWORD=secure_password
REDIS_URL=redis://redis:6379
```

## 🔒 **Security Features**

- **JWT Authentication** with refresh tokens
- **Password Hashing** using bcryptjs
- **Rate Limiting** on API endpoints
- **CORS Protection** configured for production
- **Helmet.js** for security headers
- **Data Encryption** for sensitive fields
- **HIPAA Compliance** measures
- **Input Validation** and sanitization

## 📊 **Database Schema**

### **Key Tables**
- `users` - User authentication and basic info
- `user_profiles` - Extended user information
- `patients` - Patient-specific data
- `doctors` - Doctor profiles and credentials
- `health_records` - Medical records and history
- `appointments` - Appointment scheduling
- `documents` - File and document management
- `medications` - Prescription tracking

## 🚀 **Deployment Options**

### **AWS Deployment**
1. **Frontend**: S3 + CloudFront
2. **Backend**: Elastic Beanstalk or ECS
3. **Database**: RDS PostgreSQL
4. **Files**: S3 with encryption

### **Self-Hosted**
1. Use Docker Compose production configuration
2. Configure reverse proxy (Nginx)
3. Set up SSL certificates
4. Configure backup strategies

## 🧪 **Testing**

```bash
# Run backend tests
npm test

# Run frontend tests
npm run test:frontend

# Coverage report
npm run test:coverage

# Database verification
npm run verify-db
```

## 📚 **Documentation**

- [📖 Setup Guide](./COMPLETE_SETUP_GUIDE.md)
- [🚀 Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [🏗️ API Documentation](./api_documentation.md)
- [🔧 Backend Setup](./BACKEND_SETUP_GUIDE.md)
- [📊 Dashboard Guide](./DASHBOARD_ENHANCEMENTS.md)

## 🤝 **Contributing**

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📞 **Support & Contact**

- **Repository**: https://github.com/taber-155/bhn_Project_ca
- **Issues**: [GitHub Issues](https://github.com/taber-155/bhn_Project_ca/issues)
- **Documentation**: See `/DOCS` folder

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏆 **Team**

**Birth Health Network Development Team**
- Healthcare IT Specialists
- Full-Stack Developers
- Security Engineers
- UX/UI Designers

---

**🎯 Production Ready** | **🔒 HIPAA Compliant** | **🌐 Cloud Native** | **📱 Mobile Responsive**

**Made with ❤️ for healthcare professionals and patients worldwide**