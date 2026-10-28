"use client";

import React from "react";
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
} from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem, SectionStack } from "./MotionWrapper";
import { Button } from "~/components/ui/button";

interface HowItWorksSectionProps {
  onOpenBookingModal?: () => void;
}

export function HowItWorksSection({ onOpenBookingModal }: HowItWorksSectionProps) {
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

  return (
    <SectionStack id="how-it-works" index={30} fullHeight={true} sticky={true} className="py-16 md:py-0 pt-20 md:pt-24 md:pb-8 bg-[#ffffff] text-[#000000] border-b border-[#e5e5e5] overflow-hidden scroll-mt-20">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Editorial Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-10">
          <FadeIn direction="up">
            <span className="text-[11px] uppercase tracking-[1.5px] text-[#0070d1] font-bold block mb-2">
              Quy Trình Đặt Phòng Tinh Gọn • How It Works
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-[#000000] tracking-[-0.1px] leading-[1.18]">
              4 Bước Để Bắt Đầu Kỳ Nghỉ An Yên
            </h2>
            <p className="text-sm sm:text-base text-[#000000]/65 font-normal leading-relaxed mt-2 max-w-2xl mx-auto">
              Trải nghiệm đặt phòng trực tiếp nhanh chóng, rõ ràng và uy tín như một nền tảng chuyên nghiệp, giúp bạn an tâm tuyệt đối trước chuyến đi.
            </p>
          </FadeIn>
        </div>

        {/* 4 Steps Grid: PlayStation 8px Cool-Blue Tinted Cards */}
        <StaggerContainer staggerChildren={0.12} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-6 md:mb-8">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <StaggerItem key={idx}>
                <div className="group relative bg-[#f5f7fa] hover:bg-[#eef2f7] p-7 rounded-[8px] border border-[#e5e5e5] hover:border-[#0070d1]/30 transition-all duration-300 flex flex-col justify-between h-full shadow-none">
                  <div>
                    {/* Top Row: Step Number & Icon */}
                    <div className="flex items-center justify-between mb-5">
                      <span className="font-mono text-2xl sm:text-3xl font-light text-[#0070d1] tracking-tight">
                        {item.step}
                      </span>
                      <div className="w-11 h-11 rounded-full bg-white text-[#0070d1] border border-[#e5e5e5] flex items-center justify-center shadow-xs group-hover:bg-[#0070d1] group-hover:text-white transition-colors duration-300">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>

                    {/* Step Title & Subtitle */}
                    <h3 className="text-lg sm:text-xl font-light text-[#000000] tracking-[0.1px] group-hover:text-[#0070d1] transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.8px] text-[#0070d1] mt-1 mb-3">
                      {item.subtitle}
                    </p>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-[#000000]/70 leading-relaxed font-light">
                      {item.description}
                    </p>
                  </div>

                  {/* Bottom Feature Pill */}
                  <div className="pt-5 mt-5 border-t border-[#e5e5e5]/80 flex items-center gap-1.5 text-[11px] text-[#000000]/60 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0070d1]" />
                    <span>{item.badge}</span>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        {/* Trust Badges Banner & Quick Action */}
        <FadeIn direction="up">
          <div className="bg-[#f5f7fa] rounded-[8px] border border-[#e5e5e5] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-none">
            <div className="flex flex-wrap items-center gap-6 sm:gap-10 text-xs sm:text-sm text-[#000000]/80">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-[#0070d1] shrink-0" />
                <span className="font-semibold">Cam kết giá gốc trực tiếp</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-5 h-5 text-[#0070d1] shrink-0" />
                <span className="font-semibold">Giữ phòng 100% không hủy ngang</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-[#0070d1] shrink-0" />
                <span className="font-semibold">Hỗ trợ đổi ngày linh hoạt</span>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
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
                className="w-full md:w-auto bg-[#d53b00] hover:bg-[#aa2f00] text-white rounded-full font-bold h-11 px-7 text-xs sm:text-sm tracking-[0.324px] shadow-none"
              >
                <span>Đặt phòng ngay</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </div>
        </FadeIn>
      </div>
    </SectionStack>
  );
}
