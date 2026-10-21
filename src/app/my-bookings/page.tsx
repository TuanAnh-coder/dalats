"use client";

import React, { useState } from "react";
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
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Đã xác nhận
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-red-100 text-red-800">
            <XCircle className="w-3.5 h-3.5 text-red-600" />
            Đã hủy
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
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
    <div className="min-h-screen bg-[#faf7f1] text-[#222222] flex flex-col">
      <Navbar />

      {/* Header Banner */}
      <section className="bg-[#367156] text-white py-12 px-4 sm:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[11px] uppercase tracking-[0.25em] text-[#faf7f1] mb-2">
            <Calendar className="w-3.5 h-3.5 text-[#f27052]" />
            <span>Quản Lý Đặt Phòng</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-wide">
            Tra Cứu & Lịch Sử Đặt Phòng
          </h1>
          <p className="text-xs sm:text-sm text-white/80 font-light max-w-xl mx-auto">
            Kiểm tra thông tin chi tiết các kỳ nghỉ đã đặt tại M_Dalats Villa thông qua số điện thoại hoặc mã đặt phòng của bạn.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-12 flex-1 w-full space-y-10">
        {/* Lookup Box (shown if not logged in or want to search other bookings) */}
        <div className="bg-white p-6 sm:p-8 rounded-sm border border-[#ece7dd] shadow-sm max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="font-serif text-xl sm:text-2xl text-[#367156] font-semibold">
              Tra cứu thông tin đặt phòng
            </h2>
            <p className="text-xs text-[#666666] font-light mt-1">
              Nhập số điện thoại đặt phòng hoặc mã đặt phòng để xem tình trạng phòng và lịch trình.
            </p>
          </div>

          {/* Toggle Type */}
          <div className="flex rounded-sm bg-[#faf7f1] p-1 border border-[#ece7dd] mb-4">
            <button
              type="button"
              onClick={() => setLookupType("phone")}
              className={`flex-1 py-2 text-xs font-medium rounded-xs transition-colors cursor-pointer ${
                lookupType === "phone"
                  ? "bg-[#367156] text-white shadow-xs"
                  : "text-[#666666] hover:text-[#367156]"
              }`}
            >
              Tra theo Số điện thoại
            </button>
            <button
              type="button"
              onClick={() => setLookupType("code")}
              className={`flex-1 py-2 text-xs font-medium rounded-xs transition-colors cursor-pointer ${
                lookupType === "code"
                  ? "bg-[#367156] text-white shadow-xs"
                  : "text-[#666666] hover:text-[#367156]"
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
                className="flex-1 px-4 py-2.5 text-xs sm:text-sm border border-[#d6cebf] rounded-sm focus:outline-none focus:border-[#367156] bg-[#faf7f1]/50"
              />
            ) : (
              <input
                type="text"
                required
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                placeholder="Ví dụ: MDALAT-1234..."
                className="flex-1 px-4 py-2.5 text-xs sm:text-sm border border-[#d6cebf] rounded-sm focus:outline-none focus:border-[#367156] bg-[#faf7f1]/50 uppercase"
              />
            )}
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 bg-[#f27052] hover:bg-[#e05c3c] text-white text-xs uppercase tracking-wider font-medium px-6 py-2.5 rounded-sm shadow-xs transition-colors cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Tra cứu</span>
            </button>
          </form>
        </div>

        {/* Search Results / Bookings List */}
        <div>
          {isSearching || isMyBookingsLoading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-3 border-[#367156] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs text-[#777777]">Đang tải dữ liệu đặt phòng...</p>
            </div>
          ) : displayList.length > 0 ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg sm:text-xl font-semibold text-[#367156]">
                  Danh sách đặt phòng ({displayList.length})
                </h3>
                <span className="text-xs text-[#666666]">
                  {session?.user ? `Tài khoản: ${session.user.email}` : "Kết quả tra cứu"}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {displayList.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-white rounded-sm border border-[#ece7dd] shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                  >
                    {/* Top booking bar */}
                    <div className="bg-[#faf7f1] px-5 py-3 border-b border-[#ece7dd] flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <span className="text-[#777777]">Mã đơn:</span>
                        <strong className="font-mono text-sm font-semibold text-[#367156]">
                          {booking.bookingCode}
                        </strong>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-[#777777] hidden sm:inline">
                          Ngày tạo: {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString("vi-VN") : "Hôm nay"}
                        </span>
                        {renderStatusBadge(booking.status)}
                      </div>
                    </div>

                    {/* Booking Main Body */}
                    <div className="p-5 sm:p-7 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                      {/* Room Visual */}
                      <div className="md:col-span-4 relative h-48 sm:h-52 rounded-sm overflow-hidden bg-[#faf7f1]">
                        {booking.room?.image ? (
                          <Image
                            src={booking.room.image}
                            alt={booking.room.name || "Phòng M_Dalats"}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#aaaaaa]">
                            Hình ảnh phòng
                          </div>
                        )}
                        <div className="absolute top-2.5 left-2.5 bg-black/70 backdrop-blur-xs text-white text-[11px] font-mono px-2 py-0.5 rounded-xs">
                          Phòng {booking.room?.roomNumber || "001"}
                        </div>
                      </div>

                      {/* Room & Stay Details */}
                      <div className="md:col-span-5 space-y-3">
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-[#f27052] font-semibold">
                            {booking.room?.viewType || "View sân vườn & đồi thông"}
                          </span>
                          <h4 className="font-serif text-lg sm:text-xl font-normal text-[#222222]">
                            {booking.room?.name || "Phòng nghỉ M_Dalats Villa"}
                          </h4>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs text-[#555555] bg-[#faf7f1] p-3 rounded-sm border border-[#ece7dd]/60">
                          <div>
                            <span className="text-[10px] text-[#888888] block">Nhận phòng (Check-in)</span>
                            <strong className="text-[#367156] font-semibold">
                              {booking.checkIn} (14:00)
                            </strong>
                          </div>
                          <div>
                            <span className="text-[10px] text-[#888888] block">Trả phòng (Check-out)</span>
                            <strong className="text-[#367156] font-semibold">
                              {booking.checkOut} (12:00)
                            </strong>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-[#666666]">
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-[#367156]" />
                            {booking.totalNights} đêm
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-[#367156]" />
                            {booking.adults} người lớn {booking.children > 0 ? `, ${booking.children} trẻ em` : ""}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <BedDouble className="w-3.5 h-3.5 text-[#367156]" />
                            {booking.room?.bedType || "1 Giường Queen"}
                          </span>
                        </div>

                        {booking.specialRequests && (
                          <p className="text-[11px] text-[#666666] italic bg-white p-2 border border-[#ece7dd] rounded-xs">
                            Ghi chú: {booking.specialRequests}
                          </p>
                        )}
                      </div>

                      {/* Guest Info & Price Summary */}
                      <div className="md:col-span-3 border-t md:border-t-0 md:border-l border-[#ece7dd] pt-4 md:pt-0 md:pl-6 space-y-4 text-xs">
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-[#888888] block mb-1">
                            Thông tin người đặt
                          </span>
                          <p className="font-semibold text-[#222222] truncate">{booking.customerName}</p>
                          <p className="text-[#666666] truncate">{booking.customerPhone}</p>
                          <p className="text-[#666666] truncate text-[11px]">{booking.customerEmail}</p>
                        </div>

                        <div className="pt-2 border-t border-[#ece7dd]">
                          <span className="text-[10px] uppercase tracking-wider text-[#888888] block mb-0.5">
                            Tổng thanh toán
                          </span>
                          <span className="font-serif text-lg sm:text-xl font-bold text-[#f27052] block">
                            {formatPrice(booking.totalPrice)}
                          </span>
                          <span className="text-[10px] text-emerald-700 font-medium">
                            Đã bao gồm ăn sáng & tiện ích
                          </span>
                        </div>

                        <div className="pt-2">
                          <a
                            href="tel:0939014234"
                            className="w-full inline-flex items-center justify-center gap-1.5 bg-[#faf7f1] hover:bg-[#ece7dd] text-[#367156] border border-[#d6cebf] py-2 px-3 rounded-sm text-[11px] font-semibold transition-colors"
                          >
                            <Phone className="w-3 h-3 text-[#367156]" />
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
            <div className="bg-white p-10 rounded-sm border border-[#ece7dd] text-center max-w-lg mx-auto space-y-4">
              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-xl font-semibold text-[#222222]">
                Không tìm thấy đơn đặt phòng phù hợp
              </h4>
              <p className="text-xs text-[#666666] leading-relaxed">
                Vui lòng kiểm tra lại số điện thoại hoặc mã đơn phòng đã nhập. Quý khách cũng có thể liên hệ trực tiếp lễ tân qua hotline để được kiểm tra ngay.
              </p>
              <div className="pt-2">
                <a
                  href="tel:0939014234"
                  className="inline-flex items-center gap-2 bg-[#367156] text-white text-xs font-semibold px-5 py-2.5 rounded-sm hover:bg-[#133324] transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Gọi Hotline 0939 014 234</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-white p-10 rounded-sm border border-[#ece7dd] text-center max-w-lg mx-auto space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#367156]/10 text-[#367156] flex items-center justify-center mx-auto">
                <Calendar className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-xl font-semibold text-[#367156]">
                Chưa có đơn đặt phòng nào được tra cứu
              </h4>
              <p className="text-xs text-[#666666] leading-relaxed">
                Quý khách có thể nhập số điện thoại hoặc mã đặt phòng ở khung tra cứu phía trên để theo dõi tình trạng lịch trình.
              </p>
              <div className="pt-2">
                <Link
                  href="/rooms"
                  className="inline-flex items-center gap-2 bg-[#f27052] text-white text-xs font-semibold px-6 py-2.5 rounded-sm hover:bg-[#e05c3c] transition-colors"
                >
                  <span>Khám phá phòng & Đặt ngay</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
