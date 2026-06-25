"use client";

export default function TrainerPage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Hero */}
      <section className="relative h-[calc(100dvh-4rem)] flex items-center overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover sm:object-top object-[90%_center] z-0"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/hero-video-trener.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 z-10 sm:block hidden" style={{ background: "linear-gradient(to right, rgba(10,10,11,1) 0%, rgba(10,10,11,0.9) 30%, rgba(10,10,11,0.4) 50%, transparent 55%)" }} />

        <div className="relative z-20 max-w-7xl mx-auto px-5 w-full">
          <div className="max-w-3xl">
            <div className="tag-bronze inline-block mb-4 animate-fade-in opacity-0" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
              Тренер по боксу и рукопашному бою
            </div>

            <h1 style={{ fontFamily: "'Oswald', sans-serif", animationDelay: "0.4s", animationFillMode: "forwards", lineHeight: "1.35" }} className="text-4xl sm:text-6xl lg:text-[85px] font-bold text-text-primary mb-6 animate-fade-in-up opacity-0">
              <span>БОКС И</span>
              <br />
              <span>РУКОПАШНЫЙ</span>
              <br />
              <span className="text-bronze inline-block" style={{ filter: "drop-shadow(0 1px 0 #0A0A0B) drop-shadow(0 2px 0 #0A0A0B) drop-shadow(0 3px 0 #0A0A0B) drop-shadow(0 4px 8px rgba(0,0,0,0.9))" }}>БОЙ</span>
            </h1>

            <p className="font-body text-lg sm:text-xl text-silver max-w-xl mb-8 animate-fade-in-up opacity-0" style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}>
              Индивидуальные тренировки. 35+ лет опыта. Галицыно и Москва.
            </p>

            <div className="flex flex-wrap gap-4 animate-fade-in-up opacity-0" style={{ animationDelay: "0.8s", animationFillMode: "forwards" }}>
              <a href="https://t.me/alexmoshe" className="btn-primary">
                Написать в Telegram
              </a>
              <a href="#services" className="btn-secondary">
                Узнать подробнее
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-8">
        <div className="max-w-[1100px] mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-9 items-center">
            <div className="bg-bg-card border border-border rounded-lg overflow-hidden">
              <img src="/alexmoshe.jpg" alt="Тренер по боксу Алексей" className="w-full h-auto block" width="300" height="400" loading="lazy" />
            </div>
            <div>
              <div className="tag-bronze text-[10px] mb-1.5 inline-block">Обо мне</div>
              <h2 className="font-heading text-2xl font-bold text-text-primary mb-1">Алексей — тренер по боксу</h2>
              <div className="text-sm font-medium text-bronze mb-4">Тренер по боксу и рукопашному бою</div>
              <p className="text-sm leading-relaxed mb-2.5 text-text-secondary">
                Занимаюсь боксом с 1990 года — более 35 лет в спорте. Передаю знания, которые получал годами: технику ударов, тактику боя, защиту и перемещения.
              </p>
              <p className="text-sm leading-relaxed mb-4 text-text-secondary">
                Работаю с новичками и опытными бойцами. Индивидуальный подход — не шаблонная программа, а конкретный план под ваши цели: самооборона, физическая форма или любительский бокс.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="tag-default text-xs">Бокс</span>
                <span className="tag-default text-xs">Рукопашный бой</span>
                <span className="tag-default text-xs">35+ лет в спорте</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-8">
        <div className="max-w-[1100px] mx-auto px-5">
          <div className="tag-bronze text-[10px] mb-1.5 inline-block">Тренировки</div>
          <h2 className="font-heading text-2xl font-bold tracking-tight mb-6 text-text-primary">Что вы получите</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: "👊", title: "Техника бокса", text: "Правильная стойка, удары (джеб, кросс, хук, апперкот), защита (блок, уклон, уход), перемещения по рингу. Ставлю с нуля или исправляю ошибки.", price: "3 000 ₽ / 2 часа" },
              { icon: "🧠", title: "Тактика и стратегия", text: "Как работать с разным противником, читать бой, принимать решения в ринге. Программа на основе реальных спаррингов.", price: "Включено в занятие" },
              { icon: "💪", title: "Физическая подготовка", text: "Выносливость, скорость, координация, сила ударов. Специальные комплексы под бокс и рукопашный бой.", price: "Включено в занятие" },
              { icon: "🎯", title: "Индивидуальная программа", text: "Программа под ваши цели: самооборона, похудение, подготовка к соревнованиям или просто поддержание формы.", price: "Гибкое расписание" },
            ].map((s) => (
              <div key={s.title} className="bg-bg-card border border-border rounded-xl p-6 hover:border-bronze-dark transition-colors">
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-bronze/10 text-lg mb-4">{s.icon}</div>
                <h3 className="font-heading font-semibold text-text-primary mb-2">{s.title}</h3>
                <p className="text-sm leading-relaxed mb-4 text-text-secondary">{s.text}</p>
                <div className="text-sm font-semibold text-bronze">{s.price}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-8">
        <div className="max-w-[1100px] mx-auto px-5">
          <div className="tag-bronze text-[10px] mb-1.5 inline-block">Преимущества</div>
          <h2 className="font-heading text-2xl font-bold tracking-tight mb-6 text-text-primary">Почему выбирают Club Ring</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { num: "01", title: "35+ лет опыта", text: "Занимаюсь боксом с 1990 года. Знания, которые невозможно получить из книг." },
              { num: "02", title: "Индивидуальный подход", text: "Программа под ваш уровень, возраст и цели. Не шаблон, а конкретный план." },
              { num: "03", title: "Безопасные тренировки", text: "Правильная техника с первого занятия. Минимум травм, максимум прогресса." },
              { num: "04", title: "Две локации", text: "Тренировки в Галицыно и Москве. Удобное расписание по договорённости." },
            ].map((b) => (
              <div key={b.num} className="flex gap-4 bg-bg-card border border-border rounded-xl p-6 hover:border-bronze-dark transition-colors">
                <div className="font-heading text-2xl font-bold shrink-0 text-bronze">{b.num}</div>
                <div>
                  <div className="font-heading font-semibold text-text-primary mb-1">{b.title}</div>
                  <div className="text-sm leading-relaxed text-text-secondary">{b.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Approach */}
      <section className="py-8">
        <div className="max-w-[1100px] mx-auto px-5">
          <h2 className="font-heading text-2xl font-bold tracking-tight mb-6 text-text-primary">Как проходят тренировки</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { num: "01", title: "Знакомство и диагностика", text: "Выясняю ваш уровень подготовки, цели и опыт. Определяю что нужно проработать в первую очередь." },
              { num: "02", title: "Персональная программа", text: "Составляю план тренировок под вас — не общие комплексы, а конкретные упражнения под ваши задачи." },
              { num: "03", title: "Практика и результат", text: "Вы видите прогресс уже через месяц. Уверенность в себе, хорошая форма, навыки самообороны." },
            ].map((a) => (
              <div key={a.num} className="bg-bg-card border border-border rounded-xl p-6 hover:border-bronze-dark transition-colors">
                <div className="font-heading text-2xl font-bold mb-3 text-bronze">{a.num}</div>
                <div className="font-heading font-semibold text-text-primary mb-1">{a.title}</div>
                <div className="text-sm leading-relaxed text-text-secondary">{a.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Locations */}
      <section id="locations" className="py-8">
        <div className="max-w-[1100px] mx-auto px-5">
          <div className="tag-bronze text-[10px] mb-1.5 inline-block">Локации</div>
          <h2 className="font-heading text-2xl font-bold tracking-tight mb-6 text-text-primary">Где тренируемся</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-bg-card border border-border rounded-xl p-6 hover:border-bronze-dark transition-colors">
              <div className="text-xl mb-3">📍</div>
              <div className="font-heading text-lg font-semibold text-text-primary mb-1">Галицыно</div>
              <div className="text-sm leading-relaxed text-text-secondary">Арендую зал по часам. Удобно для тех, кто живёт в Галицыно и окрестностях.</div>
            </div>
            <div className="bg-bg-card border border-border rounded-xl p-6 hover:border-bronze-dark transition-colors">
              <div className="text-xl mb-3">📍</div>
              <div className="font-heading text-lg font-semibold text-text-primary mb-1">Москва</div>
              <div className="text-sm leading-relaxed text-text-secondary">Также доступны тренировки в Москве. Договариваемся о месте и времени.</div>
            </div>
          </div>
        </div>
      </section>

      {/* YouTube */}
      <section className="py-12 text-center bg-bg-secondary border-y border-border">
        <div className="max-w-[1100px] mx-auto px-5">
          <p className="text-sm mb-5 text-text-secondary">Больше о тренировках — на YouTube-канале</p>
          <a href="https://www.youtube.com/@club-ring" target="_blank" rel="noopener noreferrer" className="btn-primary">
            ▶ Смотреть канал
          </a>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-8 bg-bg-secondary border-y border-border">
        <div className="max-w-[1100px] mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="tag-bronze text-[10px] mb-1.5 inline-block">Контакты</div>
              <h2 className="font-heading text-2xl font-bold tracking-tight mb-3 text-text-primary">Запишитесь на бесплатное пробное занятие</h2>
              <p className="text-sm mb-6 text-text-secondary">Звоните — если не ответю, напишите в Telegram или SMS по номеру. Отвечу на все вопросы.</p>
              <div className="flex gap-3 flex-wrap">
                <a href="tel:+79513584372" className="btn-primary min-w-[200px]">
                  +7 (951) 358-43-72
                </a>
                <a href="https://t.me/alexmoshe" className="btn-ghost min-w-[200px]">
                  Telegram
                </a>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div className="flex gap-3">
                <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-bronze/10 shrink-0 text-sm">▶</div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest mb-0.5 text-text-muted">YouTube</div>
                  <a href="https://www.youtube.com/@club-ring" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-text-primary hover:text-bronze transition-colors">club-ring</a>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-bronze/10 shrink-0 text-sm">💰</div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest mb-0.5 text-text-muted">Стоимость</div>
                  <div className="text-sm font-medium text-text-primary">3 000 ₽ / 2 часа</div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-bronze/10 shrink-0 text-sm">🕐</div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest mb-0.5 text-text-muted">Расписание</div>
                  <div className="text-sm font-medium text-text-primary">По договорённости</div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-bronze/10 shrink-0 text-sm">📍</div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest mb-0.5 text-text-muted">Локация</div>
                  <div className="text-sm font-medium text-text-primary">Галицыно, Москва</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center border-t border-border">
        <div className="max-w-[1100px] mx-auto px-5">
          <div className="text-xs text-text-muted">© 2026 Club Ring — тренер по боксу Алексей. Галицыно, Москва.</div>
          <div className="flex flex-wrap gap-4 mt-3 justify-center">
            <a href="#about" className="text-xs text-text-muted hover:text-bronze transition-colors">О тренере</a>
            <a href="#services" className="text-xs text-text-muted hover:text-bronze transition-colors">Услуги</a>
            <a href="#locations" className="text-xs text-text-muted hover:text-bronze transition-colors">Локации</a>
            <a href="#contact" className="text-xs text-text-muted hover:text-bronze transition-colors">Контакты</a>
            <a href="https://t.me/alexmoshe" target="_blank" rel="noopener noreferrer" className="text-xs text-text-muted hover:text-bronze transition-colors">Telegram</a>
            <a href="https://www.youtube.com/@club-ring" target="_blank" rel="noopener noreferrer" className="text-xs text-text-muted hover:text-bronze transition-colors">YouTube</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
