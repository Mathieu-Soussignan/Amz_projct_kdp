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
  themeColor: "#FDFBF7",
};

export const metadata: Metadata = {
  title:
    "Anne-Caroline & Clémentine — Collection Officielle de Livres de Coloriage (Amazon KDP)",
  description:
    "Découvrez les 7 livres de coloriage Bold & Easy créés par Anne-Caroline (530K+ sur TikTok) et Clémentine : Automne Cozy, Automne Gourmand, Petits Animaux, Noël des Capybaras, Axolotls, Dinosaures et Lolo & Lili.",
  openGraph: {
    title: "Anne-Caroline & Clémentine — Livres de Coloriage Officiels",
    description:
      "Feuilletez nos 7 carnets de coloriage en 3D et commandez directement sur Amazon (Disponible en Prime).",
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
