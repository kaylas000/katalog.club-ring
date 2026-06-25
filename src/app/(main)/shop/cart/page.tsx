"use client";

import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/store/cart";
import { formatPrice } from "@/lib/utils/formatters";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, totalPrice, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-text-muted mx-auto mb-6" />
          <h1 className="font-display text-4xl text-text-primary">КОРЗИНА ПУСТА</h1>
          <p className="mt-3 text-sm text-text-secondary">Добавьте товары из каталога</p>
          <Link
            href="/shop"
            className="mt-6 inline-flex items-center gap-2 btn-primary"
          >
            ПЕРЕЙТИ В КАТАЛОГ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <section className="bg-bg-secondary py-8">
        <div className="max-w-7xl mx-auto px-5">
          <nav className="text-sm text-text-muted mb-4">
            <Link href="/" className="hover:text-bronze transition-colors">Главная</Link>
            <span className="mx-2">/</span>
            <Link href="/shop" className="hover:text-bronze transition-colors">Магазин</Link>
            <span className="mx-2">/</span>
            <span className="text-text-secondary">Корзина</span>
          </nav>
          <h1 className="font-heading text-2xl lg:text-3xl font-bold text-text-primary">
            Корзина
          </h1>
        </div>
      </section>

      <section className="py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-5">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.product.id}-${item.variant}`}
                  className="flex gap-4 bg-bg-card border border-border rounded-xl p-4"
                >
                  <Link
                    href={`/shop/${item.product.category}/${item.product.slug}`}
                    className="w-24 h-24 bg-bg-elevated rounded-lg overflow-hidden shrink-0"
                  >
                    <div className="w-full h-full flex items-center justify-center text-2xl font-heading text-bronze/20">
                      {item.product.name.charAt(0)}
                    </div>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link href={`/shop/${item.product.category}/${item.product.slug}`}>
                      <h3 className="font-heading font-semibold text-text-primary text-sm group-hover:text-bronze transition-colors truncate">
                        {item.product.name}
                      </h3>
                    </Link>
                    <p className="text-xs text-text-muted mt-1">Вариант: {item.variant}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.variant, item.quantity - 1)
                          }
                          className="w-8 h-8 border border-border rounded-lg flex items-center justify-center text-text-secondary hover:border-bronze hover:text-bronze transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center text-sm text-text-primary">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.variant, item.quantity + 1)
                          }
                          className="w-8 h-8 border border-border rounded-lg flex items-center justify-center text-text-secondary hover:border-bronze hover:text-bronze transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-right">
                        <div className="font-heading font-semibold text-bronze">
                          {formatPrice(item.product.price * item.quantity)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product.id, item.variant)}
                    className="text-text-muted hover:text-error transition-colors self-start"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-bg-card border border-border rounded-xl p-6 sticky top-24">
                <h2 className="font-heading font-semibold text-text-primary text-lg mb-6">ИТОГО</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Товары</span>
                    <span className="text-text-primary">{totalItems} шт.</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Доставка</span>
                    <span className="text-text-primary">
                      {totalPrice > 15000 ? "Бесплатно" : "500 ₽"}
                    </span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between">
                    <span className="font-heading font-semibold text-text-primary">ВСЕГО</span>
                    <span className="font-heading font-bold text-bronze text-xl">
                      {formatPrice(totalPrice > 15000 ? totalPrice : totalPrice + 500)}
                    </span>
                  </div>
                </div>

                <Link
                  href="/shop/checkout"
                  className="w-full py-4 btn-primary flex items-center justify-center gap-2"
                >
                  ОФОРМИТЬ ЗАКАЗ
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/shop"
                  className="mt-3 w-full py-3 btn-ghost flex items-center justify-center"
                >
                  Продолжить покупки
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
