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
    <div>
      {sections.map((section, i) => (
        <div key={i} style={{ height: '150vh', position: 'relative' }}>
          <div
            className="sticky top-0 overflow-hidden"
            style={{
              height: '100vh',
              zIndex: i,
              backgroundColor: i % 2 === 0 ? 'var(--color-bg-primary)' : 'var(--color-bg-secondary)',
            }}
          >
            {section}
          </div>
        </div>
      ))}
    </div>
  );
}
