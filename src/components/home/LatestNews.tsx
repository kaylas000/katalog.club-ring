import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getLatestArticles } from "@/lib/data/articles.data";

export async function LatestNews() {
  const articles = await getLatestArticles(3);

  if (articles.length === 0) return null;

  return (
    <section className="py-8 bg-bg-secondary">
      <div className="max-w-7xl mx-auto px-5">
        <div className="flex items-end justify-between mb-5">
          <div>
            <span className="tag-bronze mb-3 inline-block">Медиа</span>
            <h2 className="font-heading text-3xl lg:text-4xl font-bold text-text-primary">
              Блог и статьи
            </h2>
          </div>
          <Link
            href="/news"
            className="hidden sm:flex items-center gap-2 text-sm text-bronze hover:text-bronze-light transition-colors"
          >
            Все статьи <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {articles.map((article) => {
            const cardContent = (
              <>
                {article.coverImage && (
                  <div className="h-44 overflow-hidden">
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-6 flex flex-col flex-1">
                  <span className="text-xs text-bronze font-semibold mb-3">
                    {article.dateText}
                  </span>
                  <h3 className="font-heading text-lg font-bold text-text-primary mb-2 group-hover:text-bronze transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-text-secondary mb-4 line-clamp-3 flex-1">
                    {article.excerpt}
                  </p>
                  <div className="flex justify-between items-center border-t border-[rgba(200,178,115,0.2)] pt-3 mt-auto">
                    <span className="text-[10px] bg-[rgba(200,178,115,0.1)] text-bronze px-2.5 py-1 rounded-full font-medium">
                      {article.category}
                    </span>
                    <span className="text-sm text-bronze font-semibold">
                      {article.isExternal ? "Читать на стороне →" : "Читать →"}
                    </span>
                  </div>
                </div>
              </>
            );

            const baseClass =
              "group block rounded-xl overflow-hidden transition-all duration-300 flex flex-col " +
              "bg-gradient-to-br from-[#1a1a1a] to-[#222224] border-2 border-[rgba(200,178,115,0.2)] " +
              "hover:border-[#C9A227] hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(200,178,115,0.2)]";

            if (article.isExternal && article.externalUrl) {
              return (
                <a
                  key={article.id}
                  href={article.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={baseClass}
                >
                  {cardContent}
                </a>
              );
            }

            return (
              <Link
                key={article.id}
                href={`/news/${article.slug}`}
                className={baseClass}
              >
                {cardContent}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
