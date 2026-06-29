"use client";

import { useState, useRef, useEffect } from "react";

interface Video {
  id: string;
  title: string;
  thumb: string;
  embedUrl: string;
}

const VIDEO_IDS = [
  "e1aa94c5ef97ee970a5cf5943f9e6a14",
  "a22482521a049e6ce7db0a0231d0adbb",
  "822c3c55211fe5e00427b510ba1a802b",
  "2e2e59a2b49c2659c669349f9dab4fef",
  "33e490aab1cb92981cef5239eda24060",
  "1dd39fb0ff9eec5d9f0577d6b2cb0292",
];

const DEFAULT_VIDEOS: Video[] = VIDEO_IDS.map(id => ({
  id,
  title: "Загрузка...",
  thumb: "",
  embedUrl: `https://rutube.ru/play/embed/${id}`,
}));

function VideoCard({ video, onPlay }: { video: Video; onPlay: (id: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { rootMargin: "300px" });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="group bg-bg-card border border-border rounded-xl overflow-hidden hover:border-bronze/50 transition-all cursor-pointer"
      onClick={() => onPlay(video.id)}
    >
      <div className="relative w-full" style={{ aspectRatio: "9/16" }}>
        {visible ? (
          <>
            {video.thumb ? (
              <img
                src={video.thumb}
                alt={video.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-bg-elevated flex items-center justify-center">
                <svg className="w-10 h-10 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
            )}
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
          </>
        ) : (
          <div className="w-full h-full bg-bg-elevated animate-pulse" />
        )}
      </div>
    </div>
  );
}

export default function VideosClient() {
  const [videos, setVideos] = useState<Video[]>(DEFAULT_VIDEOS);
  const [playing, setPlaying] = useState<string | null>(null);

  useEffect(() => {
    Promise.all(
      VIDEO_IDS.map(async (id) => {
        try {
          const res = await fetch(`https://rutube.ru/api/video/${id}/`);
          const data = await res.json();
          return {
            id,
            title: data.title || "Видео",
            thumb: data.thumbnail_url || "",
            embedUrl: data.embed_url || `https://rutube.ru/play/embed/${id}`,
          };
        } catch {
          return { id, title: "Видео", thumb: "", embedUrl: `https://rutube.ru/play/embed/${id}` };
        }
      })
    ).then(setVideos);
  }, []);

  const currentVideo = playing ? videos.find(v => v.id === playing) : null;

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
                <div className="relative w-full bg-black rounded-xl overflow-hidden shadow-2xl" style={{ paddingBottom: "177.8%" }}>
                  <iframe
                    src={currentVideo.embedUrl}
                    className="absolute inset-0 w-full h-full border-0"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  />
                </div>
                <h2 className="mt-4 text-lg font-bold text-text-primary">{currentVideo.title}</h2>
              </div>
            </div>
          ) : null}

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} onPlay={setPlaying} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
