export interface Club {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  city: string;
  country: string;
  address: string;
  coordinates: { lat: number; lng: number };
  phone: string;
  email?: string;
  website?: string;
  socials: {
    instagram?: string;
    vk?: string;
    telegram?: string;
    youtube?: string;
  };
  photos: string[];
  coverPhoto: string;
  schedule: ScheduleDay[];
  pricing: PricingPlan[];
  tags: ClubTag[];
  trainerIds: string[];
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleDay {
  day: "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
  sessions: { time: string; duration: number; type: string; trainer?: string }[];
  isClosed: boolean;
}

export interface PricingPlan {
  name: string;
  price: number;
  currency: "RUB" | "KZT" | "UAH" | "BYN" | "USD";
  period: "month" | "session" | "year";
  features: string[];
}

export type ClubTag =
  | "бокс"
  | "дети"
  | "женщины"
  | "любитель"
  | "профессионал"
  | "фитнес-бокс"
  | "фитнес";
