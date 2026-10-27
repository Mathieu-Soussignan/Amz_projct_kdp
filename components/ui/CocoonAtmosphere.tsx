"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
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

const NOEL_GARLAND_BULBS = [
  { left: "4%", color: "#FFD166", delay: 0 },
  { left: "11%", color: "#FF4D4D", delay: 0.3 },
  { left: "18%", color: "#FFF3B0", delay: 0.6 },
  { left: "25%", color: "#2EC4B6", delay: 0.15 },
  { left: "32%", color: "#FFD166", delay: 0.45 },
  { left: "39%", color: "#FF4D4D", delay: 0.75 },
  { left: "46%", color: "#FFF3B0", delay: 0.2 },
  { left: "54%", color: "#FFD166", delay: 0.5 },
  { left: "61%", color: "#FF4D4D", delay: 0.8 },
  { left: "68%", color: "#2EC4B6", delay: 0.1 },
  { left: "75%", color: "#FFF3B0", delay: 0.4 },
  { left: "82%", color: "#FF4D4D", delay: 0.7 },
  { left: "89%", color: "#FFD166", delay: 0.25 },
  { left: "96%", color: "#FFF3B0", delay: 0.55 },
];

interface SnowParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  rot: number;
  vRot: number;
  kind: "crystal" | "orb" | "gold";
}

