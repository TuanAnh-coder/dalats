"use client";

import React from "react";
import Image from "next/image";
import { X, Calendar, MapPin, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import { api } from "~/trpc/react";

interface MyBookingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MyBookingsModal({ isOpen, onClose }: MyBookingsModalProps) {
  const { data: userBookings, isLoading, refetch } = api.booking.getMyBookings.useQuery(undefined, {
    enabled: isOpen,
  });

  const cancelMutation = api.booking.cancel.useMutation({
    onSuccess: () => {
      void refetch();
    },
  });

  if (!isOpen) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " ₫";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-lg shadow-2xl border border-[#ece7dd] max-w-3xl w-full max-h-[88vh] overflow-y-auto custom-scrollbar relative p-6 sm:p-8">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-[#888888] hover:text-[#222222] p-1.5 transition-colors cursor-pointer"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6 pb-4 border-b border-[#ece7dd]">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#367156] font-semibold block mb-1">
            Tài khoản thành viên
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl text-[#222222] font-normal">
            Lịch sử & Đơn đặt phòng của bạn
          </h3>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center text-[#777777] gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#367156]" />
            <p className="text-xs">Đang tải danh sách đặt phòng...</p>
          </div>
        ) : !userBookings || userBookings.length === 0 ? (
          <div className="py-12 text-center text-[#777777]">
            <Calendar className="w-12 h-12 text-[#cccccc] mx-auto mb-3" />
            <p className="text-sm font-medium text-[#444444]">Bạn chưa có đơn đặt phòng nào</p>
            <p className="text-xs text-[#888888] mt-1 font-light">
              Hãy chọn phòng ưng ý tại M_Dalats Villa để bắt đầu chuyến nghỉ dưỡng tại Đà Lạt!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {userBookings.map((b) => (
              <div
                key={b.id}
                className="bg-[#faf7f1] border border-[#ece7dd] rounded-sm p-4 sm:p-5 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center"
              >
                <div className="flex gap-4 items-center">
                  <div className="relative w-20 h-20 rounded-sm overflow-hidden flex-shrink-0 bg-white border border-[#ece7dd]">
                    {b.room?.image && (
                      <Image
                        src={b.room.image}
                        alt={b.room.name || "Phòng"}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#367156]">
                        {b.bookingCode}
                      </span>
                      <span
                        className={`text-[10px] uppercase font-medium px-2 py-0.5 rounded-full ${
                          b.status === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : b.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {b.status === "confirmed"
                          ? "Đã xác nhận"
                          : b.status === "cancelled"
                          ? "Đã hủy"
                          : "Đang chờ"}
                      </span>
                    </div>

                    <h4 className="font-serif text-lg text-[#222222] font-semibold mt-1">
                      {b.room?.name || "Phòng M_Dalats"}
                    </h4>

                    <p className="text-xs text-[#666666] font-light mt-0.5">
                      {b.checkIn} → {b.checkOut} ({b.totalNights} đêm) • {b.adults} người lớn
                    </p>

                    <p className="text-xs font-semibold text-[#f27052] mt-1">
                      Tổng tiền: {formatPrice(b.totalPrice)}
                    </p>
                  </div>
                </div>

                {b.status !== "cancelled" && (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm("Bạn có chắc chắn muốn hủy đơn đặt phòng này?")) {
                        cancelMutation.mutate({ id: b.id });
                      }
                    }}
                    disabled={cancelMutation.isPending}
                    className="self-end sm:self-center text-xs text-red-600 hover:text-red-800 font-medium px-3 py-1.5 border border-red-200 hover:border-red-400 rounded-sm transition-colors cursor-pointer"
                  >
                    Hủy phòng
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
