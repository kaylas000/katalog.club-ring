import type { Metadata } from "next";
import { clubs } from "@/lib/data/clubs.data";
import ClubPageClient from "./ClubPageClient";

type Props = {
  params: { slug: string };
};

export function generateStaticParams() {
  return clubs.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;
  const club = clubs.find((c) => c.slug === slug);

  if (!club) {
    return { title: "Зал не найден" };
  }

  return {
    title: `${club.name} — ${club.city}`,
    description: `${club.shortDescription}. ${club.city}, ${club.address}. Телефон: ${club.phone}. Рейтинг: ${club.rating}.`,
    openGraph: {
      title: `${club.name} — Club-Ring`,
      description: club.shortDescription,
      url: `https://club-ring.ru/clubs/${club.slug}`,
      type: "website",
    },
    alternates: {
      canonical: `https://club-ring.ru/clubs/${club.slug}`,
    },
  };
}

export default async function ClubPage({ params }: Props) {
  const { slug } = params;
  return <ClubPageClient slug={slug} />;
}
