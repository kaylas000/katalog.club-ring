import type { Metadata } from "next";
import { clubs } from "@/lib/data/clubs.data";
import { locations } from "@/lib/data/locations.data";
import ParamClient from "./ParamClient";
import ClubPageClient from "./ClubPageClient";

type Props = {
  params: { param: string };
};

function decodeParam(raw: string): string {
  return decodeURIComponent(raw).replace(/-/g, " ");
}

function findByParam(param: string) {
  const decoded = decodeParam(param);

  const cityMatch = locations.find(
    (l) => l.label.toLowerCase() === decoded.toLowerCase()
  );
  if (cityMatch) return { type: "city" as const, location: cityMatch };

  const regionMatch = locations.find(
    (l) => l.kind === "region" && l.label.toLowerCase() === decoded.toLowerCase()
  );
  if (regionMatch) return { type: "region" as const, location: regionMatch };

  const clubMatch = clubs.find((c) => c.slug === param);
  if (clubMatch) return { type: "club" as const, club: clubMatch };

  return null;
}

export function generateStaticParams() {
  const params: { param: string }[] = [];

  for (const l of locations) {
    params.push({ param: l.label });
  }
  for (const c of clubs) {
    params.push({ param: c.slug });
  }

  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const result = findByParam(params.param);

  if (!result) {
    return { title: "Не найдено" };
  }

  if (result.type === "city") {
    const city = result.location.label;
    return {
      title: `Боксёрские залы ${city} — каталог`,
      description: `Каталог боксёрских залов ${city}. Расписание, цены, тренеры.`,
      alternates: {
        canonical: `https://club-ring.ru/clubs/${encodeURIComponent(city)}`,
      },
    };
  }

  if (result.type === "region") {
    const region = result.location.label;
    return {
      title: `Боксёрские залы ${region} — каталог`,
      description: `Каталог боксёрских залов ${region}. Расписание, цены, тренеры.`,
      alternates: {
        canonical: `https://club-ring.ru/clubs/${encodeURIComponent(region)}`,
      },
    };
  }

  const club = result.club;
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

export default async function ParamPage({ params }: Props) {
  const result = findByParam(params.param);

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-3xl font-bold text-text-primary mb-4">Не найдено</h1>
          <a href="/clubs" className="text-bronze hover:underline">Вернуться к каталогу</a>
        </div>
      </div>
    );
  }

  if (result.type === "club") {
    return <ClubPageClient slug={params.param} />;
  }

  return <ParamClient location={result.location} />;
}
