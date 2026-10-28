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
  RotateCcw,
  AlertCircle,
  PhoneCall,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import type { Room } from "~/server/db/schema";
import { api } from "~/trpc/react";
import { FadeIn, StaggerContainer, StaggerItem, SectionStack } from "./MotionWrapper";
import { getVietnamToday, getVietnamTomorrow, addDaysToIso } from "~/lib/dates";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";

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
  const today = getVietnamToday();
  const tomorrow = getVietnamTomorrow();

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

  useEffect(() => {
    if (searchParams) {
      setLocalCheckIn(searchParams.checkIn);
      setLocalCheckOut(searchParams.checkOut);
      setLocalAdults(searchParams.adults);
      setLocalChildren(searchParams.children);
    }
  }, [searchParams]);

  const handleCheckInChange = (val: string) => {
    setLocalCheckIn(val);
    if (localCheckOut <= val) {
      const nextDay = addDaysToIso(val, 1);
      setLocalCheckOut(nextDay);
    }
  };

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

  const totalNights = React.useMemo(() => {
    if (!searchParams?.checkIn || !searchParams?.checkOut) return 1;
    const d1 = new Date(searchParams.checkIn);
    const d2 = new Date(searchParams.checkOut);
    const diff = Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  }, [searchParams?.checkIn, searchParams?.checkOut]);

  let displayRooms: Array<
    Room & {
      fitsCapacity?: boolean;
      isBooked?: boolean;
      isAvailableForDates?: boolean;
      isOccupiedToday?: boolean;
      occupancy?: unknown;
      conflictingBookingDisplay?: string | null;
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
      if (onlyAvailable) {
        return r.isAvailableForDates && r.fitsCapacity;
      }
      return true;
    });
  } else {
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
    } else if (sortBy === "rating-desc") {
      displayRooms.sort((a, b) => (b.reviewScore || 9) - (a.reviewScore || 9));
    }
  }

  return (
    /* Chapter 3: Full-bleed Dark Canvas Band (Pure Black #000000, PlayStation Games Rail Style) */
    <SectionStack id="rooms" index={50} sticky={false} fullHeight={false} dark className="section-stack-dark py-20 sm:py-28 bg-[#000000] text-white border-b border-white/10 scroll-mt-20">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header: PlayStation SST 300 Light Headline */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <FadeIn direction="up">
              <span className="text-[12px] font-bold uppercase tracking-[1.5px] text-[#53b1ff] block mb-2">
                Hệ thống phòng nghỉ độc bản
              </span>
            </FadeIn>
            <FadeIn direction="up" delay={0.1}>
              <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-light text-white tracking-tight leading-[1.2]">
                Khám phá các hạng phòng tại M_Dalats
              </h2>
            </FadeIn>
            <FadeIn direction="up" delay={0.15}>
              <p className="text-neutral-400 text-sm sm:text-base mt-2 max-w-2xl font-normal leading-relaxed">
                Tất cả 11 phòng nghỉ đều sở hữu ban công hoặc cửa kính lớn hướng đồi thông Khe Sanh, trang bị đầy đủ tiện nghi tiêu chuẩn cao cấp.
              </p>
            </FadeIn>
          </div>

          {/* Quick Date Change Trigger Pill */}
          <FadeIn direction="up" delay={0.2} className="shrink-0">
            <Button
              variant="outline"
              onClick={() => setShowSearchBox(!showSearchBox)}
              className="border-white/20 text-white hover:bg-white/10 rounded-full h-11 px-5 text-xs font-bold gap-2"
            >
              <Calendar className="w-3.5 h-3.5 text-[#53b1ff]" />
              <span>{showSearchBox ? "Thu gọn ngày tìm kiếm" : "Đổi ngày & số lượng khách"}</span>
            </Button>
          </FadeIn>
        </div>

        {/* Current Search Banner */}
        {searchParams && (
          <FadeIn direction="down">
            <div className="mb-8 p-4 bg-[#121314] rounded-[8px] border border-white/15 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#0070d1] animate-pulse" />
                <span className="text-neutral-300">
                  Lịch tìm kiếm: <strong className="text-white font-semibold">{formatDateDisplay(searchParams.checkIn)} → {formatDateDisplay(searchParams.checkOut)}</strong> ({totalNights} đêm) • <strong className="text-white font-semibold">{searchParams.adults} người lớn{searchParams.children > 0 ? `, ${searchParams.children} trẻ em` : ""}</strong>
                </span>
              </div>
              {onClearSearch && (
                <button
                  type="button"
                  onClick={() => {
                    setFilterFloor("all");
                    setOnlyAvailable(false);
                    onClearSearch();
                  }}
                  className="px-4 py-1.5 bg-white/10 hover:bg-white/15 text-xs font-bold text-neutral-300 hover:text-white rounded-full flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Xem tất cả</span>
                </button>
              )}
            </div>
          </FadeIn>
        )}

        {/* Expandable Search Inputs Bar */}
        {showSearchBox && (
          <FadeIn direction="up">
            <form
              onSubmit={handleSearchSubmit}
              className="mb-8 p-5 bg-[#181818] rounded-[8px] border border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 items-end"
            >
              <div>
                <label className="text-[11px] uppercase tracking-[1px] text-neutral-400 font-bold block mb-1">
                  Nhận phòng
                </label>
                <input
                  type="date"
                  value={localCheckIn}
                  min={today}
                  onChange={(e) => handleCheckInChange(e.target.value)}
                  className="w-full bg-[#121314] border border-white/20 px-3 py-2 text-xs text-white font-medium rounded-[4px] focus:outline-none focus:border-[#0070d1] min-h-[44px]"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-[1px] text-neutral-400 font-bold block mb-1">
                  Trả phòng
                </label>
                <input
                  type="date"
                  value={localCheckOut}
                  min={localCheckIn || today}
                  onChange={(e) => setLocalCheckOut(e.target.value)}
                  className="w-full bg-[#121314] border border-white/20 px-3 py-2 text-xs text-white font-medium rounded-[4px] focus:outline-none focus:border-[#0070d1] min-h-[44px]"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-[1px] text-neutral-400 font-bold block mb-1">
                  Người lớn
                </label>
                <select
                  value={localAdults}
                  onChange={(e) => setLocalAdults(Number(e.target.value))}
                  className="w-full bg-[#121314] border border-white/20 px-3 py-2 text-xs text-white font-medium rounded-[4px] focus:outline-none focus:border-[#0070d1] min-h-[44px]"
                >
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <option key={num} value={num} className="bg-[#181818] text-white">
                      {num} Người lớn
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-[1px] text-neutral-400 font-bold block mb-1">
                  Trẻ em
                </label>
                <select
                  value={localChildren}
                  onChange={(e) => setLocalChildren(Number(e.target.value))}
                  className="w-full bg-[#121314] border border-white/20 px-3 py-2 text-xs text-white font-medium rounded-[4px] focus:outline-none focus:border-[#0070d1] min-h-[44px]"
                >
                  {[0, 1, 2, 3].map((num) => (
                    <option key={num} value={num} className="bg-[#181818] text-white">
                      {num} Trẻ em
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Button
                  type="submit"
                  variant="commerce"
                  className="w-full h-11 bg-[#d53b00] hover:bg-[#aa2f00] text-white text-xs font-bold rounded-full gap-2"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Cập nhật tìm kiếm</span>
                </Button>
              </div>
            </form>
          </FadeIn>
        )}

        {/* Filter and Sorting Toolbar: PlayStation Filter Pills */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8 pb-4 border-b border-white/10 w-full min-w-0">
          {/* Floor Filter Tabs (filter-pill style) */}
          <div className="flex overflow-x-auto no-scrollbar items-center gap-2 p-1 w-full md:w-auto max-w-full min-w-0">
            {[
              { id: "all", label: "Tất cả phòng" },
              { id: "0", label: "Tầng trệt & Ban công sân vườn" },
              { id: "1", label: "Tầng 1 (View Rừng Thông)" },
              { id: "2", label: "Tầng 2 (Áp mái Suite lãng mạn)" },
            ].map((tab) => {
              const isSelected = filterFloor === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilterFloor(tab.id)}
                  className={`px-4 py-2 text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 rounded-full ${
                    isSelected
                      ? "bg-white text-black shadow-sm"
                      : "bg-white/10 text-neutral-300 hover:bg-white/15 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Sorting & Availability Toggle */}
          <div className="flex items-center justify-between md:justify-end gap-4 self-end md:self-auto w-full md:w-auto">
            {searchParams && (
              <label className="flex items-center gap-2 text-xs text-neutral-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={onlyAvailable}
                  onChange={(e) => setOnlyAvailable(e.target.checked)}
                  className="w-3.5 h-3.5 accent-[#0070d1] rounded-[2px] cursor-pointer"
                />
                <span className="text-[12px] font-medium text-white">Chỉ phòng còn trống</span>
              </label>
            )}

            {/* Sort Dropdown */}
            <div className="relative inline-flex items-center">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#181818] border border-white/20 px-4 py-2 text-xs text-white font-medium rounded-full focus:outline-none focus:border-[#0070d1] cursor-pointer pr-8 appearance-none"
              >
                <option value="default">Sắp xếp: Mặc định</option>
                <option value="popular">Nổi bật nhất</option>
                <option value="rating-desc">Đánh giá cao nhất</option>
                <option value="price-asc">Giá: Thấp đến cao</option>
                <option value="price-desc">Giá: Cao đến thấp</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-3 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Room Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-[#181818] rounded-[8px] overflow-hidden border border-white/10 animate-pulse">
                <div className="h-60 sm:h-64 bg-white/5" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-white/5 w-1/3 rounded-[4px]" />
                  <div className="h-6 bg-white/5 w-2/3 rounded-[4px]" />
                  <div className="h-3 bg-white/5 w-full rounded-[4px]" />
                  <div className="h-11 bg-white/5 w-full mt-4 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : displayRooms.length === 0 ? (
          <div className="bg-[#181818] border border-white/10 rounded-[8px] p-8 sm:p-12 text-center max-w-xl mx-auto shadow-none">
            <div className="w-14 h-14 bg-white/5 text-[#53b1ff] rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h3 className="text-2xl text-white font-light mb-2">
              Không tìm thấy phòng phù hợp
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed mb-6 font-normal">
              {searchParams ? (
                <>
                  Không có phòng nào đáp ứng đủ <strong>{searchParams.adults} người lớn</strong> hoặc phòng đã có khách đặt trong khoảng ngày <strong>{formatDateDisplay(searchParams.checkIn)} → {formatDateDisplay(searchParams.checkOut)}</strong>.
                </>
              ) : (
                "Không có phòng nào phù hợp với bộ lọc hiện tại."
              )}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              {onClearSearch && (
                <Button
                  type="button"
                  onClick={() => {
                    setFilterFloor("all");
                    setOnlyAvailable(false);
                    onClearSearch();
                  }}
                  className="bg-[#0070d1] hover:bg-[#0064b7] text-white text-xs font-bold px-6 py-2.5 rounded-full"
                >
                  Xem tất cả 11 phòng nghỉ
                </Button>
              )}
              <a
                href="tel:0939014234"
                className="border border-white/20 bg-transparent text-white hover:bg-white/10 text-xs font-bold px-6 py-2.5 rounded-full flex items-center gap-1.5 transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5 text-[#53b1ff]" />
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
                  <div className="group bg-[#181818] rounded-[8px] border border-white/10 hover:border-white/20 transition-all duration-300 flex flex-col h-full relative overflow-hidden shadow-none">
                    {/* 16:9 Cover Art */}
                    <div className="relative h-60 sm:h-64 w-full overflow-hidden bg-neutral-900">
                      <Image
                        src={room.image}
                        alt={room.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />

                      {/* Room Number Chip */}
                      <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-xs text-white px-3 py-1 rounded-full text-[11px] font-mono tracking-wider font-semibold border border-white/15">
                        No. {room.roomNumber}
                      </div>

                      {/* Price Pill */}
                      <div className="absolute top-3 right-3 bg-black/85 backdrop-blur-xs px-3.5 py-1.5 rounded-[6px] border border-white/15 text-right">
                        {room.originalPrice && room.originalPrice > room.pricePerNight && (
                          <span className="text-[10px] text-neutral-400 line-through block">
                            {formatPrice(room.originalPrice)}
                          </span>
                        )}
                        <span className="text-xs sm:text-sm font-bold text-white">
                          {formatPrice(room.pricePerNight)}
                        </span>
                        <span className="text-[10px] text-neutral-400"> / đêm</span>
                      </div>

                      {/* Status Badges */}
                      <div className="absolute bottom-3 left-3 flex flex-col gap-1 items-start">
                        <div className="bg-[#0070d1] text-white text-[10px] uppercase tracking-[1px] px-3 py-0.5 rounded-full font-bold">
                          {room.viewType}
                        </div>

                        {searchParams ? (
                          <div>
                            {room.isBooked ? (
                              <span className="inline-flex items-center gap-1 bg-[#c81b3a] text-white text-[10px] uppercase tracking-[1px] px-2.5 py-0.5 rounded-full font-bold">
                                Đã kín phòng
                              </span>
                            ) : !fits ? (
                              <span className="inline-flex items-center gap-1 bg-black/80 text-neutral-300 text-[10px] uppercase tracking-[1px] px-2.5 py-0.5 rounded-full font-bold border border-white/20">
                                Tối đa {room.maxAdults} khách
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                                ✓ Sẵn sàng đón tiếp
                              </span>
                            )}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    {/* Room Details Content */}
                    <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Rating Row */}
                        <div className="flex items-center justify-between text-xs mb-2">
                          <div className="flex items-center gap-1.5">
                            <span className="bg-[#0070d1] text-white px-2 py-0.5 rounded-full font-bold text-[10px]">
                              {room.reviewScore || 9.6}
                            </span>
                            <span className="font-medium text-neutral-200">
                              {(room.reviewScore || 9.6) >= 9.5 ? "Xuất sắc" : "Tuyệt vời"}
                            </span>
                            <span className="text-neutral-500 text-[11px]">({room.reviewCount || 128})</span>
                          </div>
                          {(room.discountPercent || 0) > 0 && (
                            <span className="bg-[#d53b00] text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                              -{room.discountPercent}%
                            </span>
                          )}
                        </div>

                        {/* Title: PlayStation SST Light */}
                        <h3 className="text-xl sm:text-2xl text-white group-hover:text-[#53b1ff] transition-colors font-light tracking-[0.1px]">
                          {room.name}
                        </h3>

                        {/* Room Specs */}
                        <div className="flex items-center gap-4 text-xs text-neutral-400 my-3 py-2 border-y border-white/10">
                          <span className="flex items-center gap-1">
                            <Maximize2 className="w-3.5 h-3.5 text-[#53b1ff]" />
                            {room.area} m²
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-[#53b1ff]" />
                            {room.maxAdults} Lớn, {room.maxChildren} Trẻ
                          </span>
                          <span className="flex items-center gap-1 truncate">
                            <Bed className="w-3.5 h-3.5 text-[#53b1ff] shrink-0" />
                            <span className="truncate">{room.bedType}</span>
                          </span>
                        </div>

                        <p className="text-xs text-neutral-400 font-normal line-clamp-2 leading-relaxed mt-2">
                          {room.shortDescription || room.description}
                        </p>
                      </div>

                      {/* Action Pill Buttons: Secondary Outline + Commerce Orange */}
                      <div className="grid grid-cols-2 gap-3 mt-6 pt-2 w-full min-w-0">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => onSelectRoom(room)}
                          className="w-full text-xs font-bold border-white/20 bg-transparent text-white hover:bg-white/10 rounded-full h-10 truncate cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 shrink-0 mr-1" />
                          <span className="truncate">Chi tiết</span>
                        </Button>

                        <Button
                          type="button"
                          variant="commerce"
                          size="sm"
                          onClick={() => onBookRoom(room, searchParams || undefined)}
                          disabled={room.isBooked || !room.isAvailable}
                          className="w-full text-xs font-bold bg-[#d53b00] hover:bg-[#aa2f00] text-white rounded-full h-10 truncate cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <CalendarCheck className="w-3.5 h-3.5 shrink-0 mr-1" />
                          <span className="truncate">
                            {!room.isAvailable
                              ? "Tạm đóng"
                              : room.isBooked
                              ? "Đã kín lịch"
                              : "Đặt phòng"}
                          </span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        )}
      </div>
    </SectionStack>
  );
}
