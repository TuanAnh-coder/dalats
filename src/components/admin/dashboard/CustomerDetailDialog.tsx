"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import type { AdminCustomer, AdminBooking } from "./types";

interface CustomerDetailDialogProps {
  customer: AdminCustomer | null;
  bookings: AdminBooking[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formatPrice: (price: number) => string;
}

export function CustomerDetailDialog({
  customer,
  bookings,
  open,
  onOpenChange,
  formatPrice,
}: CustomerDetailDialogProps) {
  if (!customer) return null;

  const customerBookings = bookings.filter((b) =>
    customer.bookingCodes.includes(b.bookingCode)
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge variant="outline" className="border-emerald-600/30 text-emerald-700 bg-emerald-50/40">Đã xác nhận</Badge>;
      case "checked_in":
        return <Badge variant="secondary">Đang lưu trú</Badge>;
      case "completed":
        return <Badge variant="secondary">Hoàn thành</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Đã hủy</Badge>;
      case "pending":
      default:
        return <Badge variant="outline" className="border-amber-600/30 text-amber-700 bg-amber-50/40">Chờ duyệt</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto custom-scrollbar p-6 bg-white border-stone-200 shadow-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-medium tracking-wider text-stone-500">
              Hồ sơ khách hàng • CRM
            </span>
          </div>
          <DialogTitle className="text-xl font-bold text-stone-900 font-sans">
            {customer.name}
          </DialogTitle>
          <DialogDescription className="text-xs text-stone-500">
            Thông tin hội viên, tổng doanh thu trọn đời và danh sách các đơn đặt phòng đã thực hiện.
          </DialogDescription>
        </DialogHeader>

        {/* Customer Information Grid */}
        <div className="grid grid-cols-2 gap-3 bg-stone-50 p-4 rounded-md border border-stone-200 text-xs mt-2">
          <div>
            <span className="text-stone-500 block text-[11px]">Hạng hội viên:</span>
            <span className="font-semibold text-stone-900 uppercase tracking-wider text-[11px] block mt-0.5">
              {customer.vipTier}
            </span>
          </div>
          <div>
            <span className="text-stone-500 block text-[11px]">Phân quyền Role:</span>
            <span className="font-semibold text-stone-900 uppercase text-[11px] block mt-0.5">
              {customer.role}
            </span>
          </div>
          <div>
            <span className="text-stone-500 block text-[11px]">Email liên hệ:</span>
            <span className="font-semibold text-stone-900 break-all block mt-0.5">
              {customer.email}
            </span>
          </div>
          <div>
            <span className="text-stone-500 block text-[11px]">Số điện thoại:</span>
            <span className="font-semibold text-stone-900 block mt-0.5">
              {customer.phone || "Chưa cung cấp"}
            </span>
          </div>
          <div>
            <span className="text-stone-500 block text-[11px]">Tổng số đơn đã đặt:</span>
            <span className="font-semibold text-stone-900 text-sm block mt-0.5">
              {customer.totalBookings} đơn
            </span>
          </div>
          <div>
            <span className="text-stone-500 block text-[11px]">Tổng chi tiêu tích lũy:</span>
            <span className="font-semibold text-stone-900 text-sm block mt-0.5">
              {formatPrice(customer.totalSpent)}
            </span>
          </div>
        </div>

        {/* Bookings History */}
        <div className="space-y-2 mt-2">
          <h4 className="text-xs font-semibold text-stone-900 uppercase tracking-wider">
            Lịch sử đơn đặt phòng ({customerBookings.length} đơn)
          </h4>

          <div className="space-y-2 max-h-56 overflow-y-auto custom-scrollbar pr-1">
            {customerBookings.length === 0 ? (
              <div className="text-center py-6 text-stone-400 text-xs bg-stone-50 rounded-md border border-stone-200">
                Chưa có đơn đặt phòng nào liên kết với hồ sơ này.
              </div>
            ) : (
              customerBookings.map((b) => (
                <div
                  key={b.id}
                  className="p-3 bg-white border border-stone-200 rounded-md text-xs flex items-center justify-between shadow-none hover:border-stone-300 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-medium text-stone-900">{b.bookingCode}</span>
                      {getStatusBadge(b.status)}
                    </div>
                    <p className="text-stone-600 text-[11px]">
                      {b.room?.name || `Phòng #${b.roomId}`} • {b.checkIn} → {b.checkOut}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-stone-900 block">
                      {formatPrice(b.totalPrice)}
                    </span>
                    <span className="text-[10px] text-stone-400">
                      {b.adults} lớn{b.children > 0 ? `, ${b.children} trẻ` : ""}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <DialogFooter className="pt-3 border-t border-stone-100 flex justify-end">
          <Button
            type="button"
            onClick={() => onOpenChange(false)}
            className="bg-stone-900 hover:bg-stone-800 text-white px-5 text-xs font-medium shadow-none"
          >
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
