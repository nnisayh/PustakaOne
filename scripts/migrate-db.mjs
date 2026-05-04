import mysql from "mysql2/promise";

async function migrate() {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Irsyad123@",
    database: "telkom_access"
  });

  try {
    console.log("Checking for faculty column...");
    const [columns] = await connection.query("SHOW COLUMNS FROM users LIKE 'faculty'");
    
    if (columns.length === 0) {
      console.log("Adding faculty column...");
      await connection.query("ALTER TABLE users ADD COLUMN faculty VARCHAR(100) DEFAULT NULL");
      
      // Update existing users based on heuristic
      console.log("Migrating existing data...");
      await connection.query("UPDATE users SET faculty = 'FIF' WHERE nim LIKE '1301%'");
      await connection.query("UPDATE users SET faculty = 'Undip' WHERE email LIKE '%undip%'");
      
      console.log("Migration complete.");
    } else {
      console.log("Column already exists.");
    }
  } catch (error) {
    console.error("Migration error:", error);
  }

  await connection.end();
}

migrate();
