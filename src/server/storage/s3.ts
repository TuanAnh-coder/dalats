import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  HeadObjectCommand,
  CreateBucketCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "~/env";

/**
 * MinIO / S3 Client Singleton
 */
let s3ClientInstance: S3Client | null = null;

function resolveEndpoint(): string | undefined {
  if (env.S3_ENDPOINT || process.env.S3_ENDPOINT) {
    return env.S3_ENDPOINT || process.env.S3_ENDPOINT;
  }
  const minioEndpoint = env.MINIO_ENDPOINT || process.env.MINIO_ENDPOINT;
  if (minioEndpoint) {
    if (minioEndpoint.startsWith("http://") || minioEndpoint.startsWith("https://")) {
      return minioEndpoint;
    }
    const port = env.MINIO_PORT || process.env.MINIO_PORT || "9000";
    const useSsl = (env.MINIO_USE_SSL || process.env.MINIO_USE_SSL) === "true";
    return `${useSsl ? "https" : "http"}://${minioEndpoint}:${port}`;
  }
  return undefined;
}

export function getS3Client(): S3Client | null {
  if (s3ClientInstance) return s3ClientInstance;

  const endpoint = resolveEndpoint();
  const accessKeyId =
    env.MINIO_ACCESS_KEY ||
    process.env.MINIO_ACCESS_KEY ||
    env.S3_ACCESS_KEY ||
    process.env.S3_ACCESS_KEY;
  const secretAccessKey =
    env.MINIO_SECRET_KEY ||
    process.env.MINIO_SECRET_KEY ||
    env.S3_SECRET_KEY ||
    process.env.S3_SECRET_KEY;

  if (!endpoint || !accessKeyId || !secretAccessKey) {
    return null;
  }

  const region = env.S3_REGION || process.env.S3_REGION || "us-east-1";
  const forcePathStyle =
    (env.S3_FORCE_PATH_STYLE || process.env.S3_FORCE_PATH_STYLE) !== "false";

  s3ClientInstance = new S3Client({
    endpoint,
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
    forcePathStyle, // Required for MinIO/Silo path-style routing: http://endpoint/bucket/key
  });

  return s3ClientInstance;
}

export const S3_CONFIG = {
  get bucket(): string {
    return (
      env.MINIO_BUCKET ||
      process.env.MINIO_BUCKET ||
      env.S3_BUCKET ||
      process.env.S3_BUCKET ||
      "mdalats-media"
    );
  },
  get publicBaseUrl(): string {
    const customPublic =
      env.MINIO_PUBLIC_URL ||
      process.env.MINIO_PUBLIC_URL ||
      env.S3_PUBLIC_URL ||
      process.env.S3_PUBLIC_URL;

    if (customPublic) {
      return customPublic.replace(/\/$/, "");
    }
    const endpoint = (resolveEndpoint() || "http://localhost:9000").replace(/\/$/, "");
    return `${endpoint}/${this.bucket}`;
  },
};

