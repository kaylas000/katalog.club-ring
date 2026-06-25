import { NextRequest, NextResponse } from "next/server";
import { updateArticle, deleteArticle } from "@/lib/data/articles-store";

function checkAuth(request: NextRequest) {
  return request.cookies.get("admin-auth")?.value === "true";
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  const body = await request.json();
  const updated = await updateArticle(params.id, body);

  if (!updated) {
    return NextResponse.json({ error: "Статья не найдена" }, { status: 404 });
  }

  return NextResponse.json(updated);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  const deleted = await deleteArticle(params.id);

  if (!deleted) {
    return NextResponse.json({ error: "Статья не найдена" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
