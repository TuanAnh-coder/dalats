"use client";

import React from "react";
import { DollarSign, Coffee, ShieldCheck, Clock, ArrowRight } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem, SectionStack } from "./MotionWrapper";
import { Button } from "~/components/ui/button";

interface BookingPerksSectionProps {
  onOpenBookingModal: () => void;
}

export function BookingPerksSection({ onOpenBookingModal }: BookingPerksSectionProps) {
  const perks = [
    {
      title: "Giá tốt nhất trực tiếp",
      subtitle: "Meilleur Tarif Garanti",
      desc: "Cam kết giá trực tiếp từ biệt thự, không phụ phí trung gian và luôn tặng kèm ưu đãi chào đón độc quyền.",
      icon: DollarSign,
    },
    {
      title: "Bao gồm điểm tâm sáng",
      subtitle: "Petit-déjeuner Offert",
      desc: "Thưởng thức bữa sáng thơm lành chế biến từ nông sản hữu cơ Đà Lạt và cà phê nguyên chất mỗi sớm.",
      icon: Coffee,
    },
    {
      title: "Chính sách linh hoạt",
      subtitle: "Annulation Sans Frais",
      desc: "Chính sách hỗ trợ đổi ngày và quản lý đơn đặt phòng nhanh chóng, an tâm cho chuyến nghỉ dưỡng.",
      icon: ShieldCheck,
    },
    {
      title: "Ưu tiên nhận phòng sớm",
      subtitle: "Arrivée Anticipée",
      desc: "Hỗ trợ nhận phòng sớm và giữ hành lý an toàn miễn phí (tùy thuộc vào tình trạng phòng sẵn có).",
      icon: Clock,
    },
  ];

  return (
    /* Chapter 7: Signature Full-Bleed PlayStation Blue Action Band (hero-band-blue #0070d1) */
    <SectionStack index={100} fullHeight={true} sticky={true} className="section-stack-blue py-16 md:py-0 pt-20 md:pt-24 md:pb-8 bg-[#0070d1] text-white overflow-hidden w-full max-w-full">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
        <FadeIn direction="up">
          <span className="text-[12px] uppercase tracking-[2px] text-white/80 font-bold block mb-2">
            Exclusive Privileges • Đặc Quyền Đặt Trực Tiếp
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl text-white font-light tracking-tight mb-3 leading-tight">
            Khởi đầu kỳ nghỉ đáng nhớ cùng M_Dalats Villa
          </h2>
          <p className="text-sm sm:text-base text-white/85 font-normal max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed">
            Đặt phòng trực tiếp trên website chính thức để nhận trọn vẹn dịch vụ Concierge tận tâm và những đặc quyền riêng tư cao cấp nhất.
          </p>

          {/* 4 Pillars Stagger (PlayStation In-Band Dark Cards: #121314, 8px radius) */}
          <StaggerContainer staggerChildren={0.06} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 text-left mb-6 sm:mb-8">
            {perks.map((perk, i) => {
              const Icon = perk.icon;
              return (
                <StaggerItem key={i}>
                  <div className="p-5 sm:p-6 rounded-[8px] bg-[#000000]/30 backdrop-blur-md border border-white/20 hover:border-white/40 transition-all h-full group flex flex-col justify-between">
                    <div>
                      <div className="w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h4 className="text-base sm:text-lg text-white font-medium mb-0.5">
                        {perk.title}
                      </h4>
                      <span className="text-[11px] uppercase tracking-[1px] text-white/70 font-normal block mb-2">
                        {perk.subtitle}
                      </span>
                      <p className="text-xs sm:text-sm text-white/80 font-normal leading-relaxed">
                        {perk.desc}
                      </p>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>

          {/* Signature Pure White Button on PlayStation Blue Band */}
          <Button
            type="button"
            size="lg"
            onClick={onOpenBookingModal}
            className="gap-2 bg-white hover:bg-neutral-100 text-[#0070d1] rounded-full font-bold text-sm sm:text-base h-12 px-9 shadow-none transition-colors cursor-pointer"
          >
            <span>Đặt phòng trực tiếp ngay</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </FadeIn>
      </div>
    </SectionStack>
  );
}
