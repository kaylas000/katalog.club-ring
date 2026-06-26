"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface ClubCardPhotoProps {
  photos: string[];
  fallback?: string;
  alt: string;
  className?: string;
}

export function ClubCardPhoto({ photos, fallback, alt, className = "" }: ClubCardPhotoProps) {
  const [current, setCurrent] = useState(0);
  const [hovered, setHovered] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStart = useRef<number | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (photos.length <= 1) return;
    if (hovered) {
      clearTimer();
      return;
    }
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % photos.length);
    }, 1200);
    return clearTimer;
  }, [hovered, photos.length, clearTimer]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
    clearTimer();
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 30) {
      setCurrent((prev) =>
        diff > 0
          ? (prev + 1) % photos.length
          : (prev - 1 + photos.length) % photos.length
      );
    }
    touchStart.current = null;
    if (!hovered && photos.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrent((prev) => (prev + 1) % photos.length);
      }, 1200);
    }
  };

  if (!photos.length) {
    return (
      <div className={`absolute inset-0 flex items-center justify-center text-4xl font-heading text-bronze/30 ${className}`}>
        {fallback || "?"}
      </div>
    );
  }

  return (
    <div
      className={`absolute inset-0 ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {photos.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={`${alt} — фото ${i + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
          loading={i === 0 ? "eager" : "lazy"}
        />
      ))}
      {photos.length > 1 && (
        <div className="absolute bottom-2 left-2 z-10 flex gap-1">
          {photos.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.preventDefault(); setCurrent(i); clearTimer(); }}
              className={`rounded-full transition-all duration-300 ${
                i === current ? "bg-bronze w-3 h-1.5" : "bg-white/50 w-1.5 h-1.5"
              }`}
            />
          ))}
        </div>
      )}
      {photos.length > 1 && (
        <div className="absolute bottom-2 right-2 z-10 bg-black/50 rounded px-1.5 py-0.5 text-[10px] text-white/80 font-mono">
          {current + 1}/{photos.length}
        </div>
      )}
    </div>
  );
}
