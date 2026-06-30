import { Metadata } from "next";
import VideosClient from "./VideosClient";

export const metadata: Metadata = {
  title: "Видеотека — лучшие видео о боксе",
  description: "Видео о боксе: тренировки, техника ударов, разборы боёв, советы тренеров. Смотрите прямо на сайте без перехода на YouTube.",
  keywords: ["видео бокс", "бокс тренировка видео", "техника бокса", "boxing video", "бокс онлайн"],
  openGraph: {
    title: "Видеотека — Club-Ring",
    description: "Лучшие видео о боксе: тренировки, техника, бои",
    url: "https://club-ring.ru/videos",
    type: "website",
  },
  alternates: {
    canonical: "https://club-ring.ru/videos",
  },
};

export default function VideosPage() {
  return <VideosClient />;
}
