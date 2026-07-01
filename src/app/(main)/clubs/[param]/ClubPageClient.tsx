"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, Phone, Mail, Star, Check, ChevronRight, ChevronLeft } from "lucide-react";
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
    <div className="min-h-screen bg-bg-primary">
      <div className="bg-bg-secondary border-b border-border">
        <div className="max-w-[1200px] mx-auto px-[18px] py-5">
          <nav className="breadcrumbs text-[13px] text-text-muted mb-4 flex items-center gap-2">
            <Link href="/" className="text-bronze-light hover:text-bronze transition-colors">Главная</Link>
            <span className="text-border">/</span>
            <Link href="/clubs" className="text-bronze-light hover:text-bronze transition-colors">Залы</Link>
            <span className="text-border">/</span>
            <span className="text-text-secondary">{club.name}</span>
          </nav>

          <h1 className="font-heading text-[clamp(24px,4vw,34px)] font-bold text-text-primary tracking-tight">
            {club.name}
          </h1>

          <div className="flex flex-wrap items-center gap-3 mt-3">
            {club.isVerified && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-success/10 text-success border border-success/25 text-xs font-semibold">
                <Check className="w-3 h-3" /> Проверен
              </span>
            )}
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-bronze/10 text-bronze border border-bronze/25 text-xs font-semibold">
              ★ {club.rating}
            </span>
            <span className="text-xs text-text-muted">{club.reviewCount} отзывов</span>
            <span className="text-xs text-text-muted flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {club.city}, {club.country}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-[18px] py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-8 items-start">
          <div className="space-y-6">
            <div className="bg-bg-card border border-border rounded-xl p-5">
              <h2 className="text-[20px] font-bold text-text-primary mb-3 pb-3 border-b border-border">
                О зале
              </h2>
              <p className="text-[15px] text-text-secondary leading-[1.7]">{club.description}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {club.tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-bg-elevated border border-border text-xs font-medium text-text-secondary">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {club.photos.length > 0 && (
              <div className="rounded-xl overflow-hidden" style={{ background: "linear-gradient(160deg, #1a1a1f 0%, #111114 55%, #111114 100%)", border: "1px solid rgba(201,162,39,0.1)" }}>
                <div className="p-4">
                  <div
                    className="rounded-xl overflow-hidden aspect-[4/5] sm:aspect-video lg:aspect-auto lg:h-[500px] mb-4"
                    style={{ border: "2px solid #C9A227" }}
                  >
                    <img
                      src={club.photos[activePhoto]}
                      alt={`${club.name} — фото ${activePhoto + 1}`}
                      style={{ width: "calc(100% - 16px)", height: "calc(100% - 16px)", objectFit: "contain", display: "block", margin: "8px auto" }}
                    />
                  </div>

                  <div className="hidden sm:flex gap-2.5">
                    {club.photos.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActivePhoto(i)}
                        className={cn(
                          "flex-1 h-[80px] rounded-xl border overflow-hidden transition-all",
                          activePhoto === i
                            ? "border-bronze/50 ring-1 ring-bronze/30"
                            : "border-border hover:border-bronze/30"
                        )}
                      >
                        <img
                          src={club.photos[i]}
                          alt={`Фото ${i + 1}`}
                          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="sm:hidden flex items-center justify-between px-2 py-3 border-t border-border/30">
                  <button
                    onClick={() => setActivePhoto((prev) => (prev > 0 ? prev - 1 : club.photos.length - 1))}
                    className="w-11 h-11 rounded-full border border-bronze/30 bg-bg-elevated/70 flex items-center justify-center text-text-secondary hover:text-bronze hover:border-bronze/50 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-sm text-text-secondary font-mono tracking-wider">{activePhoto + 1} / {club.photos.length}</span>
                  <button
                    onClick={() => setActivePhoto((prev) => (prev < club.photos.length - 1 ? prev + 1 : 0))}
                    className="w-11 h-11 rounded-full border border-bronze/30 bg-bg-elevated/70 flex items-center justify-center text-text-secondary hover:text-bronze hover:border-bronze/50 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {clubTrainers.length > 0 && (
              <div>
                <div className="flex items-end justify-between mb-4">
                  <div>
                    <span className="tag-bronze mb-2 inline-block">Команда</span>
                    <h2 className="text-[20px] font-bold text-text-primary">
                      Тренеры зала
                    </h2>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {clubTrainers.map((trainer) => (
                    <div
                      key={trainer!.id}
                      className="bg-bg-card border border-border rounded-xl overflow-hidden group hover:border-bronze/30 transition-all duration-300"
                    >
                      <div className="grid grid-cols-[140px_minmax(0,1fr)] sm:grid-cols-[160px_minmax(0,1fr)]">
                        <div className="relative aspect-[3/4] sm:aspect-auto sm:h-full bg-gradient-to-br from-bronze/15 to-bg-elevated overflow-hidden">
                          <div className="absolute inset-0 flex items-center justify-center text-5xl font-heading text-bronze/20">
                            {trainer!.firstName.charAt(0)}{trainer!.lastName.charAt(0)}
                          </div>
                          {trainer!.isVerified && (
                            <div className="absolute top-2 left-2 z-10">
                              <span className="tag-bronze text-[9px]">✓ Verified</span>
                            </div>
                          )}
                          <div className="absolute bottom-2 left-2 z-10">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-bronze/90 text-bg-primary text-xs font-semibold">
                              ★ {trainer!.rating}
                            </span>
                          </div>
                        </div>
                        <div className="p-4 flex flex-col">
                          <div className="flex flex-wrap gap-1.5 mb-2">
                            {trainer!.certifications.slice(0, 2).map((cert) => (
                              <span key={cert} className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-bronze/10 text-bronze border border-bronze/20">
                                {cert}
                              </span>
                            ))}
                          </div>
                          <h3 className="font-heading font-bold text-text-primary text-base group-hover:text-bronze transition-colors mb-0.5">
                            {trainer!.firstName} {trainer!.lastName}
                          </h3>
                          <p className="text-xs text-text-muted mb-2">{trainer!.city} · Опыт {trainer!.experience} лет</p>
                          <p className="text-[13px] text-text-secondary leading-relaxed line-clamp-3 mb-3">
                            {trainer!.bio}
                          </p>
                          {trainer!.sportAchievements.length > 0 && (
                            <div className="mt-auto pt-3 border-t border-border">
                              <div className="flex flex-wrap gap-1.5">
                                {trainer!.sportAchievements.slice(0, 2).map((a) => (
                                  <span key={a.year + a.title} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-success/10 text-success border border-success/20 text-[10px] font-medium">
                                    {a.level === "international" ? "🌍" : a.level === "national" ? "🇷🇺" : "📍"} {a.title}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {club.schedule.length > 0 && (
              <div className="bg-bg-card border border-border rounded-xl p-5">
                <h2 className="text-[20px] font-bold text-text-primary mb-4 pb-3 border-b border-border">
                  Расписание
                </h2>
                <div className="space-y-2">
                  {club.schedule.map((day) => (
                    <div
                      key={day.day}
                      className={`flex items-center gap-4 p-3 rounded-lg ${day.isClosed ? "opacity-50" : "bg-bg-elevated/50"}`}
                    >
                      <span className="w-20 font-mono text-xs text-text-secondary uppercase tracking-wider">
                        {dayLabels[day.day] || day.day}
                      </span>
                      {day.isClosed ? (
                        <span className="text-xs text-text-muted">Выходной</span>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {day.sessions.map((s, i) => (
                            <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-full bg-bg-elevated border border-border text-[11px] font-medium text-text-secondary">
                              {s.time} — {s.type}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {club.pricing.length > 0 && (
              <div className="bg-bg-card border border-border rounded-xl p-5">
                <h2 className="text-[20px] font-bold text-text-primary mb-4 pb-3 border-b border-border">
                  Прайс-лист
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {club.pricing.map((plan) => (
                    <div
                      key={plan.name}
                      className="bg-bg-elevated border border-border rounded-xl p-5 text-center"
                    >
                      <h3 className="font-heading font-semibold text-text-primary text-sm mb-2">
                        {plan.name}
                      </h3>
                      <div className="font-display text-2xl text-bronze mb-3">
                        {formatPrice(plan.price)}
                      </div>
                      <ul className="space-y-1.5">
                        {plan.features.map((f) => (
                          <li key={f} className="text-xs text-text-secondary flex items-center gap-1.5">
                            <span className="text-bronze">✓</span> {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-bg-card border border-border rounded-xl p-5 sticky top-14">
              <h3 className="text-[16px] font-bold text-text-primary mb-4">Контакты</h3>
              <div className="space-y-3">
                <a href={`tel:${club.phone}`} className="flex items-center gap-3 text-[14px] text-text-secondary hover:text-bronze transition-colors py-2 border-b border-border">
                  <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-bronze/10 shrink-0">
                    <Phone className="w-4 h-4 text-bronze" />
                  </div>
                  <span className="text-bronze font-semibold underline decoration-bronze/30 underline-offset-2">{club.phone}</span>
                </a>
                {club.email && (
                  <a href={`mailto:${club.email}`} className="flex items-center gap-3 text-[14px] text-text-secondary hover:text-bronze transition-colors py-2 border-b border-border">
                    <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-bronze/10 shrink-0">
                      <Mail className="w-4 h-4 text-bronze" />
                    </div>
                    <span className="text-bronze font-semibold underline decoration-bronze/30 underline-offset-2 break-all">{club.email}</span>
                  </a>
                )}
                <div className="flex items-center gap-3 text-[14px] text-text-secondary py-2 border-b border-border">
                  <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-bronze/10 shrink-0">
                    <MapPin className="w-4 h-4 text-bronze" />
                  </div>
                  {club.address}
                </div>
                {club.website && (
                  <a href={club.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[14px] text-text-secondary hover:text-bronze transition-colors py-2 border-b border-border">
                    <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-bronze/10 shrink-0 text-sm">🌐</div>
                    <span className="text-bronze font-semibold underline decoration-bronze/30 underline-offset-2 break-all">{club.website.replace("https://", "")}</span>
                  </a>
                )}
              </div>

              <button className="btn-primary w-full mt-5">Записаться</button>
            </div>

            {club.isVerified && (
              <div className="bg-bg-card border border-border rounded-xl p-5">
                <h3 className="text-[14px] font-bold text-text-primary mb-3">Проверка данных</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[13px] text-text-secondary py-1.5 border-b border-border">
                    <Check className="w-3.5 h-3.5 text-success shrink-0" /> Данные подтверждены
                  </div>
                  <div className="flex items-center gap-2 text-[13px] text-text-secondary py-1.5 border-b border-border">
                    <Check className="w-3.5 h-3.5 text-success shrink-0" /> Актуальные контакты
                  </div>
                  <div className="flex items-center gap-2 text-[13px] text-text-secondary py-1.5">
                    <Check className="w-3.5 h-3.5 text-success shrink-0" /> Реальные отзывы
                  </div>
                </div>
              </div>
            )}

            <div className="bg-bg-card border border-border rounded-xl p-5">
              <h3 className="text-[14px] font-bold text-text-primary mb-3">Рейтинг</h3>
              <div className="flex items-center gap-3">
                <span className="font-display text-3xl text-bronze">{club.rating}</span>
                <div>
                  <div className="flex items-center gap-0.5 text-bronze text-sm">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`w-4 h-4 ${s <= Math.round(club.rating) ? "fill-bronze" : ""}`} />
                    ))}
                  </div>
                  <div className="text-[12px] text-text-muted mt-0.5">{club.reviewCount} отзывов</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}