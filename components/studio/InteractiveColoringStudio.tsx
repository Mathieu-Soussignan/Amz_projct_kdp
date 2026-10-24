"use client";

import { useState, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Wand2,
  RotateCcw,
  ArrowUpRight,
  SlidersHorizontal,
  Palette,
  Check,
} from "lucide-react";
import { BOOKS, BLUR_PLACEHOLDER, type Book } from "@/data/books";

const MARKER_PALETTE = [
  { name: "Orange Citrouille", hex: "#D97736" },
  { name: "Rouge Bonnet", hex: "#C0392B" },
  { name: "Chocolat Chaud", hex: "#7F4F24" },
  { name: "Miel Doré", hex: "#F4A261" },
  { name: "Rose Guimauve", hex: "#E06D8C" },
  { name: "Vert Sapin", hex: "#277455" },
  { name: "Bleu Lagon", hex: "#3AAFA9" },
  { name: "Crème Vanille", hex: "#FFE6A7" },
];

const INITIAL_ZONES: Record<string, string> = {
  skyHalo: "#FFFDF9",
  mugBody: "#FFFDF9",
  mugHandle: "#FFFDF9",
  chocolateDrip: "#FFFDF9",
  marshmallows: "#FFFDF9",
  cinnamonStick: "#FFFDF9",
  leafLeft: "#FFFDF9",
  leafRight: "#FFFDF9",
  saucer: "#FFFDF9",
  heartCenter: "#FFFDF9",
};

const MAGIC_PRESET: Record<string, string> = {
  skyHalo: "#FFE6A7",
  mugBody: "#D97736",
  mugHandle: "#C0392B",
  chocolateDrip: "#7F4F24",
  marshmallows: "#FBF3E8",
  cinnamonStick: "#9C6644",
  leafLeft: "#277455",
  leafRight: "#F4A261",
  saucer: "#3AAFA9",
  heartCenter: "#E06D8C",
};

