"use client";

import React from "react";
import Image from "next/image";
import { FadeIn, motion, Counter } from "./MotionWrapper";

export function StorySection() {
  return (
    <section id="story" className="py-16 sm:py-24 bg-white border-y border-[#ece7dd] overflow-hidden scroll-mt-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Photo Collage Left Side */}
          <div className="lg:col-span-6 relative">
            <FadeIn direction="right" duration={0.8}>
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Photo */}
                <div className="relative h-[320px] sm:h-[440px] w-full rounded-sm overflow-hidden shadow-lg border-4 border-[#faf7f1]">
                  <Image
                    src="/images/DH_01328_2-pgvj0qxon4n8u4tqnzxuo0cafocg3jtjqw7qfalgc0.jpg"
                    alt="Không gian bên trong M_Dalats Villa"
                    fill
                    className="object-cover hover:scale-103 transition-transform duration-700"
                  />
                </div>

                {/* Overlapping Small Photo */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                  className="absolute -bottom-6 -right-3 sm:-bottom-8 sm:-right-6 w-36 sm:w-52 h-40 sm:h-60 rounded-sm overflow-hidden shadow-2xl border-4 border-white hidden sm:block"
                >
                  <Image
                    src="/images/DSCF1106-1024x683.jpg"
                    alt="Sân vườn M_Dalats Villa"
                    fill
                    className="object-cover"
                  />
                </motion.div>

                {/* Floating Pine Decorative Icon */}
                <motion.div
                  animate={{ y: [0, -8, 0], rotate: [0, 2, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-5 -left-4 sm:-top-6 sm:-left-6 w-12 h-12 sm:w-16 sm:h-16 bg-[#faf7f1] border border-[#ece7dd] rounded-full p-2.5 sm:p-3 shadow-md flex items-center justify-center z-10"
                >
                  <div className="relative w-full h-full">
                    <Image
                      src="/images/LE_Pine.png"
                      alt="Pine tree icon"
                      fill
                      className="object-contain"
                    />
                  </div>
                </motion.div>
              </div>
            </FadeIn>
          </div>

          {/* Text Story Right Side */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <FadeIn direction="left" delay={0.1}>
              <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-[#367156] mb-2 sm:mb-3">
                <span className="w-6 sm:w-8 h-px bg-[#367156]/50" />
                <span className="text-[8px] text-[#367156] select-none">◆</span>
                <span>Câu chuyện M_Dalats Villa</span>
              </div>
            </FadeIn>

            <FadeIn direction="left" delay={0.2}>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#222222] font-normal leading-tight mb-4 sm:mb-6">
                Câu chuyện về một Đà Lạt thu nhỏ
              </h2>
            </FadeIn>

            <FadeIn direction="left" delay={0.3}>
              <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm md:text-base text-[#555555] font-light leading-relaxed">
                <p>
                  Giữa Đà Lạt đầy thơ mộng, <strong className="font-medium text-[#367156]">M_Dalats Boutique Villa</strong> mang lại chút nét Châu Âu vừa cổ điển, vừa hiện đại, vừa ấm áp, vừa nhẹ nhàng thanh lịch. Chút cảm nhận về một Đà Lạt xưa cũ – Đà Lạt của những con dốc thoai thoải, những ngôi biệt thự cổ kính trong sương, và của những con người nồng hậu mến khách.
                </p>
                <p>
                  Lấy cảm hứng từ nét kiến trúc vùng nông thôn Tuscany nước Ý, từng góc nhỏ tại M_Dalats Villa đều được thổi vào hồn thơ: bức tường gạch nung ấm áp, khung cửa vòm đón nắng mai, và khu vườn hoa thơm ngát rộn tiếng chim ca mỗi sớm.
                </p>
                <p>
                  Đến với M_Dalats Villa, bạn không chỉ tìm một nơi để dừng chân, mà còn tìm về một chốn bình yên để lắng nghe nhịp thở của chính mình, cùng người thương lưu giữ những khoảnh khắc trọn vẹn nhất.
                </p>
              </div>
            </FadeIn>

            {/* Core Values Stats */}
            <FadeIn direction="up" delay={0.4}>
              <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-[#ece7dd]">
                <div className="flex flex-col">
                  <span className="font-display text-2xl sm:text-4xl text-[#367156] font-semibold leading-none">
                    <Counter to={11} suffix=" Phòng" />
                  </span>
                  <span className="text-[10px] sm:text-xs text-[#777777] mt-1 font-sans">Mỗi phòng một nét riêng</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-display text-2xl sm:text-4xl text-[#367156] font-semibold leading-none">Tuscany</span>
                  <span className="text-[10px] sm:text-xs text-[#777777] mt-1 font-sans">Kiến trúc Ý tinh tế</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-display text-2xl sm:text-4xl text-[#367156] font-semibold leading-none">
                    <Counter to={100} suffix="%" />
                  </span>
                  <span className="text-[10px] sm:text-xs text-[#777777] mt-1 font-sans">Tận tâm phục vụ</span>
                </div>
              </div>

              <p className="font-script text-xl sm:text-2xl text-[#F4A261] mt-4 font-normal">
                “Đà Lạt - Nơi cảm xúc thăng hoa và lắng đọng”
              </p>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
