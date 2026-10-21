"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles } from "lucide-react";

export function ArtisticEntranceLoader() {
  const [mounted, setMounted] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setMounted(true);

    // Check if user has already seen the intro in this browser tab session
    const hasSeenIntro = typeof window !== "undefined" ? sessionStorage.getItem("mdalats_intro_seen") : null;
    if (hasSeenIntro) {
      setIsFinished(true);
      window.dispatchEvent(new Event("loader:done"));
      return;
    }

    // Animate progress smoothly from 0 to 100%
    const startTime = Date.now();
    const duration = 1400; // 1.4s logo reveal

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const nextProgress = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(nextProgress);

      if (elapsed >= duration) {
        clearInterval(timer);
        // Start curtain exit
        setTimeout(() => {
          triggerExit();
        }, 220);
      }
    }, 25);

    return () => clearInterval(timer);
  }, []);

  const triggerExit = () => {
    if (isExiting || isFinished) return;
    setIsExiting(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("mdalats_intro_seen", "true");
      window.dispatchEvent(new Event("loader:done"));
    }
  };

  // Skip completely after exit animation completes
  const handleExitComplete = () => {
    setIsFinished(true);
  };

  if (!mounted || isFinished) {
    return null;
  }

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {!isExiting && (
        <motion.div
          key="artistic-loader-wrap"
          initial={{ y: "0%" }}
          exit={{
            y: "-100%",
            transition: {
              duration: 1.05,
              ease: [0.76, 0, 0.24, 1], // Silk curtain slide-up
            },
          }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden cursor-pointer select-none"
          onClick={triggerExit}
        >
          {/* Deep Botanical Green Curtain Canvas (#244b39 -> #367156) */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#1b3a2c] via-[#244b39] to-[#367156]" />

          {/* Luxury Ambient Radial Vignette & Texture */}
          <div className="absolute inset-0 opacity-25 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(217,201,167,0.18)_0%,transparent_70%)]" />
          <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />

          {/* French Boutique Four-Corner Flourish Brackets */}
          <div className="absolute top-3 left-3 sm:top-6 sm:left-6 w-8 h-8 sm:w-12 sm:h-12 border-t border-l border-[#D9C9A7]/40 pointer-events-none flex items-start justify-start p-1 sm:p-1.5">
            <span className="text-[7px] sm:text-[8px] text-[#D9C9A7]/60">◆</span>
          </div>
          <div className="absolute top-3 right-3 sm:top-6 sm:right-6 w-8 h-8 sm:w-12 sm:h-12 border-t border-r border-[#D9C9A7]/40 pointer-events-none flex items-start justify-end p-1 sm:p-1.5">
            <span className="text-[7px] sm:text-[8px] text-[#D9C9A7]/60">◆</span>
          </div>
          <div className="absolute bottom-3 left-3 sm:bottom-6 sm:left-6 w-8 h-8 sm:w-12 sm:h-12 border-b border-l border-[#D9C9A7]/40 pointer-events-none flex items-end justify-start p-1 sm:p-1.5">
            <span className="text-[7px] sm:text-[8px] text-[#D9C9A7]/60">◆</span>
          </div>
          <div className="absolute bottom-3 right-3 sm:bottom-6 sm:right-6 w-8 h-8 sm:w-12 sm:h-12 border-b border-r border-[#D9C9A7]/40 pointer-events-none flex items-end justify-end p-1 sm:p-1.5">
            <span className="text-[7px] sm:text-[8px] text-[#D9C9A7]/60">◆</span>
          </div>

          {/* Header Rotating Mini Heritage Seal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="relative w-16 h-16 sm:w-20 sm:h-20 mb-2 sm:mb-4 flex items-center justify-center"
          >
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full animate-spin-slow opacity-80"
            >
              <path
                id="loaderCirclePath"
                d="M 50, 50 m -36, 0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0"
                fill="none"
              />
              <text className="text-[7.4px] uppercase tracking-[0.24em] font-serif fill-[#D9C9A7]">
                <textPath href="#loaderCirclePath" startOffset="0%">
                  • M_DALATS BOUTIQUE VILLA • ĐÀ LẠT •
                </textPath>
              </text>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#D9C9A7]" />
            </div>
          </motion.div>

          {/* Central Logo with Two-Layer Clip-Path Reveal (Hôtel Fantaisie Signature) */}
          <div className="relative w-56 h-28 xs:w-72 xs:h-36 sm:w-96 sm:h-48 flex items-center justify-center">
            {/* Base Layer: Ghosted Base Silhouette (opacity 20%) */}
            <div className="absolute inset-0 opacity-20 pointer-events-none filter drop-shadow">
              <Image
                src="/images/m_dalats_logo_vertical_white.svg"
                alt="M_Dalats Boutique Villa"
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Top Layer: Clip-Path Fill from Bottom to Top (0% to 100%) */}
            <div
              className="absolute inset-0 pointer-events-none filter drop-shadow-[0_4px_20px_rgba(217,201,167,0.35)] transition-[clip-path] duration-75 ease-linear"
              style={{
                clipPath: `inset(${100 - progress}% 0% 0% 0%)`,
                WebkitClipPath: `inset(${100 - progress}% 0% 0% 0%)`,
              }}
            >
              <Image
                src="/images/m_dalats_logo_vertical_white.svg"
                alt="M_Dalats Boutique Villa Reveal"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Poetic Subtitle & Heritage Flourish */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center mt-3 sm:mt-5 max-w-md px-6 z-10"
          >
            <p className="font-script text-xl xs:text-2xl sm:text-3xl text-[#F4A261] font-normal drop-shadow-md">
              “Đà Lạt – Nơi những kỷ niệm đẹp bắt đầu”
            </p>

            <p className="font-sans text-[9px] xs:text-[10px] uppercase tracking-[0.35em] text-[#D9C9A7] font-semibold mt-2">
              EST. 1893 • TUSCANY BOUTIQUE RESORT
            </p>
          </motion.div>

          {/* Hôtel Fantaisie Diamond Progress Gauge */}
          <div className="mt-8 sm:mt-10 w-48 sm:w-64 flex flex-col items-center gap-2">
            <div className="relative w-full h-[2px] bg-[#D9C9A7]/25 rounded-full overflow-visible flex items-center">
              {/* Progress Line */}
              <div
                className="h-full bg-gradient-to-r from-[#D9C9A7]/40 via-[#F4A261] to-[#D9C9A7] transition-all duration-75 rounded-full"
                style={{ width: `${progress}%` }}
              />

              {/* Sliding Brass Diamond Indicator */}
              <div
                className="absolute transform -translate-x-1/2 flex items-center justify-center transition-all duration-75"
                style={{ left: `${progress}%` }}
              >
                <div className="w-2.5 h-2.5 bg-[#FAF7F1] rotate-45 shadow-[0_0_8px_rgba(244,162,97,0.8)] border border-[#D9C9A7]" />
              </div>
            </div>

            <div className="flex items-center justify-between w-full text-[9px] uppercase tracking-[0.25em] text-[#D9C9A7]/75 font-mono pt-1">
              <span>Đang mở cửa</span>
              <span>{progress}%</span>
            </div>
          </div>

          {/* Quick Skip Prompt */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.75 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="absolute bottom-4 sm:bottom-8 pb-[max(0.5rem,env(safe-area-inset-bottom))] text-center px-4"
          >
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#FAF7F1]/80 hover:text-white transition-colors border-b border-[#D9C9A7]/30 pb-0.5">
              Chạm bất kỳ đâu để vào ngay • Click to enter
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
