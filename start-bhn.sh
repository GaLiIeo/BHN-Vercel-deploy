#!/bin/bash

echo "========================================"
echo " Birth Health Network - Startup Script"
echo "========================================"
echo

# Check if Docker is installed
echo "[1/5] Checking Docker..."
if ! command -v docker &> /dev/null; then
    echo "❌ ERROR: Docker is not installed"
    echo "Please install Docker and try again"
    exit 1
fi

if ! docker info &> /dev/null; then
    echo "❌ ERROR: Docker is not running"
    echo "Please start Docker and try again"
    exit 1
fi

echo "✅ Docker is available"

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ ERROR: Docker Compose is not installed"
    echo "Please install Docker Compose and try again"
    exit 1
fi

echo
echo "[2/5] Checking if services are already running..."
if docker-compose ps &> /dev/null; then
    echo "ℹ️  Some services may already be running"
fi

echo
echo "[3/5] Starting PostgreSQL database..."
if ! docker-compose up -d postgres; then
    echo "❌ ERROR: Failed to start database"
    exit 1
fi

echo "Waiting for database to be ready..."
sleep 10

echo
echo "[4/5] Starting backend API server..."
if ! docker-compose up -d backend; then
    echo "❌ ERROR: Failed to start backend"
    exit 1
fi

echo "Waiting for backend to be ready..."
sleep 5

echo
echo "[5/5] Starting frontend application..."
if ! docker-compose up -d frontend; then
    echo "❌ ERROR: Failed to start frontend"
    exit 1
fi

echo
echo "========================================"
echo "  🎉 Birth Health Network Started!"
echo "========================================"
echo
echo "🌐 Frontend: http://localhost"
echo "🔌 Backend API: http://localhost:3001"
echo "📊 Database: localhost:5432"
echo
echo "⏳ Services may take a few moments to fully initialize..."
echo

echo "Checking service status..."
sleep 3
docker-compose ps

echo
echo "🔍 To test the connection, run:"
echo "   node test-connection.js"
echo
echo "📊 To view logs, run:"
echo "   docker-compose logs -f [service-name]"
echo
echo "🛑 To stop all services, run:"
echo "   docker-compose down"
echo

# Make the script wait for user input
read -p "Press Enter to continue..."