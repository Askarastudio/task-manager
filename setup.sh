#!/bin/bash

echo "🚀 IkuHub Proyeksi - Quick Setup Script"
echo "========================================"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file for DEMO mode..."
    echo "VITE_APP_MODE=demo" > .env
    echo "VITE_API_BASE_URL=" >> .env
    echo "✅ .env created (Demo mode - data in browser only)"
    echo ""
    echo "ℹ️  To enable production mode with database:"
    echo "   1. Setup backend API (see backend-api/README.md)"
    echo "   2. Update .env with your API URL:"
    echo "      VITE_API_BASE_URL=https://api.proyek.ikuhub.com"
    echo "      VITE_APP_MODE=production"
    echo ""
else
    echo "✅ .env file already exists"
    cat .env
    echo ""
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
    echo ""
else
    echo "✅ Dependencies already installed"
    echo ""
fi

echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Run: npm run dev"
echo "  2. Open: http://localhost:5173"
echo "  3. Login with: any email + password 'Ikuhub@2025'"
echo ""
echo "📚 Documentation:"
echo "  - PRODUCTION_SETUP.md - API & Database setup"
echo "  - DEPLOYMENT.md - Production deployment guide"
echo "  - backend-api/README.md - Backend server setup"
echo ""
