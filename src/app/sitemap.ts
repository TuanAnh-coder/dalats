import type { MetadataRoute } from "next";
import { db } from "~/server/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://mdalatsvilla.com";
  const now = new Date();

  // Core static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/rooms`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/dining`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/experiences`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/my-bookings`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.5,
    },
  ];

  try {
    const allRooms = await db.query.rooms.findMany();
    const roomRoutes: MetadataRoute.Sitemap = allRooms.map((room) => ({
      url: `${baseUrl}/rooms/${room.slug}`,
      lastModified: room.createdAt ?? now,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    return [...staticRoutes, ...roomRoutes];
  } catch (error) {
    console.warn("Sitemap: Could not query rooms from DB during build, falling back to static", error);
    return staticRoutes;
  }
}
