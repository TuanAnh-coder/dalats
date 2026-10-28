"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { FadeIn, motion, AnimatePresence, SectionStack } from "./MotionWrapper";

interface Review {
  id: number;
  quote: string;
  author: string;
  title: string;
  location: string;
  rating: number;
  date: string;
  channel: string;
}

const REVIEWS: Review[] = [
  {
    id: 1,
    quote:
      "Some places are so good to stay in, you don’t want to generate a rush on them. M_Dalats Boutique Villa in Da Lat is truly one of them. A poetic retreat nestled in the pines.",
    author: "Quân Nguyễn",
    title: "Kiến trúc sư • Cố vấn thiết kế nghỉ dưỡng",
    location: "TP. Hồ Chí Minh",
    rating: 5,
    date: "Tháng 09/2026",
    channel: "Agoda Verified",
  },
  {
    id: 2,
    quote:
      "Une atmosphère magique qui rappelle les hôtels de charme parisiens avec la douceur poétique de Da Lat. Le café au lever du soleil sur le balcon est inoubliable.",
    author: "Camille Laurent",
    title: "Travel Writer & Food Critic",
    location: "Paris, France",
    rating: 5,
    date: "Tháng 10/2026",
    channel: "Booking.com Review",
  },
  {
    id: 3,
    quote:
      "Kỳ nghỉ tuyệt vời nhất của gia đình mình ở Đà Lạt. Căn phòng thơm mùi gỗ thông, bữa sáng nóng hổi thơm ngon và bạn quản gia vô cùng chu đáo, ấm áp.",
    author: "Trần Bảo Ngọc",
    title: "Nhiếp ảnh gia & Blogger du lịch",
    location: "Hà Nội",
    rating: 5,
    date: "Tháng 10/2026",
    channel: "Direct Guest",
  },
];

export function TestimonialSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % REVIEWS.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  const activeReview = REVIEWS[current]!;

  return (
    <SectionStack index={90} fullHeight={true} sticky={true} dark className="py-16 md:py-0 pt-20 md:pt-24 md:pb-8 bg-[#000000] text-white relative overflow-hidden w-full max-w-full border-b border-white/10">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full min-w-0">
        <div className="max-w-3xl mx-auto text-center">
          <FadeIn direction="up">
            {/* Header Pill */}
            <div className="inline-flex items-center gap-2 bg-[#181818] border border-white/15 px-4 py-1.5 rounded-full text-[11px] uppercase tracking-[1.4px] text-white font-bold mb-6">
              <span>Le Livre d&apos;Or • Cảm Nhận Từ Quý Khách</span>
            </div>

            {/* 5-star rating in Gold */}
            <div className="flex items-center justify-center gap-1.5 text-[#ffce21] mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#ffce21] text-[#ffce21]" />
              ))}
            </div>

            <div className="relative min-h-[160px] sm:min-h-[140px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeReview.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="space-y-4"
                >
                  <blockquote className="text-xl sm:text-2xl md:text-3xl font-light italic leading-relaxed text-neutral-200">
                    “{activeReview.quote}”
                  </blockquote>

                  <div className="pt-2 flex flex-col items-center">
                    <span className="text-xs sm:text-sm uppercase font-bold text-[#53b1ff]">
                      {activeReview.author} • {activeReview.location}
                    </span>
                    <span className="text-[11px] sm:text-xs text-neutral-400 font-normal mt-0.5">
                      {activeReview.title} ({activeReview.channel})
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* PlayStation pagination-dot: 8px circle */}
            <div className="flex items-center justify-center gap-2.5 mt-8">
              {REVIEWS.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrent(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                    current === idx ? "bg-white scale-125" : "bg-white/20 hover:bg-white/40"
                  }`}
                  aria-label={`Review ${idx + 1}`}
                />
              ))}
            </div>
          </FadeIn>

          {/* Awards Badges & Ratings Summary */}
          <FadeIn direction="up" delay={0.2}>
            <div className="mt-12 sm:mt-16 pt-8 sm:pt-10 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 sm:gap-10">
              <div className="flex items-center gap-3 bg-[#181818] border border-white/10 px-5 py-2.5 rounded-[8px]">
                <span className="text-2xl font-light text-[#53b1ff]">9.6</span>
                <div className="text-left text-[10px] text-neutral-400 leading-tight">
                  <span className="font-bold text-white block uppercase tracking-wider">Xuất Sắc</span>
                  <span>Agoda Review Awards</span>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-[#181818] border border-white/10 px-5 py-2.5 rounded-[8px]">
                <span className="text-2xl font-light text-[#ffce21]">4.9★</span>
                <div className="text-left text-[10px] text-neutral-400 leading-tight">
                  <span className="font-bold text-white block uppercase tracking-wider">Traveller Review</span>
                  <span>Booking.com & Google</span>
                </div>
              </div>

              <div className="relative w-28 sm:w-32 h-10 sm:h-12 grayscale hover:grayscale-0 transition-all opacity-85 hover:opacity-100 duration-300">
                <Image
                  src="/images/tripadvisor_badge.png"
                  alt="TripAdvisor Travelers Choice"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </SectionStack>
  );
}
