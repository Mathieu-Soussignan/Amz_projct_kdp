"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  ArrowUpRight,
  Hand,
  Sparkles,
  BookOpen,
  ZoomIn,
} from "lucide-react";
import {
  BOOKS,
  BOOK_EDITORIAL_META,
  BLUR_PLACEHOLDER,
  type Book,
} from "@/data/books";

interface FlipbookModalProps {
  book: Book | null;
  onClose: () => void;
  onSelectBook: (book: Book) => void;
}

export default function FlipbookModal({
  book,
  onClose,
  onSelectBook,
}: FlipbookModalProps) {
  // Spread index: 0 = Planche Intérieure 1, 1 = Planche Intérieure 2, 2 = Couverture Complète
  const [pageIdx, setPageIdx] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [asmrEnabled, setAsmrEnabled] = useState(true);
  const [magnifierEnabled, setMagnifierEnabled] = useState(true);
  const [lensPos, setLensPos] = useState<{
    x: number;
    y: number;
    visible: boolean;
  }>({ x: 50, y: 50, visible: false });
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    setPageIdx(0);
  }, [book]);

  // Synthesize gentle ASMR paper page-turn & felt-tip whisper using Web Audio API
  const playPaperAsmr = useCallback(() => {
    if (!asmrEnabled || typeof window === "undefined") return;
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioContextClass) return;

      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const duration = 0.22;
      const bufferSize = ctx.sampleRate * duration;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        const env = Math.sin((i / bufferSize) * Math.PI);
        data[i] = (Math.random() * 2 - 1) * env * 0.08;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(1100, ctx.currentTime);
      filter.Q.setValueAtTime(1.8, ctx.currentTime);

      noise.connect(filter);
      filter.connect(ctx.destination);
      noise.start();
    } catch {
      // Ignore audio errors if blocked by browser autoplay policy
    }
  }, [asmrEnabled]);

  useEffect(() => {
    if (!book) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") {
        setDirection(1);
        setPageIdx((p) => (p + 1) % 3);
        playPaperAsmr();
      }
      if (e.key === "ArrowLeft") {
        setDirection(-1);
        setPageIdx((p) => (p - 1 + 3) % 3);
        playPaperAsmr();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [book, onClose, playPaperAsmr]);

  if (!book) return null;

  const meta = BOOK_EDITORIAL_META[book.id];
  const slides = [
    {
      src: `${book.interiorPreview[1]}?v=real`,
      label:
        meta?.pageCaptions?.[1] ??
        "Quatrième de Couverture Officielle — Aperçu des planches",
      tag: "4ème de Couverture Officielle Amazon",
    },
    {
      src: `${book.interiorPreview[0]}?v=real`,
      label:
        meta?.pageCaptions?.[0] ?? "Extrait Intérieur Officiel — Trait Noir KDP",
      tag: "Zoom Illustration Intérieure",
    },
    {
      src: `${book.coverImage}?v=real`,
      label: `Couverture Officielle — ${book.title}`,
      tag: "Couverture Officielle Amazon KDP",
    },
  ];

  const currentSlide = slides[pageIdx] ?? slides[0];

  const handleNext = () => {
    setDirection(1);
    setPageIdx((prev) => (prev + 1) % slides.length);
    playPaperAsmr();
  };

  const handlePrev = () => {
    setDirection(-1);
    setPageIdx((prev) => (prev - 1 + slides.length) % slides.length);
    playPaperAsmr();
  };

  return (
    <AnimatePresence>
      <motion.div
        key="flipbook-overlay"
        data-lenis-prevent
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-espresso-900/85 backdrop-blur-xl flex flex-col justify-between p-3 sm:p-6 overflow-y-auto"
      >
        {/* Top Modal Controls Bar */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="max-w-6xl w-full mx-auto flex items-center justify-between gap-3 bg-linen-50/10 backdrop-blur-md border border-white/15 rounded-2xl px-4 py-3 text-linen-50"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span
              style={{ backgroundColor: book.accentColor }}
              className="px-3 py-1 rounded-full text-white text-[11px] font-bold uppercase tracking-wider shrink-0"
            >
              Look Inside
            </span>
            <div className="min-w-0">
              <h3 className="font-serif font-bold text-base sm:text-lg text-white truncate">
                {book.title}
              </h3>
              <p className="text-[11px] text-linen-200/70 truncate">
                {currentSlide.label}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Macro x2.5 Zoom Lens Toggle */}
            <button
              type="button"
              onClick={() => setMagnifierEnabled((v) => !v)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                magnifierEnabled
                  ? "bg-amber-400/20 text-amber-200 border border-amber-300/30"
                  : "bg-white/10 text-linen-200/60"
              }`}
              title="Activer ou couper la loupe grossissante x2.5"
            >
              <ZoomIn className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">Loupe x2.5</span>
            </button>

            {/* Optional ASMR Paper/Marker Sound Toggle */}
            <button
              type="button"
              onClick={() => setAsmrEnabled((v) => !v)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                asmrEnabled
                  ? "bg-amber-400/20 text-amber-200 border border-amber-300/30"
                  : "bg-white/10 text-linen-200/60"
              }`}
              title="Activer ou couper le bruissement ASMR du papier"
            >
              {asmrEnabled ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-amber-300" />
                  <span className="hidden sm:inline">Son Papier ASMR</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Muet</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Fermer le feuilleteur"
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Center Interactive Artbook Spread */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="max-w-5xl w-full mx-auto my-auto py-4 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
        >
          {/* Left Column (7 cols): Gestural Swipeable Physical Page */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div
              style={{ perspective: "1600px" }}
              className="relative w-full max-w-[470px] aspect-square flex items-center justify-center select-none"
            >
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={`${book.id}-slide-${pageIdx}`}
                  custom={direction}
                  initial={{
                    opacity: 0,
                    rotateY: direction > 0 ? 38 : -38,
                    scale: 0.94,
                  }}
                  animate={{
                    opacity: 1,
                    rotateY: 0,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    rotateY: direction > 0 ? -38 : 38,
                    scale: 0.94,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 240,
                    damping: 24,
                  }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -45) handleNext();
                    if (info.offset.x > 45) handlePrev();
                  }}
                  onPointerMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = ((e.clientX - rect.left) / rect.width) * 100;
                    const y = ((e.clientY - rect.top) / rect.height) * 100;
                    setLensPos({ x, y, visible: true });
                  }}
                  onPointerLeave={() =>
                    setLensPos((prev) => ({ ...prev, visible: false }))
                  }
                  style={{ transformOrigin: "left center" }}
                  className="relative w-full h-full rounded-[26px] bg-[#FFFDF9] shadow-2xl border-4 border-linen-200 overflow-hidden cursor-grab active:cursor-grabbing"
                >
                  <Image
                    src={currentSlide.src}
                    alt={currentSlide.label}
                    fill
                    sizes="(max-width: 768px) 380px, 470px"
                    placeholder="blur"
                    blurDataURL={BLUR_PLACEHOLDER}
                    className="object-contain p-2"
                  />

                  {/* Macro x2.5 Brass-Rimmed Magnifying Lens on Hover */}
                  {magnifierEnabled && lensPos.visible && (
                    <div
                      aria-hidden="true"
                      style={{
                        left: `${lensPos.x}%`,
                        top: `${lensPos.y}%`,
                        backgroundImage: `url(${currentSlide.src})`,
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "250%",
                        backgroundPosition: `${lensPos.x}% ${lensPos.y}%`,
                      }}
                      className="pointer-events-none hidden sm:block absolute w-36 h-36 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-amber-300 shadow-[0_15px_35px_rgba(0,0,0,0.45),inset_0_0_18px_rgba(255,255,255,0.6)] bg-[#FFFDF9] z-30"
                    />
                  )}

                  {/* Left Book Binding Shadow */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black/20 via-black/5 to-transparent"
                  />

                  {/* Top Pill on Page */}
                  <div className="absolute top-3.5 left-4 px-3 py-1 rounded-full bg-espresso-900/85 text-linen-50 text-[11px] font-bold">
                    {currentSlide.tag}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Left / Right Tactile Arrows */}
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Page précédente"
                className="absolute -left-2 sm:-left-5 top-1/2 -translate-y-1/2 p-3 rounded-full bg-linen-50 text-espresso-900 shadow-xl hover:scale-105 active:scale-95 transition-transform"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Page suivante"
                className="absolute -right-2 sm:-right-5 top-1/2 -translate-y-1/2 p-3 rounded-full bg-linen-50 text-espresso-900 shadow-xl hover:scale-105 active:scale-95 transition-transform"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Gesture Instruction & Page Switcher Pills */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              {slides.map((s, idx) => (
                <button
                  key={s.tag}
                  type="button"
                  onClick={() => {
                    setDirection(idx > pageIdx ? 1 : -1);
                    setPageIdx(idx);
                    playPaperAsmr();
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                    idx === pageIdx
                      ? "bg-linen-50 text-espresso-900 shadow-md"
                      : "bg-white/10 text-linen-200 hover:bg-white/20"
                  }`}
                >
                  {idx === 0
                    ? "4ème de Couverture"
                    : idx === 1
                    ? "Extrait Intérieur"
                    : "Couverture"}
                </button>
              ))}
            </div>
            <p className="mt-2 text-[11px] text-linen-200/70 flex items-center gap-1.5">
              <Hand className="w-3.5 h-3.5 text-amber-300" />
              Glissez du doigt (swipe) sur la planche pour tourner la page
            </p>
          </div>

          {/* Right Column (5 cols): Editorial Details & Instant Amazon Conversion */}
          <div className="lg:col-span-5 bg-linen-50 rounded-3xl p-6 sm:p-7 text-espresso-900 shadow-2xl space-y-5">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-espresso-800/60">
                {meta?.editionNumber ?? "CARNET D'ART KDP"}
              </span>
              <h4 className="font-serif text-2xl sm:text-3xl font-bold text-espresso-900 mt-1">
                {book.title}
              </h4>
              <p className="text-xs sm:text-sm text-espresso-800/75 mt-1">
                {book.subtitle}
              </p>
            </div>

            {meta?.creatorNote && (
              <div className="p-4 rounded-2xl bg-linen-100 border border-espresso-900/10 text-xs sm:text-sm text-espresso-800 leading-relaxed italic font-serif">
                « {meta.creatorNote} »
                <span className="block not-italic font-sans font-bold text-[11px] text-espresso-900 mt-1.5">
                  — CaroTine
                </span>
              </div>
            )}

            {/* Technical Specs */}
            <div className="space-y-2 text-xs text-espresso-800">
              <div className="flex items-center justify-between py-1.5 border-b border-espresso-900/10">
                <span className="font-semibold text-espresso-800/70">
                  Format :
                </span>
                <span className="font-bold text-espresso-900">
                  {meta?.formatLabel ?? "Format Carré Confort"}
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-espresso-900/10">
                <span className="font-semibold text-espresso-800/70">
                  Papier &amp; Encrage :
                </span>
                <span className="font-bold text-espresso-900">
                  {meta?.paperSpec ?? "Recto seul • Traits Bold & Easy"}
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="font-semibold text-espresso-800/70">
                  Expédition :
                </span>
                <span className="inline-flex items-center gap-1 font-bold text-emerald-700">
                  <Sparkles className="w-3.5 h-3.5" /> Amazon Prime Officiel
                </span>
              </div>
            </div>

            {/* Direct Real Amazon Link CTA */}
            <motion.a
              href={book.amazonUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileTap={{ scale: 0.96 }}
              style={{ backgroundColor: book.accentColor }}
              className="w-full py-4 px-6 rounded-2xl text-white font-bold text-sm sm:text-base shadow-xl flex items-center justify-center gap-2.5 hover:opacity-95 transition-opacity"
            >
              <span>Commander cet album sur Amazon</span>
              <ArrowUpRight className="w-4 h-4" />
            </motion.a>

            {/* Quick Switcher to Preview Another Book */}
            <div className="pt-2 border-t border-espresso-900/10">
              <span className="block text-[10px] font-mono uppercase tracking-wider text-espresso-800/60 mb-2">
                Feuilleter un autre album de la collection :
              </span>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {BOOKS.filter((b) => !b.classicCoverOnly).map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => onSelectBook(b)}
                    className={`shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors flex items-center gap-1 ${
                      b.id === book.id
                        ? "bg-espresso-900 text-linen-50"
                        : "bg-linen-200/70 text-espresso-800 hover:bg-linen-200"
                    }`}
                  >
                    <BookOpen className="w-3 h-3" />
                    <span className="truncate max-w-[110px]">{b.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
