"use client";

import { useState, useEffect } from "react";

export default function GamePage() {
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    const check = () => setIsLandscape(window.innerWidth > window.innerHeight);
    check();
    window.addEventListener("resize", check);
    window.addEventListener("orientationchange", () => setTimeout(check, 100));
    return () => {
      window.removeEventListener("resize", check);
      window.removeEventListener("orientationchange", check);
    };
  }, []);

  if (isLandscape) {
    return (
      <div className="fixed inset-0 z-[9999] bg-black">
        <iframe
          src="/game/index.html"
          className="w-full h-full border-0"
          allow="autoplay"
          style={{ width: "100vw", height: "100vh" }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <section className="bg-bg-secondary py-8">
        <div className="max-w-5xl mx-auto px-5">
          <nav className="text-sm text-text-muted mb-6">
            <a href="/" className="hover:text-bronze transition-colors">Главная</a>
            <span className="mx-2">/</span>
            <span className="text-text-secondary">Боксёрская игра</span>
          </nav>
          <h1 className="font-heading text-3xl lg:text-4xl font-bold text-text-primary">
            🥊 Боксёрская игра
          </h1>
          <p className="mt-3 text-text-secondary max-w-2xl">
            Поверни телефон горизонтально для полноэкранной игры!
          </p>
        </div>
      </section>

      <section className="py-8 lg:py-10">
        <div className="max-w-5xl mx-auto px-5">
          <div className="rounded-xl border border-border overflow-hidden shadow-2xl bg-black">
            <iframe
              src="/game/index.html"
              className="w-full border-0"
              style={{ height: "500px" }}
              allow="autoplay"
            />
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-bg-card border border-border rounded-lg p-5">
              <div className="text-2xl mb-3">🎯</div>
              <h3 className="font-heading font-bold text-text-primary mb-2">Тренировка</h3>
              <p className="text-sm text-text-muted">Отработай удары на груше перед боем.</p>
            </div>
            <div className="bg-bg-card border border-border rounded-lg p-5">
              <div className="text-2xl mb-3">🤖</div>
              <h3 className="font-heading font-bold text-text-primary mb-2">VS Компьютер</h3>
              <p className="text-sm text-text-muted">Бой с ИИ на разных уровнях сложности.</p>
            </div>
            <div className="bg-bg-card border border-border rounded-lg p-5">
              <div className="text-2xl mb-3">👥</div>
              <h3 className="font-heading font-bold text-text-primary mb-2">2 Игрока</h3>
              <p className="text-sm text-text-muted">Сражайся с другом за одним компьютером.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
