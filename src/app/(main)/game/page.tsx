import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Боксёрская игра | Club-Ring",
  description: "2D боксёрская игра. Тренировка на груше, бой с компьютером или другим игроком.",
};

export default function GamePage() {
  return (
    <div className="min-h-screen">
      <section className="bg-bg-secondary py-8">
        <div className="max-w-5xl mx-auto px-5">
          <nav className="text-sm text-text-muted mb-6">
            <Link href="/" className="hover:text-bronze transition-colors">Главная</Link>
            <span className="mx-2">/</span>
            <span className="text-text-secondary">Боксёрская игра</span>
          </nav>
          <h1 className="font-heading text-3xl lg:text-4xl font-bold text-text-primary">
            🥊 Боксёрская игра
          </h1>
          <p className="mt-3 text-text-secondary max-w-2xl">
            Тренируйся на груше, сражайся с компьютером или другим игроком. Выбери режим и начни бой!
          </p>
        </div>
      </section>

      <section className="py-8 lg:py-10">
        <div className="max-w-5xl mx-auto px-5">
          <div className="rounded-xl border border-border overflow-hidden shadow-2xl">
            <iframe
              src="/game/index.html"
              className="w-full border-0"
              style={{ height: "600px" }}
              allow="autoplay"
            />
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-bg-card border border-border rounded-lg p-5">
              <div className="text-2xl mb-3">🎯</div>
              <h3 className="font-heading font-bold text-text-primary mb-2">Тренировка</h3>
              <p className="text-sm text-text-muted">Отработай удары на груше. Изучи управление перед боем.</p>
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

          <div className="mt-6 bg-bg-card border border-border rounded-lg p-5">
            <h3 className="font-heading font-bold text-text-primary mb-3">Управление</h3>
            <div className="grid grid-cols-2 gap-4 text-sm text-text-secondary">
              <div>
                <span className="text-bronze font-medium">Игрок 1:</span>
                <div className="mt-1 space-y-1 text-text-muted">
                  <div><kbd className="px-1.5 py-0.5 bg-bg-elevated rounded text-xs">A/D</kbd> — движение</div>
                  <div><kbd className="px-1.5 py-0.5 bg-bg-elevated rounded text-xs">W</kbd> — прыжок</div>
                  <div><kbd className="px-1.5 py-0.5 bg-bg-elevated rounded text-xs">Q</kbd> — блок</div>
                  <div><kbd className="px-1.5 py-0.5 bg-bg-elevated rounded text-xs">Space</kbd> — джеб</div>
                  <div><kbd className="px-1.5 py-0.5 bg-bg-elevated rounded text-xs">F</kbd> — кросс</div>
                  <div><kbd className="px-1.5 py-0.5 bg-bg-elevated rounded text-xs">G</kbd> — хук</div>
                  <div><kbd className="px-1.5 py-0.5 bg-bg-elevated rounded text-xs">E</kbd> — апперкот</div>
                </div>
              </div>
              <div>
                <span className="text-bronze font-medium">Игрок 2:</span>
                <div className="mt-1 space-y-1 text-text-muted">
                  <div><kbd className="px-1.5 py-0.5 bg-bg-elevated rounded text-xs">←/→</kbd> — движение</div>
                  <div><kbd className="px-1.5 py-0.5 bg-bg-elevated rounded text-xs">↑</kbd> — прыжок</div>
                  <div><kbd className="px-1.5 py-0.5 bg-bg-elevated rounded text-xs">Shift</kbd> — блок</div>
                  <div><kbd className="px-1.5 py-0.5 bg-bg-elevated rounded text-xs">Numpad 0</kbd> — джеб</div>
                  <div><kbd className="px-1.5 py-0.5 bg-bg-elevated rounded text-xs">Numpad 1</kbd> — кросс</div>
                  <div><kbd className="px-1.5 py-0.5 bg-bg-elevated rounded text-xs">Numpad 2</kbd> — хук</div>
                  <div><kbd className="px-1.5 py-0.5 bg-bg-elevated rounded text-xs">Numpad 3</kbd> — апперкот</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
