@echo off
echo ========================================
echo  Birth Health Network - Startup Script
echo ========================================
echo.

echo [1/5] Checking Docker...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not installed or not running
    echo Please install Docker Desktop and try again
    pause
    exit /b 1
)
echo ✅ Docker is available

echo.
echo [2/5] Checking if services are already running...
docker-compose ps >nul 2>&1
if %errorlevel% equ 0 (
    echo ℹ️  Some services may already be running
)

echo.
echo [3/5] Starting PostgreSQL database...
docker-compose up -d postgres
if %errorlevel% neq 0 (
    echo ERROR: Failed to start database
    pause
    exit /b 1
)

echo Waiting for database to be ready...
timeout /t 10 /nobreak >nul

echo.
echo [4/5] Starting backend API server...
docker-compose up -d backend
if %errorlevel% neq 0 (
    echo ERROR: Failed to start backend
    pause
    exit /b 1
)

echo Waiting for backend to be ready...
timeout /t 5 /nobreak >nul

echo.
echo [5/5] Starting frontend application...
docker-compose up -d frontend
if %errorlevel% neq 0 (
    echo ERROR: Failed to start frontend
    pause
    exit /b 1
)

echo.
echo ========================================
echo   🎉 Birth Health Network Started!
echo ========================================
echo.
echo 🌐 Frontend: http://localhost
echo 🔌 Backend API: http://localhost:3001
echo 📊 Database: localhost:5432
echo.
echo ⏳ Services may take a few moments to fully initialize...
echo.

echo Checking service status...
timeout /t 3 /nobreak >nul
docker-compose ps

echo.
echo 🔍 To test the connection, run:
echo    node test-connection.js
echo.
echo 📊 To view logs, run:
echo    docker-compose logs -f [service-name]
echo.
echo 🛑 To stop all services, run:
echo    docker-compose down
echo.

pause