"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Coffee, Utensils, Flame, Sun, Clock, ArrowRight, CheckCircle2, Phone } from "lucide-react";
import { FadeIn, motion, AnimatePresence, SectionStack } from "./MotionWrapper";
import { Button } from "~/components/ui/button";

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
    <SectionStack
      id="dining"
      index={60}
      fullHeight={true}
      sticky={true}
      className="bg-[#ffffff] text-[#000000] border-b border-[#f3f3f3] overflow-hidden scroll-mt-24 w-full max-w-full"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 w-full min-w-0">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8 min-w-0">
          <FadeIn direction="up">
            <span className="text-[11px] sm:text-xs uppercase tracking-[2px] text-[#0070d1] font-bold block mb-2">
              Culinary & Lounge • Ẩm Thực & Cà Phê
            </span>
            <h2 className="font-serif text-2xl xs:text-3xl sm:text-4xl md:text-5xl text-[#000000] font-normal tracking-tight mb-2 sm:mb-3">
              Hương Vị Nồng Nàn Nơi Phố Sương
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-[rgba(0,0,0,0.65)] font-normal leading-relaxed">
              Mỗi món ngon và tách cà phê là một câu chuyện hòa quyện giữa đất trời cao nguyên và bàn tay tinh tế của nghệ nhân.
            </p>
          </FadeIn>

          {/* Filter Pills with horizontal scroll on mobile */}
          <FadeIn direction="up" delay={0.15}>
            <div className="flex overflow-x-auto no-scrollbar sm:flex-wrap items-center justify-start sm:justify-center mt-5 sm:mt-8 gap-2 max-w-full min-w-0 -mx-4 px-4 sm:mx-auto sm:px-0">
              {[
                { id: "coffee", label: "Cà phê Ngày 4 Mùa", icon: Coffee },
                { id: "breakfast", label: "Điểm tâm sáng kiểu Âu", icon: Sun },
                { id: "bbq", label: "Tiệc nướng BBQ & Lửa trại", icon: Flame },
              ].map((tab) => {
                const isSelected = activeTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-4 sm:px-5 py-2 sm:py-2.5 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 sm:gap-2 whitespace-nowrap shrink-0 rounded-full ${
                      isSelected
                        ? "bg-[#0070d1] text-white shadow-sm"
                        : "bg-[#f5f7fa] text-neutral-700 hover:bg-[#e5e7eb] hover:text-black border border-[#e5e7eb]"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </FadeIn>
        </div>

        {/* Tab Content Box: PlayStation surface-card #f5f7fa */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 lg:gap-14 items-center bg-[#f5f7fa] p-4 xs:p-6 sm:p-10 lg:p-12 rounded-[12px] sm:rounded-[8px] border border-[#f3f3f3]"
          >
            {/* Visual Photo */}
            <div className="lg:col-span-6 relative">
              <div className="relative h-[220px] xs:h-[260px] sm:h-[400px] lg:h-[420px] w-full rounded-[10px] sm:rounded-[8px] overflow-hidden border border-[#e5e5e5] group">
                <Image
                  src={current.image}
                  alt={current.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-black/80 backdrop-blur-md px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full border border-white/15 text-[10px] sm:text-[11px] font-bold text-white flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#53b1ff]" />
                  <span>{current.time}</span>
                </div>

                <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-[#0070d1] px-3 py-0.5 sm:px-3.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-bold text-white">
                  {current.badge}
                </div>
              </div>
            </div>

            {/* Content Details */}
            <div className="lg:col-span-6 space-y-3 sm:space-y-4">
              <span className="text-[11px] sm:text-xs uppercase tracking-[1.5px] text-[#0070d1] font-bold block">
                {current.tag}
              </span>
              <h3 className="font-serif text-xl xs:text-2xl sm:text-3xl lg:text-4xl text-[#000000] font-normal leading-tight">
                {current.title}
              </h3>
              <p className="text-xs sm:text-sm md:text-base text-[rgba(0,0,0,0.65)] font-normal leading-relaxed">
                {current.desc}
              </p>

              {/* Highlights List */}
              <div className="pt-2">
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-2.5">
                  {current.highlights.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-neutral-800">
                      <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0070d1] shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons: 44px+ touch targets */}
              <div className="pt-3 sm:pt-4 flex flex-col xs:flex-row items-stretch xs:items-center gap-3">
                <Link
                  href="/dining"
                  className="inline-flex items-center justify-center gap-2 bg-[#0070d1] hover:bg-[#0064b7] active:bg-[#004d8d] text-white text-xs sm:text-sm font-bold px-6 h-11 xs:h-12 rounded-full transition-colors cursor-pointer"
                >
                  <span>Xem thực đơn & bảng giá</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="tel:0939014234"
                  className="inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-bold text-neutral-700 hover:text-[#0070d1] px-4 h-11 xs:h-12 transition-colors border border-neutral-300 xs:border-transparent rounded-full"
                >
                  <Phone className="w-3.5 h-3.5 text-[#0070d1]" />
                  <span>Đặt tiệc: 0939 014 234</span>
                </a>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </SectionStack>
  );
}
