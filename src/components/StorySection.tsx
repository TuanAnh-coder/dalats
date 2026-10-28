"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { useScroll, useTransform } from "motion/react";
import { FadeIn, motion, SectionStack } from "./MotionWrapper";

export function StorySection() {
  const collageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: collageRef,
    offset: ["start end", "end start"],
  });

  const smallPhotoY = useTransform(scrollYProgress, [0, 1], [25, -25]);

  return (
    /* Chapter 2: Full-bleed True White Canvas Band */
    <SectionStack id="story" className="py-20 sm:py-28 bg-[#ffffff] text-[#000000] overflow-hidden scroll-mt-20">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Photo Showcase Left (Console/Product Style Glamour Shots) */}
          <div ref={collageRef} className="lg:col-span-6 relative">
            <FadeIn direction="right" duration={0.8}>
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Photo (8px radius) */}
                <div className="relative h-[340px] sm:h-[480px] w-full rounded-[8px] overflow-hidden border border-[#f3f3f3] shadow-none">
                  <Image
                    src="/images/DH_01328_2-pgvj0qxon4n8u4tqnzxuo0cafocg3jtjqw7qfalgc0.jpg"
                    alt="Không gian bên trong M_Dalats Villa"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/5" />
                </div>

                {/* Overlapping Secondary Photo with Scroll Parallax */}
                <motion.div
                  style={{ y: smallPhotoY }}
                  className="absolute -bottom-6 -right-3 sm:-bottom-8 sm:-right-6 w-44 sm:w-60 h-48 sm:h-68 rounded-[8px] overflow-hidden border-4 border-white hidden sm:block z-10 shadow-md"
                >
                  <Image
                    src="/images/DSCF1106-1024x683.jpg"
                    alt="Sân vườn M_Dalats Villa"
                    fill
                    className="object-cover"
                  />
                </motion.div>
              </div>
            </FadeIn>
          </div>

          {/* Text Editorial Right Side: PlayStation SST Light 300 Headline */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <FadeIn direction="left" delay={0.1}>
              <span className="text-[12px] font-bold uppercase tracking-[1.5px] text-[#0070d1] block mb-3">
                L&apos;Esprit M_Dalats • Câu chuyện kiến trúc
              </span>
            </FadeIn>

            <FadeIn direction="left" delay={0.2}>
              <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl text-[#000000] font-light leading-[1.2] tracking-tight mb-6">
                Kiến trúc mộc mạc giao hòa cùng rừng thông
              </h2>
            </FadeIn>

            <FadeIn direction="left" delay={0.3}>
              <div className="space-y-4 text-sm sm:text-base text-[rgba(0,0,0,0.65)] font-normal leading-relaxed">
                <p>
                  Lấy cảm hứng từ nét duyên dáng của những boutique hotel cổ điển vùng Tuscany nước Ý, <strong className="font-medium text-[#000000]">M_Dalats Boutique Villa</strong> được dựng xây như một chốn trú ẩn an yên nép mình bên triền đồi thông cao nguyên Đà Lạt.
                </p>
                <p>
                  Từng bức tường gạch nung mộc, khung cửa kính lớn đón trọn sương mai và ban công riêng tư mở ra thung lũng Khe Sanh mang đến một cảm giác tĩnh tại, tách biệt hoàn toàn khỏi nhịp sống phố thị ồn ã.
                </p>
                <p>
                  Tại M_Dalats Villa, chúng tôi chú trọng từng trải nghiệm giác quan: từ tách trà thơm ấm áp bên ban công sớm đến tiệc nướng BBQ ấm cúng trong tiết trời se lạnh 15°C.
                </p>
              </div>
            </FadeIn>

            {/* Core Values Specs (PlayStation surface-card: #f5f7fa cool-blue tinted, 8px radius) */}
            <FadeIn direction="up" delay={0.4}>
              <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-8 pt-6 border-t border-[#f3f3f3]">
                <div className="bg-[#f5f7fa] border border-[#f3f3f3] rounded-[8px] p-3 sm:p-4 text-center sm:text-left">
                  <span className="text-2xl sm:text-3xl font-light text-[#0070d1] font-sans tracking-tight block">
                    11
                  </span>
                  <span className="text-[11px] uppercase tracking-[1px] text-[#6b6b6b] font-medium block mt-1">
                    Phòng nghỉ độc bản
                  </span>
                </div>

                <div className="bg-[#f5f7fa] border border-[#f3f3f3] rounded-[8px] p-3 sm:p-4 text-center sm:text-left">
                  <span className="text-2xl sm:text-3xl font-light text-[#0070d1] font-sans tracking-tight block">
                    100%
                  </span>
                  <span className="text-[11px] uppercase tracking-[1px] text-[#6b6b6b] font-medium block mt-1">
                    View rừng thông
                  </span>
                </div>

                <div className="bg-[#f5f7fa] border border-[#f3f3f3] rounded-[8px] p-3 sm:p-4 text-center sm:text-left">
                  <span className="text-2xl sm:text-3xl font-light text-[#0070d1] font-sans tracking-tight block">
                    4.9★
                  </span>
                  <span className="text-[11px] uppercase tracking-[1px] text-[#6b6b6b] font-medium block mt-1">
                    Đánh giá từ khách
                  </span>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </SectionStack>
  );
}
