import type { Metadata, Viewport } from "next";
import { Fraunces, Plus_Jakarta_Sans, Syne } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/ui/SmoothScroll";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F2DFC9",
};

export const metadata: Metadata = {
  title:
    "CaroTine — Collection Officielle de Livres de Coloriage (Amazon KDP)",
  description:
    "Découvrez les 8 livres de coloriage créés par CaroTine (530K+ sur TikTok) : Automne Cozy, Petits Animaux, Noël des Capybaras, Axolotls, Dinosaures, Maisons Enchantées, Lolo & Lili et Les Vacances de Clem.",
  openGraph: {
    title: "CaroTine — Livres de Coloriage Officiels",
    description:
      "Feuilletez nos carnets de coloriage en 3D et commandez directement sur Amazon (Disponible en Prime).",
    type: "website",
    locale: "fr_FR",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      className={`${fraunces.variable} ${jakarta.variable} ${syne.variable}`}
    >
      <body className="font-sans antialiased selection:bg-autumn-saffron/20 selection:text-espresso-900">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
