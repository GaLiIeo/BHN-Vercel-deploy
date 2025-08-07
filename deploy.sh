#!/bin/bash

# BHN Complete Application Deployment Script
set -e

echo "🏥 Birth Health Network - Complete Deployment Script"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="bhn-v1"
COMPOSE_FILE="docker-compose.full.yml"
ENV_FILE=".env"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
check_docker() {
    print_status "Checking Docker installation..."
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    print_success "Docker and Docker Compose are installed"
}

# Check environment file
check_env() {
    print_status "Checking environment configuration..."
    if [ ! -f "$ENV_FILE" ]; then
        print_warning "Environment file not found. Creating from template..."
        if [ -f "env.template" ]; then
            cp env.template .env
            print_warning "Please edit .env file with your configuration before proceeding"
            exit 1
        else
            print_error "No environment template found"
            exit 1
        fi
    fi
    print_success "Environment file exists"
}

# Generate secrets if not present
generate_secrets() {
    print_status "Checking JWT secrets..."
    
    if ! grep -q "JWT_SECRET=" "$ENV_FILE" || [ "$(grep "JWT_SECRET=" "$ENV_FILE" | cut -d'=' -f2)" = "" ]; then
        print_status "Generating JWT secret..."
        JWT_SECRET=$(openssl rand -hex 64)
        sed -i "s/JWT_SECRET=.*/JWT_SECRET=$JWT_SECRET/" "$ENV_FILE"
    fi
    
    if ! grep -q "SESSION_SECRET=" "$ENV_FILE" || [ "$(grep "SESSION_SECRET=" "$ENV_FILE" | cut -d'=' -f2)" = "" ]; then
        print_status "Generating session secret..."
        SESSION_SECRET=$(openssl rand -hex 32)
        sed -i "s/SESSION_SECRET=.*/SESSION_SECRET=$SESSION_SECRET/" "$ENV_FILE"
    fi
    
    if ! grep -q "ENCRYPTION_KEY=" "$ENV_FILE" || [ "$(grep "ENCRYPTION_KEY=" "$ENV_FILE" | cut -d'=' -f2)" = "" ]; then
        print_status "Generating encryption key..."
        ENCRYPTION_KEY=$(openssl rand -hex 32)
        sed -i "s/ENCRYPTION_KEY=.*/ENCRYPTION_KEY=$ENCRYPTION_KEY/" "$ENV_FILE"
    fi
    
    print_success "Security keys configured"
}

# Build and start services
deploy_services() {
    print_status "Building and starting services..."
    
    # Pull latest images
    docker-compose -f "$COMPOSE_FILE" pull
    
    # Build custom images
    docker-compose -f "$COMPOSE_FILE" build --no-cache
    
    # Start services
    docker-compose -f "$COMPOSE_FILE" up -d
    
    print_success "Services started successfully"
}

# Wait for services to be healthy
wait_for_services() {
    print_status "Waiting for services to be healthy..."
    
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        print_status "Health check attempt $attempt/$max_attempts"
        
        # Check backend health
        if curl -sf http://localhost:3001/health > /dev/null 2>&1; then
            print_success "Backend is healthy"
            break
        fi
        
        if [ $attempt -eq $max_attempts ]; then
            print_error "Services failed to start properly"
            docker-compose -f "$COMPOSE_FILE" logs
            exit 1
        fi
        
        sleep 10
        ((attempt++))
    done
}

# Show deployment status
show_status() {
    print_status "Deployment Status:"
    echo "=================="
    docker-compose -f "$COMPOSE_FILE" ps
    echo ""
    
    print_status "Application URLs:"
    echo "Frontend: http://localhost:3000"
    echo "Backend API: http://localhost:3001"
    echo "API Docs: http://localhost:3001/api"
    echo "Health Check: http://localhost:3001/health"
    echo "pgAdmin: http://localhost:8080 (if enabled)"
    echo ""
    
    print_status "Useful Commands:"
    echo "View logs: docker-compose -f $COMPOSE_FILE logs -f"
    echo "Stop services: docker-compose -f $COMPOSE_FILE down"
    echo "Restart: docker-compose -f $COMPOSE_FILE restart"
    echo "Scale frontend: docker-compose -f $COMPOSE_FILE up -d --scale frontend=3"
}

# Cleanup function
cleanup() {
    print_status "Stopping services..."
    docker-compose -f "$COMPOSE_FILE" down
    print_success "Services stopped"
}

# Main deployment process
main() {
    case "${1:-deploy}" in
        "deploy"|"start")
            check_docker
            check_env
            generate_secrets
            deploy_services
            wait_for_services
            show_status
            print_success "🎉 BHN Application deployed successfully!"
            ;;
        "stop")
            cleanup
            ;;
        "restart")
            cleanup
            sleep 5
            deploy_services
            wait_for_services
            show_status
            ;;
        "logs")
            docker-compose -f "$COMPOSE_FILE" logs -f
            ;;
        "status")
            show_status
            ;;
        *)
            echo "Usage: $0 {deploy|start|stop|restart|logs|status}"
            echo ""
            echo "Commands:"
            echo "  deploy/start - Deploy the complete application"
            echo "  stop         - Stop all services"
            echo "  restart      - Restart all services"
            echo "  logs         - View application logs"
            echo "  status       - Show current status"
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"
