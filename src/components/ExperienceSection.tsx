"use client";

import React from "react";
import Image from "next/image";
import { Flame, BookOpen, Smile, Compass, Crown, Sparkles, Check } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem, SectionStack } from "./MotionWrapper";
import { Button } from "~/components/ui/button";

export function ExperienceSection() {
  const experiences = [
    {
      title: "Tiệc nướng BBQ sân vườn",
      desc: "Tận hưởng làn gió mát lành cùng lò than hoa hồng rực, thưởng thức thịt nướng nóng hổi và rượu vang Đà Lạt bên người thân.",
      icon: Flame,
    },
    {
      title: "Đốt lửa trại đêm sương",
      desc: "Quây quần bên ánh lửa bập bùng, cùng nướng khoai bắp thơm lừng và ngân nga những câu chuyện ấm áp dưới bầu trời ngập sao.",
      icon: Compass,
    },
    {
      title: "Lounge đọc sách & vẽ tranh",
      desc: "Không gian làm việc tĩnh lặng với giai điệu acoustic nhẹ nhàng, giá sách chọn lọc và khung cửa sổ hướng thẳng ra đồi thông.",
      icon: BookOpen,
    },
    {
      title: "Khu vui chơi trẻ em & bãi cỏ",
      desc: "Bãi cỏ xanh mướt an toàn để các bé thỏa thích chạy nhảy, hòa mình với thiên nhiên cây cỏ và hít thở bầu không khí tinh khiết.",
      icon: Smile,
    },
  ];

  return (
    /* Chapter 5: Full-bleed Dark Canvas Band (#121314 / #000000) */
    <SectionStack id="experiences" index={70} fullHeight={true} sticky={true} dark className="py-16 md:py-0 pt-20 md:pt-24 md:pb-8 bg-[#000000] text-white border-b border-white/10 overflow-hidden scroll-mt-24">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Header: PlayStation SST 300 Light */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
          <FadeIn direction="up">
            <span className="text-[12px] uppercase tracking-[1.5px] text-[#53b1ff] font-bold block mb-2">
              Experiences • Trải Nghiệm Độc Bản
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl text-white font-light tracking-tight mb-3 sm:mb-4">
              Lưu giữ những khoảnh khắc đáng nhớ
            </h2>
            <p className="text-sm sm:text-base text-neutral-400 font-normal leading-relaxed">
              Phòng nghỉ tiện nghi, lounge thư giãn đọc sách và vẽ tranh, không gian cà phê mở cùng khu vườn rộng sẵn sàng cho tiệc BBQ và lửa trại đêm sương.
            </p>
          </FadeIn>
        </div>

        {/* Feature Banner & Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center mb-12">
          {/* Main Photo BBQ (8px radius) */}
          <div className="lg:col-span-7">
            <FadeIn direction="right" duration={0.8}>
              <div className="relative h-72 sm:h-[420px] rounded-[8px] overflow-hidden border border-white/10 group">
                <Image
                  src="/images/BBQ.jpg"
                  alt="Tiệc BBQ ngoài trời tại M_Dalats Villa"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent flex items-end p-6 sm:p-8">
                  <div className="text-white">
                    <span className="text-xs uppercase tracking-[1.5px] text-[#53b1ff] block font-bold mb-1">
                      Sân Vườn & Lò Than Hồng
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-light leading-tight">
                      Ấm áp tiệc nướng giữa tiết trời se lạnh 15°C
                    </h3>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Experience Grid Stagger: PlayStation product-card-dark */}
          <div className="lg:col-span-5">
            <StaggerContainer staggerChildren={0.1} className="grid grid-cols-1 gap-3.5">
              {experiences.map((exp, idx) => {
                const Icon = exp.icon;
                return (
                  <StaggerItem key={idx}>
                    <div className="p-4 sm:p-5 rounded-[8px] bg-[#181818] border border-white/10 hover:border-white/20 transition-all flex items-start gap-4 group">
                      <div className="w-10 h-10 rounded-full bg-[#0070d1]/15 text-[#53b1ff] flex items-center justify-center shrink-0 group-hover:bg-[#0070d1] group-hover:text-white transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-base sm:text-lg text-white font-medium leading-snug group-hover:text-[#53b1ff] transition-colors">
                          {exp.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed mt-1 font-normal">
                          {exp.desc}
                        </p>
                      </div>
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </div>
        </div>

        {/* Signature PlayStation Plus Gold Tier Callout Banner (ps-plus-banner spec) */}
        <FadeIn direction="up">
          <div className="relative rounded-[8px] bg-[#121314] border border-white/15 overflow-hidden p-6 sm:p-10">
            {/* Horizontal Gold Gradient Accent Bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#ffce21] via-[#f5a623] to-[#ee8e00]" />

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-[#ffce21] via-[#f5a623] to-[#ee8e00] text-black text-xs font-bold uppercase tracking-wider">
                  <Crown className="w-3.5 h-3.5" />
                  <span>Concierge Privé • Dịch Vụ Quản Gia 24/7</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
                  Trải nghiệm đặc quyền nghỉ dưỡng đẳng cấp
                </h3>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  Quản gia riêng hỗ trợ setup tiệc nướng BBQ gia đình, tour săn mây đồi chè Cầu Đất, đón tiễn sân bay Liên Khương và thiết kế hành trình khám phá Đà Lạt theo sở thích cá nhân.
                </p>
                <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-neutral-300">
                  <span className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-[#ffce21]" /> Quản gia chuyên biệt
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-[#ffce21]" /> Hỗ trợ 24/7
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-[#ffce21]" /> Thiết kế riêng
                  </span>
                </div>
              </div>

              <div className="shrink-0 flex flex-wrap items-center gap-3">
                <Button
                  variant="default"
                  onClick={() => {
                    const elem = document.getElementById("rooms");
                    if (elem) elem.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="bg-[#0070d1] hover:bg-[#0064b7] text-white rounded-full font-bold px-7 h-12 shadow-none cursor-pointer"
                >
                  <span>Đặt phòng & trải nghiệm</span>
                </Button>
                <a
                  href="tel:0939014234"
                  className="inline-flex items-center justify-center border border-white/20 text-white hover:bg-white/10 rounded-full font-bold px-7 h-12 text-sm transition-colors"
                >
                  Hotline Concierge
                </a>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </SectionStack>
  );
}
