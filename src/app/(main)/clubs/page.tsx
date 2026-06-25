import type { Metadata } from "next";
import ClubsPageClient from "./ClubsPageClient";

export const metadata: Metadata = {
  title: "Боксёрские залы России — каталог",
  description: "Каталог боксёрских залов России. Расписание, цены, тренеры. Найдите лучший зал в вашем городе.",
  openGraph: {
    title: "Боксёрские залы России — Club-Ring",
    description: "Каталог залов с расписанием, ценами и тренерами",
    url: "https://club-ring.ru/clubs",
    type: "website",
  },
  alternates: {
    canonical: "https://club-ring.ru/clubs",
  },
};

export default function ClubsPage() {
  return <ClubsPageClient />;
}
