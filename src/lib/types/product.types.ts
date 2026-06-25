export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: ProductCategory;
  subcategory: string;
  description: string;
  shortDescription: string;
  price: number;
  comparePrice?: number;
  currency: "RUB";
  images: string[];
  coverImage: string;
  videoUrl?: string;
  variants: ProductVariant[];
  specifications: Record<string, string>;
  features: string[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  isNew: boolean;
  isFeatured: boolean;
  isBestseller: boolean;
  tags: string[];
}

export interface ProductVariant {
  id: string;
  type: "size" | "color" | "weight";
  label: string;
  value: string;
  inStock: boolean;
  priceModifier?: number;
}

export type ProductCategory =
  | "gloves"
  | "protection"
  | "wraps"
  | "clothing"
  | "footwear"
  | "equipment"
  | "cosmetics"
  | "nutrition";
