"use client";

import React from "react";
import Image from "next/image";
import { Flame, BookOpen, Smile, Compass } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "./MotionWrapper";

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
    <section id="experiences" className="py-16 sm:py-24 bg-white border-b border-[#ece7dd] overflow-hidden scroll-mt-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <FadeIn direction="up">
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-[#367156] font-semibold block mb-1.5 sm:mb-2">
              Trải nghiệm
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl text-[#222222] font-normal mb-3 sm:mb-4">
              Lưu giữ những khoảnh khắc đáng nhớ
            </h2>
            <div className="flex items-center justify-center gap-2.5 mx-auto mb-4 sm:mb-5">
              <span className="w-10 sm:w-14 h-px bg-gradient-to-r from-transparent to-[#367156]/50" />
              <span className="text-[10px] text-[#367156] select-none">◆</span>
              <span className="w-10 sm:w-14 h-px bg-gradient-to-l from-transparent to-[#367156]/50" />
            </div>
            <p className="font-sans text-xs sm:text-sm text-[#666666] font-light leading-relaxed">
              Phòng nghỉ với đầy đủ tiện nghi, lounge thư giãn đọc sách, vẽ tranh, sảnh làm việc với nhạc nhẹ, hướng ra khu vườn nơi có khu vui chơi cho bé, bạn cũng có thể đốt lửa trại hoặc tổ chức một tiệc BBQ cùng bạn bè tại đây!
            </p>
          </FadeIn>
        </div>

        {/* Feature Banner & Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
          {/* Main Photo BBQ */}
          <div className="lg:col-span-7">
            <FadeIn direction="right" duration={0.8}>
              <div className="relative h-64 sm:h-96 rounded-md overflow-hidden shadow-lg group">
                <Image
                  src="/images/BBQ.jpg"
                  alt="Tiệc BBQ ngoài trời tại M_Dalats Villa"
                  fill
                  className="object-cover group-hover:scale-103 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex items-end p-5 sm:p-6">
                  <div className="text-white">
                    <span className="text-[10px] uppercase tracking-widest text-[#faf7f1]/80 block font-light">
                      Sân vườn & Bếp BBQ
                    </span>
                    <h3 className="font-serif text-xl sm:text-3xl font-medium mt-1">
                      Ấm áp tiệc nướng giữa tiết trời se lạnh
                    </h3>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Experience Grid Stagger */}
          <div className="lg:col-span-5">
            <StaggerContainer staggerChildren={0.1} className="grid grid-cols-1 gap-3.5">
              {experiences.map((exp, idx) => {
                const Icon = exp.icon;
                return (
                  <StaggerItem key={idx}>
                    <div className="p-4 rounded-md bg-[#faf7f1] border border-[#ece7dd] hover:border-[#367156] hover:shadow-xs transition-all flex items-start gap-3.5 group">
                      <div className="w-9 h-9 rounded-full bg-white text-[#367156] flex items-center justify-center flex-shrink-0 shadow-xs group-hover:scale-110 transition-transform">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-serif text-base sm:text-lg text-[#222222] font-medium leading-snug group-hover:text-[#367156] transition-colors">
                          {exp.title}
                        </h4>
                        <p className="text-[11px] sm:text-xs text-[#666666] font-light mt-0.5 leading-relaxed">
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
      </div>
    </section>
  );
}
