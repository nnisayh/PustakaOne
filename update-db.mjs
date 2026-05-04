import mysql from "mysql2/promise";

async function updateDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "Irsyad123@",
      database: "telkom_access"
    });

    console.log("Menambahkan kolom 'nim' ke tabel 'users'...");
    // Gunakan try catch agar kalau kolom sudah ada tidak error (ALTER TABLE tidak ada "IF NOT EXISTS" di beberapa versi MySQL lama)
    try {
      await connection.query("ALTER TABLE users ADD COLUMN nim VARCHAR(20) NOT NULL AFTER name");
      console.log("Kolom 'nim' berhasil ditambahkan.");
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') {
        console.log("Kolom 'nim' sudah ada, lanjut.");
      } else {
        throw e;
      }
    }
    
    await connection.end();
  } catch (error) {
    console.error("Terjadi kesalahan:", error);
  }
}

updateDatabase();
