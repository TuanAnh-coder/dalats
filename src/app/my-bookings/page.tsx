"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "~/components/Navbar";
import { Footer } from "~/components/Footer";
import { api } from "~/trpc/react";
import { authClient } from "~/server/better-auth/client";
import {
  Calendar,
  Search,
  Phone,
  Mail,
  User,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ChevronRight,
  Sparkles,
  BedDouble,
  Users,
} from "lucide-react";

export default function MyBookingsPage() {
  const { data: session } = authClient.useSession();

  const [lookupType, setLookupType] = useState<"phone" | "code">("phone");
  const [phoneInput, setPhoneInput] = useState("");
  const [codeInput, setCodeInput] = useState("");
  const [searchedPhone, setSearchedPhone] = useState("");
  const [searchedCode, setSearchedCode] = useState("");

  // Deep links from the booking receipt: /my-bookings?code=... or ?phone=...
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code")?.trim();
    const phone = params.get("phone")?.trim();

    if (code) {
      setLookupType("code");
      setCodeInput(code);
      setSearchedCode(code);
    } else if (phone) {
      setLookupType("phone");
      setPhoneInput(phone);
      setSearchedPhone(phone);
    }
  }, []);

  // Query if logged in
  const {
    data: myBookings,
    isLoading: isMyBookingsLoading,
  } = api.booking.getMyBookings.useQuery(undefined, {
    enabled: !!session?.user,
  });

  // Query by code
  const {
    data: bookingByCode,
    isLoading: isCodeLoading,
    error: codeError,
  } = api.booking.getByCode.useQuery(
    { bookingCode: searchedCode },
    { enabled: !!searchedCode }
  );

  // Query by phone
  const {
    data: bookingsByPhone,
    isLoading: isPhoneLoading,
  } = api.booking.lookupByPhone.useQuery(
    { customerPhone: searchedPhone },
    { enabled: !!searchedPhone }
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (lookupType === "code") {
      setSearchedCode(codeInput.trim());
      setSearchedPhone("");
    } else {
      setSearchedPhone(phoneInput.trim());
      setSearchedCode("");
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#0070d1] text-white">
            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
            Đã xác nhận
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-red-950/80 text-red-300 border border-red-800">
            <XCircle className="w-3.5 h-3.5 text-red-400" />
            Đã hủy
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-amber-950/80 text-amber-300 border border-amber-800">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            Chờ xác nhận
          </span>
        );
    }
  };

  // Determine which list to display
  let displayList: any[] = [];
  let isSearching = false;

  if (session?.user && myBookings) {
    displayList = myBookings;
  } else if (searchedCode && bookingByCode) {
    displayList = [bookingByCode];
    isSearching = isCodeLoading;
  } else if (searchedPhone && bookingsByPhone) {
    displayList = bookingsByPhone;
    isSearching = isPhoneLoading;
  }

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col w-full max-w-full overflow-x-hidden min-w-0 selection:bg-[#0070d1] selection:text-white">
      <Navbar />

      {/* Chapter 1: Header Banner */}
      <section className="bg-[#000000] text-white py-14 sm:py-20 px-4 sm:px-8 text-center border-b border-white/10">
        <div className="max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[11px] uppercase tracking-[1.5px] text-[#53b1ff] mb-2 font-semibold">
            <Calendar className="w-3.5 h-3.5 text-[#0070d1]" />
            <span>Quản Lý Đặt Phòng</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-light tracking-[-0.1px] leading-[1.15]">
            Tra Cứu & Lịch Sử Đặt Phòng
          </h1>
          <p className="text-xs sm:text-sm text-white/60 font-light max-w-xl mx-auto leading-relaxed">
            Kiểm tra thông tin chi tiết các kỳ nghỉ đã đặt tại M_Dalats Villa thông qua số điện thoại hoặc mã đặt phòng của bạn.
          </p>
        </div>
      </section>

      {/* Chapter 2: Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-12 sm:py-16 flex-1 w-full space-y-12">
        {/* Lookup Box */}
        <div className="bg-[#181818] p-6 sm:p-8 rounded-[8px] border border-white/10 max-w-2xl mx-auto shadow-none">
          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl text-white font-light tracking-[0.1px]">
              Tra cứu thông tin đặt phòng
            </h2>
            <p className="text-xs text-white/60 font-normal mt-1.5">
              Nhập số điện thoại đặt phòng hoặc mã đặt phòng để xem tình trạng phòng và lịch trình.
            </p>
          </div>

          {/* Toggle Type - PlayStation pill switcher */}
          <div className="flex rounded-full bg-[#121314] p-1 border border-white/10 mb-5">
            <button
              type="button"
              onClick={() => setLookupType("phone")}
              className={`flex-1 py-2 text-xs rounded-full transition-all cursor-pointer font-bold tracking-[0.2px] ${
                lookupType === "phone"
                  ? "bg-[#0070d1] text-white"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Tra theo Số điện thoại
            </button>
            <button
              type="button"
              onClick={() => setLookupType("code")}
              className={`flex-1 py-2 text-xs rounded-full transition-all cursor-pointer font-bold tracking-[0.2px] ${
                lookupType === "code"
                  ? "bg-[#0070d1] text-white"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Tra theo Mã đặt phòng
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            {lookupType === "phone" ? (
              <input
                type="tel"
                required
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="Ví dụ: 0939014234..."
                className="flex-1 px-4 py-2.5 text-xs sm:text-sm border border-white/20 rounded-[4px] focus:outline-none focus:border-[#0070d1] focus:ring-1 focus:ring-[#0070d1] bg-[#121314] text-white h-11"
              />
            ) : (
              <input
                type="text"
                required
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                placeholder="Ví dụ: MDALAT-1234..."
                className="flex-1 px-4 py-2.5 text-xs sm:text-sm border border-white/20 rounded-[4px] focus:outline-none focus:border-[#0070d1] focus:ring-1 focus:ring-[#0070d1] bg-[#121314] text-white uppercase h-11"
              />
            )}
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 bg-[#0070d1] hover:bg-[#0064b7] active:bg-[#004d8d] text-white text-xs sm:text-sm font-bold px-7 py-2.5 rounded-full transition-colors cursor-pointer h-11 tracking-[0.324px] shadow-none"
            >
              <Search className="w-4 h-4 text-white" />
              <span>Tra cứu</span>
            </button>
          </form>
        </div>

        {/* Search Results / Bookings List */}
        <div>
          {isSearching || isMyBookingsLoading ? (
            <div className="text-center py-16">
              <div className="w-8 h-8 border-2 border-[#0070d1] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs text-white/60 tracking-wider uppercase font-semibold">Đang tải dữ liệu đặt phòng...</p>
            </div>
          ) : displayList.length > 0 ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg sm:text-xl font-light text-white tracking-[0.1px]">
                  Danh sách đặt phòng ({displayList.length})
                </h3>
                <span className="text-xs text-white/50">
                  {session?.user ? `Tài khoản: ${session.user.email}` : "Kết quả tra cứu"}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {displayList.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-[#181818] rounded-[8px] border border-white/10 hover:border-white/20 transition-all overflow-hidden shadow-none"
                  >
                    {/* Top booking bar */}
                    <div className="bg-[#121314] px-6 py-3.5 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <span className="text-white/60">Mã đơn:</span>
                        <strong className="font-mono text-sm font-bold text-[#53b1ff]">
                          {booking.bookingCode}
                        </strong>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-white/50 hidden sm:inline">
                          Ngày tạo: {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString("vi-VN") : "Hôm nay"}
                        </span>
                        {renderStatusBadge(booking.status)}
                      </div>
                    </div>

                    {/* Booking Main Body */}
                    <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                      {/* Room Visual */}
                      <div className="md:col-span-4 relative h-48 sm:h-52 rounded-[8px] overflow-hidden bg-[#121314] border border-white/10">
                        {booking.room?.image ? (
                          <Image
                            src={booking.room.image}
                            alt={booking.room.name || "Phòng M_Dalats"}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white/50 text-xs">
                            Hình ảnh phòng
                          </div>
                        )}
                        <div className="absolute top-2.5 left-2.5 bg-[#000000]/80 backdrop-blur-md text-white text-[11px] font-mono px-2.5 py-0.5 rounded-[4px] border border-white/10">
                          Phòng {booking.room?.roomNumber || "001"}
                        </div>
                      </div>

                      {/* Room & Stay Details */}
                      <div className="md:col-span-5 space-y-3">
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-[#53b1ff] font-semibold">
                            {booking.room?.viewType || "View sân vườn & đồi thông"}
                          </span>
                          <h4 className="text-lg sm:text-xl font-light text-white tracking-[0.1px]">
                            {booking.room?.name || "Phòng nghỉ M_Dalats Villa"}
                          </h4>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs text-white/80 bg-[#121314] p-3.5 rounded-[8px] border border-white/10">
                          <div>
                            <span className="text-[10px] text-white/50 block">Nhận phòng (Check-in)</span>
                            <strong className="text-white font-semibold">
                              {booking.checkIn} (14:00)
                            </strong>
                          </div>
                          <div>
                            <span className="text-[10px] text-white/50 block">Trả phòng (Check-out)</span>
                            <strong className="text-white font-semibold">
                              {booking.checkOut} (12:00)
                            </strong>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-white/60">
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-[#0070d1]" />
                            {booking.totalNights} đêm
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-[#0070d1]" />
                            {booking.adults} người lớn {booking.children > 0 ? `, ${booking.children} trẻ em` : ""}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <BedDouble className="w-3.5 h-3.5 text-[#0070d1]" />
                            {booking.room?.bedType || "1 Giường Queen"}
                          </span>
                        </div>

                        {booking.specialRequests && (
                          <p className="text-[11px] text-white/60 italic bg-[#121314] p-2.5 border border-white/10 rounded-[4px]">
                            Ghi chú: {booking.specialRequests}
                          </p>
                        )}
                      </div>

                      {/* Guest Info & Price Summary */}
                      <div className="md:col-span-3 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6 space-y-4 text-xs">
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-white/50 block mb-1">
                            Thông tin người đặt
                          </span>
                          <p className="font-semibold text-white truncate">{booking.customerName}</p>
                          <p className="text-white/60 truncate">{booking.customerPhone}</p>
                          <p className="text-white/60 truncate text-[11px]">{booking.customerEmail}</p>
                        </div>

                        <div className="pt-2 border-t border-white/10">
                          <span className="text-[10px] uppercase tracking-wider text-white/50 block mb-0.5">
                            Tổng thanh toán
                          </span>
                          <span className="text-lg sm:text-xl font-bold text-[#53b1ff] block">
                            {formatPrice(booking.totalPrice)}
                          </span>
                          <span className="text-[10px] text-white/50 font-medium">
                            Đã bao gồm ăn sáng & tiện ích
                          </span>
                        </div>

                        <div className="pt-2">
                          <a
                            href="tel:0939014234"
                            className="w-full inline-flex items-center justify-center gap-2 bg-[#121314] hover:bg-white/10 text-white border border-white/20 py-2.5 px-4 rounded-full text-xs font-bold transition-colors tracking-[0.2px]"
                          >
                            <Phone className="w-3.5 h-3.5 text-[#53b1ff]" />
                            <span>Hỗ trợ: 0939 014 234</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (searchedCode || searchedPhone) ? (
            <div className="bg-[#181818] p-10 sm:p-12 rounded-[8px] border border-white/10 text-center max-w-lg mx-auto space-y-4 shadow-none">
              <div className="w-12 h-12 rounded-full bg-[#121314] text-[#0070d1] flex items-center justify-center mx-auto border border-white/10">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-light text-white tracking-[0.1px]">
                Không tìm thấy đơn đặt phòng phù hợp
              </h4>
              <p className="text-xs text-white/60 leading-relaxed font-normal">
                Vui lòng kiểm tra lại số điện thoại hoặc mã đơn phòng đã nhập. Quý khách cũng có thể liên hệ trực tiếp lễ tân qua hotline để được kiểm tra ngay.
              </p>
              <div className="pt-2">
                <a
                  href="tel:0939014234"
                  className="inline-flex items-center gap-2 bg-[#0070d1] text-white text-xs font-bold px-6 py-2.5 rounded-full hover:bg-[#0064b7] transition-colors tracking-[0.324px]"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Gọi Hotline 0939 014 234</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-[#181818] p-10 sm:p-12 rounded-[8px] border border-white/10 text-center max-w-lg mx-auto space-y-4 shadow-none">
              <div className="w-12 h-12 rounded-full bg-[#121314] text-[#0070d1] flex items-center justify-center mx-auto border border-white/10">
                <Calendar className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-light text-white tracking-[0.1px]">
                Chưa có đơn đặt phòng nào được tra cứu
              </h4>
              <p className="text-xs text-white/60 leading-relaxed font-normal">
                Quý khách có thể nhập số điện thoại hoặc mã đặt phòng ở khung tra cứu phía trên để theo dõi tình trạng lịch trình.
              </p>
              <div className="pt-2">
                <Link
                  href="/rooms"
                  className="inline-flex items-center gap-2 bg-[#d53b00] hover:bg-[#aa2f00] text-white text-xs font-bold px-7 py-3 rounded-full transition-colors tracking-[0.324px]"
                >
                  <span>Khám phá phòng & Đặt ngay</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Chapter 3: Signature PlayStation Blue Footer */}
      <Footer />
    </div>
  );
}