export const s3Storage = {
  /**
   * Check if S3 / MinIO storage is configured
   */
  isConfigured(): boolean {
    return !!getS3Client();
  },

  /**
   * Get full public URL for an uploaded file
   */
  getPublicUrl(key: string): string {
    const cleanKey = key.replace(/^\//, "");
    return `${S3_CONFIG.publicBaseUrl}/${cleanKey}`;
  },

  /**
   * Upload buffer directly to MinIO
   */
  async uploadBuffer({
    key,
    buffer,
    contentType = "application/octet-stream",
    metadata,
  }: {
    key: string;
    buffer: Buffer | Uint8Array;
    contentType?: string;
    metadata?: Record<string, string>;
  }): Promise<{ key: string; url: string }> {
    const client = getS3Client();
    if (!client) {
      throw new Error("S3/MinIO is not configured. Please set S3_ENDPOINT, S3_ACCESS_KEY, and S3_SECRET_KEY.");
    }

    const cleanKey = key.replace(/^\//, "");
    const command = new PutObjectCommand({
      Bucket: S3_CONFIG.bucket,
      Key: cleanKey,
      Body: buffer,
      ContentType: contentType,
      Metadata: metadata,
    });

    try {
      await client.send(command);
    } catch (err: unknown) {
      const errName =
        (err as { name?: string; Code?: string })?.name ||
        (err as { Code?: string })?.Code;

      if (errName === "NoSuchBucket" || errName === "NotFound") {
        console.log(`[S3/MinIO] Bucket '${S3_CONFIG.bucket}' chưa tồn tại. Đang tự động tạo...`);
        try {
          await client.send(new CreateBucketCommand({ Bucket: S3_CONFIG.bucket }));
          await client.send(command);
        } catch (createErr) {
          console.error("[S3/MinIO] Tự động tạo bucket thất bại:", createErr);
          throw err;
        }
      } else {
        throw err;
      }
    }

    return {
      key: cleanKey,
      url: this.getPublicUrl(cleanKey),
    };
  },

  /**
   * Get an object byte array and metadata from MinIO
   */
  async getObjectBytes(key: string): Promise<{
    bytes: Uint8Array;
    contentType?: string;
    contentLength?: number;
  } | null> {
    const client = getS3Client();
    if (!client) return null;

    const cleanKey = key.replace(/^\//, "");
    const bucket = S3_CONFIG.bucket;

    // Build candidates in case key has bucket name or path prefix
    const candidates = [
      cleanKey,
      cleanKey.startsWith(`${bucket}/`) ? cleanKey.replace(`${bucket}/`, "") : null,
      cleanKey.startsWith("dalats-media/") ? cleanKey.replace(/^dalats-media\//, "") : null,
      cleanKey.startsWith("uploads/") ? cleanKey.replace(/^uploads\//, "") : null,
      cleanKey.startsWith("media/") ? cleanKey.replace(/^media\//, "") : null,
      cleanKey.includes("/") ? cleanKey.split("/").slice(1).join("/") : null,
    ].filter(Boolean) as string[];

    const uniqueCandidates = Array.from(new Set(candidates));

    for (const testKey of uniqueCandidates) {
      try {
        const command = new GetObjectCommand({
          Bucket: bucket,
          Key: testKey,
        });
        const response = await client.send(command);
        if (!response.Body) continue;
        const bytes = await response.Body.transformToByteArray();
        return {
          bytes,
          contentType: response.ContentType,
          contentLength: response.ContentLength,
        };
      } catch {
        // Try next candidate
      }
    }

    return null;
  },

  /**
   * Generate Presigned Upload URL for direct client-to-MinIO uploads
   */
  async getPresignedUploadUrl({
    key,
    contentType = "application/octet-stream",
    expiresIn = 900, // 15 minutes
  }: {
    key: string;
    contentType?: string;
    expiresIn?: number;
  }): Promise<{ uploadUrl: string; key: string; publicUrl: string }> {
    const client = getS3Client();
    if (!client) {
      throw new Error("S3/MinIO is not configured.");
    }

    const cleanKey = key.replace(/^\//, "");
    const command = new PutObjectCommand({
      Bucket: S3_CONFIG.bucket,
      Key: cleanKey,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(client, command, { expiresIn });

    return {
      uploadUrl,
      key: cleanKey,
      publicUrl: this.getPublicUrl(cleanKey),
    };
  },

  /**
   * Generate Presigned Download URL for private/secure files
   */
  async getPresignedDownloadUrl({
    key,
    expiresIn = 3600, // 1 hour
  }: {
    key: string;
    expiresIn?: number;
  }): Promise<string> {
    const client = getS3Client();
    if (!client) {
      throw new Error("S3/MinIO is not configured.");
    }

    const command = new GetObjectCommand({
      Bucket: S3_CONFIG.bucket,
      Key: key.replace(/^\//, ""),
    });

    return await getSignedUrl(client, command, { expiresIn });
  },

  /**
   * Delete an object from MinIO
   */
  async deleteObject(key: string): Promise<boolean> {
    const client = getS3Client();
    if (!client) return false;

    try {
      const command = new DeleteObjectCommand({
        Bucket: S3_CONFIG.bucket,
        Key: key.replace(/^\//, ""),
      });
      await client.send(command);
      return true;
    } catch (err) {
      console.error("[S3/MinIO] Delete failed:", err);
      return false;
    }
  },

  /**
   * Check if an object exists in MinIO
   */
  async exists(key: string): Promise<boolean> {
    const client = getS3Client();
    if (!client) return false;

    try {
      const command = new HeadObjectCommand({
        Bucket: S3_CONFIG.bucket,
        Key: key.replace(/^\//, ""),
      });
      await client.send(command);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * List files in the bucket
   */
  async listObjects(prefix = ""): Promise<
    Array<{
      key: string;
      url: string;
      size: number;
      lastModified?: Date;
    }>
  > {
    const client = getS3Client();
    if (!client) return [];

    try {
      const command = new ListObjectsV2Command({
        Bucket: S3_CONFIG.bucket,
        Prefix: prefix,
        MaxKeys: 100,
      });

      const response = await client.send(command);
      return (response.Contents || []).map((item) => ({
        key: item.Key || "",
        url: this.getPublicUrl(item.Key || ""),
        size: item.Size || 0,
        lastModified: item.LastModified,
      }));
    } catch (err) {
      console.error("[S3/MinIO] List failed:", err);
      return [];
    }
  },
};
