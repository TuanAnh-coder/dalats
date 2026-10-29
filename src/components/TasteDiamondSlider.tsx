"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FadeIn, SectionStack } from "./MotionWrapper";
import { Badge } from "~/components/ui/badge";

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
  const touchStartX = useRef<number | null>(null);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % VISTAS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + VISTAS.length) % VISTAS.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0]?.clientX ?? 0;
    const diff = touchStartX.current - touchEndX;

    if (diff > 45) {
      handleNext();
    } else if (diff < -45) {
      handlePrev();
    }
    touchStartX.current = null;
  };

  return (
    <SectionStack
      index={40}
      fullHeight={true}
      sticky={true}
      className="bg-[#ffffff] text-[#000000] border-t border-[#e5e5e5] border-b border-[#f3f3f3] overflow-hidden w-full max-w-full"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 w-full min-w-0">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-4 sm:mb-6">
          <FadeIn direction="up">
            <span className="text-[11px] sm:text-xs uppercase tracking-[2px] text-[#0070d1] font-bold block mb-1.5 sm:mb-2">
              Visual Narrative • Bộ Sưu Tập Không Gian
            </span>
            <h2 className="font-serif text-2xl xs:text-3xl sm:text-4xl md:text-5xl text-[#000000] font-normal tracking-tight mb-2">
              Góc Thơ Mộng Tại M_Dalats Villa
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-[rgba(0,0,0,0.65)] font-normal leading-relaxed">
              Mỗi góc nhỏ tại biệt thự là một khoảnh khắc tĩnh lặng mộc mạc, nơi thiên nhiên và cảnh quan giao hòa trong từng ánh ban mai xứ sở sương mù.
            </p>
          </FadeIn>
        </div>

        {/* Showcase Card: PlayStation surface-card #f5f7fa */}
        <div className="border border-[#e5e5e5] rounded-[12px] sm:rounded-[8px] overflow-hidden bg-[#f5f7fa] shadow-none">
          <div
            className="relative h-[260px] xs:h-[300px] sm:h-[360px] md:h-[380px] lg:h-[410px] w-full bg-neutral-900 select-none cursor-grab active:cursor-grabbing"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeVista.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="absolute inset-0"
              >
                <Image
                  src={activeVista.image}
                  alt={activeVista.title}
                  fill
                  priority
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 1280px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
              </motion.div>
            </AnimatePresence>

            {/* Top Badge: Category & Counter */}
            <div className="absolute top-3.5 left-3.5 sm:top-6 sm:left-6 z-10 flex items-center gap-2">
              <Badge className="bg-[#0070d1] text-white rounded-full text-[10px] sm:text-[11px] uppercase tracking-[1px] font-bold px-2.5 sm:px-3 py-1">
                {activeVista.category}
              </Badge>
              <Badge
                variant="outline"
                className="border-white/30 text-white bg-black/60 backdrop-blur-md rounded-full text-[10px] sm:text-[11px] font-mono px-2.5 sm:px-3"
              >
                {currentIndex + 1} / {VISTAS.length}
              </Badge>
            </div>

            {/* Bottom Caption Overlay */}
            <div className="absolute bottom-3.5 left-3.5 right-24 xs:right-28 sm:bottom-8 sm:left-8 sm:right-36 z-10 max-w-xl text-white">
              <span className="text-[10px] sm:text-xs uppercase tracking-[1px] text-[#53b1ff] font-bold block mb-1 truncate">
                {activeVista.tagline}
              </span>
              <h3 className="font-serif text-lg xs:text-xl sm:text-3xl lg:text-4xl text-white font-normal mb-1 sm:mb-2 tracking-tight leading-tight">
                {activeVista.title}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-200/90 font-normal leading-relaxed line-clamp-2 sm:line-clamp-none">
                {activeVista.desc}
              </p>
            </div>

            {/* Carousel Paddles */}
            <div className="absolute bottom-3.5 right-3.5 sm:bottom-8 sm:right-8 z-20 flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous view"
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/50 hover:bg-[#0070d1] active:bg-[#004d8d] text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next view"
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/50 hover:bg-[#0070d1] active:bg-[#004d8d] text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {/* Thumbnail Navigation Strip */}
          <div className="p-2.5 sm:p-4 bg-[#f5f7fa] border-t border-[#e5e5e5]">
            <div className="grid grid-cols-5 gap-1.5 sm:gap-3">
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
