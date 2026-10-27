"use client";

import Image from "next/image";
import { useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, ArrowUpRight, BookOpen, Gift } from "lucide-react";
import {
  BOOKS,
  BLUR_PLACEHOLDER,
  type Book,
  type BookCategory,
} from "@/data/books";
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
    tag: "9 Éditions",
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
    tag: "4 Éditions Fêtes",
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

  const santaBook =
    BOOKS.find((b) => b.id === "atelier-pere-noel") ?? BOOKS[0]!;

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
              <span>01 / La Collection Officielle CaroTine</span>
            </div>
            <h2 className="mt-3 font-serif text-3xl sm:text-5xl font-normal text-espresso-900 tracking-tight leading-[1.08]">
              Nos 9 livres{" "}
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
                    ? tab.id === "noel"
                      ? "bg-gradient-to-r from-[#A61B1B] via-[#C62626] to-[#1E4D3B] text-white shadow-[0_10px_28px_rgba(198,38,38,0.45)] ring-2 ring-amber-300/70"
                      : "bg-espresso-900 text-linen-50 shadow-md"
                    : "bg-linen-100 hover:bg-linen-200/80 text-espresso-800 border border-espresso-900/10"
                }`}
              >
                <span>{tab.emoji}</span>
                <span>{tab.label}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                    isSelected
                      ? "bg-white/20 text-amber-200"
                      : "bg-white text-espresso-800/70"
                  }`}
                >
                  {tab.tag}
                </span>
              </button>
            );
          })}
        </div>

        {/* GRAND FILM DE NOËL SHOWCASE STAGE WHEN NOËL TAB IS ACTIVE */}
        <AnimatePresence>
          {activeSeason === "noel" && (
            <motion.div
              key="noel-workshop-stage"
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.5 }}
              className="mt-8 relative rounded-[36px] overflow-hidden bg-gradient-to-br from-[#640D14] via-[#8E1616] to-[#143628] text-[#FFFDF9] p-6 sm:p-10 border-2 border-amber-300/60 shadow-[0_30px_70px_-15px_rgba(100,13,20,0.55)]"
            >
              {/* Warm Golden Lantern Glows inside Card */}
              <div
                aria-hidden="true"
                style={{
                  background:
                    "radial-gradient(circle at 75% 40%, rgba(255, 209, 102, 0.35) 0%, rgba(198, 38, 38, 0.2) 45%, transparent 72%)",
                }}
                className="pointer-events-none absolute inset-0"
              />

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Left (7 cols): Christmas Movie Storytelling */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="inline-flex flex-wrap items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-300/20 border border-amber-300/50 text-amber-200 text-xs font-bold uppercase tracking-[0.16em]">
                    <Gift className="w-3.5 h-3.5 text-amber-300" />
                    <span>Nouveauté Féérique • 50 Coloriages Magiques</span>
                  </div>

                  <h3 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight leading-[1.06]">
                    Entrez dans les coulisses de{" "}
                    <span className="italic text-amber-300">
                      l&apos;Atelier du Père Noël.
                    </span>
                  </h3>

                  <p className="text-sm sm:text-base text-amber-100/90 leading-relaxed max-w-xl">
                    La lumière dorée des lanternes, l&apos;odeur du chocolat
                    chaud à la cannelle, les petits lutins qui peignent les
                    trains en bois et le village sous la neige… Retrouvez toute
                    la magie des{" "}
                    <strong className="text-amber-200">
                      plus grands films de Noël
                    </strong>{" "}
                    dans notre nouveau grand album de{" "}
                    <strong className="text-amber-200">50 coloriages</strong>{" "}
                    (dès 4 ans), accompagné de nos éditions Capybaras, Axolotls
                    et Dinosaures de Noël !
                  </p>

                  <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <a
                      href={santaBook.amazonUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor="amazon"
                      className="inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-amber-300 hover:bg-amber-200 text-espresso-900 font-extrabold text-sm sm:text-base shadow-[0_10px_30px_rgba(255,209,102,0.45)] transition-all active:scale-95"
                    >
                      <span>
                        Commander « L&apos;Atelier du Père Noël » sur Amazon
                      </span>
                      <ArrowUpRight className="w-4 h-4" />
                    </a>

                    <button
                      type="button"
                      onClick={() => onOpenFlipbook(santaBook)}
                      className="inline-flex items-center justify-center gap-2 px-5 py-4 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-sm border border-white/25 transition-colors"
                    >
                      <BookOpen className="w-4 h-4 text-amber-300" />
                      <span>Découvrir le village enneigé</span>
                    </button>
                  </div>
                </div>

                {/* Right (5 cols): Dual Cover + Snowy Village Preview */}
                <div className="lg:col-span-5 flex items-center justify-center">
                  <div
                    data-cursor="book"
                    onClick={() => onOpenFlipbook(santaBook)}
                    className="relative w-64 h-64 sm:w-72 sm:h-72 cursor-pointer group"
                  >
                    {/* Back cover snowy village peeking out */}
                    <div className="absolute inset-0 translate-x-7 -translate-y-3 rotate-6 rounded-2xl overflow-hidden border-2 border-amber-200/50 shadow-2xl transition-transform duration-500 group-hover:translate-x-10 group-hover:rotate-12">
                      <Image
                        src={`${santaBook.interiorPreview[0]}?v=real`}
                        alt="Village enneigé de Noël"
                        fill
                        sizes="280px"
                        placeholder="blur"
                        blurDataURL={BLUR_PLACEHOLDER}
                        className="object-cover"
                      />
                    </div>

                    {/* Main Santa's Workshop Cover */}
                    <div className="relative z-10 w-full h-full -rotate-2 rounded-2xl overflow-hidden border-2 border-amber-300 shadow-[0_25px_60px_rgba(0,0,0,0.65)] transition-transform duration-500 group-hover:rotate-0 group-hover:scale-105">
                      <Image
                        src={`${santaBook.coverImage}?v=real`}
                        alt={santaBook.title}
                        fill
                        sizes="280px"
                        placeholder="blur"
                        blurDataURL={BLUR_PLACEHOLDER}
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
