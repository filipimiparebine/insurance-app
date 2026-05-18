import { z } from "zod";
import { adminBuilder as b } from "./_builder";
import { appConfig } from "@blaj/db/schema";
import { eq } from "drizzle-orm";

export const settingsRouter = b.router({
  list: b.handler(async ({ context }) => {
    const { db } = context;
    return db.select().from(appConfig).orderBy(appConfig.key);
  }),

  get: b
    .input(z.object({ key: z.string() }))
    .handler(async ({ input, context }) => {
      const { db } = context;
      const [row] = await db
        .select()
        .from(appConfig)
        .where(eq(appConfig.key, input.key))
        .limit(1);
      return row ?? null;
    }),

  set: b
    .input(
      z.object({
        key: z.string(),
        value: z.string(),
        type: z.string().optional(),
        description: z.string().optional(),
      }),
    )
    .handler(async ({ input, context }) => {
      const { db } = context;
      const [row] = await db
        .insert(appConfig)
        .values(input)
        .onConflictDoUpdate({ target: appConfig.key, set: { value: input.value } })
        .returning();
      return row;
    }),
});
