import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { clubs } from "@/lib/data/clubs.data";
import { formatPrice } from "@/lib/utils/formatters";
import { ClubCardPhoto } from "@/components/clubs/ClubCardPhoto";

const tagLabels: Record<string, string> = {
  children: "Дети",
  women: "Женщины",
  professional: "Профи",
  amateur: "Любители",
  "muay-thai": "Муай-тай",
  kickboxing: "Кикбоксинг",
  mma: "ММА",
  "fitness-boxing": "Фитнес-бокс",
  sparring: "Спарринги",
  championship: "Чемпионаты",
};

export function FeaturedClubs() {
  const featured = clubs.filter((c) => c.isFeatured).slice(0, 6);

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-5">
        <div className="flex items-end justify-between mb-5">
          <div>
            <span className="tag-bronze mb-3 inline-block">Каталог</span>
            <h2 className="font-heading text-3xl lg:text-4xl font-bold text-text-primary">
              Популярные залы
            </h2>
          </div>
          <Link
            href="/clubs"
            className="hidden sm:flex items-center gap-2 text-sm text-bronze hover:text-bronze-light transition-colors"
          >
            Смотреть все <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Desktop */}
        <div className="hidden lg:grid grid-cols-[1fr_280px] gap-6">
          <div className="flex flex-col gap-4">
            {featured.map((club) => (
              <Link
                key={club.id}
                href={`/clubs/${club.slug}`}
                className="bg-bg-card border border-border rounded-xl overflow-hidden transition-all duration-300 hover:border-bronze-dark hover:shadow-card-hover group"
              >
                <div className="grid gap-4 p-4" style={{ gridTemplateColumns: "180px minmax(0,1fr)" }}>
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-bronze/10 to-bg-elevated shrink-0">
                    <ClubCardPhoto
                      photos={club.photos}
                      fallback={club.name.charAt(0)}
                      alt={club.name}
                    />
                    {club.isVerified && (
                      <div className="absolute top-2 left-2 z-10">
                        <span className="tag-bronze text-[10px]">✓ Verified</span>
                      </div>
                    )}
                    <div className="absolute bottom-2 right-2 z-10">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-bronze/90 text-bg-primary text-xs font-semibold">
                        ★ {club.rating}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-bg-elevated text-text-secondary border border-border">
                        {tagLabels[club.tags[0]] || club.tags[0] || "Бокс"}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-success/15 text-success border border-success/25">
                        {club.city}
                      </span>
                      {club.isVerified && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-success/15 text-success border border-success/25">
                          Проверен
                        </span>
                      )}
                    </div>
                    <h3 className="font-heading font-bold text-text-primary text-lg leading-tight mb-1 group-hover:text-bronze transition-colors">
                      {club.name}
                    </h3>
                    <p className="text-sm text-text-secondary mb-1 line-clamp-1">{club.shortDescription}</p>
                    <p className="text-sm text-text-muted line-clamp-2 mb-3">{club.description.slice(0, 150)}...</p>
                    <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-border">
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-bronze/12 border border-bronze/25 text-bronze text-xs font-semibold">
                          ★ {club.rating} · {club.reviewCount} отзывов
                        </span>
                        {club.pricing[0] && (
                          <span className="text-sm font-semibold text-bronze">от {formatPrice(club.pricing[0].price)}</span>
                        )}
                      </div>
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-text-primary group-hover:text-bronze transition-colors">
                        Подробнее →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <aside className="sticky top-24 border border-border rounded-xl bg-bg-card p-4 space-y-4 self-start">
            <div className="text-[10px] text-text-muted uppercase tracking-wider font-mono">Реклама</div>
            <div className="rounded-lg border border-dashed border-border h-[250px] flex items-center justify-center">
              <span className="text-text-muted text-sm">Место для рекламы</span>
            </div>
            <div className="rounded-lg border border-dashed border-border h-[250px] flex items-center justify-center">
              <span className="text-text-muted text-sm">Место для рекламы</span>
            </div>
          </aside>
        </div>

        {/* Mobile */}
        <div className="lg:hidden flex flex-col gap-4">
          {featured.map((club) => (
            <Link
              key={club.id}
              href={`/clubs/${club.slug}`}
              className="bg-bg-card border border-border rounded-xl overflow-hidden transition-all duration-300 hover:border-bronze-dark hover:shadow-card-hover group"
            >
              <div className="relative w-full aspect-square bg-gradient-to-br from-bronze/10 to-bg-elevated overflow-hidden">
                <ClubCardPhoto
                  photos={club.photos}
                  fallback={club.name.charAt(0)}
                  alt={club.name}
                />
                {club.isVerified && (
                  <div className="absolute top-2 left-2 z-10">
                    <span className="tag-bronze text-[10px]">✓ Verified</span>
                  </div>
                )}
                <div className="absolute bottom-2 right-2 z-10">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-bronze/90 text-bg-primary text-xs font-semibold">
                    ★ {club.rating}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex flex-wrap gap-1.5 mb-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-bg-elevated text-text-secondary border border-border">
                    {tagLabels[club.tags[0]] || club.tags[0] || "Бокс"}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-success/15 text-success border border-success/25">
                    {club.city}
                  </span>
                  {club.isVerified && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-success/15 text-success border border-success/25">
                      Проверен
                    </span>
                  )}
                </div>
                <h3 className="font-heading font-bold text-text-primary text-lg leading-tight mb-1 group-hover:text-bronze transition-colors">
                  {club.name}
                </h3>
                <p className="text-sm text-text-secondary mb-1 line-clamp-1">{club.shortDescription}</p>
                <p className="text-sm text-text-muted line-clamp-2 mb-3">{club.description.slice(0, 150)}...</p>
                <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-border">
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-bronze/12 border border-bronze/25 text-bronze text-xs font-semibold">
                      ★ {club.rating} · {club.reviewCount} отзывов
                    </span>
                    {club.pricing[0] && (
                      <span className="text-sm font-semibold text-bronze">от {formatPrice(club.pricing[0].price)}</span>
                    )}
                  </div>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-text-primary group-hover:text-bronze transition-colors">
                    Подробнее →
                  </span>
                </div>
              </div>
            </Link>
          ))}
          <div className="bg-bg-card border border-border rounded-xl p-4 flex items-center justify-center min-h-[200px]">
            <span className="text-text-muted text-xs">Реклама</span>
          </div>
        </div>

        <div className="sm:hidden mt-6 text-center">
          <Link href="/clubs" className="text-sm text-bronze hover:text-bronze-light transition-colors">
            Смотреть все залы →
          </Link>
        </div>
      </div>
    </section>
  );
}
