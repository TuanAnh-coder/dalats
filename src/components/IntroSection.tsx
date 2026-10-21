"use client";

import React from "react";
import Image from "next/image";
import { FadeIn, motion } from "./MotionWrapper";

export function IntroSection() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-8 max-w-4xl mx-auto text-center relative overflow-hidden">
      {/* Decorative floral accent with gentle float */}
      <FadeIn direction="down" duration={0.8} distance={20}>
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="flex justify-center mb-4 sm:mb-6"
        >
          <div className="relative w-12 h-12 sm:w-14 sm:h-14">
            <Image
              src="/images/LE_Hong-01.png"
              alt="M_Dalats Rose Graphic"
              fill
              className="object-contain"
            />
          </div>
        </motion.div>
      </FadeIn>

      <FadeIn direction="up" delay={0.1}>
        <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-[#367156] font-semibold block mb-2 sm:mb-3">
          Đà Lạt • M_Dalats Villa
        </span>
      </FadeIn>

      <FadeIn direction="up" delay={0.2} duration={0.7}>
        <h2 className="font-serif text-xl sm:text-3xl md:text-4xl text-[#367156] font-normal leading-relaxed max-w-3xl mx-auto">
          “Nằm liền kề trung tâm Thành phố Đà Lạt, một con dốc nhỏ, một Boutique Villa được thiết kế chỉnh chu với cảm hứng kiến trúc vùng Tuscany miền quê nước Ý...”
        </h2>
      </FadeIn>

      <FadeIn direction="up" delay={0.25} duration={0.6}>
        <p className="font-script text-2xl sm:text-3xl text-[#F4A261] mt-3 font-normal">
          — Chốn dừng chân an yên giữa đại ngàn thông reo —
        </p>
      </FadeIn>

      <FadeIn direction="up" delay={0.3} duration={0.7}>
        <p className="font-sans text-xs sm:text-sm md:text-base text-[#555555] leading-relaxed sm:leading-loose max-w-2xl mx-auto mt-4 sm:mt-5 font-light">
          Một khu vườn nhỏ yên bình đầy hoa lá, nơi bạn có thể cảm nhận trọn vẹn không khí trong lành & nhịp sống chậm rãi vùng Cao Nguyên xinh đẹp. Từng viên gạch, góc ban công hay nhành thông reo đều được gửi gắm trọn vẹn yêu thương.
        </p>
      </FadeIn>

      {/* Villa Architectural Line Art with subtle draw-in */}
      <FadeIn direction="up" delay={0.4} duration={0.8}>
        <div className="mt-8 sm:mt-12 flex justify-center">
          <div className="relative w-40 sm:w-52 h-20 sm:h-24">
            <Image
              src="/images/LE_Villa_Lines.svg"
              alt="M_Dalats Villa Architecture Sketch"
              fill
              className="object-contain opacity-75 hover:opacity-100 transition-opacity"
            />
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
