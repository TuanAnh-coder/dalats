"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import {
  Bed,
  CalendarCheck,
  QrCode,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Coffee,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem, SectionStack } from "./MotionWrapper";
import { Button } from "~/components/ui/button";

interface HowItWorksSectionProps {
  onOpenBookingModal?: () => void;
}

export function HowItWorksSection({ onOpenBookingModal }: HowItWorksSectionProps) {
  const [activeStep, setActiveStep] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const steps = [
    {
      step: "01",
      title: "Khám Phá & Chọn Phòng",
      subtitle: "100% hình ảnh thực tế",
      description:
        "Tự do lựa chọn trong 11 phòng nghỉ boutique riêng tư với đa dạng tầm nhìn: view rừng thông, ban công đón nắng hoặc tầng áp mái lãng mạn.",
      icon: Bed,
      badge: "Đa dạng không gian",
    },
    {
      step: "02",
      title: "Lịch & Bảng Giá Minh Bạch",
      subtitle: "Không phí ẩn, bao gồm bữa sáng",
      description:
        "Xem lịch trống cập nhật theo thời gian thực. Giá hiển thị chính xác theo từng đêm, đã gồm bữa sáng và trà/cà phê chào đón.",
      icon: CalendarCheck,
      badge: "Giá gốc trực tiếp",
    },
    {
      step: "03",
      title: "Xác Nhận Đặt Tức Thì",
      subtitle: "VietQR hoặc Thanh toán tại quầy",
      description:
        "Hệ thống gửi mã đặt phòng tự động chỉ sau vài giây. Hỗ trợ quét mã VietQR tự động nhận tiền hoặc thanh toán linh hoạt khi check-in.",
      icon: QrCode,
      badge: "Bảo mật & Tự động",
    },
    {
      step: "04",
      title: "Nhận Phòng & Nghỉ Dưỡng",
      subtitle: "Lễ tân & Quản gia 24/7",
      description:
        "Check-in thảnh thơi với sự hỗ trợ của đội ngũ lễ tân 24/7, giữ hành lý miễn phí và tận hưởng trọn vẹn khí hậu mát lành của Đà Lạt.",
      icon: Coffee,
      badge: "Trọn vẹn kỳ nghỉ",
    },
  ];

  const handleScrollToStep = (index: number) => {
    setActiveStep(index);
    if (scrollRef.current) {
      const cards = scrollRef.current.querySelectorAll<HTMLElement>(".step-card-snap");
      if (cards[index]) {
        cards[index].scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      }
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const scrollPos = el.scrollLeft;
    const cardWidth = el.offsetWidth * 0.78;
    const newIndex = Math.min(steps.length - 1, Math.max(0, Math.round(scrollPos / cardWidth)));
    if (newIndex !== activeStep) {
      setActiveStep(newIndex);
    }
  };

  return (
    <SectionStack
      id="how-it-works"
      index={30}
      fullHeight={true}
      sticky={true}
      className="bg-[#ffffff] text-[#000000] border-b border-[#e5e5e5] overflow-hidden scroll-mt-20"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Editorial Header */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8 md:mb-10">
          <FadeIn direction="up">
            <span className="text-[11px] sm:text-xs uppercase tracking-[2px] text-[#0070d1] font-bold block mb-2">
              Quy Trình Đặt Phòng Tinh Gọn • How It Works
            </span>
            <h2 className="font-serif text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-normal text-[#000000] tracking-tight leading-[1.2]">
              4 Bước Để Bắt Đầu Kỳ Nghỉ An Yên
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-[#000000]/70 font-normal leading-relaxed mt-2 max-w-2xl mx-auto">
              Trải nghiệm đặt phòng trực tiếp nhanh chóng, minh bạch và an tâm tuyệt đối trước chuyến đi đến Đà Lạt.
            </p>
          </FadeIn>
        </div>

        {/* Mobile Horizontal Carousel / Desktop 4-Col Grid */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5 overflow-x-auto no-scrollbar snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0 mb-4 sm:mb-8 pb-2 sm:pb-0"
        >
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="step-card-snap w-[82vw] xs:w-[76vw] sm:w-auto shrink-0 snap-center group relative bg-[#f5f7fa] hover:bg-[#eef2f7] p-5 xs:p-6 sm:p-7 rounded-[12px] sm:rounded-[8px] border border-[#e5e5e5] hover:border-[#0070d1]/30 transition-all duration-300 flex flex-col justify-between h-full shadow-xs sm:shadow-none"
              >
                <div>
                  {/* Top Row: Step Number & Icon */}
                  <div className="flex items-center justify-between mb-4 sm:mb-5">
                    <span className="font-mono text-2xl sm:text-3xl font-light text-[#0070d1] tracking-tight">
                      {item.step}
                    </span>
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white text-[#0070d1] border border-[#e5e5e5] flex items-center justify-center shadow-xs group-hover:bg-[#0070d1] group-hover:text-white transition-colors duration-300">
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                  </div>

                  {/* Step Title & Subtitle */}
                  <h3 className="font-serif text-lg sm:text-xl font-normal text-[#000000] tracking-tight group-hover:text-[#0070d1] transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.8px] text-[#0070d1] mt-1 mb-2.5">
                    {item.subtitle}
                  </p>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-[#000000]/70 leading-relaxed font-light">
                    {item.description}
                  </p>
                </div>

                {/* Bottom Feature Pill */}
                <div className="pt-4 sm:pt-5 mt-4 sm:mt-5 border-t border-[#e5e5e5]/80 flex items-center gap-1.5 text-[11px] text-[#000000]/65 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0070d1] shrink-0" />
                  <span>{item.badge}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Carousel Indicators */}
        <div className="flex sm:hidden items-center justify-center gap-1.5 mb-6">
          {steps.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleScrollToStep(idx)}
              aria-label={`Bước ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                activeStep === idx ? "w-6 bg-[#0070d1]" : "w-1.5 bg-[#e5e5e5]"
              }`}
            />
          ))}
        </div>

        {/* Trust Badges Banner & Quick Action */}
        <FadeIn direction="up">
          <div className="bg-[#f5f7fa] rounded-[12px] sm:rounded-[8px] border border-[#e5e5e5] p-4 xs:p-5 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 shadow-none">
            <div className="grid grid-cols-1 xs:grid-cols-3 sm:flex sm:flex-wrap items-center gap-3 xs:gap-4 sm:gap-10 text-xs sm:text-sm text-[#000000]/80 w-full md:w-auto">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-[#0070d1] shrink-0" />
                <span className="font-semibold text-xs sm:text-sm">Cam kết giá gốc</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-[#0070d1] shrink-0" />
                <span className="font-semibold text-xs sm:text-sm">Giữ phòng 100%</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#0070d1] shrink-0" />
                <span className="font-semibold text-xs sm:text-sm">Đổi ngày linh hoạt</span>
              </div>
            </div>

            <div className="w-full md:w-auto shrink-0">
              <Button
                variant="commerce"
                onClick={() => {
                  if (onOpenBookingModal) {
                    onOpenBookingModal();
                  } else {
                    const elem = document.getElementById("rooms");
                    if (elem) elem.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="w-full md:w-auto bg-[#d53b00] hover:bg-[#aa2f00] text-white rounded-full font-bold h-11 xs:h-12 px-7 text-xs sm:text-sm tracking-[0.3px] shadow-none flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Đặt phòng ngay</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </FadeIn>
      </div>
    </SectionStack>
  );
}
