import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Сотрудничество | Club-Ring",
  description: "Предложите сотрудничество проекту Club-Ring.",
};

export default function CooperationPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-bg-secondary py-8">
        <div className="max-w-4xl mx-auto px-5">
          <nav className="text-sm text-text-muted mb-6">
            <Link href="/" className="hover:text-bronze transition-colors">Главная</Link>
            <span className="mx-2">/</span>
            <span className="text-text-secondary">Сотрудничество</span>
          </nav>
          <h1 className="font-heading text-3xl lg:text-4xl font-bold text-text-primary">Сотрудничество</h1>
        </div>
      </section>
      <section className="py-10 lg:py-14">
        <div className="max-w-4xl mx-auto px-5">
          <div className="text-center py-12">
            <h2 className="font-heading text-2xl font-bold text-text-primary mb-4">Добавьте свой зал</h2>
            <p className="text-text-secondary mb-6 max-w-lg mx-auto">
              Если вы владелец боксёрского зала или тренер — свяжитесь с нами, чтобы разместить информацию о вашем клубе в каталоге.
            </p>
            <Link href="/contact" className="btn-primary">Связаться с нами</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
