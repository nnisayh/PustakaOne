import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // 1. DEVELOPER BYPASS (Pintu Darurat Admin)
    // Pastikan Email & Password-nya sesuai dengan yang Anda ketik nanti
    if (email === "admin@pustakaone.id" && password === "admin123") {
      const adminData = {
        id: 0,
        nama: "Developer Admin",
        email: "admin@pustakaone.id",
        role: "admin"
      };
      const SESSION_DURATION = {
        ADMIN: 30 * 60,      // 30 Menit
        USER: 12 * 60 * 60,  // 12 Jam
      };
      const maxAge = adminData.role === 'admin' ? SESSION_DURATION.ADMIN : SESSION_DURATION.USER;

      const response = NextResponse.json({ success: true, user: adminData });
      response.cookies.set("auth_session", JSON.stringify(adminData), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: maxAge,
        path: "/",
      });
      return response;
    }

    // 2. CEK KE DATABASE LOKAL (Manual Login)
    // Kita cari user berdasarkan email di database kita sendiri
    const [rows] = await db.query(
      "SELECT id, nama, email, role, password FROM users WHERE email=?",
      [email]
    );

    if (rows.length > 0) {
      const user = rows[0];
      
      // Jika password-nya cocok (kita pakai bcrypt atau cek plain text untuk dummy data)
      const isPasswordMatch = (password === user.password) || (user.password !== 'SSO_USER' && await bcrypt.compare(password, user.password));

      if (isPasswordMatch) {
        const userData = {
          id: user.id,
          nama: user.nama,
          email: user.email,
          role: user.role
        };

        const SESSION_DURATION = {
          ADMIN: 30 * 60,      // 30 Menit
          USER: 12 * 60 * 60,  // 12 Jam
        };
        const maxAge = userData.role === 'admin' ? SESSION_DURATION.ADMIN : SESSION_DURATION.USER;

        const response = NextResponse.json({ success: true, user: userData });
        
        response.cookies.set("auth_session", JSON.stringify(userData), {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: maxAge,
          path: "/",
        });

        return response;
      }
    }

    // Jika sampai sini, berarti gagal
    return NextResponse.json({ 
      success: false, 
      message: "Email atau password salah. Pastikan Anda menggunakan akun manual Admin." 
    }, { status: 401 });

  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}