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
import { getVietnamToday, getVietnamTomorrow, addDaysToIso } from "~/lib/dates";

export default function RoomsCatalogPage() {
  const today = getVietnamToday();
  const tomorrow = getVietnamTomorrow();

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
      const nextDay = addDaysToIso(val, 1);
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
    <div className="min-h-screen bg-[#000000] text-white flex flex-col w-full max-w-full overflow-x-hidden min-w-0 selection:bg-[#0070d1] selection:text-white">
      <Navbar
        onOpenBookingModal={() => handleOpenBooking()}
        onOpenAuthModal={() => setAuthModalOpen(true)}
        onOpenMyBookingsModal={() => setMyBookingsModalOpen(true)}
      />

      {/* Chapter 1: Dark Cinematic Header */}
      <section className="relative h-[42vh] min-h-[340px] w-full flex items-center justify-center text-center overflow-hidden bg-[#000000]">
        <Image
          src="/images/DH_01968-Pano-Edit-700x466.jpg"
          alt="Hệ thống phòng M_Dalats Villa"
          fill
          priority
          className="object-cover filter brightness-[0.55]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-[#000000]/60 to-black/30" />

        <div className="relative z-10 px-4 max-w-3xl mx-auto text-white">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#53b1ff] text-[11px] uppercase tracking-[1.5px] font-semibold mb-3">
            <span>Không gian lưu trú • M_Dalats Villa</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-light tracking-[-0.1px] leading-[1.15]">
            Hệ Thống 11 Phòng Nghỉ
          </h1>
          <p className="text-xs sm:text-sm text-white/70 font-light mt-3 max-w-xl mx-auto leading-relaxed">
            Mỗi căn phòng tại M_Dalats Villa đều được bài trí riêng biệt, mang vẻ đẹp bình yên và ngập tràn ánh nắng xứ sở sương mù.
          </p>
          <p className="text-xs uppercase tracking-[2px] text-[#53b1ff] font-medium mt-2">
            STAY CLOSE TO NATURE
          </p>
        </div>
      </section>

      {/* Chapter 2: Catalog Section on Pure Black Canvas */}
      <section className="bg-[#000000] py-10 sm:py-14 border-t border-white/10 flex-1 w-full min-w-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 w-full min-w-0">
          {/* Full Interactive Search Form */}
          <form
            onSubmit={handleSearchSubmit}
            className="bg-[#181818] p-5 sm:p-6 rounded-[8px] border border-white/10 mb-8 grid grid-cols-1 xs:grid-cols-2 md:grid-cols-5 gap-3.5 items-end w-full min-w-0 shadow-none"
          >
            {/* Check-in */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-wider text-white/70 font-semibold flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#0070d1]" />
                <span>Nhận phòng</span>
              </label>
              <input
                type="date"
                value={checkIn}
                min={today}
                onChange={(e) => handleCheckInChange(e.target.value)}
                className="w-full bg-[#121314] border border-white/20 px-3 py-2 text-xs sm:text-sm text-white font-medium rounded-[4px] focus:outline-none focus:border-[#0070d1] focus:ring-1 focus:ring-[#0070d1] h-11"
              />
            </div>

            {/* Check-out */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-wider text-white/70 font-semibold flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#0070d1]" />
                <span>Trả phòng</span>
              </label>
              <input
                type="date"
                value={checkOut}
                min={checkIn || today}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full bg-[#121314] border border-white/20 px-3 py-2 text-xs sm:text-sm text-white font-medium rounded-[4px] focus:outline-none focus:border-[#0070d1] focus:ring-1 focus:ring-[#0070d1] h-11"
              />
            </div>

            {/* Adults */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-wider text-white/70 font-semibold flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#0070d1]" />
                <span>Người lớn</span>
              </label>
              <select
                value={adults}
                onChange={(e) => setAdults(Number(e.target.value))}
                className="w-full bg-[#121314] border border-white/20 px-3 py-2 text-xs sm:text-sm text-white font-medium rounded-[4px] focus:outline-none focus:border-[#0070d1] focus:ring-1 focus:ring-[#0070d1] h-11"
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num} className="bg-[#181818] text-white">
                    {num} Người lớn
                  </option>
                ))}
              </select>
            </div>

            {/* Children */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-wider text-white/70 font-semibold flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#0070d1]" />
                <span>Trẻ em (&lt;12t)</span>
              </label>
              <select
                value={children}
                onChange={(e) => setChildren(Number(e.target.value))}
                className="w-full bg-[#121314] border border-white/20 px-3 py-2 text-xs sm:text-sm text-white font-medium rounded-[4px] focus:outline-none focus:border-[#0070d1] focus:ring-1 focus:ring-[#0070d1] h-11"
              >
                {[0, 1, 2, 3].map((num) => (
                  <option key={num} value={num} className="bg-[#181818] text-white">
                    {num} Trẻ em
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Search */}
            <div>
              <button
                type="submit"
                className="w-full bg-[#0070d1] hover:bg-[#0064b7] active:bg-[#004d8d] text-white text-xs sm:text-sm font-bold tracking-[0.324px] py-2 px-4 rounded-full flex items-center justify-center gap-2 transition-all cursor-pointer h-11 shadow-none"
              >
                <Search className="w-4 h-4 text-white" />
                <span>Tìm phòng trống</span>
              </button>
            </div>
          </form>

          {/* Secondary Filter & Sort Bar */}
          <div className="bg-[#181818] p-3.5 sm:p-4 rounded-[8px] border border-white/10 mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3.5 w-full min-w-0 shadow-none">
            {/* Floor tabs - PlayStation filter-pill style */}
            <div className="flex overflow-x-auto no-scrollbar items-center gap-2 w-full md:w-auto max-w-full min-w-0">
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
                  className={`px-4 py-2 text-xs rounded-full transition-all cursor-pointer font-bold whitespace-nowrap shrink-0 tracking-[0.2px] ${
                    filterFloor === tab.id
                      ? "bg-white text-[#000000]"
                      : "bg-white/10 text-white/70 hover:text-white hover:bg-white/20"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search text & sort controls */}
            <div className="flex flex-wrap items-center justify-end gap-2.5">
              {searchActive && (
                <label className="flex items-center gap-1.5 text-xs text-white/70 cursor-pointer mr-1">
                  <input
                    type="checkbox"
                    checked={onlyAvailable}
                    onChange={(e) => setOnlyAvailable(e.target.checked)}
                    className="w-3.5 h-3.5 accent-[#0070d1] rounded-[4px]"
                  />
                  <span className="text-[11px] font-medium text-white">Chỉ hiện phòng trống</span>
                </label>
              )}

              {/* Sort Selector */}
              <div className="relative inline-flex items-center">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-[#121314] border border-white/20 px-3 py-1.5 text-xs text-white font-medium rounded-[4px] focus:outline-none focus:border-[#0070d1] pr-7 appearance-none cursor-pointer h-9"
                >
                  <option value="default">Sắp xếp: Mặc định</option>
                  <option value="price-asc">Giá: Thấp đến cao</option>
                  <option value="price-desc">Giá: Cao đến thấp</option>
                  <option value="area-desc">Diện tích: Lớn nhất</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-white/60 absolute right-2 pointer-events-none" />
              </div>

              {/* Keyword Input */}
              <div className="relative w-full sm:w-56">
                <Search className="w-3.5 h-3.5 text-white/50 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm tên phòng, view..."
                  className="w-full bg-[#121314] border border-white/20 pl-8 pr-3 py-1.5 text-xs text-white rounded-[4px] focus:outline-none focus:border-[#0070d1] h-9"
                />
              </div>

              {(searchActive || searchTerm || filterFloor !== "all") && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="p-2 bg-[#121314] border border-white/20 text-white/70 hover:text-white rounded-full transition-colors cursor-pointer"
                  title="Xóa bộ lọc và xem tất cả"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Room Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-[#181818] rounded-[8px] overflow-hidden border border-white/10 animate-pulse">
                  <div className="h-64 bg-white/5" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-white/5 w-1/3 rounded-[4px]" />
                    <div className="h-6 bg-white/5 w-2/3 rounded-[4px]" />
                    <div className="h-4 bg-white/5 w-full rounded-[4px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredRooms.length === 0 ? (
            <div className="bg-[#181818] border border-white/10 rounded-[8px] p-8 sm:p-12 text-center max-w-xl mx-auto my-6 shadow-none">
              <div className="w-14 h-14 bg-[#121314] text-[#0070d1] rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                <AlertCircle className="w-7 h-7" />
              </div>
              <h3 className="text-2xl text-white font-light tracking-[0.1px] mb-2">
                Không tìm thấy phòng phù hợp
              </h3>
              <p className="text-xs sm:text-sm text-white/60 leading-relaxed mb-6 font-normal">
                {searchActive
                  ? `Không có phòng nào đáp ứng đủ ${adults} người lớn hoặc phòng đã kín trong khoảng ngày ${checkIn} → ${checkOut}.`
                  : "Không tìm thấy phòng nào phù hợp với từ khóa hoặc bộ lọc đã chọn."}
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="bg-[#0070d1] hover:bg-[#0064b7] text-white text-xs font-bold px-6 py-2.5 rounded-full transition-colors cursor-pointer tracking-[0.324px]"
                >
                  Xem lại tất cả 11 phòng
                </button>
                <a
                  href="tel:0939014234"
                  className="border border-white/20 bg-[#121314] text-white hover:bg-white/10 text-xs font-bold px-6 py-2.5 rounded-full transition-colors flex items-center gap-2 cursor-pointer tracking-[0.324px]"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-[#53b1ff]" />
                  <span>Hotline 0939 014 234</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredRooms.map((room) => {
                const fits = room.fitsCapacity !== false;

                return (
                  <div
                    key={room.id}
                    className="group bg-[#181818] rounded-[8px] overflow-hidden border border-white/10 hover:border-white/25 transition-all duration-300 flex flex-col justify-between shadow-none"
                  >
                    <div>
                      {/* Photo */}
                      <div className="relative h-64 w-full overflow-hidden bg-[#121314]">
                        <Image
                          src={room.image}
                          alt={room.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />

                        {/* Price Badge */}
                        <div className="absolute top-3.5 right-3.5 bg-[#000000]/80 backdrop-blur-md px-3.5 py-1.5 rounded-[6px] border border-white/10 text-right">
                          <span className="text-[9px] uppercase tracking-wider text-white/60 block">Giá từ</span>
                          <span className="text-xs sm:text-sm font-bold text-[#53b1ff]">
                            {formatPrice(room.pricePerNight)}
                          </span>
                          <span className="text-[9px] text-white/60"> / đêm</span>

                          {searchActive && totalNights > 1 && (
                            <div className="border-t border-white/10 mt-0.5 pt-0.5">
                              <span className="text-[9px] text-white font-semibold block">
                                {totalNights} đêm: {formatPrice(room.pricePerNight * totalNights)}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Status & View tag */}
                        <div className="absolute bottom-3.5 left-3.5 flex flex-col gap-1.5 items-start">
                          <div className="bg-[#000000]/80 backdrop-blur-md text-white text-[10px] px-3 py-1 rounded-full font-semibold border border-white/10">
                            {room.viewType}
                          </div>

                          {searchActive ? (
                            <div>
                              {room.isBooked ? (
                                <span className="bg-red-950/80 text-red-200 border border-red-800 text-[10px] px-2.5 py-0.5 rounded-full font-semibold">
                                  🔒 Đã kín phòng ngày này
                                </span>
                              ) : !fits ? (
                                <span className="bg-white/10 text-white/80 border border-white/20 text-[10px] px-2.5 py-0.5 rounded-full font-semibold">
                                  Tối đa {room.maxAdults} người lớn
                                </span>
                              ) : (
                                <span className="bg-[#0070d1] text-white text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                                  ✓ Phòng trống sẵn sàng
                                </span>
                              )}
                            </div>
                          ) : (
                            <div>
                              {room.isOccupiedToday ? (
                                <span className="bg-white/10 text-white/80 border border-white/20 text-[10px] px-2.5 py-0.5 rounded-full font-semibold">
                                  Có khách lưu trú
                                </span>
                              ) : !room.isAvailable ? (
                                <span className="bg-white/10 text-white/50 border border-white/20 text-[10px] px-2.5 py-0.5 rounded-full font-semibold">
                                  Tạm đóng / Bảo trì
                                </span>
                              ) : (
                                <span className="bg-[#0070d1] text-white text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                                  Sẵn sàng đón khách
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Room Content */}
                      <div className="p-5">
                        <h3 className="text-xl font-light text-white group-hover:text-[#53b1ff] transition-colors tracking-[0.1px]">
                          {room.name}
                        </h3>

                        {/* Room Attributes */}
                        <div className="flex items-center gap-3.5 text-xs text-white/60 my-3 py-2 border-y border-white/10">
                          <span className="flex items-center gap-1.5">
                            <Maximize2 className="w-3.5 h-3.5 text-[#0070d1]" />
                            {room.area} m²
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-[#0070d1]" />
                            {room.maxAdults} Lớn, {room.maxChildren} Trẻ
                          </span>
                          <span className="flex items-center gap-1.5 truncate">
                            <Bed className="w-3.5 h-3.5 text-[#0070d1] flex-shrink-0" />
                            <span className="truncate">{room.bedType}</span>
                          </span>
                        </div>

                        <p className="text-xs text-white/60 font-normal line-clamp-2 leading-relaxed">
                          {room.shortDescription || room.description}
                        </p>
                      </div>
                    </div>

                    {/* Actions: Outlined Detail Pill + Commerce Orange Booking Pill */}
                    <div className="p-5 pt-0 grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setSelectedRoomForDetail(room)}
                        className="border border-white/20 bg-transparent hover:bg-white/10 text-white text-xs font-bold py-2.5 px-3 rounded-full flex items-center justify-center gap-1.5 transition-colors cursor-pointer h-10 tracking-[0.324px]"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Chi tiết
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenBooking(room)}
                        disabled={room.isBooked || !room.isAvailable}
                        className={`text-xs font-bold py-2.5 px-3 rounded-full flex items-center justify-center gap-1.5 transition-colors cursor-pointer h-10 tracking-[0.324px] shadow-none ${
                          room.isBooked || !room.isAvailable
                            ? "bg-white/10 text-white/40 border border-white/10 cursor-not-allowed"
                            : "bg-[#d53b00] hover:bg-[#aa2f00] active:bg-[#aa2f00] text-white"
                        }`}
                      >
                        <CalendarCheck className="w-3.5 h-3.5" />
                        <span>
                          {!room.isAvailable
                            ? "Tạm đóng"
                            : room.isBooked
                            ? "Đã kín lịch"
                            : "Đặt phòng"}
                        </span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Chapter 3: Signature PlayStation Blue Footer */}
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
