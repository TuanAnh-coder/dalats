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
    <div className="space-y-6 text-[#222222] select-text">
      {/* Success Hero Badge */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-200 shadow-sm animate-zoomIn">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#367156] font-bold block">
          Xác nhận thành công • M_Dalats Villa
        </span>
        <h3 className="font-serif text-2xl sm:text-3xl text-[#367156] font-normal">
          Hẹn Gặp Bạn Tại Đà Lạt!
        </h3>
        <p className="text-xs text-[#666666] max-w-md mx-auto font-light leading-relaxed">
          Đơn đặt phòng đã được ghi nhận trên hệ thống. Quản gia villa sẽ gửi tin nhắn SMS / Zalo hoặc gọi điện để hỗ trợ chuẩn bị đón tiếp quý khách.
        </p>
      </div>

      {/* Booking Summary Box */}
      <div className="bg-[#FAF9F6] border border-[#ece7dd] rounded-md p-4 sm:p-5 shadow-xs text-xs space-y-3">
        {/* Top Header with Booking Code */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#ece7dd] gap-2">
          <div>
            <span className="text-[10px] text-[#777777] uppercase tracking-wider block">Mã đặt phòng</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-mono text-base font-bold text-[#367156] tracking-wider">
                {bookingCode}
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(bookingCode, "code")}
                className="text-[#367156] hover:text-[#367156] p-1 transition-colors cursor-pointer"
                title="Sao chép mã đơn"
              >
                {copiedField === "code" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[10px] text-[#777777] uppercase tracking-wider block">Tổng thanh toán ({nights} đêm)</span>
            <span className="font-serif text-xl sm:text-2xl font-bold text-[#f27052]">
              {formatPrice(totalPrice)}
            </span>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-[11px] sm:text-xs">
          <div>
            <span className="text-[#888888] block text-[10px] uppercase">Hạng phòng:</span>
            <span className="font-semibold text-[#367156] text-sm">{roomName}</span>
          </div>
          <div>
            <span className="text-[#888888] block text-[10px] uppercase">Khách lưu trú:</span>
            <span className="font-medium text-[#222222]">
              {customerName} • {customerPhone}
            </span>
          </div>
          <div>
            <span className="text-[#888888] block text-[10px] uppercase">Lịch trình lưu trú:</span>
            <span className="font-medium text-[#222222]">
              {formatDateDisplay(checkIn)} (14:00) → {formatDateDisplay(checkOut)} (12:00)
            </span>
          </div>
          <div>
            <span className="text-[#888888] block text-[10px] uppercase">Số lượng khách:</span>
            <span className="font-medium text-[#222222]">
              {adults} Người lớn{children > 0 ? `, ${children} Trẻ em` : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Payment Options Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-[#ece7dd] pb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#367156] flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5 text-[#367156]" />
            Hình thức thanh toán
          </span>
          <div className="flex items-center gap-1.5 bg-[#FAF9F6] p-0.5 rounded-full border border-[#ece7dd] text-[10px]">
            <button
              type="button"
              onClick={() => setPaymentMethod("vietqr")}
              className={`px-3 py-1 rounded-full font-medium transition-all cursor-pointer ${
                paymentMethod === "vietqr"
                  ? "bg-[#367156] text-white shadow-xs"
                  : "text-[#666666] hover:text-[#367156]"
              }`}
            >
              Chuyển khoản VietQR
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod("pay_at_villa")}
              className={`px-3 py-1 rounded-full font-medium transition-all cursor-pointer ${
                paymentMethod === "pay_at_villa"
                  ? "bg-[#367156] text-white shadow-xs"
                  : "text-[#666666] hover:text-[#367156]"
              }`}
            >
              Tại quầy khi Check-in
            </button>
          </div>
        </div>

        {paymentMethod === "vietqr" ? (
          /* VietQR Card */
          <div className="bg-white border border-[#D9C9A7]/80 rounded-md p-4 sm:p-5 shadow-xs grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            {/* QR Code Column */}
            <div className="sm:col-span-5 flex flex-col items-center justify-center text-center">
              <div className="relative w-44 h-44 sm:w-48 sm:h-48 border border-[#ece7dd] rounded-md overflow-hidden bg-white shadow-sm p-1">
                <img
                  src={vietQrUrl}
                  alt={`Mã VietQR thanh toán đơn ${bookingCode}`}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-[10px] text-[#777777] mt-2 flex items-center gap-1">
                <QrCode className="w-3 h-3 text-[#F4A261]" />
                Quét mã qua app ngân hàng / MoMo
              </span>
            </div>

            {/* Bank Transfer Specs Column */}
            <div className="sm:col-span-7 space-y-2.5 text-xs">
              <div className="space-y-0.5">
                <span className="text-[10px] text-[#888888] uppercase block">Ngân hàng</span>
                <p className="font-semibold text-[#367156] text-xs sm:text-sm">{bankInfo.bankName}</p>
              </div>

              <div className="flex items-center justify-between bg-[#FAF9F6] p-2 rounded-xs border border-[#ece7dd]">
                <div>
                  <span className="text-[10px] text-[#888888] uppercase block">Số tài khoản</span>
                  <span className="font-mono font-bold text-sm text-[#367156]">{bankInfo.accountNumber}</span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(bankInfo.accountNumber, "stk")}
                  className="text-[10px] uppercase font-semibold text-[#367156] hover:text-[#367156] flex items-center gap-1 px-2 py-1 bg-white border border-[#ece7dd] rounded-xs cursor-pointer shadow-2xs"
                >
                  {copiedField === "stk" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedField === "stk" ? "Đã sao chép" : "Sao chép"}</span>
                </button>
              </div>

              <div>
                <span className="text-[10px] text-[#888888] uppercase block">Chủ tài khoản</span>
                <p className="font-semibold text-[#222222]">{bankInfo.accountName}</p>
              </div>

              <div className="flex items-center justify-between bg-[#FAF9F6] p-2 rounded-xs border border-[#ece7dd]">
                <div>
                  <span className="text-[10px] text-[#888888] uppercase block">Nội dung chuyển khoản (bắt buộc)</span>
                  <span className="font-mono font-bold text-sm text-[#f27052]">{bankInfo.note}</span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(bankInfo.note, "note")}
                  className="text-[10px] uppercase font-semibold text-[#367156] hover:text-[#367156] flex items-center gap-1 px-2 py-1 bg-white border border-[#ece7dd] rounded-xs cursor-pointer shadow-2xs"
                >
                  {copiedField === "note" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedField === "note" ? "Đã sao chép" : "Sao chép"}</span>
                </button>
              </div>

              <p className="text-[10px] text-[#777777] italic leading-tight">
                * Quý khách vui lòng chuyển khoản cọc 50% hoặc thanh toán 100% để villa giữ phòng chắc chắn cho bạn.
              </p>
            </div>
          </div>
        ) : (
          /* Pay on arrival notice */
          <div className="bg-[#FAF9F6] border border-[#ece7dd] rounded-md p-4 text-xs text-[#555555] space-y-2">
            <div className="flex items-center gap-2 text-[#367156] font-semibold">
              <Building className="w-4 h-4 text-[#367156]" />
              <span>Thanh toán trực tiếp tại Lễ tân M_Dalats Villa</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Quý khách có thể thanh toán bằng tiền mặt hoặc thẻ ngân hàng (POS) khi làm thủ tục nhận phòng lúc 14:00. Quản gia sẽ liên hệ trước giờ đón tiếp để hỗ trợ chuẩn bị phòng tốt nhất.
            </p>
          </div>
        )}
      </div>

      {/* Villa Policies & Perks Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px] text-[#666666] pt-1 border-t border-[#ece7dd]">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#367156] shrink-0" />
          <span>Miễn phí hủy trước 48 giờ</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-[#367156] shrink-0" />
          <span>Check-in 14:00 • Check-out 12:00</span>
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-[#367156] shrink-0" />
          <span>14 Đường 3 Tháng 4, P.3, Đà Lạt</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#ece7dd]">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-2 border border-[#d6cebf] hover:bg-[#FAF9F6] text-[#367156] text-xs font-medium rounded-sm transition-colors cursor-pointer"
            title="In hoặc lưu biên nhận thành file PDF"
          >
            <Printer className="w-3.5 h-3.5 text-[#367156]" />
            <span>In biên nhận</span>
          </button>

          <Link
            href={`/my-bookings?code=${bookingCode}`}
            className="inline-flex items-center gap-1 text-xs text-[#367156] hover:text-[#f27052] font-semibold underline underline-offset-2 px-2"
          >
            <span>Tra cứu đơn</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href="tel:0939014234"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-[#367156] text-[#367156] hover:bg-[#FAF9F6] text-xs font-semibold rounded-sm transition-colors cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5 text-[#367156]" />
            <span>Hotline 0939 014 234</span>
          </a>

          <button
            type="button"
            onClick={onClose}
            className="bg-[#367156] hover:bg-[#498b6c] text-white px-5 py-2 rounded-sm text-xs uppercase tracking-wider font-semibold shadow-sm transition-colors cursor-pointer"
          >
            Hoàn tất
          </button>
        </div>
      </div>
    </div>
  );
}
