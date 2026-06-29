"use client";

import { useState } from "react";

interface Video {
  id: string;
  title: string;
}

const VIDEOS: Video[] = [
  { id: "dXETqcccS-A", title: "Боксёрская тренировка" },
  { id: "R7OMd_fK5Oc", title: "Удары и техника" },
  { id: "aNHmNlB7qk0", title: "Спарринг" },
  { id: "B0g0CDwKpR8", title: "Тренировка в зале" },
  { id: "9qKxCPwW0eM", title: "Боксёрские комбинации" },
  { id: "K7zcXdxPmd0", title: "Подготовка к бою" },
];

export default function VideosClient() {
  const [playing, setPlaying] = useState<string | null>(null);

  return (
    <div className="min-h-screen">
      <section className="bg-bg-secondary py-8">
        <div className="max-w-7xl mx-auto px-5">
          <nav className="text-sm text-text-muted mb-6">
            <a href="/" className="hover:text-bronze transition-colors">Главная</a>
            <span className="mx-2">/</span>
            <span className="text-text-secondary">Видеотека</span>
          </nav>
          <h1 className="font-heading text-3xl lg:text-4xl font-bold text-text-primary">
            📹 Видеотека
          </h1>
          <p className="text-text-secondary mt-2">
            Лучшие видео о боксе: тренировки, техника, бои
          </p>
        </div>
      </section>

      <section className="py-10 lg:py-14">
        <div className="max-w-7xl mx-auto px-5">
          {playing ? (
            <div className="mb-10">
              <button
                onClick={() => setPlaying(null)}
                className="mb-4 px-4 py-2 text-sm bg-bg-card border border-border rounded-lg hover:text-bronze transition-colors"
              >
                ← Назад к списку
              </button>
              <div className="relative w-full rounded-xl overflow-hidden shadow-2xl bg-black" style={{ paddingBottom: "56.25%" }}>
                <iframe
                  src={`https://www.youtube.com/embed/${playing}?autoplay=1&rel=0`}
                  className="absolute inset-0 w-full h-full border-0"
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                  title="Видео"
                />
              </div>
            </div>
          ) : null}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {VIDEOS.map((video) => (
              <div
                key={video.id}
                className="group bg-bg-card border border-border rounded-xl overflow-hidden hover:border-bronze/50 transition-all cursor-pointer"
                onClick={() => setPlaying(video.id)}
              >
                <div className="relative aspect-video bg-bg-elevated">
                  <img
                    src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
                    alt={video.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors">
                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-sm text-text-primary line-clamp-2 group-hover:text-bronze transition-colors">
                    {video.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
