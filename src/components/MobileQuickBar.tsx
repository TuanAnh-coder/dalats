"use client";

import React, { useState, useEffect } from "react";
import { Phone, CalendarCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface MobileQuickBarProps {
  onOpenBookingModal: () => void;
}

export function MobileQuickBar({ onOpenBookingModal }: MobileQuickBarProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="sm:hidden fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-3 right-3 z-[150] bg-[#000000]/95 backdrop-blur-md border border-white/20 rounded-full shadow-2xl p-2 flex items-center justify-between gap-3 text-white"
        >
          <a
            href="tel:0939014234"
            className="w-11 h-11 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:text-[#53b1ff] shrink-0 transition-colors"
            aria-label="Gọi điện thoại Concierge"
          >
            <Phone className="w-4 h-4 text-[#53b1ff]" />
          </a>

          <div className="flex flex-col text-left px-1 min-w-0 flex-1">
            <span className="text-[10px] uppercase tracking-[1px] text-neutral-400 font-bold leading-none truncate">
              M_Dalats Boutique Villa
            </span>
            <span className="text-xs xs:text-sm font-bold text-white leading-tight truncate mt-1">
              từ 850.000 ₫<span className="text-[10px] font-normal text-neutral-400"> /đêm</span>
            </span>
          </div>

          <button
            type="button"
            onClick={onOpenBookingModal}
            className="bg-[#d53b00] hover:bg-[#aa2f00] text-white text-xs font-bold px-5 h-11 rounded-full transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer shadow-none"
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Đặt phòng</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
