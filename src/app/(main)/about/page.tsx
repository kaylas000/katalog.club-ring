import { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "О нас | Club-Ring",
  description: "Club-Ring — крупнейший каталог боксёрских залов России и магазин экипировки.",
};

export default function AboutPage() {
  return <AboutClient />;
}
