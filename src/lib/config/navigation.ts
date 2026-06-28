export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
  external?: boolean;
}

export const mainNavigation: NavItem[] = [
  { label: "Главная", href: "/" },
  { label: "Тренер", href: "/trainer" },
  { label: "Залы", href: "/clubs" },
  {
    label: "Магазин",
    href: "/shop",
    children: [
      { label: "Перчатки", href: "/shop/gloves" },
      { label: "Защита", href: "/shop/protection" },
      { label: "Бинты", href: "/shop/wraps" },
      { label: "Одежда", href: "/shop/clothing" },
      { label: "Обувь", href: "/shop/footwear" },
      { label: "Оборудование", href: "/shop/equipment" },
      { label: "Косметика", href: "/shop/cosmetics" },
      { label: "Питание", href: "/shop/nutrition" },
    ],
  },
  {
    label: "Медиа",
    href: "/news",
    children: [
      { label: "Новости", href: "/news" },
      { label: "Видеотека", href: "/videos" },
    ],
  },
  { label: "Энциклопедия", href: "/encyclopedia" },
  { label: "Игра", href: "/game" },
];

export const shopCategories = [
  { slug: "gloves", name: "Перчатки", icon: "🥊" },
  { slug: "protection", name: "Защита", icon: "🛡️" },
  { slug: "wraps", name: "Бинты", icon: "🩹" },
  { slug: "clothing", name: "Одежда", icon: "👕" },
  { slug: "footwear", name: "Обувь", icon: "👟" },
  { slug: "equipment", name: "Оборудование", icon: "🏋️" },
  { slug: "cosmetics", name: "Косметика", icon: "🧴" },
  { slug: "nutrition", name: "Питание", icon: "💪" },
];
