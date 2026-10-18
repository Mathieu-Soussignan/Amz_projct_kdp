"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { Sparkles, BookOpen, ArrowRight, Heart } from "lucide-react";
import { BOOKS, BLUR_PLACEHOLDER, type Book } from "@/data/books";

interface CocoonPortalProps {
  isOpen: boolean;
  onEnter: (selectedBook?: Book) => void;
}

const FAN_LAYOUT = [
  { offset: -3, x: -240, y: 38, rotate: -21, scale: 0.82, z: 10 },
  { offset: -2, x: -165, y: 18, rotate: -14, scale: 0.88, z: 20 },
  { offset: -1, x: -85, y: 5, rotate: -7, scale: 0.94, z: 30 },
  { offset: 0, x: 0, y: -8, rotate: 0, scale: 1.04, z: 40 },
  { offset: 1, x: 85, y: 5, rotate: 7, scale: 0.94, z: 30 },
  { offset: 2, x: 165, y: 18, rotate: 14, scale: 0.88, z: 20 },
  { offset: 3, x: 240, y: 38, rotate: 21, scale: 0.82, z: 10 },
];

const BOKEH_EMBERS = [
  { left: "10%", top: "16%", size: 90, delay: 0 },
  { left: "85%", top: "14%", size: 110, delay: 0.5 },
  { left: "18%", top: "75%", size: 95, delay: 1.1 },
  { left: "80%", top: "72%", size: 105, delay: 0.8 },
  { left: "50%", top: "10%", size: 130, delay: 0.3 },
];

