"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CreditCard } from "lucide-react";
import { useCart } from "@/lib/store/cart";
import { formatPrice } from "@/lib/utils/formatters";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    address: "",
    payment: "card",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const orderNumber = Math.random().toString(36).substr(2, 9).toUpperCase();
    clearCart();
    router.push(`/shop/confirmation?order=${orderNumber}&city=${encodeURIComponent(formData.city)}&address=${encodeURIComponent(formData.address)}`);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-4xl text-text-primary">Корзина пуста</h1>
          <Link href="/shop" className="mt-4 inline-block text-bronze hover:underline">
            Вернуться в магазин
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
            <Link href="/shop/cart" className="hover:text-bronze transition-colors">Корзина</Link>
            <span className="mx-2">/</span>
            <span className="text-text-secondary">Оформление</span>
          </nav>
          <h1 className="font-heading text-2xl lg:text-3xl font-bold text-text-primary">
            Оформление заказа
          </h1>
        </div>
      </section>

      <section className="py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-5">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-bg-card border border-border rounded-xl p-6">
                  <h2 className="font-heading font-semibold text-text-primary text-lg mb-4">Контактные данные</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="checkout-name" className="block text-xs text-text-muted mb-2">Имя *</label>
                      <input
                        id="checkout-name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="input-base w-full"
                        placeholder="Ваше имя"
                      />
                    </div>
                    <div>
                      <label htmlFor="checkout-phone" className="block text-xs text-text-muted mb-2">Телефон *</label>
                      <input
                        id="checkout-phone"
                        name="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="input-base w-full"
                        placeholder="+7 (999) 123-45-67"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="checkout-email" className="block text-xs text-text-muted mb-2">Email *</label>
                      <input
                        id="checkout-email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="input-base w-full"
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-bg-card border border-border rounded-xl p-6">
                  <h2 className="font-heading font-semibold text-text-primary text-lg mb-4">Адрес доставки</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="checkout-city" className="block text-xs text-text-muted mb-2">Город *</label>
                      <input
                        id="checkout-city"
                        name="city"
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="input-base w-full"
                        placeholder="Москва"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="checkout-address" className="block text-xs text-text-muted mb-2">Адрес *</label>
                      <input
                        id="checkout-address"
                        name="address"
                        type="text"
                        required
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="input-base w-full"
                        placeholder="Улица, дом, квартира"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-bg-card border border-border rounded-xl p-6">
                  <h2 className="font-heading font-semibold text-text-primary text-lg mb-4">Способ оплаты</h2>
                  <div className="space-y-3">
                    <label htmlFor="payment-card" className="flex items-center gap-3 p-4 border border-bronze/30 bg-bronze/5 rounded-xl cursor-pointer">
                      <input
                        id="payment-card"
                        type="radio"
                        name="payment"
                        value="card"
                        checked={formData.payment === "card"}
                        onChange={(e) => setFormData({ ...formData, payment: e.target.value })}
                        className="accent-bronze"
                      />
                      <CreditCard className="w-5 h-5 text-bronze" />
                      <div>
                        <div className="text-sm text-text-primary">Картой при получении</div>
                        <div className="text-xs text-text-muted">Visa, Mastercard, МИР</div>
                      </div>
                    </label>
                    <label htmlFor="payment-cash" className="flex items-center gap-3 p-4 border border-border rounded-xl cursor-pointer hover:border-silver transition-colors">
                      <input
                        id="payment-cash"
                        type="radio"
                        name="payment"
                        value="cash"
                        checked={formData.payment === "cash"}
                        onChange={(e) => setFormData({ ...formData, payment: e.target.value })}
                        className="accent-bronze"
                      />
                      <div className="w-5 h-5 flex items-center justify-center text-text-muted">₽</div>
                      <div>
                        <div className="text-sm text-text-primary">Наличными при получении</div>
                      </div>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 btn-primary"
                >
                  ПОДТВЕРДИТЬ ЗАКАЗ
                </button>
              </form>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-bg-card border border-border rounded-xl p-6 sticky top-24">
                <h2 className="font-heading font-semibold text-text-primary text-lg mb-6">ВАШ ЗАКАЗ</h2>
                <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
                  {items.map((item) => (
                    <div key={`${item.product.id}-${item.variant}`} className="flex gap-3">
                      <div className="w-14 h-14 bg-bg-elevated rounded-lg overflow-hidden shrink-0">
                        <div className="w-full h-full flex items-center justify-center text-lg font-heading text-bronze/20">
                          {item.product.name.charAt(0)}
                        </div>
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm text-text-primary truncate">{item.product.name}</div>
                        <div className="text-xs text-text-muted">
                          {item.variant} × {item.quantity}
                        </div>
                        <div className="text-sm text-bronze font-semibold">
                          {formatPrice(item.product.price * item.quantity)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Товары</span>
                    <span className="text-text-primary">{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Доставка</span>
                    <span className="text-text-primary">
                      {totalPrice > 15000 ? "Бесплатно" : "500 ₽"}
                    </span>
                  </div>
                  <div className="border-t border-border pt-2 flex justify-between">
                    <span className="font-heading font-semibold text-text-primary">ИТОГО</span>
                    <span className="font-heading font-bold text-bronze text-xl">
                      {formatPrice(totalPrice > 15000 ? totalPrice : totalPrice + 500)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
