"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Check, MapPin, Truck, CreditCard } from "lucide-react";

export default function ConfirmationPage() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order") || "N/A";
  const city = searchParams.get("city") || "";
  const address = searchParams.get("address") || "";

  return (
    <div className="min-h-screen">
      <section className="py-16 lg:py-24">
        <div className="max-w-lg mx-auto px-5 text-center">
          <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-success" />
          </div>
          <h1 className="font-display text-4xl text-text-primary">ЗАКАЗ ОФОРМЛЕН!</h1>
          <p className="mt-4 text-sm text-text-secondary">
            Спасибо за покупку! Мы свяжемся с вами для подтверждения.
            Номер заказа: <span className="text-bronze font-semibold">#{orderNumber}</span>
          </p>

          <div className="mt-8 p-6 bg-bg-card border border-border rounded-xl text-left">
            <h3 className="font-heading font-semibold text-text-primary text-lg mb-4">Информация о доставке</h3>
            <div className="space-y-3 text-sm">
              {city && (
                <div className="flex items-center gap-2 text-text-secondary">
                  <MapPin className="w-4 h-4 text-bronze" />
                  {city}{address ? `, ${address}` : ""}
                </div>
              )}
              <div className="flex items-center gap-2 text-text-secondary">
                <Truck className="w-4 h-4 text-bronze" />
                Доставка 2-7 рабочих дней
              </div>
              <div className="flex items-center gap-2 text-text-secondary">
                <CreditCard className="w-4 h-4 text-bronze" />
                Оплата при получении
              </div>
            </div>
          </div>

          <Link
            href="/shop"
            className="mt-8 inline-flex items-center gap-2 btn-primary"
          >
            ВЕРНУТЬСЯ В МАГАЗИН
          </Link>
        </div>
      </section>
    </div>
  );
}
