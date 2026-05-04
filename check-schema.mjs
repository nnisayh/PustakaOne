import mysql from "mysql2/promise";

async function checkSchema() {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "Irsyad123@",
      database: "telkom_access"
    });

    const [rows] = await connection.query("DESCRIBE users");
    console.log("Struktur tabel users:");
    console.log(rows);
    
    await connection.end();
  } catch (error) {
    console.error("Terjadi kesalahan:", error);
  }
}

checkSchema();
