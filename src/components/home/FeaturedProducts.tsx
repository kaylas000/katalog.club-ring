import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { products } from "@/lib/data/products.data";
import { formatPrice } from "@/lib/utils/formatters";

export function FeaturedProducts() {
  const featured = products.filter((p) => p.isFeatured).slice(0, 4);

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {featured.map((product) => (
            <Link
              key={product.id}
              href={`/shop/${product.category}/${product.slug}`}
              className="card-base card-hover group"
            >
              <div className="relative h-48 lg:h-56 bg-bg-elevated">
                <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/80 to-transparent z-10" />
                {product.isNew && (
                  <span className="absolute top-3 left-3 z-20 tag-bronze text-[10px]">
                    NEW
                  </span>
                )}
                {product.isBestseller && (
                  <span className="absolute top-3 left-3 z-20 tag-silver text-[10px]">
                    BESTSELLER
                  </span>
                )}
              </div>
              <div className="p-4">
                <p className="font-mono text-[11px] text-bronze uppercase tracking-wider mb-1">
                  {product.brand}
                </p>
                <h3 className="font-heading font-semibold text-text-primary text-sm mb-2 line-clamp-2 group-hover:text-bronze transition-colors">
                  {product.name}
                </h3>
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-bronze text-xs">★</span>
                  <span className="text-xs font-medium text-text-primary">
                    {product.rating}
                  </span>
                  <span className="text-xs text-text-muted">
                    ({product.reviewCount})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {product.comparePrice && (
                    <span className="text-xs text-text-muted line-through">
                      {formatPrice(product.comparePrice)}
                    </span>
                  )}
                  <span className="font-heading font-semibold text-bronze">
                    {formatPrice(product.price)}
                  </span>
                </div>
              </div>
            </Link>
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
