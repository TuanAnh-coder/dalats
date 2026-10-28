"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  Copy,
  Check,
  Printer,
  Calendar,
  MapPin,
  PhoneCall,
  QrCode,
  CreditCard,
  Building,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import { Button } from "~/components/ui/button";

interface BookingSuccessReceiptProps {
  bookingCode: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  adults: number;
  children: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  totalPrice: number;
  initialPaymentMethod?: "vietqr" | "pay_at_villa";
  onClose: () => void;
}

export function BookingSuccessReceipt({
  bookingCode,
  roomName,
  checkIn,
  checkOut,
  nights,
  adults,
  children,
  customerName,
  customerPhone,
  customerEmail,
  totalPrice,
  initialPaymentMethod = "vietqr",
  onClose,
}: BookingSuccessReceiptProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"vietqr" | "pay_at_villa">(initialPaymentMethod);

  const bankInfo = {
    bankName: "MB Bank (Ngân hàng Quân Đội)",
    accountNumber: "0939014234",
    accountName: "M_DALATS BOUTIQUE VILLA",
    amount: totalPrice,
    note: bookingCode,
  };

  const vietQrUrl = `https://img.vietqr.io/image/MB-0939014234-compact.png?amount=${totalPrice}&addInfo=${encodeURIComponent(
    bookingCode
  )}&accountName=${encodeURIComponent("M_DALATS VILLA")}`;

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 text-white select-text">
      {/* Success Hero Badge */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-[#0070d1] text-white rounded-full flex items-center justify-center mx-auto shadow-lg">
          <CheckCircle2 className="w-8 h-8 text-white" />
        </div>
        <span className="text-[12px] uppercase tracking-[1.5px] text-[#53b1ff] font-bold block">
          Xác nhận thành công • M_Dalats Villa
        </span>
        <h3 className="text-2xl sm:text-3xl text-white font-light tracking-tight">
          Hẹn gặp quý khách tại Đà Lạt!
        </h3>
        <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto font-normal leading-relaxed">
          Đơn đặt phòng đã được ghi nhận trên hệ thống Concierge. Quản gia villa sẽ gửi tin nhắn hoặc gọi điện để chuẩn bị chu đáo nhất cho chuyến đi của quý khách.
        </p>
      </div>

      {/* Booking Summary Box: PlayStation product-card-dark */}
      <div className="bg-[#181818] border border-white/10 rounded-[8px] p-5 sm:p-6 text-xs space-y-3">
        {/* Top Header with Booking Code */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/10 gap-2">
          <div>
            <span className="text-[10px] text-neutral-400 uppercase tracking-[1px] block font-bold">Mã đặt phòng</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-mono text-base font-bold text-[#53b1ff] tracking-wider">
                {bookingCode}
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(bookingCode, "code")}
                className="text-neutral-400 hover:text-white p-1 transition-colors cursor-pointer"
                title="Sao chép mã đơn"
              >
                {copiedField === "code" ? <Check className="w-3.5 h-3.5 text-[#53b1ff]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[10px] text-neutral-400 uppercase tracking-[1px] block font-bold">Tổng thanh toán ({nights} đêm)</span>
            <span className="text-xl sm:text-2xl font-bold text-white">
              {formatPrice(totalPrice)}
            </span>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-[11px] sm:text-xs">
          <div>
            <span className="text-neutral-400 block text-[10px] uppercase font-bold">Hạng phòng:</span>
            <span className="font-semibold text-white text-sm">{roomName}</span>
          </div>
          <div>
            <span className="text-neutral-400 block text-[10px] uppercase font-bold">Khách lưu trú:</span>
            <span className="font-medium text-neutral-200">
              {customerName} • {customerPhone}
            </span>
          </div>
          <div>
            <span className="text-neutral-400 block text-[10px] uppercase font-bold">Lịch trình lưu trú:</span>
            <span className="font-medium text-neutral-200">
              {formatDateDisplay(checkIn)} (14:00) → {formatDateDisplay(checkOut)} (12:00)
            </span>
          </div>
          <div>
            <span className="text-neutral-400 block text-[10px] uppercase font-bold">Số lượng khách:</span>
            <span className="font-medium text-neutral-200">
              {adults} Người lớn{children > 0 ? `, ${children} Trẻ em` : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Payment Options Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5 text-[#53b1ff]" />
            Hình thức thanh toán
          </span>
          <div className="flex items-center gap-1.5 bg-[#121314] p-1 rounded-full border border-white/15 text-[10px]">
            <button
              type="button"
              onClick={() => setPaymentMethod("vietqr")}
              className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
                paymentMethod === "vietqr"
                  ? "bg-[#0070d1] text-white"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              Chuyển khoản VietQR
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod("pay_at_villa")}
              className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
                paymentMethod === "pay_at_villa"
                  ? "bg-[#0070d1] text-white"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              Tại quầy khi Check-in
            </button>
          </div>
        </div>

        {paymentMethod === "vietqr" ? (
          /* VietQR Card */
          <div className="bg-[#181818] border border-white/10 rounded-[8px] p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            {/* QR Code Column */}
            <div className="sm:col-span-5 flex flex-col items-center justify-center text-center">
              <div className="relative w-44 h-44 sm:w-48 sm:h-48 border border-white/20 rounded-[8px] overflow-hidden bg-white p-1">
                <img
                  src={vietQrUrl}
                  alt={`Mã VietQR thanh toán đơn ${bookingCode}`}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-[10px] text-neutral-400 mt-2 flex items-center gap-1 font-medium">
                <QrCode className="w-3 h-3 text-[#53b1ff]" />
                Quét mã qua app ngân hàng
              </span>
            </div>

            {/* Bank Transfer Specs Column */}
            <div className="sm:col-span-7 space-y-2.5 text-xs">
              <div className="space-y-0.5">
                <span className="text-[10px] text-neutral-400 uppercase font-bold block">Ngân hàng</span>
                <p className="font-semibold text-white text-xs sm:text-sm">{bankInfo.bankName}</p>
              </div>

              <div className="flex items-center justify-between bg-[#121314] p-2.5 rounded-[6px] border border-white/10">
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase font-bold block">Số tài khoản</span>
                  <span className="font-mono font-bold text-sm text-[#53b1ff]">{bankInfo.accountNumber}</span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(bankInfo.accountNumber, "stk")}
                  className="text-[10px] uppercase font-bold text-white hover:text-[#53b1ff] flex items-center gap-1 px-3 py-1 bg-white/10 border border-white/10 rounded-full cursor-pointer"
                >
                  {copiedField === "stk" ? <Check className="w-3.5 h-3.5 text-[#53b1ff]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedField === "stk" ? "Đã chép" : "Sao chép"}</span>
                </button>
              </div>

              <div>
                <span className="text-[10px] text-neutral-400 uppercase font-bold block">Chủ tài khoản</span>
                <p className="font-semibold text-white">{bankInfo.accountName}</p>
              </div>

              <div className="flex items-center justify-between bg-[#121314] p-2.5 rounded-[6px] border border-white/10">
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase font-bold block">Nội dung chuyển khoản (bắt buộc)</span>
                  <span className="font-mono font-bold text-sm text-[#53b1ff]">{bankInfo.note}</span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(bankInfo.note, "note")}
                  className="text-[10px] uppercase font-bold text-white hover:text-[#53b1ff] flex items-center gap-1 px-3 py-1 bg-white/10 border border-white/10 rounded-full cursor-pointer"
                >
                  {copiedField === "note" ? <Check className="w-3.5 h-3.5 text-[#53b1ff]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedField === "note" ? "Đã chép" : "Sao chép"}</span>
                </button>
              </div>

              <p className="text-[10px] text-neutral-400 italic leading-tight">
                * Quý khách vui lòng chuyển khoản cọc 50% hoặc thanh toán 100% để villa giữ phòng chắc chắn cho bạn.
              </p>
            </div>
          </div>
        ) : (
          /* Pay on arrival notice */
          <div className="bg-[#181818] border border-white/10 rounded-[8px] p-4 text-xs text-neutral-200 space-y-2">
            <div className="flex items-center gap-2 text-white font-semibold">
              <Building className="w-4 h-4 text-[#53b1ff]" />
              <span>Thanh toán trực tiếp tại Lễ tân M_Dalats Villa</span>
            </div>
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              Quý khách có thể thanh toán bằng tiền mặt hoặc thẻ ngân hàng (POS) khi làm thủ tục nhận phòng lúc 14:00. Quản gia sẽ liên hệ trước giờ đón tiếp để hỗ trợ chuẩn bị phòng tốt nhất.
            </p>
          </div>
        )}
      </div>

      {/* Villa Policies & Perks Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px] text-neutral-400 pt-1 border-t border-white/10">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#53b1ff] shrink-0" />
          <span>Miễn phí hủy trước 48 giờ</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-[#53b1ff] shrink-0" />
          <span>Check-in 14:00 • Check-out 12:00</span>
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-[#53b1ff] shrink-0" />
          <span>14B Khe Sanh, Phường 10, Đà Lạt</span>
        </div>
      </div>

      {/* Action Buttons: PlayStation pill buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-5 h-11 border border-white/20 bg-transparent hover:bg-white/10 text-white text-xs font-bold rounded-full transition-colors cursor-pointer"
            title="In hoặc lưu biên nhận"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>In biên nhận</span>
          </button>

          <Link
            href={`/my-bookings?code=${bookingCode}`}
            className="inline-flex items-center gap-1 text-xs text-neutral-300 hover:text-[#53b1ff] font-medium underline underline-offset-4 px-2"
          >
            <span>Tra cứu đơn</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href="tel:0939014234"
            className="inline-flex items-center gap-1.5 px-5 h-11 border border-white/20 bg-transparent text-white hover:bg-white/10 text-xs font-bold rounded-full transition-colors cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5 text-[#53b1ff]" />
            <span>Hotline 0939 014 234</span>
          </a>

          <button
            type="button"
            onClick={onClose}
            className="bg-[#0070d1] hover:bg-[#0064b7] active:bg-[#004d8d] text-white px-7 h-11 rounded-full text-xs font-bold transition-colors cursor-pointer shadow-none"
          >
            Hoàn tất
          </button>
        </div>
      </div>
    </div>
  );
}
