#!/bin/bash
# KrishiMitra AI - Local Development Startup Script

# Navigate to project root
cd "$(dirname "$0")/.."

echo "🌾 Starting KrishiMitra AI Local Development Environment..."

echo "Checking for .env file..."
if [ ! -f .env ]; then
    echo "Creating .env from .env.example..."
    cp .env.example .env
fi

echo "Starting Docker services (Redis + API)..."
docker-compose up -d

echo "✅ Environment is starting up."
echo "API will be available at: http://localhost:8000"
echo "API Docs will be available at: http://localhost:8000/docs"
echo "To view logs, run: docker-compose logs -f api"
