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
  Download,
} from "lucide-react";
import { BOOKS, BLUR_PLACEHOLDER, type Book } from "@/data/books";

type DrawingTemplateId = "mug" | "capybara" | "axolotl";

const MARKER_PALETTE = [
  { name: "Orange Citrouille", hex: "#D97736" },
  { name: "Rouge Bonnet", hex: "#C0392B" },
  { name: "Chocolat Chaud", hex: "#9C6644" },
  { name: "Miel Doré", hex: "#F4A261" },
  { name: "Rose Guimauve", hex: "#E06D8C" },
  { name: "Vert Sapin", hex: "#277455" },
  { name: "Bleu Lagon", hex: "#3AAFA9" },
  { name: "Crème Vanille", hex: "#FFE6A7" },
];

const INITIAL_ZONES: Record<string, string> = {
  skyHalo: "#FFFDF9",
  zone1: "#FFFDF9",
  zone2: "#FFFDF9",
  zone3: "#FFFDF9",
  zone4: "#FFFDF9",
  zone5: "#FFFDF9",
  zone6: "#FFFDF9",
  zone7: "#FFFDF9",
  zone8: "#FFFDF9",
  zone9: "#FFFDF9",
};

const MAGIC_PRESETS: Record<DrawingTemplateId, Record<string, string>> = {
  mug: {
    skyHalo: "#FFE6A7",
    zone1: "#277455",
    zone2: "#F4A261",
    zone3: "#3AAFA9",
    zone4: "#C0392B",
    zone5: "#9C6644",
    zone6: "#FBF3E8",
    zone7: "#D97736",
    zone8: "#9C6644",
    zone9: "#E06D8C",
  },
  capybara: {
    skyHalo: "#FFE6A7",
    zone1: "#277455",
    zone2: "#9C6644",
    zone3: "#9C6644",
    zone4: "#D97736",
    zone5: "#C0392B",
    zone6: "#FBF3E8",
    zone7: "#C0392B",
    zone8: "#F4A261",
    zone9: "#E06D8C",
  },
  axolotl: {
    skyHalo: "#DEF2F1",
    zone1: "#E06D8C",
    zone2: "#E06D8C",
    zone3: "#FFB5C2",
    zone4: "#FFB5C2",
    zone5: "#3AAFA9",
    zone6: "#F4A261",
    zone7: "#C0392B",
    zone8: "#FFE6A7",
    zone9: "#277455",
  },
};

const TEMPLATES: {
  id: DrawingTemplateId;
  label: string;
  emoji: string;
  bookId: string;
}[] = [
  {
    id: "mug",
    label: "Tasse d'Automne",
    emoji: "☕",
    bookId: "automne-cozy",
  },
  {
    id: "capybara",
    label: "Capybara de Noël",
    emoji: "🎅",
    bookId: "noel-capybaras",
  },
  {
    id: "axolotl",
    label: "Axolotl Kawaii",
    emoji: "🌸",
    bookId: "noel-axolotls",
  },
];

