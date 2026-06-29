"use client";

import { useState, useCallback } from "react";

interface Video {
  id: string;
  rutubeId: string;
  title: string;
  thumb: string;
}

const VIDEOS: Video[] = [
  { id: "1", rutubeId: "822c3c55211fe5e00427b510ba1a802b", title: "Льюис - Холифилд", thumb: "/videos/thumb-3.jpg" },
  { id: "2", rutubeId: "e1aa94c5ef97ee970a5cf5943f9e6a14", title: "Холифилд против Джеймса Томи", thumb: "/videos/thumb-1.jpg" },
  { id: "3", rutubeId: "a22482521a049e6ce7db0a0231d0adbb", title: "Джеймс Тони против Василия Жирова", thumb: "/videos/thumb-2.jpg" },
  { id: "4", rutubeId: "2e2e59a2b49c2659c669349f9dab4fef", title: "Мясорубка по правилам бокса", thumb: "/videos/thumb-4.jpg" },
  { id: "5", rutubeId: "33e490aab1cb92981cef5239eda24060", title: "Бой столетия", thumb: "/videos/thumb-5.jpg" },
  { id: "6", rutubeId: "1dd39fb0ff9eec5d9f0577d6b2cb0292", title: "Форман чемпион", thumb: "/videos/thumb-6.jpg" },
];

function VideoPlayer({ video, onBack }: { video: Video; onBack: () => void }) {
  return (
    <div className="mb-10">
      <button
        onClick={onBack}
        className="mb-4 px-4 py-2 text-sm bg-bg-card border border-border rounded-lg text-text-secondary hover:text-bronze transition-colors"
      >
        ← Назад к списку
      </button>
      <div className="mx-auto max-w-lg">
        <div className="relative w-full" style={{ aspectRatio: "9/16" }}>
          <iframe
            src={`https://rutube.ru/play/embed/${video.rutubeId}/`}
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={video.title}
          />
        </div>
        <h2 className="mt-4 text-lg font-bold text-text-primary">{video.title}</h2>
      </div>
    </div>
  );
}

export default function VideosClient() {
  const [playing, setPlaying] = useState<string | null>(null);
  const currentVideo = playing ? VIDEOS.find(v => v.id === playing) : null;

  const handleBack = useCallback(() => setPlaying(null), []);

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
            Видеотека
          </h1>
          <p className="text-text-secondary mt-2">
            Лучшие видео о боксе: тренировки, техника, бои
          </p>
        </div>
      </section>

      <section className="py-10 lg:py-14">
        <div className="max-w-7xl mx-auto px-5">
          {playing && currentVideo ? (
            <VideoPlayer video={currentVideo} onBack={handleBack} />
          ) : null}

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {VIDEOS.map((video) => (
              <div
                key={video.id}
                className="group bg-bg-card border border-border rounded-xl overflow-hidden hover:border-bronze/50 transition-all cursor-pointer"
                onClick={() => setPlaying(video.id)}
              >
                <div className="relative w-full" style={{ aspectRatio: "9/16" }}>
                  <img
                    src={video.thumb}
                    alt={video.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/30 transition-colors">
                    <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                    <h3 className="font-medium text-xs text-white line-clamp-2">{video.title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
