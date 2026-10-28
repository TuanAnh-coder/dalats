"use client";

import React from "react";
import Image from "next/image";
import { Calendar, AlertCircle, Loader2 } from "lucide-react";
import { api } from "~/trpc/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";

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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " ₫";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-[#0070d1] text-white rounded-full text-[10px] font-bold">Đã xác nhận</Badge>;
      case "checked_in":
        return <Badge className="bg-emerald-600 text-white rounded-full text-[10px] font-bold">Đang lưu trú</Badge>;
      case "completed":
        return <Badge className="bg-neutral-800 text-neutral-400 rounded-full text-[10px] font-bold border border-white/15">Hoàn thành</Badge>;
      case "cancelled":
        return <Badge variant="destructive" className="rounded-full text-[10px] font-bold">Đã hủy</Badge>;
      case "pending":
      default:
        return <Badge className="bg-amber-950/80 text-amber-300 border border-amber-800 rounded-full text-[10px] font-bold">Đang chờ duyệt</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl bg-[#121314] text-white border border-white/20 p-6 sm:p-8 max-h-[90vh] overflow-y-auto custom-scrollbar rounded-[8px] sm:rounded-[12px] shadow-2xl">
        <DialogHeader className="text-center sm:text-center pb-4 border-b border-white/10">
          <span className="text-[12px] uppercase tracking-[1.5px] text-[#53b1ff] font-bold block mb-1">
            Privé Member • Tài Khoản Hội Viên
          </span>
          <DialogTitle className="text-2xl sm:text-3xl text-white font-light tracking-tight">
            Lịch sử đơn đặt phòng
          </DialogTitle>
          <DialogDescription className="text-xs text-neutral-400">
            Xem chi tiết các chuyến nghỉ dưỡng đã đặt tại M_Dalats Boutique Villa
          </DialogDescription>
        </DialogHeader>

        {/* Content */}
        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center text-neutral-400 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#0070d1]" />
            <p className="text-xs">Đang tải danh sách đặt phòng...</p>
          </div>
        ) : !userBookings || userBookings.length === 0 ? (
          <div className="py-12 text-center text-neutral-400">
            <Calendar className="w-12 h-12 text-neutral-700 mx-auto mb-3" />
            <p className="text-sm font-bold text-white">Quý khách chưa có đơn đặt phòng nào</p>
            <p className="text-xs text-neutral-400 mt-1 font-normal">
              Hãy chọn phòng ưng ý tại M_Dalats Villa để bắt đầu chuyến nghỉ dưỡng tại Đà Lạt!
            </p>
          </div>
        ) : (
          <div className="space-y-3 pt-2">
            {userBookings.map((b) => (
              <div
                key={b.id}
                className="bg-[#181818] border border-white/10 rounded-[8px] p-4 sm:p-5 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center hover:border-white/20 transition-colors"
              >
                <div className="flex gap-4 items-center">
                  <div className="relative w-20 h-20 rounded-[4px] overflow-hidden shrink-0 bg-neutral-900 border border-white/10">
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
                      <span className="font-mono text-xs font-bold text-white tracking-wider">
                        {b.bookingCode}
                      </span>
                      {getStatusBadge(b.status)}
                    </div>

                    <h4 className="text-base sm:text-lg text-white font-medium mt-1">
                      {b.room?.name || "Phòng M_Dalats"}
                    </h4>

                    <p className="text-xs text-neutral-400 mt-0.5">
                      {b.checkIn} → {b.checkOut} ({b.totalNights} đêm) • {b.adults} người lớn
                    </p>

                    <p className="text-xs font-bold text-white mt-1">
                      Tổng tiền: <span className="text-[#53b1ff]">{formatPrice(b.totalPrice)}</span>
                    </p>
                  </div>
                </div>

                {b.status !== "cancelled" && b.status !== "completed" && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (confirm("Quý khách có chắc chắn muốn hủy đơn đặt phòng này?")) {
                        cancelMutation.mutate({ id: b.id });
                      }
                    }}
                    disabled={cancelMutation.isPending}
                    className="self-end sm:self-center text-xs text-red-400 hover:text-white hover:bg-red-600 border-red-500/30 rounded-full font-bold h-10 px-5"
                  >
                    Hủy phòng
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
