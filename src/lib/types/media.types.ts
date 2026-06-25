export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author?: Author;
  category: string;
  categoryClass: "gold" | "silver";
  tags: string[];
  date: string;
  dateText: string;
  readTime: number;
  isPublished: boolean;
  isExternal: boolean;
  externalUrl?: string;
}

export interface Author {
  name: string;
  avatar?: string;
  bio?: string;
}

export type ArticleCategory =
  | "news"
  | "analytics"
  | "interview"
  | "technique"
  | "equipment-review"
  | "lifestyle";

export interface Video {
  id: string;
  youtubeId: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  category: VideoCategory;
  tags: string[];
  publishedAt: string;
  viewCount: number;
  isFeatured: boolean;
}

export type VideoCategory =
  | "training"
  | "fights"
  | "reviews"
  | "interviews"
  | "technique";
