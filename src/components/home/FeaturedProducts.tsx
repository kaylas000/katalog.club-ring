"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag, Star } from "lucide-react";
import { products } from "@/lib/data/products.data";
import { formatPrice } from "@/lib/utils/formatters";
import { useCart } from "@/lib/store/cart";

export function FeaturedProducts() {
  const featured = products.filter((p) => p.isFeatured).slice(0, 4);
  const addToCart = useCart((s) => s.addToCart);

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-5">
        <div className="flex items-end justify-between mb-5">
          <div>
            <span className="tag-bronze mb-3 inline-block">Магазин</span>
            <h2 className="font-heading text-3xl lg:text-4xl font-bold text-text-primary">
              Хиты продаж
            </h2>
          </div>
          <Link
            href="/shop"
            className="hidden sm:flex items-center gap-2 text-sm text-bronze hover:text-bronze-light transition-colors"
          >
            Смотреть все <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((product) => (
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

        <div className="text-center mt-8">
          <Link href="/shop" className="btn-secondary">
            Перейти в магазин
          </Link>
        </div>
      </div>
    </section>
  );
}
