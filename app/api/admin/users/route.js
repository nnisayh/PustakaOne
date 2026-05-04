import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const [rows] = await db.query(
      "SELECT id, nama, email, nim, role, faculty, status, DATE_FORMAT(last_access, '%Y-%m-%d %H:%i') as lastAccess, DATE_FORMAT(expiry_date, '%Y-%m-%d') as expiryDate, DATE_FORMAT(created_at, '%Y-%m-%d') as createdAt FROM users"
    );

    const users = rows.map(user => ({
      ...user,
      major: "S1 Informatika", // Placeholder
      lastAccess: user.lastAccess || "Belum pernah login",
      createdAt: user.createdAt,
      expiryDate: user.expiryDate || ""
    }))

    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error("Admin Users API error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { nama, email, nim, faculty, role, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Email dan password wajib diisi" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      "INSERT INTO users (nama, email, nim, faculty, role, password) VALUES (?, ?, ?, ?, ?, ?)",
      [nama, email, nim, faculty, role, hashedPassword]
    );

    return NextResponse.json({ success: true, id: result.insertId, message: "User berhasil ditambahkan" });
  } catch (error) {
    console.error("Admin User Creation error:", error);
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ success: false, message: "Email sudah terdaftar" }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: "Gagal menambahkan user" }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const { id, nama, email, nim, faculty, role } = await request.json();

    if (!id) {
      return NextResponse.json({ success: false, message: "ID user diperlukan" }, { status: 400 });
    }

    await db.query(
      "UPDATE users SET nama = ?, email = ?, nim = ?, faculty = ?, role = ? WHERE id = ?",
      [nama, email, nim, faculty, role, id]
    );

    return NextResponse.json({ success: true, message: "User berhasil diperbarui" });
  } catch (error) {
    console.error("Admin User Update error:", error);
    return NextResponse.json({ success: false, message: "Gagal memperbarui user" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "ID user diperlukan" }, { status: 400 });
    }

    await db.query("DELETE FROM users WHERE id = ?", [id]);

    return NextResponse.json({ success: true, message: "User berhasil dihapus" });
  } catch (error) {
    console.error("Admin User Delete error:", error);
    return NextResponse.json({ success: false, message: "Gagal menghapus user" }, { status: 500 });
  }
}
