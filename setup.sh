#!/bin/bash

# Heal-Io Setup Script
# This script automates the setup of all services

set -e

echo "🏥 Welcome to Heal-Io Setup"
echo "============================"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker and Docker Compose found"
echo ""

# Create .env files from examples
echo "📝 Creating environment files..."

if [ ! -f "frontend/.env" ]; then
    if [ -f "frontend/.env.example" ]; then
        cp frontend/.env.example frontend/.env
        echo "✅ Frontend .env created"
    else
        echo "⚠️  Warning: frontend/.env.example not found, creating minimal .env"
        echo "REACT_APP_API_URL=http://localhost:8080/api/v1" > frontend/.env
    fi
fi

if [ ! -f "backend-api/.env" ]; then
    if [ -f "backend-api/.env.example" ]; then
        cp backend-api/.env.example backend-api/.env
        echo "✅ Backend API .env created"
    else
        echo "⚠️  Warning: backend-api/.env.example not found, skipping"
    fi
fi

if [ ! -f "ai-service/.env" ]; then
    if [ -f "ai-service/.env.example" ]; then
        cp ai-service/.env.example ai-service/.env
        echo "✅ AI Service .env created"
    else
        echo "⚠️  Warning: ai-service/.env.example not found, creating minimal .env"
        echo "DEBUG=True" > ai-service/.env
    fi
fi

echo ""
echo "🐳 Building Docker containers..."
docker-compose build

echo ""
echo "🚀 Starting services..."
docker-compose up -d

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 10

echo ""
echo "🔧 Running database migrations..."
docker-compose exec -T api php artisan migrate --force 2>/dev/null || echo "Note: Migrations will run when backend is fully set up"

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Service URLs:"
echo "   Frontend:  http://localhost:3000"
echo "   API:       http://localhost:8080"
echo "   AI Service: http://localhost:8000"
echo "   Nginx:     http://localhost"
echo ""
echo "📖 To view logs: docker-compose logs -f"
echo "🛑 To stop: docker-compose down"
echo "🔄 To restart: docker-compose restart"
echo ""
echo "🏥 Heal-Io is ready for academic demonstration!"
