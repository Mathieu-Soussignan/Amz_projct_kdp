"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "motion/react";
import {
  BookOpen,
  ArrowUpRight,
  Sparkles,
  Check,
  PenTool,
} from "lucide-react";
import {
  BOOKS,
  BOOK_EDITORIAL_META,
  BLUR_PLACEHOLDER,
  type Book,
  type BookCategory,
} from "@/data/books";

interface HeroVisualProps {
  activeSeason: BookCategory;
  onSeasonChange: (season: BookCategory) => void;
  onOpenFlipbook: (book: Book) => void;
}

export default function HeroVisual({
  activeSeason,
  onSeasonChange,
  onOpenFlipbook,
}: HeroVisualProps) {
  const seasonBooks = BOOKS.filter((b) =>
    activeSeason === "classique" ? true : b.category === activeSeason
  );
  const [selectedIdx, setSelectedIdx] = useState(0);

  useEffect(() => {
    setSelectedIdx(0);
  }, [activeSeason]);

  const activeBook = seasonBooks[selectedIdx] ?? BOOKS[0];
  const editorial = BOOK_EDITORIAL_META[activeBook.id];
  const isNoel = activeSeason === "noel";

  // Smooth Pointer / Gyroscope Spring Physics
  const stageRef = useRef<HTMLDivElement>(null);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const rotateY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-6, 6]), {
    stiffness: 180,
    damping: 24,
  });
  const rotateX = useSpring(useTransform(pointerY, [-0.5, 0.5], [5, -5]), {
    stiffness: 180,
    damping: 24,
  });
  const shadowX = useTransform(pointerX, [-0.5, 0.5], [18, -18]);
  const shadowY = useTransform(pointerY, [-0.5, 0.5], [24, 12]);
  const glareX = useTransform(pointerX, [-0.5, 0.5], ["15%", "85%"]);
  const glareY = useTransform(pointerY, [-0.5, 0.5], ["15%", "85%"]);

  // Mobile Accelerometer / Gyroscope listener
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null && e.beta !== null) {
        pointerX.set(Math.max(-0.5, Math.min(0.5, e.gamma / 55)));
        pointerY.set(Math.max(-0.5, Math.min(0.5, (e.beta - 42) / 55)));
      }
    };
    window.addEventListener("deviceorientation", handleOrientation, true);
    return () =>
      window.removeEventListener("deviceorientation", handleOrientation, true);
  }, [pointerX, pointerY]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    pointerX.set((e.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handlePointerLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden transition-colors duration-700">
      {/* Dynamic Seasonal Ambient Atmosphere Glow */}
      <motion.div
        aria-hidden="true"
        animate={{
          background: isNoel
            ? "radial-gradient(circle at 65% 35%, rgba(39, 116, 85, 0.16) 0%, rgba(192, 57, 43, 0.11) 45%, rgba(253, 251, 247, 0) 75%)"
            : "radial-gradient(circle at 65% 35%, rgba(217, 119, 54, 0.19) 0%, rgba(200, 109, 59, 0.11) 45%, rgba(253, 251, 247, 0) 75%)",
        }}
        transition={{ duration: 0.9 }}
        className="pointer-events-none absolute inset-0 -z-10"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Editorial Meta Strip & Atmospheric Season Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-espresso-900/10">
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-espresso-800/70 font-semibold">
            <span
              style={{ backgroundColor: activeBook.accentColor }}
              className="w-2.5 h-2.5 rounded-full inline-block transition-colors duration-500"
            />
            <span>Studio de Coloriage Bold &amp; Easy</span>
            <span className="hidden sm:inline opacity-40">•</span>
            <span className="hidden sm:inline text-espresso-900 font-bold">
              Vu par +530 000 abonnés sur TikTok
            </span>
          </div>

          {/* Interactive Seasonal Atmosphere Switcher */}
          <div className="inline-flex items-center gap-1.5 p-1.5 rounded-2xl bg-linen-100 border border-espresso-900/10 shadow-sm self-start sm:self-auto">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-espresso-800/60 px-2.5">
              Atmosphère :
            </span>
            <button
              type="button"
              onClick={() => onSeasonChange("automne")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5 ${
                activeSeason === "automne"
                  ? "bg-autumn-saffron text-white shadow-sm"
                  : "text-espresso-800 hover:bg-linen-200/70"
              }`}
            >
              <span>🍂</span>
              <span>Automne Cozy</span>
            </button>
            <button
              type="button"
              onClick={() => onSeasonChange("noel")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5 ${
                activeSeason === "noel"
                  ? "bg-noel-pine text-white shadow-sm"
                  : "text-espresso-800 hover:bg-linen-200/70"
              }`}
            >
              <span>🎄</span>
              <span>Noël Féérique</span>
            </button>
            <button
              type="button"
              onClick={() => onSeasonChange("classique")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                activeSeason === "classique"
                  ? "bg-espresso-900 text-linen-50 shadow-sm"
                  : "text-espresso-800 hover:bg-linen-200/70"
              }`}
            >
              🌊 Tout (7)
            </button>
          </div>
        </div>

        {/* Main Editorial Asymmetric Grid */}
        <div className="mt-10 lg:mt-14 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column (7 cols): Sculptural Typography & Editorial Conversion */}
          <div className="lg:col-span-7 space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeBook.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.35 }}
                className="inline-flex items-center gap-2.5"
              >
                <span className="text-xs font-mono uppercase tracking-[0.22em] text-espresso-800/60">
                  {editorial?.editionNumber ?? "ÉDITION ORIGINALE"}
                </span>
                {activeBook.badge && (
                  <span
                    style={{ backgroundColor: activeBook.accentColor }}
                    className="px-3 py-0.5 rounded-full text-white text-[11px] font-bold tracking-wide"
                  >
                    {activeBook.badge}
                  </span>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Editorial Display Title */}
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-[62px] font-normal text-espresso-900 tracking-tight leading-[1.05]">
              Oh coucou,{" "}
              <span className="italic font-light text-espresso-800">
                te revoilà !
              </span>{" "}
              <span
                style={{ color: activeBook.accentColor }}
                className="italic font-semibold transition-colors duration-500 block sm:inline"
              >
                Bienvenue chez toi.
              </span>
            </h1>

            {/* Creator's Exact Welcoming Message */}
            <p className="text-base sm:text-lg text-espresso-800/90 max-w-xl leading-relaxed font-normal">
              Ici, on lâche les écrans pour un{" "}
              <strong className="font-semibold text-espresso-900">
                vrai moment cocooning
              </strong>
              . Je t&apos;ai rassemblé mes coloriages faciles et anti-stress
              préférés : des{" "}
              <strong className="font-semibold text-espresso-900">
                traits bien épais
              </strong>
              , zéro détail minuscule pour ne pas se prendre la tête, et que du
              plaisir. Pour l&apos;automne au chaud sous un plaid, pour Noël ou
              pour les nouveautés à venir...{" "}
              <em className="font-serif italic font-semibold text-espresso-900">
                pioche celui qui te fait du bien !
              </em>
            </p>

            {/* Active Book Highlight Card */}
            <div className="p-5 sm:p-6 rounded-3xl bg-[#FBF3E8]/90 backdrop-blur-md border border-[#8C583A]/20 shadow-[0_20px_50px_-15px_rgba(92,50,22,0.12)] max-w-xl">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-espresso-900/10">
                <div>
                  <span className="text-[11px] uppercase tracking-[0.18em] text-espresso-800/65 font-bold">
                    Sélection Cocooning • Par CaroTine
                  </span>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-espresso-900">
                    {activeBook.title}
                  </h2>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white text-espresso-900 text-xs font-bold border border-espresso-900/10">
                  <Sparkles
                    style={{ color: activeBook.accentColor }}
                    className="w-3.5 h-3.5"
                  />
                  Disponible en Prime
                </span>
              </div>

              <p className="mt-3 text-xs sm:text-sm text-espresso-800/80 leading-relaxed">
                {activeBook.subtitle}
              </p>

              {/* Features Pills */}
              <div className="mt-3.5 flex flex-wrap gap-2">
                {activeBook.features.map((feat) => (
                  <span
                    key={feat}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/85 text-espresso-900 text-xs font-semibold border border-espresso-900/10"
                  >
                    <Check
                      style={{ color: activeBook.accentColor }}
                      className="w-3.5 h-3.5"
                    />
                    {feat}
                  </span>
                ))}
              </div>

              {/* Dual Haptic CTAs */}
              <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <motion.a
                  href={activeBook.amazonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileTap={{ scale: 0.96 }}
                  style={{ backgroundColor: activeBook.accentColor }}
                  className="flex-1 inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl text-white font-bold text-sm sm:text-base shadow-lg transition-opacity hover:opacity-95"
                >
                  <span>Commander sur Amazon</span>
                  <ArrowUpRight className="w-4 h-4" />
                </motion.a>

                <motion.button
                  type="button"
                  onClick={() => onOpenFlipbook(activeBook)}
                  whileTap={{ scale: 0.96 }}
                  className="inline-flex items-center justify-center gap-2 px-5 py-4 rounded-2xl bg-espresso-900 text-linen-50 font-bold text-sm hover:bg-espresso-800 transition-colors"
                >
                  <BookOpen className="w-4 h-4 text-amber-300" />
                  <span>Feuilleter l&apos;intérieur</span>
                </motion.button>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): 3D Levitating Physical Book + Live Self-Drawing SVG Halo */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div
              ref={stageRef}
              onPointerMove={handlePointerMove}
              onPointerLeave={handlePointerLeave}
              style={{ perspective: "1400px" }}
              className="relative w-full max-w-[440px] aspect-square flex items-center justify-center select-none"
            >
              {/* Ambient Glow Halo behind the 3D Book */}
              <motion.div
                aria-hidden="true"
                animate={{ backgroundColor: activeBook.accentColor }}
                transition={{ duration: 0.6 }}
                className="pointer-events-none absolute w-[74%] h-[74%] rounded-full opacity-25 blur-3xl -z-10"
              />

              {/* Dynamic Projected Floor Shadow */}
              <motion.div
                aria-hidden="true"
                style={{ x: shadowX, y: shadowY }}
                className="pointer-events-none absolute bottom-4 w-[72%] h-10 rounded-full bg-espresso-900/30 blur-xl"
              />

              {/* 3D Levitating Physical Book Object */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeBook.id}
                  initial={{ opacity: 0, scale: 0.94, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: -8 }}
                  transition={{ type: "spring", stiffness: 220, damping: 24 }}
                  style={{
                    rotateX,
                    rotateY,
                  }}
                  onClick={() => onOpenFlipbook(activeBook)}
                  className="relative z-20 w-[82%] aspect-square cursor-pointer group"
                >
                  {/* Physical Left Book Spine (3D Depth) */}
                  <div
                    aria-hidden="true"
                    style={{ backgroundColor: activeBook.accentColor }}
                    className="absolute inset-y-1 -left-3.5 w-4 rounded-l-md brightness-75 shadow-inner flex flex-col items-center justify-center overflow-hidden"
                  >
                    <div className="w-[1px] h-full bg-white/25" />
                  </div>

                  {/* Physical Right Paper Block Edges (30 Pages Thickness) */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-y-2 -right-3 w-3 rounded-r-md bg-[repeating-linear-gradient(90deg,#FDFBF7,#FDFBF7_1px,#E5DEC9_2px)] border-y border-r border-espresso-900/20 shadow-sm"
                  />

                  {/* Front Cover Surface */}
                  <div className="relative w-full h-full rounded-[20px] overflow-hidden bg-linen-100 shadow-physical-book group-hover:shadow-physical-book-hover transition-shadow duration-500 border border-espresso-900/15">
                    <Image
                      src={`${activeBook.coverImage}?v=real`}
                      alt={activeBook.title}
                      fill
                      priority
                      sizes="(max-width: 768px) 340px, 400px"
                      placeholder="blur"
                      blurDataURL={BLUR_PLACEHOLDER}
                      className="object-cover"
                    />

                    {/* Realistic Book Spine Hinge Groove */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-black/30 via-white/25 to-transparent"
                    />

                    {/* Specular Glare Responding to Pointer / Gyroscope */}
                    <motion.div
                      aria-hidden="true"
                      style={{
                        background: useTransform(
                          [glareX, glareY],
                          ([gx, gy]) =>
                            `radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.38) 0%, rgba(255,255,255,0) 60%)`
                        ),
                      }}
                      className="pointer-events-none absolute inset-0 mix-blend-overlay"
                    />
                  </div>

                  {/* Floating Badge "Cliquer pour feuilleter" */}
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-30 whitespace-nowrap px-4 py-2 rounded-full bg-espresso-900 text-linen-50 text-xs font-bold shadow-xl flex items-center gap-2 border border-white/15 group-hover:scale-105 transition-transform">
                    <PenTool className="w-3.5 h-3.5 text-amber-300" />
                    <span>Cliquer pour feuilleter les planches</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Season Book Switcher Pills under the 3D Stage */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-linen-100 border border-espresso-900/10">
              {seasonBooks.map((book, idx) => {
                const isSelected = idx === selectedIdx;
                return (
                  <button
                    key={book.id}
                    type="button"
                    onClick={() => setSelectedIdx(idx)}
                    className={`relative flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                      isSelected
                        ? "bg-espresso-900 text-linen-50 shadow-sm"
                        : "text-espresso-800/75 hover:text-espresso-900 hover:bg-white/60"
                    }`}
                  >
                    <span
                      style={{ backgroundColor: book.accentColor }}
                      className="w-2 h-2 rounded-full shrink-0"
                    />
                    <span>{book.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
