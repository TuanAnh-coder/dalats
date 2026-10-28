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
    <SectionStack id="story" index={20} fullHeight={true} sticky={true} className="py-12 xs:py-16 md:py-0 pt-16 md:pt-24 md:pb-8 bg-[#ffffff] text-[#000000] overflow-hidden scroll-mt-20">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-14 items-center">
          {/* Photo Showcase Left */}
          <div ref={collageRef} className="lg:col-span-6 relative">
            <FadeIn direction="right" duration={0.8}>
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Photo */}
                <div className="relative h-[240px] xs:h-[280px] sm:h-[360px] md:h-[400px] w-full rounded-2xl overflow-hidden border border-[#f0f0f0] shadow-sm">
                  <Image
                    src="/images/DH_01328_2-pgvj0qxon4n8u4tqnzxuo0cafocg3jtjqw7qfalgc0.jpg"
                    alt="Không gian kiến trúc M_Dalats Villa"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  
                  {/* Floating Caption on Mobile */}
                  <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] xs:text-xs text-white/90 border border-white/20">
                    Triền đồi Khe Sanh • Đà Lạt
                  </div>
                </div>

                {/* Overlapping Secondary Photo (Hidden on narrow mobile, visible sm+) */}
                <motion.div
                  style={{ y: smallPhotoY }}
                  className="absolute -bottom-5 -right-3 sm:-bottom-8 sm:-right-6 w-36 sm:w-56 h-40 sm:h-64 rounded-xl overflow-hidden border-4 border-white hidden sm:block z-10 shadow-lg"
                >
                  <Image
                    src="/images/DSCF1106-1024x683.jpg"
                    alt="Sân vườn hoa hồng M_Dalats Villa"
                    fill
                    sizes="(max-width: 768px) 30vw, 25vw"
                    className="object-cover"
                  />
                </motion.div>
              </div>
            </FadeIn>
          </div>

          {/* Text Editorial Right Side */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <FadeIn direction="left" delay={0.1}>
              <span className="text-[11px] xs:text-xs font-bold uppercase tracking-[1.5px] text-[#0070d1] block mb-2 sm:mb-3">
                L&apos;Esprit M_Dalats • Câu chuyện kiến trúc
              </span>
            </FadeIn>

            <FadeIn direction="left" delay={0.15}>
              <h2 className="font-serif text-2xl xs:text-3xl sm:text-4xl lg:text-5xl text-neutral-900 font-normal leading-[1.25] tracking-tight mb-3 sm:mb-5">
                Kiến trúc mộc mạc giao hòa cùng rừng thông
              </h2>
            </FadeIn>

            <FadeIn direction="left" delay={0.25}>
              <div className="space-y-3 text-xs xs:text-sm sm:text-base text-neutral-600 font-normal leading-relaxed">
                <p>
                  Lấy cảm hứng từ nét mộc mạc của những boutique villa vùng đồi Tuscany nước Ý, <strong className="font-semibold text-neutral-900">M_Dalats Boutique Villa</strong> được dựng xây như một chốn trú ẩn an yên nép mình bên triền đồi thông cao nguyên Đà Lạt.
                </p>
                <p>
                  Từng bức tường gạch nung ấm áp, khung cửa kính đón trọn sương mai và ban công riêng tư mở ra thung lũng thông reo mang lại sự tĩnh tại, tách biệt hoàn toàn khỏi nhịp sống phố thị ồn ã.
                </p>
              </div>
            </FadeIn>

            {/* Core Values Specs */}
            <FadeIn direction="up" delay={0.35}>
              <div className="grid grid-cols-3 gap-2 xs:gap-3 sm:gap-4 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-[#f0f0f0]">
                <div className="bg-[#fcfaf7] border border-[#f0ede6] rounded-xl p-2.5 xs:p-3 sm:p-4 text-center sm:text-left">
                  <span className="text-xl xs:text-2xl sm:text-3xl font-light text-[#0070d1] font-sans tracking-tight block">
                    11
                  </span>
                  <span className="text-[10px] xs:text-[11px] uppercase tracking-[0.5px] text-neutral-500 font-medium block mt-0.5">
                    Phòng độc bản
                  </span>
                </div>

                <div className="bg-[#fcfaf7] border border-[#f0ede6] rounded-xl p-2.5 xs:p-3 sm:p-4 text-center sm:text-left">
                  <span className="text-xl xs:text-2xl sm:text-3xl font-light text-[#0070d1] font-sans tracking-tight block">
                    100%
                  </span>
                  <span className="text-[10px] xs:text-[11px] uppercase tracking-[0.5px] text-neutral-500 font-medium block mt-0.5">
                    View rừng thông
                  </span>
                </div>

                <div className="bg-[#fcfaf7] border border-[#f0ede6] rounded-xl p-2.5 xs:p-3 sm:p-4 text-center sm:text-left">
                  <span className="text-xl xs:text-2xl sm:text-3xl font-light text-[#0070d1] font-sans tracking-tight block">
                    4.9★
                  </span>
                  <span className="text-[10px] xs:text-[11px] uppercase tracking-[0.5px] text-neutral-500 font-medium block mt-0.5">
                    Đánh giá khách
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
