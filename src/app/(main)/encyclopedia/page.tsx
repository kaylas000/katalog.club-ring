import { Metadata } from "next";
import Link from "next/link";
import { encyclopediaSections } from "@/lib/data/encyclopedia.data";

export const metadata: Metadata = {
  title: "Энциклопедия бокса | Club-Ring",
  description: "Полная энциклопедия бокса: история, правила, техника, тренировки, экипировка, питание.",
};

export default function EncyclopediaPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-bg-secondary py-8">
        <div className="max-w-7xl mx-auto px-5">
          <nav className="text-sm text-text-muted mb-6">
            <Link href="/" className="hover:text-bronze transition-colors">Главная</Link>
            <span className="mx-2">/</span>
            <span className="text-text-secondary">Энциклопедия</span>
          </nav>
          <h1 className="font-heading text-3xl lg:text-4xl font-bold text-text-primary mb-2">
            Энциклопедия бокса
          </h1>
          <p className="text-text-secondary">
            Всё что нужно знать о боксе: от истории до питания
          </p>
        </div>
      </section>

      <section className="py-10 lg:py-14">
        <div className="max-w-7xl mx-auto px-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {encyclopediaSections.map((section) => (
              <div
                key={section.id}
                className="card-base card-hover group p-6"
              >
                <div className="text-4xl mb-3">{section.icon}</div>
                <h2 className="font-heading text-xl font-semibold text-text-primary mb-2 group-hover:text-bronze transition-colors">
                  {section.title}
                </h2>
                <p className="text-sm text-text-secondary mb-4">{section.description}</p>
                <div className="space-y-1.5">
                  {section.subsections.map((sub) => (
                    <div key={sub.id} className="text-xs text-text-muted">
                      • {sub.title} ({sub.items.length} вопросов)
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
