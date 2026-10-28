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
          key="artistic-entrance-curtain"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.04,
            filter: "blur(8px)",
          }}
          transition={{
            duration: 0.75,
            ease: [0.76, 0, 0.24, 1],
          }}
          onClick={triggerExit}
          className="fixed inset-0 z-[999999] flex flex-col items-center justify-center cursor-pointer select-none overflow-hidden bg-[#000000]"
          role="dialog"
          aria-label="M_Dalats Entrance Curtain"
        >
          {/* Deep Cinematic Black Canvas with PlayStation Blue Subtle Glow */}
          <div className="absolute inset-0 bg-[#000000]" />
          <div className="absolute inset-0 opacity-30 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(0,112,209,0.22)_0%,transparent_70%)]" />

          {/* Minimal PlayStation Hairline Corner Brackets */}
          <div className="absolute top-4 left-4 sm:top-8 sm:left-8 w-8 h-8 sm:w-10 sm:h-10 border-t border-l border-white/20 pointer-events-none" />
          <div className="absolute top-4 right-4 sm:top-8 sm:right-8 w-8 h-8 sm:w-10 sm:h-10 border-t border-r border-white/20 pointer-events-none" />
          <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 w-8 h-8 sm:w-10 sm:h-10 border-b border-l border-white/20 pointer-events-none" />
          <div className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 w-8 h-8 sm:w-10 sm:h-10 border-b border-r border-white/20 pointer-events-none" />

          {/* Rotating Seal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="relative w-16 h-16 sm:w-20 sm:h-20 mb-3 sm:mb-5 flex items-center justify-center"
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
              <text className="text-[7.4px] uppercase tracking-[0.24em] font-sans fill-[#53b1ff]">
                <textPath href="#loaderCirclePath" startOffset="0%">
                  • M_DALATS BOUTIQUE VILLA • ĐÀ LẠT •
                </textPath>
              </text>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#0070d1]" />
            </div>
          </motion.div>

          {/* Central Logo with Clip-Path Reveal */}
          <div className="relative w-56 h-28 xs:w-72 xs:h-36 sm:w-96 sm:h-48 flex items-center justify-center">
            {/* Base Layer: Ghosted Base Silhouette (opacity 20%) */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
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
              className="absolute inset-0 pointer-events-none transition-[clip-path] duration-75 ease-linear"
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

          {/* Subtitle in PlayStation SST Light Typography */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center mt-3 sm:mt-5 max-w-md px-6 z-10"
          >
            <p className="text-xl sm:text-2xl font-light text-white tracking-[-0.1px]">
              “Đà Lạt – Nơi những kỷ niệm đẹp bắt đầu”
            </p>

            <p className="text-[10px] uppercase tracking-[0.35em] text-[#53b1ff] font-semibold mt-2">
              BOUTIQUE VILLA • STAY CLOSE TO NATURE
            </p>
          </motion.div>

          {/* PlayStation Progress Line */}
          <div className="mt-8 sm:mt-10 w-48 sm:w-64 flex flex-col items-center gap-2">
            <div className="relative w-full h-[2px] bg-white/20 rounded-full overflow-hidden flex items-center">
              {/* Progress Line */}
              <div
                className="h-full bg-gradient-to-r from-[#0070d1] to-[#53b1ff] transition-all duration-75 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex items-center justify-between w-full text-[9px] uppercase tracking-[0.25em] text-white/60 font-mono pt-1">
              <span>Đang tải</span>
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
            <span className="text-[10px] uppercase tracking-[0.25em] text-white/60 hover:text-white transition-colors border-b border-white/20 pb-0.5">
              Chạm bất kỳ đâu để vào ngay • Click to enter
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
