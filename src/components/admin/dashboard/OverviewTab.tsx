"use client";

import React from "react";
import {
  DollarSign,
  Clock,
  BedDouble,
  Users,
  CalendarCheck,
  Plus,
  MessageSquare,
  ChevronRight,
  ArrowUpRight,
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
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import type {
  AdminBooking,
  AdminCustomer,
  AdminTab,
  RoomOccupancyOverview,
} from "./types";
import type { Room } from "~/server/db/schema";

interface OverviewTabProps {
  bookings: AdminBooking[];
  rooms: Room[];
  customers: AdminCustomer[];
  occupancyOverview?: RoomOccupancyOverview;
  setActiveTab: (tab: AdminTab) => void;
  onOpenAddRoom: () => void;
  onUpdateBookingStatus: (bookingId: number, status: string) => void;
  formatPrice: (price: number) => string;
}

export function OverviewTab({
  bookings,
  rooms,
  customers,
  occupancyOverview,
  setActiveTab,
  onOpenAddRoom,
  onUpdateBookingStatus,
  formatPrice,
}: OverviewTabProps) {
  // KPI Calculations
  const totalRevenue = bookings
    .filter((b) => b.status === "confirmed" || b.status === "completed")
    .reduce((sum, b) => sum + b.totalPrice, 0);

  const pendingBookings = bookings.filter((b) => b.status === "pending");
  const pendingCount = pendingBookings.length;
  const availableRoomsCount = rooms.filter((r) => r.isAvailable).length;

  // 8 most recent bookings
  const recentBookings = [...bookings].slice(0, 8);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge variant="outline" className="border-emerald-600/40 text-emerald-700 bg-emerald-50/50">Đã xác nhận</Badge>;
      case "checked_in":
        return <Badge variant="secondary">Đang lưu trú</Badge>;
      case "completed":
        return <Badge variant="secondary">Hoàn thành</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Đã hủy</Badge>;
      case "pending":
      default:
        return <Badge variant="outline" className="border-amber-600/40 text-amber-700 bg-amber-50/50">Chờ duyệt</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-stone-900">
            Tổng quan
          </h2>
          <p className="text-sm text-stone-500">
            Báo cáo hiệu suất kinh doanh và các đơn đặt phòng tại M_Dalats Villa.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={onOpenAddRoom}
            className="bg-stone-900 hover:bg-stone-800 text-white gap-1.5 shadow-none"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm phòng mới</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveTab("bookings")}
            className="text-stone-700 border-stone-200"
          >
            <span>Xem tất cả đơn</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid (Standard shadcn metric cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Revenue */}
        <Card className="border-stone-200 bg-white shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-5">
            <span className="text-sm font-medium text-stone-500">Tổng doanh thu</span>
            <DollarSign className="w-4 h-4 text-stone-400" />
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <div className="text-2xl font-bold text-stone-900 tracking-tight">
              {formatPrice(totalRevenue)}
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Đơn xác nhận & hoàn tất
            </p>
          </CardContent>
        </Card>

        {/* Metric 2: Pending Bookings */}
        <Card className="border-stone-200 bg-white shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-5">
            <span className="text-sm font-medium text-stone-500">Đơn chờ xử lý</span>
            <Clock className="w-4 h-4 text-stone-400" />
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <div className="text-2xl font-bold text-stone-900 tracking-tight">
              {pendingCount}
            </div>
            <p className="text-xs text-stone-500 mt-1">
              {pendingCount > 0 ? "Cần lễ tân xác nhận" : "Không có đơn chờ duyệt"}
            </p>
          </CardContent>
        </Card>

        {/* Metric 3: Available Rooms */}
        <Card className="border-stone-200 bg-white shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-5">
            <span className="text-sm font-medium text-stone-500">Phòng mở bán</span>
            <BedDouble className="w-4 h-4 text-stone-400" />
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <div className="text-2xl font-bold text-stone-900 tracking-tight">
              {availableRoomsCount} / {rooms.length}
            </div>
            <p className="text-xs text-stone-500 mt-1">
              {rooms.length - availableRoomsCount} phòng đang tạm dừng
            </p>
          </CardContent>
        </Card>

        {/* Metric 4: Customers */}
        <Card className="border-stone-200 bg-white shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-5">
            <span className="text-sm font-medium text-stone-500">Khách hàng CRM</span>
            <Users className="w-4 h-4 text-stone-400" />
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <div className="text-2xl font-bold text-stone-900 tracking-tight">
              {customers.length}
            </div>
            <p className="text-xs text-stone-500 mt-1">
              {customers.filter((c) => c.vipTier === "diamond" || c.vipTier === "gold").length} hội viên thân thiết
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Room Occupancy Overview (Clean minimal cards) */}
      {occupancyOverview && (
        <Card className="border-stone-200 bg-white shadow-none">
          <CardHeader className="p-5 pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <CardTitle className="text-base font-semibold text-stone-900">
                  Thực trạng phòng ({occupancyOverview.today})
                </CardTitle>
                <CardDescription className="text-xs text-stone-500">
                  Trạng thái theo thời gian thực tế của các phòng hôm nay
                </CardDescription>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-2 py-0.5 rounded border border-stone-200 bg-stone-50 text-stone-700">
                  Trống: {occupancyOverview.availableCount}
                </span>
                <span className="px-2 py-0.5 rounded border border-stone-200 bg-stone-50 text-stone-700">
                  Đang ở: {occupancyOverview.occupiedCount}
                </span>
                <span className="px-2 py-0.5 rounded border border-stone-200 bg-stone-50 text-stone-700">
                  Đến hôm nay: {occupancyOverview.arrivingTodayCount}
                </span>
                <span className="px-2 py-0.5 rounded border border-stone-200 bg-stone-50 text-stone-700">
                  Bảo trì: {occupancyOverview.maintenanceCount}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 mt-2">
              {occupancyOverview.rooms.map((item) => {
                const room = item.room;
                const status = item.occupancy.status;
                let statusLabel = "Trống";

                if (status === "occupied") {
                  statusLabel = "Đang ở";
                } else if (status === "arriving_today") {
                  statusLabel = "Đến hôm nay";
                } else if (status === "maintenance") {
                  statusLabel = "Tạm dừng";
                }

                return (
                  <div
                    key={room.id}
                    className="p-2.5 rounded-md border border-stone-200 bg-white text-xs hover:border-stone-300 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-stone-900">
                        P.{room.roomNumber}
                      </span>
                      <span className="text-[10px] text-stone-500 border border-stone-200 rounded px-1">
                        {statusLabel}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-600 truncate font-medium">
                      {room.name}
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Two-Column Section: Recent Bookings & Quick Operations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Recent Bookings Table (2 cols) */}
        <Card className="lg:col-span-2 border-stone-200 bg-white shadow-none">
          <CardHeader className="flex flex-row items-center justify-between p-5 pb-3">
            <div>
              <CardTitle className="text-base font-semibold text-stone-900">
                Đơn đặt phòng gần nhất
              </CardTitle>
              <CardDescription className="text-xs text-stone-500">
                Danh sách các đơn đặt phòng mới nhận được từ hệ thống
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveTab("bookings")}
              className="text-xs text-stone-600 hover:text-stone-900 gap-1"
            >
              <span>Xem tất cả</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-stone-200">
                    <TableHead className="w-[100px] text-xs font-medium text-stone-500">Mã đơn</TableHead>
                    <TableHead className="text-xs font-medium text-stone-500">Khách hàng</TableHead>
                    <TableHead className="text-xs font-medium text-stone-500">Phòng</TableHead>
                    <TableHead className="text-xs font-medium text-stone-500">Lưu trú</TableHead>
                    <TableHead className="text-xs font-medium text-stone-500">Tổng tiền</TableHead>
                    <TableHead className="text-xs font-medium text-stone-500">Trạng thái</TableHead>
                    <TableHead className="text-right text-xs font-medium text-stone-500">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentBookings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-stone-400 text-xs">
                        Chưa có đơn đặt phòng nào
                      </TableCell>
                    </TableRow>
                  ) : (
                    recentBookings.map((b) => (
                      <TableRow key={b.id} className="text-xs border-stone-100 hover:bg-stone-50/70">
                        <TableCell className="font-medium text-stone-900">
                          {b.bookingCode}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-stone-900 truncate max-w-[120px]">
                            {b.customerName}
                          </div>
                          <div className="text-[11px] text-stone-500 truncate max-w-[120px]">
                            {b.customerPhone}
                          </div>
                        </TableCell>
                        <TableCell className="text-stone-600 truncate max-w-[110px]">
                          {b.room?.name || `#${b.roomId}`}
                        </TableCell>
                        <TableCell className="text-stone-600 whitespace-nowrap">
                          {b.checkIn} → {b.checkOut}
                        </TableCell>
                        <TableCell className="font-semibold text-stone-900 whitespace-nowrap">
                          {formatPrice(b.totalPrice)}
                        </TableCell>
                        <TableCell>{getStatusBadge(b.status)}</TableCell>
                        <TableCell className="text-right">
                          {b.status === "pending" ? (
                            <Button
                              size="sm"
                              onClick={() => onUpdateBookingStatus(b.id, "confirmed")}
                              className="h-7 px-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs"
                            >
                              Duyệt
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setActiveTab("bookings")}
                              className="h-7 px-2 text-stone-600 text-xs"
                            >
                              Chi tiết
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Right: Quick Operational Shortcuts (1 col) */}
        <div className="space-y-4">
          <Card className="border-stone-200 bg-white shadow-none">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-base font-semibold text-stone-900">
                Thao tác nhanh
              </CardTitle>
              <CardDescription className="text-xs text-stone-500">
                Các chức năng quản trị chính
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-0 space-y-2">
              <button
                type="button"
                onClick={onOpenAddRoom}
                className="w-full flex items-center justify-between p-3 rounded-md bg-stone-50 hover:bg-stone-100 border border-stone-200 transition-colors text-left text-xs cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <Plus className="w-4 h-4 text-stone-600" />
                  <div>
                    <span className="font-medium text-stone-900 block">
                      Thêm phòng mới
                    </span>
                    <span className="text-[11px] text-stone-500">
                      Tạo phòng và thiết lập giá
                    </span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover:text-stone-900" />
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("bookings")}
                className="w-full flex items-center justify-between p-3 rounded-md bg-stone-50 hover:bg-stone-100 border border-stone-200 transition-colors text-left text-xs cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <CalendarCheck className="w-4 h-4 text-stone-600" />
                  <div>
                    <span className="font-medium text-stone-900 block">
                      Quản lý đơn đặt phòng
                    </span>
                    <span className="text-[11px] text-stone-500">
                      {pendingCount} đơn chờ duyệt
                    </span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover:text-stone-900" />
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("customers")}
                className="w-full flex items-center justify-between p-3 rounded-md bg-stone-50 hover:bg-stone-100 border border-stone-200 transition-colors text-left text-xs cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-stone-600" />
                  <div>
                    <span className="font-medium text-stone-900 block">
                      Khách hàng & CRM
                    </span>
                    <span className="text-[11px] text-stone-500">
                      Hạng thành viên và lịch sử
                    </span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover:text-stone-900" />
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("messages")}
                className="w-full flex items-center justify-between p-3 rounded-md bg-stone-50 hover:bg-stone-100 border border-stone-200 transition-colors text-left text-xs cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-4 h-4 text-stone-600" />
                  <div>
                    <span className="font-medium text-stone-900 block">
                      Hộp thư liên hệ
                    </span>
                    <span className="text-[11px] text-stone-500">
                      Phản hồi thắc mắc từ khách
                    </span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover:text-stone-900" />
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
