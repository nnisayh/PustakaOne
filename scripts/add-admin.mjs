import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

async function addAdmin() {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Irsyad123@",
    database: "telkom_access"
  });

  const name = "Official Admin";
  const nim = "ADMIN-001";
  const email = "admin@pustakaone.id";
  const rawPassword = "Admin123!";
  
  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  try {
    const [result] = await connection.query(
      "INSERT INTO users (nama, nim, email, password, role) VALUES (?, ?, ?, ?, ?)",
      [name, nim, email, hashedPassword, "admin"]
    );
    console.log("Admin added successfully with ID:", result.insertId);
    console.log("Email:", email);
    console.log("Password:", rawPassword);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      console.log("Admin already exists, updating password instead...");
      await connection.query(
        "UPDATE users SET password = ?, role = 'admin' WHERE email = ?",
        [hashedPassword, email]
      );
      console.log("Admin updated successfully.");
    } else {
      console.error("Error adding admin:", error);
    }
  }

  await connection.end();
}

addAdmin();
