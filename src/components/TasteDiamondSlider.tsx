"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FadeIn, SectionStack } from "./MotionWrapper";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";

interface VistaItem {
  id: number;
  title: string;
  tagline: string;
  category: string;
  image: string;
  desc: string;
}

const VISTAS: VistaItem[] = [
  {
    id: 1,
    title: "Vườn Hồng & Lối Đi Lát Đá",
    tagline: "Hương hoa ngào ngạt trong làn sương mai cao nguyên",
    category: "Cảnh Quan Thiên Nhiên",
    image: "/images/DSCF1106-1024x683.jpg",
    desc: "Bước chân chậm rãi trên con đường đá cuội quanh co, hít hà bầu không khí trong veo ngập tràn mùi hương của những đoá hồng cổ thụ nở rộ quanh năm.",
  },
  {
    id: 2,
    title: "Không Gian Kiến Trúc Tuscany",
    tagline: "Nét mộc mạc châu Âu giao thoa hồn thơ phố núi",
    category: "Kiến Trúc & Nghệ Thuật",
    image: "/images/DH_01328_2-pgvj0qxon4n8u4tqnzxuo0cafocg3jtjqw7qfalgc0.jpg",
    desc: "Từng mảng tường gạch nung ấm áp, vòm cửa gỗ tự nhiên và ánh đèn vàng dịu nhẹ tạo nên một không gian nghỉ dưỡng cổ kính, thanh lịch và ấm cúng.",
  },
  {
    id: 3,
    title: "Ban Công Đón Nắng Đồi Thông",
    tagline: "Bức tranh thiên nhiên ngút ngàn ngay tầm mắt",
    category: "Tầm Nhìn Nghỉ Dưỡng",
    image: "/images/DH_01968-Pano-Edit-700x466.jpg",
    desc: "Thức giấc cùng tách trà atiso ấm nóng nơi ban công riêng tư, lặng ngắm sương mù giăng mắc trên những tán thông già và mái ngói nhấp nhô xa xăm.",
  },
  {
    id: 4,
    title: "Góc Cà Phê Ngày 4 Mùa",
    tagline: "Ly cà phê nồng nàn và tiếng nhạc êm đềm",
    category: "Thưởng Thức & Thư Thái",
    image: "/images/DH_01791-HDR-Edit-700x466.jpg",
    desc: "Góc sân nhỏ đón nắng xiên qua tán cây, nơi bạn có thể chậm rãi đọc một cuốn sách hay, chuyện trò cùng người thương và lắng nghe bản hòa tấu của đất trời.",
  },
  {
    id: 5,
    title: "Lửa Trại & Tiệc Nướng Hoàng Hôn",
    tagline: "Gắn kết yêu thương dưới bầu trời đầy sao",
    category: "Trải Nghiệm Đêm Đà Lạt",
    image: "/images/BBQ.jpg",
    desc: "Khi màn đêm buông xuống và sương lạnh lan tỏa, đốm lửa bập bùng cùng hương thơm thịt nướng BBQ nóng hổi mang lại những khoảnh khắc sum vầy trọn vẹn nhất.",
  },
];

export function TasteDiamondSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const activeVista = VISTAS[currentIndex] ?? VISTAS[0]!;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % VISTAS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + VISTAS.length) % VISTAS.length);
  };

  return (
    /* Chapter 4: Full-bleed True White Canvas Band (#ffffff) */
    <SectionStack index={4} className="py-16 md:py-0 pt-20 md:pt-24 md:pb-8 bg-[#ffffff] text-[#000000] border-b border-[#f3f3f3] overflow-hidden w-full max-w-full">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 w-full min-w-0">
        {/* Section Header: PlayStation SST 300 Light */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
          <FadeIn direction="up">
            <span className="text-[12px] uppercase tracking-[1.5px] text-[#0070d1] font-bold block mb-2">
              Visual Narrative • Bộ Sưu Tập Không Gian
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl text-[#000000] font-light tracking-tight mb-2 sm:mb-3">
              Góc thơ mộng tại M_Dalats Villa
            </h2>
            <p className="text-sm sm:text-base text-[rgba(0,0,0,0.65)] font-normal leading-relaxed">
              Mỗi góc nhỏ tại biệt thự là một khoảnh khắc tĩnh lặng mộc mạc, nơi thiên nhiên và cảnh quan giao hòa trong từng ánh ban mai xứ sở sương mù.
            </p>
          </FadeIn>
        </div>

        {/* Showcase Card: PlayStation surface-card #f5f7fa, 8px radius */}
        <div className="border border-[#f3f3f3] rounded-[8px] overflow-hidden bg-[#f5f7fa] shadow-none">
          <div className="relative h-[320px] xs:h-[380px] sm:h-[420px] md:h-[450px] w-full bg-neutral-900">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeVista.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0"
              >
                <Image
                  src={activeVista.image}
                  alt={activeVista.title}
                  fill
                  priority
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              </motion.div>
            </AnimatePresence>

            {/* Top Badge: Category & Counter */}
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10 flex items-center gap-2">
              <Badge className="bg-[#0070d1] text-white rounded-full text-[11px] uppercase tracking-[1px] font-bold px-3 py-1">
                {activeVista.category}
              </Badge>
              <Badge variant="outline" className="border-white/30 text-white bg-black/50 backdrop-blur-md rounded-full text-[11px] font-mono px-3">
                {currentIndex + 1} / {VISTAS.length}
              </Badge>
            </div>

            {/* Bottom Caption Overlay */}
            <div className="absolute bottom-6 left-6 right-24 sm:bottom-8 sm:left-8 sm:right-36 z-10 max-w-xl text-white">
              <span className="text-xs uppercase tracking-[1px] text-[#53b1ff] font-bold block mb-1 truncate">
                {activeVista.tagline}
              </span>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl text-white font-light mb-2 tracking-tight">
                {activeVista.title}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 font-normal leading-relaxed hidden sm:block">
                {activeVista.desc}
              </p>
            </div>

            {/* Carousel Paddles: 48px circle, PlayStation carousel-paddle spec */}
            <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 z-20 flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous view"
                className="w-12 h-12 rounded-full bg-white/20 hover:bg-[#0070d1] text-white flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next view"
                className="w-12 h-12 rounded-full bg-white/20 hover:bg-[#0070d1] text-white flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Thumbnail Navigation Strip */}
          <div className="p-3 sm:p-4 bg-[#f5f7fa] border-t border-[#f3f3f3]">
            <div className="grid grid-cols-5 gap-2 sm:gap-3">
              {VISTAS.map((item, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`relative rounded-[6px] overflow-hidden aspect-[16/10] sm:aspect-[16/9] border transition-all text-left cursor-pointer group ${
                      isActive
                        ? "border-[#0070d1] ring-2 ring-[#0070d1]"
                        : "border-[#e5e7eb] opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 20vw, 15vw"
                    />
                    <div className="absolute inset-0 bg-black/25 group-hover:bg-transparent transition-colors" />
                    <span className="absolute bottom-1 left-1.5 right-1.5 text-[10px] font-bold text-white truncate hidden md:block">
                      {item.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </SectionStack>
  );
}
