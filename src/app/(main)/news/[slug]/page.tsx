import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticleBySlug, getAllArticles } from "@/lib/data/articles.data";
import ShareButtons from "./ShareButtons";
import RelatedArticles from "./RelatedArticles";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const articles = await getAllArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Статья не найдена" };

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.date,
      tags: article.tags,
    },
  };
}

function renderMarkdown(text: string): string {
  return text
    .replace(/^### (.+)$/gm, '<h3 class="text-xl font-heading font-semibold text-text-primary mt-8 mb-4">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-heading font-bold text-bronze mt-10 mb-5 pb-3 border-b border-border">$1</h2>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-text-primary font-semibold">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .split("\n\n")
    .map((block) => {
      block = block.trim();
      if (!block) return "";
      if (block.startsWith("<h")) return block;
      return `<p class="mb-5 text-text-secondary leading-relaxed">${block}</p>`;
    })
    .join("\n");
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const allArticles = await getAllArticles();
  const related = allArticles
    .filter((a) => a.id !== article.id && a.category === article.category)
    .slice(0, 3);

  const renderedContent = renderMarkdown(article.content);

  return (
    <div className="min-h-screen">
      <section className="bg-bg-secondary py-8">
        <div className="max-w-4xl mx-auto px-5">
          <nav className="text-sm text-text-muted mb-6">
            <Link href="/" className="hover:text-bronze transition-colors">
              Главная
            </Link>
            <span className="mx-2">/</span>
            <Link href="/news" className="hover:text-bronze transition-colors">
              Статьи
            </Link>
            <span className="mx-2">/</span>
            <span className="text-text-secondary line-clamp-1">
              {article.title}
            </span>
          </nav>
        </div>
      </section>

      <article className="py-10 lg:py-14">
        <div className="max-w-4xl mx-auto px-5">
          <header className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs text-bronze font-semibold">
                {article.dateText} {new Date(article.date).getFullYear()}
              </span>
              <span className="text-[10px] bg-[rgba(200,178,115,0.1)] text-bronze px-2.5 py-1 rounded-full font-medium">
                {article.category}
              </span>
              <span className="text-xs text-text-muted">
                {article.readTime} мин чтения
              </span>
            </div>

            <h1 className="font-heading text-3xl lg:text-4xl font-bold text-text-primary leading-tight">
              {article.title}
            </h1>

            {article.excerpt && (
              <p className="text-lg text-text-secondary mt-4 leading-relaxed">
                {article.excerpt}
              </p>
            )}
          </header>

          {article.coverImage && (
            <div className="mb-10 rounded-xl overflow-hidden bg-bg-elevated">
              <img
                src={article.coverImage}
                alt={article.title}
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          <div
            className="prose-custom max-w-none"
            dangerouslySetInnerHTML={{ __html: renderedContent }}
          />

          <footer className="mt-12 pt-8 border-t border-border">
            <div className="flex flex-wrap gap-2 mb-6">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] bg-bg-elevated text-text-muted px-3 py-1 rounded-full border border-border"
                >
                  {tag}
                </span>
              ))}
            </div>

            <ShareButtons slug={article.slug} title={article.title} />
          </footer>
        </div>
      </article>

      {related.length > 0 && <RelatedArticles articles={related} />}
    </div>
  );
}
