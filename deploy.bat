@echo off
REM BHN Complete Application Deployment Script for Windows
setlocal enabledelayedexpansion

echo 🏥 Birth Health Network - Complete Deployment Script
echo ==================================================

set PROJECT_NAME=bhn-v1
set COMPOSE_FILE=docker-compose.full.yml
set ENV_FILE=.env

REM Function to check if Docker is installed
:check_docker
echo [INFO] Checking Docker installation...
docker --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not installed. Please install Docker Desktop first.
    exit /b 1
)

docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker Compose is not installed. Please install Docker Compose first.
    exit /b 1
)

echo [SUCCESS] Docker and Docker Compose are installed
goto :eof

REM Function to check environment file
:check_env
echo [INFO] Checking environment configuration...
if not exist "%ENV_FILE%" (
    echo [WARNING] Environment file not found. Creating from template...
    if exist "env.template" (
        copy env.template .env
        echo [WARNING] Please edit .env file with your configuration before proceeding
        pause
        exit /b 1
    ) else (
        echo [ERROR] No environment template found
        exit /b 1
    )
)
echo [SUCCESS] Environment file exists
goto :eof

REM Function to build and start services
:deploy_services
echo [INFO] Building and starting services...

REM Pull latest images
docker-compose -f "%COMPOSE_FILE%" pull

REM Build custom images
docker-compose -f "%COMPOSE_FILE%" build --no-cache

REM Start services
docker-compose -f "%COMPOSE_FILE%" up -d

echo [SUCCESS] Services started successfully
goto :eof

REM Function to wait for services
:wait_for_services
echo [INFO] Waiting for services to be healthy...
set /a max_attempts=30
set /a attempt=1

:health_loop
echo [INFO] Health check attempt !attempt!/!max_attempts!

REM Check backend health
curl -sf http://localhost:3001/health >nul 2>&1
if not errorlevel 1 (
    echo [SUCCESS] Backend is healthy
    goto :health_success
)

if !attempt! equ !max_attempts! (
    echo [ERROR] Services failed to start properly
    docker-compose -f "%COMPOSE_FILE%" logs
    exit /b 1
)

timeout /t 10 /nobreak >nul
set /a attempt+=1
goto :health_loop

:health_success
goto :eof

REM Function to show status
:show_status
echo [INFO] Deployment Status:
echo ==================
docker-compose -f "%COMPOSE_FILE%" ps
echo.

echo [INFO] Application URLs:
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:3001
echo API Docs: http://localhost:3001/api
echo Health Check: http://localhost:3001/health
echo pgAdmin: http://localhost:8080 (if enabled)
echo.

echo [INFO] Useful Commands:
echo View logs: docker-compose -f %COMPOSE_FILE% logs -f
echo Stop services: docker-compose -f %COMPOSE_FILE% down
echo Restart: docker-compose -f %COMPOSE_FILE% restart
echo Scale frontend: docker-compose -f %COMPOSE_FILE% up -d --scale frontend=3
goto :eof

REM Function to cleanup
:cleanup
echo [INFO] Stopping services...
docker-compose -f "%COMPOSE_FILE%" down
echo [SUCCESS] Services stopped
goto :eof

REM Main execution
set ACTION=%1
if "%ACTION%"=="" set ACTION=deploy

if "%ACTION%"=="deploy" goto :deploy
if "%ACTION%"=="start" goto :deploy
if "%ACTION%"=="stop" goto :stop
if "%ACTION%"=="restart" goto :restart
if "%ACTION%"=="logs" goto :logs
if "%ACTION%"=="status" goto :status
goto :usage

:deploy
call :check_docker
call :check_env
call :deploy_services
call :wait_for_services
call :show_status
echo [SUCCESS] 🎉 BHN Application deployed successfully!
goto :end

:stop
call :cleanup
goto :end

:restart
call :cleanup
timeout /t 5 /nobreak >nul
call :deploy_services
call :wait_for_services
call :show_status
goto :end

:logs
docker-compose -f "%COMPOSE_FILE%" logs -f
goto :end

:status
call :show_status
goto :end

:usage
echo Usage: %0 {deploy^|start^|stop^|restart^|logs^|status}
echo.
echo Commands:
echo   deploy/start - Deploy the complete application
echo   stop         - Stop all services
echo   restart      - Restart all services
echo   logs         - View application logs
echo   status       - Show current status
exit /b 1

:end
pause