export default function CocoonAtmosphere({
  activeSeason,
}: CocoonAtmosphereProps) {
  const isNoel = activeSeason === "noel";
  const snowCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const prevNoelRef = useRef<boolean>(false);

  // Play a magical Christmas music-box / sleigh-bell chime when switching to Noël!
  useEffect(() => {
    if (isNoel && !prevNoelRef.current && typeof window !== "undefined") {
      try {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        if (AudioContextClass) {
          const ctx = new AudioContextClass();
          // Magical Christmas chord arpeggio (G5, B5, D6, G6)
          const notes = [783.99, 987.77, 1174.66, 1567.98];
          notes.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const overtone = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = "sine";
            overtone.type = "triangle";
            osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.09);
            overtone.frequency.setValueAtTime(
              freq * 2,
              ctx.currentTime + idx * 0.09
            );

            gain.gain.setValueAtTime(0.0001, ctx.currentTime + idx * 0.09);
            gain.gain.linearRampToValueAtTime(
              0.045,
              ctx.currentTime + idx * 0.09 + 0.02
            );
            gain.gain.exponentialRampToValueAtTime(
              0.0001,
              ctx.currentTime + idx * 0.09 + 1.1
            );

            osc.connect(gain);
            overtone.connect(gain);
            gain.connect(ctx.destination);

            osc.start(ctx.currentTime + idx * 0.09);
            overtone.start(ctx.currentTime + idx * 0.09);
            osc.stop(ctx.currentTime + idx * 0.09 + 1.15);
            overtone.stop(ctx.currentTime + idx * 0.09 + 1.15);
          });
        }
      } catch {
        // Ignore audio autoplay blocks
      }
    }
    prevNoelRef.current = isNoel;
  }, [isNoel]);

  // 60fps Cinematic Christmas Movie Snowfall + Golden Stardust Canvas when isNoel === true
  useEffect(() => {
    if (!isNoel) return;
    const canvas = snowCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    const count = width < 640 ? 45 : 80;
    const particles: SnowParticle[] = Array.from({ length: count }, (_, i) => {
      const kind: SnowParticle["kind"] =
        i % 5 === 0 ? "crystal" : i % 4 === 0 ? "gold" : "orb";
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.7,
        vy:
          kind === "gold"
            ? -(0.25 + Math.random() * 0.45) // Golden magic dust floats gently upward
            : 0.55 + Math.random() * 1.25, // Snowflakes drift down
        size:
          kind === "crystal"
            ? 6 + Math.random() * 7
            : kind === "gold"
            ? 2.5 + Math.random() * 3.5
            : 3 + Math.random() * 6,
        alpha: 0.45 + Math.random() * 0.5,
        rot: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.02,
        kind,
      };
    });

    let t = 0;
    const render = () => {
      t += 0.016;
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.x += p.vx + Math.sin(t * 1.1 + p.y * 0.01) * 0.4;
        p.y += p.vy;
        p.rot += p.vRot;

        if (p.kind === "gold") {
          if (p.y < -20) {
            p.y = height + 15;
            p.x = Math.random() * width;
          }
        } else {
          if (p.y > height + 20) {
            p.y = -15;
            p.x = Math.random() * width;
          }
        }
        if (p.x > width + 20) p.x = -15;
        if (p.x < -20) p.x = width + 15;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha =
          p.kind === "gold"
            ? p.alpha * (0.6 + 0.4 * Math.sin(t * 3 + p.x))
            : p.alpha;

        if (p.kind === "crystal") {
          ctx.strokeStyle = "#FFFFFF";
          ctx.lineWidth = 1.5;
          ctx.lineCap = "round";
          for (let k = 0; k < 3; k++) {
            ctx.rotate(Math.PI / 3);
            ctx.beginPath();
            ctx.moveTo(0, -p.size);
            ctx.lineTo(0, p.size);
            ctx.moveTo(0, -p.size * 0.55);
            ctx.lineTo(p.size * 0.28, -p.size * 0.8);
            ctx.moveTo(0, -p.size * 0.55);
            ctx.lineTo(-p.size * 0.28, -p.size * 0.8);
            ctx.stroke();
          }
        } else if (p.kind === "gold") {
          const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size * 2.2);
          grad.addColorStop(0, "#FFF3B0");
          grad.addColorStop(0.5, "#FFD166");
          grad.addColorStop(1, "rgba(255, 209, 102, 0)");
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 2.2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size);
          grad.addColorStop(0, "rgba(255, 255, 255, 0.95)");
          grad.addColorStop(1, "rgba(255, 255, 255, 0)");
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
    };
  }, [isNoel]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
    >
      {/* 1. Base Warm Cocooning / Santa's Workshop Gradient */}
      <div
        className={`absolute inset-0 transition-all duration-1000 ${
          isNoel
            ? "bg-[radial-gradient(ellipse_at_top,#FBF0DF_0%,#F2DAC0_42%,#E5C19C_100%)]"
            : "bg-[radial-gradient(ellipse_at_top,#F9E9D6_0%,#EED4B5_46%,#E1C09B_100%)]"
        }`}
      />

      {/* 2. Breathing Fireplace / Santa's Workshop Ambient Pools */}
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: isNoel ? [0.7, 0.9, 0.7] : [0.55, 0.72, 0.55],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background: isNoel
            ? "radial-gradient(circle at 18% 22%, rgba(198, 38, 38, 0.25) 0%, rgba(34, 81, 49, 0.20) 45%, transparent 74%)"
            : "radial-gradient(circle at 20% 25%, rgba(217, 119, 54, 0.24) 0%, rgba(200, 109, 59, 0.15) 45%, transparent 72%)",
        }}
        className="absolute -top-24 -left-24 w-[78vw] h-[78vh] blur-3xl"
      />

      <motion.div
        animate={{
          scale: [1.05, 0.96, 1.05],
          opacity: isNoel ? [0.65, 0.85, 0.65] : [0.45, 0.65, 0.45],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background: isNoel
            ? "radial-gradient(circle at 82% 72%, rgba(255, 195, 75, 0.28) 0%, rgba(198, 38, 38, 0.18) 45%, transparent 74%)"
            : "radial-gradient(circle at 80% 70%, rgba(156, 102, 68, 0.22) 0%, rgba(217, 119, 54, 0.16) 45%, transparent 72%)",
        }}
        className="absolute bottom-0 right-0 w-[78vw] h-[78vh] blur-3xl"
      />

      {/* 3. Soft Fairy String-Lights Bokeh */}
      {STRING_LIGHTS.map((orb, idx) => (
        <motion.div
          key={idx}
          animate={{
            opacity: [0.35, 0.75, 0.35],
            scale: [0.92, 1.12, 0.92],
          }}
          transition={{
            duration: 3.6,
            delay: orb.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            left: orb.left,
            top: orb.top,
            width: orb.size,
            height: orb.size,
            background: isNoel
              ? "radial-gradient(circle, rgba(255, 215, 110, 0.7) 0%, rgba(198, 38, 38, 0.25) 55%, transparent 75%)"
              : "radial-gradient(circle, rgba(255, 224, 150, 0.55) 0%, rgba(217, 119, 54, 0.18) 50%, transparent 75%)",
          }}
          className="absolute rounded-full blur-xl"
        />
      ))}

      {/* 4. CINEMATIC CHRISTMAS MOVIE OVERLAYS (When activeSeason === "noel") */}
      <AnimatePresence>
        {isNoel && (
          <motion.div
            key="noel-movie-magic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            {/* 4a. Live 60fps Snowfall & Golden Magic Dust Canvas */}
            <canvas
              ref={snowCanvasRef}
              className="absolute inset-0 w-full h-full"
            />

            {/* 4b. Top Festive Pine & Holly Garland with Twinkling Christmas Bulbs */}
            <div className="absolute top-14 sm:top-16 inset-x-0 h-16 overflow-hidden">
              {/* Pine Bough Scallop Silhouette */}
              <svg
                viewBox="0 0 1440 70"
                preserveAspectRatio="none"
                className="w-full h-11 opacity-85 drop-shadow-[0_6px_14px_rgba(30,77,59,0.28)]"
              >
                <path
                  d="M0,0 L1440,0 L1440,22 Q1320,58 1200,20 Q1080,58 960,20 Q840,58 720,24 Q600,58 480,20 Q360,58 240,20 Q120,58 0,22 Z"
                  fill="#1E4D3B"
                />
                <path
                  d="M0,0 L1440,0 L1440,14 Q1320,42 1200,12 Q1080,42 960,12 Q840,42 720,16 Q600,42 480,12 Q360,42 240,12 Q120,42 0,14 Z"
                  fill="#277455"
                />
                {/* Golden Garland Wire */}
                <path
                  d="M0,18 Q120,52 240,18 Q360,52 480,18 Q600,52 720,22 Q840,52 960,18 Q1080,52 1200,18 Q1320,52 1440,18"
                  fill="none"
                  stroke="#FFD166"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
              </svg>

              {/* Twinkling Colored Christmas Bulbs & Holly Berries */}
              {NOEL_GARLAND_BULBS.map((bulb, i) => (
                <motion.span
                  key={i}
                  animate={{
                    opacity: [0.55, 1, 0.55],
                    scale: [0.9, 1.22, 0.9],
                  }}
                  transition={{
                    duration: 1.8 + (i % 3) * 0.4,
                    delay: bulb.delay,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{
                    left: bulb.left,
                    top: i % 2 === 0 ? "18px" : "28px",
                    backgroundColor: bulb.color,
                    boxShadow: `0 0 14px 4px ${bulb.color}, 0 0 28px 8px rgba(255, 209, 102, 0.45)`,
                  }}
                  className="absolute w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full"
                />
              ))}
            </div>

            {/* 4c. Warm Santa's Workshop Corner Lantern Glows */}
            <div
              style={{
                background:
                  "radial-gradient(circle at 0% 0%, rgba(255, 190, 85, 0.34) 0%, rgba(198, 38, 38, 0.12) 38%, transparent 65%)",
              }}
              className="absolute top-0 left-0 w-96 h-96"
            />
            <div
              style={{
                background:
                  "radial-gradient(circle at 100% 0%, rgba(255, 190, 85, 0.34) 0%, rgba(198, 38, 38, 0.12) 38%, transparent 65%)",
              }}
              className="absolute top-0 right-0 w-96 h-96"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. Tactile Sketchbook Paper Grain + Warm Peripheral Room Vignette */}
      <div className="absolute inset-0 bg-film-grain" />
      <div
        className={`absolute inset-0 transition-shadow duration-1000 ${
          isNoel
            ? "shadow-[inset_0_0_150px_rgba(140,35,24,0.22)]"
            : "shadow-[inset_0_0_130px_rgba(74,38,16,0.16)]"
        }`}
      />
    </div>
  );
}
