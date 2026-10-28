"use client";

import React, { useState } from "react";
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  DoorOpen,
  CalendarClock,
  MoreVertical,
  Trash2,
  Phone,
  Mail,
  User,
  BedDouble,
  Calendar,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import type { AdminBooking } from "./types";

interface BookingsTabProps {
  bookings: AdminBooking[];
  onUpdateStatus: (bookingId: number, status: string) => void;
  onDeleteBooking: (bookingId: number) => void;
  formatPrice: (price: number) => string;
}

export function BookingsTab({
  bookings,
  onUpdateStatus,
  onDeleteBooking,
  formatPrice,
}: BookingsTabProps) {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filteredBookings = bookings.filter((b) => {
    const matchesStatus =
      statusFilter === "all" || b.status.toLowerCase() === statusFilter.toLowerCase();
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      b.bookingCode.toLowerCase().includes(q) ||
      b.customerName.toLowerCase().includes(q) ||
      b.customerPhone.includes(q) ||
      b.customerEmail.toLowerCase().includes(q) ||
      (b.room?.name && b.room.name.toLowerCase().includes(q));
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge variant="outline" className="border-emerald-600/40 text-emerald-700 bg-emerald-50/50">Đã duyệt</Badge>;
      case "checked_in":
        return <Badge variant="secondary">Đang lưu trú</Badge>;
      case "completed":
        return <Badge variant="secondary">Hoàn tất</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Đã hủy</Badge>;
      case "pending":
      default:
        return <Badge variant="outline" className="border-amber-600/40 text-amber-700 bg-amber-50/50">Chờ duyệt</Badge>;
    }
  };

  const calculateNights = (checkIn: string, checkOut: string) => {
    try {
      const d1 = new Date(checkIn);
      const d2 = new Date(checkOut);
      const diffTime = d2.getTime() - d1.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 1;
    } catch {
      return 1;
    }
  };

  return (
    <div className="space-y-5">
      {/* Header and Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-stone-900 font-sans">
            Quản lý đơn đặt phòng
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Tổng cộng {bookings.length} đơn đặt phòng • Tìm kiếm, xác nhận, check-in và quản lý trạng thái
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="border-stone-200 bg-white shadow-none">
        <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Status Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 custom-scrollbar">
            {[
              { id: "all", label: "Tất cả", count: bookings.length },
              {
                id: "pending",
                label: "Chờ duyệt",
                count: bookings.filter((b) => b.status === "pending").length,
              },
              {
                id: "confirmed",
                label: "Đã duyệt",
                count: bookings.filter((b) => b.status === "confirmed").length,
              },
              {
                id: "checked_in",
                label: "Đang ở",
                count: bookings.filter((b) => b.status === "checked_in").length,
              },
              {
                id: "completed",
                label: "Hoàn tất",
                count: bookings.filter((b) => b.status === "completed").length,
              },
              {
                id: "cancelled",
                label: "Đã hủy",
                count: bookings.filter((b) => b.status === "cancelled").length,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  statusFilter === tab.id
                    ? "bg-stone-900 text-white"
                    : "text-stone-600 hover:bg-stone-100"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    statusFilter === tab.id
                      ? "bg-white/20 text-white"
                      : "bg-stone-100 text-stone-500"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm mã đơn, tên, SĐT khách..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 focus:bg-white focus:border-stone-900 rounded-md outline-none transition-all"
            />
          </div>
        </CardContent>
      </Card>

      {/* Desktop Data Table */}
      <Card className="hidden md:block border-stone-200 bg-white shadow-none">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-stone-200">
                  <TableHead className="w-[110px] text-xs font-medium text-stone-500">Mã đơn</TableHead>
                  <TableHead className="text-xs font-medium text-stone-500">Khách hàng</TableHead>
                  <TableHead className="text-xs font-medium text-stone-500">Phòng nghỉ</TableHead>
                  <TableHead className="text-xs font-medium text-stone-500">Lịch lưu trú</TableHead>
                  <TableHead className="text-xs font-medium text-stone-500">Khách</TableHead>
                  <TableHead className="text-xs font-medium text-stone-500">Tổng tiền</TableHead>
                  <TableHead className="text-xs font-medium text-stone-500">Trạng thái</TableHead>
                  <TableHead className="text-right text-xs font-medium text-stone-500">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12 text-stone-400 text-xs">
                      Không tìm thấy đơn đặt phòng nào phù hợp
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBookings.map((b) => {
                    const nights = calculateNights(b.checkIn, b.checkOut);
                    return (
                      <TableRow key={b.id} className="text-xs border-stone-100 hover:bg-stone-50/70 transition-colors">
                        {/* Booking Code */}
                        <TableCell className="font-mono font-medium text-stone-900">
                          {b.bookingCode}
                        </TableCell>

                        {/* Customer */}
                        <TableCell>
                          <div className="font-semibold text-stone-900">{b.customerName}</div>
                          <div className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3 text-stone-400" />
                            <span>{b.customerPhone}</span>
                          </div>
                          <div className="text-[10px] text-stone-400 truncate max-w-[150px]">
                            {b.customerEmail}
                          </div>
                        </TableCell>

                        {/* Room */}
                        <TableCell>
                          <div className="font-medium text-stone-900">
                            {b.room?.name || `Phòng #${b.roomId}`}
                          </div>
                          {b.room?.roomNumber && (
                            <div className="text-[11px] text-stone-500 font-mono">
                              Số phòng: P.{b.room.roomNumber}
                            </div>
                          )}
                        </TableCell>

                        {/* Dates */}
                        <TableCell>
                          <div className="text-stone-800 font-medium">
                            {b.checkIn} → {b.checkOut}
                          </div>
                          <div className="text-[11px] text-stone-500">
                            {nights} đêm
                          </div>
                        </TableCell>

                        {/* Guests */}
                        <TableCell>
                          <span className="text-stone-700">
                            {b.adults} lớn{b.children > 0 ? `, ${b.children} trẻ` : ""}
                          </span>
                        </TableCell>

                        {/* Price */}
                        <TableCell className="font-bold text-stone-900 whitespace-nowrap">
                          {formatPrice(b.totalPrice)}
                        </TableCell>

                        {/* Status */}
                        <TableCell>{getStatusBadge(b.status)}</TableCell>

                        {/* Action Menu */}
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-stone-500 hover:text-stone-900"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 bg-white border-stone-200">
                              <DropdownMenuLabel className="text-[11px] text-stone-500">
                                Cập nhật trạng thái
                              </DropdownMenuLabel>
                              {b.status !== "confirmed" && (
                                <DropdownMenuItem
                                  onClick={() => onUpdateStatus(b.id, "confirmed")}
                                  className="text-xs text-stone-700 hover:bg-stone-50 cursor-pointer flex items-center gap-2"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5 text-stone-500" />
                                  <span>Xác nhận duyệt đơn</span>
                                </DropdownMenuItem>
                              )}
                              {b.status !== "checked_in" && (
                                <DropdownMenuItem
                                  onClick={() => onUpdateStatus(b.id, "checked_in")}
                                  className="text-xs text-stone-700 hover:bg-stone-50 cursor-pointer flex items-center gap-2"
                                >
                                  <DoorOpen className="w-3.5 h-3.5 text-stone-500" />
                                  <span>Khách đã nhận phòng</span>
                                </DropdownMenuItem>
                              )}
                              {b.status !== "completed" && (
                                <DropdownMenuItem
                                  onClick={() => onUpdateStatus(b.id, "completed")}
                                  className="text-xs text-stone-700 hover:bg-stone-50 cursor-pointer flex items-center gap-2"
                                >
                                  <CalendarClock className="w-3.5 h-3.5 text-stone-500" />
                                  <span>Hoàn tất trả phòng</span>
                                </DropdownMenuItem>
                              )}
                              {b.status !== "cancelled" && (
                                <DropdownMenuItem
                                  onClick={() => onUpdateStatus(b.id, "cancelled")}
                                  className="text-xs text-stone-700 hover:bg-stone-50 cursor-pointer flex items-center gap-2"
                                >
                                  <XCircle className="w-3.5 h-3.5 text-stone-500" />
                                  <span>Hủy đơn đặt phòng</span>
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator className="bg-stone-100" />
                              <DropdownMenuItem
                                onClick={() => {
                                  if (confirm(`Bạn chắc chắn muốn xóa đơn ${b.bookingCode}?`)) {
                                    onDeleteBooking(b.id);
                                  }
                                }}
                                className="text-xs text-rose-600 hover:bg-rose-50 cursor-pointer flex items-center gap-2"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Xóa vĩnh viễn</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Card List */}
      <div className="md:hidden space-y-3">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-8 text-stone-400 text-xs">
            Không tìm thấy đơn đặt phòng nào
          </div>
        ) : (
          filteredBookings.map((b) => (
            <Card key={b.id} className="border-stone-200 bg-white p-4 space-y-3 text-xs shadow-none">
              <div className="flex items-center justify-between">
                <span className="font-mono font-medium text-stone-900">{b.bookingCode}</span>
                {getStatusBadge(b.status)}
              </div>
              <div>
                <p className="font-semibold text-stone-900">{b.customerName}</p>
                <p className="text-stone-500 text-[11px]">{b.customerPhone} • {b.customerEmail}</p>
              </div>
              <div className="flex items-center justify-between text-stone-600 border-t border-b border-stone-100 py-2">
                <span>{b.room?.name || `Phòng #${b.roomId}`}</span>
                <span className="font-bold text-stone-900">{formatPrice(b.totalPrice)}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-stone-500">
                <span>{b.checkIn} → {b.checkOut}</span>
                <span>{b.adults} lớn, {b.children} trẻ</span>
              </div>
              <div className="flex justify-end gap-1.5 pt-1">
                {b.status === "pending" && (
                  <Button
                    size="sm"
                    onClick={() => onUpdateStatus(b.id, "confirmed")}
                    className="h-7 px-3 bg-stone-900 hover:bg-stone-800 text-white text-xs"
                  >
                    Duyệt đơn
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onUpdateStatus(b.id, "checked_in")}
                  className="h-7 px-2.5 text-xs text-stone-700 border-stone-200"
                >
                  Check-in
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
