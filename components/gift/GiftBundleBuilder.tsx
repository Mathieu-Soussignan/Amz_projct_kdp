"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import {
  Gift,
  Check,
  Sparkles,
  ArrowUpRight,
  Heart,
  Plus,
} from "lucide-react";
import { BOOKS, BLUR_PLACEHOLDER, type Book } from "@/data/books";

const GIFT_TAGS = [
  { id: "plaid", label: "Pour mes soirées sous un plaid ☕" },
  { id: "soeur", label: "Pour ma sœur / ma copine 💕" },
  { id: "sapin", label: "À glisser sous le sapin 🎄" },
  { id: "famille", label: "Pour colorier avec les enfants 🦊" },
];

export default function GiftBundleBuilder() {
  const [selectedIds, setSelectedIds] = useState<string[]>([
    "automne-cozy",
    "noel-capybaras",
  ]);
  const [activeTagId, setActiveTagId] = useState<string>(GIFT_TAGS[0]!.id);

  const toggleBook = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        if (prev.length <= 1) return prev; // Keep at least 1 book in the box
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 3) {
        // Replace the oldest selection so the stack stays a neat Duo/Trio (max 3)
        return [...prev.slice(1), id];
      }
      return [...prev, id];
    });
  };

  const selectedBooks = selectedIds
    .map((id) => BOOKS.find((b) => b.id === id))
    .filter((b): b is Book => Boolean(b));

  const currentTag =
    GIFT_TAGS.find((t) => t.id === activeTagId) ?? GIFT_TAGS[0]!;

  const estimatedTotal = (selectedBooks.length * 7.99)
    .toFixed(2)
    .replace(".", ",");

  return (
    <section
      id="coffret-cadeau"
      className="py-20 md:py-28 relative border-t border-espresso-900/10 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FBF3E8] border border-espresso-900/10 shadow-sm mb-3">
              <Gift className="w-3.5 h-3.5 text-autumn-saffron" />
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-espresso-900">
                Idée Cadeau &amp; Duo Cosy
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal text-espresso-900 tracking-tight leading-[1.08]">
              Compose ton{" "}
              <span className="italic font-light text-autumn-saffron">
                 Duo ou Trio Cocooning
              </span>{" "}
              à offrir (ou à t&apos;offrir).
            </h2>
          </div>

          <p className="text-sm sm:text-base text-espresso-800/80 max-w-md leading-relaxed">
            Sélectionne 2 ou 3 albums pour créer ta pile de coloriages idéale :
            un pour toi sous le plaid, un pour ta sœur ou pour les enfants.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* LEFT COLUMN (7 cols): Pick up to 3 Books + Gift Tag */}
          <div className="lg:col-span-7 rounded-[32px] bg-[#FBF3E8]/90 backdrop-blur-md border border-[#8C583A]/20 shadow-[0_20px_50px_-15px_rgba(92,50,22,0.12)] p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-espresso-800/75">
                  1. Choisis jusqu&apos;à 3 livres ({selectedBooks.length}/3) :
                </span>
                <span className="text-xs font-semibold text-autumn-saffron">
                  Clique sur une couverture
                </span>
              </div>

              {/* 8 Books Compact Selector Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {BOOKS.map((book) => {
                  const isSelected = selectedIds.includes(book.id);
                  const orderNum = selectedIds.indexOf(book.id) + 1;
                  return (
                    <motion.button
                      key={book.id}
                      type="button"
                      whileTap={{ scale: 0.96 }}
                      onClick={() => toggleBook(book.id)}
                      className={`group relative rounded-2xl p-2.5 text-left transition-all border ${
                        isSelected
                          ? "bg-espresso-900 text-linen-50 border-espresso-900 shadow-lg ring-2 ring-amber-400/50"
                          : "bg-white/80 hover:bg-white text-espresso-900 border-espresso-900/10"
                      }`}
                    >
                      <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-2 border border-espresso-900/10">
                        <Image
                          src={`${book.coverImage}?v=real`}
                          alt={book.title}
                          fill
                          sizes="150px"
                          placeholder="blur"
                          blurDataURL={BLUR_PLACEHOLDER}
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div
                          className={`absolute top-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shadow-md transition-colors ${
                            isSelected
                              ? "bg-amber-400 text-espresso-900"
                              : "bg-black/45 text-white"
                          }`}
                        >
                          {isSelected ? (
                            <span>#{orderNum}</span>
                          ) : (
                            <Plus className="w-3.5 h-3.5" />
                          )}
                        </div>
                      </div>
                      <span className="block font-serif text-xs font-bold leading-snug line-clamp-2">
                        {book.title}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Gift Tag Selector */}
            <div className="mt-7 pt-5 border-t border-espresso-900/10">
              <span className="block text-xs font-bold uppercase tracking-[0.16em] text-espresso-800/75 mb-3">
                2. Personnalise l&apos;étiquette de ton coffret :
              </span>
              <div className="flex flex-wrap gap-2">
                {GIFT_TAGS.map((tag) => {
                  const isActive = tag.id === activeTagId;
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => setActiveTagId(tag.id)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                        isActive
                          ? "bg-autumn-saffron text-white shadow-sm"
                          : "bg-white/85 hover:bg-white text-espresso-800 border border-espresso-900/10"
                      }`}
                    >
                      {tag.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (5 cols): 3D Stacked Gift Pile + Direct Amazon Links */}
          <div className="lg:col-span-5 rounded-[32px] bg-espresso-900 text-linen-50 p-6 sm:p-8 shadow-2xl border border-amber-200/15 flex flex-col justify-between relative overflow-hidden">
            {/* Warm Golden Spotlight */}
            <div
              aria-hidden="true"
              style={{
                background:
                  "radial-gradient(circle at 50% 32%, rgba(251, 191, 36, 0.22) 0%, transparent 70%)",
              }}
              className="pointer-events-none absolute inset-0"
            />

            <div className="relative z-10">
              <div className="flex items-center justify-between gap-2 pb-4 border-b border-white/10">
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-amber-300 font-bold">
                  Aperçu de ta Pile Cocooning
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-200 text-[11px] font-bold">
                  <Sparkles className="w-3 h-3" />
                  {selectedBooks.length}{" "}
                  {selectedBooks.length > 1 ? "albums choisis" : "album choisi"}
                </span>
              </div>

              {/* 3D Visual Stack of Books + Satin Ribbon */}
              <div className="relative h-60 my-4 flex items-center justify-center select-none">
                {/* Golden Ribbon Bow behind/around the stack */}
                <div className="pointer-events-none absolute w-52 h-52 rounded-full border border-dashed border-amber-300/30 animate-spin-slow" />

                <AnimatePresence mode="popLayout">
                  {selectedBooks.map((book, idx) => {
                    const offsets = [
                      { rotate: -8, x: -24, y: 12, z: 10 },
                      { rotate: 5, x: 18, y: -4, z: 20 },
                      { rotate: -2, x: 0, y: -18, z: 30 },
                    ];
                    const pos = offsets[idx] ?? offsets[0]!;
                    return (
                      <motion.div
                        key={book.id}
                        layout
                        initial={{ opacity: 0, scale: 0.7, y: 40 }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                          rotate: pos.rotate,
                          x: pos.x,
                          y: pos.y,
                        }}
                        exit={{ opacity: 0, scale: 0.7, y: -30 }}
                        transition={{
                          type: "spring",
                          stiffness: 240,
                          damping: 22,
                        }}
                        style={{ zIndex: pos.z }}
                        className="absolute w-36 h-36 sm:w-40 sm:h-40 rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-100/40 bg-linen-100"
                      >
                        <Image
                          src={`${book.coverImage}?v=real`}
                          alt={book.title}
                          fill
                          sizes="160px"
                          className="object-cover"
                        />
                        {/* Golden Gift Ribbon Crossbar */}
                        <div className="pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2 w-3 bg-gradient-to-r from-amber-500/80 via-amber-200/90 to-amber-500/80 shadow-sm" />
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {/* Floating Personalized Gift Tag */}
                <motion.div
                  key={currentTag.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -bottom-2 z-40 px-4 py-1.5 rounded-full bg-[#FBF3E8] text-espresso-900 text-xs font-serif italic font-bold shadow-xl border border-amber-400/50 flex items-center gap-1.5"
                >
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                  <span>{currentTag.label}</span>
                </motion.div>
              </div>
            </div>

            {/* Selected Books Direct Checkout List */}
            <div className="relative z-10 mt-4 pt-4 border-t border-white/10 space-y-2.5">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-linen-200/80">
                  Budget estimé ({selectedBooks.length} KDP) :
                </span>
                <span className="font-serif text-lg font-bold text-amber-300">
                  ~{estimatedTotal} €{" "}
                  <span className="text-[11px] font-sans font-normal text-emerald-300">
                    • Éligible Prime
                  </span>
                </span>
              </div>

              <div className="space-y-2">
                {selectedBooks.map((book, idx) => (
                  <a
                    key={book.id}
                    href={book.amazonUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="amazon"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/10 hover:bg-amber-400 hover:text-espresso-900 text-linen-50 text-xs font-bold flex items-center justify-between gap-2 transition-colors group"
                  >
                    <span className="flex items-center gap-2 truncate">
                      <Check className="w-3.5 h-3.5 text-amber-300 group-hover:text-espresso-900 shrink-0" />
                      <span className="truncate">
                        Livre #{idx + 1} : {book.title}
                      </span>
                    </span>
                    <span className="inline-flex items-center gap-1 shrink-0 text-[11px] underline">
                      Amazon <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
