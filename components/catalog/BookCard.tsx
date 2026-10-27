"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { BookOpen, ArrowUpRight, Check } from "lucide-react";
import {
  BOOK_EDITORIAL_META,
  BLUR_PLACEHOLDER,
  type Book,
} from "@/data/books";

interface BookCardProps {
  book: Book;
  index: number;
  onOpenFlipbook: (book: Book) => void;
}

export default function BookCard({
  book,
  index,
  onOpenFlipbook,
}: BookCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [glare, setGlare] = useState({ x: 50, y: 50 });
  const meta = BOOK_EDITORIAL_META[book.id];

  const handleCardPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    setGlare({ x, y });
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        type: "spring",
        stiffness: 160,
        damping: 22,
        delay: index * 0.06,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onPointerMove={handleCardPointerMove}
      className="group relative flex flex-col justify-between rounded-[32px] bg-[#FBF3E8]/85 hover:bg-[#FBF3E8] backdrop-blur-md border border-[#8C583A]/20 shadow-[0_20px_50px_-15px_rgba(92,50,22,0.12)] p-6 sm:p-7 transition-all duration-500"
    >
      {/* Ambient Warm Candlelight Wash on Hover */}
      <div
        aria-hidden="true"
        style={{
          background: `radial-gradient(circle at 50% 28%, ${book.accentColor}2E 0%, transparent 72%)`,
        }}
        className="pointer-events-none absolute inset-0 rounded-[32px] opacity-75 group-hover:opacity-100 transition-opacity duration-500"
      />

      {/* Top Editorial Header Row */}
      <div>
        <div className="relative z-10 flex items-center justify-between gap-2 mb-5">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-espresso-800/60">
            {meta?.editionNumber ?? `N° 0${index + 1}`}
          </span>
          {book.badge && (
            <span
              style={{ backgroundColor: book.accentColor }}
              className="px-3 py-1 rounded-full text-white text-[11px] font-bold tracking-wide shadow-sm"
            >
              {book.badge}
            </span>
          )}
        </div>

        {/* Physical Book Stage — Clean Z-Layered Stack (Zero 3D Z-Fighting) */}
        <div
          data-cursor={book.classicCoverOnly ? "amazon" : "book"}
          onClick={() => {
            if (book.classicCoverOnly) {
              window.open(book.amazonUrl, "_blank", "noopener,noreferrer");
            } else {
              onOpenFlipbook(book);
            }
          }}
          className="relative my-3 py-5 flex items-center justify-center select-none cursor-pointer"
        >
          {/* Projected Table Surface Shadow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-1 w-[74%] h-7 rounded-full bg-espresso-900/25 blur-xl group-hover:scale-105 transition-transform duration-500"
          />

          <div className="relative w-[78%] max-w-[260px] aspect-square">
            {/* LAYER 1 (z-10, strictly behind cover): Interior Preview Page Fanning Out on Hover */}
            {!book.classicCoverOnly && (
              <motion.div
                initial={false}
                animate={
                  isHovered
                    ? { x: 24, y: -8, rotate: 6, scale: 0.95, opacity: 1 }
                    : { x: 0, y: 0, rotate: 0, scale: 0.92, opacity: 0 }
                }
                transition={{ type: "spring", stiffness: 260, damping: 24 }}
                className="absolute inset-0 z-10 rounded-[16px] overflow-hidden bg-[#FFFDF9] border border-espresso-900/20 shadow-md pointer-events-none"
              >
                <Image
                  src={`${book.interiorPreview[0]}?v=real`}
                  alt={`Aperçu intérieur de ${book.title}`}
                  fill
                  sizes="260px"
                  placeholder="blur"
                  blurDataURL={BLUR_PLACEHOLDER}
                  className="object-cover"
                />
              </motion.div>
            )}

            {/* LAYER 2 (z-20, always on top): Physical Front Cover + Spine */}
            <motion.div
              initial={false}
              animate={
                isHovered
                  ? book.classicCoverOnly
                    ? { y: -5, scale: 1.02 }
                    : { x: -6, y: -5, rotate: -1, scale: 1.02 }
                  : { x: 0, y: 0, rotate: 0, scale: 1 }
              }
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              className="relative z-20 w-full h-full"
            >
              {/* Physical Book Spine (Left Edge) */}
              <div
                aria-hidden="true"
                style={{ backgroundColor: book.accentColor }}
                className="absolute inset-y-0.5 -left-3 w-3.5 rounded-l-md brightness-75 shadow-inner"
              />

              {/* Physical Right Paper Block Edges (30 Pages Thickness) */}
              <div
                aria-hidden="true"
                className="absolute inset-y-1.5 -right-2 w-2.5 rounded-r-sm bg-[repeating-linear-gradient(90deg,#FDFBF7,#FDFBF7_1px,#E5DEC9_2px)] border-y border-r border-espresso-900/20 shadow-sm"
              />

              {/* Front Cover Image */}
              <div className="relative w-full h-full rounded-[16px] overflow-hidden bg-linen-50 shadow-physical-book group-hover:shadow-physical-book-hover border border-espresso-900/15">
                <Image
                  src={`${book.coverImage}?v=real`}
                  alt={book.title}
                  fill
                  sizes="(max-width: 640px) 260px, 280px"
                  placeholder="blur"
                  blurDataURL={BLUR_PLACEHOLDER}
                  className="object-cover"
                />
                {/* Realistic Book Hinge Crease */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-0 w-5 bg-gradient-to-r from-black/30 via-white/25 to-transparent"
                />
                {/* Interactive Specular Paper Glare on Hover */}
                <div
                  aria-hidden="true"
                  style={{
                    background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.34) 0%, rgba(255,255,255,0) 60%)`,
                  }}
                  className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-overlay"
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Interactive Hint Pill */}
        <div className="mt-2 flex items-center justify-center">
          {book.classicCoverOnly ? (
            <a
              href={book.amazonUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="amazon"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/85 hover:bg-espresso-900 text-espresso-900 hover:text-linen-50 text-xs font-bold border border-espresso-900/10 transition-colors shadow-sm"
            >
              <ArrowUpRight
                style={{ color: book.accentColor }}
                className="w-3.5 h-3.5"
              />
              <span>Voir directement sur Amazon</span>
            </a>
          ) : (
            <button
              type="button"
              onClick={() => onOpenFlipbook(book)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/85 hover:bg-espresso-900 text-espresso-900 hover:text-linen-50 text-xs font-bold border border-espresso-900/10 transition-colors shadow-sm"
            >
              <BookOpen
                style={{ color: book.accentColor }}
                className="w-3.5 h-3.5"
              />
              <span>Feuilleter l&apos;intérieur</span>
            </button>
          )}
        </div>

        {/* Book Typography & Features */}
        <div className="mt-5 relative z-10">
          <h3 className="font-serif text-2xl font-bold text-espresso-900 tracking-tight leading-snug">
            {book.title}
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-espresso-800/75 leading-relaxed">
            {book.subtitle}
          </p>

          {/* Features List */}
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {book.features.map((feat) => (
              <li
                key={feat}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/80 text-espresso-900 text-[11px] font-semibold border border-espresso-900/10"
              >
                <Check
                  style={{ color: book.accentColor }}
                  className="w-3 h-3 shrink-0"
                />
                <span>{feat}</span>
              </li>
            ))}
          </ul>

          {/* Alcohol Marker Palette Swatches */}
          {meta?.palette && (
            <div className="mt-4 flex items-center justify-between text-[11px] text-espresso-800/65">
              <span>Gamme chromatique :</span>
              <div className="flex items-center -space-x-1">
                {meta.palette.map((hex) => (
                  <span
                    key={hex}
                    style={{ backgroundColor: hex }}
                    className="w-4 h-4 rounded-full border border-white shadow-sm"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Textured Amazon CTA with Discreet Amazon Smile Logo & Prime Badge */}
      <div className="mt-6 pt-4 border-t border-espresso-900/10 relative z-10">
        <div className="flex items-center justify-between text-[11px] font-semibold text-espresso-800/70 mb-2.5">
          <span>Création Originale CaroTine</span>
          <span className="inline-flex items-center gap-1 text-espresso-900 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            Disponible en Prime
          </span>
        </div>

        <motion.a
          href={book.amazonUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="amazon"
          whileTap={{ scale: 0.96 }}
          className="relative w-full overflow-hidden rounded-2xl bg-espresso-900 hover:bg-espresso-800 text-linen-50 p-3.5 shadow-md flex items-center justify-between gap-3 transition-colors group/btn"
        >
          {/* Golden Shimmer Sweep on Hover */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-amber-200/15 to-transparent"
          />

          <span
            aria-hidden="true"
            style={{ backgroundColor: book.accentColor }}
            className="pointer-events-none absolute inset-y-0 left-0 w-1.5 transition-all duration-300 group-hover/btn:w-2.5"
          />

          <div className="pl-2 flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4 text-amber-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 15c4.5 3.5 11.5 3.5 16 0" />
                <path d="M17 15l3 0 0 3" />
              </svg>
            </span>
            <div className="text-left">
              <span className="block text-xs sm:text-sm font-bold leading-none text-linen-50">
                Commander sur Amazon
              </span>
              <span className="block text-[10px] text-amber-200/85 mt-0.5">
                Livraison rapide • Disponible en Prime
              </span>
            </div>
          </div>

          <span className="w-8 h-8 rounded-xl bg-white/10 group-hover/btn:bg-white/20 flex items-center justify-center transition-colors">
            <ArrowUpRight className="w-4 h-4 text-linen-50" />
          </span>
        </motion.a>
      </div>
    </motion.article>
  );
}
