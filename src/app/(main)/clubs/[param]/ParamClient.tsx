"use client";

import { useState, useMemo, Fragment, useEffect } from "react";
import Link from "next/link";
import { Search, ChevronDown, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { clubs } from "@/lib/data/clubs.data";
import { formatPrice } from "@/lib/utils/formatters";
import { CityAutocomplete } from "@/components/clubs/CityAutocomplete";
import { ClubCardPhoto } from "@/components/clubs/ClubCardPhoto";
import { type Location } from "@/lib/data/locations.data";
import { useLocationStore } from "@/lib/store/location";

const sortOptions = [
  { value: "rating", label: "По рейтингу" },
  { value: "name", label: "По названию" },
  { value: "reviews", label: "По отзывам" },
  { value: "newest", label: "По дате" },
];

interface ParamClientProps {
  location: Location;
}

export default function ParamClient({ location }: ParamClientProps) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [mobileOpen, setMobileOpen] = useState(false);
  const { setLocation } = useLocationStore();

  useEffect(() => {
    setLocation(location.id, location.label);
  }, [location, setLocation]);

  const filtered = useMemo(() => {
    let result = [...clubs];

    if (location.kind === "city") {
      result = result.filter(
        (c) => c.city.toLowerCase() === location.label.toLowerCase()
      );
    } else if (location.kind === "region") {
      result = result.filter(
        (c) => c.city.toLowerCase().includes(location.label.toLowerCase().replace("область", "").trim())
      );
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.city.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "reviews":
        result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
    }

    return result;
  }, [search, sortBy, location]);

  const activeCount = search ? 1 : 0;

  const reset = () => {
    setSearch("");
    setSortBy("rating");
  };

  return (
    <div className="min-h-screen">
      <section className="bg-bg-secondary py-8 lg:py-10 border-b border-border">
        <div className="max-w-7xl mx-auto px-5">
          <nav className="text-sm text-text-muted mb-4">
            <Link href="/" className="hover:text-bronze transition-colors">Главная</Link>
            <span className="mx-2">/</span>
            <Link href="/clubs" className="hover:text-bronze transition-colors">Залы</Link>
            <span className="mx-2">/</span>
            <span className="text-text-secondary">{location.label}</span>
          </nav>
          <h1 className="font-heading text-2xl lg:text-3xl font-bold text-text-primary mb-1">
            Боксёрские залы {location.label}
          </h1>
          <p className="text-sm text-text-secondary">
            {filtered.length} клубов
          </p>
        </div>
      </section>

      <section className="bg-bg-primary border-b border-border sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-5 py-3">
          <div className="hidden lg:flex items-center gap-3">
            <div className="relative min-w-[220px]">
              <CityAutocomplete
                value={null}
                onChange={() => {}}
                placeholder={location.label}
              />
            </div>

            <div className="relative min-w-[180px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                id="clubs-search"
                name="search"
                type="text"
                placeholder="Поиск зала..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-base pl-9 pr-3 py-2 w-full text-sm"
              />
            </div>

            <select
              id="clubs-sort"
              name="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-bg-card border border-border rounded-lg px-3 py-2 text-sm text-text-secondary focus:border-bronze focus:outline-none appearance-none cursor-pointer"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="lg:hidden">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex items-center justify-between w-full py-2"
            >
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-bronze" />
                <span className="text-sm font-medium text-text-primary">
                  Фильтры {activeCount > 0 && `(${activeCount})`}
                </span>
              </div>
              <ChevronDown className={cn("w-4 h-4 text-text-muted transition-transform", mobileOpen && "rotate-180")} />
            </button>

            {mobileOpen && (
              <div className="pb-4 pt-3 space-y-4 border-t border-border mt-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    id="clubs-search-mobile"
                    name="search"
                    type="text"
                    placeholder="Поиск зала..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="input-base pl-9 w-full text-sm"
                  />
                </div>

                <div className="flex gap-2">
                  <select
                    id="clubs-sort-mobile"
                    name="sort"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="flex-1 bg-bg-card border border-border rounded-lg px-3 py-2 text-sm text-text-secondary focus:border-bronze focus:outline-none"
                  >
                    {sortOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  {activeCount > 0 && (
                    <button onClick={reset} className="px-3 py-2 text-xs text-error border border-error/30 rounded-lg hover:bg-error/10 transition-colors">
                      Сбросить
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-5">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-text-muted text-lg mb-4">Залы не найдены</p>
              <button onClick={reset} className="btn-secondary text-sm">Сбросить фильтры</button>
            </div>
          ) : (
            <>
              <div className="hidden lg:grid grid-cols-[1fr_280px] gap-6">
                <div className="flex flex-col gap-4">
                  {filtered.map((club) => (
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
                              {club.tags[0] || "Бокс"}
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-success/15 text-success border border-success/25">
                              {club.city}
                            </span>
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
                </aside>
              </div>

              <div className="lg:hidden flex flex-col gap-4">
                {filtered.map((club, i) => (
                  <Fragment key={club.id}>
                    <Link
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
                            {club.tags[0] || "Бокс"}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-success/15 text-success border border-success/25">
                            {club.city}
                          </span>
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
                    {(i + 1) % 4 === 0 && i < filtered.length - 1 && (
                      <div className="bg-bg-card border border-border rounded-xl p-4 flex items-center justify-center min-h-[200px]">
                        <span className="text-text-muted text-xs">Реклама</span>
                      </div>
                    )}
                  </Fragment>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