export default function InteractiveColoringStudio() {
  const [selectedColor, setSelectedColor] = useState(MARKER_PALETTE[0]!.hex);
  const [zones, setZones] = useState<Record<string, string>>(INITIAL_ZONES);
  const [coloredCount, setColoredCount] = useState(0);
  const [lastColoredZone, setLastColoredZone] = useState<string | null>(null);

  // Interactive Before / After Reveal Slider state
  const [activeBook, setActiveBook] = useState<Book>(BOOKS[0]!);
  const [sliderPos, setSliderPos] = useState(52);
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef(false);

  // Subtle ASMR Crayon / Felt-tip stroke sound
  const playBrushSound = useCallback((freq = 680) => {
    if (typeof window === "undefined") return;
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const duration = 0.11;
      const bufferSize = ctx.sampleRate * duration;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        const env = Math.sin((i / bufferSize) * Math.PI);
        data[i] = (Math.random() * 2 - 1) * env * 0.05;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(freq, ctx.currentTime);
      filter.Q.setValueAtTime(2.2, ctx.currentTime);
      noise.connect(filter);
      filter.connect(ctx.destination);
      noise.start();
    } catch {
      // Ignore autoplay errors
    }
  }, []);

  const handleZoneClick = (zoneKey: string) => {
    playBrushSound(740);
    setLastColoredZone(zoneKey);
    setZones((prev) => {
      const wasWhite = prev[zoneKey] === "#FFFDF9";
      if (wasWhite) {
        setColoredCount((c) => c + 1);
      }
      return { ...prev, [zoneKey]: selectedColor };
    });
  };

  const handleMagicFill = () => {
    const keys = Object.keys(MAGIC_PRESET);
    keys.forEach((k, idx) => {
      setTimeout(() => {
        playBrushSound(550 + idx * 55);
        setLastColoredZone(k);
        setZones((prev) => ({ ...prev, [k]: MAGIC_PRESET[k]! }));
      }, idx * 85);
    });
    setColoredCount(keys.length);
  };

  const handleReset = () => {
    playBrushSound(420);
    setZones(INITIAL_ZONES);
    setColoredCount(0);
    setLastColoredZone(null);
  };

  const updateSliderFromClientX = (clientX: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setSliderPos(Math.max(6, Math.min(94, pct)));
  };

  return (
    <section className="py-20 md:py-28 relative border-t border-espresso-900/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.22em] text-espresso-800/70">
              <Palette className="w-3.5 h-3.5 text-autumn-saffron" />
              <span>Expérience Interactive • Testez l&apos;Effet Bold &amp; Easy</span>
            </div>
            <h2 className="mt-3 font-serif text-3xl sm:text-5xl font-normal text-espresso-900 tracking-tight leading-[1.06]">
              Essayez le plaisir du{" "}
              <span className="italic font-light text-autumn-saffron">
                gros trait
              </span>{" "}
              en direct.
            </h2>
          </div>

          <p className="text-sm sm:text-base text-espresso-800/80 max-w-md leading-relaxed">
            Choisissez un crayon ou un feutre ci-dessous et touchez le dessin
            pour le colorier, ou glissez le révélateur Avant / Après sur nos
            albums officiels.
          </p>
        </div>

        {/* Dual Interactive Studio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* LEFT COLUMN (7 cols): Live Tap-to-Color Bold & Easy Canvas */}
          <div className="lg:col-span-7 rounded-[32px] bg-[#FBF3E8]/90 backdrop-blur-md border border-[#8C583A]/20 shadow-[0_20px_50px_-15px_rgba(92,50,22,0.14)] p-5 sm:p-7 flex flex-col justify-between">
            {/* Top Studio Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-espresso-900/10">
              <div className="flex items-center gap-2.5">
                <span className="px-3 py-1 rounded-full bg-autumn-saffron text-white text-[11px] font-bold uppercase tracking-wider">
                  Atelier Interactif
                </span>
                <span className="text-xs sm:text-sm font-serif font-bold text-espresso-900">
                  Touchez une zone pour la colorier !
                </span>
              </div>

              <div className="flex items-center gap-2">
                <motion.button
                  type="button"
                  onClick={handleMagicFill}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-espresso-900 text-amber-200 text-xs font-bold hover:bg-espresso-800 transition-colors shadow-sm"
                >
                  <Wand2 className="w-3.5 h-3.5 text-amber-300" />
                  <span>Coloriage Magique</span>
                </motion.button>

                <button
                  type="button"
                  onClick={handleReset}
                  title="Effacer et recommencer"
                  className="p-2 rounded-full bg-linen-200/80 hover:bg-linen-300/80 text-espresso-900 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Interactive SVG Coloring Sheet (Bold & Easy Cozy Mug + Leaves + Heart) */}
            <div
              data-cursor="paint"
              className="relative my-5 mx-auto w-full max-w-[420px] aspect-square rounded-[24px] bg-[#FFFDF9] border-4 border-espresso-900/85 shadow-inner flex items-center justify-center p-4 select-none overflow-hidden"
            >
              <svg
                viewBox="0 0 400 400"
                className="w-full h-full cursor-pointer"
              >
                {/* 1. Background Sunburst / Halo Circle */}
                <motion.circle
                  cx="200"
                  cy="200"
                  r="158"
                  fill={zones.skyHalo}
                  stroke="#17120F"
                  strokeWidth="6"
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleZoneClick("skyHalo")}
                  className="transition-colors duration-300"
                />

                {/* 2. Left Autumn Leaf */}
                <motion.path
                  d="M 56 175 C 32 135 72 95 104 128 C 115 142 102 175 78 188 Z"
                  fill={zones.leafLeft}
                  stroke="#17120F"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  onClick={() => handleZoneClick("leafLeft")}
                  className="transition-colors duration-300"
                />
                <path
                  d="M 65 168 L 92 135"
                  stroke="#17120F"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  pointerEvents="none"
                />

                {/* 3. Right Autumn Leaf */}
                <motion.path
                  d="M 340 165 C 365 128 325 88 295 120 C 284 134 296 168 320 180 Z"
                  fill={zones.leafRight}
                  stroke="#17120F"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  onClick={() => handleZoneClick("leafRight")}
                  className="transition-colors duration-300"
                />
                <path
                  d="M 332 158 L 306 126"
                  stroke="#17120F"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  pointerEvents="none"
                />

                {/* 4. Cozy Saucer Plate */}
                <motion.ellipse
                  cx="195"
                  cy="318"
                  rx="112"
                  ry="22"
                  fill={zones.saucer}
                  stroke="#17120F"
                  strokeWidth="6"
                  onClick={() => handleZoneClick("saucer")}
                  className="transition-colors duration-300"
                />

                {/* 5. Mug Handle */}
                <motion.path
                  d="M 272 188 C 330 188 330 278 272 278 L 265 256 C 300 256 300 210 265 210 Z"
                  fill={zones.mugHandle}
                  stroke="#17120F"
                  strokeWidth="6"
                  strokeLinejoin="round"
                  onClick={() => handleZoneClick("mugHandle")}
                  className="transition-colors duration-300"
                />

                {/* 6. Cinnamon Stick */}
                <motion.path
                  d="M 225 130 L 254 76 L 274 86 L 245 140 Z"
                  fill={zones.cinnamonStick}
                  stroke="#17120F"
                  strokeWidth="6"
                  strokeLinejoin="round"
                  onClick={() => handleZoneClick("cinnamonStick")}
                  className="transition-colors duration-300"
                />

                {/* 7. Fluffy Marshmallows Top */}
                <motion.path
                  d="M 116 152 C 110 122 145 110 165 124 C 178 102 215 104 226 126 C 250 114 278 130 272 156 Z"
                  fill={zones.marshmallows}
                  stroke="#17120F"
                  strokeWidth="6"
                  strokeLinejoin="round"
                  onClick={() => handleZoneClick("marshmallows")}
                  className="transition-colors duration-300"
                />

                {/* 8. Mug Main Body */}
                <motion.path
                  d="M 112 155 L 276 155 L 266 286 C 262 310 232 320 194 320 C 156 320 126 310 122 286 Z"
                  fill={zones.mugBody}
                  stroke="#17120F"
                  strokeWidth="6.5"
                  strokeLinejoin="round"
                  onClick={() => handleZoneClick("mugBody")}
                  className="transition-colors duration-300"
                />

                {/* 9. Melted Hot Chocolate Drip Rim */}
                <motion.path
                  d="M 112 155 L 276 155 L 274 178 C 258 178 256 205 242 205 C 228 205 228 178 212 178 C 198 178 196 218 180 218 C 164 218 164 180 148 180 C 134 180 132 200 116 196 Z"
                  fill={zones.chocolateDrip}
                  stroke="#17120F"
                  strokeWidth="6"
                  strokeLinejoin="round"
                  onClick={() => handleZoneClick("chocolateDrip")}
                  className="transition-colors duration-300"
                />

                {/* 10. Cute Center Heart on Mug */}
                <motion.path
                  d="M 194 276 C 194 276 156 252 156 230 C 156 215 174 208 194 226 C 214 208 232 215 232 230 C 232 252 194 276 194 276 Z"
                  fill={zones.heartCenter}
                  stroke="#17120F"
                  strokeWidth="6"
                  strokeLinejoin="round"
                  onClick={() => handleZoneClick("heartCenter")}
                  className="transition-colors duration-300"
                />
              </svg>

              {/* Subtle Bottom Watermark */}
              <span className="pointer-events-none absolute bottom-2.5 inset-x-0 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-espresso-800/45">
                CaroTine • Démo Interactive Bold &amp; Easy
              </span>

              {/* Floating Sparkle Feedback */}
              <AnimatePresence>
                {lastColoredZone && (
                  <motion.div
                    key={lastColoredZone + coloredCount}
                    initial={{ opacity: 0, y: 10, scale: 0.85 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="pointer-events-none absolute top-3 right-3 px-3 py-1 rounded-full bg-espresso-900/90 text-amber-200 text-[11px] font-bold flex items-center gap-1.5 shadow-md"
                  >
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>Zéro dépassement !</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Crayons & Feutres Color Picker Bar */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-espresso-800/75 mb-2.5">
                <span>Choisissez votre crayon ou feutre :</span>
                <span className="font-bold text-espresso-900">
                  {
                    MARKER_PALETTE.find((m) => m.hex === selectedColor)?.name
                  }
                </span>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {MARKER_PALETTE.map((swatch) => {
                  const isSelected = swatch.hex === selectedColor;
                  return (
                    <motion.button
                      key={swatch.hex}
                      type="button"
                      onClick={() => {
                        setSelectedColor(swatch.hex);
                        playBrushSound(860);
                      }}
                      whileHover={{ y: -4 }}
                      whileTap={{ scale: 0.92 }}
                      style={{ backgroundColor: swatch.hex }}
                      title={swatch.name}
                      className={`h-11 rounded-2xl flex items-center justify-center transition-all shadow-md border-2 ${
                        isSelected
                          ? "border-espresso-900 scale-105 ring-2 ring-espresso-900/25"
                          : "border-white/80 opacity-85 hover:opacity-100"
                      }`}
                    >
                      {isSelected && (
                        <Check className="w-4 h-4 text-white drop-shadow" />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (5 cols): Interactive Before/After Book Slider + Instant Amazon Conversion */}
          <div className="lg:col-span-5 rounded-[32px] bg-[#FBF3E8]/90 backdrop-blur-md border border-[#8C583A]/20 shadow-[0_20px_50px_-15px_rgba(92,50,22,0.14)] p-5 sm:p-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 pb-4 border-b border-espresso-900/10">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-autumn-saffron" />
                  <span className="text-xs sm:text-sm font-serif font-bold text-espresso-900">
                    Révélateur Trait Noir ↔ Couleur
                  </span>
                </div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-espresso-800/60">
                  Glissez le curseur
                </span>
              </div>

              {/* Interactive Before / After Wipe Container */}
              <div
                ref={sliderRef}
                onPointerDown={(e) => {
                  isDraggingRef.current = true;
                  updateSliderFromClientX(e.clientX);
                }}
                onPointerMove={(e) => {
                  if (!isDraggingRef.current && e.buttons !== 1) return;
                  updateSliderFromClientX(e.clientX);
                }}
                onPointerUp={() => {
                  isDraggingRef.current = false;
                }}
                onPointerLeave={() => {
                  isDraggingRef.current = false;
                }}
                className="relative mt-5 w-full aspect-square rounded-[24px] overflow-hidden select-none cursor-ew-resize shadow-physical-book border border-espresso-900/15 bg-[#FFFDF9]"
              >
                {/* Layer 1: Interior Black & White Line Art */}
                <Image
                  src={`${activeBook.interiorPreview[0]}?v=real`}
                  alt={`Intérieur ${activeBook.title}`}
                  fill
                  sizes="420px"
                  placeholder="blur"
                  blurDataURL={BLUR_PLACEHOLDER}
                  className="object-cover pointer-events-none"
                />

                {/* Layer 2: Colored Cover Revealed by Slider */}
                <div
                  style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
                  className="absolute inset-0 pointer-events-none"
                >
                  <Image
                    src={`${activeBook.coverImage}?v=real`}
                    alt={activeBook.title}
                    fill
                    sizes="420px"
                    placeholder="blur"
                    blurDataURL={BLUR_PLACEHOLDER}
                    className="object-cover"
                  />
                </div>

                {/* Vertical Golden Divider Bar & Handle */}
                <div
                  style={{ left: `${sliderPos}%` }}
                  className="pointer-events-none absolute inset-y-0 -translate-x-1/2 w-1 bg-amber-300 shadow-[0_0_16px_rgba(255,215,100,0.95)] flex items-center justify-center"
                >
                  <div className="w-10 h-10 rounded-full bg-espresso-900 text-amber-200 border-2 border-amber-300 shadow-xl flex items-center justify-center text-xs font-bold">
                    ↔
                  </div>
                </div>

                {/* Labels on Left & Right */}
                <span className="pointer-events-none absolute top-3 left-3 px-2.5 py-1 rounded-full bg-espresso-900/80 text-linen-50 text-[10px] font-bold">
                  Couleur
                </span>
                <span className="pointer-events-none absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 text-espresso-900 text-[10px] font-bold border border-espresso-900/15">
                  Trait Noir KDP
                </span>
              </div>

              {/* Book Selector Pills for the Before/After Slider */}
              <div className="mt-4 flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {BOOKS.map((b) => {
                  const isCurrent = b.id === activeBook.id;
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setActiveBook(b)}
                      className={`shrink-0 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
                        isCurrent
                          ? "bg-espresso-900 text-linen-50 shadow-sm"
                          : "bg-linen-200/70 text-espresso-800 hover:bg-linen-200"
                      }`}
                    >
                      {b.title}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Direct Conversion Box */}
            <div className="mt-5 pt-4 border-t border-espresso-900/10">
              <div className="flex items-center justify-between text-xs mb-2.5">
                <span className="font-serif font-bold text-espresso-900 truncate">
                  {activeBook.title}
                </span>
                <span className="font-bold text-emerald-800 shrink-0">
                  7,99 € • Prime
                </span>
              </div>

              <motion.a
                data-cursor="amazon"
                href={activeBook.amazonUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileTap={{ scale: 0.96 }}
                style={{ backgroundColor: activeBook.accentColor }}
                className="w-full py-4 px-5 rounded-2xl text-white font-bold text-sm shadow-lg flex items-center justify-between gap-2 hover:opacity-95 transition-opacity"
              >
                <span>Commander cet album sur Amazon</span>
                <ArrowUpRight className="w-4 h-4 shrink-0" />
              </motion.a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
