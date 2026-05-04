import mysql from "mysql2/promise";

async function setupDatabase() {
  try {
    console.log("Menghubungkan ke server MySQL...");
    // Connect without specifying a database to create it first
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "Irsyad123@",
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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await connection.query(createTableQuery);

    console.log("Setup Database berhasil! Tabel 'users' siap digunakan.");
    
    await connection.end();
  } catch (error) {
    console.error("Terjadi kesalahan saat setup database:", error);
  }
}

setupDatabase();