export default function InteractiveColoringStudio() {
  const [templateId, setTemplateId] = useState<DrawingTemplateId>("mug");
  const [selectedColor, setSelectedColor] = useState(MARKER_PALETTE[0]!.hex);
  const [zones, setZones] = useState<Record<string, string>>(INITIAL_ZONES);
  const [coloredCount, setColoredCount] = useState(0);
  const [lastColoredZone, setLastColoredZone] = useState<string | null>(null);
  const [sparkleMode, setSparkleMode] = useState(false);

  const svgRef = useRef<SVGSVGElement | null>(null);

  // Interactive Before / After Reveal Slider state
  const studioBooks = BOOKS.filter((b) => !b.classicCoverOnly);
  const [activeBook, setActiveBook] = useState<Book>(studioBooks[0]!);
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

  const handleTemplateSwitch = (nextId: DrawingTemplateId) => {
    setTemplateId(nextId);
    setZones(INITIAL_ZONES);
    setColoredCount(0);
    setLastColoredZone(null);
    const tpl = TEMPLATES.find((t) => t.id === nextId);
    if (tpl) {
      const matched = studioBooks.find((b) => b.id === tpl.bookId);
      if (matched) setActiveBook(matched);
    }
  };

  const handleMagicFill = () => {
    const preset = MAGIC_PRESETS[templateId];
    const keys = Object.keys(preset);
    keys.forEach((k, idx) => {
      setTimeout(() => {
        playBrushSound(550 + idx * 55);
        setLastColoredZone(k);
        setZones((prev) => ({ ...prev, [k]: preset[k]! }));
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

  // Export the colored SVG as a Polaroid Souvenir PNG
  const handleExportPostcard = () => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const svgBlob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(svgBlob);
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 900;
      canvas.height = 1040;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Warm Polaroid Card Background
      ctx.fillStyle = "#FBF3E8";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Inner White Drawing Frame
      ctx.fillStyle = "#FFFDF9";
      ctx.strokeStyle = "#23140D";
      ctx.lineWidth = 6;
      ctx.fillRect(50, 50, 800, 800);
      ctx.strokeRect(50, 50, 800, 800);

      ctx.drawImage(img, 50, 50, 800, 800);

      // Signature Text at Bottom
      ctx.fillStyle = "#23140D";
      ctx.font = "bold 32px Georgia, serif";
      ctx.textAlign = "center";
      ctx.fillText("Colorié dans l'Atelier CaroTine ❤️", 450, 925);

      ctx.fillStyle = "#8C583A";
      ctx.font = "20px sans-serif";
      ctx.fillText("Collection Officielle Bold & Easy • Amazon KDP", 450, 968);

      URL.revokeObjectURL(url);
      const a = document.createElement("a");
      a.download = `mon-coloriage-carotine-${templateId}.png`;
      a.href = canvas.toDataURL("image/png");
      a.click();
    };
    img.src = url;
  };

  const updateSliderFromClientX = (clientX: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setSliderPos(Math.max(6, Math.min(94, pct)));
  };

  return (
    <section
      id="atelier-interactif"
      className="py-20 md:py-28 relative border-t border-espresso-900/10 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.22em] text-espresso-800/70">
              <Palette className="w-3.5 h-3.5 text-autumn-saffron" />
              <span>
                Expérience Interactive • Testez l&apos;Effet Bold &amp; Easy
              </span>
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
            Choisissez votre planche et vos couleurs ci-dessous pour colorier en
            direct, puis téléchargez votre carte souvenir ou glissez le
            révélateur Avant / Après.
          </p>
        </div>

        {/* Dual Interactive Studio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* LEFT COLUMN (7 cols): Live Tap-to-Color Bold & Easy Canvas */}
          <div className="lg:col-span-7 rounded-[32px] bg-[#FBF3E8]/90 backdrop-blur-md border border-[#8C583A]/20 shadow-[0_20px_50px_-15px_rgba(92,50,22,0.14)] p-5 sm:p-7 flex flex-col justify-between">
            {/* Top Studio Toolbar: 3 Drawing Templates + Magic Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-espresso-900/10">
              {/* 3 Template Switcher Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                {TEMPLATES.map((tpl) => {
                  const isActive = tpl.id === templateId;
                  return (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => handleTemplateSwitch(tpl.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isActive
                          ? "bg-espresso-900 text-linen-50 shadow-sm"
                          : "bg-white/80 hover:bg-white text-espresso-800 border border-espresso-900/10"
                      }`}
                    >
                      <span>{tpl.emoji}</span>
                      <span>{tpl.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setSparkleMode((v) => !v)}
                  title="Activer ou désactiver l'effet Paillettes Dorées"
                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                    sparkleMode
                      ? "bg-amber-400 text-espresso-900 border-amber-300 shadow-sm"
                      : "bg-white/80 text-espresso-800 border-espresso-900/10 hover:bg-white"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Paillettes</span>
                </button>

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
                  onClick={handleExportPostcard}
                  title="Télécharger mon coloriage en souvenir (PNG)"
                  className="p-2 rounded-full bg-white hover:bg-espresso-900 text-espresso-900 hover:text-linen-50 border border-espresso-900/10 transition-colors shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>

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

            {/* Interactive SVG Coloring Sheet */}
            <div
              data-cursor="paint"
              className="relative my-5 mx-auto w-full max-w-[420px] aspect-square rounded-[24px] bg-[#FFFDF9] border-4 border-espresso-900/85 shadow-inner flex items-center justify-center p-4 select-none overflow-hidden"
            >
              <svg
                ref={svgRef}
                viewBox="0 0 400 400"
                className="w-full h-full cursor-pointer"
              >
                {/* Shared Background Halo Circle */}
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

                {templateId === "mug" && (
                  <>
                    {/* Left Autumn Leaf */}
                    <motion.path
                      d="M 56 175 C 32 135 72 95 104 128 C 115 142 102 175 78 188 Z"
                      fill={zones.zone1}
                      stroke="#17120F"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      onClick={() => handleZoneClick("zone1")}
                      className="transition-colors duration-300"
                    />
                    <path
                      d="M 65 168 L 92 135"
                      stroke="#17120F"
                      strokeWidth="4.5"
                      strokeLinecap="round"
                      pointerEvents="none"
                    />

                    {/* Right Autumn Leaf */}
                    <motion.path
                      d="M 340 165 C 365 128 325 88 295 120 C 284 134 296 168 320 180 Z"
                      fill={zones.zone2}
                      stroke="#17120F"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      onClick={() => handleZoneClick("zone2")}
                      className="transition-colors duration-300"
                    />
                    <path
                      d="M 332 158 L 306 126"
                      stroke="#17120F"
                      strokeWidth="4.5"
                      strokeLinecap="round"
                      pointerEvents="none"
                    />

                    {/* Saucer */}
                    <motion.ellipse
                      cx="195"
                      cy="318"
                      rx="112"
                      ry="22"
                      fill={zones.zone3}
                      stroke="#17120F"
                      strokeWidth="6"
                      onClick={() => handleZoneClick("zone3")}
                      className="transition-colors duration-300"
                    />

                    {/* Mug Handle */}
                    <motion.path
                      d="M 272 188 C 330 188 330 278 272 278 L 265 256 C 300 256 300 210 265 210 Z"
                      fill={zones.zone4}
                      stroke="#17120F"
                      strokeWidth="6"
                      strokeLinejoin="round"
                      onClick={() => handleZoneClick("zone4")}
                      className="transition-colors duration-300"
                    />

                    {/* Cinnamon Stick */}
                    <motion.path
                      d="M 225 130 L 254 76 L 274 86 L 245 140 Z"
                      fill={zones.zone5}
                      stroke="#17120F"
                      strokeWidth="6"
                      strokeLinejoin="round"
                      onClick={() => handleZoneClick("zone5")}
                      className="transition-colors duration-300"
                    />

                    {/* Marshmallows */}
                    <motion.path
                      d="M 116 152 C 110 122 145 110 165 124 C 178 102 215 104 226 126 C 250 114 278 130 272 156 Z"
                      fill={zones.zone6}
                      stroke="#17120F"
                      strokeWidth="6"
                      strokeLinejoin="round"
                      onClick={() => handleZoneClick("zone6")}
                      className="transition-colors duration-300"
                    />

                    {/* Mug Body */}
                    <motion.path
                      d="M 112 155 L 276 155 L 266 286 C 262 310 232 320 194 320 C 156 320 126 310 122 286 Z"
                      fill={zones.zone7}
                      stroke="#17120F"
                      strokeWidth="6.5"
                      strokeLinejoin="round"
                      onClick={() => handleZoneClick("zone7")}
                      className="transition-colors duration-300"
                    />

                    {/* Chocolate Drip */}
                    <motion.path
                      d="M 112 155 L 276 155 L 274 178 C 258 178 256 205 242 205 C 228 205 228 178 212 178 C 198 178 196 218 180 218 C 164 218 164 180 148 180 C 134 180 132 200 116 196 Z"
                      fill={zones.zone8}
                      stroke="#17120F"
                      strokeWidth="6"
                      strokeLinejoin="round"
                      onClick={() => handleZoneClick("zone8")}
                      className="transition-colors duration-300"
                    />

                    {/* Heart on Mug */}
                    <motion.path
                      d="M 194 276 C 194 276 156 252 156 230 C 156 215 174 208 194 226 C 214 208 232 215 232 230 C 232 252 194 276 194 276 Z"
                      fill={zones.zone9}
                      stroke="#17120F"
                      strokeWidth="6"
                      strokeLinejoin="round"
                      onClick={() => handleZoneClick("zone9")}
                      className="transition-colors duration-300"
                    />
                  </>
                )}

                {templateId === "capybara" && (
                  <>
                    {/* Background Pine Tree Left */}
                    <motion.path
                      d="M 85 130 L 45 230 L 125 230 Z"
                      fill={zones.zone1}
                      stroke="#17120F"
                      strokeWidth="6"
                      strokeLinejoin="round"
                      onClick={() => handleZoneClick("zone1")}
                      className="transition-colors duration-300"
                    />
                    {/* Capybara Body */}
                    <motion.path
                      d="M 120 220 C 110 295 130 330 205 330 C 275 330 290 295 278 220 Z"
                      fill={zones.zone2}
                      stroke="#17120F"
                      strokeWidth="6.5"
                      strokeLinejoin="round"
                      onClick={() => handleZoneClick("zone2")}
                      className="transition-colors duration-300"
                    />
                    {/* Capybara Head */}
                    <motion.path
                      d="M 132 145 C 125 145 118 215 150 220 L 252 220 C 285 215 280 150 245 145 Z"
                      fill={zones.zone3}
                      stroke="#17120F"
                      strokeWidth="6.5"
                      strokeLinejoin="round"
                      onClick={() => handleZoneClick("zone3")}
                      className="transition-colors duration-300"
                    />
                    {/* Snout Patch */}
                    <motion.ellipse
                      cx="235"
                      cy="182"
                      rx="32"
                      ry="24"
                      fill={zones.zone4}
                      stroke="#17120F"
                      strokeWidth="6"
                      onClick={() => handleZoneClick("zone4")}
                      className="transition-colors duration-300"
                    />
                    {/* Cute Closed Eye & Nose */}
                    <path
                      d="M 168 175 Q 178 166 188 175 M 232 174 L 242 174 M 237 174 L 237 188"
                      stroke="#17120F"
                      strokeWidth="5.5"
                      strokeLinecap="round"
                      fill="none"
                      pointerEvents="none"
                    />
                    {/* Santa Hat Red Cone */}
                    <motion.path
                      d="M 142 142 C 155 75 235 75 268 128 L 240 142 Z"
                      fill={zones.zone5}
                      stroke="#17120F"
                      strokeWidth="6"
                      strokeLinejoin="round"
                      onClick={() => handleZoneClick("zone5")}
                      className="transition-colors duration-300"
                    />
                    {/* Santa Hat White Trim + Pompom */}
                    <motion.path
                      d="M 134 136 L 252 136 C 262 136 262 154 252 154 L 134 154 C 124 154 124 136 134 136 Z"
                      fill={zones.zone6}
                      stroke="#17120F"
                      strokeWidth="6"
                      onClick={() => handleZoneClick("zone6")}
                      className="transition-colors duration-300"
                    />
                    <motion.circle
                      cx="275"
                      cy="128"
                      r="16"
                      fill={zones.zone6}
                      stroke="#17120F"
                      strokeWidth="6"
                      onClick={() => handleZoneClick("zone6")}
                      className="transition-colors duration-300"
                    />
                    {/* Cozy Winter Scarf */}
                    <motion.path
                      d="M 135 212 L 265 212 C 272 212 272 236 262 236 L 138 236 C 128 236 128 212 135 212 Z"
                      fill={zones.zone7}
                      stroke="#17120F"
                      strokeWidth="6"
                      onClick={() => handleZoneClick("zone7")}
                      className="transition-colors duration-300"
                    />
                    {/* Christmas Gift Box */}
                    <motion.rect
                      x="255"
                      y="255"
                      width="68"
                      height="68"
                      rx="10"
                      fill={zones.zone8}
                      stroke="#17120F"
                      strokeWidth="6"
                      onClick={() => handleZoneClick("zone8")}
                      className="transition-colors duration-300"
                    />
                    {/* Gift Ribbon Heart */}
                    <motion.circle
                      cx="289"
                      cy="289"
                      r="16"
                      fill={zones.zone9}
                      stroke="#17120F"
                      strokeWidth="5.5"
                      onClick={() => handleZoneClick("zone9")}
                      className="transition-colors duration-300"
                    />
                  </>
                )}

                {templateId === "axolotl" && (
                  <>
                    {/* Left Gill Fronds */}
                    <motion.path
                      d="M 118 165 C 72 140 68 175 112 182 C 66 185 72 215 118 202 Z"
                      fill={zones.zone1}
                      stroke="#17120F"
                      strokeWidth="6"
                      strokeLinejoin="round"
                      onClick={() => handleZoneClick("zone1")}
                      className="transition-colors duration-300"
                    />
                    {/* Right Gill Fronds */}
                    <motion.path
                      d="M 282 165 C 328 140 332 175 288 182 C 334 185 328 215 282 202 Z"
                      fill={zones.zone2}
                      stroke="#17120F"
                      strokeWidth="6"
                      strokeLinejoin="round"
                      onClick={() => handleZoneClick("zone2")}
                      className="transition-colors duration-300"
                    />
                    {/* Axolotl Tail */}
                    <motion.path
                      d="M 250 285 C 325 275 342 315 268 322 Z"
                      fill={zones.zone5}
                      stroke="#17120F"
                      strokeWidth="6"
                      strokeLinejoin="round"
                      onClick={() => handleZoneClick("zone5")}
                      className="transition-colors duration-300"
                    />
                    {/* Axolotl Body */}
                    <motion.path
                      d="M 142 222 C 132 295 148 332 200 332 C 252 332 268 295 258 222 Z"
                      fill={zones.zone3}
                      stroke="#17120F"
                      strokeWidth="6.5"
                      strokeLinejoin="round"
                      onClick={() => handleZoneClick("zone3")}
                      className="transition-colors duration-300"
                    />
                    {/* Axolotl Round Head */}
                    <motion.ellipse
                      cx="200"
                      cy="182"
                      rx="82"
                      ry="62"
                      fill={zones.zone4}
                      stroke="#17120F"
                      strokeWidth="6.5"
                      onClick={() => handleZoneClick("zone4")}
                      className="transition-colors duration-300"
                    />
                    {/* Cute Eyes & Kawaii Smile */}
                    <circle
                      cx="166"
                      cy="176"
                      r="7"
                      fill="#17120F"
                      pointerEvents="none"
                    />
                    <circle
                      cx="234"
                      cy="176"
                      r="7"
                      fill="#17120F"
                      pointerEvents="none"
                    />
                    <path
                      d="M 186 192 Q 200 205 214 192"
                      stroke="#17120F"
                      strokeWidth="5.5"
                      strokeLinecap="round"
                      fill="none"
                      pointerEvents="none"
                    />
                    {/* Belly Patch */}
                    <motion.ellipse
                      cx="200"
                      cy="282"
                      rx="36"
                      ry="32"
                      fill={zones.zone8}
                      stroke="#17120F"
                      strokeWidth="5.5"
                      onClick={() => handleZoneClick("zone8")}
                      className="transition-colors duration-300"
                    />
                    {/* Floating Star */}
                    <motion.circle
                      cx="198"
                      cy="95"
                      r="22"
                      fill={zones.zone6}
                      stroke="#17120F"
                      strokeWidth="6"
                      onClick={() => handleZoneClick("zone6")}
                      className="transition-colors duration-300"
                    />
                    {/* Left & Right Ocean Bubbles / Shells */}
                    <motion.circle
                      cx="95"
                      cy="275"
                      r="20"
                      fill={zones.zone7}
                      stroke="#17120F"
                      strokeWidth="6"
                      onClick={() => handleZoneClick("zone7")}
                      className="transition-colors duration-300"
                    />
                    <motion.circle
                      cx="312"
                      cy="118"
                      r="18"
                      fill={zones.zone9}
                      stroke="#17120F"
                      strokeWidth="6"
                      onClick={() => handleZoneClick("zone9")}
                      className="transition-colors duration-300"
                    />
                  </>
                )}

                {/* Golden Glitter Overlay when Sparkle Mode is active */}
                {sparkleMode && (
                  <g pointerEvents="none">
                    {[
                      { x: 110, y: 95 },
                      { x: 295, y: 88 },
                      { x: 85, y: 245 },
                      { x: 315, y: 245 },
                      { x: 200, y: 155 },
                      { x: 155, y: 295 },
                      { x: 255, y: 295 },
                    ].map((pt, i) => (
                      <path
                        key={i}
                        d={`M ${pt.x} ${pt.y - 9} L ${pt.x + 3} ${pt.y - 3} L ${
                          pt.x + 9
                        } ${pt.y} L ${pt.x + 3} ${pt.y + 3} L ${pt.x} ${
                          pt.y + 9
                        } L ${pt.x - 3} ${pt.y + 3} L ${pt.x - 9} ${pt.y} L ${
                          pt.x - 3
                        } ${pt.y - 3} Z`}
                        fill="#FFD166"
                        stroke="#B85923"
                        strokeWidth="1.2"
                      />
                    ))}
                  </g>
                )}
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

            {/* Crayons & Feutres Color Picker Bar + Souvenir Download */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-espresso-800/75 mb-2.5">
                <span>
                  Choisissez votre crayon ou feutre (
                  <strong className="text-espresso-900">
                    {
                      MARKER_PALETTE.find((m) => m.hex === selectedColor)?.name
                    }
                  </strong>
                  ) :
                </span>
                <button
                  type="button"
                  onClick={handleExportPostcard}
                  className="inline-flex items-center gap-1.5 text-autumn-saffron hover:text-espresso-900 font-bold underline"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Garder mon coloriage en souvenir</span>
                </button>
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
                {studioBooks.map((b) => {
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
                  Disponible en Prime
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
