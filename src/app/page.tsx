import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedClubs } from "@/components/home/FeaturedClubs";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { LatestNews } from "@/components/home/LatestNews";
import { CtaBanner } from "@/components/home/CtaBanner";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedClubs />
      <FeaturedProducts />
      <LatestNews />
      <CtaBanner />
    </>
  );
}
