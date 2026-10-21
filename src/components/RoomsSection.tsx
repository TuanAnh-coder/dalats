"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Bed,
  Maximize2,
  Users,
  Eye,
  CalendarCheck,
  Calendar,
  Search,
  Filter,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  PhoneCall,
  SlidersHorizontal,
  ChevronDown,
  Sparkles,
  Star,
} from "lucide-react";
import type { Room } from "~/server/db/schema";
import { api } from "~/trpc/react";
import { FadeIn, StaggerContainer, StaggerItem, motion } from "./MotionWrapper";

export interface SearchParams {
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
}

interface RoomsSectionProps {
  rooms: Room[];
  isLoading: boolean;
  onSelectRoom: (room: Room) => void;
  onBookRoom: (room: Room, searchContext?: SearchParams) => void;
  searchParams?: SearchParams | null;
  onUpdateSearch?: (params: SearchParams) => void;
  onClearSearch?: () => void;
}

export function RoomsSection({
  rooms,
  isLoading: isInitialLoading,
  onSelectRoom,
  onBookRoom,
  searchParams,
  onUpdateSearch,
  onClearSearch,
}: RoomsSectionProps) {
  const today = new Date().toISOString().split("T")[0] ?? "2026-10-19";
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0] ?? "2026-10-20";

  // Search form local state
  const [localCheckIn, setLocalCheckIn] = useState<string>(searchParams?.checkIn || today);
  const [localCheckOut, setLocalCheckOut] = useState<string>(searchParams?.checkOut || tomorrow);
  const [localAdults, setLocalAdults] = useState<number>(searchParams?.adults ?? 2);
  const [localChildren, setLocalChildren] = useState<number>(searchParams?.children ?? 0);

  // Filter & Sort state
  const [filterFloor, setFilterFloor] = useState<string>("all");
  const [sortBy, setSortBy] = useState<
    "default" | "popular" | "rating-desc" | "price-asc" | "price-desc" | "area-desc"
  >("default");
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(true);
  const [showSearchBox, setShowSearchBox] = useState<boolean>(false);

  // Synchronize when parent searchParams change (e.g. from Hero submit)
  useEffect(() => {
    if (searchParams) {
      setLocalCheckIn(searchParams.checkIn);
      setLocalCheckOut(searchParams.checkOut);
      setLocalAdults(searchParams.adults);
      setLocalChildren(searchParams.children);
    }
  }, [searchParams]);

  // Handle Check-in date change
  const handleCheckInChange = (val: string) => {
    setLocalCheckIn(val);
    if (localCheckOut <= val) {
      const nextDay = new Date(new Date(val).getTime() + 86400000).toISOString().split("T")[0] ?? val;
      setLocalCheckOut(nextDay);
    }
  };

  // Submit search from RoomsSection bar
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateSearch) {
      onUpdateSearch({
        checkIn: localCheckIn,
        checkOut: localCheckOut,
        adults: localAdults,
        children: localChildren,
      });
    }
  };

  // Query live search from backend with availability & conflict checking
  const searchQuery = api.room.search.useQuery(
    {
      checkIn: searchParams?.checkIn,
      checkOut: searchParams?.checkOut,
      adults: searchParams?.adults ?? 2,
      children: searchParams?.children ?? 0,
      floor: filterFloor,
      sortBy: sortBy,
    },
    {
      enabled: !!searchParams,
    }
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " ₫";
  };

  const formatDateDisplay = (dateStr: string) => {
    try {
      const [y, m, d] = dateStr.split("-");
      return `${d}/${m}/${y}`;
    } catch {
      return dateStr;
    }
  };

  // Calculate total nights
  const totalNights = React.useMemo(() => {
    if (!searchParams?.checkIn || !searchParams?.checkOut) return 1;
    const d1 = new Date(searchParams.checkIn);
    const d2 = new Date(searchParams.checkOut);
    const diff = Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  }, [searchParams?.checkIn, searchParams?.checkOut]);

  // Determine rooms to display
  let displayRooms: Array<
    Room & {
      fitsCapacity?: boolean;
      isBooked?: boolean;
      isAvailableForDates?: boolean;
      totalEstimatedPrice?: number;
      reviewScore?: number;
      reviewCount?: number;
      discountPercent?: number;
      recentBookingsCount?: number;
      urgencyBadge?: string;
    }
  > = [];

  const isLoading = isInitialLoading || (!!searchParams && searchQuery.isLoading);

  if (searchParams && searchQuery.data) {
    displayRooms = searchQuery.data.filter((r) => {
      // If onlyAvailable is checked, filter out booked rooms or rooms that don't fit
      if (onlyAvailable) {
        return r.isAvailableForDates && r.fitsCapacity;
      }
      return true;
    });
  } else {
    // Default mode: filter prop rooms by floor and sort
    displayRooms = rooms
      .filter((r) => {
        if (filterFloor === "all") return true;
        if (filterFloor === "0" && (r.roomNumber.startsWith("00") || r.roomNumber.startsWith("0"))) return true;
        if (filterFloor === "1" && r.roomNumber.startsWith("1")) return true;
        if (filterFloor === "2" && r.roomNumber.startsWith("2")) return true;
        return true;
      })
      .map((r) => {
        const originalPrice = r.originalPrice || Math.round(r.pricePerNight * 1.25);
        const discountPercent = Math.max(0, Math.round(((originalPrice - r.pricePerNight) / originalPrice) * 100));
        const reviewScore = Number((9.2 + ((r.id * 7) % 7) * 0.1).toFixed(1));
        const reviewCount = 85 + (r.id * 17) % 95;
        const recentBookingsCount = (r.id * 3) % 7 + 1;

        return {
          ...r,
          fitsCapacity: true,
          isBooked: false,
          isAvailableForDates: r.isAvailable,
          totalEstimatedPrice: r.pricePerNight * totalNights,
          originalPrice,
          discountPercent,
          reviewScore,
          reviewCount,
          recentBookingsCount,
        };
      });

    if (sortBy === "price-asc") {
      displayRooms.sort((a, b) => a.pricePerNight - b.pricePerNight);
    } else if (sortBy === "price-desc") {
      displayRooms.sort((a, b) => b.pricePerNight - a.pricePerNight);
    } else if (sortBy === "area-desc") {
      displayRooms.sort((a, b) => b.area - a.area);
    } else if (sortBy === "rating-desc") {
      displayRooms.sort((a, b) => ((b as any).reviewScore || 9) - ((a as any).reviewScore || 9));
    } else if (sortBy === "popular") {
      displayRooms.sort((a, b) => ((b as any).recentBookingsCount || 0) - ((a as any).recentBookingsCount || 0));
    }
  }

  return (
    <section id="rooms" className="py-16 sm:py-24 px-4 sm:px-8 max-w-6xl mx-auto scroll-mt-32">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
        <FadeIn direction="up">
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-[#367156] font-semibold block mb-1.5 sm:mb-2">
            Hệ thống phòng nghỉ • M_Dalats Villa
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl text-[#367156] font-normal mb-3 sm:mb-4">
            Ấm Áp & Tiện Nghi
          </h2>
          <div className="flex items-center justify-center gap-2.5 mx-auto mb-4 sm:mb-5">
            <span className="w-10 sm:w-14 h-px bg-gradient-to-r from-transparent to-[#367156]/50" />
            <span className="text-[10px] text-[#367156] select-none">◆</span>
            <span className="w-10 sm:w-14 h-px bg-gradient-to-l from-transparent to-[#367156]/50" />
          </div>
          <p className="font-sans text-xs sm:text-sm text-[#555555] font-light leading-relaxed">
            M_Dalats Boutique Villa sở hữu 11 căn phòng mộc mạc phong cách Tuscany, chan hòa nắng mai xứ sở ngàn hoa. Tìm và đặt phòng dễ dàng, nhanh chóng.
          </p>
        </FadeIn>
      </div>

      {/* Active Search Context Summary Bar */}
      {searchParams && (
        <FadeIn direction="up" delay={0.1}>
          <div className="mb-6 bg-gradient-to-r from-[#FAF9F6] to-[#faf7f1] border border-[#D9C9A7]/80 rounded-md p-3.5 sm:p-4 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5 text-xs text-[#367156]">
              <span className="inline-flex items-center gap-1.5 bg-[#367156] text-white px-2.5 py-1 rounded-full text-[10px] uppercase font-semibold tracking-wider">
                <CheckCircle2 className="w-3 h-3 text-[#F4A261]" />
                Đang tìm phòng
              </span>

              <span className="inline-flex items-center gap-1 font-medium bg-white px-2.5 py-1 rounded-sm border border-[#ece7dd]">
                <Calendar className="w-3.5 h-3.5 text-[#367156]" />
                {formatDateDisplay(searchParams.checkIn)} → {formatDateDisplay(searchParams.checkOut)} ({totalNights} đêm)
              </span>

              <span className="inline-flex items-center gap-1 font-medium bg-white px-2.5 py-1 rounded-sm border border-[#ece7dd]">
                <Users className="w-3.5 h-3.5 text-[#367156]" />
                {searchParams.adults} Lớn{searchParams.children > 0 ? `, ${searchParams.children} Trẻ` : ""}
              </span>

              <span className="text-[11px] text-[#666666]">
                • Tìm thấy <strong className="text-[#367156] font-bold">{displayRooms.length}</strong> phòng phù hợp
              </span>
            </div>

            <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
              <button
                type="button"
                onClick={() => setShowSearchBox(!showSearchBox)}
                className="inline-flex items-center gap-1 text-[11px] uppercase tracking-wider font-semibold text-[#367156] hover:text-[#e05c3c] bg-white border border-[#ece7dd] px-3 py-1.5 rounded-sm shadow-2xs transition-colors cursor-pointer"
              >
                <SlidersHorizontal className="w-3 h-3 text-[#367156]" />
                <span>{showSearchBox ? "Thu gọn tìm kiếm" : "Đổi ngày & số khách"}</span>
              </button>

              {onClearSearch && (
                <button
                  type="button"
                  onClick={onClearSearch}
                  className="inline-flex items-center gap-1 text-[11px] uppercase tracking-wider font-semibold text-[#888888] hover:text-red-700 bg-white border border-[#ece7dd] px-2.5 py-1.5 rounded-sm shadow-2xs transition-colors cursor-pointer"
                  title="Xóa bộ lọc tìm kiếm và xem tất cả phòng"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span className="hidden sm:inline">Xem tất cả 11 phòng</span>
                </button>
              )}
            </div>
          </div>
        </FadeIn>
      )}

      {/* Embedded Search & Adjuster Card (collapsible or toggleable) */}
      {(showSearchBox || !searchParams) && (
        <FadeIn direction="up" delay={0.15}>
          <form
            onSubmit={handleSearchSubmit}
            className="mb-8 bg-white border border-[#ece7dd] rounded-md p-4 sm:p-5 shadow-sm grid grid-cols-1 xs:grid-cols-2 md:grid-cols-5 gap-3 items-end"
          >
            {/* Check-in */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase tracking-wider text-[#367156] font-semibold flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#367156]" />
                <span>Nhận phòng</span>
              </label>
              <input
                type="date"
                value={localCheckIn}
                min={today}
                onChange={(e) => handleCheckInChange(e.target.value)}
                className="w-full bg-[#FAF9F6] border border-[#d6cebf] px-3 py-1.5 text-base sm:text-xs text-[#222222] font-medium rounded-xs focus:outline-hidden focus:border-[#367156] min-h-[42px] sm:min-h-0"
                required
              />
            </div>

            {/* Check-out */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase tracking-wider text-[#367156] font-semibold flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#367156]" />
                <span>Trả phòng</span>
              </label>
              <input
                type="date"
                value={localCheckOut}
                min={localCheckIn || today}
                onChange={(e) => setLocalCheckOut(e.target.value)}
                className="w-full bg-[#FAF9F6] border border-[#d6cebf] px-3 py-1.5 text-base sm:text-xs text-[#222222] font-medium rounded-xs focus:outline-hidden focus:border-[#367156] min-h-[42px] sm:min-h-0"
                required
              />
            </div>

            {/* Adults */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase tracking-wider text-[#367156] font-semibold flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#367156]" />
                <span>Người lớn</span>
              </label>
              <select
                value={localAdults}
                onChange={(e) => setLocalAdults(Number(e.target.value))}
                className="w-full bg-[#FAF9F6] border border-[#d6cebf] px-3 py-1.5 text-base sm:text-xs text-[#222222] font-medium rounded-xs focus:outline-hidden focus:border-[#367156] min-h-[42px] sm:min-h-0"
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num}>
                    {num} Người lớn
                  </option>
                ))}
              </select>
            </div>

            {/* Children */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase tracking-wider text-[#367156] font-semibold flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#367156]" />
                <span>Trẻ em (&lt;12t)</span>
              </label>
              <select
                value={localChildren}
                onChange={(e) => setLocalChildren(Number(e.target.value))}
                className="w-full bg-[#FAF9F6] border border-[#d6cebf] px-3 py-1.5 text-base sm:text-xs text-[#222222] font-medium rounded-xs focus:outline-hidden focus:border-[#367156] min-h-[42px] sm:min-h-0"
              >
                {[0, 1, 2, 3].map((num) => (
                  <option key={num} value={num}>
                    {num} Trẻ em
                  </option>
                ))}
              </select>
            </div>

            {/* Submit search button */}
            <div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#367156] to-[#498b6c] hover:from-[#498b6c] hover:to-[#367156] text-white text-xs uppercase tracking-wider font-semibold py-2 px-4 rounded-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer min-h-[42px] sm:min-h-[34px]"
              >
                <Search className="w-3.5 h-3.5 text-[#F4A261]" />
                <span>Cập nhật tìm kiếm</span>
              </button>
            </div>
          </form>
        </FadeIn>
      )}

      {/* Filter and Sorting Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-8 pb-4 border-b border-[#ece7dd]">
        {/* Floor Filter Tabs */}
        <div className="flex overflow-x-auto no-scrollbar items-center gap-1.5 p-1 bg-[#FAF9F6] border border-[#ece7dd] rounded-full max-w-full md:max-w-fit shadow-2xs snap-x">
          {[
            { id: "all", label: "Tất cả phòng" },
            { id: "0", label: "Tầng trệt & Vườn" },
            { id: "1", label: "Tầng 1 ban công" },
            { id: "2", label: "Tầng 2 áp mái" },
          ].map((tab) => {
            const isSelected = filterFloor === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterFloor(tab.id)}
                className={`relative px-3.5 sm:px-4 py-1.5 text-[10px] xs:text-[11px] uppercase tracking-wider rounded-full transition-colors cursor-pointer font-medium whitespace-nowrap shrink-0 snap-start ${
                  isSelected ? "text-white font-semibold" : "text-[#555555] hover:text-[#367156]"
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="activeFloorTab"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className="absolute inset-0 bg-[#367156] rounded-full shadow-xs"
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Sorting & Availability Toggle */}
        <div className="flex items-center justify-between md:justify-end gap-3 self-end md:self-auto w-full md:w-auto">
          {searchParams && (
            <label className="flex items-center gap-2 text-xs text-[#555555] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={(e) => setOnlyAvailable(e.target.checked)}
                className="w-3.5 h-3.5 accent-[#367156] rounded-xs cursor-pointer"
              />
              <span className="text-[11px] font-medium">Chỉ hiện phòng trống</span>
            </label>
          )}

          {/* Sort By Dropdown */}
          <div className="relative inline-flex items-center">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-[#d6cebf] px-3 py-1.5 text-xs text-[#222222] font-medium rounded-sm focus:outline-hidden focus:border-[#367156] cursor-pointer pr-7 appearance-none"
            >
              <option value="default">Sắp xếp: Mặc định</option>
              <option value="popular">Nổi bật nhất (Agoda Pick)</option>
              <option value="rating-desc">Đánh giá cao nhất</option>
              <option value="price-asc">Giá: Thấp đến cao</option>
              <option value="price-desc">Giá: Cao đến thấp</option>
              <option value="area-desc">Diện tích: Lớn nhất</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#888888] absolute right-2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Room Grid or Loading / Empty State */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-md overflow-hidden border border-[#ece7dd] animate-pulse">
              <div className="h-56 sm:h-64 bg-[#f0e9dc]" />
              <div className="p-5 space-y-3">
                <div className="h-4 bg-[#f0e9dc] w-1/3" />
                <div className="h-5 bg-[#f0e9dc] w-2/3" />
                <div className="h-3 bg-[#f0e9dc] w-full" />
                <div className="h-9 bg-[#f0e9dc] w-full mt-3" />
              </div>
            </div>
          ))}
        </div>
      ) : displayRooms.length === 0 ? (
        /* Empty State with Helpful Next Steps */
        <div className="bg-white border border-[#ece7dd] rounded-md p-8 sm:p-12 text-center max-w-xl mx-auto shadow-xs">
          <div className="w-14 h-14 bg-amber-50 text-[#F4A261] rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-200">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h3 className="font-serif text-2xl text-[#367156] font-normal mb-2">
            Không tìm thấy phòng phù hợp
          </h3>
          <p className="text-xs sm:text-sm text-[#666666] leading-relaxed mb-6 font-light">
            {searchParams ? (
              <>
                Không có phòng nào đáp ứng đủ <strong>{searchParams.adults} người lớn</strong> hoặc phòng đã có khách đặt trong khoảng ngày <strong>{formatDateDisplay(searchParams.checkIn)} → {formatDateDisplay(searchParams.checkOut)}</strong>.
              </>
            ) : (
              "Không có phòng nào phù hợp với bộ lọc hiện tại."
            )}
          </p>

          <div className="bg-[#FAF9F6] p-4 rounded-sm border border-[#ece7dd] text-left text-xs text-[#555555] space-y-1.5 mb-6">
            <p className="font-semibold text-[#367156]">Gợi ý cho quý khách:</p>
            <p>• Biệt thự có 11 phòng nghỉ riêng biệt. Với đoàn đông, quý khách có thể đặt 2 phòng cạnh nhau.</p>
            <p>• Thử chuyển sang ngày nhận/trả phòng khác để tìm phòng trống.</p>
            <p>• Liên hệ trực tiếp quản gia để được hỗ trợ sắp xếp phòng linh hoạt nhất.</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {onClearSearch && (
              <button
                type="button"
                onClick={() => {
                  setFilterFloor("all");
                  setOnlyAvailable(false);
                  onClearSearch();
                }}
                className="bg-[#367156] hover:bg-[#498b6c] text-white text-xs uppercase tracking-wider font-semibold px-4 py-2.5 rounded-sm transition-all cursor-pointer"
              >
                Xem tất cả 11 phòng nghỉ
              </button>
            )}

            <a
              href="tel:0939014234"
              className="border border-[#367156] text-[#367156] hover:bg-[#FAF9F6] text-xs uppercase tracking-wider font-semibold px-4 py-2.5 rounded-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#367156]" />
              <span>Hotline 0939 014 234</span>
            </a>
          </div>
        </div>
      ) : (
        <StaggerContainer
          staggerChildren={0.08}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {displayRooms.map((room) => {
            const isAvailable = room.isAvailable && !room.isBooked;
            const fits = room.fitsCapacity !== false;

            return (
              <StaggerItem key={room.id} className="h-full">
                <div className="group bg-white rounded-md overflow-hidden border border-[#ece7dd] shadow-xs hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 flex flex-col h-full relative">
                  {/* Room Card Image with Contrast Hover */}
                  <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-[#faf7f1]">
                    <Image
                      src={room.image}
                      alt={room.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />

                    {/* Gradient Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Room Number Chip */}
                    <div className="absolute top-3.5 left-3.5 bg-[#367156]/85 backdrop-blur-xs text-white px-2.5 py-0.5 rounded-xs text-[10px] font-mono tracking-wider font-medium">
                      No. {room.roomNumber}
                    </div>

                    {/* Price Pill */}
                    <div className="absolute top-3.5 right-3.5 bg-white/95 backdrop-blur-xs px-2.5 sm:px-3 py-1 rounded-sm shadow-md border border-[#ece7dd] text-right">
                      {room.originalPrice && room.originalPrice > room.pricePerNight && (
                        <span className="text-[10px] text-[#888888] line-through block font-sans">
                          {formatPrice(room.originalPrice)}
                        </span>
                      )}
                      <span className="text-xs sm:text-sm font-bold text-[#367156]">
                        {formatPrice(room.pricePerNight)}
                      </span>
                      <span className="text-[9px] text-[#777777]"> / đêm</span>
                      <span className="text-[8px] text-[#367156] font-medium block">Đã gồm thuế & phí</span>

                      {/* Total stay price if searching dates */}
                      {searchParams && totalNights > 1 && (
                        <div className="border-t border-[#ece7dd] mt-0.5 pt-0.5">
                          <span className="text-[9px] text-[#367156] font-semibold block">
                            {totalNights} đêm: {formatPrice(room.pricePerNight * totalNights)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Status & Availability Badges */}
                    <div className="absolute bottom-3 left-3 flex flex-col gap-1 items-start">
                      <div className="bg-[#367156]/95 backdrop-blur-xs text-white text-[10px] sm:text-[11px] px-3 py-0.5 rounded-full font-medium tracking-wide shadow-xs">
                        {room.viewType}
                      </div>

                      {searchParams && (
                        <div>
                          {room.isBooked ? (
                            <span className="inline-flex items-center gap-1 bg-red-800/90 backdrop-blur-xs text-white text-[10px] px-2.5 py-0.5 rounded-full font-medium shadow-xs">
                              ✕ Đã kín phòng ngày này
                            </span>
                          ) : !fits ? (
                            <span className="inline-flex items-center gap-1 bg-amber-700/90 backdrop-blur-xs text-white text-[10px] px-2.5 py-0.5 rounded-full font-medium shadow-xs">
                              Tối đa {room.maxAdults} người lớn
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-emerald-800/90 backdrop-blur-xs text-white text-[10px] px-2.5 py-0.5 rounded-full font-medium shadow-xs">
                              ✓ Phòng trống sẵn sàng
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Room Details Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Agoda Review Score & Discount Badge */}
                      <div className="flex items-center justify-between text-[11px] mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <span className="bg-[#367156] text-white px-1.5 py-0.5 rounded-xs font-bold text-[10px]">
                            {room.reviewScore || 9.6}
                          </span>
                          <span className="font-semibold text-[#367156]">
                            {(room.reviewScore || 9.6) >= 9.5 ? "Xuất sắc" : "Tuyệt vời"}
                          </span>
                          <span className="text-[#888888] text-[10px]">({room.reviewCount || 128} đánh giá)</span>
                        </div>
                        {(room.discountPercent || 0) > 0 && (
                          <span className="bg-red-50 text-red-700 border border-red-200 px-1.5 py-0.2 rounded-xs text-[10px] font-bold">
                            -{room.discountPercent}%
                          </span>
                        )}
                      </div>

                      <h3 className="font-serif text-xl sm:text-2xl text-[#222222] group-hover:text-[#367156] transition-colors font-medium">
                        {room.name}
                      </h3>

                      {/* Room Attributes */}
                      <div className="flex items-center gap-3 sm:gap-4 text-[11px] text-[#666666] my-2.5 py-2 border-y border-[#ece7dd]/60 font-sans">
                        <span className="flex items-center gap-1">
                          <Maximize2 className="w-3.5 h-3.5 text-[#367156]" />
                          {room.area} m²
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-[#367156]" />
                          {room.maxAdults} Lớn, {room.maxChildren} Trẻ
                        </span>
                        <span className="flex items-center gap-1 truncate">
                          <Bed className="w-3.5 h-3.5 text-[#367156] flex-shrink-0" />
                          <span className="truncate">{room.bedType}</span>
                        </span>
                      </div>

                      {/* Agoda Value Adds */}
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-[#367156] font-medium my-1.5">
                        <span>✓ Bữa sáng miễn phí</span>
                        <span>•</span>
                        <span>✓ Hủy miễn phí</span>
                        <span>•</span>
                        <span>✓ Xác nhận ngay</span>
                      </div>

                      <p className="text-xs text-[#666666] font-light line-clamp-2 leading-relaxed">
                        {room.shortDescription || room.description}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-2.5 mt-5 pt-1">
                      <button
                        type="button"
                        onClick={() => onSelectRoom(room)}
                        className="border border-[#367156] text-[#367156] hover:bg-[#FAF9F6] text-[11px] uppercase tracking-wider font-semibold py-2 px-2.5 rounded-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer min-h-[38px]"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Chi tiết
                      </button>

                      <button
                        type="button"
                        onClick={() => onBookRoom(room, searchParams || undefined)}
                        disabled={room.isBooked}
                        className={`text-[11px] uppercase tracking-wider font-semibold py-2 px-2.5 rounded-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer min-h-[38px] ${
                          room.isBooked
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed border border-gray-300"
                            : "bg-gradient-to-r from-[#F4A261] to-[#e05c3c] hover:from-[#e05c3c] hover:to-[#c9492b] text-white shadow-sm hover:shadow-md active:scale-95"
                        }`}
                      >
                        <CalendarCheck className="w-3.5 h-3.5" />
                        {room.isBooked ? "Đã hết" : "Đặt phòng"}
                      </button>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      )}
    </section>
  );
}
