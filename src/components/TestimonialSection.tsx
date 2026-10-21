"use client";

import React from "react";
import Image from "next/image";
import { Quote } from "lucide-react";
import { FadeIn, motion } from "./MotionWrapper";

export function TestimonialSection() {
  return (
    <section className="py-20 sm:py-24 bg-[#367156] text-white relative overflow-hidden">
      {/* Background radial pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="max-w-6xl mx-auto px-4 sm:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <FadeIn direction="up">
            {/* 5-star rating */}
            <div className="flex items-center justify-center gap-1 text-[#F4A261] mb-5">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-lg">★</span>
              ))}
            </div>

            <blockquote className="font-serif text-xl sm:text-3xl md:text-4xl font-light italic leading-relaxed text-[#FAF9F6]">
              “Some places are so good to stay in, you don’t want to generate a rush on them. M_Dalats Boutique Villa in Da Lat is one of them.”
            </blockquote>

            <div className="mt-5 sm:mt-6 flex flex-col items-center">
              <span className="font-sans text-xs sm:text-sm tracking-[0.2em] uppercase font-semibold text-[#F4A261]">
                Quân Nguyễn
              </span>
              <span className="text-[11px] sm:text-xs text-[#faf7f1]/70 font-light mt-0.5 tracking-wider">
                Architect • Cố vấn kiến trúc & Nghỉ dưỡng
              </span>
            </div>
          </FadeIn>

          {/* Awards Badges */}
          <FadeIn direction="up" delay={0.2}>
            <div className="mt-12 sm:mt-14 pt-8 sm:pt-10 border-t border-white/15 flex flex-wrap items-center justify-center gap-8 sm:gap-14">
              <div className="relative w-32 sm:w-36 h-12 sm:h-14 grayscale hover:grayscale-0 transition-all opacity-85 hover:opacity-100 hover:scale-105 duration-300">
                <Image
                  src="/images/tripadvisor_badge.png"
                  alt="TripAdvisor Travelers Choice"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="relative w-32 sm:w-36 h-12 sm:h-14 grayscale hover:grayscale-0 transition-all opacity-85 hover:opacity-100 hover:scale-105 duration-300">
                <Image
                  src="/images/asean_award-1.png"
                  alt="ASEAN Tourism Standards Award"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
