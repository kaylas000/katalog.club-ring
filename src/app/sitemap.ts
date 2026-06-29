import { MetadataRoute } from "next";
import { clubs } from "@/lib/data/clubs.data";
import { products } from "@/lib/data/products.data";
import { getAllArticles } from "@/lib/data/articles.data";
import { shopCategories } from "@/lib/config/navigation";

const BASE_URL = "https://club-ring.ru";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getAllArticles();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/clubs`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/shop`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/news`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE_URL}/encyclopedia`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/trainer`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/cooperation`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/game`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ];

  const clubPages: MetadataRoute.Sitemap = clubs.map((club) => ({
    url: `${BASE_URL}/clubs/${club.slug}`,
    lastModified: new Date(club.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const categoryPages: MetadataRoute.Sitemap = shopCategories.map((cat) => ({
    url: `${BASE_URL}/shop/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${BASE_URL}/shop/${p.category}/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const newsPages: MetadataRoute.Sitemap = articles
    .filter((a) => !a.isExternal)
    .map((a) => ({
      url: `${BASE_URL}/news/${a.slug}`,
      lastModified: new Date(a.date),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  return [...staticPages, ...clubPages, ...categoryPages, ...productPages, ...newsPages];
}
