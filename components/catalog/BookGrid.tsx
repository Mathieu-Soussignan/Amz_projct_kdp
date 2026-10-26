"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles } from "lucide-react";
import { BOOKS, type Book, type BookCategory } from "@/data/books";
import BookCard from "./BookCard";

interface BookGridProps {
  activeSeason: BookCategory;
  onSeasonChange: (season: BookCategory) => void;
  onOpenFlipbook: (book: Book) => void;
}

const FILTER_TABS: {
  id: BookCategory | "all";
  label: string;
  tag: string;
  emoji: string;
}[] = [
  {
    id: "all",
    label: "Toute la Collection",
    tag: "8 Éditions",
    emoji: "✦",
  },
  {
    id: "automne",
    label: "Collection Automne",
    tag: "2 Livres Prioritaires",
    emoji: "🍂",
  },
  {
    id: "noel",
    label: "Collection Noël",
    tag: "3 Éditions Fêtes",
    emoji: "🎄",
  },
  {
    id: "classique",
    label: "Évasion & Été",
    tag: "3 Éditions",
    emoji: "🌊",
  },
];

export default function BookGrid({
  activeSeason,
  onSeasonChange,
  onOpenFlipbook,
}: BookGridProps) {
  // Ordered with activeSeason books first when viewing all, or filtered if user picks a specific collection
  const displayedBooks = useMemo(() => {
    if (activeSeason === "classique") {
      return BOOKS;
    }
    // Keep priority seasonal books at the top while still letting users explore or filter
    const matching = BOOKS.filter((b) => b.category === activeSeason);
    const others = BOOKS.filter((b) => b.category !== activeSeason);
    return [...matching, ...others];
  }, [activeSeason]);

  return (
    <section
      id="catalogue"
      className="py-20 md:py-28 relative border-t border-espresso-900/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Section Heading */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.22em] text-espresso-800/60">
              <Sparkles className="w-3.5 h-3.5 text-autumn-saffron" />
              <span>01 / Catalogue Officiel Amazon KDP</span>
            </div>
            <h2 className="mt-3 font-serif text-3xl sm:text-5xl font-normal text-espresso-900 tracking-tight leading-[1.08]">
              Nos 8 livres{" "}
              <span className="italic font-light text-espresso-800">
                de coloriage,
              </span>{" "}
              dispo sur Amazon.
            </h2>
          </div>

          <p className="text-sm sm:text-base text-espresso-800/75 max-w-md leading-relaxed">
            Passez la souris sur un livre pour voir un extrait intérieur ou
            cliquez dessus pour feuilleter la 4ème de couverture complète.
          </p>
        </div>

        {/* Seasonal Collection Switcher Bar */}
        <div className="mt-10 flex items-center gap-2.5 overflow-x-auto pb-3 no-scrollbar">
          {FILTER_TABS.map((tab) => {
            const isSelected =
              (tab.id === "all" && activeSeason === "classique") ||
              tab.id === activeSeason;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() =>
                  onSeasonChange(
                    tab.id === "all" ? "classique" : (tab.id as BookCategory)
                  )
                }
                className={`shrink-0 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2.5 active:scale-95 ${
                  isSelected
                    ? "bg-espresso-900 text-linen-50 shadow-md"
                    : "bg-linen-100 hover:bg-linen-200/80 text-espresso-800 border border-espresso-900/10"
                }`}
              >
                <span>{tab.emoji}</span>
                <span>{tab.label}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                    isSelected
                      ? "bg-white/15 text-amber-200"
                      : "bg-white text-espresso-800/70"
                  }`}
                >
                  {tab.tag}
                </span>
              </button>
            );
          })}
        </div>

        {/* Physical Books Grid */}
        <motion.div
          layout
          className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 lg:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {displayedBooks.map((book, idx) => (
              <BookCard
                key={book.id}
                book={book}
                index={idx}
                onOpenFlipbook={onOpenFlipbook}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
