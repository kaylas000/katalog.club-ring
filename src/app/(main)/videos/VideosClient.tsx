"use client";

import { useState, useRef } from "react";

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

const PIPED_INSTANCES = [
  "https://piped.video",
  "https://piped.kavin.rocks",
  "https://piped.privacydev.net",
];

function getProxyUrl(videoId: string) {
  return `${PIPED_INSTANCES[0]}/watch?v=${videoId}`;
}

function getThumbnailUrl(videoId: string) {
  return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
}

export default function VideosClient() {
  const [playing, setPlaying] = useState<string | null>(null);
  const [failed, setFailed] = useState<Set<string>>(new Set());

  const handlePlay = (id: string) => {
    setPlaying(id);
  };

  const handleError = (id: string) => {
    setFailed((prev) => new Set(prev).add(id));
  };

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
                className="mb-4 text-sm text-text-muted hover:text-bronze transition-colors"
              >
                ← Назад к списку
              </button>
              <div className="relative w-full rounded-xl overflow-hidden shadow-2xl bg-black" style={{ paddingBottom: "56.25%" }}>
                <iframe
                  src={getProxyUrl(playing)}
                  className="absolute inset-0 w-full h-full border-0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              </div>
            </div>
          ) : null}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {VIDEOS.map((video) => (
              <div
                key={video.id}
                className="group bg-bg-card border border-border rounded-xl overflow-hidden hover:border-bronze/50 transition-all cursor-pointer"
                onClick={() => handlePlay(video.id)}
              >
                <div className="relative aspect-video bg-bg-elevated">
                  {failed.has(video.id) ? (
                    <div className="absolute inset-0 flex items-center justify-center text-text-muted text-sm">
                      Видео недоступно
                    </div>
                  ) : (
                    <>
                      <img
                        src={getThumbnailUrl(video.id)}
                        alt={video.title}
                        className="w-full h-full object-cover"
                        onError={() => handleError(video.id)}
                        loading="lazy"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-14 h-14 bg-bronze rounded-full flex items-center justify-center shadow-lg">
                          <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div className="p-3">
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
