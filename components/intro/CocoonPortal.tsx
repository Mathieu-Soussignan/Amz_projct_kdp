"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import {
  Sparkles,
  BookOpen,
  ArrowRight,
  Heart,
  Calendar,
} from "lucide-react";
import {
  BOOKS,
  BLUR_PLACEHOLDER,
  type Book,
  type BookCategory,
} from "@/data/books";

export type CalendarSeason = "automne" | "noel" | "printemps" | "ete";

interface CocoonPortalProps {
  isOpen: boolean;
  onEnter: (selectedBook?: Book, detectedSeason?: BookCategory) => void;
}

interface SeasonConfig {
  id: CalendarSeason;
  label: string;
  badgeText: string;
  emoji: string;
  subtitle: string;
  bgGradient: string;
  spotlight: string;
  buttonGradient: string;
  buttonShadow: string;
  mappedBookCategory: BookCategory;
  particleColors: string[];
}

const SEASON_CONFIGS: Record<CalendarSeason, SeasonConfig> = {
  automne: {
    id: "automne",
    label: "Automne Cozy",
    badgeText: "Saison d'Automne",
    emoji: "🍂",
    subtitle:
      "Les feuilles tombent dehors : installez-vous au chaud avec vos feutres.",
    bgGradient: "from-[#1B100A] via-[#2C180E] to-[#3B2113]",
    spotlight:
      "radial-gradient(circle at 50% 52%, rgba(217, 119, 54, 0.38) 0%, rgba(156, 102, 68, 0.18) 45%, transparent 72%)",
    buttonGradient: "from-[#D97736] via-[#E58E49] to-[#B85923]",
    buttonShadow: "0 0 48px rgba(217, 119, 54, 0.6)",
    mappedBookCategory: "automne",
    particleColors: ["#D97736", "#E89954", "#C85A32", "#E6B86A", "#9C522B"],
  },
  noel: {
    id: "noel",
    label: "Hiver & Noël",
    badgeText: "Féérie d'Hiver & Noël",
    emoji: "❄️",
    subtitle:
      "Il neige sur l'atelier : plongez dans la magie de Noël au coin du feu.",
    bgGradient: "from-[#0E1915] via-[#172822] to-[#261414]",
    spotlight:
      "radial-gradient(circle at 50% 52%, rgba(192, 57, 43, 0.32) 0%, rgba(39, 116, 85, 0.24) 45%, transparent 72%)",
    buttonGradient: "from-[#C0392B] via-[#D64B3B] to-[#277455]",
    buttonShadow: "0 0 48px rgba(192, 57, 43, 0.55)",
    mappedBookCategory: "noel",
    particleColors: ["#FFFFFF", "#FFF4D6", "#FFD166", "#E8F4F8", "#F4A261"],
  },
  printemps: {
    id: "printemps",
    label: "Printemps Fleuri",
    badgeText: "Douceur de Printemps",
    emoji: "🌸",
    subtitle:
      "Pétales en fleurs et lumière douce : votre parenthèse créative commence ici.",
    bgGradient: "from-[#1F1418] via-[#2E1D23] to-[#2B2219]",
    spotlight:
      "radial-gradient(circle at 50% 52%, rgba(224, 109, 140, 0.34) 0%, rgba(217, 155, 102, 0.18) 45%, transparent 72%)",
    buttonGradient: "from-[#E06D8C] via-[#E888A1] to-[#D97736]",
    buttonShadow: "0 0 48px rgba(224, 109, 140, 0.55)",
    mappedBookCategory: "automne",
    particleColors: ["#FFB5C2", "#FFD6E0", "#E06D8C", "#FFF0F3", "#FFE5B4"],
  },
  ete: {
    id: "ete",
    label: "Été Océan",
    badgeText: "Escapade d'Été & Océan",
    emoji: "🌊",
    subtitle:
      "Brise marine et bulles dorées : plongez dans l'univers doux de CaroTine.",
    bgGradient: "from-[#0E1B20] via-[#152B32] to-[#242016]",
    spotlight:
      "radial-gradient(circle at 50% 52%, rgba(43, 122, 120, 0.36) 0%, rgba(217, 155, 54, 0.18) 45%, transparent 72%)",
    buttonGradient: "from-[#2B7A78] via-[#3AAFA9] to-[#D97736]",
    buttonShadow: "0 0 48px rgba(58, 175, 169, 0.55)",
    mappedBookCategory: "classique",
    particleColors: ["#DEF2F1", "#70C1B3", "#FFD166", "#A8E6CF", "#FFFFFF"],
  },
};

