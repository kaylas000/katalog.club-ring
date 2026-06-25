#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const ARTICLES_PATH = path.join(__dirname, "..", "src", "lib", "data", "articles.json");
const PUBLIC_IMAGES = path.join(__dirname, "..", "public", "images", "articles");

function loadArticles() {
  const raw = fs.readFileSync(ARTICLES_PATH, "utf-8");
  return JSON.parse(raw);
}

function saveArticles(articles) {
  fs.writeFileSync(ARTICLES_PATH, JSON.stringify(articles, null, 2), "utf-8");
}

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z\u0430-\u044f\u04510-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 80);
}

function calculateReadTime(text) {
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

function formatDateText(dateStr) {
  const date = new Date(dateStr);
  const months = [
    "января", "февраля", "марта", "апреля", "мая", "июня",
    "июля", "августа", "сентября", "октября", "ноября", "декабря",
  ];
  return `${date.getDate()} ${months[date.getMonth()]}`;
}

function validate(articles) {
  const issues = [];
  const slugs = new Set();

  for (const article of articles) {
    if (!article.id) issues.push(`Article missing id: ${article.title}`);
    if (!article.title) issues.push(`Article ${article.id} missing title`);
    if (!article.slug) {
      issues.push(`Article ${article.id} missing slug — will regenerate`);
      article.slug = generateSlug(article.title || "untitled");
    }
    if (slugs.has(article.slug)) {
      const newSlug = `${article.slug}-${Date.now()}`;
      issues.push(`Duplicate slug "${article.slug}" → renamed to "${newSlug}"`);
      article.slug = newSlug;
    }
    slugs.add(article.slug);

    if (!article.date) {
      issues.push(`Article ${article.id} missing date`);
      article.date = new Date().toISOString().split("T")[0];
    }
    if (!article.dateText) {
      article.dateText = formatDateText(article.date);
    }
    if (!article.content) {
      issues.push(`Article ${article.id} missing content`);
    }
    if (article.readTime === undefined || article.readTime === null) {
      article.readTime = calculateReadTime(article.content || "");
    }
    if (!article.category) article.category = "Новости бокса";
    if (!article.categoryClass) article.categoryClass = "gold";
    if (!article.tags) article.tags = [];
    if (article.isPublished === undefined) article.isPublished = true;
    if (article.isExternal === undefined) article.isExternal = false;

    if (article.coverImage && article.coverImage.startsWith("/images/articles/")) {
      const filename = article.coverImage.replace("/images/articles/", "");
      const filepath = path.join(PUBLIC_IMAGES, filename);
      if (!fs.existsSync(filepath)) {
        issues.push(`Cover image not found: ${article.coverImage} (article: ${article.title})`);
      }
    }
  }

  return issues;
}

function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const fix = args.includes("--fix");

  console.log("Club-Ring Articles Sync\n");

  const articles = loadArticles();
  console.log(`Found ${articles.length} articles\n`);

  const issues = validate(articles);

  if (issues.length === 0) {
    console.log("All articles valid!");
    return;
  }

  console.log(`Found ${issues.length} issues:\n`);
  for (const issue of issues) {
    console.log(`  - ${issue}`);
  }

  if (fix && !dryRun) {
    saveArticles(articles);
    console.log("\nFixed and saved.");
  } else if (!fix) {
    console.log("\nRun with --fix to auto-fix, or --dry-run to preview fixes.");
  }
}

main();
