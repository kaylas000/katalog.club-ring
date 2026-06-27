"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { encyclopediaSections } from "@/lib/data/encyclopedia.data";
import { cn } from "@/lib/utils/cn";

const allItems = encyclopediaSections.flatMap((section) =>
  section.subsections.flatMap((sub) =>
    sub.items.map((item) => ({
      ...item,
      sectionId: section.id,
      sectionTitle: section.title,
      sectionIcon: section.icon,
      subsectionTitle: sub.title,
    }))
  )
);

export default function EncyclopediaClient() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered =
    activeCategory === "all"
      ? allItems
      : allItems.filter((item) => item.sectionId === activeCategory);

  const grouped = encyclopediaSections
    .filter((s) => activeCategory === "all" || s.id === activeCategory)
    .map((section) => ({
      ...section,
      items: filtered.filter((item) => item.sectionId === section.id),
    }));

  return (
    <div className="min-h-screen">
      <section className="bg-bg-secondary py-8">
        <div className="max-w-4xl mx-auto px-5">
          <nav className="text-sm text-text-muted mb-6">
            <Link href="/" className="hover:text-bronze transition-colors">Главная</Link>
            <span className="mx-2">/</span>
            <span className="text-text-secondary">Энциклопедия</span>
          </nav>
          <h1 className="font-heading text-3xl lg:text-4xl font-bold text-text-primary mb-2">
            Энциклопедия бокса
          </h1>
          <p className="text-text-secondary">
            Ответы на все вопросы: от истории до питания боксёра
          </p>
        </div>
      </section>

      <section className="py-8 lg:py-12">
        <div className="max-w-4xl mx-auto px-5">
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => { setActiveCategory("all"); setOpenId(null); }}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium border transition-all",
                activeCategory === "all"
                  ? "border-bronze text-bronze bg-bronze/10"
                  : "border-border text-text-secondary hover:border-silver"
              )}
            >
              Все вопросы ({allItems.length})
            </button>
            {encyclopediaSections.map((section) => (
              <button
                key={section.id}
                onClick={() => { setActiveCategory(section.id); setOpenId(null); }}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium border transition-all",
                  activeCategory === section.id
                    ? "border-bronze text-bronze bg-bronze/10"
                    : "border-border text-text-secondary hover:border-silver"
                )}
              >
                {section.icon} {section.title}
              </button>
            ))}
          </div>

          <div className="space-y-8">
            {grouped.map((section) => (
              <div key={section.id}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">{section.icon}</span>
                  <h2 className="font-heading text-xl font-bold text-text-primary">
                    {section.title}
                  </h2>
                  <span className="text-xs text-text-muted">({section.items.length})</span>
                </div>

                <div className="space-y-2">
                  {section.items.map((item) => {
                    const isOpen = openId === item.id;
                    return (
                      <div
                        key={item.id}
                        className="bg-bg-card border border-border rounded-xl overflow-hidden"
                      >
                        <button
                          onClick={() => setOpenId(isOpen ? null : item.id)}
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-bg-elevated/50 transition-colors"
                        >
                          <span className="font-heading text-sm font-semibold text-text-primary pr-4">
                            {item.question}
                          </span>
                          <ChevronDown
                            className={cn(
                              "w-5 h-5 text-bronze shrink-0 transition-transform duration-200",
                              isOpen && "rotate-180"
                            )}
                          />
                        </button>
                        {isOpen && (
                          <div className="px-4 pb-4 border-t border-border/50">
                            <p className="text-sm text-text-secondary leading-relaxed pt-3">
                              {item.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center bg-bg-card border border-border rounded-xl p-8">
            <h3 className="font-heading text-xl font-bold text-text-primary mb-2">
              Не нашли ответ?
            </h3>
            <p className="text-sm text-text-secondary mb-4">
              Свяжитесь с нами напрямую — поможем разобраться.
            </p>
            <Link href="/contact" className="btn-primary inline-flex">
              Связаться с нами
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
