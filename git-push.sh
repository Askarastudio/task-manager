#!/bin/bash

# Script untuk push ke GitHub
# Jalankan: ./git-push.sh "commit message"

set -e

echo "🚀 Git Push Helper"
echo "=================="
echo ""

# Check if message provided
if [ -z "$1" ]; then
    echo "❌ Error: Commit message required!"
    echo "Usage: ./git-push.sh \"your commit message\""
    exit 1
fi

COMMIT_MSG="$1"

echo "📝 Commit message: $COMMIT_MSG"
echo ""

# Add all changes
echo "📦 Adding files..."
git add .

# Commit
echo "💾 Committing..."
git commit -m "$COMMIT_MSG" || {
    echo "⚠️  No changes to commit or commit failed"
    echo "Checking status..."
    git status
    exit 0
}

# Push
echo "🚀 Pushing to GitHub..."
echo ""
echo "⚠️  Note: Jika authentication gagal, Anda perlu:"
echo "   1. Buat Personal Access Token di GitHub"
echo "   2. Atau gunakan GitHub CLI: gh auth login"
echo ""

git push origin main || {
    echo ""
    echo "❌ Push gagal! Silakan coba salah satu cara berikut:"
    echo ""
    echo "1️⃣  Menggunakan GitHub CLI (Recommended):"
    echo "   gh auth login"
    echo "   git push origin main"
    echo ""
    echo "2️⃣  Menggunakan Personal Access Token:"
    echo "   - Buka: https://github.com/settings/tokens"
    echo "   - Generate new token (classic)"
    echo "   - Pilih scope: repo"
    echo "   - Copy token"
    echo "   - Set remote: git remote set-url origin https://TOKEN@github.com/Askarastudio/task-manager.git"
    echo ""
    exit 1
}

echo ""
echo "✅ Push berhasil!"
echo ""
echo "🔄 GitHub Actions akan otomatis:"
echo "   - Build frontend"
echo "   - Deploy ke GitHub Pages (proyek.ikuhub.com)"
echo "   - Deploy backend ke VPS (apiproyek.ikuhub.com)"
echo "   - Restart PM2"
echo ""
echo "📊 Monitor di: https://github.com/Askarastudio/task-manager/actions"
echo ""
