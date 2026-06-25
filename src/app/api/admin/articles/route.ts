import { NextRequest, NextResponse } from "next/server";
import { readArticles, addArticle } from "@/lib/data/articles-store";

function checkAuth(request: NextRequest) {
  return request.cookies.get("admin-auth")?.value === "true";
}

export async function GET(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  const articles = await readArticles();
  return NextResponse.json(articles);
}

export async function POST(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  const body = await request.json();

  if (!body.title || !body.content) {
    return NextResponse.json(
      { error: "title и content обязательны" },
      { status: 400 }
    );
  }

  const article = await addArticle(body);
  return NextResponse.json(article, { status: 201 });
}
