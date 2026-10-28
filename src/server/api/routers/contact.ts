import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

import {
  adminProcedure,
  createTRPCRouter,
  publicProcedure,
  staffProcedure,
} from "~/server/api/trpc";
import { contacts, subscribers } from "~/server/db/schema";
import { checkRateLimit, getClientIp } from "~/server/security/rate-limit";

function sanitizeText(str?: string | null): string {
  if (!str) return "";
  return str.replace(/<[^>]*>?/gm, "").trim();
}

export const contactRouter = createTRPCRouter({
  submitMessage: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, "Vui lòng nhập tên").max(100, "Tên không được vượt quá 100 ký tự"),
        email: z.string().email("Vui lòng nhập đúng định dạng email"),
        phone: z.string().max(30, "Số điện thoại không hợp lệ").optional(),
        message: z.string().min(3, "Nội dung tin nhắn tối thiểu 3 ký tự").max(1000, "Nội dung không được quá 1000 ký tự"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const ip = getClientIp(ctx.headers);
      const rateLimit = await checkRateLimit(`contact:submit:${ip}`, 5, 60);
      if (!rateLimit.success) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Quý khách đã gửi tin nhắn quá nhanh. Vui lòng thử lại sau ít phút.",
        });
      }

      await ctx.db.insert(contacts).values({
        name: sanitizeText(input.name),
        email: input.email.trim().toLowerCase(),
        phone: input.phone ? sanitizeText(input.phone) : null,
        message: sanitizeText(input.message),
      });

      return { success: true, message: "Cảm ơn bạn đã gửi tin nhắn! M_Dalats Villa sẽ phản hồi bạn trong thời gian sớm nhất." };
    }),

  subscribeNewsletter: publicProcedure
    .input(
      z.object({
        email: z.string().email("Email không hợp lệ"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const ip = getClientIp(ctx.headers);
      const rateLimit = await checkRateLimit(`newsletter:subscribe:${ip}`, 5, 60);
      if (!rateLimit.success) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Quý khách vui lòng thử lại sau ít phút.",
        });
      }

      try {
        await ctx.db.insert(subscribers).values({
          email: input.email.trim().toLowerCase(),
        });
        return { success: true, message: "Đăng ký nhận ưu đãi thành công!" };
      } catch (err) {
        return { success: true, message: "Email này đã được đăng ký nhận thông tin từ trước." };
      }
    }),

  getAllMessages: staffProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(contacts).orderBy(desc(contacts.createdAt));
  }),

  deleteMessage: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(contacts).where(eq(contacts.id, input.id));
      return { success: true };
    }),
});

