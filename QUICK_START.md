# 🚀 BHN Quick Start Guide

Get your Birth Health Network application running in under 5 minutes!

## 📋 Prerequisites
- Docker Desktop installed
- Git installed
- 8GB RAM available

## ⚡ One-Command Deployment

### Windows
```bash
# Clone and deploy
git clone https://github.com/taber-155/bhn_Project_ca.git
cd bhn_Project_ca
deploy.bat
```

### Linux/Mac
```bash
# Clone and deploy
git clone https://github.com/taber-155/bhn_Project_ca.git
cd bhn_Project_ca
chmod +x deploy.sh
./deploy.sh
```

## 🌐 Access Your Application

After deployment completes (2-3 minutes):

### **Frontend (React App)**
- **URL**: http://localhost:3000
- **Features**: Modern healthcare dashboard, patient management, health records

### **Backend (API)**
- **URL**: http://localhost:3001
- **Health Check**: http://localhost:3001/health
- **API Documentation**: http://localhost:3001/api

### **Database Admin (Optional)**
- **URL**: http://localhost:8080
- **Username**: admin@bhn.local
- **Password**: admin_password

## 🔐 Demo Credentials

### Test Accounts
```
Doctor Account:
Email: doctor@example.com
Password: password123

Patient Account:
Email: patient@example.com  
Password: password123
```

## 📊 What's Included

### **Complete Healthcare Stack**
- ✅ PostgreSQL Database with HIPAA compliance
- ✅ Redis for session management
- ✅ Nginx reverse proxy with security
- ✅ React frontend with Material-UI
- ✅ Node.js backend with Express
- ✅ JWT authentication system
- ✅ Health records management
- ✅ Birth registration system
- ✅ Document management with encryption

### **Production Ready Features**
- 🔒 Security headers and rate limiting
- 📈 Health checks and monitoring
- 🐳 Multi-stage Docker builds
- 🔄 Auto-restart on failure
- 📝 Comprehensive logging
- 🛡️ Data encryption at rest

## 🛠️ Management Commands

```bash
# View application status
deploy.bat status

# View logs
deploy.bat logs

# Stop all services
deploy.bat stop

# Restart everything
deploy.bat restart
```

## 🆘 Troubleshooting

### Port Already in Use
```bash
# Check what's using the ports
netstat -ano | findstr :3000
netstat -ano | findstr :3001

# Kill the processes if needed
taskkill /PID <PID> /F
```

### Database Connection Issues
```bash
# Reset database
docker-compose -f docker-compose.full.yml down -v
deploy.bat
```

### Container Issues
```bash
# Clean restart
docker system prune -f
deploy.bat
```

## 📞 Support

- **GitHub Issues**: https://github.com/taber-155/bhn_Project_ca/issues
- **Documentation**: See `/DOCS` folder
- **API Docs**: http://localhost:3001/api (when running)

## 🎯 Next Steps

1. **Customize**: Edit `.env` file for your configuration
2. **Deploy**: Use AWS deployment guide for production
3. **Develop**: Follow the development setup in main README
4. **Scale**: Use `docker-compose scale` commands

---

**🎉 Congratulations! Your healthcare application is now running!**

**Frontend**: http://localhost:3000 | **Backend**: http://localhost:3001
