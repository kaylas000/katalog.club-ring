import { shopCategories } from "@/lib/config/navigation";

export function generateStaticParams() {
  return shopCategories.map((cat) => ({ category: cat.slug }));
}

export default function CategoryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
