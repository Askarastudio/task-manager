#!/bin/bash

# Script untuk restore database MySQL dari backup
# Jalankan di VPS

# Konfigurasi
DB_USER="ikuhub_user"
DB_PASS="buatPasswordKuat123!"  # GANTI dengan password database Anda!
DB_NAME="ikuhub_proyeksi"
BACKUP_DIR="/root/db-backups"

# Warna
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "♻️  IkuHub Proyeksi - Database Restore"
echo "======================================"
echo ""

# List available backups
echo "Available backups:"
echo ""
ls -lht $BACKUP_DIR/ikuhub_proyeksi_*.sql.gz 2>/dev/null | head -10

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ No backup files found in $BACKUP_DIR${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}⚠️  WARNING: This will REPLACE all data in database '$DB_NAME'${NC}"
echo ""
read -p "Enter backup filename to restore (e.g., ikuhub_proyeksi_20231221_120000.sql.gz): " BACKUP_FILE

if [ ! -f "$BACKUP_DIR/$BACKUP_FILE" ]; then
    echo -e "${RED}❌ File not found: $BACKUP_DIR/$BACKUP_FILE${NC}"
    exit 1
fi

echo ""
read -p "Are you sure you want to restore from $BACKUP_FILE? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "Restore cancelled"
    exit 0
fi

echo ""
echo "Stopping backend API..."
pm2 stop ikuhub-api 2>/dev/null || echo "Backend not running"

echo ""
echo "Restoring database..."

# Decompress and restore
gunzip -c $BACKUP_DIR/$BACKUP_FILE | mysql -u $DB_USER -p"$DB_PASS" $DB_NAME

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Database restored successfully!${NC}"
    
    echo ""
    echo "Restarting backend API..."
    pm2 restart ikuhub-api
    
    echo ""
    echo -e "${GREEN}✅ Restore completed!${NC}"
else
    echo -e "${RED}❌ Restore failed!${NC}"
    echo ""
    echo "Starting backend API..."
    pm2 start ikuhub-api
    exit 1
fi

echo ""
echo "======================================"
