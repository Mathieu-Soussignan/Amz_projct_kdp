"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import {
  Star,
  Sparkles,
  ArrowUpRight,
  BookOpen,
  Heart,
  CheckCircle2,
  Compass,
} from "lucide-react";
import { BOOKS, BLUR_PLACEHOLDER, type Book } from "@/data/books";

interface CommunityLoveWallProps {
  onOpenFlipbook: (book: Book) => void;
}

interface MoodOption {
  id: string;
  emoji: string;
  label: string;
  subtitle: string;
  recommendedIds: string[];
  reason: string;
}

const MOOD_OPTIONS: MoodOption[] = [
  {
    id: "plaid",
    emoji: "☕",
    label: "Décompresser le soir sous un plaid",
    subtitle: "Zéro charge mentale, motifs douillets & univers féeriques",
    recommendedIds: [
      "automne-cozy",
      "petits-animaux-automne",
      "maisons-enchantees",
    ],
    reason:
      "Idéal pour lâcher son téléphone le soir : des tasses fumantes, des petits animaux de la forêt ou des maisons enchantées au cœur des bois pour s'évader au calme.",
  },
  {
    id: "noel",
    emoji: "🎅",
    label: "Préparer la magie & les cadeaux de Noël",
    subtitle: "Ambiance sapin, guirlandes et chocolats chauds d'hiver",
    recommendedIds: ["noel-capybaras", "noel-axolotls", "noel-dinosaures"],
    reason:
      "Le trio festif incontournable à glisser sous le sapin ou dans un calendrier de l'Avent : capybaras zen, axolotls féériques et dinosaures en pulls de Noël.",
  },
  {
    id: "famille",
    emoji: "🦊",
    label: "Colorier en famille avec les enfants",
    subtitle: "Grands aplats faciles dès 4 ans, sans dépasser",
    recommendedIds: ["petits-animaux-automne", "noel-dinosaures", "lolo-et-lili"],
    reason:
      "Conçus pour réunir petits et grands autour de la table du salon : des formes généreuses et expressives où personne ne se décourage.",
  },
  {
    id: "kawaii",
    emoji: "💖",
    label: "Fan d'animaux kawaii & originaux",
    subtitle: "Capybaras, Axolotls et créatures de l'océan",
    recommendedIds: ["noel-capybaras", "noel-axolotls", "lolo-et-lili"],
    reason:
      "Pour celles et ceux qui fondent devant les mascottes les plus mignonnes de TikTok, mises en scène dans des décors joyeux et relaxants.",
  },
];

const READER_REVIEWS = [
  {
    id: "rev-1",
    author: "Chloé",
    badge: "Achat vérifié",
    rating: 5,
    title: "Trop mignon pour décompresser",
    quote:
      "Franchement top ! Gros traits simples comme j'aime pour me vider la tête le soir devant une série sans réfléchir.",
    bookId: "automne-cozy",
    dateLabel: "Avis publié en France",
  },
  {
    id: "rev-2",
    author: "Aurélie B.",
    badge: "Achat vérifié",
    rating: 5,
    title: "Ma fille adore (et moi aussi)",
    quote:
      "Pris pour ma fille de 5 ans et au final je colorie dedans avec elle 😅 Les petits animaux sont super choux.",
    bookId: "petits-animaux-automne",
    dateLabel: "Avis publié en France",
  },
  {
    id: "rev-3",
    author: "Marine",
    badge: "Achat vérifié",
    rating: 5,
    title: "Fan des capybaras !!",
    quote:
      "Reçu hyper vite. Les dessins sont trop drôles, juste penser à glisser une feuille derrière si vous utilisez des gros feutres.",
    bookId: "noel-capybaras",
    dateLabel: "Avis publié en France",
  },
  {
    id: "rev-4",
    author: "Thomas",
    badge: "Achat vérifié",
    rating: 5,
    title: "Nickel en petit cadeau",
    quote:
      "Mon fils est dans sa période dinos, il l'a direct attaqué aux crayons de couleur. Très bon rapport qualité/prix.",
    bookId: "noel-dinosaures",
    dateLabel: "Avis publié en France",
  },
];

const MARQUEE_ITEMS = [
  "✨ +530 000 ABONNÉS SUR TIKTOK",
  "🖍️ CRAYONS DE COULEUR & FEUTRES",
  "🖤 TRAITS ÉPAIS BOLD & EASY",
  "📄 IMPRESSION RECTO SEUL ANTI-TRANSFERT",
  "📦 LIVRAISON RAPIDE AMAZON PRIME",
  "🤍 IMAGINÉ AVEC AMOUR PAR CAROTINE",
];

