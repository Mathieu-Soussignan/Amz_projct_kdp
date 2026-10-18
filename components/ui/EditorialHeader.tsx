"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Sparkles, BookOpen, ArrowUpRight } from "lucide-react";
import type { BookCategory } from "@/data/books";

interface EditorialHeaderProps {
  activeSeason: BookCategory;
  onSeasonChange: (season: BookCategory) => void;
  onOpenFeaturedFlipbook: () => void;
}

export default function EditorialHeader({
  activeSeason,
  onSeasonChange,
  onOpenFeaturedFlipbook,
}: EditorialHeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isNoel = activeSeason === "noel";

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-500 ${
        scrolled
          ? "py-2.5 bg-linen-50/85 backdrop-blur-xl border-b border-espresso-900/10"
          : "py-4 sm:py-5 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
        {/* Left: Editorial Monogram & Signature */}
        <a
          href="#"
          className="group flex items-center gap-3 focus:outline-none"
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-500 border ${
              isNoel
                ? "bg-noel-pine text-linen-50 border-noel-pine"
                : "bg-espresso-900 text-linen-50 border-espresso-900"
            }`}
          >
            <span className="font-serif italic font-bold text-base tracking-tighter">
              A&amp;C
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-bold text-base sm:text-lg leading-none text-espresso-900 tracking-tight">
              Anne-Caroline &amp; Clémentine
            </span>
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-espresso-800/60 mt-0.5 font-medium">
              Maison d&apos;Édition KDP • Paris
            </span>
          </div>
        </a>

        {/* Center Desktop Links */}
        <nav
          aria-label="Navigation éditoriale"
          className="hidden lg:flex items-center gap-7 text-xs uppercase tracking-[0.16em] font-semibold text-espresso-800/80"
        >
          <a
            href="#catalogue"
            className="hover:text-espresso-900 transition-colors"
          >
            01. Le Catalogue
          </a>
          <button
            type="button"
            onClick={onOpenFeaturedFlipbook}
            className="hover:text-espresso-900 transition-colors flex items-center gap-1.5 uppercase tracking-[0.16em]"
          >
            <BookOpen className="w-3.5 h-3.5 text-autumn-saffron" />
            <span>02. Feuilleter</span>
          </button>
          <a
            href="#duo-story"
            className="hover:text-espresso-900 transition-colors"
          >
            03. Les Créatrices
          </a>
        </nav>

        {/* Right: Quick Season Toggle + TikTok 530K Pill */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Compact Season Switcher Pill */}
          <div
            role="group"
            aria-label="Sélecteur d'ambiance saisonnière"
            className="flex items-center p-1 rounded-full bg-linen-200/80 border border-espresso-900/10"
          >
            <button
              type="button"
              onClick={() => onSeasonChange("automne")}
              className={`relative px-2.5 sm:px-3 py-1 rounded-full text-[11px] font-bold transition-all active:scale-95 ${
                activeSeason === "automne"
                  ? "bg-autumn-saffron text-white shadow-sm"
                  : "text-espresso-800/75 hover:text-espresso-900"
              }`}
            >
              🍂 <span className="hidden xs:inline">Automne</span>
            </button>
            <button
              type="button"
              onClick={() => onSeasonChange("noel")}
              className={`relative px-2.5 sm:px-3 py-1 rounded-full text-[11px] font-bold transition-all active:scale-95 ${
                activeSeason === "noel"
                  ? "bg-noel-pine text-white shadow-sm"
                  : "text-espresso-800/75 hover:text-espresso-900"
              }`}
            >
              🎄 <span className="hidden xs:inline">Noël</span>
            </button>
          </div>

          {/* TikTok 530K Community Badge */}
          <a
            href="#duo-story"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-espresso-900 text-linen-50 text-[11px] font-semibold hover:bg-espresso-800 transition-transform active:scale-95"
          >
            <span className="relative flex h-2 w-2">
              <motion.span
                animate={{ scale: [1, 1.8, 1], opacity: [0.8, 0, 0.8] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inline-flex h-full w-full rounded-full bg-autumn-saffron"
              />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF3B5C]" />
            </span>
            <span className="hidden sm:inline text-linen-200">TikTok</span>
            <span className="font-bold text-amber-200">530K+</span>
            <Sparkles className="w-3 h-3 text-amber-300 hidden sm:inline" />
            <ArrowUpRight className="w-3 h-3 opacity-60 hidden md:inline" />
          </a>
        </div>
      </div>
    </header>
  );
}
