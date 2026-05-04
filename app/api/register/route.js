import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { nama, nim, email, password } = await req.json();

    // Pastikan semua data terisi
    if (!nama || !nim || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Semua kolom wajib diisi" },
        { status: 400 }
      );
    }

    // Cek apakah user sudah terdaftar
    const [existingUsers] = await db.query(
      "SELECT id FROM users WHERE email = ? OR nim = ?",
      [email, nim]
    );

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { success: false, message: "Email atau NIM sudah terdaftar" },
        { status: 409 }
      );
    }

    // Melakukan proses enkripsi pada password baru
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Menyimpan data ke tabel users. 
    await db.query(
      "INSERT INTO users (nama, nim, email, password) VALUES (?, ?, ?, ?)",
      [nama, nim, email, hashedPassword]
    );

    return NextResponse.json({ success: true, message: "Registrasi berhasil" }, { status: 201 });
  } catch (error) {
    console.error("Register API error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}
