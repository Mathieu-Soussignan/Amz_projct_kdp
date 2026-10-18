"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, BookOpen, Sparkles } from "lucide-react";
import { BOOKS, BLUR_PLACEHOLDER, type Book, type BookCategory } from "@/data/books";

interface StickyQuickCartProps {
  activeSeason: BookCategory;
  onOpenPreview: (book: Book) => void;
}

export default function StickyQuickCart({
  activeSeason,
  onOpenPreview,
}: StickyQuickCartProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show once user scrolls past the Hero section (~540px)
      setVisible(window.scrollY > 520);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Select the flagship book of the active season
  const featuredBook =
    BOOKS.find((b) => b.category === activeSeason) ?? BOOKS[0];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 110, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 110, opacity: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 26 }}
          className="md:hidden fixed bottom-3 inset-x-3 z-40 pointer-events-none"
        >
          <div className="pointer-events-auto rounded-2xl bg-espresso-900/95 backdrop-blur-xl border border-white/15 p-2.5 shadow-2xl flex items-center justify-between gap-2.5">
            {/* Book Thumbnail & Seasonal Popular Badge */}
            <button
              type="button"
              onClick={() => onOpenPreview(featuredBook)}
              className="flex items-center gap-2.5 text-left min-w-0 flex-1 active:scale-95 transition-transform"
            >
              <div className="relative w-11 h-11 rounded-lg overflow-hidden shrink-0 border border-white/20">
                <Image
                  src={`${featuredBook.coverImage}?v=real`}
                  alt={featuredBook.title}
                  fill
                  sizes="48px"
                  placeholder="blur"
                  blurDataURL={BLUR_PLACEHOLDER}
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-300">
                  <Sparkles className="w-2.5 h-2.5" />
                  N°1 {activeSeason === "noel" ? "Noël" : "Automne"}
                </span>
                <p className="text-xs font-serif font-bold text-linen-50 truncate">
                  {featuredBook.title}
                </p>
                <span className="text-[10px] text-linen-200/70 flex items-center gap-1">
                  <BookOpen className="w-2.5 h-2.5" /> Touchez pour feuilleter
                </span>
              </div>
            </button>

            {/* Direct Amazon CTA with Haptic Tap */}
            <motion.a
              href={featuredBook.amazonUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileTap={{ scale: 0.96 }}
              style={{ backgroundColor: featuredBook.accentColor }}
              className="shrink-0 inline-flex items-center gap-1.5 px-4 py-3 rounded-xl text-white font-bold text-xs shadow-lg"
            >
              <span>Commander sur Amazon</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </motion.a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
