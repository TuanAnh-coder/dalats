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
  const today = new Date().toISOString().split("T")[0] ?? "2026-10-20";
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0] ?? "2026-10-21";

  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(tomorrow);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"vietqr" | "pay_at_villa">("vietqr");

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

  const nights = calculateNights();
  const totalPrice = (room?.pricePerNight || 850000) * nights;

  const createBookingMutation = api.booking.create.useMutation({
    onSuccess: (data) => {
      if (data) {
        setBookingSuccessCode(data.bookingCode);
      }
    },
  });

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!room) return;

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
      <div className="min-h-screen bg-[#faf7f1] flex flex-col justify-between">
        <Navbar />
        <div className="py-32 flex flex-col items-center justify-center text-[#777777]">
          <Loader2 className="w-8 h-8 animate-spin text-[#367156] mb-2" />
          <p className="text-xs">Đang tải thông tin phòng nghỉ...</p>
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
    <div className="min-h-screen bg-[#faf7f1] text-[#222222] flex flex-col">
      <Navbar
        onOpenBookingModal={() => setBookingModalOpen(true)}
        onOpenAuthModal={() => setAuthModalOpen(true)}
        onOpenMyBookingsModal={() => setMyBookingsModalOpen(true)}
      />

      {/* Breadcrumb Bar */}
      <div className="bg-white border-b border-[#ece7dd] px-4 sm:px-8 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-2 text-xs text-[#777777]">
          <Link href="/" className="hover:text-[#367156]">Trang chủ</Link>
          <span>/</span>
          <Link href="/rooms" className="hover:text-[#367156]">Hệ thống phòng</Link>
          <span>/</span>
          <span className="text-[#367156] font-semibold">{room.name}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10 flex-1 w-full space-y-12">
        {/* Main Grid: Gallery & Details on Left, Direct Booking Box on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Gallery & Description */}
          <div className="lg:col-span-7 space-y-6">
            {/* Main Active Photo */}
            <div className="relative h-80 sm:h-[420px] w-full rounded-sm overflow-hidden shadow-md bg-black">
              <Image
                src={galleryImages[activePhotoIdx] || room.image}
                alt={room.name}
                fill
                priority
                className="object-cover"
              />
              <div className="absolute top-4 left-4 bg-[#367156]/90 backdrop-blur-xs text-white text-xs px-3 py-1 rounded-full font-light">
                {room.viewType}
              </div>
            </div>

            {/* Thumbnail Carousel */}
            {galleryImages.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-2">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActivePhotoIdx(idx)}
                    className={`relative w-20 h-16 sm:w-24 sm:h-20 rounded-sm overflow-hidden flex-shrink-0 border-2 transition-all cursor-pointer ${
                      activePhotoIdx === idx
                        ? "border-[#367156] scale-102 shadow-sm"
                        : "border-transparent opacity-65 hover:opacity-100"
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Room Title & Specs */}
            <div className="bg-white p-6 rounded-sm border border-[#ece7dd] shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#ece7dd]">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#367156] font-semibold block mb-1">
                    Phòng {room.roomNumber} • M_Dalats Villa
                  </span>
                  <h1 className="font-serif text-3xl sm:text-4xl text-[#222222] font-normal">
                    {room.name}
                  </h1>
                </div>
                <div>
                  <span className="text-xs text-[#777777] block">Giá phòng từ</span>
                  <span className="font-serif text-2xl font-bold text-[#367156]">
                    {formatPrice(room.pricePerNight)}
                  </span>
                  <span className="text-xs text-[#777777]"> / đêm</span>
                </div>
              </div>

              {/* 4 Key Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 bg-[#faf7f1] rounded-sm px-3 text-xs border border-[#ece7dd]">
                <div className="flex items-center gap-2">
                  <Maximize2 className="w-4 h-4 text-[#367156]" />
                  <div>
                    <p className="text-[10px] text-[#777777]">Diện tích</p>
                    <p className="font-semibold text-[#222222]">{room.area} m²</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#367156]" />
                  <div>
                    <p className="text-[10px] text-[#777777]">Số khách</p>
                    <p className="font-semibold text-[#222222]">{room.maxAdults} Lớn, {room.maxChildren} Trẻ</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Bed className="w-4 h-4 text-[#367156]" />
                  <div>
                    <p className="text-[10px] text-[#777777]">Giường</p>
                    <p className="font-semibold text-[#222222]">{room.bedType}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#367156]" />
                  <div>
                    <p className="text-[10px] text-[#777777]">Tầm nhìn</p>
                    <p className="font-semibold text-[#222222] truncate">{room.viewType}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="pt-2">
                <h3 className="font-serif text-xl font-medium text-[#222222] mb-2">
                  Giới thiệu căn phòng
                </h3>
                <p className="text-xs sm:text-sm text-[#555555] font-light leading-relaxed">
                  {room.description || room.shortDescription}
                </p>
              </div>

              {/* Amenities List */}
              <div className="pt-4 border-t border-[#ece7dd]">
                <h3 className="font-serif text-xl font-medium text-[#222222] mb-3">
                  Tiện nghi phòng nghỉ
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {amenitiesList.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-[#555555]">
                      <Check className="w-3.5 h-3.5 text-[#367156] flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Check-in / out Policy */}
              <div className="pt-4 border-t border-[#ece7dd] text-xs text-[#666666] flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#367156]" />
                  <span>Nhận phòng: <strong>14:00</strong> • Trả phòng: <strong>12:00</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#367156]" />
                  <span>Hỗ trợ nhận phòng 24/7 & Giữ hành lý miễn phí</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Direct Booking Box */}
          <div className="lg:col-span-5 sticky top-24">
            <div className="bg-white p-6 sm:p-7 rounded-sm border border-[#ece7dd] shadow-lg">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#367156] font-semibold block mb-1">
                Đặt phòng trực tiếp
              </span>
              <h3 className="font-serif text-2xl text-[#222222] font-medium mb-1">
                Đặt phòng {room.name}
              </h3>
              <p className="text-xs text-[#777777] mb-5">
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
                <form onSubmit={handleBookingSubmit} className="space-y-3.5">
                  {createBookingMutation.isError && (
                    <div className="p-2.5 bg-red-50 text-red-700 text-xs rounded-sm flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{createBookingMutation.error?.message || "Đã có lỗi xảy ra"}</span>
                    </div>
                  )}

                  {/* Date Pickers */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[10px] uppercase font-medium text-[#666666] block mb-1">
                        Ngày nhận phòng
                      </label>
                      <input
                        type="date"
                        value={checkIn}
                        min={today}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="w-full bg-[#faf7f1] border border-[#d6cebf] px-2.5 py-2 text-xs rounded-sm focus:outline-hidden focus:border-[#367156]"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-medium text-[#666666] block mb-1">
                        Ngày trả phòng
                      </label>
                      <input
                        type="date"
                        value={checkOut}
                        min={checkIn || today}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full bg-[#faf7f1] border border-[#d6cebf] px-2.5 py-2 text-xs rounded-sm focus:outline-hidden focus:border-[#367156]"
                        required
                      />
                    </div>
                  </div>

                  {/* Guests */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[10px] uppercase font-medium text-[#666666] block mb-1">
                        Người lớn
                      </label>
                      <select
                        value={adults}
                        onChange={(e) => setAdults(Number(e.target.value))}
                        className="w-full bg-[#faf7f1] border border-[#d6cebf] px-2.5 py-2 text-xs rounded-sm"
                      >
                        {[1, 2, 3, 4].map((n) => (
                          <option key={n} value={n}>
                            {n} người lớn
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-medium text-[#666666] block mb-1">
                        Trẻ em
                      </label>
                      <select
                        value={children}
                        onChange={(e) => setChildren(Number(e.target.value))}
                        className="w-full bg-[#faf7f1] border border-[#d6cebf] px-2.5 py-2 text-xs rounded-sm"
                      >
                        {[0, 1, 2, 3].map((n) => (
                          <option key={n} value={n}>
                            {n} trẻ em
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div>
                    <label className="text-[10px] uppercase font-medium text-[#666666] block mb-1">
                      Họ và tên *
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Nguyễn Văn A"
                      className="w-full bg-[#faf7f1] border border-[#d6cebf] px-2.5 py-2 text-xs rounded-sm focus:outline-hidden focus:border-[#367156]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[10px] uppercase font-medium text-[#666666] block mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="email@example.com"
                        className="w-full bg-[#faf7f1] border border-[#d6cebf] px-2.5 py-2 text-xs rounded-sm focus:outline-hidden focus:border-[#367156]"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-medium text-[#666666] block mb-1">
                        Số điện thoại *
                      </label>
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="0939 014 234"
                        className="w-full bg-[#faf7f1] border border-[#d6cebf] px-2.5 py-2 text-xs rounded-sm focus:outline-hidden focus:border-[#367156]"
                        required
                      />
                    </div>
                  </div>

                  {/* Payment Method Selector */}
                  <div>
                    <label className="text-[10px] uppercase font-medium text-[#666666] block mb-1.5">
                      Phương thức thanh toán
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("vietqr")}
                        className={`flex items-start gap-2.5 p-2.5 rounded-sm border text-left transition-all ${
                          paymentMethod === "vietqr"
                            ? "border-[#367156] bg-[#367156]/5 shadow-xs"
                            : "border-[#d6cebf] bg-[#faf7f1] hover:border-[#367156]/40"
                        }`}
                      >
                        <div className={`mt-0.5 p-1 rounded-sm ${paymentMethod === "vietqr" ? "bg-[#367156] text-white" : "bg-white text-[#666666]"}`}>
                          <QrCode className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-[#367156] flex items-center gap-1.5">
                            <span>Chuyển khoản VietQR</span>
                            <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1 py-0.2 rounded-xs font-medium">Khuyên dùng</span>
                          </div>
                          <p className="text-[10px] text-[#666666] mt-0.5">
                            Quét mã QR qua app MB / Mobile Banking nhận xác nhận tự động.
                          </p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod("pay_at_villa")}
                        className={`flex items-start gap-2.5 p-2.5 rounded-sm border text-left transition-all ${
                          paymentMethod === "pay_at_villa"
                            ? "border-[#367156] bg-[#367156]/5 shadow-xs"
                            : "border-[#d6cebf] bg-[#faf7f1] hover:border-[#367156]/40"
                        }`}
                      >
                        <div className={`mt-0.5 p-1 rounded-sm ${paymentMethod === "pay_at_villa" ? "bg-[#367156] text-white" : "bg-white text-[#666666]"}`}>
                          <CreditCard className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-[#222222]">
                            Thanh toán tại quầy khi Check-in
                          </div>
                          <p className="text-[10px] text-[#666666] mt-0.5">
                            Thanh toán trực tiếp bằng tiền mặt hoặc thẻ tại M_Dalats Villa.
                          </p>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Summary Card */}
                  <div className="bg-[#faf7f1] p-3.5 rounded-sm border border-[#ece7dd] text-xs space-y-1">
                    <div className="flex justify-between text-[#666666]">
                      <span>Đơn giá mỗi đêm:</span>
                      <span>{formatPrice(room.pricePerNight)}</span>
                    </div>
                    <div className="flex justify-between text-[#666666]">
                      <span>Thời gian:</span>
                      <span>{nights} đêm</span>
                    </div>
                    <div className="flex justify-between font-bold text-sm text-[#367156] border-t border-[#ece7dd] pt-2 mt-1">
                      <span>Tổng tiền:</span>
                      <span className="text-[#f27052]">{formatPrice(totalPrice)}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={createBookingMutation.isPending}
                    className="w-full bg-[#f27052] hover:bg-[#e05c3c] text-white text-xs uppercase tracking-wider font-semibold py-3 rounded-sm shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {createBookingMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
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
          <div className="pt-10 border-t border-[#ece7dd]">
            <h3 className="font-serif text-2xl text-[#222222] mb-6">
              Các phòng nghỉ khác bạn có thể thích
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {otherRooms.map((r) => (
                <Link
                  key={r.id}
                  href={`/rooms/${r.slug}`}
                  className="group bg-white rounded-sm overflow-hidden border border-[#ece7dd] shadow-xs hover:shadow-lg transition-all"
                >
                  <div className="relative h-44 w-full overflow-hidden">
                    <Image src={r.image} alt={r.name} fill className="object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="p-4">
                    <h4 className="font-serif text-lg font-medium text-[#222222] group-hover:text-[#367156]">
                      {r.name}
                    </h4>
                    <p className="text-xs text-[#777777]">{r.area} m² • {r.viewType}</p>
                    <p className="text-xs font-bold text-[#367156] mt-2">{formatPrice(r.pricePerNight)} / đêm</p>
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
