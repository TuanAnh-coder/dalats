"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, Calendar, CheckCircle2, AlertCircle, Loader2, QrCode, CreditCard } from "lucide-react";
import { api } from "~/trpc/react";
import { authClient } from "~/server/better-auth/client";
import { BookingSuccessReceipt } from "~/components/BookingSuccessReceipt";
import type { Room } from "~/server/db/schema";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRoom: Room | null;
  rooms: Room[];
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialAdults?: number;
  initialChildren?: number;
}

export function BookingModal({
  isOpen,
  onClose,
  selectedRoom,
  rooms,
  initialCheckIn,
  initialCheckOut,
  initialAdults = 2,
  initialChildren = 0,
}: BookingModalProps) {
  const { data: session } = authClient.useSession();

  const today = new Date().toISOString().split("T")[0] ?? "2026-10-19";
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0] ?? "2026-10-20";

  const [roomId, setRoomId] = useState<number>(selectedRoom ? selectedRoom.id : (rooms[0]?.id ?? 1));
  const [checkIn, setCheckIn] = useState<string>(initialCheckIn || today);
  const [checkOut, setCheckOut] = useState<string>(initialCheckOut || tomorrow);
  const [adults, setAdults] = useState<number>(initialAdults);
  const [children, setChildren] = useState<number>(initialChildren);

  const [customerName, setCustomerName] = useState<string>(session?.user?.name || "");
  const [customerEmail, setCustomerEmail] = useState<string>(session?.user?.email || "");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [specialRequests, setSpecialRequests] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<"vietqr" | "pay_at_villa">("vietqr");

  const [bookingResult, setBookingResult] = useState<{
    bookingCode: string;
    totalPrice: number;
    roomName: string;
  } | null>(null);

  useEffect(() => {
    if (selectedRoom) {
      setRoomId(selectedRoom.id);
    }
  }, [selectedRoom]);

  useEffect(() => {
    if (isOpen) {
      if (initialCheckIn) setCheckIn(initialCheckIn);
      if (initialCheckOut) setCheckOut(initialCheckOut);
      if (initialAdults !== undefined) setAdults(initialAdults);
      if (initialChildren !== undefined) setChildren(initialChildren);
      if (selectedRoom) setRoomId(selectedRoom.id);
      setBookingResult(null);
    }
  }, [isOpen, initialCheckIn, initialCheckOut, initialAdults, initialChildren, selectedRoom]);

  useEffect(() => {
    if (session?.user) {
      if (!customerName) setCustomerName(session.user.name || "");
      if (!customerEmail) setCustomerEmail(session.user.email || "");
    }
  }, [session, customerName, customerEmail]);

  const handleCheckInChange = (val: string) => {
    setCheckIn(val);
    if (checkOut <= val) {
      const nextDay = new Date(new Date(val).getTime() + 86400000).toISOString().split("T")[0] ?? val;
      setCheckOut(nextDay);
    }
  };

  const activeRoom = rooms.find((r) => r.id === roomId) || selectedRoom || rooms[0];

  // Calculate total nights
  const calculateNights = () => {
    const d1 = new Date(checkIn);
    const d2 = new Date(checkOut);
    const diffTime = d2.getTime() - d1.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const nights = calculateNights();
  const totalPrice = (activeRoom?.pricePerNight || 850000) * nights;

  const createBookingMutation = api.booking.create.useMutation({
    onSuccess: (data) => {
      if (data) {
        setBookingResult({
          bookingCode: data.bookingCode,
          totalPrice: data.totalPrice,
          roomName: activeRoom?.name || "Phòng M_Dalats",
        });
      }
    },
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRoom) return;

    createBookingMutation.mutate({
      roomId: activeRoom.id,
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className={`bg-white rounded-lg shadow-2xl border border-[#ece7dd] w-full max-h-[94vh] overflow-y-auto custom-scrollbar relative p-5 sm:p-8 ${bookingResult ? "max-w-3xl" : "max-w-2xl"}`}>
        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            setBookingResult(null);
            onClose();
          }}
          className="absolute top-4 right-4 text-[#888888] hover:text-[#222222] p-1.5 transition-colors z-10"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        {bookingResult ? (
          /* High-end Booking Success Receipt */
          <BookingSuccessReceipt
            bookingCode={bookingResult.bookingCode}
            roomName={bookingResult.roomName}
            checkIn={checkIn}
            checkOut={checkOut}
            nights={nights}
            adults={adults}
            children={children}
            customerName={customerName}
            customerPhone={customerPhone}
            customerEmail={customerEmail}
            totalPrice={bookingResult.totalPrice}
            initialPaymentMethod={paymentMethod}
            onClose={() => {
              setBookingResult(null);
              onClose();
            }}
          />
        ) : (
          /* Booking Form */
          <div>
            <div className="text-center mb-6">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#367156] font-semibold block mb-1">
                Đặt phòng trực tiếp
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#222222]">
                Thông tin đặt phòng M_Dalats Villa
              </h2>
              <p className="text-xs text-[#777777] mt-1 font-light">
                Cam kết giá tốt nhất • Không phí dịch vụ ẩn • Hỗ trợ 24/7
              </p>
            </div>

            {createBookingMutation.isError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{createBookingMutation.error?.message || "Đã xảy ra lỗi khi tạo đơn đặt phòng."}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Room Choice */}
              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#666666] font-medium block mb-1">
                  Chọn phòng nghỉ
                </label>
                <select
                  value={roomId}
                  onChange={(e) => setRoomId(Number(e.target.value))}
                  className="w-full bg-[#faf7f1] border border-[#d6cebf] px-3 py-2.5 text-xs text-[#222222] rounded-sm focus:outline-hidden focus:border-[#367156] font-medium"
                >
                  {rooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} - {r.area}m² - {r.viewType} ({formatPrice(r.pricePerNight)}/đêm)
                    </option>
                  ))}
                </select>
                {activeRoom && (
                  <div className="flex items-center justify-between text-[11px] text-[#666666] mt-1.5 px-0.5">
                    <span>Sức chứa: <strong>{activeRoom.maxAdults} Lớn, {activeRoom.maxChildren} Trẻ</strong></span>
                    <span>Diện tích: <strong>{activeRoom.area} m²</strong></span>
                  </div>
                )}
                {activeRoom && adults > activeRoom.maxAdults && (
                  <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-xs p-1.5 mt-1.5">
                    Lưu ý: Số khách ({adults} người lớn) vượt quá tiêu chuẩn ({activeRoom.maxAdults} người lớn).
                  </p>
                )}
              </div>

              {/* Date Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[#666666] font-medium block mb-1">
                    Ngày nhận phòng (Check-in)
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    min={today}
                    onChange={(e) => handleCheckInChange(e.target.value)}
                    className="w-full bg-[#faf7f1] border border-[#d6cebf] px-3 py-2.5 text-xs text-[#222222] rounded-sm focus:outline-hidden focus:border-[#367156]"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[#666666] font-medium block mb-1">
                    Ngày trả phòng (Check-out)
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    min={checkIn || today}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full bg-[#faf7f1] border border-[#d6cebf] px-3 py-2.5 text-xs text-[#222222] rounded-sm focus:outline-hidden focus:border-[#367156]"
                    required
                  />
                </div>
              </div>

              {/* Guests Selection */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[#666666] font-medium block mb-1">
                    Người lớn
                  </label>
                  <select
                    value={adults}
                    onChange={(e) => setAdults(Number(e.target.value))}
                    className="w-full bg-[#faf7f1] border border-[#d6cebf] px-3 py-2.5 text-xs text-[#222222] rounded-sm"
                  >
                    {[1, 2, 3, 4].map((n) => (
                      <option key={n} value={n}>
                        {n} người lớn
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[#666666] font-medium block mb-1">
                    Trẻ em
                  </label>
                  <select
                    value={children}
                    onChange={(e) => setChildren(Number(e.target.value))}
                    className="w-full bg-[#faf7f1] border border-[#d6cebf] px-3 py-2.5 text-xs text-[#222222] rounded-sm"
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
              <div className="space-y-3 pt-2 border-t border-[#ece7dd]">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[#666666] font-medium block mb-1">
                    Họ và tên quý khách *
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full bg-[#faf7f1] border border-[#d6cebf] px-3 py-2.5 text-xs text-[#222222] rounded-sm focus:outline-hidden focus:border-[#367156]"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-[#666666] font-medium block mb-1">
                      Email liên hệ *
                    </label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="email@example.com"
                      className="w-full bg-[#faf7f1] border border-[#d6cebf] px-3 py-2.5 text-xs text-[#222222] rounded-sm focus:outline-hidden focus:border-[#367156]"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-[#666666] font-medium block mb-1">
                      Số điện thoại *
                    </label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="0939 014 234"
                      className="w-full bg-[#faf7f1] border border-[#d6cebf] px-3 py-2.5 text-xs text-[#222222] rounded-sm focus:outline-hidden focus:border-[#367156]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[#666666] font-medium block mb-1">
                    Yêu cầu đặc biệt (tùy chọn)
                  </label>
                  <textarea
                    rows={2}
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="Giờ check-in dự kiến, chuẩn bị tiệc BBQ, set up kỷ niệm ngày cưới..."
                    className="w-full bg-[#faf7f1] border border-[#d6cebf] px-3 py-2.5 text-xs text-[#222222] rounded-sm focus:outline-hidden focus:border-[#367156]"
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#666666] font-medium block mb-2">
                  Phương thức thanh toán
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("vietqr")}
                    className={`flex items-start gap-2.5 p-3 rounded-sm border text-left transition-all ${
                      paymentMethod === "vietqr"
                        ? "border-[#367156] bg-[#367156]/5 shadow-xs"
                        : "border-[#d6cebf] bg-[#faf7f1] hover:border-[#367156]/40"
                    }`}
                  >
                    <div className={`mt-0.5 p-1 rounded-sm ${paymentMethod === "vietqr" ? "bg-[#367156] text-white" : "bg-white text-[#666666]"}`}>
                      <QrCode className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-[#367156] flex items-center gap-1.5">
                        <span>Chuyển khoản VietQR</span>
                        <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1 py-0.2 rounded-xs font-medium">Khuyên dùng</span>
                      </div>
                      <p className="text-[11px] text-[#666666] mt-0.5">
                        Quét mã VietQR bằng App Ngân Hàng, xác nhận tức thì.
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("pay_at_villa")}
                    className={`flex items-start gap-2.5 p-3 rounded-sm border text-left transition-all ${
                      paymentMethod === "pay_at_villa"
                        ? "border-[#367156] bg-[#367156]/5 shadow-xs"
                        : "border-[#d6cebf] bg-[#faf7f1] hover:border-[#367156]/40"
                    }`}
                  >
                    <div className={`mt-0.5 p-1 rounded-sm ${paymentMethod === "pay_at_villa" ? "bg-[#367156] text-white" : "bg-white text-[#666666]"}`}>
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-[#222222]">
                        Thanh toán tại Villa
                      </div>
                      <p className="text-[11px] text-[#666666] mt-0.5">
                        Thanh toán tiền mặt hoặc quẹt thẻ khi nhận phòng.
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Agoda Perks Bar */}
              <div className="bg-emerald-50/80 border border-emerald-200/80 p-2.5 rounded-sm flex flex-wrap items-center justify-center sm:justify-between gap-x-3 gap-y-1 text-[11px] text-emerald-800 font-medium">
                <span className="flex items-center gap-1">✓ Bữa sáng miễn phí</span>
                <span className="flex items-center gap-1">✓ Hủy phòng miễn phí</span>
                <span className="flex items-center gap-1">✓ Xác nhận tức thì</span>
              </div>

              {/* Price Calculation Summary */}
              <div className="bg-[#faf7f1] p-4 rounded-md border border-[#ece7dd] space-y-1.5 text-xs">
                <div className="flex justify-between text-[#666666]">
                  <span>Đơn giá mỗi đêm:</span>
                  <span>{formatPrice(activeRoom?.pricePerNight || 850000)}</span>
                </div>
                <div className="flex justify-between text-[#666666]">
                  <span>Thời gian lưu trú:</span>
                  <span>{nights} đêm</span>
                </div>
                <div className="flex justify-between text-[#666666]">
                  <span>Thuế & phí dịch vụ:</span>
                  <span className="text-emerald-700 font-semibold">Đã bao gồm (0 ₫)</span>
                </div>
                {activeRoom?.originalPrice && activeRoom.originalPrice > activeRoom.pricePerNight && (
                  <div className="flex justify-between text-[#367156]">
                    <span>Tiết kiệm so với giá gốc:</span>
                    <span>-{formatPrice((activeRoom.originalPrice - activeRoom.pricePerNight) * nights)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-semibold text-[#367156] border-t border-[#ece7dd] pt-2">
                  <span>Tổng cộng:</span>
                  <span className="text-[#f27052] font-bold text-base">{formatPrice(totalPrice)}</span>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 sm:gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-4 py-3 sm:py-2.5 border border-[#cccccc] text-[#555555] hover:bg-[#faf7f1] rounded-sm text-xs uppercase tracking-wider font-medium cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={createBookingMutation.isPending}
                  className="w-full sm:w-auto bg-[#f27052] hover:bg-[#e05c3c] text-white px-6 py-3 sm:py-2.5 rounded-sm text-xs uppercase tracking-wider font-medium shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {createBookingMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Đang xử lý...</span>
                    </>
                  ) : (
                    <span>Xác nhận đặt phòng</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
