#!/bin/bash

# PhysVerse Deployment Script
echo "🚀 Starting PhysVerse deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in the right directory
if [ ! -d "PhySSS" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Frontend deployment
echo -e "\n${YELLOW}📦 Building Frontend...${NC}"
cd PhySSS/frontend

# Install dependencies
print_status "Installing frontend dependencies..."
npm install

# Build the project
print_status "Building frontend for production..."
npm run build

if [ $? -eq 0 ]; then
    print_status "Frontend build completed successfully!"
else
    print_error "Frontend build failed!"
    exit 1
fi

# Deploy to Netlify (if CLI is available)
if command -v netlify &> /dev/null; then
    print_status "Deploying to Netlify..."
    netlify deploy --prod --dir=dist
    if [ $? -eq 0 ]; then
        print_status "Frontend deployed to Netlify successfully!"
    else
        print_warning "Netlify deployment failed. Please deploy manually."
    fi
else
    print_warning "Netlify CLI not found. Please install it or deploy manually."
    echo "Run: npm install -g netlify-cli"
fi

# Backend preparation
echo -e "\n${YELLOW}🔧 Preparing Backend...${NC}"
cd ../backend

# Install dependencies
print_status "Installing backend dependencies..."
npm install

# Build the project
print_status "Building backend for production..."
npm run build

if [ $? -eq 0 ]; then
    print_status "Backend build completed successfully!"
else
    print_error "Backend build failed!"
    exit 1
fi

# Check if all required files exist
if [ ! -f "render.yaml" ]; then
    print_warning "render.yaml not found. Creating it..."
    cat > render.yaml << EOF
services:
  - type: web
    name: physverse-backend
    env: node
    buildCommand: npm install && npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
    healthCheckPath: /api/health
    autoDeploy: false
EOF
    print_status "render.yaml created!"
fi

echo -e "\n${GREEN}🎉 Deployment preparation completed!${NC}"
echo -e "\n${YELLOW}Next steps:${NC}"
echo "1. Push your code to GitHub"
echo "2. Connect your GitHub repo to Render for backend deployment"
echo "3. Set up environment variables on Render:"
echo "   - NODE_ENV=production"
echo "   - JWT_SECRET=your-secret-key"
echo "   - MONGODB_URI=your-mongodb-connection"
echo "   - FRONTEND_URL=your-netlify-url"
echo "4. Update frontend .env.production with your Render backend URL"
echo -e "\n${GREEN}📖 See DEPLOYMENT_GUIDE.md for detailed instructions${NC}"