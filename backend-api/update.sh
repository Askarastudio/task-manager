#!/bin/bash

# Script untuk update/redeploy backend yang sudah berjalan
# Jalankan di VPS setiap kali ada update code

set -e

echo "🔄 IkuHub Proyeksi - Backend Update Script"
echo "=========================================="
echo ""

# Warna untuk output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Check if running in backend-api directory
if [ ! -f "server.js" ]; then
    print_error "Script harus dijalankan di folder backend-api!"
    exit 1
fi

# Pull latest code from git
echo "📥 Pulling latest code from git..."
if [ -d ".git" ]; then
    git pull origin main
    print_success "Code updated"
else
    print_warning "Bukan git repository, skip git pull"
fi

# Install/update dependencies
echo ""
echo "📦 Updating dependencies..."
npm install --production
print_success "Dependencies updated"

# Run migrations (jika ada perubahan database)
echo ""
echo "🗄️  Running database migrations..."
npm run migrate
print_success "Database migrations completed"

# Restart PM2
echo ""
echo "🔄 Restarting application..."
pm2 restart ikuhub-api

if [ $? -eq 0 ]; then
    print_success "Application restarted successfully"
else
    print_error "Failed to restart application"
    exit 1
fi

# Show logs
echo ""
echo "📋 Recent logs:"
pm2 logs ikuhub-api --lines 20 --nostream

echo ""
echo "=========================================="
print_success "Update completed!"
echo ""
echo "Check logs: pm2 logs ikuhub-api"
echo "Check status: pm2 status"
echo "=========================================="
