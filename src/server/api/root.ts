import { bookingRouter } from "~/server/api/routers/booking";
import { contactRouter } from "~/server/api/routers/contact";
import { customerRouter } from "~/server/api/routers/customer";
import { roomRouter } from "~/server/api/routers/room";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  room: roomRouter,
  booking: bookingRouter,
  contact: contactRouter,
  customer: customerRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.room.getAll();
 *       ^? Room[]
 */
export const createCaller = createCallerFactory(appRouter);
