"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Calendar,
  Users,
  Search,
  ChevronDown,
  Sparkles,
  TreePine,
  Heart,
  Camera,
  UsersRound,
  Compass,
} from "lucide-react";
import { motion } from "motion/react";
import { FloatingElement } from "./MotionWrapper";

interface HeroSectionProps {
  onSearch: (params: { checkIn: string; checkOut: string; adults: number; children: number }) => void;
}

export function HeroSection({ onSearch }: HeroSectionProps) {
  const today = new Date().toISOString().split("T")[0] ?? "2026-10-19";
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0] ?? "2026-10-20";

  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(tomorrow);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ checkIn, checkOut, adults, children });
    const elem = document.getElementById("rooms");
    if (elem) elem.scrollIntoView({ behavior: "smooth" });
  };

  const brandValues = [
    { title: "Không gian xanh mát", icon: TreePine },
    { title: "Thư giãn tuyệt đối", icon: Heart },
    { title: "Check-in sống ảo", icon: Camera },
    { title: "Kết nối yêu thương", icon: UsersRound },
    { title: "Trải nghiệm thiên nhiên", icon: Compass },
  ];

  return (
    <section id="hero" className="relative w-full overflow-hidden bg-[#FAF9F6]">
      {/* Background Image with Cinematic Ken-Burns Zoom Animation */}
      <div className="relative h-[72vh] min-h-[520px] max-h-[740px] w-full overflow-hidden">
        <motion.div
          initial={{ scale: 1.15, filter: "brightness(0.7)" }}
          animate={{ scale: 1, filter: "brightness(0.82)" }}
          transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          <Image
            src="/images/DSCF1106-1024x683.jpg"
            alt="M_Dalats Villa Đà Lạt toàn cảnh đồi thông"
            fill
            priority
            className="object-cover object-center"
          />
        </motion.div>

        {/* Ambient Gradient Overlays for Luxury Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#367156]/90 via-[#367156]/40 to-black/35" />

        {/* Hôtel Fantaisie Signature Rotating Heritage Seal */}
        <div className="absolute top-6 right-6 hidden md:flex items-center justify-center z-10 select-none">
          <FloatingElement amplitude={4} duration={6}>
            <div className="relative w-24 h-24 rounded-full bg-[#244b39]/65 backdrop-blur-md border border-[#D9C9A7]/40 p-1 flex items-center justify-center shadow-2xl group cursor-pointer hover:border-[#D9C9A7] transition-colors">
              {/* Rotating SVG Circular Text */}
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full animate-spin-slow"
              >
                <path
                  id="circleTextPath"
                  d="M 50, 50 m -36, 0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0"
                  fill="none"
                />
                <text className="text-[7.2px] uppercase tracking-[0.24em] font-serif fill-[#D9C9A7]">
                  <textPath href="#circleTextPath" startOffset="0%">
                    • M_DALATS BOUTIQUE VILLA • ĐÀ LẠT •
                  </textPath>
                </text>
              </svg>
              {/* Center Emblem Icon */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <Sparkles className="w-4 h-4 text-[#D9C9A7] mb-0.5" />
                <span className="text-[8px] font-serif font-bold text-white tracking-widest">1893</span>
              </div>
            </div>
          </FloatingElement>
        </div>

        {/* Hero Centerpiece Typography & Emblem */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6 z-10">
          {/* Authentic Brand Emblem Vector (Fluid Responsive) */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: -25 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-56 h-36 xs:w-72 xs:h-44 sm:w-96 sm:h-56 md:w-[480px] md:h-68 drop-shadow-2xl"
          >
            <Image
              src="/images/m_dalats_logo_vertical_white.svg"
              alt="M_Dalats Villa - Stay Close to Nature"
              fill
              className="object-contain"
              priority
            />
          </motion.div>

          {/* Slogan handwritten with brand script font */}
          <motion.p
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="font-script text-xl xs:text-2xl sm:text-3xl md:text-4xl text-[#F4A261] font-normal tracking-wide drop-shadow-lg select-none -mt-2 sm:-mt-5 px-2"
          >
            “Đà Lạt – Nơi những kỷ niệm đẹp bắt đầu”
          </motion.p>

          {/* Subtitle tag */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="font-sans text-[9px] xs:text-[10px] sm:text-xs uppercase tracking-[0.22em] sm:tracking-[0.35em] text-[#D9C9A7] font-semibold mt-2 sm:mt-2.5 px-2"
          >
            STAY CLOSE TO NATURE • BOUTIQUE RESORT RETREAT
          </motion.p>

          {/* Explore Prompt Link */}
          <motion.a
            href="#story"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-5 sm:mt-7 inline-flex items-center gap-2 text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#FAF9F6]/85 hover:text-[#F4A261] transition-all group cursor-pointer bg-white/10 hover:bg-white/15 backdrop-blur-md px-3.5 sm:px-4 py-2 sm:py-1.5 rounded-full border border-white/20 min-h-[40px]"
          >
            <span className="font-medium">Khám phá không gian</span>
            <ChevronDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
          </motion.a>
        </div>
      </div>

      {/* Floating Booking Search Bar - Premium UI/UX & Glassmorphism (Aligned with 6xl container) */}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-8 -mt-10 sm:-mt-12 z-20">
        <motion.form
          initial={{ opacity: 0, y: 35, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
          onSubmit={handleSubmit}
          className="bg-white/98 backdrop-blur-xl rounded-md shadow-2xl border border-[#ece7dd] p-3.5 sm:p-5 grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 items-end"
        >
          {/* Check-in Date */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-wider text-[#367156] font-semibold flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#367156]" />
              <span>Ngày nhận phòng</span>
            </label>
            <input
              type="date"
              value={checkIn}
              min={today}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full bg-[#FAF9F6] border border-[#d6cebf] px-3 py-2 text-base sm:text-xs text-[#222222] font-medium rounded-xs focus:outline-hidden focus:border-[#367156] transition-colors min-h-[44px] sm:min-h-[40px]"
              required
            />
          </div>

          {/* Check-out Date */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-wider text-[#367156] font-semibold flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#367156]" />
              <span>Ngày trả phòng</span>
            </label>
            <input
              type="date"
              value={checkOut}
              min={checkIn || today}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full bg-[#FAF9F6] border border-[#d6cebf] px-3 py-2 text-base sm:text-xs text-[#222222] font-medium rounded-xs focus:outline-hidden focus:border-[#367156] transition-colors min-h-[44px] sm:min-h-[40px]"
              required
            />
          </div>

          {/* Guests Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-wider text-[#367156] font-semibold flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#367156]" />
              <span>Số lượng khách</span>
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              <select
                value={adults}
                onChange={(e) => setAdults(Number(e.target.value))}
                className="bg-[#FAF9F6] border border-[#d6cebf] px-2 py-2 text-base sm:text-xs text-[#222222] font-medium rounded-xs focus:outline-hidden focus:border-[#367156] transition-colors min-h-[44px] sm:min-h-[40px]"
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num}>
                    {num} Lớn
                  </option>
                ))}
              </select>
              <select
                value={children}
                onChange={(e) => setChildren(Number(e.target.value))}
                className="bg-[#FAF9F6] border border-[#d6cebf] px-2 py-2 text-base sm:text-xs text-[#222222] font-medium rounded-xs focus:outline-hidden focus:border-[#367156] transition-colors min-h-[44px] sm:min-h-[40px]"
              >
                {[0, 1, 2, 3].map((num) => (
                  <option key={num} value={num}>
                    {num} Trẻ
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Search Button with Warm Sunset Orange Gradient & Hover Pulse */}
          <div className="col-span-1 xs:col-span-2 sm:col-span-1 pt-1 xs:pt-0">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#F4A261] to-[#e05c3c] hover:from-[#e05c3c] hover:to-[#c9492b] text-white text-xs uppercase tracking-wider font-semibold py-2.5 px-4 rounded-xs flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer min-h-[44px] sm:min-h-[40px] group"
            >
              <Search className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
              <span>Tìm phòng</span>
            </button>
          </div>
        </motion.form>
      </div>

      {/* Brand Values Ribbon (Aligned with 6xl container) */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-6 sm:pt-8 pb-4">
        <div className="flex overflow-x-auto no-scrollbar sm:flex-wrap items-center justify-start sm:justify-center gap-2.5 sm:gap-6 py-3 px-3 sm:px-6 rounded-sm bg-white/70 border border-[#ece7dd]/80 backdrop-blur-xs shadow-2xs snap-x">
          {brandValues.map((val, idx) => {
            const Icon = val.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-2 text-xs text-[#367156] font-medium hover:text-[#F4A261] transition-colors cursor-default shrink-0 snap-start"
              >
                <div className="w-5 h-5 rounded-full bg-[#367156]/8 flex items-center justify-center text-[#367156] shrink-0">
                  <Icon className="w-3 h-3" />
                </div>
                <span className="text-[11px] tracking-wide whitespace-nowrap">{val.title}</span>
                {idx < brandValues.length - 1 && (
                  <span className="hidden sm:inline text-[#d6cebf] ml-4 font-light">•</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Poetic quote under the ribbon */}
        <p className="text-center font-script text-lg sm:text-xl text-[#584636] mt-3">
          “Đà Lạt - Không chỉ là điểm đến, đó là cảm xúc!”
        </p>
      </div>
    </section>
  );
}
