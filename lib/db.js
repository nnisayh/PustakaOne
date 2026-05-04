import mysql from "mysql2/promise"

export const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "Irsyad123@",
  database: process.env.DB_NAME || "telkom_access",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})