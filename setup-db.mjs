import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

async function setupDatabase() {
  try {
    console.log("🔌 Menghubungkan ke server MySQL...");
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "Irsyad123@",
    });

    console.log("✅ Berhasil terhubung ke MySQL.");

    // ── Step 1: Create Database ──
    console.log("\n📦 Membuat database 'telkom_access'...");
    await connection.query("CREATE DATABASE IF NOT EXISTS telkom_access");
    await connection.query("USE telkom_access");
    console.log("✅ Database 'telkom_access' siap.");

    // ── Step 2: Create Users Table ──
    console.log("\n📋 Membuat tabel 'users'...");
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nama VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        nim VARCHAR(50) DEFAULT NULL,
        role VARCHAR(50) DEFAULT 'Mahasiswa S1',
        faculty VARCHAR(20) DEFAULT NULL,
        status ENUM('Active', 'Inactive', 'Blocked') DEFAULT 'Active',
        password VARCHAR(255) NOT NULL,
        last_access TIMESTAMP NULL DEFAULT NULL,
        expiry_date DATE DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;
    await connection.query(createUsersTable);
    console.log("✅ Tabel 'users' siap.");

    // ── Step 3: Insert Sample Data ──
    console.log("\n👥 Mengisi sample data...");
    
    const hashedPassword = await bcrypt.hash("password123", 10);

    const sampleUsers = [
      ["Budi Santoso", "budi@student.telkomuniversity.ac.id", "1301204123", "Mahasiswa S1", "FIF", "Active"],
      ["Dr. Hendra Wijaya", "hendra@telkomuniversity.ac.id", "NIP198012", "Dosen", "FIF", "Active"],
      ["Anita Putri", "anita@student.telkomuniversity.ac.id", "1301205456", "Mahasiswa S2", "FEB", "Active"],
      ["Rina Marlina", "rina@student.telkomuniversity.ac.id", "1301203789", "Mahasiswa S1", "FKB", "Inactive"],
      ["Ahmad Kurniawan", "ahmad@student.telkomuniversity.ac.id", "1301206012", "Mahasiswa S1", "FTE", "Active"],
      ["Dr. Siti Aminah", "siti@telkomuniversity.ac.id", "NIP199205", "Dosen", "FEB", "Active"],
      ["Dian Permata", "dian@student.telkomuniversity.ac.id", "1301207345", "Mahasiswa S1", "FRI", "Active"],
      ["Reza Mahardika", "reza@student.telkomuniversity.ac.id", "1301208678", "Mahasiswa S1", "FIF", "Active"],
      ["Prof. Bambang S.", "bambang@telkomuniversity.ac.id", "NIP198507", "Dosen", "FTE", "Active"],
      ["Lina Fitriani", "lina@telkomuniversity.ac.id", "NIP199811", "Staff", "FIF", "Active"],
      ["Admin Library", "admin@telkomuniversity.ac.id", "ADM001", "Institute Admin", "FIF", "Active"],
      ["Fauzan Subadmin", "fauzan@telkomuniversity.ac.id", "ADM002", "Institute Subadmin", "FTE", "Active"],
    ];

    let insertCount = 0;
    for (const [nama, email, nim, role, faculty, status] of sampleUsers) {
      try {
        await connection.query(
          "INSERT INTO users (nama, email, nim, role, faculty, status, password) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [nama, email, nim, role, faculty, status, hashedPassword]
        );
        insertCount++;
      } catch (e) {
        if (e.code === "ER_DUP_ENTRY") {
          console.log(`   ⏭️  ${email} sudah ada, skip.`);
        } else {
          throw e;
        }
      }
    }
    console.log(`✅ ${insertCount} sample users berhasil ditambahkan.`);

    // ── Step 4: Insert Developer Admin ──
    console.log("\n🔑 Membuat developer admin account...");
    const adminPassword = await bcrypt.hash("admin123", 10);
    try {
      await connection.query(
        "INSERT INTO users (nama, email, nim, role, status, password) VALUES (?, ?, ?, ?, ?, ?)",
        ["Developer Admin", "admin@pustakaone.id", "DEV001", "admin", "Active", adminPassword]
      );
      console.log("✅ Developer admin created (admin@pustakaone.id / admin123)");
    } catch (e) {
      if (e.code === "ER_DUP_ENTRY") {
        console.log("   ⏭️  Developer admin sudah ada.");
      } else {
        throw e;
      }
    }

    // ── Step 5: Verify ──
    console.log("\n📊 Verifikasi...");
    const [rows] = await connection.query("SELECT COUNT(*) as total FROM users");
    console.log(`   Total users di database: ${rows[0].total}`);
    
    const [schema] = await connection.query("DESCRIBE users");
    console.log("\n   Struktur tabel 'users':");
    schema.forEach(col => {
      console.log(`   ├─ ${col.Field.padEnd(15)} ${col.Type.padEnd(25)} ${col.Null === 'YES' ? 'nullable' : 'NOT NULL'}${col.Key === 'PRI' ? ' (PK)' : col.Key === 'UNI' ? ' (UNIQUE)' : ''}`);
    });

    console.log("\n🎉 Setup database selesai! Siap digunakan.\n");
    
    await connection.end();
  } catch (error) {
    console.error("\n❌ Terjadi kesalahan:", error.message);
    
    if (error.code === "ECONNREFUSED") {
      console.error("\n💡 Pastikan MySQL server sudah running!");
      console.error("   - Buka XAMPP → Start MySQL");
      console.error("   - Atau: Buka MySQL Workbench → pastikan koneksi aktif");
    }
    
    if (error.code === "ER_ACCESS_DENIED_ERROR") {
      console.error("\n💡 Password MySQL salah!");
      console.error("   - Edit file ini dan ganti password di line 9");
      console.error("   - Password saat ini: 'Irsyad123@'");
    }
  }
}

setupDatabase();
