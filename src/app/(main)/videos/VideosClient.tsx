"use client";

import { useState } from "react";

interface Video {
  id: string;
  title: string;
  file: string;
  thumb: string;
}

const VIDEOS: Video[] = [
  { id: "1", title: "Холифилд против Джеймса Томи", file: "/videos/boxing-1.mp4", thumb: "/videos/thumb-1.jpg" },
  { id: "2", title: "Джеймс Тони против Василия Жирова", file: "/videos/boxing-2.mp4", thumb: "/videos/thumb-2.jpg" },
  { id: "3", title: "Льюис - Холифилд", file: "/videos/boxing-3.mp4", thumb: "/videos/thumb-3.jpg" },
  { id: "4", title: "Мясорубка по правилам бокса", file: "/videos/boxing-4.mp4", thumb: "/videos/thumb-4.jpg" },
  { id: "5", title: "Бой столетия #бокс #тайсон", file: "/videos/boxing-5.mp4", thumb: "/videos/thumb-5.jpg" },
  { id: "6", title: "Форман чемпион #бокс", file: "/videos/boxing-6.mp4", thumb: "/videos/thumb-6.jpg" },
];

export default function VideosClient() {
  const [playing, setPlaying] = useState<string | null>(null);
  const currentVideo = playing ? VIDEOS.find(v => v.id === playing) : null;

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
          {playing && currentVideo ? (
            <div className="mb-10">
              <button
                onClick={() => setPlaying(null)}
                className="mb-4 px-4 py-2 text-sm bg-bg-card border border-border rounded-lg text-text-secondary hover:text-bronze transition-colors"
              >
                ← Назад к списку
              </button>
              <div className="mx-auto max-w-lg">
                <div className="relative w-full bg-black rounded-xl overflow-hidden shadow-2xl">
                  <video
                    src={currentVideo.file}
                    controls
                    autoPlay
                    className="w-full"
                    style={{ maxHeight: "70vh" }}
                  />
                </div>
                <h2 className="mt-4 text-lg font-bold text-text-primary">{currentVideo.title}</h2>
              </div>
            </div>
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
