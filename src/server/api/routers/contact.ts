import { desc, eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { contacts, subscribers } from "~/server/db/schema";

export const contactRouter = createTRPCRouter({
  submitMessage: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, "Vui lòng nhập tên"),
        email: z.string().email("Vui lòng nhập đúng định dạng email"),
        phone: z.string().optional(),
        message: z.string().min(3, "Nội dung tin nhắn tối thiểu 3 ký tự"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(contacts).values({
        name: input.name,
        email: input.email,
        phone: input.phone ?? null,
        message: input.message,
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
      try {
        await ctx.db.insert(subscribers).values({
          email: input.email,
        });
        return { success: true, message: "Đăng ký nhận ưu đãi thành công!" };
      } catch (err) {
        return { success: true, message: "Email này đã được đăng ký nhận thông tin từ trước." };
      }
    }),

  getAllMessages: publicProcedure.query(async ({ ctx }) => {
    let all = await ctx.db.select().from(contacts).orderBy(desc(contacts.createdAt));
    if (all.length === 0) {
      await ctx.db.insert(contacts).values([
        {
          name: "Lê Hoàng Yến",
          email: "hoangyen.le@gmail.com",
          phone: "0908 123 456",
          message: "Tôi muốn đặt 4 phòng cho đoàn gia đình vào dịp Giáng sinh 24/12, villa có hỗ trợ set up tiệc nướng BBQ và đốt lửa trại không?",
        },
        {
          name: "Trịnh Đình Khang",
          email: "khang.trinh@techcorp.vn",
          phone: "0977 889 900",
          message: "Cần tư vấn phòng áp mái hướng thung lũng cho chuyến trăng mật vào tháng 11. Xin bảng giá chi tiết các dịch vụ.",
        },
      ]);
      all = await ctx.db.select().from(contacts).orderBy(desc(contacts.createdAt));
    }
    return all;
  }),

  deleteMessage: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(contacts).where(eq(contacts.id, input.id));
      return { success: true };
    }),
});

