export interface Review {
  id: string;
  authorName: string;
  authorAvatar?: string;
  rating: number;
  text: string;
  date: string;
  isVerified: boolean;
}

export interface FilterState {
  city?: string;
  country?: string;
  rating?: number;
  tags?: string[];
  priceMin?: number;
  priceMax?: number;
  sortBy?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T;
  meta?: PaginationMeta;
  error?: string;
}

export type { Club, ScheduleDay, PricingPlan, ClubTag } from "./club.types";
export type { Trainer, TrainerSpecialization, Achievement } from "./trainer.types";
export type { Product, ProductVariant, ProductCategory } from "./product.types";
export type { Article, Author, ArticleCategory, Video, VideoCategory } from "./media.types";
export type { EncyclopediaSection, EncyclopediaSubsection, FaqItem } from "./encyclopedia.types";
