"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Search, ChevronDown, SlidersHorizontal, ShoppingBag, Star } from "lucide-react";
import { products } from "@/lib/data/products.data";
import { shopCategories } from "@/lib/config/navigation";
import { formatPrice } from "@/lib/utils/formatters";
import { cn } from "@/lib/utils/cn";
import { useCart } from "@/lib/store/cart";

const sortOptions = [
  { value: "new", label: "Сначала новые" },
  { value: "price-asc", label: "Цена: по возрастанию" },
  { value: "price-desc", label: "Цена: по убыванию" },
  { value: "name", label: "По названию" },
];

export default function ShopPageClient() {
  const [sortBy, setSortBy] = useState("new");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [mobileOpen, setMobileOpen] = useState(true);
  const addToCart = useCart((s) => s.addToCart);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 50) setMobileOpen(false);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const filtered = useMemo(() => {
    let result = [...products];

    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "new":
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
    }

    return result;
  }, [sortBy, selectedCategory, search]);

  const activeCount = (selectedCategory ? 1 : 0) + (search ? 1 : 0);

  const reset = () => {
    setSelectedCategory(null);
    setSearch("");
    setSortBy("new");
  };

  return (
    <div className="min-h-screen">
      <section className="bg-bg-secondary py-8">
        <div className="max-w-7xl mx-auto px-5">
          <nav className="text-sm text-text-muted mb-4">
            <Link href="/" className="hover:text-bronze transition-colors">Главная</Link>
            <span className="mx-2">/</span>
            <span className="text-text-secondary">Магазин</span>
          </nav>
          <h1 className="font-heading text-2xl lg:text-3xl font-bold text-text-primary mb-1">
            Боксёрская экипировка
          </h1>
          <p className="text-sm text-text-secondary">
            {filtered.length} товаров
          </p>
        </div>
      </section>

      <section className="bg-bg-primary border-b border-border sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-5 py-3">
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
                  id="shop-main-search"
                  name="search"
                  type="text"
                  placeholder="Поиск товаров..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input-base pl-9 w-full text-sm"
                />
              </div>

              <div>
                <div className="text-[10px] text-text-muted uppercase tracking-wider mb-2 font-mono">Категории</div>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                      !selectedCategory
                        ? "border-bronze text-bronze bg-bronze/10"
                        : "border-silver-dark text-silver"
                    )}
                  >
                    Все
                  </button>
                  {shopCategories.map((cat) => (
                    <button
                      key={cat.slug}
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                        selectedCategory === cat.slug
                          ? "border-bronze text-bronze bg-bronze/10"
                          : "border-silver-dark text-silver"
                      )}
                    >
                      {cat.icon} {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <select
                  id="shop-main-sort"
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
      </section>

      <section className="py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-5">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-text-muted text-lg mb-4">Товары не найдены</p>
              <button onClick={reset} className="btn-secondary text-sm">Сбросить фильтры</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filtered.map((product) => (
                <div
                  key={product.id}
                  className="group relative bg-bg-card border border-border rounded-lg overflow-hidden hover:border-bronze/30 transition-all duration-500"
                >
                  <Link
                    href={`/shop/${product.category}/${product.slug}`}
                    className="block relative aspect-square overflow-hidden bg-bg-elevated"
                  >
                    <img src={product.coverImage} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          addToCart(product, product.variants[0]?.value || "default");
                        }}
                        className="bg-bronze text-bg-primary px-6 py-3 rounded-md font-medium text-sm flex items-center gap-2 hover:bg-bronze-light transition-colors"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        В КОРЗИНУ
                      </button>
                    </div>
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {product.isNew && (
                        <span className="bg-bronze text-bg-primary text-[10px] font-bold px-2 py-1 rounded tracking-wider">NEW</span>
                      )}
                      {product.isBestseller && (
                        <span className="bg-bronze-dark text-white text-[10px] font-bold px-2 py-1 rounded tracking-wider flex items-center gap-1">
                          <Star className="w-3 h-3" /> TOP
                        </span>
                      )}
                      {product.comparePrice && (
                        <span className="bg-error text-white text-[10px] font-bold px-2 py-1 rounded tracking-wider">SALE</span>
                      )}
                    </div>
                  </Link>

                  <div className="p-4">
                    <div className="text-[10px] text-text-muted tracking-widest uppercase mb-1">{product.brand}</div>
                    <Link href={`/shop/${product.category}/${product.slug}`}>
                      <h3 className="font-display text-lg text-text-primary group-hover:text-bronze transition-colors leading-tight">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="mt-3 flex items-center gap-3">
                      <span className="text-bronze font-display text-xl">{formatPrice(product.price)}</span>
                      {product.comparePrice && (
                        <span className="text-text-muted line-through text-sm">{formatPrice(product.comparePrice)}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
