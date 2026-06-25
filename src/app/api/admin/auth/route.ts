import { NextRequest, NextResponse } from "next/server";

const ADMIN_PASSWORD = "club-ring-2024";

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (body.password === ADMIN_PASSWORD) {
    const response = NextResponse.json({ success: true });
    response.cookies.set("admin-auth", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });
    return response;
  }

  return NextResponse.json({ error: "Неверный пароль" }, { status: 401 });
}
