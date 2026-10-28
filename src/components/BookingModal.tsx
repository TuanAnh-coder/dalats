"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Users,
  CheckCircle2,
  AlertCircle,
  QrCode,
  CreditCard,
  Building,
  ShieldCheck,
  Loader2,
  X,
  Phone,
  Bed,
  Maximize2,
  Lock,
  ArrowRight,
} from "lucide-react";
import type { Room } from "~/server/db/schema";
import { api } from "~/trpc/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { BookingSuccessReceipt } from "./BookingSuccessReceipt";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  rooms: Room[];
  selectedRoom?: Room | null;
  initialRoomId?: number;
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialAdults?: number;
  initialChildren?: number;
}

export function BookingModal({
  isOpen,
  onClose,
  rooms,
  selectedRoom,
  initialRoomId,
  initialCheckIn,
  initialCheckOut,
  initialAdults,
  initialChildren,
}: BookingModalProps) {
  const effectiveRoomId = selectedRoom?.id ?? initialRoomId ?? rooms[0]?.id ?? 1;
  const [roomId, setRoomId] = useState<number>(effectiveRoomId);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"vietqr" | "pay_at_villa">("vietqr");

  // Sync state when selectedRoom, initialRoomId or open changes
  useEffect(() => {
    if (selectedRoom?.id) {
      setRoomId(selectedRoom.id);
    } else if (initialRoomId) {
      setRoomId(initialRoomId);
    }
  }, [selectedRoom, initialRoomId, isOpen]);

  const today = new Date().toISOString().split("T")[0] ?? "2026-10-19";
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0] ?? "2026-10-20";

  const [checkIn, setCheckIn] = useState<string>(initialCheckIn || today);
  const [checkOut, setCheckOut] = useState<string>(initialCheckOut || tomorrow);
  const [adults, setAdults] = useState<number>(initialAdults ?? 2);
  const [children, setChildren] = useState<number>(initialChildren ?? 0);

  useEffect(() => {
    if (initialCheckIn) setCheckIn(initialCheckIn);
    if (initialCheckOut) setCheckOut(initialCheckOut);
    if (initialAdults !== undefined) setAdults(initialAdults);
    if (initialChildren !== undefined) setChildren(initialChildren);
  }, [initialCheckIn, initialCheckOut, initialAdults, initialChildren, isOpen]);

  // Selected room details
  const activeRoom = rooms.find((r) => r.id === roomId) || rooms[0];

  // Booking Result state for Receipt Screen
  const [bookingResult, setBookingResult] = useState<{
    bookingCode: string;
    totalPrice: number;
    roomName: string;
  } | null>(null);

  const nights = React.useMemo(() => {
    const d1 = new Date(checkIn);
    const d2 = new Date(checkOut);
    const diff = Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  }, [checkIn, checkOut]);

  // Check live availability & pricing for the chosen room and dates
  const availabilityQuery = api.booking.checkAvailability.useQuery(
    {
      roomId,
      checkIn,
      checkOut,
      adults,
      children,
    },
    {
      enabled: isOpen && !!roomId && !!checkIn && !!checkOut,
    }
  );

  // Live search for alternative available rooms
  const roomsSearchQuery = api.room.search.useQuery(
    {
      checkIn,
      checkOut,
      adults,
      children,
      floor: "all",
      sortBy: "default",
    },
    {
      enabled: isOpen && !!checkIn && !!checkOut,
    }
  );

  const isCurrentRoomAvailable = availabilityQuery.data ? availabilityQuery.data.isAvailable : true;
  const pricingData = availabilityQuery.data?.pricing;
  const firstAvailableRoom = roomsSearchQuery.data?.find((r) => r.isAvailableForDates && r.id !== roomId);

  const totalPrice = pricingData?.totalPrice ?? (activeRoom ? activeRoom.pricePerNight * nights : 0);

  const createBookingMutation = api.booking.create.useMutation({
    onSuccess: (data) => {
      setBookingResult({
        bookingCode: data.bookingCode,
        totalPrice: data.totalPrice,
        roomName: activeRoom?.name || "Phòng nghỉ",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCurrentRoomAvailable) return;
    const combinedRequests = [
      specialRequests?.trim(),
      paymentMethod ? `Phương thức thanh toán: ${paymentMethod === "vietqr" ? "Chuyển khoản VietQR" : "Tiền mặt khi nhận phòng"}` : "",
    ].filter(Boolean).join(" | ");

    createBookingMutation.mutate({
      roomId,
      checkIn,
      checkOut,
      adults,
      children,
      customerName,
      customerEmail,
      customerPhone,
      totalNights: nights,
      totalPrice,
      specialRequests: combinedRequests || undefined,
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " ₫";
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl bg-[#121314] text-white border border-white/20 rounded-[8px] sm:rounded-[12px] p-6 sm:p-8 max-h-[92vh] overflow-y-auto custom-scrollbar shadow-2xl">
        {bookingResult ? (
          /* Receipt Screen */
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
          /* Booking Form: PlayStation SST Light 300 Title */
          <div>
            <DialogHeader className="text-center mb-6">
              <span className="text-[12px] uppercase tracking-[1.5px] text-[#53b1ff] font-bold block mb-1">
                Concierge Privé • Đặt phòng trực tiếp
              </span>
              <DialogTitle className="text-2xl sm:text-3xl font-light text-white tracking-tight text-center">
                Thông tin đặt phòng M_Dalats Villa
              </DialogTitle>
              <DialogDescription className="text-xs text-neutral-400 mt-1 font-normal text-center">
                Cam kết giá tốt nhất • Không phí dịch vụ ẩn • Hỗ trợ Concierge 24/7
              </DialogDescription>
            </DialogHeader>

            {createBookingMutation.isError && (
              <div className="mb-4 p-3 bg-red-950/80 border border-red-800 text-red-200 text-xs rounded-[4px] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-[#ef4444] shrink-0" />
                <span>{createBookingMutation.error?.message || "Đã xảy ra lỗi khi tạo đơn đặt phòng."}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Room Choice */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] uppercase tracking-[1px] text-neutral-400 font-bold block">
                    Chọn phòng nghỉ
                  </label>
                  {!isCurrentRoomAvailable && (
                    <span className="text-[10px] text-white font-bold bg-[#c81b3a] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      🔒 Kín lịch ngày này
                    </span>
                  )}
                </div>

                <select
                  value={roomId}
                  onChange={(e) => setRoomId(Number(e.target.value))}
                  className={`w-full bg-[#181818] border px-3.5 py-2.5 text-xs text-white rounded-[4px] focus:outline-none font-medium ${
                    !isCurrentRoomAvailable
                      ? "border-[#ef4444] ring-1 ring-[#ef4444]"
                      : "border-white/20 focus:border-[#0070d1]"
                  }`}
                >
                  {rooms.map((r) => {
                    const searchInfo = roomsSearchQuery.data?.find((s) => s.id === r.id);
                    const isRoomBooked = searchInfo ? searchInfo.isBooked : false;
                    const isRoomClosed = !r.isAvailable;
                    const isDisabled = isRoomBooked || isRoomClosed;

                    return (
                      <option key={r.id} value={r.id} disabled={isDisabled} className="bg-[#181818] text-white">
                        {isRoomBooked
                          ? "🔒 [ĐÃ KÍN LỊCH] "
                          : isRoomClosed
                          ? "⚪ [BẢO TRÌ] "
                          : "✓ "}
                        {r.name} - {r.area}m² - {r.viewType} ({formatPrice(r.pricePerNight)}/đêm)
                        {isRoomBooked ? " (Đã có khách thuê)" : isRoomClosed ? " (Tạm đóng)" : ""}
                      </option>
                    );
                  })}
                </select>

                {/* Conflict Alert Box with One-Click Switch */}
                {!isCurrentRoomAvailable && (
                  <div className="mt-2.5 p-3.5 bg-red-950/60 border border-red-800 rounded-[6px] text-xs text-red-200 space-y-2">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-[#ef4444] shrink-0 mt-0.5" />
                      <div>
                        <strong className="block font-semibold">Phòng {activeRoom?.name} đã có khách thuê:</strong>
                        <p className="text-[11px] text-red-300 mt-0.5">
                          {availabilityQuery.data?.reason || "Khoảng thời gian bạn chọn trùng lịch với khách khác. Vui lòng chọn ngày khác hoặc đổi phòng."}
                        </p>
                      </div>
                    </div>
                    {firstAvailableRoom && (
                      <button
                        type="button"
                        onClick={() => setRoomId(firstAvailableRoom.id)}
                        className="w-full py-1.5 px-3 bg-red-900/60 hover:bg-red-800 text-white rounded-full text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                      >
                        <span>Chuyển sang {firstAvailableRoom.name} còn trống ({formatPrice(firstAvailableRoom.pricePerNight)}/đêm)</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Dates & Guests Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="space-y-1">
                  <Label className="text-[11px] uppercase tracking-[1px] text-neutral-400 font-bold block">
                    Nhận phòng
                  </Label>
                  <Input
                    type="date"
                    value={checkIn}
                    min={today}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full bg-[#181818] border-white/20 text-white text-xs h-10 rounded-[4px] focus:border-[#0070d1]"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px] uppercase tracking-[1px] text-neutral-400 font-bold block">
                    Trả phòng
                  </Label>
                  <Input
                    type="date"
                    value={checkOut}
                    min={checkIn || today}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full bg-[#181818] border-white/20 text-white text-xs h-10 rounded-[4px] focus:border-[#0070d1]"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px] uppercase tracking-[1px] text-neutral-400 font-bold block">
                    Người lớn
                  </Label>
                  <select
                    value={adults}
                    onChange={(e) => setAdults(Number(e.target.value))}
                    className="w-full bg-[#181818] border border-white/20 px-3 text-xs text-white rounded-[4px] h-10 focus:outline-none focus:border-[#0070d1]"
                  >
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <option key={n} value={n} className="bg-[#181818] text-white">
                        {n} người lớn
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px] uppercase tracking-[1px] text-neutral-400 font-bold block">
                    Trẻ em
                  </Label>
                  <select
                    value={children}
                    onChange={(e) => setChildren(Number(e.target.value))}
                    className="w-full bg-[#181818] border border-white/20 px-3 text-xs text-white rounded-[4px] h-10 focus:outline-none focus:border-[#0070d1]"
                  >
                    {[0, 1, 2, 3].map((n) => (
                      <option key={n} value={n} className="bg-[#181818] text-white">
                        {n} trẻ em
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Customer Info: PlayStation 4px inputs */}
              <div className="space-y-3 pt-2 border-t border-white/10">
                <div className="space-y-1">
                  <Label className="text-[11px] uppercase tracking-[1px] text-neutral-400 font-bold block">
                    Họ và tên quý khách *
                  </Label>
                  <Input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full bg-[#181818] border-white/20 text-white text-xs h-11 rounded-[4px] focus:border-[#0070d1]"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-[11px] uppercase tracking-[1px] text-neutral-400 font-bold block">
                      Email liên hệ *
                    </Label>
                    <Input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="email@example.com"
                      className="w-full bg-[#181818] border-white/20 text-white text-xs h-11 rounded-[4px] focus:border-[#0070d1]"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px] uppercase tracking-[1px] text-neutral-400 font-bold block">
                      Số điện thoại *
                    </Label>
                    <Input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="0939 014 234"
                      className="w-full bg-[#181818] border-white/20 text-white text-xs h-11 rounded-[4px] focus:border-[#0070d1]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-[1px] text-neutral-400 font-bold block mb-1">
                    Yêu cầu đặc biệt (tùy chọn)
                  </label>
                  <textarea
                    rows={2}
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="Giờ check-in dự kiến, tiệc BBQ, set up kỷ niệm..."
                    className="w-full bg-[#181818] border border-white/20 px-3.5 py-2 text-xs text-white rounded-[4px] focus:outline-none focus:border-[#0070d1] resize-none"
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="text-[11px] uppercase tracking-[1px] text-neutral-400 font-bold block mb-2">
                  Phương thức thanh toán
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("vietqr")}
                    className={`flex items-start gap-2.5 p-3 rounded-[8px] border text-left transition-all cursor-pointer ${
                      paymentMethod === "vietqr"
                        ? "border-[#0070d1] bg-[#0070d1]/10 ring-1 ring-[#0070d1]"
                        : "border-white/15 bg-[#181818] hover:border-white/30"
                    }`}
                  >
                    <div className={`mt-0.5 p-1 rounded-full ${paymentMethod === "vietqr" ? "bg-[#0070d1] text-white" : "bg-white/10 text-neutral-400"}`}>
                      <QrCode className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>Chuyển khoản VietQR</span>
                        <span className="text-[9px] bg-[#0070d1] text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Khuyên dùng</span>
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        Quét mã VietQR bằng App Ngân Hàng, xác nhận tức thì.
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("pay_at_villa")}
                    className={`flex items-start gap-2.5 p-3 rounded-[8px] border text-left transition-all cursor-pointer ${
                      paymentMethod === "pay_at_villa"
                        ? "border-[#0070d1] bg-[#0070d1]/10 ring-1 ring-[#0070d1]"
                        : "border-white/15 bg-[#181818] hover:border-white/30"
                    }`}
                  >
                    <div className={`mt-0.5 p-1 rounded-full ${paymentMethod === "pay_at_villa" ? "bg-[#0070d1] text-white" : "bg-white/10 text-neutral-400"}`}>
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">
                        Thanh toán tại Villa
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        Thanh toán tiền mặt hoặc quẹt thẻ khi nhận phòng.
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Value Add Perks Bar */}
              <div className="bg-[#181818] border border-white/10 p-2.5 rounded-[8px] flex flex-wrap items-center justify-center sm:justify-between gap-x-3 gap-y-1 text-[11px] text-neutral-300 font-medium">
                <span className="flex items-center gap-1">✓ Bữa sáng miễn phí</span>
                <span className="flex items-center gap-1">✓ Hủy phòng linh hoạt</span>
                <span className="flex items-center gap-1">✓ Xác nhận tức thì</span>
              </div>

              {/* Price Calculation Summary */}
              <div className="bg-[#181818] p-4 rounded-[8px] border border-white/10 space-y-1.5 text-xs">
                <div className="flex justify-between text-neutral-400">
                  <span>Đơn giá phòng ({activeRoom?.name}):</span>
                  <span className="text-white">{formatPrice(activeRoom?.pricePerNight || 850000)} / đêm</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Thời gian lưu trú:</span>
                  <span className="text-white">{nights} đêm ({checkIn} → {checkOut})</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Tiền phòng cơ bản:</span>
                  <span className="text-white">{formatPrice(pricingData?.baseRoomTotal ?? (activeRoom?.pricePerNight || 850000) * nights)}</span>
                </div>

                {pricingData && pricingData.extraAdults > 0 && (
                  <div className="flex justify-between text-[#53b1ff] bg-[#0070d1]/10 px-2.5 py-1 rounded-[4px]">
                    <span>Phụ thu thêm người lớn (+{pricingData.extraAdults} người × {nights} đêm):</span>
                    <span className="font-bold">+{formatPrice(pricingData.extraAdultTotal)}</span>
                  </div>
                )}

                {pricingData && pricingData.extraChildren > 0 && (
                  <div className="flex justify-between text-[#53b1ff] bg-[#0070d1]/10 px-2.5 py-1 rounded-[4px]">
                    <span>Phụ thu thêm trẻ em (+{pricingData.extraChildren} trẻ × {nights} đêm):</span>
                    <span className="font-bold">+{formatPrice(pricingData.extraChildTotal)}</span>
                  </div>
                )}

                <div className="flex justify-between text-neutral-400">
                  <span>Thuế & phí dịch vụ Concierge:</span>
                  <span className="text-[#53b1ff] font-bold">Đã bao gồm (0 ₫)</span>
                </div>

                <div className="flex justify-between text-sm font-semibold text-white border-t border-white/10 pt-2.5">
                  <span className="font-light text-base">Tổng tiền thanh toán:</span>
                  <span className="text-white font-bold text-2xl">{formatPrice(totalPrice)}</span>
                </div>
              </div>

              {/* Submit Buttons: PlayStation commerce orange pill */}
              <div className="pt-2 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="w-full sm:w-auto px-7 h-12 text-xs font-bold border-white/20 text-white hover:bg-white/10 rounded-full"
                >
                  Hủy bỏ
                </Button>
                <Button
                  type="submit"
                  variant="commerce"
                  disabled={createBookingMutation.isPending || !isCurrentRoomAvailable}
                  className="w-full sm:w-auto px-9 h-12 text-xs sm:text-sm font-bold bg-[#d53b00] hover:bg-[#aa2f00] text-white rounded-full flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-none"
                >
                  {createBookingMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Đang xử lý đơn...</span>
                    </>
                  ) : !isCurrentRoomAvailable ? (
                    <span className="flex items-center gap-1.5">
                      <Lock className="w-4 h-4" />
                      <span>Phòng đã kín lịch ngày này</span>
                    </span>
                  ) : (
                    <span>Xác nhận đặt phòng</span>
                  )}
                </Button>
              </div>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
