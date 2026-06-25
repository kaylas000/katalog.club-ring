import Link from "next/link";

export function CtaBanner() {
  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-5">
        <div className="relative bg-gradient-to-r from-bronze-dark to-bronze rounded-2xl overflow-hidden p-8 lg:p-12">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.2),transparent_50%)]" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="font-heading text-2xl lg:text-3xl font-bold text-bg-primary mb-2">
                Вы владелец зала или тренер?
              </h2>
              <p className="text-bg-primary/80 text-sm lg:text-base">
                Добавьте свой профиль бесплатно и привлекайте новых учеников
              </p>
            </div>
            <Link
              href="/contact"
              className="shrink-0 bg-bg-primary text-bronze font-heading font-semibold text-sm px-6 py-3 rounded-lg hover:bg-bg-elevated transition-colors"
            >
              Добавить профиль
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
