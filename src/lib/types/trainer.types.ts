export interface Trainer {
  id: string;
  slug: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  photo: string;
  photos?: string[];
  city: string;
  country: string;
  clubIds: string[];
  bio: string;
  specializations: TrainerSpecialization[];
  sportAchievements: Achievement[];
  coachingAchievements: Achievement[];
  experience: number;
  certifications: string[];
  videoIds?: string[];
  contacts: {
    phone?: string;
    instagram?: string;
    vk?: string;
    telegram?: string;
  };
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  isFeatured: boolean;
}

export type TrainerSpecialization =
  | "дети"
  | "взрослые"
  | "женщины"
  | "профессионал"
  | "любитель"
  | "фитнес";

export interface Achievement {
  year: number;
  title: string;
  description?: string;
  level: "city" | "regional" | "national" | "international";
}
