import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedClubs } from "@/components/home/FeaturedClubs";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { LatestNews } from "@/components/home/LatestNews";
import { CtaBanner } from "@/components/home/CtaBanner";

export default function HomePage() {
  const sections = [
    <HeroSection key="hero" />,
    <FeaturedClubs key="clubs" />,
    <FeaturedProducts key="products" />,
    <LatestNews key="news" />,
    <CtaBanner key="cta" />,
  ];

  return (
    <div className="relative" style={{ height: `${sections.length * 100}vh` }}>
      {sections.map((section, i) => (
        <div
          key={i}
          className="sticky top-0 h-screen overflow-hidden"
          style={{
            zIndex: i,
            backgroundColor: i % 2 === 0 ? 'var(--color-bg-primary)' : 'var(--color-bg-secondary)',
          }}
        >
          {section}
        </div>
      ))}
    </div>
  );
}
