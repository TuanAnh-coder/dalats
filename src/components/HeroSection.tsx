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
import { SectionStack } from "./MotionWrapper";

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
    <SectionStack
      ref={heroRef as any}
      id="hero"
      index={10}
      sticky={true}
      fullHeight={true}
      dark
      className="bg-[#000000] overflow-hidden"
    >
      {/* Chapter 1: Full-bleed Cinematic Dark Hero Band */}
      <div className="relative min-h-[100svh] md:h-full w-full overflow-hidden flex flex-col justify-between py-6 xs:py-8 sm:py-12 md:py-16">
        <motion.div
          style={{ y: heroImageY, opacity: heroOpacity }}
          initial={{ scale: 1.08, filter: "brightness(0.72)" }}
          animate={{ scale: 1, filter: "brightness(0.82)" }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 -z-10"
        >
          <Image
            src="/images/1WUpuksOF5f8sn8wdMOsWjuutTvbunBWARaQLmj6mv9iaLfhUhaGmF9dTnJiuCd40pF.jpg"
            alt="M_Dalats Boutique Villa Đà Lạt"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 100vw"
            quality={85}
            className="object-cover object-center"
          />
        </motion.div>

        {/* Ambient Darkened Gradient for Text Legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/85 -z-10" />

        {/* Top Spacer for Navbar */}
        <div className="h-6 sm:h-8" />

        {/* Editorial Headlines */}
        <div className="flex flex-col items-center justify-center text-center px-4 sm:px-6 z-10 max-w-4xl mx-auto w-full my-auto">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[11px] xs:text-xs font-semibold uppercase tracking-[1.5px] text-[#53b1ff] mb-3 sm:mb-4"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#53b1ff]" />
            <span>Boutique Resort Retreat • Đà Lạt</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-serif text-2xl xs:text-3xl sm:text-5xl lg:text-6xl font-normal text-white tracking-tight leading-[1.2] max-w-3xl"
          >
            Nghỉ dưỡng tĩnh tại giữa rừng thông Đà Lạt
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="text-xs xs:text-sm sm:text-base font-normal text-neutral-300 max-w-xl mx-auto mt-2.5 sm:mt-3 leading-relaxed"
          >
            11 phòng boutique mộc mạc nép mình bên triền đồi Khe Sanh, mở ra thung lũng thông reo và sương mù lãng mạn.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 mt-5 sm:mt-7"
          >
            <Button
              type="button"
              variant="commerce"
              onClick={() => {
                const elem = document.getElementById("rooms");
                if (elem) elem.scrollIntoView({ behavior: "smooth" });
              }}
              className="bg-[#d53b00] hover:bg-[#aa2f00] text-white h-11 px-6 text-xs xs:text-sm font-bold rounded-full shadow-lg cursor-pointer"
            >
              <span>Đặt phòng trực tiếp</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const elem = document.getElementById("rooms");
                if (elem) elem.scrollIntoView({ behavior: "smooth" });
              }}
              className="border-white/25 text-white hover:bg-white/10 h-11 px-5 text-xs xs:text-sm font-medium rounded-full bg-black/35 backdrop-blur-md cursor-pointer"
            >
              <span>Khám phá 11 phòng</span>
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                const elem = document.getElementById("story");
                if (elem) elem.scrollIntoView({ behavior: "smooth" });
              }}
              className="hidden md:inline-flex text-neutral-300 hover:text-white hover:bg-white/10 h-11 px-5 text-xs xs:text-sm font-medium rounded-full cursor-pointer"
            >
              <span>Câu chuyện M_Dalats</span>
            </Button>
          </motion.div>
        </div>

        {/* Floating Booking Search Bar */}
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 w-full z-20 mt-6 sm:mt-8">
          <Card className="bg-[#181818]/90 backdrop-blur-md border border-white/15 rounded-xl p-3.5 xs:p-4 sm:p-5 shadow-2xl">
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5 items-end"
            >
              {/* Check-in Date */}
              <div className="flex flex-col gap-1">
                <Label className="text-[10px] xs:text-[11px] font-semibold uppercase tracking-[1px] text-neutral-400">
                  Nhận phòng
                </Label>
                <Input
                  type="date"
                  value={checkIn}
                  min={today}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="bg-[#121314] border-white/20 text-white text-xs h-10 xs:h-11 rounded-lg focus:border-[#0070d1]"
                  required
                />
              </div>

              {/* Check-out Date */}
              <div className="flex flex-col gap-1">
                <Label className="text-[10px] xs:text-[11px] font-semibold uppercase tracking-[1px] text-neutral-400">
                  Trả phòng
                </Label>
                <Input
                  type="date"
                  value={checkOut}
                  min={checkIn || today}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="bg-[#121314] border-white/20 text-white text-xs h-10 xs:h-11 rounded-lg focus:border-[#0070d1]"
                  required
                />
              </div>

              {/* Guests Selector */}
              <div className="flex flex-col gap-1">
                <Label className="text-[10px] xs:text-[11px] font-semibold uppercase tracking-[1px] text-neutral-400">
                  Số lượng khách
                </Label>
                <div className="grid grid-cols-2 gap-1.5">
                  <select
                    value={adults}
                    onChange={(e) => setAdults(Number(e.target.value))}
                    className="h-10 xs:h-11 bg-[#121314] border border-white/20 px-2 py-1 text-xs text-white rounded-lg focus:outline-none focus:border-[#0070d1] cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <option key={num} value={num} className="bg-[#181818] text-white">
                        {num} Lớn
                      </option>
                    ))}
                  </select>
                  <select
                    value={children}
                    onChange={(e) => setChildren(Number(e.target.value))}
                    className="h-10 xs:h-11 bg-[#121314] border border-white/20 px-2 py-1 text-xs text-white rounded-lg focus:outline-none focus:border-[#0070d1] cursor-pointer"
                  >
                    {[0, 1, 2, 3].map((num) => (
                      <option key={num} value={num} className="bg-[#181818] text-white">
                        {num} Trẻ
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
                  className="w-full h-10 xs:h-11 bg-[#d53b00] hover:bg-[#aa2f00] text-white text-xs xs:text-sm font-bold rounded-lg gap-1.5 shadow-none cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Tìm phòng</span>
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Signature Stat-Display Row */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 w-full mt-4 sm:mt-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 border-t border-white/10 pt-3.5 sm:pt-4 text-center">
            <div className="flex items-center justify-center gap-1.5 sm:flex-col sm:gap-0.5">
              <span className="text-base xs:text-lg sm:text-2xl font-light text-white font-sans">11</span>
              <span className="text-[10px] xs:text-[11px] uppercase tracking-[0.5px] text-neutral-400">Phòng Boutique</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 sm:flex-col sm:gap-0.5">
              <span className="text-base xs:text-lg sm:text-2xl font-light text-white font-sans">1.893m</span>
              <span className="text-[10px] xs:text-[11px] uppercase tracking-[0.5px] text-neutral-400">Độ cao ngắm mây</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 sm:flex-col sm:gap-0.5">
              <span className="text-base xs:text-lg sm:text-2xl font-light text-white font-sans">24/7</span>
              <span className="text-[10px] xs:text-[11px] uppercase tracking-[0.5px] text-neutral-400">Quản gia riêng</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 sm:flex-col sm:gap-0.5">
              <span className="text-base xs:text-lg sm:text-2xl font-light text-white font-sans">100%</span>
              <span className="text-[10px] xs:text-[11px] uppercase tracking-[0.5px] text-neutral-400">Rừng thông</span>
            </div>
          </div>
        </div>
      </div>
    </SectionStack>
  );
}
