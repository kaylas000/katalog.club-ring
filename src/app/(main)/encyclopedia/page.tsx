import { Metadata } from "next";
import EncyclopediaClient from "./EncyclopediaClient";

export const metadata: Metadata = {
  title: "Энциклопедия бокса | Club-Ring",
  description: "Полная энциклопедия бокса: история, правила, техника, тренировки, экипировка, питание.",
};

export default function EncyclopediaPage() {
  return <EncyclopediaClient />;
}
