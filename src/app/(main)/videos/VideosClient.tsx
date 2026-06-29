"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Hls from "hls.js";

interface Video {
  id: string;
  title: string;
  hlsUrl: string;
  thumb: string;
}

const VIDEOS: Video[] = [
  { id: "1", title: "Холифилд против Джеймса Томи", hlsUrl: "https://river-1.rutube.ru/hls-vod/ZDCLEdIKGbLDl6MPb_ez6g/1783330466/3310/0x5000c500e9ec2e66/e004a801779345c6aed2301e2cb9b6f5.mp4.m3u8?i=808x1440_2231", thumb: "/videos/thumb-1.jpg" },
  { id: "2", title: "Джеймс Тони против Василия Жирова", hlsUrl: "https://river-1.rutube.ru/hls-vod/gR8O2ijy5-oHy6qnchtyHw/1783330469/2654/0x5000039ce83059ed/f2460f7a33644e0ba8e245ee99d94ef8.mp4.m3u8?i=608x1080_2278", thumb: "/videos/thumb-2.jpg" },
  { id: "3", title: "Льюис - Холифилд", hlsUrl: "https://river-1.rutube.ru/hls-vod/r7vRp501OP9lHr_jKNBEpw/1783330472/2720/0x5000039ce869e97d/854774694c22454fa542f8a01f0ec3a3.mp4.m3u8?i=808x1440_2805", thumb: "/videos/thumb-3.jpg" },
  { id: "4", title: "Мясорубка по правилам бокса", hlsUrl: "https://river-1.rutube.ru/hls-vod/iH9kDUtRpHjpcIFajhBzMg/1783330475/2660/0x5000039ce8409a21/90333e7e291f4c05803c90c428dd9c04.mp4.m3u8?i=808x1440_2694", thumb: "/videos/thumb-4.jpg" },
  { id: "5", title: "Бой столетия", hlsUrl: "https://river-1.rutube.ru/hls-vod/BPjP7lkQILJYSjrLontVEw/1783330477/3294/0x5000c500e874e7d0/43131b133c9c416bb23f28fa0cec6864.mp4.m3u8?i=808x1440_2955", thumb: "/videos/thumb-5.jpg" },
  { id: "6", title: "Форман чемпион", hlsUrl: "https://river-1.rutube.ru/hls-vod/RRqCppqoCL5mEgPSEoJjJQ/1783330480/3314/0x5000c500744761a0/d6afad9acc254d6b94b9bd62c9bc5b03.mp4.m3u8?i=808x1440_3071", thumb: "/videos/thumb-6.jpg" },
];

function VideoPlayer({ video, onBack }: { video: Video; onBack: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    if (Hls.isSupported()) {
      const hls = new Hls({ enableWorker: true, lowLatencyMode: true, maxBufferLength: 30 });
      hlsRef.current = hls;
      hls.loadSource(video.hlsUrl);
      hls.attachMedia(el);
      hls.on(Hls.Events.MANIFEST_PARSED, () => el.play().catch(() => {}));
      return () => { hls.destroy(); hlsRef.current = null; };
    }
    if (el.canPlayType("application/vnd.apple.mpegurl")) {
      el.src = video.hlsUrl;
      el.addEventListener("loadedmetadata", () => el.play().catch(() => {}));
    }
  }, [video.hlsUrl]);

  const handleContextMenu = useCallback((e: React.MouseEvent) => e.preventDefault(), []);

  return (
    <div className="mb-10">
      <button
        onClick={onBack}
        className="mb-4 px-4 py-2 text-sm bg-bg-card border border-border rounded-lg text-text-secondary hover:text-bronze transition-colors"
      >
        ← Назад к списку
      </button>
      <div className="mx-auto max-w-lg">
        <div
          className="relative w-full bg-black rounded-xl overflow-hidden shadow-2xl"
          onContextMenu={handleContextMenu}
        >
          <video
            ref={videoRef}
            controls
            controlsList="nodownload noplaybackrate"
            disablePictureInPicture
            autoPlay
            className="w-full"
            style={{ maxHeight: "70vh" }}
            onContextMenu={handleContextMenu}
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
