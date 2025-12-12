import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { 
  getAllStores, 
  getStoreById, 
  getNearbyStores, 
  createCheckin, 
  getUserCheckins, 
  getUserVisitedStoresCount,
  hasUserCheckedInStore 
} from "./db";
import { storagePut } from "./storage";
import { nanoid } from "nanoid";

// Maximum distance from store to allow check-in (in kilometers)
const MAX_CHECKIN_DISTANCE_KM = 0.5;

// Calculate distance between two coordinates
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  stores: router({
    list: publicProcedure.query(async () => {
      return await getAllStores();
    }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await getStoreById(input.id);
      }),
    
    nearby: publicProcedure
      .input(z.object({
        latitude: z.number(),
        longitude: z.number(),
        radiusKm: z.number().optional().default(50),
      }))
      .query(async ({ input }) => {
        return await getNearbyStores(input.latitude, input.longitude, input.radiusKm);
      }),
  }),

  checkins: router({
    create: protectedProcedure
      .input(z.object({
        storeId: z.number(),
        latitude: z.number(),
        longitude: z.number(),
        comment: z.string().optional(),
        photoBase64: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Verify store exists
        const store = await getStoreById(input.storeId);
        if (!store) {
          throw new Error("Store not found");
        }

        // Calculate distance from user to store
        const storeLat = parseFloat(store.latitude);
        const storeLon = parseFloat(store.longitude);
        const distance = calculateDistance(input.latitude, input.longitude, storeLat, storeLon);

        // Check if user is within acceptable range
        if (distance > MAX_CHECKIN_DISTANCE_KM) {
          throw new Error(`You must be within ${MAX_CHECKIN_DISTANCE_KM}km of the store to check in. Current distance: ${distance.toFixed(2)}km`);
        }

        // Upload photo if provided
        let photoUrl: string | undefined;
        if (input.photoBase64) {
          const base64Data = input.photoBase64.replace(/^data:image\/\w+;base64,/, "");
          const buffer = Buffer.from(base64Data, "base64");
          const fileKey = `checkins/${ctx.user.id}/${nanoid()}.jpg`;
          const result = await storagePut(fileKey, buffer, "image/jpeg");
          photoUrl = result.url;
        }

        // Create check-in
        await createCheckin({
          userId: ctx.user.id,
          storeId: input.storeId,
          latitude: input.latitude.toString(),
          longitude: input.longitude.toString(),
          comment: input.comment,
          photoUrl,
        });

        return { success: true };
      }),

    myCheckins: protectedProcedure.query(async ({ ctx }) => {
      return await getUserCheckins(ctx.user.id);
    }),

    myStats: protectedProcedure.query(async ({ ctx }) => {
      const visitedCount = await getUserVisitedStoresCount(ctx.user.id);
      const totalStores = (await getAllStores()).length;
      
      return {
        visitedCount,
        totalStores,
        percentage: totalStores > 0 ? Math.round((visitedCount / totalStores) * 100) : 0,
      };
    }),

    hasVisited: protectedProcedure
      .input(z.object({ storeId: z.number() }))
      .query(async ({ ctx, input }) => {
        return await hasUserCheckedInStore(ctx.user.id, input.storeId);
      }),
  }),
});

export type AppRouter = typeof appRouter;
