"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "~/components/Navbar";
import { Footer } from "~/components/Footer";
import { BookingModal } from "~/components/BookingModal";
import { RoomDetailModal } from "~/components/RoomDetailModal";
import { AuthModal } from "~/components/AuthModal";
import { MyBookingsModal } from "~/components/MyBookingsModal";
import { api } from "~/trpc/react";
import {
  Bed,
  Maximize2,
  Users,
  Eye,
  CalendarCheck,
  Search,
  Calendar,
  ChevronDown,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  PhoneCall,
  SlidersHorizontal,
} from "lucide-react";
import type { Room } from "~/server/db/schema";

export default function RoomsCatalogPage() {
  const today = new Date().toISOString().split("T")[0] ?? "2026-10-19";
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0] ?? "2026-10-20";

  const [filterFloor, setFilterFloor] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [checkIn, setCheckIn] = useState<string>(today);
  const [checkOut, setCheckOut] = useState<string>(tomorrow);
  const [adults, setAdults] = useState<number>(2);
  const [children, setChildren] = useState<number>(0);
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc" | "area-desc">("default");
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(true);
  const [searchActive, setSearchActive] = useState<boolean>(false);

  const [selectedRoomForDetail, setSelectedRoomForDetail] = useState<Room | null>(null);
  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState<Room | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [myBookingsModalOpen, setMyBookingsModalOpen] = useState(false);

  // Live query from TRPC
  const searchQuery = api.room.search.useQuery({
    checkIn: searchActive ? checkIn : undefined,
    checkOut: searchActive ? checkOut : undefined,
    adults: searchActive ? adults : 2,
    children: searchActive ? children : 0,
    floor: filterFloor,
    sortBy,
  });

  const { data: rawRooms = [], isLoading } = searchQuery;

  const handleCheckInChange = (val: string) => {
    setCheckIn(val);
    if (checkOut <= val) {
      const nextDay = new Date(new Date(val).getTime() + 86400000).toISOString().split("T")[0] ?? val;
      setCheckOut(nextDay);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchActive(true);
  };

  const handleClearFilters = () => {
    setSearchActive(false);
    setFilterFloor("all");
    setSearchTerm("");
    setSortBy("default");
    setOnlyAvailable(false);
    setCheckIn(today);
    setCheckOut(tomorrow);
    setAdults(2);
    setChildren(0);
  };

  // Filter with local search term
  const filteredRooms = rawRooms.filter((r) => {
    // If onlyAvailable is toggled on when searching
    if (searchActive && onlyAvailable) {
      if (!r.isAvailableForDates || !r.fitsCapacity) return false;
    }

    if (searchTerm.trim() !== "") {
      const q = searchTerm.toLowerCase();
      const match =
        r.name.toLowerCase().includes(q) ||
        r.viewType.toLowerCase().includes(q) ||
        (r.shortDescription && r.shortDescription.toLowerCase().includes(q));
      if (!match) return false;
    }

    return true;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " ₫";
  };

  const totalNights = React.useMemo(() => {
    const d1 = new Date(checkIn);
    const d2 = new Date(checkOut);
    const diff = Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  }, [checkIn, checkOut]);

  const handleOpenBooking = (room?: Room) => {
    setSelectedRoomForBooking(room || rawRooms[0] || null);
    setBookingModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#faf7f1] text-[#222222] flex flex-col">
      <Navbar
        onOpenBookingModal={() => handleOpenBooking()}
        onOpenAuthModal={() => setAuthModalOpen(true)}
        onOpenMyBookingsModal={() => setMyBookingsModalOpen(true)}
      />

      {/* Header Banner */}
      <div className="relative h-[40vh] min-h-[300px] w-full flex items-center justify-center text-center overflow-hidden">
        <Image
          src="/images/DH_01968-Pano-Edit-700x466.jpg"
          alt="Hệ thống phòng M_Dalats Villa"
          fill
          priority
          className="object-cover filter brightness-[0.7]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/35 to-black/35" />

        <div className="relative z-10 px-4 max-w-3xl mx-auto text-white">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#faf7f1]/80 font-medium block mb-2">
            Không gian lưu trú • M_Dalats Villa
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal tracking-wide">
            Hệ Thống 11 Phòng Nghỉ
          </h1>
          <p className="font-sans text-xs sm:text-sm text-[#faf7f1]/90 font-light mt-2 max-w-xl mx-auto leading-relaxed">
            Mỗi căn phòng tại M_Dalats Villa đều được bài trí riêng biệt, mang vẻ đẹp bình yên và ngập tràn ánh nắng xứ sở sương mù.
          </p>
          <p className="font-script text-xl sm:text-2xl text-[#F4A261] mt-2 font-normal drop-shadow-sm">
            “Đà Lạt – Nơi những kỷ niệm đẹp bắt đầu”
          </p>
        </div>
      </div>

      {/* Filter and Catalog Section (Aligned with 6xl container) */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10 flex-1 w-full">
        {/* Full Interactive Search Form */}
        <form
          onSubmit={handleSearchSubmit}
          className="bg-white p-4 sm:p-5 rounded-md border border-[#ece7dd] shadow-sm mb-6 grid grid-cols-1 xs:grid-cols-2 md:grid-cols-5 gap-3 items-end"
        >
          {/* Check-in */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-wider text-[#367156] font-semibold flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#367156]" />
              <span>Nhận phòng</span>
            </label>
            <input
              type="date"
              value={checkIn}
              min={today}
              onChange={(e) => handleCheckInChange(e.target.value)}
              className="w-full bg-[#FAF9F6] border border-[#d6cebf] px-3 py-1.5 text-base sm:text-xs text-[#222222] font-medium rounded-xs focus:outline-hidden focus:border-[#367156] min-h-[42px] sm:min-h-0"
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
              value={checkOut}
              min={checkIn || today}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full bg-[#FAF9F6] border border-[#d6cebf] px-3 py-1.5 text-base sm:text-xs text-[#222222] font-medium rounded-xs focus:outline-hidden focus:border-[#367156] min-h-[42px] sm:min-h-0"
            />
          </div>

          {/* Adults */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-wider text-[#367156] font-semibold flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#367156]" />
              <span>Người lớn</span>
            </label>
            <select
              value={adults}
              onChange={(e) => setAdults(Number(e.target.value))}
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
              value={children}
              onChange={(e) => setChildren(Number(e.target.value))}
              className="w-full bg-[#FAF9F6] border border-[#d6cebf] px-3 py-1.5 text-base sm:text-xs text-[#222222] font-medium rounded-xs focus:outline-hidden focus:border-[#367156] min-h-[42px] sm:min-h-0"
            >
              {[0, 1, 2, 3].map((num) => (
                <option key={num} value={num}>
                  {num} Trẻ em
                </option>
              ))}
            </select>
          </div>

          {/* Submit Search */}
          <div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#367156] to-[#498b6c] hover:from-[#498b6c] hover:to-[#367156] text-white text-xs uppercase tracking-wider font-semibold py-2 px-4 rounded-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer min-h-[42px] sm:min-h-[34px]"
            >
              <Search className="w-3.5 h-3.5 text-[#F4A261]" />
              <span>Tìm phòng trống</span>
            </button>
          </div>
        </form>

        {/* Secondary Filter & Sort Bar */}
        <div className="bg-white p-3.5 sm:p-4 rounded-md border border-[#ece7dd] shadow-2xs mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Floor tabs */}
          <div className="flex overflow-x-auto no-scrollbar items-center gap-1.5">
            {[
              { id: "all", label: "Tất cả (11)" },
              { id: "0", label: "Tầng trệt & Vườn (2)" },
              { id: "1", label: "Tầng 1 ban công (5)" },
              { id: "2", label: "Tầng 2 áp mái Suite (4)" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterFloor(tab.id)}
                className={`px-3 sm:px-3.5 py-1.5 text-[11px] uppercase tracking-wider rounded-full transition-all cursor-pointer font-medium whitespace-nowrap shrink-0 ${
                  filterFloor === tab.id
                    ? "bg-[#367156] text-white shadow-xs"
                    : "bg-[#faf7f1] border border-[#ece7dd] text-[#555555] hover:border-[#367156] hover:text-[#367156]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search text & sort controls */}
          <div className="flex flex-wrap items-center justify-end gap-2.5">
            {searchActive && (
              <label className="flex items-center gap-1.5 text-xs text-[#555555] cursor-pointer mr-1">
                <input
                  type="checkbox"
                  checked={onlyAvailable}
                  onChange={(e) => setOnlyAvailable(e.target.checked)}
                  className="w-3.5 h-3.5 accent-[#367156] rounded-xs"
                />
                <span className="text-[11px] font-medium">Chỉ hiện phòng trống</span>
              </label>
            )}

            {/* Sort Selector */}
            <div className="relative inline-flex items-center">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#faf7f1] border border-[#d6cebf] px-2.5 py-1.5 text-xs text-[#222222] font-medium rounded-xs focus:outline-hidden focus:border-[#367156] pr-6 appearance-none cursor-pointer"
              >
                <option value="default">Sắp xếp: Mặc định</option>
                <option value="price-asc">Giá: Thấp đến cao</option>
                <option value="price-desc">Giá: Cao đến thấp</option>
                <option value="area-desc">Diện tích: Lớn nhất</option>
              </select>
              <ChevronDown className="w-3 h-3 text-[#888888] absolute right-2 pointer-events-none" />
            </div>

            {/* Keyword Input */}
            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 text-[#888888] absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm tên phòng, view..."
                className="w-full bg-[#faf7f1] border border-[#d6cebf] pl-8 pr-3 py-1.5 text-xs text-[#222222] rounded-xs focus:outline-hidden focus:border-[#367156]"
              />
            </div>

            {(searchActive || searchTerm || filterFloor !== "all") && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="p-1.5 bg-[#faf7f1] border border-[#d6cebf] text-[#666666] hover:text-red-700 rounded-xs transition-colors cursor-pointer"
                title="Xóa bộ lọc và xem tất cả"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Room Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-sm overflow-hidden border border-[#ece7dd] animate-pulse">
                <div className="h-64 bg-[#f0e9dc]" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-[#f0e9dc] w-1/3" />
                  <div className="h-6 bg-[#f0e9dc] w-2/3" />
                  <div className="h-4 bg-[#f0e9dc] w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="bg-white border border-[#ece7dd] rounded-md p-8 sm:p-12 text-center max-w-xl mx-auto shadow-xs my-6">
            <div className="w-14 h-14 bg-amber-50 text-[#F4A261] rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-200">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-2xl text-[#367156] font-normal mb-2">
              Không tìm thấy phòng phù hợp
            </h3>
            <p className="text-xs sm:text-sm text-[#666666] leading-relaxed mb-6 font-light">
              {searchActive
                ? `Không có phòng nào đáp ứng đủ ${adults} người lớn hoặc phòng đã kín trong khoảng ngày ${checkIn} → ${checkOut}.`
                : "Không tìm thấy phòng nào phù hợp với từ khóa hoặc bộ lọc đã chọn."}
            </p>
            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={handleClearFilters}
                className="bg-[#367156] text-white text-xs uppercase tracking-wider font-semibold px-4 py-2.5 rounded-sm hover:bg-[#498b6c] transition-colors cursor-pointer"
              >
                Xem lại tất cả 11 phòng
              </button>
              <a
                href="tel:0939014234"
                className="border border-[#367156] text-[#367156] hover:bg-[#FAF9F6] text-xs uppercase tracking-wider font-semibold px-4 py-2.5 rounded-sm transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5 text-[#367156]" />
                <span>Hotline 0939 014 234</span>
              </a>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRooms.map((room) => {
              const isAvailable = room.isAvailableForDates !== false;
              const fits = room.fitsCapacity !== false;

              return (
                <div
                  key={room.id}
                  className="group bg-white rounded-md overflow-hidden border border-[#ece7dd] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Photo with direct link to detail page */}
                    <div className="relative h-64 w-full overflow-hidden bg-[#faf7f1]">
                      <Image
                        src={room.image}
                        alt={room.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />

                      <div className="absolute top-3.5 right-3.5 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-sm shadow-md border border-[#ece7dd] text-right">
                        <span className="text-[9px] uppercase tracking-wider text-[#777777] block">Giá từ</span>
                        <span className="text-xs sm:text-sm font-bold text-[#367156]">
                          {formatPrice(room.pricePerNight)}
                        </span>
                        <span className="text-[9px] text-[#777777]"> / đêm</span>

                        {searchActive && totalNights > 1 && (
                          <div className="border-t border-[#ece7dd] mt-0.5 pt-0.5">
                            <span className="text-[9px] text-[#367156] font-semibold block">
                              {totalNights} đêm: {formatPrice(room.pricePerNight * totalNights)}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="absolute bottom-3.5 left-3.5 flex flex-col gap-1 items-start">
                        <div className="bg-[#367156]/90 backdrop-blur-xs text-white text-[10px] px-3 py-0.5 rounded-full font-light tracking-wide">
                          {room.viewType}
                        </div>

                        {searchActive && (
                          <div>
                            {room.isBooked ? (
                              <span className="bg-red-800/90 text-white text-[9px] px-2 py-0.5 rounded-full font-medium shadow-xs">
                                ✕ Đã kín phòng ngày này
                              </span>
                            ) : !fits ? (
                              <span className="bg-amber-700/90 text-white text-[9px] px-2 py-0.5 rounded-full font-medium shadow-xs">
                                Tối đa {room.maxAdults} người lớn
                              </span>
                            ) : (
                              <span className="bg-emerald-800/90 text-white text-[9px] px-2 py-0.5 rounded-full font-medium shadow-xs">
                                ✓ Phòng trống sẵn sàng
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Room Content */}
                    <div className="p-5">
                      <h3 className="font-serif text-2xl text-[#222222] group-hover:text-[#367156] transition-colors font-medium">
                        {room.name}
                      </h3>

                      {/* Room Attributes */}
                      <div className="flex items-center gap-3.5 text-xs text-[#666666] my-3 py-2 border-y border-[#ece7dd]/60 font-sans">
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

                      <p className="text-xs text-[#666666] font-light line-clamp-2 leading-relaxed">
                        {room.shortDescription || room.description}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-5 pt-0 grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setSelectedRoomForDetail(room)}
                      className="border border-[#367156] text-[#367156] hover:bg-[#faf7f1] text-[11px] uppercase tracking-wider font-medium py-2 px-2.5 rounded-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Chi tiết
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenBooking(room)}
                      disabled={room.isBooked}
                      className={`text-[11px] uppercase tracking-wider font-medium py-2 px-2.5 rounded-sm flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer ${
                        room.isBooked
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-[#f27052] hover:bg-[#e05c3c] text-white"
                      }`}
                    >
                      <CalendarCheck className="w-3.5 h-3.5" />
                      {room.isBooked ? "Đã hết" : "Đặt phòng"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />

      {/* Modals */}
      <RoomDetailModal
        room={selectedRoomForDetail}
        onClose={() => setSelectedRoomForDetail(null)}
        onBookRoom={(r) => handleOpenBooking(r)}
      />

      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        selectedRoom={selectedRoomForBooking}
        rooms={rawRooms}
        initialCheckIn={searchActive ? checkIn : undefined}
        initialCheckOut={searchActive ? checkOut : undefined}
        initialAdults={searchActive ? adults : undefined}
        initialChildren={searchActive ? children : undefined}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      <MyBookingsModal
        isOpen={myBookingsModalOpen}
        onClose={() => setMyBookingsModalOpen(false)}
      />
    </div>
  );
}
