import { Metadata } from "next";
import Link from "next/link";
import { getAllArticles } from "@/lib/data/articles.data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Статьи и Блог о Боксе | Club-Ring",
  description:
    "📝 Блог Club-Ring — статьи о боксе, анализ боев, истории великих боксёров. Новости мира бокса.",
};

export default async function NewsPage() {
  const articles = await getAllArticles();

  return (
    <div className="min-h-screen">
      <section className="bg-bg-secondary py-8">
        <div className="max-w-7xl mx-auto px-5">
          <nav className="text-sm text-text-muted mb-6">
            <Link href="/" className="hover:text-bronze transition-colors">
              Главная
            </Link>
            <span className="mx-2">/</span>
            <span className="text-text-secondary">Статьи</span>
          </nav>
          <h1 className="font-heading text-3xl lg:text-4xl font-bold text-text-primary">
            Каталог статей
          </h1>
          <p className="text-text-secondary mt-2">
            Читайте интересные материалы о боксе
          </p>
        </div>
      </section>

      <section className="py-10 lg:py-14">
        <div className="max-w-7xl mx-auto px-5">
          {articles.length === 0 ? (
            <p className="text-text-muted text-center py-20">
              Статей пока нет
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {articles.map((article) => {
                const baseClass =
                  "group block rounded-xl overflow-hidden transition-all duration-300 flex flex-col " +
                  "bg-gradient-to-br from-[#1a1a1a] to-[#222224] border-2 border-[rgba(200,178,115,0.2)] " +
                  "hover:border-[#C9A227] hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(200,178,115,0.2)]";

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
                        {article.isExternal
                          ? "Читать на стороне →"
                          : "Читать →"}
                      </span>
                    </div>
                    </div>
                  </>
                );

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
          )}
        </div>
      </section>
    </div>
  );
}
