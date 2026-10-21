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
      // Show when scrolled past 300px
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
          className="sm:hidden fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-3 right-3 z-40 bg-white/95 backdrop-blur-md border border-[#ece7dd] rounded-full shadow-2xl p-1.5 flex items-center justify-between gap-2"
        >
          <a
            href="tel:0939014234"
            className="w-11 h-11 rounded-full bg-[#faf7f1] border border-[#d6cebf] flex items-center justify-center text-[#367156] flex-shrink-0 active:scale-95 transition-transform"
            aria-label="Gọi điện thoại"
          >
            <Phone className="w-4 h-4" />
          </a>

          <div className="flex flex-col text-left px-1.5 min-w-0 flex-1">
            <span className="text-[9.5px] uppercase tracking-wider text-[#888888] font-medium leading-none truncate">
              M_Dalats Boutique Villa
            </span>
            <span className="text-xs xs:text-sm font-bold text-[#367156] leading-tight truncate mt-0.5">
              từ 850.000 ₫<span className="text-[10px] font-normal text-[#666666]"> /đêm</span>
            </span>
          </div>

          <button
            type="button"
            onClick={onOpenBookingModal}
            className="bg-gradient-to-r from-[#F4A261] to-[#e05c3c] hover:from-[#e05c3c] hover:to-[#c9492b] text-white text-[11px] uppercase tracking-wider font-semibold px-4 py-2.5 rounded-full shadow-md active:scale-95 transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer min-h-[42px]"
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Đặt phòng</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
