"use client";

import { useState, useEffect, useRef } from "react";
import type { Article } from "@/lib/types";
import initialArticles from "@/lib/data/articles.json";

const CATEGORIES = [
  "Новости бокса",
  "Анализ боёв",
  "Методика",
  "Интервью",
  "Мотивация",
  "Анализ",
];

const STORAGE_KEY = "clubring_articles";

interface FormData {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  coverImage: string;
  tags: string;
  date: string;
  isPublished: boolean;
  isExternal: boolean;
  externalUrl: string;
}

const emptyForm: FormData = {
  title: "",
  excerpt: "",
  content: "",
  category: "Новости бокса",
  coverImage: "",
  tags: "",
  date: new Date().toISOString().split("T")[0],
  isPublished: true,
  isExternal: false,
  externalUrl: "",
};

function loadArticles(): Article[] {
  if (typeof window === "undefined") return initialArticles as Article[];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialArticles));
  return initialArticles as Article[];
}

function saveArticles(articles: Article[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9а-яё]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function AdminPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setArticles(loadArticles());
  }, []);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    let coverImage = form.coverImage;
    if (previewUrl) {
      coverImage = previewUrl;
    }

    const tags = form.tags.split(",").map((t) => t.trim()).filter(Boolean);
    const slug = slugify(form.title);

    if (editingId) {
      const updated = articles.map((a) =>
        a.id === editingId
          ? { ...a, ...form, coverImage, tags, slug }
          : a
      );
      setArticles(updated);
      saveArticles(updated);
      setMessage("Статья обновлена!");
    } else {
      const newArticle: Article = {
        id: `art-${Date.now()}`,
        slug,
        title: form.title,
        excerpt: form.excerpt,
        content: form.content,
        coverImage,
        category: form.category,
        categoryClass: "gold",
        tags,
        date: form.date,
        dateText: new Date(form.date).toLocaleDateString("ru-RU", { day: "numeric", month: "long" }),
        readTime: Math.max(1, Math.ceil(form.content.length / 1000)),
        isPublished: form.isPublished,
        isExternal: form.isExternal,
        externalUrl: form.externalUrl || "",
      };
      const updated = [newArticle, ...articles];
      setArticles(updated);
      saveArticles(updated);
      setMessage("Статья создана!");
    }

    setForm(emptyForm);
    setEditingId(null);
    setPreviewUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    setSaving(false);
  }

  function handleEdit(article: Article) {
    setForm({
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      category: article.category,
      coverImage: article.coverImage,
      tags: article.tags.join(", "),
      date: article.date,
      isPublished: article.isPublished,
      isExternal: article.isExternal,
      externalUrl: article.externalUrl || "",
    });
    setEditingId(article.id);
    setPreviewUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleDelete(id: string) {
    if (!confirm("Удалить статью?")) return;
    const updated = articles.filter((a) => a.id !== id);
    setArticles(updated);
    saveArticles(updated);
    setMessage("Статья удалена");
  }

  function handleCancel() {
    setForm(emptyForm);
    setEditingId(null);
    setPreviewUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div className="min-h-screen bg-bg-primary py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-3xl">🥊</span>
          <div>
            <h1 className="font-heading text-2xl font-bold text-text-primary">
              Управление статьями
            </h1>
            <p className="text-sm text-text-muted">
              {articles.length} статей в базе
            </p>
          </div>
        </div>

        {message && (
          <div className="mb-6 p-3 rounded-lg bg-bronze/10 border border-bronze/30 text-bronze text-sm">
            {message}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-bg-card border border-border rounded-xl p-6 mb-10 space-y-5"
        >
          <h2 className="font-heading text-lg font-semibold text-text-primary">
            {editingId ? "Редактировать статью" : "Новая статья"}
          </h2>

          <div>
            <label className="block text-sm text-text-secondary mb-1.5">Заголовок *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="input-base w-full"
              placeholder="Заголовок статьи"
            />
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-1.5">Описание</label>
            <textarea
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              className="input-base w-full h-20 resize-none"
              placeholder="Краткое описание"
            />
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-1.5">Текст статьи *</label>
            <textarea
              required
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="input-base w-full h-60 resize-y font-mono text-sm"
              placeholder="Markdown: ## заголовки, **жирный**, *курсив*"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm text-text-secondary mb-1.5">Категория</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="input-base w-full"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-text-secondary mb-1.5">Дата</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="input-base w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm text-text-secondary mb-1.5">Теги (через запятую)</label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                className="input-base w-full"
                placeholder="бокс, тайсон, анализ"
              />
            </div>

            <div>
              <label className="block text-sm text-text-secondary mb-1.5">Обложка</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={form.coverImage}
                  onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                  className="input-base flex-1"
                  placeholder="/images/news/photo.jpg"
                />
                <label className="btn-ghost cursor-pointer flex items-center gap-1 text-xs whitespace-nowrap">
                  📁 Файл
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
              {(previewUrl || form.coverImage) && (
                <div className="mt-2 relative w-full h-32 rounded-lg overflow-hidden bg-bg-elevated border border-border">
                  <img
                    src={previewUrl || form.coverImage}
                    alt="Превью"
                    className="w-full h-full object-cover"
                  />
                  {previewUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewUrl("");
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                      className="absolute top-1 right-1 bg-black/60 text-white text-xs px-2 py-0.5 rounded"
                    >
                      Убрать
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isPublished}
                onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                className="w-4 h-4 accent-[#C9A227]"
              />
              <span className="text-sm text-text-secondary">Опубликована</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isExternal}
                onChange={(e) => setForm({ ...form, isExternal: e.target.checked })}
                className="w-4 h-4 accent-[#C9A227]"
              />
              <span className="text-sm text-text-secondary">Внешняя ссылка</span>
            </label>
          </div>

          {form.isExternal && (
            <div>
              <label className="block text-sm text-text-secondary mb-1.5">URL</label>
              <input
                type="url"
                value={form.externalUrl}
                onChange={(e) => setForm({ ...form, externalUrl: e.target.value })}
                className="input-base w-full"
                placeholder="https://..."
              />
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? "Сохранение..." : editingId ? "Обновить" : "Создать"}
            </button>
            {editingId && (
              <button type="button" onClick={handleCancel} className="btn-ghost">Отмена</button>
            )}
          </div>
        </form>

        <div>
          <h2 className="font-heading text-lg font-semibold text-text-primary mb-4">Все статьи</h2>

          {articles.length === 0 ? (
            <p className="text-text-muted text-sm">Статей пока нет</p>
          ) : (
            <div className="space-y-3">
              {articles.map((article) => (
                <div
                  key={article.id}
                  className="bg-bg-card border border-border rounded-xl p-4 flex items-start gap-4"
                >
                  {article.coverImage && (
                    <img
                      src={article.coverImage}
                      alt=""
                      className="w-16 h-16 rounded-lg object-cover shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="tag-bronze text-[10px]">{article.category}</span>
                      <span className="text-[10px] text-text-muted">{article.date}</span>
                      {!article.isPublished && (
                        <span className="text-[10px] text-error">черновик</span>
                      )}
                    </div>
                    <h3 className="font-heading text-sm font-semibold text-text-primary truncate">
                      {article.title}
                    </h3>
                    <p className="text-xs text-text-muted mt-0.5 truncate">{article.excerpt}</p>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleEdit(article)}
                      className="text-xs text-silver hover:text-text-primary transition-colors px-2 py-1"
                    >
                      Ред.
                    </button>
                    <button
                      onClick={() => handleDelete(article.id)}
                      className="text-xs text-error/60 hover:text-error transition-colors px-2 py-1"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
