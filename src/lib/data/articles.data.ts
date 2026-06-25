import { readFile } from "fs/promises";
import path from "path";
import { Article } from "@/lib/types";

const ARTICLES_PATH = path.join(process.cwd(), "src/lib/data/articles.json");

let cachedArticles: Article[] | null = null;

async function loadArticles(): Promise<Article[]> {
  if (cachedArticles) return cachedArticles;
  const data = await readFile(ARTICLES_PATH, "utf-8");
  cachedArticles = JSON.parse(data) as Article[];
  return cachedArticles;
}

export function invalidateCache() {
  cachedArticles = null;
}

export async function getAllArticles(): Promise<Article[]> {
  const articles = await loadArticles();
  return articles
    .filter((a) => a.isPublished)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getLatestArticles(count: number = 3): Promise<Article[]> {
  const all = await getAllArticles();
  return all.slice(0, count);
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  const articles = await loadArticles();
  return articles.find((a) => a.slug === slug && a.isPublished);
}

export async function getArticlesByCategory(category: string): Promise<Article[]> {
  const all = await getAllArticles();
  return all.filter(
    (a) => a.category.toLowerCase() === category.toLowerCase()
  );
}

export async function getArticleById(id: string): Promise<Article | undefined> {
  const articles = await loadArticles();
  return articles.find((a) => a.id === id);
}

const TRANSLIT_MAP: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo",
  ж: "zh", з: "z", и: "i", й: "y", к: "k", л: "l", м: "m",
  н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u",
  ф: "f", х: "kh", ц: "ts", ч: "ch", ш: "sh", щ: "shch",
  ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
};

export function transliterate(text: string): string {
  return text
    .toLowerCase()
    .split("")
    .map((ch) => TRANSLIT_MAP[ch] ?? ch)
    .join("");
}

export function generateSlug(title: string): string {
  return transliterate(title)
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 80);
}

export function generateId(): string {
  return "art-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export function calculateReadTime(text: string): number {
  const wordsPerMinute = 200;
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

export function formatDateText(dateStr: string): string {
  const date = new Date(dateStr);
  const months = [
    "января", "февраля", "марта", "апреля", "мая", "июня",
    "июля", "августа", "сентября", "октября", "ноября", "декабря",
  ];
  return `${date.getDate()} ${months[date.getMonth()]}`;
}
