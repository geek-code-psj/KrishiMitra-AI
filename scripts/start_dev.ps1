# KrishiMitra AI - Local Development Startup Script

# Navigate to project root
$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path | Split-Path -Parent
Set-Location $ProjectRoot

Write-Host "🌾 Starting KrishiMitra AI Local Development Environment..." -ForegroundColor Green

Write-Host "Checking for .env file..."
if (-Not (Test-Path ".env")) {
    Write-Host "Creating .env from .env.example..."
    Copy-Item ".env.example" -Destination ".env"
}

Write-Host "Starting Docker services (Redis + API)..."
docker-compose up -d

Write-Host "✅ Environment is starting up." -ForegroundColor Green
Write-Host "API will be available at: http://localhost:8000"
Write-Host "API Docs will be available at: http://localhost:8000/docs"
Write-Host "To view logs, run: docker-compose logs -f api"