export default function CocoonPortal({ isOpen, onEnter }: CocoonPortalProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number>(3); // Center book by default
  const touchStartY = useRef<number | null>(null);

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

  useEffect(() => {
    if (isOpen) {
      setIsOpening(false);
    }
  }, [isOpen]);

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
        onEnter(selectedBook);
      }, 950);
    },
    [isOpening, onEnter, playOpeningSound]
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

  const activeBook = BOOKS[hoveredIdx] ?? BOOKS[0];

  return (
    <div
      data-lenis-prevent
      onPointerMove={(e) => {
        const w = window.innerWidth || 1;
        const h = window.innerHeight || 1;
        mouseX.set(e.clientX / w - 0.5);
        mouseY.set(e.clientY / h - 0.5);
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
          isOpening
            ? { x: "-104%", rotateY: -14 }
            : { x: "0%", rotateY: 0 }
        }
        transition={{
          duration: 0.92,
          delay: 0.14,
          ease: [0.76, 0, 0.24, 1],
        }}
        style={{ transformOrigin: "left center" }}
        className="pointer-events-none absolute inset-y-0 left-0 w-1/2 z-10 bg-gradient-to-br from-[#1E110B] via-[#2C1910] to-[#3B2215] border-r border-amber-300/25 shadow-2xl"
      >
        <div className="absolute inset-0 bg-film-grain opacity-40" />
        <div className="absolute inset-y-6 right-3 w-[1px] bg-gradient-to-b from-transparent via-amber-300/35 to-transparent" />
      </motion.div>

      {/* RIGHT VELVET ATELIER CURTAIN / BOOK DOOR */}
      <motion.div
        initial={{ x: "0%" }}
        animate={
          isOpening
            ? { x: "104%", rotateY: 14 }
            : { x: "0%", rotateY: 0 }
        }
        transition={{
          duration: 0.92,
          delay: 0.14,
          ease: [0.76, 0, 0.24, 1],
        }}
        style={{ transformOrigin: "right center" }}
        className="pointer-events-none absolute inset-y-0 right-0 w-1/2 z-10 bg-gradient-to-bl from-[#1E110B] via-[#2C1910] to-[#3B2215] border-l border-amber-300/25 shadow-2xl"
      >
        <div className="absolute inset-0 bg-film-grain opacity-40" />
        <div className="absolute inset-y-6 left-3 w-[1px] bg-gradient-to-b from-transparent via-amber-300/35 to-transparent" />
      </motion.div>

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

      {/* AMBIENT BOKEH FAIRY LIGHTS IN PORTAL */}
      <motion.div
        animate={isOpening ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
      >
        {/* Warm Central Fireplace Spotlight */}
        <div
          style={{
            background:
              "radial-gradient(circle at 50% 52%, rgba(217, 119, 54, 0.34) 0%, rgba(192, 57, 43, 0.16) 42%, transparent 72%)",
          }}
          className="absolute inset-0"
        />

        {BOKEH_EMBERS.map((orb, i) => (
          <motion.div
            key={i}
            animate={{
              y: [-12, 12, -12],
              opacity: [0.3, 0.65, 0.3],
              scale: [0.95, 1.1, 0.95],
            }}
            transition={{
              duration: 4.2,
              delay: orb.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              left: orb.left,
              top: orb.top,
              width: orb.size,
              height: orb.size,
              background:
                "radial-gradient(circle, rgba(255, 218, 140, 0.45) 0%, rgba(217, 119, 54, 0.12) 55%, transparent 75%)",
            }}
            className="absolute rounded-full blur-xl"
          />
        ))}
      </motion.div>

      {/* MAIN PORTAL CONTENT STAGE */}
      <motion.div
        animate={
          isOpening
            ? { scale: 1.16, opacity: 0, y: -18, filter: "blur(6px)" }
            : { scale: 1, opacity: 1, y: 0, filter: "blur(0px)" }
        }
        transition={{ duration: 0.55, ease: [0.33, 1, 0.68, 1] }}
        className="relative z-30 w-full max-w-5xl mx-auto px-4 py-6 flex flex-col items-center text-center"
      >
        {/* Top Cocooning Community Pill */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-amber-200/25 text-amber-200 text-[11px] sm:text-xs font-bold tracking-[0.18em] uppercase shadow-lg"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>L&apos;Univers Officiel • +530 000 Abonnés TikTok</span>
        </motion.div>

        {/* Signature CaroTine Display Title with Heart Accent */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.18 }}
          className="mt-4 sm:mt-5"
        >
          <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl font-bold text-[#FBF3E8] tracking-tight leading-none inline-flex items-center justify-center">
            <span>CaroT</span>
            <span className="relative inline-flex flex-col items-center">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-[#E06D8C] fill-[#E06D8C] -mb-2 sm:-mb-2.5 animate-pulse" />
              <span>ı</span>
            </span>
            <span>ne</span>
          </h1>
          <p className="mt-3 sm:mt-4 font-serif italic text-lg sm:text-2xl text-amber-100/90 max-w-xl mx-auto">
            Bienvenue dans votre bulle de coloriage cocooning.
          </p>
        </motion.div>

        {/* 3D INTERACTIVE FANNING CONSTELLATION OF THE 7 REAL BOOKS */}
        <motion.div
          style={{ rotateX: tiltX, rotateY: tiltY }}
          className="relative w-full h-[250px] sm:h-[310px] mt-4 sm:mt-6 flex items-center justify-center"
        >
          {BOOKS.map((book, idx) => {
            const fan = FAN_LAYOUT[idx] ?? FAN_LAYOUT[3];
            const isHovered = hoveredIdx === idx;
            return (
              <motion.div
                key={book.id}
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
                  delay: isOpening ? 0 : idx * 0.045,
                }}
                style={{ zIndex: isHovered ? 50 : fan.z }}
                onMouseEnter={() => setHoveredIdx(idx)}
                onClick={() => triggerPortalEnter(book)}
                className="
                  absolute w-[135px] sm:w-[175px] md:w-[195px] aspect-square
                  rounded-2xl overflow-hidden cursor-pointer
                  shadow-[0_25px_50px_-12px_rgba(0,0,0,0.65)]
                  border-2 border-amber-100/30 hover:border-amber-300
                  transition-colors
                  max-sm:[&:nth-child(1)]:hidden max-sm:[&:nth-child(7)]:hidden
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
          className="mt-2 inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/35 border border-white/10 text-amber-200/90 text-xs font-medium"
        >
          <span
            style={{ backgroundColor: activeBook.accentColor }}
            className="w-2 h-2 rounded-full"
          />
          <span>{activeBook.title}</span>
        </motion.div>

        {/* Irresistible Grand Opening CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-6 sm:mt-7 flex flex-col items-center gap-3"
        >
          <motion.button
            type="button"
            onClick={() => triggerPortalEnter()}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="group relative inline-flex items-center gap-3 px-8 py-4 sm:px-10 sm:py-5 rounded-full bg-gradient-to-r from-[#D97736] via-[#E38B47] to-[#C86D3B] text-white font-bold text-base sm:text-lg shadow-[0_0_45px_rgba(217,119,54,0.55)] border border-amber-200/40"
          >
            <BookOpen className="w-5 h-5 text-amber-100" />
            <span>Entrer dans l&apos;univers CaroTine</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>

          <span className="text-[11px] text-amber-100/60 tracking-wide">
            Touchez un livre ou cliquez pour ouvrir la collection
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}
