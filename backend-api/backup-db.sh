#!/bin/bash

# Script untuk backup database MySQL
# Simpan di /root/backup-db.sh di VPS

# Konfigurasi
DB_USER="ikuhub_user"
DB_PASS="buatPasswordKuat123!"  # GANTI dengan password database Anda!
DB_NAME="ikuhub_proyeksi"
BACKUP_DIR="/root/db-backups"
DATE=$(date +%Y%m%d_%H%M%S)
KEEP_DAYS=7  # Simpan backup 7 hari terakhir

# Warna
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo "🗄️  IkuHub Proyeksi - Database Backup"
echo "======================================"
echo ""

# Buat folder backup jika belum ada
mkdir -p $BACKUP_DIR

# Backup database
echo "Backing up database: $DB_NAME"
mysqldump -u $DB_USER -p"$DB_PASS" $DB_NAME > $BACKUP_DIR/ikuhub_proyeksi_$DATE.sql

if [ $? -eq 0 ]; then
    # Compress backup
    gzip $BACKUP_DIR/ikuhub_proyeksi_$DATE.sql
    
    BACKUP_FILE="$BACKUP_DIR/ikuhub_proyeksi_$DATE.sql.gz"
    FILE_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    
    echo -e "${GREEN}✅ Backup berhasil!${NC}"
    echo "File: $BACKUP_FILE"
    echo "Size: $FILE_SIZE"
    
    # Hapus backup lama
    echo ""
    echo "Cleaning up old backups (older than $KEEP_DAYS days)..."
    find $BACKUP_DIR -name "ikuhub_proyeksi_*.sql.gz" -mtime +$KEEP_DAYS -delete
    
    # List semua backup
    echo ""
    echo "Available backups:"
    ls -lh $BACKUP_DIR/ikuhub_proyeksi_*.sql.gz 2>/dev/null || echo "No backups found"
    
else
    echo -e "${RED}❌ Backup gagal!${NC}"
    exit 1
fi

echo ""
echo "======================================"
