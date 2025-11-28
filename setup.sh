#!/bin/bash

# Oureon MVP Quick Setup Script

echo "🚀 Oureon MVP - Quick Setup"
echo "============================"
echo ""

# Check if we're in the right directory
if [ ! -d "server" ] || [ ! -d "client" ]; then
    echo "❌ Error: Please run this script from the oureon-mvp root directory"
    exit 1
fi

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Backend setup
echo -e "${BLUE}📦 Setting up Backend...${NC}"
cd server

if [ ! -f ".env" ]; then
    echo -e "${YELLOW}Creating .env file from .env.example...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✓ Created server/.env${NC}"
    echo -e "${YELLOW}⚠️  Please edit server/.env with your MongoDB URI and JWT secret${NC}"
else
    echo -e "${GREEN}✓ .env already exists${NC}"
fi

echo "Installing backend dependencies..."
npm install
echo -e "${GREEN}✓ Backend dependencies installed${NC}"
echo ""

# Frontend setup
cd ../client
echo -e "${BLUE}📦 Setting up Frontend...${NC}"

if [ ! -f ".env" ]; then
    echo -e "${YELLOW}Creating .env file from .env.example...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✓ Created client/.env${NC}"
else
    echo -e "${GREEN}✓ .env already exists${NC}"
fi

echo "Installing frontend dependencies..."
npm install
echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
echo ""

cd ..

# Summary
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Ensure MongoDB is running (local or Atlas)"
echo "2. Edit server/.env with your configuration"
echo "3. Start the backend:  cd server && npm run dev"
echo "4. Start the frontend: cd client && npm run dev"
echo ""
echo "📚 Read SETUP.md for detailed instructions"
echo ""
echo "Happy coding! 🎉"
