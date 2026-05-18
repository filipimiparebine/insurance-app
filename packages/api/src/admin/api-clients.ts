import { z } from "zod";
import { adminBuilder as b } from "./_builder";
import { apiClients } from "@blaj/db/schema";
import { eq, and, desc, isNull } from "drizzle-orm";
import { generateApiKey, hashApiKey, hashApiKeyWithBcrypt } from "../lib/keygen";

const pagination = z.object({
  page: z.number().int().min(1).default(1),
  perPage: z.number().int().min(1).max(100).default(25),
});

const listOutput = z.object({ data: z.array(z.record(z.unknown())), total: z.number() });
const recordOutput = z.record(z.unknown());
const createOutput = z.object({
  rawKey: z.string(),
  prefix: z.string(),
  name: z.string(),
  rateLimitPerMin: z.number(),
});
const revokeOutput = z.object({ id: z.string(), revokedAt: z.date().nullable() });
const rotateOutput = z.object({
  id: z.string(),
  rawKey: z.string(),
  prefix: z.string(),
  name: z.string().nullable(),
  previousId: z.string(),
});

export const apiClientsRouter = b.router({
  list: b
    .input(pagination)
    .output(listOutput)
    .handler(async ({ input, context }) => {
      const { page, perPage } = input;
      const { db } = context;

      const [rows, total] = await Promise.all([
        db
          .select({
            id: apiClients.id,
            name: apiClients.name,
            apiKeyPrefix: apiClients.apiKeyPrefix,
            active: apiClients.active,
            rateLimitPerMin: apiClients.rateLimitPerMin,
            createdAt: apiClients.createdAt,
            lastUsedAt: apiClients.lastUsedAt,
            revokedAt: apiClients.revokedAt,
          })
          .from(apiClients)
          .orderBy(desc(apiClients.createdAt))
          .limit(perPage)
          .offset((page - 1) * perPage),
        db.$count(apiClients),
      ]);

      return { data: rows, total };
    }),

  getOne: b
    .input(z.object({ id: z.string().uuid() }))
    .output(recordOutput)
    .handler(async ({ input, context }) => {
      const { db } = context;
      const [client] = await db
        .select({
          id: apiClients.id,
          name: apiClients.name,
          apiKeyPrefix: apiClients.apiKeyPrefix,
          active: apiClients.active,
          rateLimitPerMin: apiClients.rateLimitPerMin,
          createdAt: apiClients.createdAt,
          lastUsedAt: apiClients.lastUsedAt,
          revokedAt: apiClients.revokedAt,
        })
        .from(apiClients)
        .where(eq(apiClients.id, input.id))
        .limit(1);

      if (!client) throw new Error("API client not found");
      return client;
    }),

  create: b
    .input(
      z.object({
        name: z.string().min(1).max(100),
        rateLimitPerMin: z.number().int().min(1).max(10000).default(60),
      }),
    )
    .output(createOutput)
    .handler(async ({ input, context }) => {
      const { db } = context;
      const { rawKey, prefix } = generateApiKey();
      const sha256 = await hashApiKey(rawKey);
      const bcryptHash = await hashApiKeyWithBcrypt(rawKey);

      await db.insert(apiClients).values({
        name: input.name,
        apiKeyHash: sha256,
        apiKeyPrefix: prefix,
        apiKeyBcrypt: bcryptHash,
        rateLimitPerMin: input.rateLimitPerMin,
        active: true,
        createdAt: new Date(),
      });

      return {
        rawKey,
        prefix,
        name: input.name,
        rateLimitPerMin: input.rateLimitPerMin,
      };
    }),

  update: b
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string().min(1).max(100).optional(),
        rateLimitPerMin: z.number().int().min(1).max(10000).optional(),
        active: z.boolean().optional(),
      }),
    )
    .output(recordOutput)
    .handler(async ({ input, context }) => {
      const { db } = context;
      const { id, ...data } = input;

      const [client] = await db
        .update(apiClients)
        .set(data as never)
        .where(eq(apiClients.id, id))
        .returning();

      if (!client) throw new Error("API client not found");
      return client;
    }),

  revoke: b
    .input(z.object({ id: z.string().uuid() }))
    .output(revokeOutput)
    .handler(async ({ input, context }) => {
      const { db } = context;

      const [client] = await db
        .update(apiClients)
        .set({
          active: false,
          revokedAt: new Date(),
        })
        .where(eq(apiClients.id, input.id))
        .returning();

      if (!client) throw new Error("API client not found");
      return { id: client.id, revokedAt: client.revokedAt };
    }),

  rotate: b
    .input(z.object({ id: z.string().uuid() }))
    .output(rotateOutput)
    .handler(async ({ input, context }) => {
      const { db } = context;

      const [existing] = await db
        .select()
        .from(apiClients)
        .where(and(eq(apiClients.id, input.id), isNull(apiClients.revokedAt)))
        .limit(1);

      if (!existing) throw new Error("API client not found or already revoked");

      await db
        .update(apiClients)
        .set({ revokedAt: new Date(), active: false })
        .where(eq(apiClients.id, input.id));

      const { rawKey, prefix } = generateApiKey();
      const sha256 = await hashApiKey(rawKey);
      const bcryptHash = await hashApiKeyWithBcrypt(rawKey);

      const [created] = await db
        .insert(apiClients)
        .values({
          name: existing.name,
          apiKeyHash: sha256,
          apiKeyPrefix: prefix,
          apiKeyBcrypt: bcryptHash,
          rateLimitPerMin: existing.rateLimitPerMin,
          active: true,
          createdAt: new Date(),
        })
        .returning();

      return {
        id: created.id,
        rawKey,
        prefix,
        name: created.name,
        previousId: input.id,
      };
    }),
});
