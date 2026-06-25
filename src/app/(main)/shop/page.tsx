import type { Metadata } from "next";
import ShopPageClient from "./ShopPageClient";

export const metadata: Metadata = {
  title: "Боксёрская экипировка — магазин",
  description: "Магазин боксёрской экипировки: перчатки, защита, бинты, одежда, обувь. Профессиональное снаряжение для бокса.",
  openGraph: {
    title: "Боксёрская экипировка — Club-Ring",
    description: "Перчатки, защита, бинты, одежда для бокса",
    url: "https://club-ring.ru/shop",
    type: "website",
  },
  alternates: {
    canonical: "https://club-ring.ru/shop",
  },
};

export default function ShopPage() {
  return <ShopPageClient />;
}
