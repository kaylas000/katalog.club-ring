"use client";

import { useState, useRef, useEffect } from "react";

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

  useEffect(() => {
    if (hovered && photos.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrent((prev) => (prev + 1) % photos.length);
      }, 800);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [hovered, photos.length]);

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
      onMouseLeave={() => { setHovered(false); setCurrent(0); }}
    >
      {photos.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={alt}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
          loading={i === 0 ? "eager" : "lazy"}
        />
      ))}
      {photos.length > 1 && (
        <div className="absolute bottom-2 left-2 z-10 flex gap-1">
          {photos.map((_, i) => (
            <span
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                i === current ? "bg-bronze w-3" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
