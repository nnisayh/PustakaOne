import { saml } from "@/lib/saml";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const samlResponse = formData.get("SAMLResponse") as string;

    if (!samlResponse) {
      return NextResponse.json({ error: "No SAML Response found" }, { status: 400 });
    }

    const { profile } = await saml.validatePostResponseAsync({ SAMLResponse: samlResponse });

    if (!profile) {
      return NextResponse.json({ error: "Invalid SAML Profile" }, { status: 401 });
    }

    const email = profile.nameID || (profile as any).email;
    const samlRoles = (profile as any).attributes?.role || [];
    
    // Debug logging
    console.log("SAML Profile Attributes:", (profile as any).attributes);
    console.log("SAML Roles detected:", samlRoles);

    const isSAMLAdmin = samlRoles.includes("admin");
    const samlRole = isSAMLAdmin ? "admin" : (samlRoles[0] || "user");
    
    console.log("Final assigned role:", samlRole);

    const [rows]: any = await db.query(
      "SELECT id, name, email, role FROM users WHERE email = ?",
      [email]
    );

    let userData;
    if (rows.length > 0) {
      userData = rows[0];
      // Selalu update role agar sinkron dengan Keycloak (termasuk downgrade ke 'user')
      if (userData.role !== samlRole) {
        await db.query("UPDATE users SET role = ? WHERE id = ?", [samlRole, userData.id]);
        userData.role = samlRole;
      }
    } else {
      const defaultName = (profile as any).attributes?.name || email.split('@')[0];
      const [result]: any = await db.query(
        "INSERT INTO users (name, email, role, password) VALUES (?, ?, ?, ?)",
        [defaultName, email, samlRole, 'SSO_USER']
      );
      userData = { id: result.insertId, name: defaultName, email, role: samlRole };
    }

    // Tentukan URL tujuan
    const redirectUrl = userData.role === 'admin' ? '/admin' : '/dashboard';
    
    // Pengaturan durasi session (dalam detik)
    const SESSION_DURATION = {
      ADMIN: 30 * 60,      // 30 Menit
      USER: 12 * 60 * 60,  // 12 Jam
    };
    
    const maxAge = userData.role === 'admin' ? SESSION_DURATION.ADMIN : SESSION_DURATION.USER;
    
    const response = NextResponse.redirect(new URL(redirectUrl, req.url), { status: 303 });
    
    // Simpan di Cookie
    response.cookies.set("auth_session", JSON.stringify(userData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: maxAge,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("SAML Callback Error Details:", error);
    return NextResponse.json({ 
      error: "SAML Authentication Failed", 
      message: error.message 
    }, { status: 500 });
  }
}
