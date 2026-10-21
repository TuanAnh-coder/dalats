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
import { FadeIn, StaggerContainer, StaggerItem } from "./MotionWrapper";

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
    <section id="amenities" className="py-16 sm:py-24 bg-white border-b border-[#ece7dd] overflow-hidden scroll-mt-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <FadeIn direction="up">
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-[#367156] font-semibold block mb-1.5 sm:mb-2">
              Tiện nghi • Dịch vụ
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl text-[#367156] font-normal mb-3 sm:mb-4">
              Hoàn Thiện Từng Khoảnh Khắc
            </h2>
            <div className="flex items-center justify-center gap-2.5 mx-auto mb-4 sm:mb-5">
              <span className="w-10 sm:w-14 h-px bg-gradient-to-r from-transparent to-[#367156]/50" />
              <span className="text-[10px] text-[#367156] select-none">◆</span>
              <span className="w-10 sm:w-14 h-px bg-gradient-to-l from-transparent to-[#367156]/50" />
            </div>
            <p className="font-sans text-xs sm:text-sm text-[#666666] font-light leading-relaxed">
              Tại M_Dalats Villa, chúng tôi luôn chăm chút và nâng cấp những tiện nghi cũng như dịch vụ nhằm mang lại cho bạn những trải nghiệm nghỉ dưỡng ngày càng trọn vẹn và thư thái.
            </p>
          </FadeIn>
        </div>

        {/* Room & Garden Amenities Grid with Stagger */}
        <div className="mb-14 sm:mb-16">
          <FadeIn direction="up" delay={0.1}>
            <h3 className="font-serif text-xl sm:text-2xl text-[#367156] font-medium mb-5 text-center sm:text-left">
              Tiện nghi phòng & sân vườn
            </h3>
          </FadeIn>

          <StaggerContainer
            staggerChildren={0.05}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
          >
            {roomAmenities.map((item, idx) => {
              const Icon = item.icon;
              return (
                <StaggerItem key={idx}>
                  <div className="p-3.5 sm:p-4 rounded-sm bg-[#FAF9F6] border border-[#ece7dd] flex items-center gap-2.5 sm:gap-3 transition-all hover:border-[#367156] hover:shadow-xs hover:bg-white group cursor-default">
                    <Icon className="w-4 h-4 text-[#367156] flex-shrink-0 group-hover:scale-115 transition-transform" />
                    <span className="text-[11px] sm:text-xs font-medium text-[#222222] leading-tight">
                      {item.name}
                    </span>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>

        {/* Free vs Paid Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 pt-8 border-t border-[#ece7dd]">
          <FadeIn direction="right" delay={0.2}>
            <div className="bg-[#FAF9F6] p-6 sm:p-8 rounded-sm border border-[#ece7dd] h-full shadow-2xs">
              <div className="flex items-center gap-2.5 mb-4">
                <span className="w-2.5 h-2.5 rounded-full bg-[#367156]" />
                <h4 className="font-serif text-xl sm:text-2xl text-[#367156] font-medium">Dịch vụ miễn phí</h4>
              </div>
              <ul className="space-y-3">
                {freeServices.map((text, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-[#555555] font-light leading-relaxed">
                    <Check className="w-3.5 h-3.5 text-[#367156] flex-shrink-0 mt-0.5" />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>

          <FadeIn direction="left" delay={0.3}>
            <div className="bg-[#FAF9F6] p-6 sm:p-8 rounded-sm border border-[#ece7dd] h-full shadow-2xs">
              <div className="flex items-center gap-2.5 mb-4">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F4A261]" />
                <h4 className="font-serif text-xl sm:text-2xl text-[#584636] font-medium">Dịch vụ theo yêu cầu</h4>
              </div>
              <div className="space-y-3.5">
                {paidServices.map((item, idx) => (
                  <div key={idx} className="text-xs">
                    <p className="font-semibold text-[#367156]">{item.title}</p>
                    <p className="text-[#666666] font-light text-[11px] mt-0.5">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