export function detectCalendarSeason(date = new Date()): {
  season: CalendarSeason;
  formattedDate: string;
} {
  const month = date.getMonth(); // 0 = Jan .. 11 = Dec
  const day = date.getDate();

  let season: CalendarSeason = "automne";
  // Nov 20 -> Feb 28: Hiver & Noël
  if (month === 11 || month === 0 || month === 1 || (month === 10 && day >= 20)) {
    season = "noel";
  } else if (month >= 2 && month <= 4) {
    // Mars -> Mai: Printemps
    season = "printemps";
  } else if (month >= 5 && month <= 7) {
    // Juin -> Août: Été
    season = "ete";
  } else {
    // Septembre -> 19 Novembre: Automne
    season = "automne";
  }

  const formattedDate = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
  }).format(date);

  return { season, formattedDate };
}

const PORTAL_BOOKS = BOOKS.filter((b) => !b.excludeFromPortal);

const FAN_LAYOUT = [
  { offset: -3, x: -255, y: 44, rotate: -21, scale: 0.8, z: 10 },
  { offset: -2, x: -170, y: 22, rotate: -14, scale: 0.87, z: 20 },
  { offset: -1, x: -85, y: 6, rotate: -7, scale: 0.94, z: 30 },
  { offset: 0, x: 0, y: -6, rotate: 0, scale: 1, z: 40 },
  { offset: 1, x: 85, y: 6, rotate: 7, scale: 0.94, z: 30 },
  { offset: 2, x: 170, y: 22, rotate: 14, scale: 0.87, z: 20 },
  { offset: 3, x: 255, y: 44, rotate: 21, scale: 0.8, z: 10 },
];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  vRot: number;
  flip: number;
  vFlip: number;
  color: string;
  alpha: number;
  variant: number;
}

