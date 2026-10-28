"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { FormattedPriceInput, parsePrice } from "~/components/admin/FormattedPriceInput";
import { ImageUploadInput } from "~/components/admin/ImageUploadInput";
import type { Room } from "~/server/db/schema";

interface EditRoomDialogProps {
  room: Room | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    id: number;
    name: string;
    roomNumber: string;
    area: number;
    maxAdults: number;
    maxChildren: number;
    bedType: string;
    viewType: string;
    pricePerNight: number;
    originalPrice?: number;
    image: string;
    gallery?: string[];
    isAvailable: boolean;
    shortDescription?: string;
    description?: string;
  }) => void;
  isPending: boolean;
}

export function EditRoomDialog({
  room,
  open,
  onOpenChange,
  onSubmit,
  isPending,
}: EditRoomDialogProps) {
  if (!room) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    const galleryRaw = fd.get("gallery") as string;
    let gallery: string[] | undefined = undefined;
    try {
      if (galleryRaw) gallery = JSON.parse(galleryRaw);
    } catch {}

    onSubmit({
      id: room.id,
      name: (fd.get("name") as string) || room.name,
      roomNumber: (fd.get("roomNumber") as string) || room.roomNumber,
      area: Number(fd.get("area")) || room.area,
      maxAdults: Number(fd.get("maxAdults")) || room.maxAdults,
      maxChildren: Number(fd.get("maxChildren")) || room.maxChildren,
      bedType: (fd.get("bedType") as string) || room.bedType,
      viewType: (fd.get("viewType") as string) || room.viewType,
      pricePerNight: parsePrice(fd.get("pricePerNight")) || room.pricePerNight,
      originalPrice: parsePrice(fd.get("originalPrice")) || undefined,
      image: (fd.get("image") as string) || room.image,
      gallery,
      isAvailable: fd.get("isAvailable") === "on",
      shortDescription: (fd.get("shortDescription") as string)?.trim() || undefined,
      description: (fd.get("description") as string)?.trim() || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar p-6 bg-white border-stone-200 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-stone-900 font-sans">
            Chỉnh sửa phòng: {room.name}
          </DialogTitle>
          <DialogDescription className="text-xs text-stone-500">
            Cập nhật giá bán mỗi đêm, tình trạng đón khách và hình ảnh minh họa cho phòng #{room.roomNumber}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs mt-2">
          {/* Row 1: Name and Room Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-semibold text-stone-700 mb-1 block">Tên phòng *</Label>
              <input
                name="name"
                required
                defaultValue={room.name}
                className="w-full bg-stone-50 border border-stone-200 focus:bg-white focus:border-stone-900 px-3 py-2 rounded-md outline-none transition-all"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-stone-700 mb-1 block">Số phòng (Mã số) *</Label>
              <input
                name="roomNumber"
                required
                defaultValue={room.roomNumber}
                className="w-full bg-stone-50 border border-stone-200 focus:bg-white focus:border-stone-900 px-3 py-2 rounded-md outline-none transition-all"
              />
            </div>
          </div>

          {/* Row 2: Area, Max Adults, Max Children */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <Label className="text-xs font-semibold text-stone-700 mb-1 block">Diện tích (m²) *</Label>
              <input
                type="number"
                name="area"
                required
                defaultValue={room.area}
                className="w-full bg-stone-50 border border-stone-200 focus:bg-white focus:border-stone-900 px-3 py-2 rounded-md outline-none transition-all"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-stone-700 mb-1 block">Người lớn tối đa *</Label>
              <input
                type="number"
                name="maxAdults"
                required
                defaultValue={room.maxAdults}
                className="w-full bg-stone-50 border border-stone-200 focus:bg-white focus:border-stone-900 px-3 py-2 rounded-md outline-none transition-all"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-stone-700 mb-1 block">Trẻ em tối đa</Label>
              <input
                type="number"
                name="maxChildren"
                defaultValue={room.maxChildren}
                className="w-full bg-stone-50 border border-stone-200 focus:bg-white focus:border-stone-900 px-3 py-2 rounded-md outline-none transition-all"
              />
            </div>
          </div>

          {/* Row 3: Bed and View */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-semibold text-stone-700 mb-1 block">Loại giường *</Label>
              <input
                name="bedType"
                required
                defaultValue={room.bedType}
                className="w-full bg-stone-50 border border-stone-200 focus:bg-white focus:border-stone-900 px-3 py-2 rounded-md outline-none transition-all"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-stone-700 mb-1 block">Loại View *</Label>
              <input
                name="viewType"
                required
                defaultValue={room.viewType}
                className="w-full bg-stone-50 border border-stone-200 focus:bg-white focus:border-stone-900 px-3 py-2 rounded-md outline-none transition-all"
              />
            </div>
          </div>

          {/* Row 4: Prices with commas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-semibold text-stone-700 mb-1 block">Giá bán mỗi đêm (VNĐ) *</Label>
              <FormattedPriceInput
                name="pricePerNight"
                required
                defaultValue={room.pricePerNight}
                placeholder="1,200,000"
                className="w-full bg-stone-50 border border-stone-200 focus:bg-white focus:border-stone-900 px-3 py-2 rounded-md font-semibold text-stone-900 outline-none"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-stone-700 mb-1 block">Giá gốc niêm yết (VNĐ)</Label>
              <FormattedPriceInput
                name="originalPrice"
                defaultValue={room.originalPrice ?? undefined}
                placeholder="1,500,000"
                className="w-full bg-stone-50 border border-stone-200 focus:bg-white focus:border-stone-900 px-3 py-2 rounded-md text-stone-500 outline-none"
              />
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="flex items-center gap-2.5 p-3 rounded-md bg-stone-50 border border-stone-200">
            <input
              type="checkbox"
              id="isAvailableEdit"
              name="isAvailable"
              defaultChecked={room.isAvailable}
              className="w-4 h-4 rounded text-stone-900 focus:ring-stone-900"
            />
            <Label htmlFor="isAvailableEdit" className="text-xs font-semibold text-stone-800 cursor-pointer">
              Mở bán đón khách (Check để cho phép khách đặt phòng trực tuyến)
            </Label>
          </div>

          {/* Image & Gallery Upload */}
          <div className="pt-1">
            <ImageUploadInput
              name="image"
              galleryName="gallery"
              required
              defaultValue={room.image}
              defaultGallery={room.gallery ? (Array.isArray(room.gallery) ? room.gallery : JSON.parse(String(room.gallery))) : [room.image]}
              folder="rooms"
            />
          </div>

          {/* Short Description */}
          <div>
            <Label className="text-xs font-semibold text-stone-700 mb-1 block">Mô tả ngắn gọn</Label>
            <textarea
              name="shortDescription"
              rows={2}
              defaultValue={room.shortDescription ?? ""}
              className="w-full bg-stone-50 border border-stone-200 focus:bg-white focus:border-stone-900 px-3 py-2 rounded-md outline-none transition-all"
            />
          </div>

          {/* Full Description */}
          <div>
            <Label className="text-xs font-semibold text-stone-700 mb-1 block">Mô tả chi tiết phòng</Label>
            <textarea
              name="description"
              rows={3}
              defaultValue={room.description ?? ""}
              className="w-full bg-stone-50 border border-stone-200 focus:bg-white focus:border-stone-900 px-3 py-2 rounded-md outline-none transition-all"
            />
          </div>

          <DialogFooter className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-stone-200 text-stone-600"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-stone-900 hover:bg-stone-800 text-white font-medium shadow-none"
            >
              {isPending ? "Đang cập nhật..." : "Lưu thay đổi"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
