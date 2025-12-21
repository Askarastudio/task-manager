const mysql = require('mysql2/promise');
require('dotenv').config();

const migrations = [
  `CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at BIGINT NOT NULL,
    INDEX idx_email (email),
    INDEX idx_created_at (created_at)
  )`,
  
  `CREATE TABLE IF NOT EXISTS projects (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    customer VARCHAR(255) NOT NULL,
    value DECIMAL(15, 2) NOT NULL,
    description TEXT,
    created_at BIGINT NOT NULL,
    INDEX idx_created_at (created_at)
  )`,
  
  `CREATE TABLE IF NOT EXISTS tasks (
    id VARCHAR(255) PRIMARY KEY,
    project_id VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    assigned_user_ids JSON,
    completed BOOLEAN DEFAULT FALSE,
    created_at BIGINT NOT NULL,
    INDEX idx_project (project_id),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
  )`,
  
  `CREATE TABLE IF NOT EXISTS expenses (
    id VARCHAR(255) PRIMARY KEY,
    project_id VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    category ENUM('petty-cash', 'operational', 'material', 'labor', 'other') NOT NULL,
    date BIGINT NOT NULL,
    created_at BIGINT NOT NULL,
    INDEX idx_project (project_id),
    INDEX idx_date (date),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
  )`,
  
  `CREATE TABLE IF NOT EXISTS company_settings (
    id INT PRIMARY KEY DEFAULT 1,
    name VARCHAR(255) NOT NULL,
    logo TEXT,
    address TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    letterhead TEXT
  )`
];

async function runMigrations() {
  let connection;
  try {
    connection = await mysql.createConnection(process.env.DATABASE_URL);
    
    console.log('🔄 Running database migrations...');
    
    for (let i = 0; i < migrations.length; i++) {
      console.log(`📝 Running migration ${i + 1}/${migrations.length}...`);
      await connection.query(migrations[i]);
    }
    
    console.log('✅ All migrations completed successfully!');
    
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash('Ikuhub@2025', 10);
    
    await connection.query(`
      INSERT IGNORE INTO users (id, name, email, role, password, created_at) 
      VALUES ('admin-default', 'Administrator', 'admin@ikuhub.com', 'Admin', ?, ?)
    `, [hashedPassword, Date.now()]);
    
    console.log('👤 Default admin user created (email: admin@ikuhub.com, password: Ikuhub@2025)');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

runMigrations();
