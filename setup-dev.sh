#!/bin/bash

# Development build script

set -e

echo "🚀 Starting development setup..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Backend setup
echo -e "${YELLOW}📦 Setting up backend...${NC}"
cd backend
npm install
cd ..
echo -e "${GREEN}✅ Backend ready${NC}"

# Frontend setup
echo -e "${YELLOW}📦 Setting up frontend...${NC}"
cd Frontend
npm install
cd ..
echo -e "${GREEN}✅ Frontend ready${NC}"

echo ""
echo -e "${GREEN}✅ Development environment setup completed!${NC}"
echo ""
echo "To start developing:"
echo "1. Terminal 1 - Backend: cd backend && npm run dev"
echo "2. Terminal 2 - Frontend: cd Frontend && npm run dev"
