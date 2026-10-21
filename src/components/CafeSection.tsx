"use client";

import React from "react";
import Image from "next/image";
import { Coffee, Music2, Eye, Compass } from "lucide-react";
import { FadeIn } from "./MotionWrapper";

export function CafeSection() {
  return (
    <section className="py-16 sm:py-20 bg-[#faf7f1] overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <FadeIn direction="up">
          <div className="bg-white rounded-md p-6 sm:p-10 lg:p-12 border border-[#ece7dd] shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-[#367156] font-semibold block mb-1.5 sm:mb-2">
                Ngày 4 Mùa Café
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#222222] font-normal mb-3 sm:mb-4">
                Không gian thưởng thức café thoáng đãng
              </h2>
              <div className="flex items-center gap-2 mb-4 sm:mb-5">
                <span className="w-12 h-px bg-[#367156]/50" />
                <span className="text-[10px] text-[#367156] select-none">◆</span>
              </div>

              <p className="font-sans text-xs sm:text-sm md:text-base text-[#555555] font-light leading-relaxed mb-6">
                Không cần đi đâu xa, bạn có thể thả bước dạo quanh khu vườn, dừng chân ngay quán café nhỏ ngay góc sân. Nơi đây bạn vừa có thể thưởng thức ly café thơm lừng cùng người thân, nghe chút nhạc nhẹ, đọc sách hay ngắm các bé vui chơi, xa xa là những mái nhà phố núi nhấp nhô trong sương sớm.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#444444]">
                <div className="flex items-center gap-2">
                  <Coffee className="w-4 h-4 text-[#367156] flex-shrink-0" />
                  <span>Pha chế thủ công nguyên chất</span>
                </div>
                <div className="flex items-center gap-2">
                  <Music2 className="w-4 h-4 text-[#367156] flex-shrink-0" />
                  <span>Âm nhạc mộc mạc thư thái</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-[#367156] flex-shrink-0" />
                  <span>View ngắm thung lũng & nhà kính</span>
                </div>
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#367156] flex-shrink-0" />
                  <span>Mở cửa đón khách từ 7:00 - 21:00</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative h-60 sm:h-72 lg:h-80 w-full rounded-md overflow-hidden shadow-md group">
              <Image
                src="/images/DSCF1106-1024x683.jpg"
                alt="Góc cafe sân vườn M_Dalats"
                fill
                className="object-cover group-hover:scale-104 transition-transform duration-700"
              />
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
