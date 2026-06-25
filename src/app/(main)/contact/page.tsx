import { Metadata } from "next";
import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Контакты | Club-Ring",
  description: "Свяжитесь с нами по любым вопросам.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-bg-secondary py-8">
        <div className="max-w-4xl mx-auto px-5">
          <nav className="text-sm text-text-muted mb-6">
            <Link href="/" className="hover:text-bronze transition-colors">Главная</Link>
            <span className="mx-2">/</span>
            <span className="text-text-secondary">Контакты</span>
          </nav>
          <h1 className="font-heading text-3xl lg:text-4xl font-bold text-text-primary">Контакты</h1>
        </div>
      </section>
      <section className="py-10 lg:py-14">
        <div className="max-w-4xl mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-bg-card border border-border rounded-xl p-6 text-center">
              <Mail className="w-8 h-8 text-bronze mx-auto mb-3" />
              <h3 className="font-heading font-semibold text-text-primary mb-1">Email</h3>
              <p className="text-sm text-text-secondary">info@club-ring.ru</p>
            </div>
            <div className="bg-bg-card border border-border rounded-xl p-6 text-center">
              <Phone className="w-8 h-8 text-bronze mx-auto mb-3" />
              <h3 className="font-heading font-semibold text-text-primary mb-1">Телефон</h3>
              <p className="text-sm text-text-secondary">+7 (999) 000-00-00</p>
            </div>
            <div className="bg-bg-card border border-border rounded-xl p-6 text-center">
              <MapPin className="w-8 h-8 text-bronze mx-auto mb-3" />
              <h3 className="font-heading font-semibold text-text-primary mb-1">Город</h3>
              <p className="text-sm text-text-secondary">Москва, Россия</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
