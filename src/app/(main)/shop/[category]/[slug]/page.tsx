"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ShoppingBag, Star, Check, ChevronRight, ChevronLeft } from "lucide-react";
import { products } from "@/lib/data/products.data";
import { formatPrice } from "@/lib/utils/formatters";
import { cn } from "@/lib/utils/cn";
import { useCart } from "@/lib/store/cart";

export default function ProductPage() {
  const params = useParams();
  const category = params.category as string;
  const slug = params.slug as string;
  const addToCart = useCart((s) => s.addToCart);

  const product = products.find((p) => p.slug === slug && p.category === category);

  const [selectedVariant, setSelectedVariant] = useState<string | null>(
    product?.variants?.[0]?.id || null
  );
  const [activePhoto, setActivePhoto] = useState(0);

  const allPhotos = [
    product?.coverImage,
    ...(product?.images || []),
  ].filter((p, i, arr) => p && arr.indexOf(p) === i);

  while (allPhotos.length < 4) {
    allPhotos.push(allPhotos[allPhotos.length - 1] || "");
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-6xl text-gradient-bronze mb-4">404</h1>
          <p className="text-text-secondary mb-6">Товар не найден</p>
          <Link href="/shop" className="btn-primary">Вернуться в магазин</Link>
        </div>
      </div>
    );
  }

  const currentVariant = product.variants.find((v) => v.id === selectedVariant);
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen">
      <section className="bg-bg-secondary py-4">
        <div className="max-w-7xl mx-auto px-5">
          <nav className="text-sm text-text-muted flex items-center gap-1 flex-wrap">
            <Link href="/" className="hover:text-bronze transition-colors">Главная</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/shop" className="hover:text-bronze transition-colors">Магазин</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href={`/shop/${product.category}`} className="hover:text-bronze transition-colors capitalize">
              {product.category}
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-text-secondary">{product.name}</span>
          </nav>
        </div>
      </section>

      <section className="py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="rounded-xl overflow-hidden" style={{ background: "linear-gradient(160deg, #1a1a1f 0%, #111114 55%, #111114 100%)", border: "1px solid rgba(201,162,39,0.1)" }}>
              <div className="p-4">
                <div className="relative rounded-xl overflow-hidden aspect-square mb-4" style={{ border: "2px solid #C9A227" }}>
                  <img
                    src={allPhotos[activePhoto]}
                    alt={`${product.name} — фото ${activePhoto + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                    {product.isNew && (
                      <span className="bg-bronze text-bg-primary text-[10px] font-bold px-3 py-1.5 rounded tracking-wider">
                        NEW
                      </span>
                    )}
                    {product.isBestseller && (
                      <span className="bg-bronze-dark text-white text-[10px] font-bold px-3 py-1.5 rounded tracking-wider flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        TOP
                      </span>
                    )}
                    {product.comparePrice && (
                      <span className="bg-error text-white text-[10px] font-bold px-3 py-1.5 rounded tracking-wider">
                        SALE
                      </span>
                    )}
                  </div>
                </div>

                <div className="hidden sm:flex gap-2.5">
                  {allPhotos.slice(0, 4).map((src, i) => (
                    <button
                      key={i}
                      onClick={() => setActivePhoto(i)}
                      className={cn(
                        "flex-1 h-[80px] rounded-xl border overflow-hidden transition-all",
                        activePhoto === i
                          ? "border-bronze/50 ring-1 ring-bronze/30"
                          : "border-border hover:border-bronze/30"
                      )}
                    >
                      <img
                        src={src}
                        alt={`Фото ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="sm:hidden flex items-center justify-center gap-4 py-3 border-t border-border/30">
                <button
                  onClick={() => setActivePhoto((prev) => (prev > 0 ? prev - 1 : allPhotos.length - 1))}
                  className="w-10 h-10 rounded-full border border-border/50 bg-bg-elevated/50 flex items-center justify-center text-text-secondary hover:text-bronze transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm text-text-secondary font-mono">{activePhoto + 1} / {allPhotos.length}</span>
                <button
                  onClick={() => setActivePhoto((prev) => (prev < allPhotos.length - 1 ? prev + 1 : 0))}
                  className="w-10 h-10 rounded-full border border-border/50 bg-bg-elevated/50 flex items-center justify-center text-text-secondary hover:text-bronze transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="text-[10px] text-text-muted tracking-widest uppercase mb-2">
                {product.brand}
              </div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-text-primary leading-tight mb-4">
                {product.name}
              </h1>

              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-bronze fill-bronze" />
                  <span className="text-sm font-medium text-text-primary">{product.rating}</span>
                </div>
                <span className="text-sm text-text-muted">({product.reviewCount} отзывов)</span>
                {product.inStock ? (
                  <span className="flex items-center gap-1 text-xs text-success">
                    <Check className="w-3 h-3" /> В наличии
                  </span>
                ) : (
                  <span className="text-xs text-error">Нет в наличии</span>
                )}
              </div>

              <p className="text-text-secondary mb-6 leading-relaxed">
                {product.description}
              </p>

              {product.variants.length > 0 && (
                <div className="mb-6">
                  <div className="text-[10px] text-text-muted uppercase tracking-wider mb-3 font-mono">
                    {product.variants[0].type === "weight" ? "Вес" : product.variants[0].type === "size" ? "Размер" : "Цвет"}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v.id)}
                        disabled={!v.inStock}
                        className={cn(
                          "px-4 py-2 rounded-lg text-sm font-medium border transition-all",
                          !v.inStock && "opacity-40 cursor-not-allowed",
                          selectedVariant === v.id
                            ? "border-bronze text-bronze bg-bronze/10"
                            : "border-border text-text-secondary hover:border-silver"
                        )}
                      >
                        {v.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4 mb-6">
                <span className="text-bronze font-display text-4xl">
                  {formatPrice(product.price)}
                </span>
                {product.comparePrice && (
                  <span className="text-text-muted line-through text-lg">
                    {formatPrice(product.comparePrice)}
                  </span>
                )}
              </div>

              <button
                onClick={() => {
                  if (currentVariant) {
                    addToCart(product, currentVariant.value);
                  }
                }}
                className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2"
                disabled={!product.inStock || !currentVariant?.inStock}
              >
                <ShoppingBag className="w-5 h-5" />
                Добавить в корзину
              </button>

              {product.features.length > 0 && (
                <div className="mt-8 pt-6 border-t border-border">
                  <h3 className="font-heading font-semibold text-text-primary text-sm mb-3">Особенности</h3>
                  <ul className="space-y-2">
                    {product.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-text-secondary">
                        <span className="text-bronze">✓</span> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {Object.keys(product.specifications).length > 0 && (
                <div className="mt-6 pt-6 border-t border-border">
                  <h3 className="font-heading font-semibold text-text-primary text-sm mb-3">Характеристики</h3>
                  <div className="space-y-2">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="text-text-muted">{key}</span>
                        <span className="text-text-secondary">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="py-8 bg-bg-secondary">
          <div className="max-w-7xl mx-auto px-5">
            <h2 className="font-heading text-xl font-semibold text-text-primary mb-6">Похожие товары</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <div
                  key={p.id}
                  className="group relative bg-bg-card border border-border rounded-lg overflow-hidden hover:border-bronze/30 transition-all duration-500"
                >
                  <Link
                    href={`/shop/${p.category}/${p.slug}`}
                    className="block relative aspect-square overflow-hidden bg-bg-elevated"
                  >
                    <div className="w-full h-full flex items-center justify-center text-4xl font-heading text-bronze/20">
                      {p.name.charAt(0)}
                    </div>
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="bg-bronze text-bg-primary px-6 py-3 rounded-md font-medium text-sm flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4" />
                        В КОРЗИНУ
                      </span>
                    </div>
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {p.isNew && (
                        <span className="bg-bronze text-bg-primary text-[10px] font-bold px-2 py-1 rounded tracking-wider">NEW</span>
                      )}
                      {p.isBestseller && (
                        <span className="bg-bronze-dark text-white text-[10px] font-bold px-2 py-1 rounded tracking-wider flex items-center gap-1">
                          <Star className="w-3 h-3" /> TOP
                        </span>
                      )}
                    </div>
                  </Link>
                  <div className="p-4">
                    <div className="text-[10px] text-text-muted tracking-widest uppercase mb-1">{p.brand}</div>
                    <Link href={`/shop/${p.category}/${p.slug}`}>
                      <h3 className="font-display text-lg text-text-primary group-hover:text-bronze transition-colors leading-tight">
                        {p.name}
                      </h3>
                    </Link>
                    <div className="mt-3 flex items-center gap-3">
                      <span className="text-bronze font-display text-xl">{formatPrice(p.price)}</span>
                      {p.comparePrice && (
                        <span className="text-text-muted line-through text-sm">{formatPrice(p.comparePrice)}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
