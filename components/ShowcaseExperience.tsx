"use client";

import { useState } from "react";
import { BOOKS, type Book, type BookCategory } from "@/data/books";
import EditorialHeader from "@/components/ui/EditorialHeader";
import HeroVisual from "@/components/hero/HeroVisual";
import BookGrid from "@/components/catalog/BookGrid";
import FlipbookModal from "@/components/preview/FlipbookModal";
import DuoStory from "@/components/story/DuoStory";
import EditorialFooter from "@/components/ui/EditorialFooter";
import StickyQuickCart from "@/components/ui/StickyQuickCart";

export default function ShowcaseExperience() {
  const [activeSeason, setActiveSeason] = useState<BookCategory>("automne");
  const [flipbookBook, setFlipbookBook] = useState<Book | null>(null);

  const handleOpenFeaturedFlipbook = () => {
    const featured =
      BOOKS.find((b) => b.category === activeSeason) ?? BOOKS[0];
    setFlipbookBook(featured);
  };

  return (
    <div
      className={`min-h-screen flex flex-col bg-film-grain transition-colors duration-700 ${
        activeSeason === "noel" ? "bg-[#FAF8F5]" : "bg-[#FDFBF7]"
      }`}
    >
      {/* Editorial Navigation with Season Switcher */}
      <EditorialHeader
        activeSeason={activeSeason}
        onSeasonChange={setActiveSeason}
        onOpenFeaturedFlipbook={handleOpenFeaturedFlipbook}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* 1. Cinematic 3D Levitating Book Hero + Self-Drawing SVG Lines */}
        <HeroVisual
          activeSeason={activeSeason}
          onSeasonChange={setActiveSeason}
          onOpenFlipbook={(book) => setFlipbookBook(book)}
        />

        {/* 2. Physical Book Cards Catalogue with Sliding Interior Page Preview */}
        <BookGrid
          activeSeason={activeSeason}
          onSeasonChange={setActiveSeason}
          onOpenFlipbook={(book) => setFlipbookBook(book)}
        />

        {/* 3. Anne-Caroline & Clémentine Duo Story + 9:16 TikTok Smartphone Mockup */}
        <DuoStory />
      </main>

      {/* Editorial Footer with All 7 Direct Amazon Links */}
      <EditorialFooter />

      {/* Mobile-Only Sticky Quick-Cart Bar (Appears after scrolling past Hero) */}
      <StickyQuickCart
        activeSeason={activeSeason}
        onOpenPreview={(book) => setFlipbookBook(book)}
      />

      {/* Fullscreen Tactile Gestural Flipbook Modal ("Look Inside") */}
      <FlipbookModal
        book={flipbookBook}
        onClose={() => setFlipbookBook(null)}
        onSelectBook={(book) => setFlipbookBook(book)}
      />
    </div>
  );
}
