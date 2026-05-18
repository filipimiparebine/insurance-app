import { type NextRequest, NextResponse } from "next/server";
import { publicRouter } from "@blaj/api";
import { createDb } from "@blaj/db";
import { RPCHandler } from "@orpc/server/fetch";
import { verifyToken } from "@clerk/nextjs/server";

const DATABASE_URL = process.env.DATABASE_URL ?? "";
const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY ?? "";

const db = createDb(DATABASE_URL);
const handler = new RPCHandler(publicRouter);

async function getUserId(req: NextRequest): Promise<string | undefined> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return undefined;

  const token = authHeader.slice(7);
  try {
    const { data } = await verifyToken(token, { secretKey: CLERK_SECRET_KEY });
    return (data as { sub?: string })?.sub;
  } catch {
    return undefined;
  }
}

export async function POST(request: NextRequest) {
  const userId = await getUserId(request);

  const result = await handler.handle(request, {
    context: { db, userId },
  });

  if (!result.matched) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return result.response;
}
