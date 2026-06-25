import Link from "next/link";
import { shopCategories } from "@/lib/config/navigation";

const footerSections = [
  {
    title: "Каталоги",
    links: [
      { label: "Боксёрские залы", href: "/clubs" },
    ],
  },
  {
    title: "Магазин",
    links: shopCategories.slice(0, 5).map((c) => ({
      label: c.name,
      href: `/shop/${c.slug}`,
    })),
  },
  {
    title: "Медиа",
    links: [
      { label: "Новости", href: "/news" },
      { label: "Видеотека", href: "/videos" },
      { label: "Энциклопедия", href: "/encyclopedia" },
    ],
  },
  {
    title: "О проекте",
    links: [
      { label: "О нас", href: "/about" },
      { label: "Контакты", href: "/contact" },
      { label: "Сотрудничество", href: "/cooperation" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-bg-secondary border-t border-border">
      <div className="max-w-7xl mx-auto px-5 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-heading font-semibold text-text-primary text-sm mb-4 uppercase tracking-wider">
                {section.title}
              </h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-secondary hover:text-bronze transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="divider-bronze my-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-display text-xl tracking-wider">
              <span className="text-text-primary">CLUB</span>
              <span className="text-bronze">-</span>
              <span className="text-bronze">RING</span>
            </span>
          </div>
          <p className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} Club-Ring. Все права защищены
          </p>
        </div>
      </div>
    </footer>
  );
}