export default function CocoonPortal({ isOpen, onEnter }: CocoonPortalProps) {
  const [detectedInfo, setDetectedInfo] = useState<{
    season: CalendarSeason;
    formattedDate: string;
  }>({ season: "automne", formattedDate: "18 octobre" });

  const [portalSeason, setPortalSeason] = useState<CalendarSeason>("automne");
  const [isManualOverride, setIsManualOverride] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number>(3);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerPosRef = useRef<{ x: number; y: number }>({ x: -999, y: -999 });
  const isOpeningRef = useRef(false);
  const touchStartY = useRef<number | null>(null);

  useEffect(() => {
    const info = detectCalendarSeason(new Date());
    setDetectedInfo(info);
    setPortalSeason(info.season);
  }, []);

  useEffect(() => {
    isOpeningRef.current = isOpening;
  }, [isOpening]);

  useEffect(() => {
    if (isOpen) {
      setIsOpening(false);
    }
  }, [isOpen]);

  const seasonCfg = SEASON_CONFIGS[portalSeason];

  // Arrange the 7 portal books (excluding vacances-clem) so seasonal books sit in the center slots
  const orderedBooks = useMemo(() => {
    const targetCat = seasonCfg.mappedBookCategory;
    const priority = PORTAL_BOOKS.filter((b) => b.category === targetCat);
    const rest = PORTAL_BOOKS.filter((b) => b.category !== targetCat);

    if (priority.length === 2) {
      // Automne (2 books): center slots 2 & 3, with Maisons Enchantées discreetly on the outer wing
      return [
        rest[0]!,
        rest[1]!,
        priority[0]!,
        priority[1]!,
        rest[2]!,
        rest[3]!,
        rest[4]!,
      ].filter(Boolean);
    }
    if (priority.length >= 3) {
      // Noël (4 books): place the 4 Noël books right in the center (slots 1, 2, 3, 4) with L'Atelier du Père Noël in center slot 3
      const santa =
        priority.find((b) => b.id === "atelier-pere-noel") ?? priority[0]!;
      const otherNoel = priority.filter((b) => b.id !== santa.id);
      return [
        rest[0]!,
        otherNoel[0]!,
        otherNoel[1]!,
        santa,
        otherNoel[2]!,
        rest[1]!,
        rest[2]!,
      ].filter(Boolean);
    }
    // Classique / Océan & Évasion (2 portal books: Lolo & Lili in center slot 3, Maisons Enchantées discreetly alongside)
    const lolo = priority.find((b) => b.id === "lolo-et-lili") ?? priority[0]!;
    const maisons = priority.find((b) => b.id === "maisons-enchantees");
    return [
      rest[0]!,
      rest[1]!,
      rest[2]!,
      lolo,
      maisons ?? rest[3]!,
      rest[3]!,
      rest[4]!,
    ].filter(Boolean);
  }, [seasonCfg.mappedBookCategory]);

  // Reset hovered book to center slot (3) when switching season
  useEffect(() => {
    setHoveredIdx(3);
  }, [portalSeason]);

  // Interactive 60fps Seasonal Canvas Physics (Autumn Leaves / Winter Snowflakes / Spring Petals / Summer Bubbles)
  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const colors = SEASON_CONFIGS[portalSeason].particleColors;
    const count = width < 640 ? 32 : 52;

    const particles: Particle[] = Array.from({ length: count }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 1.1,
      vy:
        portalSeason === "ete"
          ? -(0.6 + Math.random() * 1.2) // Bubbles rise in summer
          : 0.7 + Math.random() * 1.4, // Leaves/Snow/Petals fall gently
      size:
        portalSeason === "automne"
          ? 10 + Math.random() * 12
          : portalSeason === "noel"
          ? 5 + Math.random() * 10
          : 7 + Math.random() * 10,
      rotation: Math.random() * Math.PI * 2,
      vRot: (Math.random() - 0.5) * 0.025,
      flip: Math.random() * Math.PI * 2,
      vFlip: 0.02 + Math.random() * 0.03,
      color: colors[i % colors.length] ?? "#D97736",
      alpha: 0.45 + Math.random() * 0.45,
      variant: i % 3,
    }));

    let time = 0;

    const render = () => {
      time += 0.016;
      ctx.clearRect(0, 0, width, height);

      const openingBoost = isOpeningRef.current ? 4.8 : 1;

      for (const p of particles) {
        // Gentle wind wave + mouse interaction
        const wind = Math.sin(time * 1.2 + p.y * 0.008) * 0.55;
        const dx = p.x - pointerPosRef.current.x;
        const dy = p.y - pointerPosRef.current.y;
        const distSq = dx * dx + dy * dy;
        let repulseX = 0;
        let repulseY = 0;
        if (distSq < 18000 && distSq > 1) {
          const dist = Math.sqrt(distSq);
          const force = (134 - dist) / 134;
          repulseX = (dx / dist) * force * 2.2;
          repulseY = (dy / dist) * force * 1.6;
        }

        if (isOpeningRef.current) {
          // Swirl outward from center during the grand opening transition
          const cx = width / 2;
          const cy = height / 2;
          const ox = p.x - cx;
          const oy = p.y - cy;
          const od = Math.sqrt(ox * ox + oy * oy) || 1;
          p.x += (ox / od) * 9 + p.vx * openingBoost;
          p.y += (oy / od) * 9 + p.vy * openingBoost;
        } else {
          p.x += p.vx + wind + repulseX;
          p.y += p.vy + repulseY;
        }

        p.rotation += p.vRot * openingBoost;
        p.flip += p.vFlip * openingBoost;

        // Wrap around screen edges
        if (!isOpeningRef.current) {
          if (portalSeason === "ete") {
            if (p.y < -30) {
              p.y = height + 25;
              p.x = Math.random() * width;
            }
          } else {
            if (p.y > height + 30) {
              p.y = -25;
              p.x = Math.random() * width;
            }
          }
          if (p.x > width + 30) p.x = -25;
          if (p.x < -30) p.x = width + 25;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.alpha;

        if (portalSeason === "automne") {
          // 3D tumbling Autumn Leaf with central vein
          const scaleY = Math.cos(p.flip) * 0.75 + 0.25;
          ctx.scale(1, scaleY);
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.bezierCurveTo(
            p.size * 0.9,
            -p.size * 0.5,
            p.size * 0.85,
            p.size * 0.6,
            0,
            p.size
          );
          ctx.bezierCurveTo(
            -p.size * 0.85,
            p.size * 0.6,
            -p.size * 0.9,
            -p.size * 0.5,
            0,
            -p.size
          );
          ctx.fill();

          // Warm golden leaf vein
          ctx.strokeStyle = "rgba(255, 240, 200, 0.45)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(0, -p.size * 0.8);
          ctx.lineTo(0, p.size * 1.15);
          ctx.stroke();
        } else if (portalSeason === "noel") {
          // 6-pointed Crystalline Snowflake or Golden Star
          if (p.variant === 0) {
            ctx.strokeStyle = p.color;
            ctx.lineWidth = 1.6;
            ctx.lineCap = "round";
            for (let k = 0; k < 3; k++) {
              ctx.rotate(Math.PI / 3);
              ctx.beginPath();
              ctx.moveTo(0, -p.size);
              ctx.lineTo(0, p.size);
              // Little crystal branches
              ctx.moveTo(0, -p.size * 0.55);
              ctx.lineTo(p.size * 0.28, -p.size * 0.8);
              ctx.moveTo(0, -p.size * 0.55);
              ctx.lineTo(-p.size * 0.28, -p.size * 0.8);
              ctx.stroke();
            }
          } else {
            // Soft glowing snow orb
            const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size);
            grad.addColorStop(0, p.color);
            grad.addColorStop(1, "rgba(255,255,255,0)");
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(0, 0, p.size, 0, Math.PI * 2);
            ctx.fill();
          }
        } else if (portalSeason === "printemps") {
          // Tumbling Sakura Flower Petal
          const scaleY = Math.cos(p.flip) * 0.7 + 0.3;
          ctx.scale(1, scaleY);
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.moveTo(0, p.size * 0.8);
          ctx.bezierCurveTo(
            p.size * 0.9,
            p.size * 0.2,
            p.size * 0.7,
            -p.size * 0.9,
            0,
            -p.size * 0.4
          );
          ctx.bezierCurveTo(
            -p.size * 0.7,
            -p.size * 0.9,
            -p.size * 0.9,
            p.size * 0.2,
            0,
            p.size * 0.8
          );
          ctx.fill();
        } else {
          // Summer Iridescent Ocean Bubble
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.75, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fillStyle = "rgba(255,255,255,0.45)";
          ctx.beginPath();
          ctx.arc(-p.size * 0.25, -p.size * 0.25, p.size * 0.18, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, [isOpen, portalSeason]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const tiltY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), {
    stiffness: 150,
    damping: 22,
  });
  const tiltX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), {
    stiffness: 150,
    damping: 22,
  });

  // Subtle ASMR paper & chime whisper when opening the atelier doors
  const playOpeningSound = useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const duration = 0.38;
      const bufferSize = ctx.sampleRate * duration;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        const env = Math.sin((i / bufferSize) * Math.PI);
        data[i] = (Math.random() * 2 - 1) * env * 0.06;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(920, ctx.currentTime);
      filter.Q.setValueAtTime(1.6, ctx.currentTime);
      noise.connect(filter);
      filter.connect(ctx.destination);
      noise.start();
    } catch {
      // Ignore autoplay restrictions
    }
  }, []);

  const triggerPortalEnter = useCallback(
    (selectedBook?: Book) => {
      if (isOpening) return;
      setIsOpening(true);
      playOpeningSound();
      setTimeout(() => {
        onEnter(selectedBook, seasonCfg.mappedBookCategory);
      }, 950);
    },
    [isOpening, onEnter, playOpeningSound, seasonCfg.mappedBookCategory]
  );

  // Allow wheel scroll or swipe-up to trigger the grand opening transition
  useEffect(() => {
    if (!isOpen || isOpening) return;
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 25) {
        triggerPortalEnter();
      }
    };
    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [isOpen, isOpening, triggerPortalEnter]);

  if (!isOpen) return null;

  const activeBook = orderedBooks[hoveredIdx] ?? orderedBooks[2] ?? BOOKS[0];

  return (
    <div
      data-lenis-prevent
      onPointerMove={(e) => {
        const w = window.innerWidth || 1;
        const h = window.innerHeight || 1;
        mouseX.set(e.clientX / w - 0.5);
        mouseY.set(e.clientY / h - 0.5);
        pointerPosRef.current = { x: e.clientX, y: e.clientY };
      }}
      onTouchStart={(e) => {
        touchStartY.current = e.touches[0]?.clientY ?? null;
      }}
      onTouchMove={(e) => {
        if (touchStartY.current === null) return;
        const deltaY = touchStartY.current - (e.touches[0]?.clientY ?? 0);
        if (deltaY > 45) {
          triggerPortalEnter();
        }
      }}
      style={{ perspective: "1600px" }}
      className="fixed inset-0 z-50 overflow-hidden select-none flex items-center justify-center"
    >
      {/* LEFT VELVET ATELIER CURTAIN / BOOK DOOR */}
      <motion.div
        initial={{ x: "0%" }}
        animate={
          isOpening ? { x: "-104%", rotateY: -14 } : { x: "0%", rotateY: 0 }
        }
        transition={{
          duration: 0.92,
          delay: 0.14,
          ease: [0.76, 0, 0.24, 1],
        }}
        style={{ transformOrigin: "left center" }}
        className={`pointer-events-none absolute inset-y-0 left-0 w-1/2 z-10 bg-gradient-to-br ${seasonCfg.bgGradient} border-r border-amber-300/25 shadow-2xl transition-colors duration-700`}
      >
        <div className="absolute inset-0 bg-film-grain opacity-40" />
        <div className="absolute inset-y-6 right-3 w-[1px] bg-gradient-to-b from-transparent via-amber-300/35 to-transparent" />
      </motion.div>

      {/* RIGHT VELVET ATELIER CURTAIN / BOOK DOOR */}
      <motion.div
        initial={{ x: "0%" }}
        animate={
          isOpening ? { x: "104%", rotateY: 14 } : { x: "0%", rotateY: 0 }
        }
        transition={{
          duration: 0.92,
          delay: 0.14,
          ease: [0.76, 0, 0.24, 1],
        }}
        style={{ transformOrigin: "right center" }}
        className={`pointer-events-none absolute inset-y-0 right-0 w-1/2 z-10 bg-gradient-to-bl ${seasonCfg.bgGradient} border-l border-amber-300/25 shadow-2xl transition-colors duration-700`}
      >
        <div className="absolute inset-0 bg-film-grain opacity-40" />
        <div className="absolute inset-y-6 left-3 w-[1px] bg-gradient-to-b from-transparent via-amber-300/35 to-transparent" />
      </motion.div>

      {/* LIVE 60FPS SEASONAL PARTICLE CANVAS (Leaves / Snowflakes / Petals / Bubbles) */}
      <motion.canvas
        ref={canvasRef}
        animate={isOpening ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.75 }}
        className="pointer-events-none absolute inset-0 z-20"
      />

      {/* WARM GOLDEN CANDLELIGHT IRIS BURST ON TRANSITION */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={
          isOpening
            ? { scale: [0.8, 2.4, 3.2], opacity: [0.4, 0.9, 0] }
            : { scale: 0.8, opacity: 0 }
        }
        transition={{ duration: 0.9, ease: "easeOut" }}
        style={{
          background:
            "radial-gradient(circle, rgba(255,222,158,0.85) 0%, rgba(217,119,54,0.45) 45%, transparent 70%)",
        }}
        className="pointer-events-none absolute w-[540px] h-[540px] rounded-full z-20 blur-2xl"
      />

      {/* AMBIENT SEASONAL SPOTLIGHT */}
      <motion.div
        animate={isOpening ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
      >
        <div
          style={{ background: seasonCfg.spotlight }}
          className="absolute inset-0 transition-all duration-700"
        />
      </motion.div>

      {/* MAIN PORTAL CONTENT STAGE */}
      <motion.div
        animate={
          isOpening
            ? { scale: 1.16, opacity: 0, y: -18, filter: "blur(6px)" }
            : { scale: 1, opacity: 1, y: 0, filter: "blur(0px)" }
        }
        transition={{ duration: 0.55, ease: [0.33, 1, 0.68, 1] }}
        className="relative z-30 w-full max-w-5xl mx-auto px-4 py-4 sm:py-6 flex flex-col items-center text-center"
      >
        {/* Top Live Date-Detected Season Pill + Interactive Season Time-Travel Bar */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="flex flex-col items-center gap-2.5"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-amber-200/25 text-amber-200 text-[11px] sm:text-xs font-bold tracking-[0.14em] uppercase shadow-lg">
            <Calendar className="w-3.5 h-3.5 text-amber-300" />
            <span>
              {isManualOverride
                ? `Aperçu ambiance : ${seasonCfg.badgeText}`
                : `${detectedInfo.formattedDate} • ${seasonCfg.badgeText}`}
            </span>
            <span className="opacity-40">•</span>
            <span className="hidden sm:inline text-amber-100">
              +530K TikTok
            </span>
          </div>

          {/* Interactive Seasonal Preview Switcher (Allows testing all 4 date-seasons live!) */}
          <div className="inline-flex items-center gap-1 p-1 rounded-full bg-black/35 backdrop-blur-md border border-white/10">
            {(Object.values(SEASON_CONFIGS) as SeasonConfig[]).map((sc) => {
              const isSelected = sc.id === portalSeason;
              const isTodaySeason = sc.id === detectedInfo.season;
              return (
                <button
                  key={sc.id}
                  type="button"
                  onClick={() => {
                    setPortalSeason(sc.id);
                    setIsManualOverride(sc.id !== detectedInfo.season);
                  }}
                  className={`px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-semibold transition-all flex items-center gap-1 ${
                    isSelected
                      ? "bg-amber-200 text-espresso-900 shadow-sm font-bold"
                      : "text-amber-100/70 hover:text-white"
                  }`}
                >
                  <span>{sc.emoji}</span>
                  <span>{sc.label}</span>
                  {isTodaySeason && (
                    <span className="hidden md:inline text-[9px] opacity-75">
                      (Aujourd&apos;hui)
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Signature CaroTine Display Title with Heart Accent */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.16 }}
          className="mt-3 sm:mt-4"
        >
          <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl font-bold text-[#FBF3E8] tracking-tight leading-none inline-flex items-center justify-center drop-shadow-md">
            <span>CaroT</span>
            <span className="relative inline-flex flex-col items-center">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-[#E06D8C] fill-[#E06D8C] -mb-2 sm:-mb-2.5 animate-pulse" />
              <span>ı</span>
            </span>
            <span>ne</span>
          </h1>
          <p className="mt-2.5 sm:mt-3 font-serif italic text-base sm:text-2xl text-amber-100/90 max-w-xl mx-auto">
            {seasonCfg.subtitle}
          </p>
        </motion.div>

        {/* 3D INTERACTIVE FANNING CONSTELLATION OF THE 7 REAL BOOKS */}
        <motion.div
          style={{ rotateX: tiltX, rotateY: tiltY }}
          className="relative w-full h-[230px] sm:h-[295px] mt-3 sm:mt-5 flex items-center justify-center"
        >
          {orderedBooks.map((book, idx) => {
            const fan = FAN_LAYOUT[idx] ?? FAN_LAYOUT[2]!;
            const isHovered = hoveredIdx === idx;
            return (
              <motion.div
                key={book.id}
                layout
                initial={{ opacity: 0, y: 60, scale: 0.7, rotate: 0 }}
                animate={
                  isOpening
                    ? {
                        x: 0,
                        y: 0,
                        rotate: 0,
                        scale: idx === hoveredIdx ? 1.22 : 0.85,
                        opacity: idx === hoveredIdx ? 1 : 0,
                      }
                    : {
                        opacity: 1,
                        x: fan.x,
                        y: isHovered ? fan.y - 22 : fan.y,
                        rotate: isHovered ? fan.rotate * 0.4 : fan.rotate,
                        scale: isHovered ? 1.12 : fan.scale,
                      }
                }
                transition={{
                  type: "spring",
                  stiffness: 220,
                  damping: 22,
                }}
                style={{ zIndex: isHovered ? 50 : fan.z }}
                onMouseEnter={() => setHoveredIdx(idx)}
                onClick={() => triggerPortalEnter(book)}
                className="
                  absolute w-[130px] sm:w-[170px] md:w-[190px] aspect-square
                  rounded-2xl overflow-hidden cursor-pointer
                  shadow-[0_25px_50px_-12px_rgba(0,0,0,0.68)]
                  border-2 border-amber-100/30 hover:border-amber-300
                  transition-colors
                  max-sm:[&:nth-child(1)]:hidden max-sm:[&:nth-child(6)]:hidden
                "
              >
                <Image
                  src={`${book.coverImage}?v=real`}
                  alt={book.title}
                  fill
                  priority
                  sizes="200px"
                  placeholder="blur"
                  blurDataURL={BLUR_PLACEHOLDER}
                  className="object-cover"
                />
                {/* Book Spine Highlight */}
                <div className="pointer-events-none absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-black/35 via-white/20 to-transparent" />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Active Hovered Book Title Pill */}
        <motion.div
          key={activeBook.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1.5 inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/40 border border-white/15 text-amber-200 text-xs font-medium shadow-md"
        >
          <span
            style={{ backgroundColor: activeBook.accentColor }}
            className="w-2 h-2 rounded-full"
          />
          <span>{activeBook.title}</span>
          <span className="opacity-50">•</span>
          <span className="text-amber-100/75 text-[11px]">
            Cliquer pour découvrir
          </span>
        </motion.div>

        {/* Irresistible Grand Opening CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-5 sm:mt-6 flex flex-col items-center gap-2.5"
        >
          <motion.button
            type="button"
            onClick={() => triggerPortalEnter()}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            style={{ boxShadow: seasonCfg.buttonShadow }}
            className={`group relative inline-flex items-center gap-3 px-8 py-4 sm:px-10 sm:py-4.5 rounded-full bg-gradient-to-r ${seasonCfg.buttonGradient} text-white font-bold text-base sm:text-lg border border-amber-200/40 transition-all duration-500`}
          >
            <BookOpen className="w-5 h-5 text-amber-100" />
            <span>Entrer dans l&apos;univers CaroTine</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>

          <span className="text-[11px] text-amber-100/65 tracking-wide flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>
              Animation saisonnière synchronisée sur la date du jour
            </span>
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}
