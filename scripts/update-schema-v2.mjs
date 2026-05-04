import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

async function updateSchema() {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "Irsyad123@",
      database: "telkom_access"
    });

    console.log("Menambahkan kolom 'role' ke tabel 'users'...");
    try {
      await connection.query("ALTER TABLE users ADD COLUMN role ENUM('user', 'admin') DEFAULT 'user' AFTER email");
      console.log("Kolom 'role' berhasil ditambahkan.");
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') {
        console.log("Kolom 'role' sudah ada.");
      } else {
        throw e;
      }
    }

    console.log("Membuat akun admin default...");
    const adminEmail = "admin@pustakaone.id";
    const [rows] = await connection.query("SELECT * FROM users WHERE email = ?", [adminEmail]);

    if (rows.length === 0) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await connection.query(
        "INSERT INTO users (name, email, password, role, nim) VALUES (?, ?, ?, ?, ?)",
        ["System Administrator", adminEmail, hashedPassword, "admin", "00000000"]
      );
      console.log("Akun admin default berhasil dibuat:");
      console.log("Email: admin@pustakaone.id");
      console.log("Password: admin123");
    } else {
      console.log("Akun admin sudah ada.");
    }
    
    await connection.end();
  } catch (error) {
    console.error("Terjadi kesalahan:", error);
  }
}

updateSchema();
