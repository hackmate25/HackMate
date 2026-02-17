#!/bin/bash

# Production build and deployment script for HackMate

set -e

echo "🚀 Starting production build..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if .env exists
if [ ! -f "backend/.env" ]; then
    echo -e "${RED}❌ backend/.env file not found!${NC}"
    echo "Copy backend/.env.example to backend/.env and update values"
    exit 1
fi

if [ ! -f "Frontend/.env.production" ]; then
    echo -e "${RED}❌ Frontend/.env.production file not found!${NC}"
    echo "Copy Frontend/.env.example to Frontend/.env.production and update values"
    exit 1
fi

echo -e "${GREEN}✅ Environment files found${NC}"

# Backend build
echo -e "${YELLOW}📦 Building backend...${NC}"
cd backend
npm install --production
cd ..
echo -e "${GREEN}✅ Backend dependencies installed${NC}"

# Frontend build
echo -e "${YELLOW}📦 Building frontend...${NC}"
cd Frontend
npm install
npm run build:prod
cd ..
echo -e "${GREEN}✅ Frontend built successfully${NC}"

# Docker build (optional)
if command -v docker &> /dev/null; then
    echo -e "${YELLOW}🐳 Building Docker images...${NC}"
    docker-compose build
    echo -e "${GREEN}✅ Docker images built${NC}"
else
    echo -e "${YELLOW}⚠️  Docker not found, skipping Docker build${NC}"
fi

echo ""
echo -e "${GREEN}✅ Production build completed successfully!${NC}"
echo ""
echo "Next steps:"
echo "1. Backend: npm run prod"
echo "2. Frontend: npm run preview (for local testing)"
echo "3. Docker: docker-compose up -d"
