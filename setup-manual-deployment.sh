#!/bin/bash

# Setup manual untuk GitHub Pages dan VPS deployment
# Karena git push mengalami auth issue, kita lakukan manual

echo "🎯 Manual Deployment Setup"
echo "=========================="
echo ""

# Step 1: Setup GitHub Secret
echo "📝 STEP 1: Setup GitHub Secret"
echo "------------------------------"
echo "1. Buka: https://github.com/Askarastudio/task-manager/settings/secrets/actions"
echo "2. Click 'New repository secret'"
echo "3. Name: VPS_PASSWORD"
echo "4. Secret: Rifqirachel@123"
echo "5. Click 'Add secret'"
echo ""
read -p "Press Enter setelah secret ditambahkan..."

# Step 2: Enable GitHub Pages
echo ""
echo "📝 STEP 2: Enable GitHub Pages"
echo "------------------------------"
echo "1. Buka: https://github.com/Askarastudio/task-manager/settings/pages"
echo "2. Source: pilih 'GitHub Actions'"
echo "3. Save"
echo ""
read -p "Press Enter setelah GitHub Pages enabled..."

# Step 3: Upload files manually
echo ""
echo "📝 STEP 3: Upload Workflow Files ke GitHub"
echo "------------------------------------------"
echo "Upload file-file ini ke GitHub repository:"
echo ""
echo "Via GitHub Web UI:"
echo "1. Buka: https://github.com/Askarastudio/task-manager"
echo "2. Navigate ke folder: .github/workflows/"
echo "3. Upload files:"
ls -1 .github/workflows/*.yml
echo ""
echo "Atau download bundle dan upload:"
echo ""

# Create bundle
BUNDLE_NAME="github-workflows-$(date +%Y%m%d-%H%M%S).zip"
zip -r "$BUNDLE_NAME" \
    .github/workflows/deploy.yml \
    .github/workflows/deploy-backend.yml \
    .github/workflows/deploy-fullstack.yml \
    DEPLOYMENT-AUTO.md \
    backend-api/routes/reports.js \
    src/components/pages/ReportsPage.tsx

echo "✅ Bundle created: $BUNDLE_NAME"
echo ""
echo "Upload bundle ke GitHub:"
echo "1. Extract bundle"
echo "2. Commit dan push semua files"
echo "   atau upload manual via GitHub web"
echo ""

read -p "Press Enter untuk lanjut ke deployment backend manual..."

# Step 4: Deploy Backend Manual
echo ""
echo "📝 STEP 4: Deploy Backend ke VPS (Manual)"
echo "------------------------------------------"
echo "Login ke VPS:"
echo ""
echo "ssh ikuhub-apiproyek@72.62.120.94"
echo "Password: Rifqirachel@123"
echo ""
echo "Kemudian jalankan command berikut di VPS:"
echo ""
cat << 'VPSCOMMANDS'
# Di VPS
cd /home/ikuhub-apiproyek/htdocs/apiproyek.ikuhub.com

# Backup current version
tar -czf backup-$(date +%Y%m%d-%H%M%S).tar.gz server.js routes/ middleware/ || true

# Download file reports.js baru
# (Upload manual via FTP/SFTP atau copy paste)
nano routes/reports.js
# Paste isi file dari: backend-api/routes/reports.js

# Update server.js
nano server.js
# Tambahkan line:
# const reportRoutes = require('./routes/reports');
# app.use('/reports', reportRoutes);

# Restart PM2
pm2 restart ikuhub-api || pm2 start server.js --name ikuhub-api
pm2 save

# Check status
pm2 list
pm2 logs ikuhub-api --lines 20
VPSCOMMANDS

echo ""
echo "✅ Setup Complete!"
echo ""
echo "📊 Setelah semua selesai:"
echo "   - Frontend: https://proyek.ikuhub.com (auto-deploy via GitHub Actions)"
echo "   - Backend: https://apiproyek.ikuhub.com (manual deploy pertama kali)"
echo "   - Selanjutnya: semua otomatis saat git push!"
echo ""
