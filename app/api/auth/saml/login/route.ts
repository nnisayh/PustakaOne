import { saml } from "@/lib/saml";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Membuat URL Redirect yang berisi SAMLRequest XML (Base64)
    const authorizeUrl = await saml.getAuthorizeUrlAsync("", "", {});
    
    return NextResponse.redirect(authorizeUrl);
  } catch (error) {
    console.error("SAML Login Error:", error);
    return NextResponse.json({ error: "Failed to initiate SAML login" }, { status: 500 });
  }
}
