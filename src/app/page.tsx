import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedClubs } from "@/components/home/FeaturedClubs";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { LatestNews } from "@/components/home/LatestNews";
import { CtaBanner } from "@/components/home/CtaBanner";

export default function HomePage() {
  const sections = [
    <FeaturedClubs key="clubs" />,
    <FeaturedProducts key="products" />,
    <LatestNews key="news" />,
    <CtaBanner key="cta" />,
  ];

  return (
    <div>
      {/* Герой — всегда зафиксирован */}
      <div className="fixed inset-0 z-0">
        <HeroSection />
      </div>

      {/* Остальные секции — наезжают на героя */}
      <div className="relative z-10">
        {sections.map((section, i) => (
          <div key={i} style={{ height: '150vh' }}>
            <div
              className="sticky top-0 overflow-hidden"
              style={{
                height: '100vh',
                zIndex: i + 1,
                backgroundColor: i % 2 === 0 ? 'var(--color-bg-primary)' : 'var(--color-bg-secondary)',
              }}
            >
              {section}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
