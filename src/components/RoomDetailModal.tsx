"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Bed,
  Maximize2,
  Users,
  Check,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Eye,
} from "lucide-react";
import type { Room } from "~/server/db/schema";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";

interface RoomDetailModalProps {
  room: Room | null;
  isOpen?: boolean;
  onClose: () => void;
  onBookRoom: (room: Room, searchParams?: any) => void;
}

export function RoomDetailModal({
  room,
  isOpen = true,
  onClose,
  onBookRoom,
}: RoomDetailModalProps) {
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [fitContain, setFitContain] = useState(false);

  const isModalOpen = isOpen && !!room;
  if (!room) return null;

  // Extract gallery images safely
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

  // Extract amenities list
  let amenitiesList: string[] = [];
  try {
    if (room.amenities) {
      const parsed = JSON.parse(room.amenities as string) as string[];
      if (Array.isArray(parsed)) amenitiesList = parsed;
    }
  } catch (e) {
    // fallback
  }
  if (amenitiesList.length === 0) {
    amenitiesList = [
      "Ban công ngắm rừng thông",
      "Smart TV 55 inch 4K",
      "Wifi cáp quang tốc độ cao",
      "Máy sấy tóc ion âm",
      "Két sắt an toàn cá nhân",
      "Bình đun siêu tốc & trà atiso",
      "Phòng tắm đứng vòi sen nóng lạnh",
      "Bộ khăn & đồ dùng hữu cơ cao cấp",
    ];
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " ₫";
  };

  const handleNextImage = () => {
    setActiveImageIdx((prev) => (prev + 1) % galleryImages.length);
  };

  const handlePrevImage = () => {
    setActiveImageIdx((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl bg-[#121314] text-white border border-white/20 rounded-[8px] sm:rounded-[12px] p-0 overflow-hidden max-h-[92vh] flex flex-col shadow-2xl">
        {/* Photo Gallery Frame */}
        <div className="relative w-full bg-neutral-950 shrink-0">
          <div className="relative h-[280px] xs:h-[340px] sm:h-[420px] w-full overflow-hidden">
            <Image
              src={galleryImages[activeImageIdx] || room.image}
              alt={`${room.name} ảnh ${activeImageIdx + 1}`}
              fill
              className={`transition-all duration-300 ${
                fitContain ? "object-contain p-2" : "object-cover object-center"
              }`}
              priority
            />

            {/* Top Toolbar Overlay */}
            <div className="absolute top-3 left-3 right-12 flex items-center justify-between pointer-events-none z-10">
              <Badge variant="outline" className="border-white/30 text-white bg-black/60 backdrop-blur-md text-[10px] gap-1 pointer-events-auto rounded-full font-mono px-3">
                <Eye className="w-3 h-3 text-[#53b1ff]" />
                <span>Ảnh {activeImageIdx + 1} / {galleryImages.length}</span>
              </Badge>

              <button
                type="button"
                onClick={() => setFitContain(!fitContain)}
                className="bg-black/70 hover:bg-black/90 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full border border-white/20 transition-colors flex items-center gap-1.5 cursor-pointer pointer-events-auto font-medium"
              >
                <Maximize2 className="w-3.5 h-3.5 text-[#53b1ff]" />
                <span className="text-[11px]">{fitContain ? "Tràn viền" : "Xem trọn ảnh"}</span>
              </button>
            </div>

            {/* Prev / Next Navigation Arrows */}
            {galleryImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-[#0070d1] text-white rounded-full h-11 w-11 flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer"
                  aria-label="Ảnh trước"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-[#0070d1] text-white rounded-full h-11 w-11 flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer"
                  aria-label="Ảnh kế tiếp"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Clickable Thumbnail Strip */}
          {galleryImages.length > 1 && (
            <div className="bg-[#181818] px-3 py-2 border-t border-white/10 flex items-center gap-2 overflow-x-auto custom-scrollbar">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIdx(idx)}
                  className={`relative shrink-0 w-16 h-11 sm:w-20 sm:h-14 rounded-[4px] overflow-hidden border transition-all cursor-pointer ${
                    idx === activeImageIdx
                      ? "border-[#0070d1] ring-2 ring-[#0070d1] opacity-100"
                      : "border-transparent opacity-50 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${room.name} ảnh ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Room Body Details - Scrollable: PlayStation SST Light 300 */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto custom-scrollbar">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
            <div>
              <span className="text-[12px] uppercase tracking-[1.5px] text-[#53b1ff] font-bold block mb-1">
                Phòng {room.roomNumber} • {room.viewType}
              </span>
              <DialogTitle className="text-2xl sm:text-3xl text-white font-light tracking-tight">
                {room.name}
              </DialogTitle>
            </div>

            <div className="text-left sm:text-right">
              {room.originalPrice && room.originalPrice > room.pricePerNight && (
                <span className="text-xs text-neutral-400 line-through block">
                  {formatPrice(room.originalPrice)}
                </span>
              )}
              <span className="text-2xl sm:text-3xl font-bold text-white">
                {formatPrice(room.pricePerNight)}
              </span>
              <span className="text-xs text-neutral-400"> / đêm</span>
            </div>
          </div>

          {/* Quick Stats Grid: PlayStation product-card-dark 8px */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-[#181818] rounded-[8px] border border-white/10">
            <div className="flex items-center gap-2.5">
              <Maximize2 className="w-4 h-4 text-[#53b1ff]" />
              <div>
                <p className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">Diện tích</p>
                <p className="text-xs font-semibold text-white">{room.area} m²</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4 text-[#53b1ff]" />
              <div>
                <p className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">Số khách</p>
                <p className="text-xs font-semibold text-white">
                  {room.maxAdults} Lớn, {room.maxChildren} Trẻ
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Bed className="w-4 h-4 text-[#53b1ff]" />
              <div>
                <p className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">Loại giường</p>
                <p className="text-xs font-semibold text-white">{room.bedType}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-[#53b1ff]" />
              <div>
                <p className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">Tầm nhìn</p>
                <p className="text-xs font-semibold text-white">{room.viewType}</p>
              </div>
            </div>
          </div>

          {/* Room Description */}
          <div>
            <h4 className="text-sm font-bold text-white mb-1.5 uppercase tracking-wide">Mô tả phòng</h4>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal">
              {room.description || room.shortDescription}
            </p>
          </div>

          {/* Amenities Grid */}
          <div>
            <h4 className="text-sm font-bold text-white mb-2.5 uppercase tracking-wide">Tiện nghi phòng nghỉ</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {amenitiesList.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-neutral-300">
                  <Check className="w-3.5 h-3.5 text-[#53b1ff] shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons: PlayStation pill CTAs */}
          <div className="pt-4 border-t border-white/10 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="w-full sm:w-auto h-12 px-7 text-xs font-bold border-white/20 bg-transparent text-white hover:bg-white/10 rounded-full"
            >
              Đóng lại
            </Button>
            <Button
              type="button"
              variant="commerce"
              size="sm"
              onClick={() => {
                onClose();
                onBookRoom(room);
              }}
              className="w-full sm:w-auto h-12 px-8 bg-[#d53b00] hover:bg-[#aa2f00] text-white text-xs sm:text-sm font-bold rounded-full cursor-pointer shadow-none"
            >
              Đặt phòng này ngay
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
