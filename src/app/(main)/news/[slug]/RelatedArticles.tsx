import Link from "next/link";
import { Article } from "@/lib/types";

interface Props {
  articles: Article[];
}

export default function RelatedArticles({ articles }: Props) {
  return (
    <section className="py-10 lg:py-14 border-t border-border">
      <div className="max-w-4xl mx-auto px-5">
        <h2 className="font-heading text-2xl font-bold text-text-primary mb-8">
          Похожие статьи
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/news/${article.slug}`}
              className="group block rounded-xl overflow-hidden bg-gradient-to-br from-[#1a1a1a] to-[#222224] border border-[rgba(200,178,115,0.2)] hover:border-[#C9A227] hover:-translate-y-1 transition-all duration-300"
            >
              {article.coverImage && (
                <div className="h-36 overflow-hidden">
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-4">
                <span className="text-[10px] text-bronze font-semibold">
                  {article.dateText}
                </span>
                <h3 className="font-heading text-sm font-bold text-text-primary mt-1 mb-2 group-hover:text-bronze transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-xs text-text-secondary line-clamp-2">
                  {article.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
