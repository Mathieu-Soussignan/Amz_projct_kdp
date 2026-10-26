"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Flame,
  CloudRain,
  Music,
  VolumeX,
  Moon,
  Sun,
  Sparkles,
  Disc3,
} from "lucide-react";

export type SoundTrackId = "off" | "fireplace" | "rain" | "musicbox";

interface CocoonAmbienceBarProps {
  candlelightMode: boolean;
  onToggleCandlelight: () => void;
}

const SOUND_TRACKS: {
  id: SoundTrackId;
  label: string;
  shortLabel: string;
  icon: typeof Flame;
  color: string;
}[] = [
  {
    id: "fireplace",
    label: "Crépitement de Cheminée",
    shortLabel: "Cheminée",
    icon: Flame,
    color: "#D97736",
  },
  {
    id: "rain",
    label: "Pluie Douce sur la Vitre",
    shortLabel: "Pluie Cosy",
    icon: CloudRain,
    color: "#529491",
  },
  {
    id: "musicbox",
    label: "Boîte à Musique Cocooning",
    shortLabel: "Mélodie",
    icon: Music,
    color: "#E06D8C",
  },
];

export default function CocoonAmbienceBar({
  candlelightMode,
  onToggleCandlelight,
}: CocoonAmbienceBarProps) {
  const [activeTrack, setActiveTrack] = useState<SoundTrackId>("off");
  const [expanded, setExpanded] = useState(false);
  const [pointer, setPointer] = useState({ x: 50, y: 50 });

  const audioCtxRef = useRef<AudioContext | null>(null);
  const cleanupSoundRef = useRef<(() => void) | null>(null);

  // Track pointer for the Candlelight Halo effect
  useEffect(() => {
    if (!candlelightMode) return;
    const handleMove = (e: PointerEvent) => {
      setPointer({
        x: (e.clientX / (window.innerWidth || 1)) * 100,
        y: (e.clientY / (window.innerHeight || 1)) * 100,
      });
    };
    window.addEventListener("pointermove", handleMove, { passive: true });
    return () => window.removeEventListener("pointermove", handleMove);
  }, [candlelightMode]);

  const stopCurrentAudio = useCallback(() => {
    if (cleanupSoundRef.current) {
      cleanupSoundRef.current();
      cleanupSoundRef.current = null;
    }
  }, []);

  const startTrack = useCallback(
    (track: SoundTrackId) => {
      stopCurrentAudio();
      if (track === "off" || typeof window === "undefined") return;

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

        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0.01, ctx.currentTime);
        masterGain.gain.exponentialRampToValueAtTime(
          0.18,
          ctx.currentTime + 0.6
        );
        masterGain.connect(ctx.destination);

        // Create a 3-second noise buffer for warm ambient texture
        const bufLen = ctx.sampleRate * 3;
        const noiseBuf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
        const output = noiseBuf.getChannelData(0);
        let lastOut = 0;
        for (let i = 0; i < bufLen; i++) {
          const white = Math.random() * 2 - 1;
          // Brown/pink warm noise integration
          output[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = output[i]!;
          output[i]! *= 2.4;
        }

        const noiseNode = ctx.createBufferSource();
        noiseNode.buffer = noiseBuf;
        noiseNode.loop = true;

        const filter = ctx.createBiquadFilter();
        if (track === "fireplace") {
          filter.type = "lowpass";
          filter.frequency.setValueAtTime(240, ctx.currentTime);
        } else if (track === "rain") {
          filter.type = "bandpass";
          filter.frequency.setValueAtTime(680, ctx.currentTime);
          filter.Q.setValueAtTime(0.7, ctx.currentTime);
        } else {
          // Very soft vinyl floor for musicbox
          filter.type = "lowpass";
          filter.frequency.setValueAtTime(180, ctx.currentTime);
        }

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(
          track === "musicbox" ? 0.12 : 0.45,
          ctx.currentTime
        );

        noiseNode.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(masterGain);
        noiseNode.start();

        let intervalId: ReturnType<typeof setInterval> | null = null;

        if (track === "fireplace") {
          // Gentle random wood crackles
          intervalId = setInterval(() => {
            if (!audioCtxRef.current || audioCtxRef.current.state !== "running")
              return;
            if (Math.random() > 0.65) return;
            const popOsc = ctx.createOscillator();
            const popGain = ctx.createGain();
            popOsc.type = "triangle";
            popOsc.frequency.setValueAtTime(
              900 + Math.random() * 1400,
              ctx.currentTime
            );
            popGain.gain.setValueAtTime(0.04, ctx.currentTime);
            popGain.gain.exponentialRampToValueAtTime(
              0.0001,
              ctx.currentTime + 0.035
            );
            popOsc.connect(popGain);
            popGain.connect(masterGain);
            popOsc.start();
            popOsc.stop(ctx.currentTime + 0.04);
          }, 260);
        } else if (track === "musicbox") {
          // Delicate pentatonic cozy lullaby notes (F major pentatonic)
          const notes = [349.23, 392.0, 440.0, 523.25, 587.33, 698.46];
          let step = 0;
          intervalId = setInterval(() => {
            if (!audioCtxRef.current || audioCtxRef.current.state !== "running")
              return;
            const freq = notes[(step * 2 + (step % 3)) % notes.length] ?? 440;
            step++;
            const osc = ctx.createOscillator();
            const noteGain = ctx.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            noteGain.gain.setValueAtTime(0.001, ctx.currentTime);
            noteGain.gain.linearRampToValueAtTime(
              0.09,
              ctx.currentTime + 0.03
            );
            noteGain.gain.exponentialRampToValueAtTime(
              0.0001,
              ctx.currentTime + 1.45
            );
            osc.connect(noteGain);
            noteGain.connect(masterGain);
            osc.start();
            osc.stop(ctx.currentTime + 1.5);
          }, 950);
        }

        cleanupSoundRef.current = () => {
          if (intervalId) clearInterval(intervalId);
          try {
            noiseNode.stop();
            noiseNode.disconnect();
            masterGain.disconnect();
          } catch {
            // Ignore cleanup errors
          }
        };
      } catch {
        // Ignore browser audio errors
      }
    },
    [stopCurrentAudio]
  );

  useEffect(() => {
    return () => stopCurrentAudio();
  }, [stopCurrentAudio]);

  const handleSelectTrack = (id: SoundTrackId) => {
    const next = activeTrack === id ? "off" : id;
    setActiveTrack(next);
    startTrack(next);
  };

  const currentTrackMeta = SOUND_TRACKS.find((t) => t.id === activeTrack);

  return (
    <>
      {/* 1. CANDLELIGHT NIGHT VEIL + FAIRY GARLAND LIGHTS OVERLAY */}
      <AnimatePresence>
        {candlelightMode && (
          <motion.div
            key="candlelight-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="pointer-events-none fixed inset-0 z-30 overflow-hidden"
          >
            {/* Dynamic Candlelight Cursor Halo */}
            <div
              style={{
                background: `radial-gradient(circle 420px at ${pointer.x}% ${pointer.y}%, rgba(255, 196, 112, 0.22) 0%, rgba(217, 119, 54, 0.08) 42%, rgba(22, 11, 5, 0.36) 100%)`,
              }}
              className="absolute inset-0 transition-opacity duration-300"
            />

            {/* Top Hanging Fairy Garland Lights */}
            <div className="absolute top-14 inset-x-0 h-10 flex items-start justify-around px-4">
              {Array.from({ length: 16 }).map((_, i) => (
                <motion.span
                  key={i}
                  animate={{
                    opacity: [0.55, 1, 0.65],
                    scale: [0.92, 1.12, 0.95],
                  }}
                  transition={{
                    duration: 2.2 + (i % 4) * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{
                    marginTop: `${(i % 2) * 8}px`,
                    boxShadow:
                      "0 0 18px 5px rgba(255, 206, 115, 0.8), 0 0 36px 10px rgba(217, 119, 54, 0.45)",
                  }}
                  className="w-2.5 h-2.5 rounded-full bg-[#FFF3D1] inline-block"
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. FLOATING COCOONING VINYL & CANDLELIGHT CONTROLLER (Bottom-Left) */}
      <div className="fixed bottom-4 left-4 z-40 hidden sm:flex flex-col items-start gap-2 select-none">
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.94 }}
              transition={{ duration: 0.22 }}
              className="p-4 rounded-3xl bg-espresso-900/95 backdrop-blur-xl text-linen-50 border border-amber-200/20 shadow-2xl w-72 space-y-3"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-amber-200 font-bold">
                    Ambiance Cocooning
                  </span>
                </div>
                {activeTrack !== "off" && (
                  <button
                    type="button"
                    onClick={() => handleSelectTrack("off")}
                    className="text-[10px] text-linen-200/70 hover:text-white flex items-center gap-1"
                  >
                    <VolumeX className="w-3 h-3" />
                    <span>Couper</span>
                  </button>
                )}
              </div>

              {/* 3 Audio Tracks */}
              <div className="space-y-1.5">
                {SOUND_TRACKS.map((t) => {
                  const Icon = t.icon;
                  const isCurrent = activeTrack === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => handleSelectTrack(t.id)}
                      className={`w-full px-3 py-2.5 rounded-2xl text-xs font-bold flex items-center justify-between transition-all ${
                        isCurrent
                          ? "bg-amber-400/20 text-amber-200 border border-amber-300/35 shadow-sm"
                          : "bg-white/5 hover:bg-white/10 text-linen-100/85 border border-transparent"
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <Icon
                          style={{ color: t.color }}
                          className="w-4 h-4 shrink-0"
                        />
                        <span>{t.label}</span>
                      </span>
                      {isCurrent && (
                        <span className="flex items-end gap-0.5 h-3">
                          <motion.span
                            animate={{ height: ["30%", "100%", "40%"] }}
                            transition={{ duration: 0.6, repeat: Infinity }}
                            className="w-0.5 bg-amber-300 rounded-full"
                          />
                          <motion.span
                            animate={{ height: ["90%", "35%", "100%"] }}
                            transition={{ duration: 0.5, repeat: Infinity }}
                            className="w-0.5 bg-amber-300 rounded-full"
                          />
                          <motion.span
                            animate={{ height: ["45%", "95%", "30%"] }}
                            transition={{ duration: 0.7, repeat: Infinity }}
                            className="w-0.5 bg-amber-300 rounded-full"
                          />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Candlelight Evening Toggle inside Drawer */}
              <button
                type="button"
                onClick={onToggleCandlelight}
                className={`w-full px-3 py-2.5 rounded-2xl text-xs font-bold flex items-center justify-between transition-all border ${
                  candlelightMode
                    ? "bg-amber-500 text-espresso-900 border-amber-300 shadow-md"
                    : "bg-white/10 hover:bg-white/15 text-linen-50 border-white/10"
                }`}
              >
                <span className="flex items-center gap-2">
                  {candlelightMode ? (
                    <Sun className="w-4 h-4 text-espresso-900" />
                  ) : (
                    <Moon className="w-4 h-4 text-amber-300" />
                  )}
                  <span>
                    {candlelightMode
                      ? "Revenir à la lumière du jour"
                      : "Mode Veillée à la Bougie"}
                  </span>
                </span>
                <span className="text-[10px] uppercase tracking-wider opacity-80">
                  {candlelightMode ? "ON" : "OFF"}
                </span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Compact Vinyl Pill Bar */}
        <div className="flex items-center gap-2 p-1.5 rounded-full bg-espresso-900/95 backdrop-blur-xl text-linen-50 border border-amber-200/20 shadow-xl">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <motion.div
              animate={activeTrack !== "off" ? { rotate: 360 } : { rotate: 0 }}
              transition={
                activeTrack !== "off"
                  ? { duration: 4, repeat: Infinity, ease: "linear" }
                  : { duration: 0.3 }
              }
              className="w-8 h-8 rounded-full bg-gradient-to-tr from-espresso-800 via-black to-espresso-700 border border-amber-300/40 flex items-center justify-center shadow-inner"
            >
              <Disc3 className="w-4 h-4 text-amber-300" />
            </motion.div>
            <div className="text-left">
              <span className="block text-[10px] font-mono uppercase tracking-wider text-amber-200/80 leading-none">
                Radio CaroTine
              </span>
              <span className="block text-xs font-bold text-linen-50 mt-0.5">
                {currentTrackMeta
                  ? currentTrackMeta.shortLabel
                  : "Ambiance & Sons"}
              </span>
            </div>
          </button>

          {/* Direct 1-click Candlelight Button */}
          <button
            type="button"
            onClick={onToggleCandlelight}
            title={
              candlelightMode
                ? "Désactiver le mode Veillée à la Bougie"
                : "Activer le mode Veillée à la Bougie"
            }
            className={`p-2 rounded-full transition-all ${
              candlelightMode
                ? "bg-amber-400 text-espresso-900 shadow-[0_0_16px_rgba(251,191,36,0.7)]"
                : "bg-white/10 hover:bg-white/20 text-amber-200"
            }`}
          >
            {candlelightMode ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </>
  );
}
