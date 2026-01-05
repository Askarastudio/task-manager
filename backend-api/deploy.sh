#!/bin/bash

# Script untuk deploy backend ke CloudPanel VPS
# Jalankan di VPS setelah code di-upload

set -e

echo "🚀 IkuHub Proyeksi - Backend Deployment Script"
echo "=============================================="
echo ""

# Warna untuk output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fungsi helper
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
    echo "cd ke folder backend-api terlebih dahulu"
    exit 1
fi

print_success "Direktori backend-api ditemukan"

# Check if .env exists
if [ ! -f ".env" ]; then
    print_warning "File .env tidak ditemukan!"
    echo ""
    echo "Membuat .env dari .env.example..."
    
    if [ -f ".env.example" ]; then
        cp .env.example .env
        print_warning "File .env dibuat! WAJIB edit file .env dengan konfigurasi yang benar!"
        echo ""
        echo "Edit dengan command: nano .env"
        echo ""
        read -p "Tekan Enter setelah Anda edit file .env..."
    else
        print_error ".env.example tidak ditemukan!"
        exit 1
    fi
fi

print_success "File .env ditemukan"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install --production

if [ $? -eq 0 ]; then
    print_success "Dependencies terinstall"
else
    print_error "Gagal install dependencies"
    exit 1
fi

# Run migrations
echo ""
echo "🗄️  Running database migrations..."
npm run migrate

if [ $? -eq 0 ]; then
    print_success "Database migrations berhasil"
else
    print_error "Database migrations gagal!"
    echo ""
    echo "Troubleshooting:"
    echo "1. Pastikan MySQL sudah running: systemctl status mysql"
    echo "2. Pastikan DATABASE_URL di .env sudah benar"
    echo "3. Pastikan database user punya akses ke database"
    exit 1
fi

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    print_warning "PM2 tidak ditemukan, menginstall PM2..."
    npm install -g pm2
    print_success "PM2 terinstall"
fi

# Stop existing PM2 process if running
if pm2 list | grep -q "ikuhub-api"; then
    echo ""
    echo "🔄 Stopping existing PM2 process..."
    pm2 stop ikuhub-api
    pm2 delete ikuhub-api
    print_success "Existing process dihentikan"
fi

# Start with PM2
echo ""
echo "▶️  Starting application with PM2..."
pm2 start server.js --name ikuhub-api

if [ $? -eq 0 ]; then
    print_success "Aplikasi berhasil dijalankan dengan PM2"
else
    print_error "Gagal menjalankan aplikasi"
    exit 1
fi

# Save PM2 configuration
pm2 save

# Setup PM2 startup (jika belum)
echo ""
echo "🔧 Setting up PM2 startup script..."
pm2 startup systemd -u $USER --hp $HOME > /tmp/pm2-startup.sh
chmod +x /tmp/pm2-startup.sh
/tmp/pm2-startup.sh
print_success "PM2 startup configured"

# Show status
echo ""
echo "📊 PM2 Status:"
pm2 list

echo ""
echo "=============================================="
print_success "Deployment selesai!"
echo ""
echo "Aplikasi berjalan di: http://localhost:3000"
echo ""
echo "Commands berguna:"
echo "  pm2 status              - Lihat status aplikasi"
echo "  pm2 logs ikuhub-api     - Lihat logs"
echo "  pm2 restart ikuhub-api  - Restart aplikasi"
echo "  pm2 stop ikuhub-api     - Stop aplikasi"
echo "  pm2 monit               - Monitoring real-time"
echo ""
echo "Jangan lupa setup Nginx reverse proxy dan SSL certificate!"
echo "Lihat DEPLOY_CLOUDPANEL.md untuk panduan lengkap"
echo "=============================================="
