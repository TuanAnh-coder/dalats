import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  staffProcedure,
  adminProcedure,
} from "~/server/api/trpc";
import { s3Storage } from "~/server/storage/s3";
import { redisCache } from "~/server/redis";
import { TRPCError } from "@trpc/server";

export const storageRouter = createTRPCRouter({
  /**
   * Health & connectivity status for Redis & MinIO
   */
  getStatus: publicProcedure.query(async () => {
    return {
      redis: {
        configured: !!(process.env.REDIS_URL),
        ready: redisCache.isReady(),
      },
      s3: {
        configured: s3Storage.isConfigured(),
        bucket: process.env.S3_BUCKET || "mdalats-media",
        endpoint: process.env.S3_ENDPOINT || null,
        publicUrl: process.env.S3_PUBLIC_URL || null,
      },
    };
  }),

  /**
   * Generate Presigned Upload URL for client-side direct uploads
   */
  getPresignedUploadUrl: staffProcedure
    .input(
      z.object({
        filename: z.string().min(1),
        contentType: z.string().min(1),
        folder: z.enum(["rooms", "gallery", "avatars", "receipts", "videos", "general"]).default("rooms"),
      })
    )
    .mutation(async ({ input }) => {
      if (!s3Storage.isConfigured()) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Dịch vụ lưu trữ S3/MinIO chưa được cấu hình trên máy chủ.",
        });
      }

      const sanitized = input.filename
        .toLowerCase()
        .replace(/[^a-z0-9.]/g, "-")
        .replace(/-+/g, "-");
      const datePrefix = new Date().toISOString().slice(0, 7);
      const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const key = `${input.folder}/${datePrefix}/${uniqueSuffix}-${sanitized}`;

      const { uploadUrl, publicUrl } = await s3Storage.getPresignedUploadUrl({
        key,
        contentType: input.contentType,
        expiresIn: 900,
      });

      return {
        uploadUrl,
        publicUrl,
        key,
      };
    }),

  /**
   * List uploaded files in MinIO bucket
   */
  listFiles: staffProcedure
    .input(
      z.object({
        prefix: z.string().optional().default(""),
      })
    )
    .query(async ({ input }) => {
      if (!s3Storage.isConfigured()) {
        return [];
      }
      return await s3Storage.listObjects(input.prefix);
    }),

  /**
   * Delete an object from MinIO (Admin only)
   */
  deleteFile: adminProcedure
    .input(
      z.object({
        key: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      if (!s3Storage.isConfigured()) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Dịch vụ S3/MinIO chưa được cấu hình.",
        });
      }

      const success = await s3Storage.deleteObject(input.key);
      if (!success) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Không thể xóa tệp từ MinIO.",
        });
      }

      return { success: true, key: input.key };
    }),
});
