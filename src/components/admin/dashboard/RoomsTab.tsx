"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  BedDouble,
  Users,
  Eye,
  Maximize2,
  AlertTriangle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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
import { FormattedPriceInput, parsePrice } from "~/components/admin/FormattedPriceInput";
import type { Room } from "~/server/db/schema";

interface RoomsTabProps {
  rooms: Room[];
  onOpenAddRoom: () => void;
  onEditRoom: (room: Room) => void;
  onToggleAvailability: (roomId: number, currentAvailable: boolean) => void;
  onDeleteRoom: (roomId: number, roomName: string) => void;
  onUpdatePrice: (roomId: number, newPrice: number) => void;
  formatPrice: (price: number) => string;
}

export function RoomsTab({
  rooms,
  onOpenAddRoom,
  onEditRoom,
  onToggleAvailability,
  onDeleteRoom,
  onUpdatePrice,
  formatPrice,
}: RoomsTabProps) {
  const [filterAvailability, setFilterAvailability] = useState<"all" | "available" | "maintenance">("all");
  const [search, setSearch] = useState("");
  const [editingPriceId, setEditingPriceId] = useState<number | null>(null);
  const [editingPriceValue, setEditingPriceValue] = useState<number>(0);

  const filteredRooms = rooms.filter((r) => {
    const matchesAvail =
      filterAvailability === "all" ||
      (filterAvailability === "available" && r.isAvailable) ||
      (filterAvailability === "maintenance" && !r.isAvailable);
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      r.name.toLowerCase().includes(q) ||
      r.roomNumber.toLowerCase().includes(q) ||
      (r.bedType && r.bedType.toLowerCase().includes(q)) ||
      (r.viewType && r.viewType.toLowerCase().includes(q));
    return matchesAvail && matchesSearch;
  });

  const handleStartPriceEdit = (room: Room) => {
    setEditingPriceId(room.id);
    setEditingPriceValue(room.pricePerNight);
  };

  const handleSavePriceEdit = (roomId: number) => {
    if (editingPriceValue > 0) {
      onUpdatePrice(roomId, editingPriceValue);
    }
    setEditingPriceId(null);
  };

  return (
    <div className="space-y-5">
      {/* Header and CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-stone-900 font-sans">
            Quản trị danh sách phòng
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Tổng cộng {rooms.length} phòng nghỉ • Thiết lập giá tiền, tình trạng đón khách và tiện nghi
          </p>
        </div>
        <Button
          size="sm"
          onClick={onOpenAddRoom}
          className="bg-stone-900 hover:bg-stone-800 text-white shadow-none gap-1.5 self-start sm:self-auto font-medium"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm phòng mới</span>
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="border-stone-200 bg-white shadow-none">
        <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <button
              type="button"
              onClick={() => setFilterAvailability("all")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                filterAvailability === "all"
                  ? "bg-stone-900 text-white shadow-none"
                  : "text-stone-600 hover:bg-stone-100"
              }`}
            >
              <span>Tất cả phòng</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                filterAvailability === "all" ? "bg-white/20 text-white" : "bg-stone-100 text-stone-500"
              }`}>
                {rooms.length}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setFilterAvailability("available")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                filterAvailability === "available"
                  ? "bg-stone-900 text-white shadow-none"
                  : "text-stone-600 hover:bg-stone-100"
              }`}
            >
              <span>Đang đón khách</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                filterAvailability === "available" ? "bg-white/20 text-white" : "bg-stone-100 text-stone-500"
              }`}>
                {rooms.filter((r) => r.isAvailable).length}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setFilterAvailability("maintenance")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                filterAvailability === "maintenance"
                  ? "bg-stone-900 text-white shadow-none"
                  : "text-stone-600 hover:bg-stone-100"
              }`}
            >
              <span>Tạm dừng / Bảo trì</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                filterAvailability === "maintenance" ? "bg-white/20 text-white" : "bg-stone-100 text-stone-500"
              }`}>
                {rooms.filter((r) => !r.isAvailable).length}
              </span>
            </button>
          </div>

          <div className="relative w-full md:w-72 shrink-0">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm tên phòng, số phòng, view..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 focus:bg-white focus:border-stone-900 rounded-md outline-none transition-all"
            />
          </div>
        </CardContent>
      </Card>

      {/* Desktop Rooms Table */}
      <Card className="hidden md:block border-stone-200 bg-white shadow-none">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-stone-50/60">
                  <TableHead className="w-[80px] text-xs">Ảnh</TableHead>
                  <TableHead className="text-xs">Tên phòng / Số phòng</TableHead>
                  <TableHead className="text-xs">Thông số</TableHead>
                  <TableHead className="text-xs">Giường & Tầm nhìn</TableHead>
                  <TableHead className="text-xs">Giá mỗi đêm (VNĐ)</TableHead>
                  <TableHead className="text-xs">Trạng thái</TableHead>
                  <TableHead className="text-right text-xs">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRooms.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-stone-400 text-xs">
                      Không tìm thấy phòng nào phù hợp
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRooms.map((room) => {
                    const isPriceEditing = editingPriceId === room.id;
                    return (
                      <TableRow key={room.id} className="text-xs hover:bg-stone-50/80 transition-colors">
                        {/* Thumbnail */}
                        <TableCell>
                          <div className="w-14 h-11 relative rounded-md overflow-hidden bg-stone-100 border border-stone-200">
                            {room.image ? (
                              <Image
                                src={room.image}
                                alt={room.name}
                                fill
                                className="object-cover"
                                sizes="56px"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-stone-400 text-[10px]">
                                No img
                              </div>
                            )}
                          </div>
                        </TableCell>

                        {/* Name & Room Number */}
                        <TableCell>
                          <div className="font-semibold text-stone-900">{room.name}</div>
                          <div className="text-[11px] font-mono text-stone-500">
                            Số phòng: P.{room.roomNumber}
                          </div>
                        </TableCell>

                        {/* Specs */}
                        <TableCell>
                          <div className="text-stone-700">
                            {room.area} m² • {room.maxAdults} lớn{room.maxChildren > 0 ? `, ${room.maxChildren} trẻ` : ""}
                          </div>
                        </TableCell>

                        {/* Bed & View */}
                        <TableCell>
                          <div className="text-stone-800 font-medium">{room.bedType || "Tiêu chuẩn"}</div>
                          <div className="text-[11px] text-stone-500 truncate max-w-[150px]">
                            {room.viewType || "View nội khu"}
                          </div>
                        </TableCell>

                        {/* Price with Inline Edit */}
                        <TableCell>
                          {isPriceEditing ? (
                            <div className="flex items-center gap-1.5">
                              <FormattedPriceInput
                                value={editingPriceValue}
                                onChange={(val) => setEditingPriceValue(val)}
                                className="w-28 px-2 py-1 text-xs border border-stone-400 rounded font-semibold text-stone-900 bg-white outline-none"
                              />
                              <Button
                                size="icon"
                                onClick={() => handleSavePriceEdit(room.id)}
                                className="h-7 w-7 bg-stone-900 hover:bg-stone-800 text-white"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setEditingPriceId(null)}
                                className="h-7 w-7 text-stone-500 hover:text-stone-800"
                              >
                                <X className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          ) : (
                            <div
                              onClick={() => handleStartPriceEdit(room)}
                              className="group flex items-center gap-1.5 cursor-pointer"
                              title="Nhấp để sửa giá nhanh"
                            >
                              <span className="font-semibold text-stone-900 text-sm">
                                {formatPrice(room.pricePerNight)}
                              </span>
                              <Edit className="w-3 h-3 text-stone-300 group-hover:text-stone-700 transition-colors" />
                            </div>
                          )}
                          {room.originalPrice && room.originalPrice > room.pricePerNight && (
                            <div className="text-[10px] text-stone-400 line-through">
                              {formatPrice(room.originalPrice)}
                            </div>
                          )}
                        </TableCell>

                        {/* Status Toggle */}
                        <TableCell>
                          <button
                            type="button"
                            onClick={() => onToggleAvailability(room.id, room.isAvailable)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-medium border transition-colors cursor-pointer ${
                              room.isAvailable
                                ? "bg-emerald-50/50 text-emerald-700 border-emerald-600/30 hover:bg-emerald-100/50"
                                : "bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200/50"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                room.isAvailable ? "bg-emerald-600" : "bg-stone-400"
                              }`}
                            />
                            <span>{room.isAvailable ? "Đang mở bán" : "Tạm dừng"}</span>
                          </button>
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onEditRoom(room)}
                              className="h-8 px-2 text-stone-600 hover:text-stone-900"
                            >
                              <Edit className="w-3.5 h-3.5 mr-1" />
                              <span>Sửa</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                if (confirm(`Bạn có chắc muốn xóa phòng "${room.name}" (P.${room.roomNumber})?`)) {
                                  onDeleteRoom(room.id, room.name);
                                }
                              }}
                              className="h-8 px-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                            >
                              <Trash2 className="w-3.5 h-3.5 mr-1" />
                              <span>Xóa</span>
                            </Button>
                          </div>
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

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {filteredRooms.length === 0 ? (
          <div className="text-center py-8 text-stone-400 text-xs">
            Không tìm thấy phòng nào
          </div>
        ) : (
          filteredRooms.map((room) => (
            <Card key={room.id} className="border-stone-200 bg-white p-4 space-y-3 text-xs shadow-none">
              <div className="flex gap-3">
                <div className="w-20 h-16 relative rounded-md overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                  {room.image ? (
                    <Image src={room.image} alt={room.name} fill className="object-cover" sizes="80px" />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-medium text-stone-600">P.{room.roomNumber}</span>
                    <Badge variant={room.isAvailable ? "outline" : "secondary"} className={`text-[9px] ${room.isAvailable ? "border-emerald-600/30 text-emerald-700" : ""}`}>
                      {room.isAvailable ? "Mở bán" : "Bảo trì"}
                    </Badge>
                  </div>
                  <h4 className="font-semibold text-stone-900 truncate mt-0.5">{room.name}</h4>
                  <p className="text-stone-500 text-[11px]">
                    {room.area}m² • {room.maxAdults} lớn, {room.maxChildren} trẻ
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-stone-100 pt-2">
                <span className="font-semibold text-stone-900 text-sm">
                  {formatPrice(room.pricePerNight)}
                </span>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditRoom(room)}
                    className="h-7 px-2.5 text-[11px] border-stone-200 text-stone-700"
                  >
                    Chỉnh sửa
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onToggleAvailability(room.id, room.isAvailable)}
                    className="h-7 px-2 text-[11px] border-stone-200 text-stone-700"
                  >
                    {room.isAvailable ? "Khóa" : "Mở"}
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
