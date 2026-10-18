"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import {
  Heart,
  Sparkles,
  PenTool,
  Layers,
  ArrowUpRight,
  Play,
  Pause,
  MessageCircle,
  Share2,
} from "lucide-react";
import { BOOKS, BLUR_PLACEHOLDER } from "@/data/books";

const TIKTOK_CLIPS = [
  {
    id: "clip-automne",
    book: BOOKS[0], // Coloriages d'Automne Cozy
    handle: "@CaroTine",
    followers: "530K+ abonnés",
    views: "1,9M vues",
    likes: "184K",
    comments: "2 940",
    caption:
      "Soirée pluvieuse sous le plaid avec crayons et feutres sur le tome Automne Cozy 🍂☕ Quel bonheur de colorier sans prise de tête !",
    sound: "Son original • Pause Coloriage Cosy & Pluie d'Automne",
  },
  {
    id: "clip-capybara",
    book: BOOKS[3], // Noël Magique des Capybaras
    handle: "@CaroTine",
    followers: "530K+ abonnés",
    views: "2,4M vues",
    likes: "265K",
    comments: "4 120",
    caption:
      "Vous nous l'avez réclamé par milliers : le Noël Magique des Capybaras est enfin dispo sur Amazon 🎄🎅",
    sound: "Cosy Christmas Lo-Fi • CaroTine",
  },
  {
    id: "clip-axolotl",
    book: BOOKS[4], // Le Noël Magique des Axolotls
    handle: "@CaroTine",
    followers: "530K+ abonnés",
    views: "1,3M vues",
    likes: "142K",
    comments: "1 880",
    caption:
      "Gros traits simples et épurés sur le format carré 8,5x8,5 du Noël des Axolotls 💕 Idéal aux crayons comme aux feutres !",
    sound: "Pause Cocooning • CaroTine",
  },
];

