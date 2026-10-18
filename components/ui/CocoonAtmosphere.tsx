"use client";

import { motion } from "motion/react";
import type { BookCategory } from "@/data/books";

interface CocoonAtmosphereProps {
  activeSeason: BookCategory;
}

const STRING_LIGHTS = [
  { left: "6%", top: "4%", size: 80, delay: 0 },
  { left: "18%", top: "9%", size: 64, delay: 0.6 },
  { left: "32%", top: "5%", size: 92, delay: 1.2 },
  { left: "48%", top: "8%", size: 70, delay: 0.3 },
  { left: "64%", top: "4%", size: 86, delay: 0.9 },
  { left: "79%", top: "9%", size: 68, delay: 1.5 },
  { left: "92%", top: "5%", size: 84, delay: 0.4 },
];

const FLOATING_PARTICLES = [
  { id: 1, left: "8%", top: "22%", duration: 14, delay: 0 },
  { id: 2, left: "88%", top: "18%", duration: 17, delay: 1.5 },
  { id: 3, left: "15%", top: "58%", duration: 16, delay: 0.8 },
  { id: 4, left: "82%", top: "52%", duration: 15, delay: 2.2 },
  { id: 5, left: "26%", top: "82%", duration: 18, delay: 1.1 },
  { id: 6, left: "74%", top: "78%", duration: 16, delay: 0.4 },
];

export default function CocoonAtmosphere({
  activeSeason,
}: CocoonAtmosphereProps) {
  const isNoel = activeSeason === "noel";

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
    >
      {/* 1. Base Warm Cocooning Gradient (Chai Latte, Biscuit Doré & Lueur de Bougie) */}
      <div
        className={`absolute inset-0 transition-colors duration-1000 ${
          isNoel
            ? "bg-[radial-gradient(ellipse_at_top,#F7E8D4_0%,#EDD5B8_48%,#E2C3A0_100%)]"
            : "bg-[radial-gradient(ellipse_at_top,#F9E9D6_0%,#EED4B5_46%,#E1C09B_100%)]"
        }`}
      />

      {/* 2. Breathing Fireplace / Candlelight Ambient Pools */}
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.55, 0.72, 0.55],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background: isNoel
            ? "radial-gradient(circle at 20% 25%, rgba(192, 57, 43, 0.16) 0%, rgba(39, 116, 85, 0.14) 42%, transparent 72%)"
            : "radial-gradient(circle at 20% 25%, rgba(217, 119, 54, 0.24) 0%, rgba(200, 109, 59, 0.15) 45%, transparent 72%)",
        }}
        className="absolute -top-24 -left-24 w-[75vw] h-[75vh] blur-3xl"
      />

      <motion.div
        animate={{
          scale: [1.05, 0.96, 1.05],
          opacity: [0.45, 0.65, 0.45],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background: isNoel
            ? "radial-gradient(circle at 80% 70%, rgba(217, 119, 54, 0.20) 0%, rgba(30, 77, 59, 0.14) 45%, transparent 72%)"
            : "radial-gradient(circle at 80% 70%, rgba(156, 102, 68, 0.22) 0%, rgba(217, 119, 54, 0.16) 45%, transparent 72%)",
        }}
        className="absolute bottom-0 right-0 w-[75vw] h-[75vh] blur-3xl"
      />

      {/* 3. Soft Fairy String-Lights Bokeh ("Guirlande Lumineuse Cocooning" at Top) */}
      {STRING_LIGHTS.map((orb, idx) => (
        <motion.div
          key={idx}
          animate={{
            opacity: [0.35, 0.7, 0.35],
            scale: [0.92, 1.1, 0.92],
          }}
          transition={{
            duration: 3.8,
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
              "radial-gradient(circle, rgba(255, 224, 150, 0.55) 0%, rgba(217, 119, 54, 0.18) 50%, transparent 75%)",
          }}
          className="absolute rounded-full blur-xl"
        />
      ))}

      {/* 4. Delicate Floating Seasonal Motifs (Autumn Leaves / Winter Sparkles) */}
      {FLOATING_PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          style={{ left: p.left, top: p.top }}
          animate={{
            y: [-14, 14, -14],
            x: [-8, 8, -8],
            rotate: [-8, 8, -8],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute opacity-20"
        >
          {isNoel ? (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#8C4A27"
              strokeWidth="1.6"
              strokeLinecap="round"
            >
              <path d="M12 2v20M2 12h20M4.9 4.9l14.2 14.2M19.1 4.9L4.9 19.1" />
            </svg>
          ) : (
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9C4E22"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
            </svg>
          )}
        </motion.div>
      ))}

      {/* 5. Tactile Sketchbook Paper Grain + Warm Peripheral Room Vignette */}
      <div className="absolute inset-0 bg-film-grain" />
      <div className="absolute inset-0 shadow-[inset_0_0_130px_rgba(74,38,16,0.16)]" />
    </div>
  );
}
