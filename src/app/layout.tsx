import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: {
    default: "Club-Ring Боксёрские залы России. Спортивный магазин.",
    template: "%s | Club-Ring",
  },
  description: "Крупнейший каталог боксёрских залов России. Магазин экипировки. Энциклопедия бокса.",
  metadataBase: new URL("https://club-ring.ru"),
  openGraph: {
    siteName: "Club-Ring",
    locale: "ru_RU",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: "/apple-touch-icon.png",
    other: [
      { rel: "manifest", url: "/manifest.json" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="min-h-screen bg-bg-primary text-text-primary antialiased">
        <Header />
        <main className="pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
