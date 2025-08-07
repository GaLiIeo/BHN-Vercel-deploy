@echo off
echo Starting Birth Health Network - Production Environment
echo.

echo Checking if Docker is running...
docker --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker is not installed or not running
    echo Please install Docker Desktop and ensure it's running
    pause
    exit /b 1
)

echo.
echo Building and starting production containers...
cd production-bhn

echo.
echo Building Docker images...
docker-compose build

echo.
echo Starting all services...
docker-compose up -d

echo.
echo Waiting for services to start...
timeout /t 10 /nobreak > nul

echo.
echo Checking service health...
docker-compose ps

echo.
echo Testing health endpoints...
echo Frontend: http://localhost
echo Backend:  http://localhost:3001/health
echo.

echo Opening browser...
start http://localhost

echo.
echo To view logs: docker-compose logs -f
echo To stop: docker-compose down
echo.
pause
