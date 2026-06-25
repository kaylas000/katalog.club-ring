import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "О нас | Club-Ring",
  description: "Club-Ring — крупнейший каталог боксёрских залов России и магазин экипировки.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-bg-secondary py-8">
        <div className="max-w-4xl mx-auto px-5">
          <nav className="text-sm text-text-muted mb-6">
            <Link href="/" className="hover:text-bronze transition-colors">Главная</Link>
            <span className="mx-2">/</span>
            <span className="text-text-secondary">О нас</span>
          </nav>
          <h1 className="font-heading text-3xl lg:text-4xl font-bold text-text-primary">О проекте</h1>
        </div>
      </section>
      <section className="py-10 lg:py-14">
        <div className="max-w-4xl mx-auto px-5">
          <div className="prose-custom max-w-none space-y-6 text-text-secondary leading-relaxed">
            <p><strong className="text-text-primary">Club-Ring</strong> — это крупнейший каталог боксёрских залов России. Мы собираем информацию о залах, тренерах и секциях бокса по всей стране.</p>
            <p>Наша миссия — помочь каждому найти подходящий зал для тренировок, независимо от уровня подготовки. От начинающих до профессионалов.</p>
            <p>На сайте также работает <Link href="/shop" className="text-bronze hover:text-bronze-light transition-colors">спортивный магазин</Link> с экипировкой и снаряжением для бокса.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