export default function DuoStory() {
  const [activeClipIdx, setActiveClipIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const activeClip = TIKTOK_CLIPS[activeClipIdx] ?? TIKTOK_CLIPS[0];

  return (
    <section
      id="duo-story"
      className="py-24 md:py-32 relative border-t border-espresso-900/10 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-10 items-center">
          {/* Left Column (7 cols): Editorial Story of CaroTine */}
          <div className="lg:col-span-7 space-y-7">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.22em] text-espresso-800/70">
              <Heart className="w-3.5 h-3.5 text-autumn-saffron fill-autumn-saffron" />
              <span>03 / L&apos;Esprit Cocooning CaroTine</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl lg:text-[54px] font-normal text-espresso-900 tracking-tight leading-[1.06]">
              CaroTine :{" "}
              <span className="italic font-light text-autumn-saffron">
                deux belles-sœurs,
              </span>{" "}
              une même passion du coloriage cosy.
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-espresso-800/85 leading-relaxed max-w-2xl">
              <p>
                Tout est parti d&apos;une envie toute simple autour d&apos;une
                tasse de thé bien chaud : créer les livres de coloriage
                qu&apos;on rêvait nous-mêmes d&apos;avoir à la maison. Des
                dessins{" "}
                <strong className="font-semibold text-espresso-900">
                  vraiment relaxants (Bold &amp; Easy)
                </strong>
                , loin des cahiers compliqués où l&apos;on passe trois heures
                sur un détail minuscule.
              </p>
              <p>
                Que tu préfères sortir tes{" "}
                <strong className="font-semibold text-espresso-900">
                  crayons de couleur ou tes feutres
                </strong>
                , chaque album{" "}
                <strong className="font-semibold text-espresso-900">
                  CaroTine
                </strong>{" "}
                rassemble 30 illustrations originales aux contours bien épais,
                ronds et ultra-mignons — pensées pour déconnecter des écrans et
                s&apos;offrir une vraie pause cocooning.
              </p>
            </div>

            {/* 3 Editorial Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-5 rounded-3xl bg-[#FBF3E8]/85 backdrop-blur-md border border-[#8C583A]/20 shadow-sm">
                <PenTool className="w-5 h-5 text-autumn-saffron mb-3" />
                <h3 className="font-serif font-bold text-base text-espresso-900">
                  Gros Traits &amp; Zéro Stress
                </h3>
                <p className="text-xs text-espresso-800/80 mt-1 leading-relaxed">
                  Aucun détail minuscule qui fatigue les yeux : des contours
                  francs et généreux pour colorier sans jamais se prendre la
                  tête.
                </p>
              </div>

              <div className="p-5 rounded-3xl bg-[#FBF3E8]/85 backdrop-blur-md border border-[#8C583A]/20 shadow-sm">
                <Layers className="w-5 h-5 text-noel-velvet mb-3" />
                <h3 className="font-serif font-bold text-base text-espresso-900">
                  Crayons &amp; Feutres
                </h3>
                <p className="text-xs text-espresso-800/80 mt-1 leading-relaxed">
                  Chaque dessin est imprimé d&apos;un seul côté de la feuille
                  (recto seul) pour un confort total aux crayons de couleur
                  comme aux feutres.
                </p>
              </div>

              <div className="p-5 rounded-3xl bg-[#FBF3E8]/85 backdrop-blur-md border border-[#8C583A]/20 shadow-sm">
                <Sparkles className="w-5 h-5 text-autumn-rust mb-3" />
                <h3 className="font-serif font-bold text-base text-espresso-900">
                  Pour Petits &amp; Grands
                </h3>
                <p className="text-xs text-espresso-800/80 mt-1 leading-relaxed">
                  Des capybaras de Noël aux gâteaux d&apos;automne en passant
                  par l&apos;océan : des univers mignons et réconfortants qui
                  font du bien à tout âge.
                </p>
              </div>
            </div>

            {/* Duo Signature Card */}
            <div className="p-5 sm:p-6 rounded-3xl bg-espresso-900 text-linen-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center gap-3.5">
                <span className="w-11 h-11 rounded-full bg-autumn-saffron text-white font-serif font-bold flex items-center justify-center border-2 border-amber-200/30 text-sm shrink-0">
                  CT
                </span>
                <div>
                  <p className="font-serif italic text-base sm:text-lg text-amber-200">
                    « Colorier 15 minutes sous un plaid, c’est notre rituel
                    anti-écran préféré. »
                  </p>
                  <span className="text-xs text-linen-200/75">
                    CaroTine — Collection Officielle Amazon KDP
                  </span>
                </div>
              </div>

              <a
                href="#catalogue"
                className="shrink-0 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-linen-50 transition-colors"
              >
                <span>Voir les 7 livres</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Right Column (5 cols): 9:16 Smartphone Mock-up Playing Accelerated Coloring Video */}
          <div className="lg:col-span-5 flex flex-col items-center">
            {/* Realistic Smartphone Bezel (9:16 Aspect Ratio) */}
            <div className="relative w-full max-w-[320px] aspect-[9/16] rounded-[44px] bg-espresso-900 p-3 shadow-2xl border-4 border-espresso-800">
              {/* Dynamic Island / Speaker Notch */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2 z-30 w-24 h-5 rounded-full bg-black flex items-center justify-end px-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              {/* Screen Viewport */}
              <div className="relative w-full h-full rounded-[34px] overflow-hidden bg-[#FFFDF9] flex flex-col justify-between">
                {/* Base Layer: Uncolored Line Art Page */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeClip.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={`${activeClip.book.interiorPreview[0]}?v=real`}
                      alt={activeClip.book.title}
                      fill
                      sizes="320px"
                      placeholder="blur"
                      blurDataURL={BLUR_PLACEHOLDER}
                      className="object-cover"
                    />

                    {/* Smooth Accelerated Time-Lapse Alcohol Marker Coloring Wipe */}
                    <motion.div
                      animate={
                        isPlaying
                          ? {
                              clipPath: [
                                "inset(0 100% 0 0)",
                                "inset(0 50% 0 0)",
                                "inset(0 0% 0 0)",
                                "inset(0 0% 0 0)",
                                "inset(0 100% 0 0)",
                              ],
                            }
                          : { clipPath: "inset(0 25% 0 0)" }
                      }
                      transition={{
                        duration: 5.2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={`${activeClip.book.coverImage}?v=real`}
                        alt={activeClip.book.title}
                        fill
                        sizes="320px"
                        placeholder="blur"
                        blurDataURL={BLUR_PLACEHOLDER}
                        className="object-cover"
                      />
                    </motion.div>
                  </motion.div>
                </AnimatePresence>

                {/* TikTok UI Scrim */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/85"
                />

                {/* Top TikTok Header inside Phone */}
                <div className="relative z-20 pt-9 px-4 flex items-center justify-between text-white">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-autumn-saffron text-white font-serif font-bold text-xs flex items-center justify-center">
                      CT
                    </span>
                    <div>
                      <span className="block text-xs font-bold leading-none">
                        {activeClip.handle}
                      </span>
                      <span className="text-[10px] text-amber-300 font-semibold">
                        {activeClip.followers}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsPlaying((v) => !v)}
                    aria-label={
                      isPlaying ? "Mettre en pause" : "Lire le timelapse"
                    }
                    className="p-2 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/70 transition-colors"
                  >
                    {isPlaying ? (
                      <Pause className="w-3.5 h-3.5" />
                    ) : (
                      <Play className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* Right Vertical TikTok Action Icons */}
                <div className="relative z-20 self-end pr-3 flex flex-col items-center gap-3.5 text-white">
                  <div className="flex flex-col items-center">
                    <span className="w-9 h-9 rounded-full bg-black/45 backdrop-blur-md flex items-center justify-center">
                      <Heart className="w-4 h-4 fill-[#FF3B5C] text-[#FF3B5C]" />
                    </span>
                    <span className="text-[10px] font-bold mt-0.5">
                      {activeClip.likes}
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="w-9 h-9 rounded-full bg-black/45 backdrop-blur-md flex items-center justify-center">
                      <MessageCircle className="w-4 h-4" />
                    </span>
                    <span className="text-[10px] font-bold mt-0.5">
                      {activeClip.comments}
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="w-9 h-9 rounded-full bg-black/45 backdrop-blur-md flex items-center justify-center">
                      <Share2 className="w-4 h-4" />
                    </span>
                    <span className="text-[10px] font-bold mt-0.5">
                      {activeClip.views}
                    </span>
                  </div>
                </div>

                {/* Bottom TikTok Caption & Direct Shop Pill */}
                <div className="relative z-20 p-4 text-white space-y-2.5">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-[10px] font-bold text-amber-200">
                    <Sparkles className="w-3 h-3" />
                    <span>Pause Coloriage • Crayons &amp; Feutres</span>
                  </div>

                  <p className="text-xs leading-snug text-white/95 line-clamp-3">
                    {activeClip.caption}
                  </p>

                  <p className="text-[10px] text-white/70 truncate">
                    🎵 {activeClip.sound}
                  </p>

                  <motion.a
                    href={activeClip.book.amazonUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileTap={{ scale: 0.96 }}
                    style={{ backgroundColor: activeClip.book.accentColor }}
                    className="w-full py-2.5 px-3 rounded-xl text-white font-bold text-xs flex items-center justify-between shadow-lg"
                  >
                    <span className="truncate">
                      Voir « {activeClip.book.title} » sur Amazon
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                  </motion.a>
                </div>
              </div>
            </div>

            {/* Video Clip Switcher below Phone */}
            <div className="mt-5 flex items-center gap-2">
              {TIKTOK_CLIPS.map((clip, idx) => (
                <button
                  key={clip.id}
                  type="button"
                  onClick={() => setActiveClipIdx(idx)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 ${
                    idx === activeClipIdx
                      ? "bg-espresso-900 text-linen-50 shadow-sm"
                      : "bg-linen-100 text-espresso-800 hover:bg-linen-200"
                  }`}
                >
                  Vidéo 0{idx + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
