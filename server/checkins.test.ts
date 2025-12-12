import { describe, expect, it, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { getDb, createCheckin } from "./db";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(userId: number = 1): TrpcContext {
  const user: AuthenticatedUser = {
    id: userId,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("stores API", () => {
  it("should list all stores", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const stores = await caller.stores.list();

    expect(stores).toBeDefined();
    expect(Array.isArray(stores)).toBe(true);
    expect(stores.length).toBeGreaterThan(0);
  });

  it("should get store by id", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const store = await caller.stores.getById({ id: 1 });

    expect(store).toBeDefined();
    if (store) {
      expect(store.id).toBe(1);
      expect(store.storeName).toBeDefined();
      expect(store.brand).toBeDefined();
    }
  });

  it("should find nearby stores", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Using coordinates near Honolulu, Hawaii
    const nearbyStores = await caller.stores.nearby({
      latitude: 21.3099,
      longitude: -157.8581,
      radiusKm: 10,
    });

    expect(nearbyStores).toBeDefined();
    expect(Array.isArray(nearbyStores)).toBe(true);
    
    if (nearbyStores.length > 0) {
      expect(nearbyStores[0]).toHaveProperty("distance");
      // Stores should be sorted by distance
      for (let i = 1; i < nearbyStores.length; i++) {
        expect(nearbyStores[i].distance).toBeGreaterThanOrEqual(nearbyStores[i - 1].distance);
      }
    }
  });
});

describe("checkins API", () => {
  it("should get user stats", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const stats = await caller.checkins.myStats();

    expect(stats).toBeDefined();
    expect(stats.visitedCount).toBeGreaterThanOrEqual(0);
    expect(stats.totalStores).toBeGreaterThan(0);
    expect(stats.percentage).toBeGreaterThanOrEqual(0);
    expect(stats.percentage).toBeLessThanOrEqual(100);
  });

  it("should reject check-in when too far from store", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Try to check in from a location far from any store
    await expect(
      caller.checkins.create({
        storeId: 1,
        latitude: 0,
        longitude: 0,
        comment: "Test check-in",
      })
    ).rejects.toThrow(/must be within/);
  });

  it("should get user check-ins", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const checkins = await caller.checkins.myCheckins();

    expect(checkins).toBeDefined();
    expect(Array.isArray(checkins)).toBe(true);
  });
});
