"use client";

import React from "react";
import { BadgePercent, ShieldCheck, DollarSign, ArrowRight } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "./MotionWrapper";

interface BookingPerksSectionProps {
  onOpenBookingModal: () => void;
}

export function BookingPerksSection({ onOpenBookingModal }: BookingPerksSectionProps) {
  const perks = [
    {
      title: "Giá phòng tốt nhất",
      desc: "Cam kết giá gốc trực tiếp từ villa, không qua trung gian, tặng kèm ưu đãi chào đón độc quyền.",
      icon: DollarSign,
    },
    {
      title: "Chương trình khuyến mãi",
      desc: "Luôn có chính sách giảm giá cho khách lưu trú dài ngày hoặc đặt trước từ 7 ngày trở lên.",
      icon: BadgePercent,
    },
    {
      title: "Không phí dịch vụ",
      desc: "Minh bạch 100%, không phát sinh bất kỳ khoản phụ phí ẩn nào khi nhận phòng tại villa.",
      icon: ShieldCheck,
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-[#faf7f1] overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <FadeIn direction="up">
          <div className="bg-white rounded-lg p-6 sm:p-12 border border-[#ece7dd] shadow-sm text-center">
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-[#367156] font-semibold block mb-1.5 sm:mb-2">
              Đặt phòng trực tiếp
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-[#222222] font-normal mb-3 sm:mb-4">
              Bạn có hẹn với Đà Lạt? Hãy bắt đầu ở M_Dalats Villa!
            </h2>
            <div className="flex items-center justify-center gap-2.5 mx-auto mb-4 sm:mb-5">
              <span className="w-10 sm:w-14 h-px bg-gradient-to-r from-transparent to-[#367156]/50" />
              <span className="text-[10px] text-[#367156] select-none">◆</span>
              <span className="w-10 sm:w-14 h-px bg-gradient-to-l from-transparent to-[#367156]/50" />
            </div>
            <p className="font-sans text-xs sm:text-sm text-[#666666] font-light max-w-xl mx-auto mb-8 sm:mb-12 leading-relaxed">
              Đặt phòng trực tiếp tại website để nhận được sự chăm sóc chu đáo nhất từ đội ngũ M_Dalats Boutique Villa.
            </p>

            {/* 3 Pillars Stagger */}
            <StaggerContainer staggerChildren={0.1} className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 text-left mb-8 sm:mb-10">
              {perks.map((perk, i) => {
                const Icon = perk.icon;
                return (
                  <StaggerItem key={i}>
                    <div className="p-5 rounded-md bg-[#faf7f1] border border-[#ece7dd] hover:border-[#367156] hover:bg-white transition-all h-full group">
                      <div className="w-10 h-10 rounded-full bg-white text-[#367156] flex items-center justify-center mb-3 shadow-xs group-hover:scale-110 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h4 className="font-serif text-lg sm:text-xl text-[#222222] font-medium mb-1.5 group-hover:text-[#367156] transition-colors">
                        {perk.title}
                      </h4>
                      <p className="text-xs text-[#666666] font-light leading-relaxed">
                        {perk.desc}
                      </p>
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>

            <button
              type="button"
              onClick={onOpenBookingModal}
              className="inline-flex items-center gap-2 bg-[#f27052] hover:bg-[#e05c3c] text-white px-6 sm:px-8 py-3 rounded-sm text-xs uppercase tracking-[0.15em] font-medium shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              <span>Đặt phòng trực tiếp ngay</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
