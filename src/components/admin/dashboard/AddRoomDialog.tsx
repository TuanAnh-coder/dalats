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
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { FormattedPriceInput, parsePrice } from "~/components/admin/FormattedPriceInput";
import { ImageUploadInput } from "~/components/admin/ImageUploadInput";

interface AddRoomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
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
    shortDescription?: string;
    description?: string;
  }) => void;
  isPending: boolean;
}

export function AddRoomDialog({
  open,
  onOpenChange,
  onSubmit,
  isPending,
}: AddRoomDialogProps) {
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
      name: (fd.get("name") as string) || "M_Dalats Suite",
      roomNumber: (fd.get("roomNumber") as string) || "205",
      area: Number(fd.get("area")) || 25,
      maxAdults: Number(fd.get("maxAdults")) || 2,
      maxChildren: Number(fd.get("maxChildren")) || 0,
      bedType: (fd.get("bedType") as string) || "1 Giường Queen",
      viewType: (fd.get("viewType") as string) || "Sân vườn",
      pricePerNight: parsePrice(fd.get("pricePerNight")) || 1200000,
      originalPrice: parsePrice(fd.get("originalPrice")) || undefined,
      image: (fd.get("image") as string) || "/images/DH_01791-HDR-Edit-700x466.jpg",
      gallery,
      shortDescription: (fd.get("shortDescription") as string)?.trim() || undefined,
      description: (fd.get("description") as string)?.trim() || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar p-6 bg-white border-stone-200 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-stone-900 font-sans">
            Thêm phòng nghỉ mới vào M_Dalats Villa
          </DialogTitle>
          <DialogDescription className="text-xs text-stone-500">
            Điền các thông số kỹ thuật, giá phòng niêm yết và tải lên bộ ảnh thực tế.
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
                defaultValue="M_Dalats Suite"
                placeholder="VD: M_Dalats Suite"
                className="w-full bg-stone-50 border border-stone-200 focus:bg-white focus:border-stone-900 px-3 py-2 rounded-md outline-none transition-all"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-stone-700 mb-1 block">Số phòng (Mã số) *</Label>
              <input
                name="roomNumber"
                required
                defaultValue="205"
                placeholder="VD: 205"
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
                defaultValue={25}
                className="w-full bg-stone-50 border border-stone-200 focus:bg-white focus:border-stone-900 px-3 py-2 rounded-md outline-none transition-all"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-stone-700 mb-1 block">Người lớn tối đa *</Label>
              <input
                type="number"
                name="maxAdults"
                required
                defaultValue={2}
                className="w-full bg-stone-50 border border-stone-200 focus:bg-white focus:border-stone-900 px-3 py-2 rounded-md outline-none transition-all"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-stone-700 mb-1 block">Trẻ em tối đa</Label>
              <input
                type="number"
                name="maxChildren"
                defaultValue={2}
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
                defaultValue="1 Giường King Lớn"
                placeholder="VD: 1 Giường King Lớn"
                className="w-full bg-stone-50 border border-stone-200 focus:bg-white focus:border-stone-900 px-3 py-2 rounded-md outline-none transition-all"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-stone-700 mb-1 block">Loại View *</Label>
              <input
                name="viewType"
                required
                defaultValue="View rừng thông & thung lũng"
                placeholder="VD: View thung lũng"
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
                defaultValue={1200000}
                placeholder="1,200,000"
                className="w-full bg-stone-50 border border-stone-200 focus:bg-white focus:border-stone-900 px-3 py-2 rounded-md font-semibold text-stone-900 outline-none"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-stone-700 mb-1 block">Giá gốc niêm yết (VNĐ)</Label>
              <FormattedPriceInput
                name="originalPrice"
                defaultValue={1500000}
                placeholder="1,500,000"
                className="w-full bg-stone-50 border border-stone-200 focus:bg-white focus:border-stone-900 px-3 py-2 rounded-md text-stone-500 outline-none"
              />
            </div>
          </div>

          {/* Image & Gallery Upload */}
          <div className="pt-1">
            <ImageUploadInput
              name="image"
              galleryName="gallery"
              required
              defaultValue="/images/DH_01791-HDR-Edit-700x466.jpg"
              defaultGallery={["/images/DH_01791-HDR-Edit-700x466.jpg"]}
              folder="rooms"
            />
          </div>

          {/* Short Description */}
          <div>
            <Label className="text-xs font-semibold text-stone-700 mb-1 block">Mô tả ngắn gọn</Label>
            <textarea
              name="shortDescription"
              rows={2}
              defaultValue="Phòng nghỉ cao cấp với ban công view trọn cảnh đồi thông, nội thất gỗ mộc mạc."
              className="w-full bg-stone-50 border border-stone-200 focus:bg-white focus:border-stone-900 px-3 py-2 rounded-md outline-none transition-all"
            />
          </div>

          {/* Full Description */}
          <div>
            <Label className="text-xs font-semibold text-stone-700 mb-1 block">Mô tả chi tiết phòng</Label>
            <textarea
              name="description"
              rows={3}
              defaultValue="Trải nghiệm không gian nghỉ dưỡng thanh bình giữa rừng thông Đà Lạt. Phòng được trang bị đầy đủ tiện nghi tiêu chuẩn 5 sao, bồn tắm riêng biệt và ban công ngắm bình minh tuyệt đẹp."
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
              {isPending ? "Đang lưu..." : "Lưu phòng mới"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
