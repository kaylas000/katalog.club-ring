import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Боксёрская игра онлайн — тренировка и бои",
  description: "Бесплатная 2D боксёрская игра. Тренировка на груше, бои с компьютером и другими игроками. Управление: WASD + удары. Играй на телефоне и компьютере.",
  keywords: ["боксёрская игра", "boxing game", "бокс онлайн", "игра бокс", "boxing online", "файтинг", "2d fighting game", "бокс мини-игра"],
  openGraph: {
    title: "Боксёрская игра — Club-Ring",
    description: "Бесплатная 2D боксёрская игра. Тренируйся и сражайся!",
    url: "https://club-ring.ru/game",
    type: "website",
  },
  alternates: {
    canonical: "https://club-ring.ru/game",
  },
};

export default function GameLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
