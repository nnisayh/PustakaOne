import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
  try {
    const p = await params;
    const id = p.id;
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID pengguna diperlukan" },
        { status: 400 }
      );
    }

    const [result] = await db.query("DELETE FROM users WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, message: "Pengguna tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Pengguna berhasil dihapus" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete API error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}
