"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import { clubs } from "@/lib/data/clubs.data";
import { trainers } from "@/lib/data/trainers.data";
import { formatPrice } from "@/lib/utils/formatters";
import { cn } from "@/lib/utils/cn";

const dayLabels: Record<string, string> = {
  mon: "Пн", tue: "Вт", wed: "Ср", thu: "Чт", fri: "Пт", sat: "Сб", sun: "Вс",
};

export default function ClubPageClient({ slug }: { slug: string }) {
  const club = clubs.find((c) => c.slug === slug);
  const [activePhoto, setActivePhoto] = useState(0);
  const clubTrainers = club
    ? club.trainerIds.map((id) => trainers.find((t) => t.id === id)).filter(Boolean)
    : [];

  if (!club) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-6xl text-gradient-bronze mb-4">404</h1>
          <p className="text-text-secondary mb-6">Зал не найден</p>
          <Link href="/clubs" className="btn-primary">Вернуться к каталогу</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <section className="bg-bg-secondary py-4 border-b border-border">
        <div className="max-w-7xl mx-auto px-5">
          <nav className="text-sm text-text-muted">
            <Link href="/" className="hover:text-bronze transition-colors">Главная</Link>
            <span className="mx-2">/</span>
            <Link href="/clubs" className="hover:text-bronze transition-colors">Залы</Link>
            <span className="mx-2">/</span>
            <span className="text-text-secondary">{club.name}</span>
          </nav>
        </div>
      </section>

      {/* Hero */}
      <section className="bg-bg-primary py-8 lg:py-12 border-b border-border">
        <div className="max-w-7xl mx-auto px-5">
          <div className="grid lg:grid-cols-[1fr_350px] gap-8">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {club.isVerified && (
                  <span className="tag-bronze text-xs">✓ Verified</span>
                )}
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-bronze/15 text-bronze text-sm font-semibold">
                  ★ {club.rating} · {club.reviewCount} отзывов
                </span>
              </div>
              <h1 className="font-heading text-3xl lg:text-4xl font-bold text-text-primary mb-3">
                {club.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary mb-4">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-bronze" />
                  {club.city}, {club.address}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-bronze" />
                  {club.phone}
                </span>
                {club.email && (
                  <span className="inline-flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-bronze" />
                    {club.email}
                  </span>
                )}
              </div>
              <p className="text-text-secondary leading-relaxed">{club.description}</p>
            </div>

            {/* Photo gallery */}
            <div className="relative">
              <div className="relative aspect-square rounded-xl overflow-hidden bg-bg-elevated">
                {club.photos.length > 0 ? (
                  <img
                    src={club.photos[activePhoto]}
                    alt={club.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl text-bronze/30 font-heading">
                    {club.name.charAt(0)}
                  </div>
                )}
              </div>
              {club.photos.length > 1 && (
                <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                  {club.photos.map((photo, i) => (
                    <button
                      key={i}
                      onClick={() => setActivePhoto(i)}
                      className={cn(
                        "w-16 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-all",
                        activePhoto === i ? "border-bronze" : "border-transparent opacity-60 hover:opacity-100"
                      )}
                    >
                      <img src={photo} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      {club.pricing.length > 0 && (
        <section className="py-8 lg:py-12 border-b border-border">
          <div className="max-w-7xl mx-auto px-5">
            <h2 className="font-heading text-xl font-bold text-text-primary mb-4">Цены</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {club.pricing.map((item, i) => (
                <div key={i} className="bg-bg-card border border-border rounded-xl p-4">
                  <h3 className="font-medium text-text-primary mb-1">{item.name}</h3>
                  <p className="text-lg font-bold text-bronze">{formatPrice(item.price)}</p>
                  {item.features.length > 0 && (
                    <ul className="text-sm text-text-muted mt-1">
                      {item.features.map((f, fi) => <li key={fi}>{f}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Schedule */}
      {club.schedule.length > 0 && (
        <section className="py-8 lg:py-12 border-b border-border">
          <div className="max-w-7xl mx-auto px-5">
            <h2 className="font-heading text-xl font-bold text-text-primary mb-4">Расписание</h2>
            <div className="bg-bg-card border border-border rounded-xl p-4">
              <div className="grid gap-2">
                {club.schedule.map((s) => (
                  <div key={s.day} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <span className="font-medium text-text-primary">{dayLabels[s.day] || s.day}</span>
                    <span className="text-text-secondary">
                      {s.isClosed ? "Выходной" : s.sessions.map((ss) => `${ss.time} (${ss.type})`).join(", ")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Trainers */}
      {clubTrainers.length > 0 && (
        <section className="py-8 lg:py-12 border-b border-border">
          <div className="max-w-7xl mx-auto px-5">
            <h2 className="font-heading text-xl font-bold text-text-primary mb-4">Тренеры</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {clubTrainers.map((trainer) => trainer && (
                <div key={trainer.id} className="bg-bg-card border border-border rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    {trainer.photo ? (
                      <img src={trainer.photo} alt={`${trainer.firstName} ${trainer.lastName}`} className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-bronze/15 flex items-center justify-center text-bronze font-bold">
                        {trainer.firstName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3 className="font-medium text-text-primary">{trainer.firstName} {trainer.lastName}</h3>
                      <p className="text-sm text-text-muted">{trainer.experience} лет опыта</p>
                    </div>
                  </div>
                  {trainer.specializations.length > 0 && (
                    <p className="text-sm text-text-secondary">{trainer.specializations.join(", ")}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Tags */}
      {club.tags.length > 0 && (
        <section className="py-8 lg:py-12">
          <div className="max-w-7xl mx-auto px-5">
            <h2 className="font-heading text-xl font-bold text-text-primary mb-4">Направления</h2>
            <div className="flex flex-wrap gap-2">
              {club.tags.map((tag) => (
                <span key={tag} className="px-3 py-1.5 rounded-full bg-bg-elevated text-text-secondary text-sm border border-border">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
