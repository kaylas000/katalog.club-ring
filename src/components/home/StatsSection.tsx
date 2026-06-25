"use client";

const stats = [
  { value: "500+", label: "Залов и клубов" },
  { value: "300+", label: "Тренеров" },
  { value: "12", label: "Стран СНГ" },
  { value: "1000+", label: "Товаров в магазине" },
];

export function StatsSection() {
  return (
    <section className="bg-bg-secondary py-8">
      <div className="max-w-7xl mx-auto px-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`text-center ${i < stats.length - 1 ? "lg:border-r lg:border-silver-dark" : ""}`}
            >
              <div className="font-display text-5xl lg:text-7xl text-gradient-bronze mb-2">
                {stat.value}
              </div>
              <div className="font-body text-sm text-silver">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
