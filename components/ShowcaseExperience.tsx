"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { BOOKS, type Book, type BookCategory } from "@/data/books";
import CocoonPortal, {
  detectCalendarSeason,
} from "@/components/intro/CocoonPortal";
import CocoonAtmosphere from "@/components/ui/CocoonAtmosphere";
import CocoonAmbienceBar from "@/components/ui/CocoonAmbienceBar";
import CustomCursor from "@/components/ui/CustomCursor";
import EditorialHeader from "@/components/ui/EditorialHeader";
import HeroVisual from "@/components/hero/HeroVisual";
import BookGrid from "@/components/catalog/BookGrid";
import InteractiveColoringStudio from "@/components/studio/InteractiveColoringStudio";
import GiftBundleBuilder from "@/components/gift/GiftBundleBuilder";
import CommunityLoveWall from "@/components/social/CommunityLoveWall";
import FlipbookModal from "@/components/preview/FlipbookModal";
import DuoStory from "@/components/story/DuoStory";
import EditorialFooter from "@/components/ui/EditorialFooter";
import StickyQuickCart from "@/components/ui/StickyQuickCart";

export default function ShowcaseExperience() {
  const [portalOpen, setPortalOpen] = useState(true);
  const [activeSeason, setActiveSeason] = useState<BookCategory>("automne");
  const [flipbookBook, setFlipbookBook] = useState<Book | null>(null);
  const [candlelightMode, setCandlelightMode] = useState(false);

  // Automatically sync initial season with the visitor's real calendar date
  useEffect(() => {
    const { season } = detectCalendarSeason(new Date());
    if (season === "noel") {
      setActiveSeason("noel");
    } else if (season === "ete") {
      setActiveSeason("classique");
    } else {
      setActiveSeason("automne");
    }
  }, []);

  const handleOpenFeaturedFlipbook = () => {
    const featured =
      BOOKS.find((b) => b.category === activeSeason) ?? BOOKS[0];
    setFlipbookBook(featured);
  };

  const handlePortalEnter = (
    selectedBook?: Book,
    detectedSeason?: BookCategory
  ) => {
    if (selectedBook) {
      setActiveSeason(selectedBook.category);
    } else if (detectedSeason) {
      setActiveSeason(detectedSeason);
    }
    setPortalOpen(false);
  };

  return (
    <div className="relative min-h-screen flex flex-col text-espresso-900">
      {/* Awwwards Context-Aware Spring Cursor (Desktop Pointer Only) */}
      <CustomCursor />

      {/* 0. Living Warm Cocooning Background (Chai Latte, Fairy Bokeh Lights & Sketchbook Grain) */}
      <CocoonAtmosphere activeSeason={activeSeason} />

      {/* 1. Fullscreen "WoW" Entrance Portal with Date-Synced Seasonal Animation & Curtain Transition */}
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
          candlelightMode={candlelightMode}
          onToggleCandlelight={() => setCandlelightMode((v) => !v)}
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

          {/* 3. Interactive "Try Before You Buy" Coloring Studio & Line-Art X-Ray Slider */}
          <InteractiveColoringStudio />

          {/* 4. Interactive 3D Gift Bundle Builder (Duo / Trio Cocooning) */}
          <GiftBundleBuilder />

          {/* 5. Kinetic Ribbon + 1-Click Mood Matcher Quiz + Verified Reader Love Wall */}
          <CommunityLoveWall
            onOpenFlipbook={(book) => setFlipbookBook(book)}
          />

          {/* 6. CaroTine Story + Wax-Sealed Creator Postcard + 9:16 TikTok Smartphone Mockup */}
          <DuoStory />
        </main>

        {/* Editorial Footer with All 8 Direct Amazon Links */}
        <EditorialFooter />
      </motion.div>

      {/* Floating Vinyl Radio & Candlelight Evening Controller */}
      <CocoonAmbienceBar
        candlelightMode={candlelightMode}
        onToggleCandlelight={() => setCandlelightMode((v) => !v)}
      />

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
