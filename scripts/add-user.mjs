import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

async function addUser() {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Irsyad123@",
    database: "telkom_access"
  });

  const name = "Muhammad Irsyad";
  const nim = "21060124000123";
  const email = "irsyad@student.undip.ac.id";
  const rawPassword = "Irsyad123@";
  
  // We MUST hash the password because the login API uses bcrypt.compare
  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  try {
    const [result] = await connection.query(
      "INSERT INTO users (nama, nim, email, password, role) VALUES (?, ?, ?, ?, ?)",
      [name, nim, email, hashedPassword, "user"]
    );
    console.log("User added successfully with ID:", result.insertId);
    console.log("Email:", email);
    console.log("Password:", rawPassword);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      console.log("User already exists, updating password instead...");
      await connection.query(
        "UPDATE users SET password = ?, nama = ?, nim = ? WHERE email = ?",
        [hashedPassword, name, nim, email]
      );
      console.log("User updated successfully.");
    } else {
      console.error("Error adding user:", error);
    }
  }

  await connection.end();
}

addUser();
