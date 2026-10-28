"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  Upload,
  ImageIcon,
  Loader2,
  Trash2,
  Star,
  ExternalLink,
  Plus,
  AlertCircle,
  Check,
} from "lucide-react";

interface ImageUploadInputProps {
  name?: string;
  galleryName?: string;
  defaultValue?: string;
  defaultGallery?: string[];
  label?: string;
  required?: boolean;
  folder?: string;
  onChange?: (coverUrl: string, galleryUrls: string[]) => void;
}

export function ImageUploadInput({
  name = "image",
  galleryName = "gallery",
  defaultValue = "",
  defaultGallery = [],
  label = "Hình ảnh phòng (Ảnh đại diện & Thư viện ảnh) *",
  required = true,
  folder = "rooms",
  onChange,
}: ImageUploadInputProps) {
  // Initialize images list: defaultGallery or [defaultValue]
  const initialImages: string[] = React.useMemo(() => {
    if (defaultGallery && defaultGallery.length > 0) {
      return Array.from(new Set(defaultGallery.filter(Boolean)));
    }
    if (defaultValue) {
      return [defaultValue];
    }
    return [];
  }, [defaultValue, defaultGallery]);

  const [images, setImages] = useState<string[]>(initialImages);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [manualUrlInput, setManualUrlInput] = useState<string>("");
  const [showManualInput, setShowManualInput] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const coverImage = images[0] || "";

  const updateImagesList = (newImages: string[]) => {
    setImages(newImages);
    onChange?.(newImages[0] || "", newImages);
  };

  const uploadSingleFile = async (file: File): Promise<string> => {
    if (!file.type.startsWith("image/")) {
      throw new Error(`Tệp '${file.name}' không phải hình ảnh hợp lệ.`);
    }

    if (file.size > 30 * 1024 * 1024) {
      throw new Error(`Ảnh '${file.name}' vượt quá giới hạn 30MB.`);
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = (await res.json()) as { url?: string; error?: string; success?: boolean };

    if (!res.ok || !data.url) {
      throw new Error(data.error || `Tải ảnh '${file.name}' thất bại.`);
    }

    return data.url;
  };

  const handleMultipleFiles = async (files: FileList | File[]) => {
    const fileList = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (fileList.length === 0) {
      setUploadError("Vui lòng chọn các tệp hình ảnh (JPG, PNG, WebP, AVIF, GIF).");
      return;
    }

    setUploadError(null);
    setUploadProgress({ current: 0, total: fileList.length });

    const uploadedUrls: string[] = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i]!;
      setUploadProgress({ current: i + 1, total: fileList.length });

      try {
        const url = await uploadSingleFile(file);
        uploadedUrls.push(url);
      } catch (err) {
        console.error("Upload error:", err);
        setUploadError(err instanceof Error ? err.message : "Lỗi khi tải ảnh.");
      }
    }

    setUploadProgress(null);

    if (uploadedUrls.length > 0) {
      // Append new URLs, keeping unique
      const combined = Array.from(new Set([...images, ...uploadedUrls]));
      updateImagesList(combined);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      void handleMultipleFiles(e.target.files);
      // Reset input value so user can upload the same file again if desired
      e.target.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      void handleMultipleFiles(e.dataTransfer.files);
    }
  };

  const removeImage = (indexToRemove: number) => {
    const filtered = images.filter((_, idx) => idx !== indexToRemove);
    updateImagesList(filtered);
  };

  const setAsCover = (indexToPromote: number) => {
    if (indexToPromote === 0) return;
    const item = images[indexToPromote]!;
    const remaining = images.filter((_, idx) => idx !== indexToPromote);
    updateImagesList([item, ...remaining]);
  };

  const handleAddManualUrl = () => {
    const trimmed = manualUrlInput.trim();
    if (!trimmed) return;
    if (images.includes(trimmed)) {
      setUploadError("Đường dẫn ảnh này đã tồn tại trong danh sách.");
      return;
    }
    const updated = [...images, trimmed];
    updateImagesList(updated);
    setManualUrlInput("");
    setUploadError(null);
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="font-semibold text-[#555555] text-xs block">
          {label} ({images.length} ảnh)
        </label>
        <button
          type="button"
          onClick={() => setShowManualInput(!showManualInput)}
          className="text-[11px] text-[#367156] hover:underline font-medium"
        >
          {showManualInput ? "Ẩn dán URL" : "Dán link ảnh URL"}
        </button>
      </div>

      {/* Hidden inputs for Form submission */}
      <input type="hidden" name={name} value={coverImage} required={required} />
      <input type="hidden" name={galleryName} value={JSON.stringify(images)} />

      {/* Manual URL Input box */}
      {showManualInput && (
        <div className="flex gap-2">
          <input
            type="text"
            value={manualUrlInput}
            onChange={(e) => setManualUrlInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddManualUrl();
              }
            }}
            placeholder="Dán link ảnh: /images/... hoặc https://..."
            className="flex-1 bg-white border border-[#d6cebf] px-3 py-1.5 rounded-xs text-xs font-mono"
          />
          <button
            type="button"
            onClick={handleAddManualUrl}
            className="px-3 py-1.5 bg-[#367156] text-white text-xs font-semibold rounded-xs hover:bg-[#285741] transition-colors"
          >
            Thêm
          </button>
        </div>
      )}

      {/* Images Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 p-2.5 bg-[#FAF9F6] border border-[#d6cebf] rounded-md">
          {images.map((url, idx) => {
            const isCover = idx === 0;
            return (
              <div
                key={`${url}-${idx}`}
                className={`group relative rounded-sm overflow-hidden border bg-stone-100 aspect-4/3 transition-all ${
                  isCover
                    ? "border-[#367156] ring-2 ring-[#367156]/30 shadow-xs"
                    : "border-black/10 hover:border-[#367156]/50"
                }`}
              >
                <ImageIcon className="w-6 h-6 text-stone-300 absolute inset-0 m-auto pointer-events-none" />
                <Image
                  src={url}
                  alt={`Room Image ${idx + 1}`}
                  fill
                  unoptimized
                  className="object-cover relative z-1"
                />

                {/* Cover badge */}
                {isCover ? (
                  <span className="absolute top-1 left-1 bg-[#367156] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-xs flex items-center gap-0.5 shadow-xs z-10">
                    <Star className="w-2.5 h-2.5 fill-current text-amber-300" />
                    Ảnh đại diện
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setAsCover(idx)}
                    title="Đặt làm ảnh đại diện chính"
                    className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 hover:bg-[#367156] text-white text-[10px] px-1.5 py-0.5 rounded-xs flex items-center gap-1 z-10"
                  >
                    <Star className="w-2.5 h-2.5" />
                    Đặt làm ảnh chính
                  </button>
                )}

                {/* Actions overlay */}
                <div className="absolute top-1 right-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1 bg-black/60 hover:bg-black/90 text-white rounded-xs"
                    title="Xem ảnh gốc"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="p-1 bg-red-600 hover:bg-red-700 text-white rounded-xs shadow-xs"
                    title="Xóa ảnh này"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>

                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-1 pointer-events-none">
                  <p className="text-[9px] text-white/90 truncate font-mono">
                    {idx + 1}. {url.split("/").pop()}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Quick Add More Tile */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer border-2 border-dashed border-[#d6cebf] hover:border-[#367156] hover:bg-[#367156]/5 rounded-sm flex flex-col items-center justify-center p-2 text-center aspect-4/3 transition-colors text-[#666666]"
          >
            <Plus className="w-5 h-5 text-[#367156] mb-0.5" />
            <span className="text-[11px] font-semibold text-[#222222]">Thêm ảnh</span>
            <span className="text-[9px] text-[#888888]">Chọn thêm tệp</span>
          </div>
        </div>
      )}

      {/* Main Drag & Drop Upload Zone (Shown when empty or as a big upload dropzone) */}
      {images.length === 0 && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`cursor-pointer border-2 border-dashed rounded-md p-6 text-center transition-all ${
            isDragOver
              ? "border-[#367156] bg-[#367156]/5"
              : "border-[#d6cebf] bg-[#FAF9F6] hover:border-[#367156] hover:bg-white"
          } ${uploadProgress ? "pointer-events-none opacity-60" : ""}`}
        >
          {uploadProgress ? (
            <div className="flex flex-col items-center justify-center py-2 gap-2 text-[#367156]">
              <Loader2 className="w-7 h-7 animate-spin" />
              <span className="text-xs font-semibold">
                Đang tải ảnh ({uploadProgress.current}/{uploadProgress.total})...
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-2 gap-1.5 text-[#666666]">
              <div className="w-12 h-12 rounded-full bg-[#367156]/10 flex items-center justify-center text-[#367156] mb-1">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-xs font-semibold text-[#222222]">
                Bấm để chọn 1 hoặc NHIỀU ảnh từ máy tính / điện thoại
              </p>
              <p className="text-[11px] text-[#888888]">
                Hoặc kéo thả nhiều ảnh vào đây (Hỗ trợ JPG, PNG, WebP, AVIF lên tới 30MB)
              </p>
            </div>
          )}
        </div>
      )}

      {/* Progress banner during batch upload */}
      {uploadProgress && images.length > 0 && (
        <div className="flex items-center gap-2 p-2 bg-[#367156]/10 text-[#367156] rounded text-xs font-semibold animate-pulse">
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
          <span>
            Đang tải ảnh {uploadProgress.current}/{uploadProgress.total} lên MinIO/S3...
          </span>
        </div>
      )}

      {/* Error display */}
      {uploadError && (
        <div className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Hidden real file input supporting multiple selection */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />
    </div>
  );
}
