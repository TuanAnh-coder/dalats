"use client";

import React, { useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "~/components/Navbar";
import { Footer } from "~/components/Footer";
import { BookingModal } from "~/components/BookingModal";
import { AuthModal } from "~/components/AuthModal";
import { MyBookingsModal } from "~/components/MyBookingsModal";
import { BookingSuccessReceipt } from "~/components/BookingSuccessReceipt";
import { api } from "~/trpc/react";
import {
  Bed,
  Maximize2,
  Users,
  Check,
  ChevronLeft,
  Calendar,
  Sparkles,
  ShieldCheck,
  Phone,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  QrCode,
  CreditCard,
} from "lucide-react";
import type { Room } from "~/server/db/schema";
import { getVietnamToday, getVietnamTomorrow, addDaysToIso } from "~/lib/dates";

export default function SingleRoomPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const { data: room, isLoading } = api.room.getBySlug.useQuery({ slug });
  const { data: allRooms = [] } = api.room.getAll.useQuery();

  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  // Direct on-page booking form state
  const today = getVietnamToday();
  const tomorrow = getVietnamTomorrow();

  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(tomorrow);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"vietqr" | "pay_at_villa">("vietqr");

  const handleCheckInChange = (val: string) => {
    setCheckIn(val);
    if (checkOut <= val) {
      const nextDay = addDaysToIso(val, 1);
      setCheckOut(nextDay);
    }
  };

  const [bookingSuccessCode, setBookingSuccessCode] = useState<string | null>(null);

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [myBookingsModalOpen, setMyBookingsModalOpen] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  const calculateNights = () => {
    const d1 = new Date(checkIn);
    const d2 = new Date(checkOut);
    const diffTime = d2.getTime() - d1.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  // Live real-time availability check for this room
  const availabilityQuery = api.booking.checkAvailability.useQuery(
    {
      roomId: room?.id ?? 0,
      checkIn,
      checkOut,
      adults,
      children,
    },
    {
      enabled: !!room && !!checkIn && !!checkOut,
    }
  );

  const isAvailableForSelectedDates = availabilityQuery.data ? availabilityQuery.data.isAvailable : true;
  const pricingData = availabilityQuery.data?.pricing;
  const nights = pricingData?.nights ?? calculateNights();
  const totalPrice = pricingData?.totalPrice ?? (room?.pricePerNight || 850000) * nights;

  const createBookingMutation = api.booking.create.useMutation({
    onSuccess: (data) => {
      if (data) {
        setBookingSuccessCode(data.bookingCode);
      }
    },
  });

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!room || !isAvailableForSelectedDates) return;

    createBookingMutation.mutate({
      roomId: room.id,
      customerName,
      customerEmail,
      customerPhone,
      checkIn,
      checkOut,
      adults,
      children,
      totalNights: nights,
      totalPrice,
      specialRequests: specialRequests || undefined,
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " ₫";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#000000] text-white flex flex-col justify-between">
        <Navbar />
        <div className="py-32 flex flex-col items-center justify-center text-white/50">
          <Loader2 className="w-8 h-8 animate-spin text-[#0070d1] mb-3" />
          <p className="text-xs tracking-wider uppercase font-semibold">Đang tải thông tin phòng nghỉ...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!room) {
    return notFound();
  }

  let galleryImages: string[] = [room.image];
  try {
    if (room.gallery) {
      const parsed = JSON.parse(room.gallery as string) as string[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        galleryImages = parsed;
      }
    }
  } catch (e) {
    // fallback
  }

  let amenitiesList: string[] = [
    "Khóa từ thông minh",
    "Giường đệm êm ái",
    "Nước nóng 24/7",
    "Smart TV 4K",
    "Wifi tốc độ cao",
    "Máy sấy tóc ion",
    "Trà & Cà phê miễn phí",
    "Tủ lạnh mini bar",
    "Két an toàn",
    "Bộ tắm gội thảo dược",
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

  const otherRooms = allRooms.filter((r) => r.id !== room.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col w-full max-w-full overflow-x-hidden min-w-0 selection:bg-[#0070d1] selection:text-white">
      <Navbar
        onOpenBookingModal={() => setBookingModalOpen(true)}
        onOpenAuthModal={() => setAuthModalOpen(true)}
        onOpenMyBookingsModal={() => setMyBookingsModalOpen(true)}
      />

      {/* Breadcrumb Bar */}
      <div className="bg-[#121314] border-b border-white/10 px-4 sm:px-8 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-2 text-xs text-white/60">
          <Link href="/" className="hover:text-white transition-colors">Trang chủ</Link>
          <span>/</span>
          <Link href="/rooms" className="hover:text-white transition-colors">Hệ thống phòng</Link>
          <span>/</span>
          <span className="text-[#53b1ff] font-semibold">{room.name}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10 sm:py-14 flex-1 w-full space-y-12">
        {/* Main Grid: Gallery & Details on Left, Direct Booking Box on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Gallery & Description */}
          <div className="lg:col-span-7 space-y-6">
            {/* Main Active Photo */}
            <div className="relative h-80 sm:h-[440px] w-full rounded-[8px] overflow-hidden border border-white/10 bg-[#121314] shadow-none">
              <Image
                src={galleryImages[activePhotoIdx] || room.image}
                alt={room.name}
                fill
                priority
                className="object-cover"
              />
              <div className="absolute top-4 left-4 bg-[#000000]/80 backdrop-blur-md text-white text-xs px-3.5 py-1.5 rounded-full font-semibold border border-white/10">
                {room.viewType}
              </div>
            </div>

            {/* Thumbnail Carousel */}
            {galleryImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActivePhotoIdx(idx)}
                    className={`relative w-20 h-16 sm:w-24 sm:h-20 rounded-[8px] overflow-hidden flex-shrink-0 border-2 transition-all cursor-pointer ${
                      activePhotoIdx === idx
                        ? "border-[#0070d1] ring-2 ring-[#0070d1]"
                        : "border-white/10 opacity-50 hover:opacity-100"
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Room Title & Specs */}
            <div className="bg-[#181818] p-6 sm:p-8 rounded-[8px] border border-white/10 space-y-5 shadow-none">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-white/10">
                <div>
                  <span className="text-[11px] uppercase tracking-[1.5px] text-[#53b1ff] font-semibold block mb-1">
                    Phòng {room.roomNumber} • M_Dalats Villa
                  </span>
                  <h1 className="text-3xl sm:text-4xl text-white font-light tracking-[-0.1px]">
                    {room.name}
                  </h1>
                </div>
                <div>
                  <span className="text-xs text-white/60 block">Giá phòng từ</span>
                  <span className="text-2xl font-bold text-[#53b1ff]">
                    {formatPrice(room.pricePerNight)}
                  </span>
                  <span className="text-xs text-white/60"> / đêm</span>
                </div>
              </div>

              {/* 4 Key Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3.5 bg-[#121314] rounded-[8px] px-4 text-xs border border-white/10">
                <div className="flex items-center gap-2.5">
                  <Maximize2 className="w-4 h-4 text-[#0070d1]" />
                  <div>
                    <p className="text-[10px] text-white/60">Diện tích</p>
                    <p className="font-semibold text-white">{room.area} m²</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-[#0070d1]" />
                  <div>
                    <p className="text-[10px] text-white/60">Số khách</p>
                    <p className="font-semibold text-white">{room.maxAdults} Lớn, {room.maxChildren} Trẻ</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <Bed className="w-4 h-4 text-[#0070d1]" />
                  <div>
                    <p className="text-[10px] text-white/60">Giường</p>
                    <p className="font-semibold text-white">{room.bedType}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-[#0070d1]" />
                  <div>
                    <p className="text-[10px] text-white/60">Tầm nhìn</p>
                    <p className="font-semibold text-white truncate">{room.viewType}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="pt-2">
                <h3 className="text-lg font-light text-white mb-2 tracking-[0.1px]">
                  Giới thiệu căn phòng
                </h3>
                <p className="text-xs sm:text-sm text-white/70 font-light leading-relaxed">
                  {room.description || room.shortDescription}
                </p>
              </div>

              {/* Amenities List */}
              <div className="pt-4 border-t border-white/10">
                <h3 className="text-lg font-light text-white mb-3 tracking-[0.1px]">
                  Tiện nghi phòng nghỉ
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {amenitiesList.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-white/80">
                      <Check className="w-3.5 h-3.5 text-[#0070d1] flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Check-in / out Policy */}
              <div className="pt-4 border-t border-white/10 text-xs text-white/60 flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#0070d1]" />
                  <span>Nhận phòng: <strong className="text-white">14:00</strong> • Trả phòng: <strong className="text-white">12:00</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#0070d1]" />
                  <span>Hỗ trợ nhận phòng 24/7 & Giữ hành lý miễn phí</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Direct Booking Box */}
          <div className="lg:col-span-5 sticky top-24">
            <div className="bg-[#181818] p-6 sm:p-7 rounded-[8px] border border-white/10 shadow-none">
              <span className="text-[11px] uppercase tracking-[1.5px] text-[#53b1ff] font-semibold block mb-1">
                Đặt phòng trực tiếp
              </span>
              <h3 className="text-2xl text-white font-light mb-1 tracking-[0.1px]">
                Đặt phòng {room.name}
              </h3>
              <p className="text-xs text-white/60 mb-5">
                Giá gốc trực tiếp từ villa • Không phí dịch vụ • Xác nhận ngay
              </p>

              {bookingSuccessCode ? (
                <div className="py-2">
                  <BookingSuccessReceipt
                    bookingCode={bookingSuccessCode}
                    roomName={room.name}
                    checkIn={checkIn}
                    checkOut={checkOut}
                    nights={nights}
                    adults={adults}
                    children={children}
                    customerName={customerName}
                    customerPhone={customerPhone}
                    customerEmail={customerEmail}
                    totalPrice={totalPrice}
                    initialPaymentMethod={paymentMethod}
                    onClose={() => setBookingSuccessCode(null)}
                  />
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  {createBookingMutation.isError && (
                    <div className="p-3 bg-red-950/80 border border-red-800 text-red-200 text-xs rounded-[4px] flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-[#ef4444] flex-shrink-0" />
                      <span>{createBookingMutation.error?.message || "Đã có lỗi xảy ra"}</span>
                    </div>
                  )}

                  {/* Date Pickers */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] uppercase font-semibold text-white/70 block mb-1.5">
                        Ngày nhận phòng
                      </label>
                      <input
                        type="date"
                        value={checkIn}
                        min={today}
                        onChange={(e) => handleCheckInChange(e.target.value)}
                        className="w-full bg-[#121314] border border-white/20 px-3 py-2 text-xs sm:text-sm text-white rounded-[4px] focus:outline-none focus:border-[#0070d1] focus:ring-1 focus:ring-[#0070d1] h-11"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-semibold text-white/70 block mb-1.5">
                        Ngày trả phòng
                      </label>
                      <input
                        type="date"
                        value={checkOut}
                        min={checkIn || today}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full bg-[#121314] border border-white/20 px-3 py-2 text-xs sm:text-sm text-white rounded-[4px] focus:outline-none focus:border-[#0070d1] focus:ring-1 focus:ring-[#0070d1] h-11"
                        required
                      />
                    </div>
                  </div>

                  {/* Guests */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] uppercase font-semibold text-white/70 block mb-1.5">
                        Người lớn
                      </label>
                      <select
                        value={adults}
                        onChange={(e) => setAdults(Number(e.target.value))}
                        className="w-full bg-[#121314] border border-white/20 px-3 py-2 text-xs sm:text-sm text-white rounded-[4px] h-11 focus:outline-none focus:border-[#0070d1] focus:ring-1 focus:ring-[#0070d1]"
                      >
                        {[1, 2, 3, 4].map((n) => (
                          <option key={n} value={n} className="bg-[#181818] text-white">
                            {n} người lớn
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-semibold text-white/70 block mb-1.5">
                        Trẻ em
                      </label>
                      <select
                        value={children}
                        onChange={(e) => setChildren(Number(e.target.value))}
                        className="w-full bg-[#121314] border border-white/20 px-3 py-2 text-xs sm:text-sm text-white rounded-[4px] h-11 focus:outline-none focus:border-[#0070d1] focus:ring-1 focus:ring-[#0070d1]"
                      >
                        {[0, 1, 2, 3].map((n) => (
                          <option key={n} value={n} className="bg-[#181818] text-white">
                            {n} trẻ em
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div>
                    <label className="text-[10px] uppercase font-semibold text-white/70 block mb-1.5">
                      Họ và tên <span className="text-[#d53b00]">*</span>
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Nguyễn Văn A"
                      className="w-full bg-[#121314] border border-white/20 px-3 py-2 text-xs sm:text-sm text-white rounded-[4px] focus:outline-none focus:border-[#0070d1] focus:ring-1 focus:ring-[#0070d1] h-11"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] uppercase font-semibold text-white/70 block mb-1.5">
                        Email <span className="text-[#d53b00]">*</span>
                      </label>
                      <input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="email@example.com"
                        className="w-full bg-[#121314] border border-white/20 px-3 py-2 text-xs sm:text-sm text-white rounded-[4px] focus:outline-none focus:border-[#0070d1] focus:ring-1 focus:ring-[#0070d1] h-11"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-semibold text-white/70 block mb-1.5">
                        Số điện thoại <span className="text-[#d53b00]">*</span>
                      </label>
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="0939 014 234"
                        className="w-full bg-[#121314] border border-white/20 px-3 py-2 text-xs sm:text-sm text-white rounded-[4px] focus:outline-none focus:border-[#0070d1] focus:ring-1 focus:ring-[#0070d1] h-11"
                        required
                      />
                    </div>
                  </div>

                  {/* Payment Method Selector */}
                  <div>
                    <label className="text-[10px] uppercase font-semibold text-white/70 block mb-1.5">
                      Phương thức thanh toán
                    </label>
                    <div className="grid grid-cols-1 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("vietqr")}
                        className={`flex items-start gap-3 p-3 rounded-[8px] border text-left transition-all cursor-pointer ${
                          paymentMethod === "vietqr"
                            ? "border-[#0070d1] bg-[#0070d1]/10"
                            : "border-white/10 bg-[#121314] hover:border-white/20"
                        }`}
                      >
                        <div className={`mt-0.5 p-1.5 rounded-[6px] ${paymentMethod === "vietqr" ? "bg-[#0070d1] text-white" : "bg-[#181818] text-white/60"}`}>
                          <QrCode className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-white flex items-center gap-2">
                            <span>Chuyển khoản VietQR</span>
                            <span className="text-[9px] bg-[#0070d1] text-white px-2 py-0.5 rounded-full font-bold">Khuyên dùng</span>
                          </div>
                          <p className="text-[11px] text-white/60 mt-0.5 font-normal">
                            Quét mã QR qua app MB / Mobile Banking nhận xác nhận tự động.
                          </p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod("pay_at_villa")}
                        className={`flex items-start gap-3 p-3 rounded-[8px] border text-left transition-all cursor-pointer ${
                          paymentMethod === "pay_at_villa"
                            ? "border-[#0070d1] bg-[#0070d1]/10"
                            : "border-white/10 bg-[#121314] hover:border-white/20"
                        }`}
                      >
                        <div className={`mt-0.5 p-1.5 rounded-[6px] ${paymentMethod === "pay_at_villa" ? "bg-[#0070d1] text-white" : "bg-[#181818] text-white/60"}`}>
                          <CreditCard className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-white">
                            Thanh toán tại quầy khi Check-in
                          </div>
                          <p className="text-[11px] text-white/60 mt-0.5 font-normal">
                            Thanh toán trực tiếp bằng tiền mặt hoặc thẻ tại M_Dalats Villa.
                          </p>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Conflict Alert Banner if Dates are Booked */}
                  {!isAvailableForSelectedDates && (
                    <div className="p-3 bg-red-950/80 border border-red-800 rounded-[4px] text-xs text-red-200 flex items-start gap-2 animate-fadeIn">
                      <AlertCircle className="w-4 h-4 text-[#ef4444] shrink-0 mt-0.5" />
                      <div>
                        <strong className="block font-semibold">Phòng đã có khách thuê trong khoảng ngày này:</strong>
                        <p className="text-[11px] text-red-300 mt-0.5">
                          {availabilityQuery.data?.reason || "Khoảng ngày bạn chọn trùng lịch với khách khác. Vui lòng chọn ngày khác."}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Summary Card */}
                  <div className="bg-[#121314] p-4 rounded-[8px] border border-white/10 text-xs space-y-1.5">
                    <div className="flex justify-between text-white/60">
                      <span>Đơn giá mỗi đêm:</span>
                      <span className="text-white">{formatPrice(room.pricePerNight)}</span>
                    </div>
                    <div className="flex justify-between text-white/60">
                      <span>Thời gian:</span>
                      <span className="text-white">{nights} đêm ({checkIn} → {checkOut})</span>
                    </div>
                    {pricingData && pricingData.extraAdults > 0 && (
                      <div className="flex justify-between text-[#53b1ff] bg-[#0070d1]/10 px-2.5 py-1 rounded-[4px]">
                        <span>Phụ thu thêm người lớn (+{pricingData.extraAdults} người):</span>
                        <span className="font-semibold">+{formatPrice(pricingData.extraAdultTotal)}</span>
                      </div>
                    )}
                    {pricingData && pricingData.extraChildren > 0 && (
                      <div className="flex justify-between text-[#53b1ff] bg-[#0070d1]/10 px-2.5 py-1 rounded-[4px]">
                        <span>Phụ thu thêm trẻ em (+{pricingData.extraChildren} trẻ):</span>
                        <span className="font-semibold">+{formatPrice(pricingData.extraChildTotal)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-sm text-white border-t border-white/10 pt-2.5 mt-2">
                      <span>Tổng tiền:</span>
                      <span className="text-[#53b1ff] text-base">{formatPrice(totalPrice)}</span>
                    </div>
                  </div>

                  {/* Commerce CTA Button */}
                  <button
                    type="submit"
                    disabled={createBookingMutation.isPending || !isAvailableForSelectedDates || !room.isAvailable}
                    className={`w-full text-sm font-bold tracking-[0.324px] py-3 rounded-full transition-all flex items-center justify-center gap-2 h-11 shadow-none ${
                      !isAvailableForSelectedDates || !room.isAvailable
                        ? "bg-white/10 text-white/40 border border-white/10 cursor-not-allowed"
                        : "bg-[#d53b00] hover:bg-[#aa2f00] active:bg-[#aa2f00] text-white cursor-pointer"
                    }`}
                  >
                    {createBookingMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : !room.isAvailable ? (
                      <span>Phòng đang tạm khóa</span>
                    ) : !isAvailableForSelectedDates ? (
                      <span>Phòng đã kín lịch ngày này</span>
                    ) : (
                      <span>Xác nhận đặt phòng này</span>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Similar Rooms Recommendation */}
        {otherRooms.length > 0 && (
          <div className="pt-10 border-t border-white/10">
            <h3 className="text-2xl font-light text-white mb-6 tracking-[-0.1px]">
              Các phòng nghỉ khác bạn có thể thích
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {otherRooms.map((r) => (
                <Link
                  key={r.id}
                  href={`/rooms/${r.slug}`}
                  className="group bg-[#181818] rounded-[8px] overflow-hidden border border-white/10 hover:border-white/25 transition-all shadow-none"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-[#121314]">
                    <Image src={r.image} alt={r.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="p-5">
                    <h4 className="text-lg font-light text-white group-hover:text-[#53b1ff] transition-colors tracking-[0.1px]">
                      {r.name}
                    </h4>
                    <p className="text-xs text-white/60 mt-1">{r.area} m² • {r.viewType}</p>
                    <p className="text-sm font-bold text-[#53b1ff] mt-2.5">{formatPrice(r.pricePerNight)} / đêm</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      <MyBookingsModal
        isOpen={myBookingsModalOpen}
        onClose={() => setMyBookingsModalOpen(false)}
      />

      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        selectedRoom={room}
        rooms={allRooms}
      />
    </div>
  );
}
