"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  Calendar,
  Users,
  Search,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";

interface HeroSectionProps {
  onSearch: (params: { checkIn: string; checkOut: string; adults: number; children: number }) => void;
}

export function HeroSection({ onSearch }: HeroSectionProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroImageY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.65]);

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

  return (
    <section ref={heroRef} id="hero" style={{ zIndex: 1 }} className="relative z-[1] w-full overflow-hidden bg-[#000000]">
      {/* Chapter 1: Full-bleed Cinematic Dark Hero Band */}
      <div className="relative h-screen h-[100svh] min-h-[640px] w-full overflow-hidden flex flex-col justify-center">
        <motion.div
          style={{ y: heroImageY, opacity: heroOpacity }}
          initial={{ scale: 1.08, filter: "brightness(0.72)" }}
          animate={{ scale: 1, filter: "brightness(0.82)" }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          <Image
            src="/images/1WUpuksOF5f8sn8wdMOsWjuutTvbunBWARaQLmj6mv9iaLfhUhaGmF9dTnJiuCd40pF.jpg"
            alt="M_Dalats Villa Đà Lạt"
            fill
            priority
            className="object-cover object-center"
          />
        </motion.div>

        {/* Ambient Darkened Gradient for Text Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-[#000000]/50 to-black/35" />

        {/* Editorial Headlines: PlayStation SST Signature Weight 300 Light */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6 z-10 max-w-[1280px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold uppercase tracking-[1.5px] text-[#53b1ff] mb-4"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#53b1ff]" />
            <span>Boutique Resort Retreat • Đà Lạt</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="font-sans text-4xl xs:text-5xl sm:text-6xl lg:text-7xl font-light text-white tracking-[-0.1px] leading-[1.15] max-w-4xl"
          >
            Nghỉ dưỡng tĩnh tại giữa rừng thông Đà Lạt
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="text-base sm:text-lg font-normal text-neutral-300 max-w-2xl mt-4 leading-relaxed"
          >
            Trải nghiệm 11 phòng nghỉ biệt lập nép mình giữa triền đồi Khe Sanh. Kiến trúc mộc mạc châu Âu giao hòa cùng không gian mây ngàn và khí hậu cao nguyên.
          </motion.p>

          {/* Action CTAs: PlayStation Blue Primary + Commerce Orange */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-3.5 mt-8"
          >
            <Button
              variant="default"
              onClick={() => {
                const elem = document.getElementById("rooms");
                if (elem) elem.scrollIntoView({ behavior: "smooth" });
              }}
              className="bg-[#0070d1] hover:bg-[#0064b7] active:bg-[#004d8d] text-white h-12 px-7 text-sm sm:text-base font-bold rounded-full shadow-none cursor-pointer"
            >
              <span>Khám phá phòng nghỉ</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              variant="commerce"
              onClick={() => {
                const elem = document.getElementById("rooms");
                if (elem) elem.scrollIntoView({ behavior: "smooth" });
              }}
              className="bg-[#d53b00] hover:bg-[#aa2f00] text-white h-12 px-7 text-sm sm:text-base font-bold rounded-full shadow-none cursor-pointer"
            >
              <span>Đặt phòng trực tiếp</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const elem = document.getElementById("story");
                if (elem) elem.scrollIntoView({ behavior: "smooth" });
              }}
              className="border-white/20 text-white hover:bg-white/10 h-12 px-7 text-sm sm:text-base font-bold rounded-full shadow-none bg-black/40 backdrop-blur-xs cursor-pointer"
            >
              <span>Câu chuyện M_Dalats</span>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Floating Booking Search Bar (PlayStation 8px Card + 4px Inputs) */}
      <div className="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-14 z-20">
        <Card className="bg-[#181818] border border-white/10 rounded-[8px] p-5 sm:p-6 shadow-none">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 items-end"
          >
            {/* Check-in Date */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-[11px] font-semibold uppercase tracking-[1px] text-neutral-400">
                Nhận phòng
              </Label>
              <Input
                type="date"
                value={checkIn}
                min={today}
                onChange={(e) => setCheckIn(e.target.value)}
                className="bg-[#121314] border-white/20 text-white text-xs h-11 rounded-[4px] focus:border-[#0070d1] focus:ring-1 focus:ring-[#0070d1]"
                required
              />
            </div>

            {/* Check-out Date */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-[11px] font-semibold uppercase tracking-[1px] text-neutral-400">
                Trả phòng
              </Label>
              <Input
                type="date"
                value={checkOut}
                min={checkIn || today}
                onChange={(e) => setCheckOut(e.target.value)}
                className="bg-[#121314] border-white/20 text-white text-xs h-11 rounded-[4px] focus:border-[#0070d1] focus:ring-1 focus:ring-[#0070d1]"
                required
              />
            </div>

            {/* Guests Selector */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-[11px] font-semibold uppercase tracking-[1px] text-neutral-400">
                Số lượng khách
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={adults}
                  onChange={(e) => setAdults(Number(e.target.value))}
                  className="h-11 bg-[#121314] border border-white/20 px-3 py-1 text-xs text-white rounded-[4px] focus:outline-none focus:border-[#0070d1] focus:ring-1 focus:ring-[#0070d1] transition-colors cursor-pointer"
                >
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <option key={num} value={num} className="bg-[#181818] text-white">
                      {num} Người lớn
                    </option>
                  ))}
                </select>
                <select
                  value={children}
                  onChange={(e) => setChildren(Number(e.target.value))}
                  className="h-11 bg-[#121314] border border-white/20 px-3 py-1 text-xs text-white rounded-[4px] focus:outline-none focus:border-[#0070d1] focus:ring-1 focus:ring-[#0070d1] transition-colors cursor-pointer"
                >
                  {[0, 1, 2, 3].map((num) => (
                    <option key={num} value={num} className="bg-[#181818] text-white">
                      {num} Trẻ em
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Primary Search CTA Button */}
            <div>
              <Button
                type="submit"
                variant="commerce"
                className="w-full h-11 bg-[#d53b00] hover:bg-[#aa2f00] text-white text-xs sm:text-sm font-bold rounded-full gap-2 shadow-none cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Tìm phòng trống</span>
              </Button>
            </div>
          </form>
        </Card>
      </div>

      {/* Signature Stat-Display Row */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 border-y border-white/10 py-8 text-center sm:text-left">
          {/* Stat 1 */}
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl lg:text-5xl font-light text-white font-sans tracking-tight leading-none block">
              11
            </span>
            <span className="text-[12px] font-medium uppercase tracking-[1px] text-neutral-400 block">
              Phòng nghỉ Boutique
            </span>
          </div>

          {/* Stat 2 */}
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl lg:text-5xl font-light text-white font-sans tracking-tight leading-none block">
              1.893m
            </span>
            <span className="text-[12px] font-medium uppercase tracking-[1px] text-neutral-400 block">
              Độ cao ngắm mây & thông
            </span>
          </div>

          {/* Stat 3 */}
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl lg:text-5xl font-light text-white font-sans tracking-tight leading-none block">
              24/7
            </span>
            <span className="text-[12px] font-medium uppercase tracking-[1px] text-neutral-400 block">
              Quản gia Concierge riêng
            </span>
          </div>

          {/* Stat 4 */}
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl lg:text-5xl font-light text-white font-sans tracking-tight leading-none block">
              100%
            </span>
            <span className="text-[12px] font-medium uppercase tracking-[1px] text-neutral-400 block">
              Rừng thông nguyên sinh
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
