"use server";

import { readFile, writeFile } from "fs/promises";
import path from "path";
import { Article } from "@/lib/types";
import {
  generateId,
  generateSlug,
  calculateReadTime,
  formatDateText,
  invalidateCache,
} from "./articles.data";

const ARTICLES_PATH = path.join(process.cwd(), "src/lib/data/articles.json");

export async function readArticles(): Promise<Article[]> {
  const data = await readFile(ARTICLES_PATH, "utf-8");
  return JSON.parse(data);
}

export async function writeArticles(articles: Article[]): Promise<void> {
  await writeFile(ARTICLES_PATH, JSON.stringify(articles, null, 2), "utf-8");
}

export async function addArticle(
  input: Partial<Article> & { title: string; content: string }
): Promise<Article> {
  const articles = await readArticles();

  const slug = generateSlug(input.title);
  const exists = articles.some((a) => a.slug === slug);
  const finalSlug = exists ? `${slug}-${Date.now()}` : slug;

  const now = new Date().toISOString().split("T")[0];

  const article: Article = {
    id: generateId(),
    slug: finalSlug,
    title: input.title,
    excerpt: input.excerpt || input.content.substring(0, 150).replace(/[#*_\n]/g, " ").trim(),
    content: input.content,
    coverImage: input.coverImage || "",
    category: input.category || "Новости бокса",
    categoryClass: input.categoryClass || "gold",
    tags: input.tags || [],
    date: input.date || now,
    dateText: input.dateText || formatDateText(input.date || now),
    readTime: calculateReadTime(input.content),
    isPublished: input.isPublished ?? true,
    isExternal: input.isExternal ?? false,
    externalUrl: input.externalUrl,
  };

  articles.unshift(article);
  await writeArticles(articles);
  invalidateCache();

  return article;
}

export async function updateArticle(
  id: string,
  input: Partial<Article>
): Promise<Article | null> {
  const articles = await readArticles();
  const index = articles.findIndex((a) => a.id === id);

  if (index === -1) return null;

  const updated = { ...articles[index], ...input };

  if (input.title) {
    updated.slug = generateSlug(input.title);
  }
  if (input.content) {
    updated.readTime = calculateReadTime(input.content);
  }
  if (input.date) {
    updated.dateText = formatDateText(input.date);
  }

  articles[index] = updated;
  await writeArticles(articles);
  invalidateCache();

  return updated;
}

export async function deleteArticle(id: string): Promise<boolean> {
  const articles = await readArticles();
  const index = articles.findIndex((a) => a.id === id);

  if (index === -1) return false;

  articles.splice(index, 1);
  await writeArticles(articles);
  invalidateCache();

  return true;
}
