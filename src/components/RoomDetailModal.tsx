"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  X,
  Check,
  Maximize2,
  Minimize2,
  Users,
  Bed,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";
import type { Room } from "~/server/db/schema";

interface RoomDetailModalProps {
  room: Room | null;
  onClose: () => void;
  onBookRoom: (room: Room) => void;
}

export function RoomDetailModal({ room, onClose, onBookRoom }: RoomDetailModalProps) {
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [fitContain, setFitContain] = useState(false);

  // Reset active image when room changes
  useEffect(() => {
    setActiveImageIdx(0);
    setFitContain(false);
  }, [room?.id]);

  if (!room) return null;

  let galleryImages: string[] = [room.image];
  try {
    if (room.gallery) {
      const parsed = JSON.parse(room.gallery as string) as string[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        galleryImages = parsed;
      }
    }
  } catch (e) {
    // fallback to main image
  }

  let amenitiesList: string[] = [
    "Khóa từ hiện đại",
    "Giường đệm êm ái",
    "Nước nóng 24/7",
    "Smart TV",
    "Wifi tốc độ cao",
    "Máy sấy tóc",
    "Trà & Cà phê miễn phí",
    "Tủ lạnh nhỏ",
  ];

  try {
    if (room.amenities) {
      const parsed = JSON.parse(room.amenities as string) as string[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        amenitiesList = parsed;
      }
    }
  } catch (e) {
    // fallback
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " ₫";
  };

  const handlePrevImage = () => {
    setActiveImageIdx((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1));
  };

  const handleNextImage = () => {
    setActiveImageIdx((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-xs animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-lg shadow-2xl border border-[#ece7dd] max-w-4xl w-full max-h-[92vh] overflow-y-auto custom-scrollbar relative flex flex-col">
        {/* Gallery Visual Header */}
        <div className="relative w-full bg-[#141414] overflow-hidden">
          {/* Main Large Image Canvas */}
          <div className="relative h-72 xs:h-80 sm:h-[440px] md:h-[490px] w-full flex items-center justify-center group select-none">
            <Image
              src={galleryImages[activeImageIdx] || room.image}
              alt={room.name}
              fill
              className={`transition-all duration-300 ${
                fitContain ? "object-contain p-2" : "object-cover object-center"
              }`}
              priority
            />

            {/* Top Toolbar Overlay */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
              {/* Image Counter Badge */}
              <div className="bg-black/60 backdrop-blur-md text-white text-[11px] font-mono px-3 py-1.5 rounded-full border border-white/20 shadow-md pointer-events-auto flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-[#f4a261]" />
                <span>
                  Ảnh {activeImageIdx + 1} / {galleryImages.length}
                </span>
              </div>

              {/* Controls: Fit/Cover Toggle & Close */}
              <div className="flex items-center gap-2 pointer-events-auto">
                <button
                  type="button"
                  onClick={() => setFitContain(!fitContain)}
                  className="bg-black/60 hover:bg-black/85 backdrop-blur-md text-white text-xs px-2.5 py-1.5 rounded-full border border-white/20 shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                  title={fitContain ? "Chuyển sang xem tràn viền (Cover)" : "Xem trọn vẹn toàn bộ ảnh (Contain)"}
                >
                  {fitContain ? (
                    <>
                      <Minimize2 className="w-3.5 h-3.5 text-[#f4a261]" />
                      <span className="hidden sm:inline text-[11px]">Tràn viền</span>
                    </>
                  ) : (
                    <>
                      <Maximize2 className="w-3.5 h-3.5 text-[#f4a261]" />
                      <span className="hidden sm:inline text-[11px]">Xem trọn ảnh</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="bg-black/60 hover:bg-black/85 backdrop-blur-md text-white p-2 rounded-full border border-white/20 shadow-md transition-all cursor-pointer"
                  aria-label="Đóng"
                  title="Đóng cửa sổ"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Prev / Next Navigation Arrows */}
            {galleryImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 sm:p-2.5 rounded-full backdrop-blur-md border border-white/20 shadow-lg transition-all hover:scale-110 cursor-pointer"
                  aria-label="Ảnh trước"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <button
                  type="button"
                  onClick={handleNextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 sm:p-2.5 rounded-full backdrop-blur-md border border-white/20 shadow-lg transition-all hover:scale-110 cursor-pointer"
                  aria-label="Ảnh kế tiếp"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </>
            )}
          </div>

          {/* Generous Clickable Thumbnail Gallery Strip */}
          {galleryImages.length > 1 && (
            <div className="bg-[#1b1917] px-4 py-3 border-t border-white/10 flex items-center gap-3 overflow-x-auto no-scrollbar">
              <span className="text-[11px] uppercase tracking-wider text-white/50 shrink-0 font-medium hidden sm:inline-block">
                Bộ sưu tập ({galleryImages.length}):
              </span>
              <div className="flex items-center gap-2.5">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIdx(idx)}
                    className={`relative shrink-0 w-20 h-14 sm:w-28 sm:h-18 rounded-md overflow-hidden transition-all duration-200 border-2 cursor-pointer ${
                      idx === activeImageIdx
                        ? "border-[#f4a261] ring-2 ring-[#f4a261]/50 scale-105 shadow-md opacity-100"
                        : "border-transparent opacity-60 hover:opacity-100 hover:border-white/60"
                    }`}
                    title={`Xem ảnh ${idx + 1}`}
                  >
                    <Image
                      src={img}
                      alt={`${room.name} ảnh ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] px-1 py-0.2 rounded font-mono">
                      {idx + 1}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Room Body Details */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#ece7dd]">
            <div>
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#367156] font-semibold block mb-1">
                Phòng {room.roomNumber} • {room.viewType}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#222222] font-normal">
                {room.name}
              </h2>
            </div>

            <div className="text-left sm:text-right">
              {room.originalPrice && room.originalPrice > room.pricePerNight && (
                <span className="text-xs text-[#888888] line-through block font-sans">
                  {formatPrice(room.originalPrice)}
                </span>
              )}
              <span className="font-serif text-2xl sm:text-3xl font-semibold text-[#367156]">
                {formatPrice(room.pricePerNight)}
              </span>
              <span className="text-xs text-[#777777]"> / đêm</span>
              <span className="text-[10px] text-[#367156] font-medium block">Đã gồm thuế & phí</span>
            </div>
          </div>

          {/* Agoda Signature Perks */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-emerald-50/80 border border-emerald-200/80 rounded-xs text-xs text-emerald-900 font-medium">
            <span>✓ Bao gồm bữa sáng đặc sản Đà Lạt</span>
            <span>✓ Hủy phòng miễn phí trước 48h</span>
            <span>✓ Xác nhận ngay • Hỗ trợ quản gia 24/7</span>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 bg-[#faf7f1] rounded-md px-4 border border-[#ece7dd]">
            <div className="flex items-center gap-2.5">
              <Maximize2 className="w-4 h-4 text-[#367156]" />
              <div>
                <p className="text-[10px] text-[#777777] uppercase">Diện tích</p>
                <p className="text-xs font-semibold text-[#222222]">{room.area} m²</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4 text-[#367156]" />
              <div>
                <p className="text-[10px] text-[#777777] uppercase">Số khách</p>
                <p className="text-xs font-semibold text-[#222222]">
                  {room.maxAdults} Lớn, {room.maxChildren} Trẻ
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Bed className="w-4 h-4 text-[#367156]" />
              <div>
                <p className="text-[10px] text-[#777777] uppercase">Loại giường</p>
                <p className="text-xs font-semibold text-[#222222]">{room.bedType}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-[#367156]" />
              <div>
                <p className="text-[10px] text-[#777777] uppercase">Tầm nhìn</p>
                <p className="text-xs font-semibold text-[#222222]">{room.viewType}</p>
              </div>
            </div>
          </div>

          {/* Room Description */}
          <div>
            <h4 className="font-serif text-lg text-[#222222] font-medium mb-2">Mô tả phòng</h4>
            <p className="text-sm text-[#555555] font-light leading-relaxed">
              {room.description || room.shortDescription}
            </p>
          </div>

          {/* Amenities Grid */}
          <div>
            <h4 className="font-serif text-lg text-[#222222] font-medium mb-3">Tiện nghi trong phòng</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {amenitiesList.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-[#555555]">
                  <Check className="w-3.5 h-3.5 text-[#367156] flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-6 border-t border-[#ece7dd] flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-3 sm:py-2.5 border border-[#cccccc] text-[#555555] hover:bg-[#faf7f1] rounded-sm text-xs uppercase tracking-wider font-medium cursor-pointer"
            >
              Đóng
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onBookRoom(room);
              }}
              className="w-full sm:w-auto bg-[#f27052] hover:bg-[#e05c3c] text-white px-6 py-3 sm:py-2.5 rounded-sm text-xs uppercase tracking-wider font-medium shadow-md transition-all cursor-pointer"
            >
              Đặt phòng này ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
