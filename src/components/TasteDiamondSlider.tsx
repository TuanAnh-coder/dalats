"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Sparkles, Compass } from "lucide-react";
import { FadeIn } from "./MotionWrapper";

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
  const trackRef = useRef<HTMLDivElement>(null);
  const touchStartXRef = useRef<number | null>(null);

  const activeVista = VISTAS[currentIndex] ?? VISTAS[0]!;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % VISTAS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + VISTAS.length) % VISTAS.length);
  };

  const updateIndexFromClientX = (clientX: number) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const pos = clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, pos / rect.width));
    const targetIdx = Math.round(ratio * (VISTAS.length - 1));
    setCurrentIndex(targetIdx);
  };

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    updateIndexFromClientX(e.clientX);
  };

  const handleTouchStartShowcase = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0]?.clientX ?? null;
  };

  const handleTouchEndShowcase = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const endX = e.changedTouches[0]?.clientX ?? 0;
    const diff = touchStartXRef.current - endX;
    if (diff > 45) {
      handleNext();
    } else if (diff < -45) {
      handlePrev();
    }
    touchStartXRef.current = null;
  };

  // Calculate percentage along the track
  const progressRatio = (currentIndex / (VISTAS.length - 1)) * 100;

  return (
    <section className="py-20 sm:py-28 bg-[#FAF9F6] border-b border-[#ece7dd] overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        {/* Section Header with Hôtel Fantaisie Botanical Diamond Divider */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <FadeIn direction="up">
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-[#367156] font-semibold block mb-2">
              Hành Trình Thị Giác • Visual Journey
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl text-[#367156] font-normal mb-3">
              Góc Thơ Mộng M_Dalats
            </h2>
            <div className="flex items-center justify-center gap-2.5 mx-auto mb-4">
              <span className="w-10 sm:w-14 h-px bg-gradient-to-r from-transparent to-[#367156]/50" />
              <span className="text-[10px] text-[#367156] select-none">◆</span>
              <span className="w-10 sm:w-14 h-px bg-gradient-to-l from-transparent to-[#367156]/50" />
            </div>
            <p className="font-sans text-xs sm:text-sm text-[#666666] font-light leading-relaxed">
              Mỗi góc nhỏ tại villa là một tác phẩm nghệ thuật mộc mạc, nơi thiên nhiên và bàn tay con người giao hòa trong từng ánh ban mai xứ sở sương mù.
            </p>
          </FadeIn>
        </div>

        {/* Cinematic Main Showcase Frame with Touch Swipe */}
        <div
          onTouchStart={handleTouchStartShowcase}
          onTouchEnd={handleTouchEndShowcase}
          className="relative w-full rounded-sm overflow-hidden shadow-2xl border border-[#ece7dd] bg-black select-none touch-pan-y"
        >
          <div className="relative h-[340px] xs:h-[400px] sm:h-[500px] md:h-[580px] w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeVista.id}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={activeVista.image}
                  alt={activeVista.title}
                  fill
                  priority
                  className="object-cover object-center pointer-events-none"
                />
                {/* Subtle vignette gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#244b39]/95 via-[#244b39]/35 to-black/20" />
              </motion.div>
            </AnimatePresence>

            {/* Top Badge: Category & Counter */}
            <div className="absolute top-4 left-4 sm:top-8 sm:left-8 z-10 flex items-center gap-2 sm:gap-3">
              <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.22em] font-semibold text-[#D9C9A7] bg-[#244b39]/75 backdrop-blur-md px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xs border border-[#D9C9A7]/30">
                {activeVista.category}
              </span>
              <span className="text-[11px] sm:text-xs font-mono text-white/80 bg-black/40 backdrop-blur-md px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-xs">
                {String(currentIndex + 1).padStart(2, "0")} / {String(VISTAS.length).padStart(2, "0")}
              </span>
            </div>

            {/* Bottom Caption Overlay */}
            <div className="absolute bottom-4 left-4 right-20 sm:bottom-8 sm:left-8 sm:right-28 z-10 max-w-xl text-white">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeVista.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.6 }}
                >
                  <p className="font-script text-lg sm:text-2xl text-[#F4A261] mb-0.5 sm:mb-1 truncate">
                    “{activeVista.tagline}”
                  </p>
                  <h3 className="font-serif text-xl sm:text-3xl md:text-4xl text-[#FAF9F6] font-normal mb-1 sm:mb-2 line-clamp-1">
                    {activeVista.title}
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-[#FAF9F6]/85 font-light leading-relaxed hidden sm:block">
                    {activeVista.desc}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Arrows */}
            <div className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 z-20 flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous view"
                className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/15 hover:bg-[#367156] border border-white/25 backdrop-blur-md flex items-center justify-center text-white transition-all cursor-pointer hover:scale-105 active:scale-95"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next view"
                className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/15 hover:bg-[#367156] border border-white/25 backdrop-blur-md flex items-center justify-center text-white transition-all cursor-pointer hover:scale-105 active:scale-95"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Hôtel Fantaisie Signature Tactile Diamond Slider Rail */}
        <div className="mt-8 sm:mt-10 max-w-xl mx-auto flex flex-col items-center">
          {/* Label prompt */}
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-[#367156] font-semibold mb-3">
            <Sparkles className="w-3 h-3 text-[#F4A261]" />
            <span>Kéo hoặc chạm thước kim cương để khám phá</span>
          </div>

          {/* Interactive Rail with Mouse & Touch Tracking */}
          <div
            ref={trackRef}
            onClick={handleTrackClick}
            onTouchStart={(e) => {
              if (e.touches[0]) updateIndexFromClientX(e.touches[0].clientX);
            }}
            onTouchMove={(e) => {
              if (e.touches[0]) updateIndexFromClientX(e.touches[0].clientX);
            }}
            className="relative w-full h-8 flex items-center cursor-pointer group py-2 touch-none select-none"
          >
            {/* Base Hairline Bar with Diamond Terminals */}
            <div className="relative w-full h-[2px] bg-[#367156]/20 rounded-full group-hover:bg-[#367156]/35 transition-colors">
              {/* Start Diamond */}
              <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-2 h-2 rotate-45 bg-[#367156]/40" />

              {/* Active Fill Track */}
              <div
                className="h-full bg-gradient-to-r from-[#367156] to-[#F4A261] rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progressRatio}%` }}
              />

              {/* End Diamond */}
              <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-2 h-2 rotate-45 bg-[#367156]/40" />

              {/* Handcrafted Sliding Brass Taste Diamond */}
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-300 ease-out cursor-grab active:cursor-grabbing hover:scale-115"
                style={{ left: `${progressRatio}%` }}
              >
                <div className="relative w-7 h-7 flex items-center justify-center">
                  {/* Outer Diamond Glow */}
                  <div className="w-5 h-5 rotate-45 bg-[#FAF7F1] border-2 border-[#367156] shadow-md flex items-center justify-center group-hover:border-[#F4A261] transition-colors">
                    {/* Inner Diamond Core */}
                    <div className="w-2 h-2 rotate-45 bg-[#367156] group-hover:bg-[#F4A261] transition-colors" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Thumbnails Ribbon */}
          <div className="grid grid-cols-5 gap-2 sm:gap-3 w-full mt-4">
            {VISTAS.map((item, idx) => {
              const isSelected = idx === currentIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`group relative h-14 sm:h-18 rounded-xs overflow-hidden border-2 transition-all cursor-pointer ${
                    isSelected
                      ? "border-[#367156] shadow-md scale-102"
                      : "border-transparent opacity-60 hover:opacity-100 hover:border-[#367156]/40"
                  }`}
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                  <div
                    className={`absolute inset-0 transition-colors ${
                      isSelected ? "bg-transparent" : "bg-black/30 group-hover:bg-transparent"
                    }`}
                  />
                  <span className="absolute bottom-1 right-1 text-[8px] font-mono text-white bg-black/60 px-1 rounded-xs">
                    0{idx + 1}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
