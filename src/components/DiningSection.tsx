"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Coffee, Utensils, Flame, Sparkles, Sun, Clock, ArrowRight, CheckCircle2 } from "lucide-react";
import { FadeIn, motion, AnimatePresence } from "./MotionWrapper";

export function DiningSection() {
  const [activeTab, setActiveTab] = useState<"coffee" | "breakfast" | "bbq">("coffee");

  const tabsData = {
    coffee: {
      tag: "Ngày 4 Mùa Café & Lounge",
      title: "Hương vị cà phê Cầu Đất nguyên bản giữa sương mai",
      desc: "Nằm nép mình bên góc vườn thông, quầy cà phê Ngày 4 Mùa tuyển chọn từng hạt Arabica Cầu Đất rang mộc thủ công. Signature Cold Brew ủ chậm 18 tiếng thoảng hương cam sả hay tách Cappuccino bồng bềnh là điểm hẹn bình yên của mọi tâm hồn mê phố núi.",
      time: "07:00 – 21:30 hàng ngày",
      image: "/images/how-to-make-cold-brew-coffee-small-5-610x610.jpg",
      badge: "Signature Cold Brew 18h",
      highlights: [
        "Arabica Cầu Đất rang mộc thượng hạng",
        "Cold Brew hoa quả ủ lạnh thanh mát",
        "Trà hoa cúc atiso mật ong rừng",
        "Không gian ngắm đồi thông tĩnh lặng",
      ],
    },
    breakfast: {
      tag: "Điểm tâm sáng ấm cúng",
      title: "Bữa sáng kiểu Âu & Đặc sản Đà Lạt nồng nàn",
      desc: "Được chế biến từ nông sản tươi sạch trong ngày của các nông trại hữu cơ Đà Lạt. Bạn có thể chọn bữa sáng Continental với bánh sừng bò nướng bơ tỏi giòn tan, hoặc tô phở bò cao nguyên thơm nức, bánh mì xíu mại chén cay ấm sực xua tan cái lạnh sáng sớm.",
      time: "06:30 – 10:00 hàng ngày (Bao gồm trong giá phòng)",
      image: "/images/DSCF1106-1024x683.jpg",
      badge: "Tươi ngon từ nông trại",
      highlights: [
        "Phở bò cao nguyên thảo mộc hầm 12h",
        "Bánh mì xíu mại chén cay đặc sản",
        "Set Continental bánh mì nướng bơ mứt",
        "Sữa chua phô mai dẻo tự làm",
      ],
    },
    bbq: {
      tag: "Tiệc nướng & Lửa trại đêm",
      title: "Bếp than hồng bập bùng & Vang đỏ nồng nàn trong đêm 15°C",
      desc: "Khi hoàng hôn buông xuống, khu vườn M_Dalats bừng sáng ánh đèn vàng ấm cúng. Bếp than hoa hồng rực sẵn sàng cho tiệc nướng BBQ với dẻ sườn bò tảng, xiên nướng thảo mộc, bắp ngọt và ly rượu vang đỏ Đà Lạt đậm đà bên đống lửa ấm áp.",
      time: "17:30 – 21:30 (Đặt trước 4 tiếng)",
      image: "/images/BBQ.jpg",
      badge: "BBQ & Lửa trại đêm sương",
      highlights: [
        "Thịt bò Úc ướp sốt tiêu đen thảo mộc",
        "Xiên nướng rau củ tươi sạch Đà Lạt",
        "Khoai lang mật & bắp nếp nướng than",
        "Rượu vang đỏ Chateau thượng hạng",
      ],
    },
  };

  const current = tabsData[activeTab];

  return (
    <section id="dining" className="py-20 sm:py-28 bg-[#FAF9F6] border-y border-[#ece7dd] overflow-hidden scroll-mt-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <FadeIn direction="up">
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-[#367156] font-semibold block mb-2">
              Ẩm Thực • Cà Phê
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl text-[#367156] font-normal mb-3 sm:mb-4">
              Hương Vị Nồng Nàn Nơi Phố Sương
            </h2>
            <div className="flex items-center justify-center gap-2.5 mx-auto mb-4">
              <span className="w-10 sm:w-14 h-px bg-gradient-to-r from-transparent to-[#367156]/50" />
              <span className="text-[10px] text-[#367156] select-none">◆</span>
              <span className="w-10 sm:w-14 h-px bg-gradient-to-l from-transparent to-[#367156]/50" />
            </div>
            <p className="font-script text-xl sm:text-2xl text-[#F4A261]">
              “Mỗi bữa ăn là một bản hòa ca giữa đất trời cao nguyên”
            </p>
          </FadeIn>

          {/* Interactive Navigation Pills */}
          <FadeIn direction="up" delay={0.15}>
            <div className="flex overflow-x-auto no-scrollbar sm:flex-wrap items-center justify-start sm:justify-center gap-1.5 sm:gap-2 mt-6 sm:mt-8 p-1.5 bg-white border border-[#ece7dd] rounded-2xl sm:rounded-full max-w-full sm:max-w-fit mx-auto shadow-2xs snap-x">
              {[
                { id: "coffee", label: "Cà Phê Ngày 4 Mùa", icon: Coffee },
                { id: "breakfast", label: "Bữa Sáng Tinh Tế", icon: Sun },
                { id: "bbq", label: "Tiệc Nướng BBQ & Lửa Trại", icon: Flame },
              ].map((tab) => {
                const isSelected = activeTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`relative px-3.5 sm:px-5 py-2 sm:py-2.5 text-[10px] xs:text-[11px] sm:text-xs uppercase tracking-wider rounded-full transition-colors cursor-pointer font-medium flex items-center gap-1.5 sm:gap-2 whitespace-nowrap shrink-0 snap-start ${
                      isSelected ? "text-white font-semibold" : "text-[#555555] hover:text-[#367156]"
                    }`}
                  >
                    {isSelected && (
                      <motion.div
                        layoutId="activeDiningTab"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        className="absolute inset-0 bg-[#367156] rounded-full shadow-sm"
                      />
                    )}
                    <Icon className="w-3.5 h-3.5 relative z-10 shrink-0" />
                    <span className="relative z-10">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </FadeIn>
        </div>

        {/* Tab Content Box with AnimatePresence */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 lg:gap-14 items-center bg-white p-4 xs:p-6 sm:p-10 lg:p-12 rounded-sm border border-[#ece7dd] shadow-sm"
          >
            {/* Visual Photo */}
            <div className="lg:col-span-6 relative">
              <div className="relative h-[320px] sm:h-[420px] w-full rounded-sm overflow-hidden shadow-lg border-4 border-[#FAF9F6] group">
                <Image
                  src={current.image}
                  alt={current.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xs shadow-md text-[11px] font-semibold text-[#367156] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#F4A261]" />
                  <span>{current.time}</span>
                </div>

                <div className="absolute bottom-4 right-4 bg-[#367156]/90 backdrop-blur-md px-3 py-1 rounded-xs text-[10px] uppercase tracking-wider text-white font-medium">
                  {current.badge}
                </div>
              </div>
            </div>

            {/* Content Details */}
            <div className="lg:col-span-6 space-y-4">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#F4A261] font-semibold block">
                {current.tag}
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#367156] font-normal leading-tight">
                {current.title}
              </h3>
              <div className="flex items-center gap-2">
                <span className="w-10 h-px bg-[#367156]/50" />
                <span className="text-[9px] text-[#367156] select-none">◆</span>
              </div>
              <p className="font-sans text-xs sm:text-sm text-[#555555] font-light leading-relaxed">
                {current.desc}
              </p>

              {/* Highlights List */}
              <div className="pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {current.highlights.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-[#333333]">
                      <CheckCircle2 className="w-4 h-4 text-[#367156] flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-wrap items-center gap-3">
                <Link
                  href="/dining"
                  className="inline-flex items-center gap-2 bg-[#367156] hover:bg-[#244b39] text-white text-xs uppercase tracking-wider font-semibold px-5 py-2.5 rounded-xs shadow-xs transition-colors cursor-pointer"
                >
                  <span>Xem thực đơn & bảng giá</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <a
                  href="tel:0939014234"
                  className="text-xs font-semibold text-[#F4A261] hover:underline px-2"
                >
                  Đặt tiệc: 0939 014 234
                </a>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
