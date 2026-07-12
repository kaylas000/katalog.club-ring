"use client";

import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative h-screen flex items-center overflow-hidden bg-bg-primary">
      <video
        className="absolute inset-0 w-full h-full object-cover sm:object-top object-[80%_center] z-0"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 z-10 sm:block hidden" style={{ background: "linear-gradient(to right, rgba(10,10,11,1) 0%, rgba(10,10,11,0.9) 30%, rgba(10,10,11,0.4) 50%, transparent 55%)" }} />

      <div className="relative z-20 max-w-7xl mx-auto px-5 w-full">
        <div className="max-w-3xl">
          <p className="font-mono text-xs font-medium text-bronze uppercase tracking-[0.2em] mb-4 animate-fade-in opacity-0" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
            Каталог залов бокса России · Спортивный магазин
          </p>

          <h1 style={{ fontFamily: "'Oswald', sans-serif", animationDelay: "0.4s", animationFillMode: "forwards", lineHeight: "1.35" }} className="text-4xl sm:text-6xl lg:text-[90px] font-bold text-text-primary mb-6 animate-fade-in-up opacity-0">
            <span>БОКС РОССИИ</span>
            <br />
            <span className="text-bronze inline-block" style={{ filter: "drop-shadow(0 1px 0 #0A0A0B) drop-shadow(0 2px 0 #0A0A0B) drop-shadow(0 3px 0 #0A0A0B) drop-shadow(0 4px 8px rgba(0,0,0,0.9))" }}>КЛУБ РИНГ</span>
          </h1>

          <p className="font-body text-lg sm:text-xl text-silver max-w-xl mb-8 animate-fade-in-up opacity-0" style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}>
            Залы, экипировка и всё о боксе в одном месте
          </p>

          <div className="flex flex-wrap gap-4 animate-fade-in-up opacity-0" style={{ animationDelay: "0.8s", animationFillMode: "forwards" }}>
            <Link href="/clubs" className="btn-primary">
              Найти зал
            </Link>
            <Link href="/shop" className="btn-secondary">
              В магазин
            </Link>
            <Link href="/videos" className="btn-ghost">
              Смотреть видео
            </Link>
          </div>
        </div>
      </div>

    </section>
  );
}