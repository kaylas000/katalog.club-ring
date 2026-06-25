import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary">
      <div className="text-center px-4">
        <div className="font-display text-[120px] sm:text-[180px] lg:text-[200px] leading-none text-gradient-bronze mb-4">
          404
        </div>
        <h1 className="font-heading text-2xl lg:text-3xl font-bold text-text-primary mb-2">
          Угол не найден
        </h1>
        <p className="text-text-secondary mb-8">
          Эта страница вышла из ринга
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/" className="btn-primary">
            На главную
          </Link>
          <Link href="/clubs" className="btn-secondary">
            Найти зал
          </Link>
        </div>
      </div>
    </div>
  );
}
