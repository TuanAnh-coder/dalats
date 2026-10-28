"use client";

import React from "react";
import {
  KeyRound,
  Bed,
  Flame,
  Wind,
  ShieldCheck,
  Tv,
  Wifi,
  Sparkles,
  Coffee,
  Check,
  Car,
  UtensilsCrossed,
} from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem, SectionStack } from "./MotionWrapper";

export function AmenitiesSection() {
  const roomAmenities = [
    { name: "Khóa thẻ từ thông minh", icon: KeyRound },
    { name: "Giường nệm cao su êm ái", icon: Bed },
    { name: "Hệ thống nước nóng 24/7", icon: Flame },
    { name: "Máy sấy tóc ion công suất lớn", icon: Wind },
    { name: "Két sắt an toàn cá nhân", icon: ShieldCheck },
    { name: "Smart Tivi màn hình lớn", icon: Tv },
    { name: "Wifi tốc độ cao phủ toàn khu", icon: Wifi },
    { name: "Bộ tắm gội hữu cơ cao cấp", icon: Sparkles },
    { name: "Ấm đun nước & trà, cà phê", icon: Coffee },
    { name: "Tủ lạnh mini bar", icon: UtensilsCrossed },
    { name: "Bảo vệ & lễ tân trực 24/7", icon: ShieldCheck },
    { name: "Bãi đỗ ô tô & xe máy an toàn", icon: Car },
  ];

  const freeServices = [
    "Trà & nước suối tinh khiết đóng chai miễn phí mỗi ngày",
    "Bản đồ chỉ dẫn các quán ăn & điểm check-in độc đáo Đà Lạt",
    "Hỗ trợ nhận & gửi hành lý an toàn trước giờ check-in / sau check-out",
    "Không gian lounge, phòng đọc sách, giấy bút màu vẽ tự do",
    "Khu sân chơi vườn cỏ ngoài trời dành cho trẻ em",
  ];

  const paidServices = [
    { title: "Cho thuê xe máy đời mới", desc: "Xe ga, xe số được bảo dưỡng kỹ càng, tặng kèm mũ bảo hiểm & áo mưa" },
    { title: "Set up tiệc nướng BBQ sân vườn", desc: "Chuẩn bị lò than hồng, vỉ nướng, bát đĩa và thực phẩm ướp sẵn theo yêu cầu" },
    { title: "Dịch vụ giặt sấy thơm tho", desc: "Giao nhận nhanh trong ngày, quần áo phẳng phiu sạch sẽ" },
    { title: "Đón tiễn sân bay Liên Khương", desc: "Xe ô tô đời mới 4-7-16 chỗ đón tận cửa, đúng giờ chu đáo" },
  ];

  return (
    /* Chapter 6: Full-bleed True White Canvas Band (#ffffff) */
    <SectionStack id="amenities" index={80} fullHeight={true} sticky={true} className="py-16 md:py-0 pt-20 md:pt-24 md:pb-8 bg-[#ffffff] text-[#000000] border-b border-[#f3f3f3] overflow-hidden scroll-mt-24">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-4 sm:mb-6">
          <FadeIn direction="up">
            <span className="text-[12px] uppercase tracking-[1.5px] text-[#0070d1] font-bold block mb-1">
              Concierge & Amenities • Tiện Nghi & Dịch Vụ
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl text-[#000000] font-light tracking-tight mb-2 sm:mb-3">
              Hoàn thiện từng khoảnh khắc nghỉ dưỡng
            </h2>
            <p className="text-xs sm:text-sm text-[rgba(0,0,0,0.65)] font-normal leading-relaxed">
              Tại M_Dalats Villa, từng tiện nghi và dịch vụ được chuẩn bị chu đáo nhằm mang lại kỳ nghỉ thoải mái, an tâm và thảnh thơi trọn vẹn.
            </p>
          </FadeIn>
        </div>

        {/* Room & Garden Amenities Grid: PlayStation surface-card #f5f7fa */}
        <div className="mb-6 sm:mb-8">
          <FadeIn direction="up" delay={0.1}>
            <h3 className="text-base sm:text-lg text-[#000000] font-light mb-3 text-center sm:text-left tracking-wide">
              Tiện nghi phòng & sân vườn
            </h3>
          </FadeIn>

          <StaggerContainer
            staggerChildren={0.03}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3"
          >
            {roomAmenities.map((item, idx) => {
              const Icon = item.icon;
              return (
                <StaggerItem key={idx}>
                  <div className="p-2.5 sm:p-3 rounded-[8px] bg-[#f5f7fa] border border-[#f3f3f3] flex items-center gap-2.5 transition-all hover:bg-neutral-100 group cursor-default">
                    <div className="w-7 h-7 rounded-full bg-[#0070d1]/10 text-[#0070d1] flex items-center justify-center shrink-0 group-hover:bg-[#0070d1] group-hover:text-white transition-colors">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-medium text-neutral-800 leading-tight">
                      {item.name}
                    </span>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>

        {/* Free vs Paid Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pt-4 border-t border-[#f3f3f3]">
          <FadeIn direction="right" delay={0.2}>
            <div className="bg-[#f5f7fa] p-4 sm:p-6 rounded-[8px] border border-[#f3f3f3] h-full">
              <span className="text-[11px] uppercase tracking-[1px] text-[#0070d1] font-bold block mb-1">
                Dịch vụ tiêu chuẩn
              </span>
              <h3 className="text-lg sm:text-xl font-light text-[#000000] mb-3">
                Được bao gồm trong kỳ nghỉ
              </h3>
              <ul className="space-y-2">
                {freeServices.map((service, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-700">
                    <Check className="w-3.5 h-3.5 text-[#0070d1] shrink-0 mt-0.5" />
                    <span>{service}</span>
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>

          <FadeIn direction="left" delay={0.2}>
            <div className="bg-[#f5f7fa] p-4 sm:p-6 rounded-[8px] border border-[#f3f3f3] h-full">
              <span className="text-[11px] uppercase tracking-[1px] text-[#0070d1] font-bold block mb-1">
                Dịch vụ hỗ trợ thêm
              </span>
              <h3 className="text-lg sm:text-xl font-light text-[#000000] mb-3">
                Dịch vụ tính phí linh hoạt
              </h3>
              <div className="space-y-2.5">
                {paidServices.map((service, idx) => (
                  <div key={idx} className="border-b border-[#e5e7eb] last:border-0 pb-2 last:pb-0">
                    <h4 className="text-xs sm:text-sm font-medium text-neutral-900">
                      {service.title}
                    </h4>
                    <p className="text-[11px] sm:text-xs text-neutral-600 mt-0.5">
                      {service.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </SectionStack>
  );
}
