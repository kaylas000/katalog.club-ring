#!/usr/bin/env node

/**
 * Генератор статей для club-ring
 * Аналог generate_article.py из lazer-rezka
 *
 * Использование:
 *   node scripts/generate-article.js --title "Заголовок" --content "Текст статьи" --category "Новости бокса"
 *   node scripts/generate-article.js --file article.md
 *   node scripts/generate-article.js --list                    — показать темы
 *   node scripts/generate-article.js --topic 0                 — сгенерировать по теме из списка
 */

const fs = require("fs");
const path = require("path");

const ARTICLES_PATH = path.join(__dirname, "..", "src", "lib", "data", "articles.json");

const TOPICS = [
  { title: "Как выбрать боксёрские перчатки: полное руководство", category: "Новости бокса" },
  { title: "Техника бандажирования рук: пошаговая инструкция", category: "Методика" },
  { title: "Программа тренировок для начинающих боксёров", category: "Методика" },
  { title: "Топ-10 упражнений для развития удара", category: "Методика" },
  { title: "Что нужно новичку MMA: полный список экипировки", category: "Новости бокса" },
  { title: "Как выбрать боксёрский мешок для дома", category: "Новости бокса" },
  { title: "Правила боя в боксе: что нужно знать зрителю", category: "Анализ боёв" },
  { title: "Восстановление после тренировки: питание и отдых", category: "Методика" },
  { title: "История бокса: от Древнего Египта до современности", category: "Новости бокса" },
  { title: "Как подготовиться к первому любительскому бою", category: "Мотивация" },
  { title: "Разминка перед боксёрской тренировкой", category: "Методика" },
  { title: "Спортивное питание для бойцов: белок, креатин, витамины", category: "Методика" },
  { title: "Лучшие боксёры всех времён: топ-20", category: "Анализ" },
  { title: "Техника защиты в боксе: уклоны, блоки, парирование", category: "Методика" },
  { title: "Сколько калорий сжигает боксёрская тренировка", category: "Методика" },
];

function transliterate(text) {
  const map = {
    а:"a",б:"b",в:"v",г:"g",д:"d",е:"e",ё:"yo",ж:"zh",з:"z",и:"i",й:"y",
    к:"k",л:"l",м:"m",н:"n",о:"o",п:"p",р:"r",с:"s",т:"t",у:"u",ф:"f",
    х:"kh",ц:"ts",ч:"ch",ш:"sh",щ:"shch",ъ:"",ы:"y",ь:"",э:"e",ю:"yu",я:"ya",
  };
  return text.toLowerCase().split("").map(ch => map[ch] ?? ch).join("");
}

function generateSlug(title) {
  return transliterate(title)
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 80);
}

function generateId() {
  return "art-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function calculateReadTime(text) {
  return Math.max(1, Math.ceil(text.split(/\s+/).length / 200));
}

function formatDateText(dateStr) {
  const d = new Date(dateStr);
  const months = ["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"];
  return `${d.getDate()} ${months[d.getMonth()]}`;
}

function loadArticles() {
  return JSON.parse(fs.readFileSync(ARTICLES_PATH, "utf-8"));
}

function saveArticles(articles) {
  fs.writeFileSync(ARTICLES_PATH, JSON.stringify(articles, null, 2), "utf-8");
}

function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--title") parsed.title = args[++i];
    else if (args[i] === "--content") parsed.content = args[++i];
    else if (args[i] === "--excerpt") parsed.excerpt = args[++i];
    else if (args[i] === "--category") parsed.category = args[++i];
    else if (args[i] === "--tags") parsed.tags = args[++i].split(",").map(t => t.trim());
    else if (args[i] === "--image") parsed.coverImage = args[++i];
    else if (args[i] === "--file") parsed.file = args[++i];
    else if (args[i] === "--topic") parsed.topicIndex = parseInt(args[++i]);
    else if (args[i] === "--list") parsed.list = true;
    else if (args[i] === "--draft") parsed.draft = true;
    else if (args[i] === "--external") parsed.externalUrl = args[++i];
  }
  return parsed;
}

function createArticle(opts) {
  const articles = loadArticles();
  const slug = generateSlug(opts.title);

  if (articles.some(a => a.slug === slug)) {
    console.error(`Статья с slug "${slug}" уже существует!`);
    process.exit(1);
  }

  const now = new Date().toISOString().split("T")[0];
  const content = opts.content || "";

  const article = {
    id: generateId(),
    slug,
    title: opts.title,
    excerpt: opts.excerpt || content.substring(0, 150).replace(/[#*_\n]/g, " ").trim(),
    content,
    coverImage: opts.coverImage || "",
    category: opts.category || "Новости бокса",
    categoryClass: "gold",
    tags: opts.tags || [],
    date: now,
    dateText: formatDateText(now),
    readTime: calculateReadTime(content),
    isPublished: !opts.draft,
    isExternal: !!opts.externalUrl,
    externalUrl: opts.externalUrl,
  };

  articles.unshift(article);
  saveArticles(articles);

  console.log(`Статья создана:`);
  console.log(`  ID:    ${article.id}`);
  console.log(`  Slug:  ${article.slug}`);
  console.log(`  URL:   /news/${article.slug}`);
  console.log(`  Title: ${article.title}`);

  return article;
}

function main() {
  const args = parseArgs();

  if (args.list) {
    console.log("Доступные темы:\n");
    TOPICS.forEach((t, i) => {
      console.log(`  ${i}. [${t.category}] ${t.title}`);
    });
    console.log(`\nИспользование: node scripts/generate-article.js --topic <номер>`);
    return;
  }

  if (args.topicIndex !== undefined) {
    const topic = TOPICS[args.topicIndex];
    if (!topic) {
      console.error(`Тема с индексом ${args.topicIndex} не найдена`);
      process.exit(1);
    }
    args.title = args.title || topic.title;
    args.category = args.category || topic.category;
    if (!args.content) {
      console.error("Укажите --content для текста статьи");
      console.error(`Тема: ${topic.title}`);
      process.exit(1);
    }
  }

  if (args.file) {
    const raw = fs.readFileSync(args.file, "utf-8");
    const lines = raw.split("\n");
    const titleLine = lines.find(l => l.startsWith("# "));
    args.title = args.title || (titleLine ? titleLine.replace(/^# /, "").trim() : path.basename(args.file));
    args.content = raw.replace(/^# .+\n?/, "").trim();
  }

  if (!args.title || !args.content) {
    console.error("Обязательные параметры: --title и --content");
    console.error("\nПримеры:");
    console.error('  node scripts/generate-article.js --title "Заголовок" --content "Текст" --category "Методика"');
    console.error('  node scripts/generate-article.js --file article.md');
    console.error("  node scripts/generate-article.js --list");
    process.exit(1);
  }

  createArticle(args);
}

main();
