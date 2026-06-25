import { Metadata } from "next";
import Link from "next/link";
import { Play } from "lucide-react";

export const metadata: Metadata = {
  title: "Видеотека | Club-Ring",
  description: "Видео о боксе: тренировки, бои, техника.",
};

export default function VideosPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-bg-secondary py-8">
        <div className="max-w-7xl mx-auto px-5">
          <nav className="text-sm text-text-muted mb-6">
            <Link href="/" className="hover:text-bronze transition-colors">
              Главная
            </Link>
            <span className="mx-2">/</span>
            <span className="text-text-secondary">Видеотека</span>
          </nav>
          <h1 className="font-heading text-3xl lg:text-4xl font-bold text-text-primary">
            Видеотека
          </h1>
          <p className="text-text-secondary mt-2">
            Видео о боксе, тренировках и технике
          </p>
        </div>
      </section>

      <section className="py-10 lg:py-14">
        <div className="max-w-7xl mx-auto px-5">
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-bronze/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Play className="w-10 h-10 text-bronze" />
            </div>
            <h2 className="font-heading text-2xl font-bold text-text-primary mb-3">
              Скоро здесь будет видеотека
            </h2>
            <p className="text-text-secondary mb-6 max-w-md mx-auto">
              Мы готовим подборку лучших видео о боксе: тренировки, разборы боёв, техника и многое другое.
            </p>
            <Link href="/news" className="btn-primary">
              Читать статьи
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
