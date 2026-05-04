import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("auth_session");

    if (!session) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const userData = JSON.parse(session.value);
    return NextResponse.json({ user: userData });
  } catch (error) {
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
