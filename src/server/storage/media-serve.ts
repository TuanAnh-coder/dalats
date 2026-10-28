import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { existsSync } from "fs";
import { s3Storage } from "./s3";

const MIME_MAP: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  svg: "image/svg+xml",
  avif: "image/avif",
  ico: "image/x-icon",
  mp4: "video/mp4",
  webm: "video/webm",
  mov: "video/quicktime",
  pdf: "application/pdf",
};

const ALLOWED_EXTENSIONS = new Set(Object.keys(MIME_MAP));

export function getMimeType(filePath: string, fallback = "application/octet-stream"): string {
  const ext = filePath.split(".").pop()?.toLowerCase();
  return (ext && MIME_MAP[ext]) || fallback;
}

/**
 * Common media streamer:
 * 1. Checks MinIO / S3 storage
 * 2. Falls back to local public directory / uploads
 * Strictly blocks disallowed extensions and directory traversal.
 */
export async function handleMediaRequest(pathSegments: string[]): Promise<NextResponse> {
  if (!pathSegments || pathSegments.length === 0) {
    return new NextResponse("Tệp không tồn tại", { status: 404 });
  }

  // Prevent path traversal
  const sanitizedSegments = pathSegments
    .map((s) => s.replace(/[^a-zA-Z0-9._-]/g, ""))
    .filter((s) => s.length > 0 && s !== ".." && s !== ".");

  if (sanitizedSegments.length === 0) {
    return new NextResponse("Đường dẫn không hợp lệ", { status: 400 });
  }

  const fileName = sanitizedSegments[sanitizedSegments.length - 1]!;
  const fileExt = fileName.split(".").pop()?.toLowerCase();

  // Whitelist extension check: Only allow media and document files
  if (!fileExt || !ALLOWED_EXTENSIONS.has(fileExt)) {
    return new NextResponse("Định dạng tệp không được phép", { status: 403 });
  }

  const relativeKey = sanitizedSegments.join("/");
  const detectedMime = getMimeType(fileName);

  // 1. Try MinIO / S3
  try {
    const s3Result = await s3Storage.getObjectBytes(relativeKey);
    if (s3Result && s3Result.bytes) {
      const contentType = s3Result.contentType || detectedMime;
      const headers = new Headers();
      headers.set("Content-Type", contentType);
      headers.set("Cache-Control", "public, max-age=31536000, immutable");
      headers.set("Access-Control-Allow-Origin", "*");
      if (s3Result.contentLength) {
        headers.set("Content-Length", s3Result.contentLength.toString());
      }

      return new NextResponse(Buffer.from(s3Result.bytes), {
        status: 200,
        headers,
      });
    }
  } catch (err) {
    console.warn(`[Media Serve] Error loading from MinIO for key '${relativeKey}':`, err);
  }

  // 2. Try Local File System (Strictly jailed inside public/ directory)
  const publicRoot = path.resolve(process.cwd(), "public");

  const localCandidates = [
    path.join(publicRoot, "uploads", ...sanitizedSegments),
    path.join(publicRoot, ...sanitizedSegments),
    sanitizedSegments.length > 1
      ? path.join(publicRoot, "uploads", sanitizedSegments[0]!, fileName)
      : null,
    path.join(publicRoot, "uploads", relativeKey),
    path.join(publicRoot, "uploads", fileName),
  ].filter(Boolean) as string[];

  for (const candidatePath of localCandidates) {
    const resolvedPath = path.resolve(candidatePath);

    // Jail check: must be strictly inside publicRoot
    if (!resolvedPath.startsWith(publicRoot)) {
      continue;
    }

    if (existsSync(resolvedPath)) {
      try {
        const fileBuffer = await fs.readFile(resolvedPath);
        const headers = new Headers();
        headers.set("Content-Type", detectedMime);
        headers.set("Content-Length", fileBuffer.length.toString());
        headers.set("Cache-Control", "public, max-age=31536000, immutable");
        headers.set("Access-Control-Allow-Origin", "*");

        return new NextResponse(fileBuffer, {
          status: 200,
          headers,
        });
      } catch (readErr) {
        console.warn(`[Media Serve] Read error on candidate ${resolvedPath}:`, readErr);
      }
    }
  }

  return new NextResponse("Tệp đa phương tiện không tồn tại", { status: 404 });
}
