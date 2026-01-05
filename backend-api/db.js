const mysql = require('mysql2/promise');

// Parse DATABASE_URL untuk CloudPanel/MySQL
const parseDbUrl = (url) => {
  if (!url) {
    console.error('❌ DATABASE_URL is not set!');
    return null;
  }
  
  // Format: mysql://user:pass@host:port/database
  const match = url.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
  if (match) {
    return {
      host: match[3],
      user: match[1],
      password: match[2],
      port: parseInt(match[4]),
      database: match[5]
    };
  }
  return null;
};

const dbConfig = parseDbUrl(process.env.DATABASE_URL);

if (!dbConfig) {
  console.error('❌ DATABASE_URL format salah!');
  console.error('Format yang benar: mysql://user:password@host:port/database');
  console.error('Contoh: mysql://ikuhub_user:password@localhost:3306/ikuhub_proyeksi');
  process.exit(1);
}

const pool = mysql.createPool({
  host: dbConfig.host,
  user: dbConfig.user,
  password: dbConfig.password,
  port: dbConfig.port,
  database: dbConfig.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Test connection on startup
pool.getConnection()
  .then(connection => {
    console.log('✅ Database connected successfully');
    console.log(`📊 Database: ${dbConfig.database}`);
    console.log(`🔗 Host: ${dbConfig.host}:${dbConfig.port}`);
    connection.release();
  })
  .catch(err => {
    console.error('❌ Database connection failed:');
    console.error(err.message);
    console.error('\nTroubleshooting:');
    console.error('1. Pastikan MySQL service berjalan: systemctl status mysql');
    console.error('2. Check DATABASE_URL di file .env');
    console.error('3. Pastikan user database punya akses ke database');
    console.error('4. Test koneksi: mysql -u ' + dbConfig.user + ' -p ' + dbConfig.database);
    process.exit(1);
  });

module.exports = pool;
