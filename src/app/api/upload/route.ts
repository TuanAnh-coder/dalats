import { NextRequest, NextResponse } from "next/server";
import { s3Storage } from "~/server/storage/s3";
import { auth } from "~/server/better-auth";
import { isStaffRole } from "~/lib/roles";

// Size limits
const MAX_IMAGE_SIZE = 30 * 1024 * 1024; // 30MB
const MAX_VIDEO_SIZE = 250 * 1024 * 1024; // 250MB for video trailers/tours

// Allowed MIME types
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "image/avif",
]);

const ALLOWED_VIDEO_TYPES = new Set([
  "video/mp4",
  "video/webm",
  "video/quicktime", // .mov
  "video/ogg",
  "video/x-m4v",
]);

const ALLOWED_DOC_TYPES = new Set(["application/pdf"]);

export const maxDuration = 120; // 2 minutes execution for large video uploads

export async function POST(req: NextRequest) {
  try {
    // 0. Security Guard: Only authenticated staff / admin can upload
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user) {
      return NextResponse.json(
        { error: "Yêu cầu đăng nhập để tải tệp lên hệ thống." },
        { status: 401 }
      );
    }

    const role = (session.user as { role?: string }).role;
    if (!isStaffRole(role)) {
      return NextResponse.json(
        { error: "Tài khoản của bạn không có quyền tải tệp lên hệ thống (Chỉ dành cho Lễ tân & Quản trị viên)." },
        { status: 403 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "rooms";

    if (!file) {
      return NextResponse.json(
        { error: "Vui lòng chọn tệp tải lên ('file' field required)." },
        { status: 400 }
      );
    }

    const isImage = ALLOWED_IMAGE_TYPES.has(file.type);
    const isVideo = ALLOWED_VIDEO_TYPES.has(file.type);
    const isDoc = ALLOWED_DOC_TYPES.has(file.type);

    if (!isImage && !isVideo && !isDoc) {
      return NextResponse.json(
        {
          error: `Định dạng tệp '${file.type}' không được hỗ trợ. Định dạng hỗ trợ: Ảnh (JPG, PNG, WebP, AVIF, SVG), Video (MP4, WebM, MOV), Tài liệu (PDF).`,
        },
        { status: 400 }
      );
    }

    const limit = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
    if (file.size > limit) {
      const limitMb = Math.round(limit / 1024 / 1024);
      return NextResponse.json(
        { error: `Dung lượng tệp vượt quá giới hạn ${limitMb}MB (hiện tại: ${(file.size / 1024 / 1024).toFixed(1)}MB).` },
        { status: 400 }
      );
    }

    // Auto-organize into media subdirectories if generic
    const targetFolder = folder === "uploads" && isVideo ? "videos" : folder;

    // Generate safe clean key: folder/YYYY-MM/timestamp-random-slug
    const buffer = Buffer.from(await file.arrayBuffer());
    const sanitizedName = file.name
      .toLowerCase()
      .replace(/[^a-z0-9.]/g, "-")
      .replace(/-+/g, "-");
    const datePrefix = new Date().toISOString().slice(0, 7); // e.g. 2026-10
    const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const key = `${targetFolder}/${datePrefix}/${uniqueSuffix}-${sanitizedName}`;

    // 1. Try S3 / MinIO storage first
    if (s3Storage.isConfigured()) {
      try {
        const result = await s3Storage.uploadBuffer({
          key,
          buffer,
          contentType: file.type,
          metadata: {
            originalName: encodeURIComponent(file.name),
            uploadedAt: new Date().toISOString(),
          },
        });

        return NextResponse.json({
          success: true,
          url: result.url,
          key: result.key,
          name: file.name,
          size: file.size,
          contentType: file.type,
        });
      } catch (s3Err) {
        console.warn("[Upload] MinIO/S3 upload failed, falling back to local storage:", s3Err);
      }
    }

    // 2. Local file storage fallback
    const fs = await import("fs/promises");
    const path = await import("path");
    const uploadDir = path.join(process.cwd(), "public", "uploads", targetFolder);
    await fs.mkdir(uploadDir, { recursive: true });
    const localFilePath = path.join(uploadDir, `${uniqueSuffix}-${sanitizedName}`);
    await fs.writeFile(localFilePath, buffer);
    const publicUrl = `/uploads/${targetFolder}/${uniqueSuffix}-${sanitizedName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      key: `uploads/${targetFolder}/${uniqueSuffix}-${sanitizedName}`,
      name: file.name,
      size: file.size,
      contentType: file.type,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error during upload.";
    console.error("[Upload API Error]", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
