"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { BOOKS, type Book, type BookCategory } from "@/data/books";
import CocoonPortal from "@/components/intro/CocoonPortal";
import CocoonAtmosphere from "@/components/ui/CocoonAtmosphere";
import EditorialHeader from "@/components/ui/EditorialHeader";
import HeroVisual from "@/components/hero/HeroVisual";
import BookGrid from "@/components/catalog/BookGrid";
import FlipbookModal from "@/components/preview/FlipbookModal";
import DuoStory from "@/components/story/DuoStory";
import EditorialFooter from "@/components/ui/EditorialFooter";
import StickyQuickCart from "@/components/ui/StickyQuickCart";

export default function ShowcaseExperience() {
  const [portalOpen, setPortalOpen] = useState(true);
  const [activeSeason, setActiveSeason] = useState<BookCategory>("automne");
  const [flipbookBook, setFlipbookBook] = useState<Book | null>(null);

  const handleOpenFeaturedFlipbook = () => {
    const featured =
      BOOKS.find((b) => b.category === activeSeason) ?? BOOKS[0];
    setFlipbookBook(featured);
  };

  const handlePortalEnter = (selectedBook?: Book) => {
    if (selectedBook) {
      setActiveSeason(selectedBook.category);
    }
    setPortalOpen(false);
  };

  return (
    <div className="relative min-h-screen flex flex-col text-espresso-900">
      {/* 0. Living Warm Cocooning Background (Chai Latte, Fairy Bokeh Lights & Sketchbook Grain) */}
      <CocoonAtmosphere activeSeason={activeSeason} />

      {/* 1. Fullscreen "WoW" Entrance Portal with Double-Curtain & Golden Iris Transition */}
      <CocoonPortal isOpen={portalOpen} onEnter={handlePortalEnter} />

      {/* 2. Main Showcase Experience (Revealed smoothly as the portal doors open) */}
      <motion.div
        initial={false}
        animate={
          portalOpen
            ? { scale: 0.96, opacity: 0.4, filter: "blur(4px)" }
            : { scale: 1, opacity: 1, filter: "blur(0px)" }
        }
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 min-h-screen flex flex-col"
      >
        {/* Editorial Navigation with Season Switcher & Intro Replay */}
        <EditorialHeader
          activeSeason={activeSeason}
          onSeasonChange={setActiveSeason}
          onOpenFeaturedFlipbook={handleOpenFeaturedFlipbook}
          onReplayIntro={() => setPortalOpen(true)}
        />

        {/* Main Content */}
        <main className="flex-1">
          {/* 1. Cinematic 3D Levitating Book Hero */}
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

          {/* 3. CaroTine Story + 9:16 TikTok Smartphone Mockup */}
          <DuoStory />
        </main>

        {/* Editorial Footer with All 7 Direct Amazon Links */}
        <EditorialFooter />
      </motion.div>

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