export default function CommunityLoveWall({
  onOpenFlipbook,
}: CommunityLoveWallProps) {
  const [selectedMoodId, setSelectedMoodId] = useState<string>(
    MOOD_OPTIONS[0].id
  );
  const [selectedBookIdx, setSelectedBookIdx] = useState<number>(0);

  const currentMood =
    MOOD_OPTIONS.find((m) => m.id === selectedMoodId) ?? MOOD_OPTIONS[0];
  const recommendedBooks = currentMood.recommendedIds
    .map((id) => BOOKS.find((b) => b.id === id))
    .filter((b): b is Book => Boolean(b));
  const spotlightBook =
    recommendedBooks[selectedBookIdx] ?? recommendedBooks[0] ?? BOOKS[0];

  const handleMoodSelect = (moodId: string) => {
    setSelectedMoodId(moodId);
    setSelectedBookIdx(0);
  };

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* 1. Infinite Kinetic Editorial Ribbon */}
      <div className="relative mb-20 -rotate-[0.6deg] bg-espresso-900 text-linen-50 py-3.5 border-y border-amber-200/20 shadow-lg overflow-hidden select-none">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          className="flex items-center whitespace-nowrap w-max"
        >
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map(
            (item, idx) => (
              <div key={idx} className="inline-flex items-center">
                <span className="font-mono text-xs sm:text-sm font-bold tracking-[0.2em] px-6 text-amber-100/95">
                  {item}
                </span>
                <span className="text-amber-400/60">•</span>
              </div>
            )
          )}
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 2. Interactive "Trouve ton livre en 1 clic" Mood Matcher */}
        <div className="rounded-[36px] bg-[#FBF3E8]/95 border border-[#8C583A]/20 shadow-[0_24px_65px_-20px_rgba(92,50,22,0.14)] p-6 sm:p-10 lg:p-12 mb-24 relative overflow-hidden">
          <div
            aria-hidden="true"
            style={{
              background: `radial-gradient(circle at 80% 30%, ${spotlightBook.accentColor}26 0%, transparent 65%)`,
            }}
            className="pointer-events-none absolute inset-0 transition-all duration-700"
          />

          <div className="relative z-10 max-w-2xl mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-espresso-900/10 shadow-sm mb-3">
              <Compass
                style={{ color: spotlightBook.accentColor }}
                className="w-3.5 h-3.5"
              />
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-espresso-900">
                Diagnostic Cocooning • 10 Secondes
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-espresso-900 tracking-tight leading-[1.1]">
              Tu hésites ?{" "}
              <span className="italic font-light text-espresso-800">
                Dis-nous ton humeur du moment,
              </span>{" "}
              on te guide.
            </h2>
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: 4 Interactive Mood Buttons */}
            <div className="lg:col-span-6 space-y-3">
              {MOOD_OPTIONS.map((mood) => {
                const isActive = mood.id === selectedMoodId;
                return (
                  <button
                    key={mood.id}
                    type="button"
                    onClick={() => handleMoodSelect(mood.id)}
                    className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all flex items-start gap-4 ${
                      isActive
                        ? "bg-espresso-900 text-linen-50 border-espresso-900 shadow-lg scale-[1.01]"
                        : "bg-white/85 hover:bg-white text-espresso-900 border-espresso-900/10"
                    }`}
                  >
                    <span className="text-2xl sm:text-3xl shrink-0 mt-0.5">
                      {mood.emoji}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-serif text-base sm:text-lg font-bold leading-snug">
                          {mood.label}
                        </span>
                        <span
                          className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${
                            isActive
                              ? "bg-amber-400/20 text-amber-200"
                              : "bg-linen-100 text-espresso-800/70"
                          }`}
                        >
                          {mood.recommendedIds.length} albums
                        </span>
                      </div>
                      <p
                        className={`text-xs mt-1 leading-relaxed ${
                          isActive
                            ? "text-linen-100/80"
                            : "text-espresso-800/70"
                        }`}
                      >
                        {mood.subtitle}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right: Instant Personalized Recommendation Card */}
            <div className="lg:col-span-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${currentMood.id}-${spotlightBook.id}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.28 }}
                  className="rounded-3xl bg-white/95 border border-espresso-900/12 p-6 sm:p-7 shadow-xl"
                >
                  {/* Switcher between the recommended books for this mood */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-5 border-b border-espresso-900/10">
                    <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-espresso-800/65 font-bold">
                      Recommandation CaroTine :
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {recommendedBooks.map((b, idx) => (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => setSelectedBookIdx(idx)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                            idx === selectedBookIdx
                              ? "bg-espresso-900 text-linen-50 shadow-sm"
                              : "bg-linen-100 text-espresso-800 hover:bg-linen-200"
                          }`}
                        >
                          {b.title.split(" ").slice(0, 2).join(" ")}…
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    {/* 3D Miniature Cover */}
                    <div
                      data-cursor="book"
                      onClick={() => onOpenFlipbook(spotlightBook)}
                      className="relative w-36 h-36 sm:w-40 sm:h-40 shrink-0 cursor-pointer group"
                    >
                      <div
                        style={{ backgroundColor: spotlightBook.accentColor }}
                        className="absolute inset-y-1 -left-2.5 w-3 rounded-l-md brightness-75"
                      />
                      <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-physical-book group-hover:scale-105 transition-transform border border-espresso-900/15">
                        <Image
                          src={`${spotlightBook.coverImage}?v=real`}
                          alt={spotlightBook.title}
                          fill
                          sizes="160px"
                          placeholder="blur"
                          blurDataURL={BLUR_PLACEHOLDER}
                          className="object-cover"
                        />
                      </div>
                    </div>

                    {/* Details + Why it matches */}
                    <div className="flex-1 text-center sm:text-left">
                      {spotlightBook.badge && (
                        <span
                          style={{ backgroundColor: spotlightBook.accentColor }}
                          className="inline-block px-2.5 py-0.5 rounded-full text-white text-[10px] font-bold uppercase tracking-wider mb-1.5"
                        >
                          {spotlightBook.badge}
                        </span>
                      )}
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-espresso-900 leading-tight">
                        {spotlightBook.title}
                      </h3>
                      <p className="mt-2 text-xs sm:text-sm text-espresso-800/80 leading-relaxed">
                        {currentMood.reason}
                      </p>
                    </div>
                  </div>

                  {/* Direct Action Bar */}
                  <div className="mt-6 pt-4 border-t border-espresso-900/10 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                    <a
                      href={spotlightBook.amazonUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor="amazon"
                      style={{ backgroundColor: spotlightBook.accentColor }}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl text-white font-bold text-xs sm:text-sm shadow-md hover:opacity-95 transition-opacity"
                    >
                      <span>Commander cet album sur Amazon</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                    <button
                      type="button"
                      onClick={() => onOpenFlipbook(spotlightBook)}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-3.5 rounded-2xl bg-linen-100 hover:bg-espresso-900 text-espresso-900 hover:text-linen-50 font-bold text-xs transition-colors"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Feuilleter</span>
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* 3. Reader Love Wall (5/5 ★ Verified Reviews with Direct Amazon Conversion) */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FBF3E8] border border-espresso-900/10 shadow-sm mb-3">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-espresso-900">
              Vos retours sur Amazon
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-espresso-900 tracking-tight leading-[1.08]">
            Court, honnête,{" "}
            <span className="italic font-light text-espresso-800">
              validé à la maison.
            </span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-espresso-800/80">
            Quelques petits mots laissés par celles et ceux qui colorient déjà
            nos albums.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {READER_REVIEWS.map((review, idx) => {
            const linkedBook =
              BOOKS.find((b) => b.id === review.bookId) ?? BOOKS[0];
            return (
              <motion.article
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.07 }}
                className="flex flex-col justify-between rounded-[28px] bg-[#FBF3E8]/90 border border-[#8C583A]/20 p-6 shadow-[0_16px_40px_-15px_rgba(92,50,22,0.1)]"
              >
                <div>
                  {/* 5 Golden Stars + Verified Badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-amber-400 text-amber-500"
                        />
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {review.badge}
                    </span>
                  </div>

                  {/* Short Amazon-Style Review Title + Spontaneous Human Comment */}
                  <h3 className="text-sm font-bold text-espresso-900 mb-1.5">
                    {review.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-espresso-800/90 leading-relaxed">
                    {review.quote}
                  </p>
                </div>

                {/* Author + Direct Book Miniature Link */}
                <div className="mt-6 pt-4 border-t border-espresso-900/10">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="block text-xs font-bold text-espresso-900">
                        {review.author}
                      </span>
                      <span className="block text-[10px] text-espresso-800/65">
                        {review.dateLabel}
                      </span>
                    </div>
                    <Sparkles
                      style={{ color: linkedBook.accentColor }}
                      className="w-4 h-4"
                    />
                  </div>

                  <a
                    href={linkedBook.amazonUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="amazon"
                    className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-white hover:bg-espresso-900 text-espresso-900 hover:text-linen-50 border border-espresso-900/10 transition-colors group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-espresso-900/10">
                        <Image
                          src={`${linkedBook.coverImage}?v=real`}
                          alt={linkedBook.title}
                          fill
                          sizes="32px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 text-left">
                        <span className="block text-[11px] font-bold truncate">
                          {linkedBook.title}
                        </span>
                        <span className="block text-[9px] opacity-70">
                          Voir sur Amazon Prime
                        </span>
                      </div>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 shrink-0 opacity-70 group-hover:opacity-100" />
                  </a>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
