import mysql from "mysql2/promise";
import "dotenv/config";

async function setupDatabase() {
  try {
    console.log("Menghubungkan ke server MySQL...");
    // Connect using environment variables or fallbacks
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "pustaka_admin",
      password: process.env.DB_PASSWORD || "PasswordPustaka123!",
    });

    console.log("Berhasil terhubung ke MySQL.");

    console.log("Membuat database 'telkom_access' jika belum ada...");
    await connection.query("CREATE DATABASE IF NOT EXISTS telkom_access");
    
    console.log("Beralih ke database 'telkom_access'...");
    await connection.query("USE telkom_access");

    console.log("Membuat tabel 'users' jika belum ada...");
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await connection.query(createTableQuery);

    console.log("Memastikan kolom 'role' ada di tabel 'users'...");
    try {
      await connection.query("ALTER TABLE users ADD COLUMN role VARCHAR(50) DEFAULT 'user'");
      console.log("Kolom 'role' berhasil ditambahkan.");
    } catch (e: any) {
      // Ignore error if column already exists (Error code 1060: Duplicate column name)
      if (e.code !== 'ER_DUP_FIELDNAME') {
        console.error("Gagal menambahkan kolom role:", e);
      } else {
        console.log("Kolom 'role' sudah ada.");
      }
    }

    console.log("Setup Database berhasil! Tabel 'users' siap digunakan.");
    
    await connection.end();
  } catch (error) {
    console.error("Terjadi kesalahan saat setup database:", error);
  }
}

setupDatabase();
