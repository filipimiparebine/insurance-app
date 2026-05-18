import { type NextRequest, NextResponse } from "next/server";
import { appRouter } from "@blaj/api";
import { createDb } from "@blaj/db";
import { RPCHandler } from "@orpc/server/fetch";
import { verifyToken } from "@clerk/nextjs/server";

const DATABASE_URL = process.env.DATABASE_URL ?? "";
const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY ?? "";
const SUPERADMIN_EMAILS = (process.env.SUPERADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase());

const db = createDb(DATABASE_URL);
const handler = new RPCHandler(appRouter);

async function getUserId(req: NextRequest): Promise<string | undefined> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return undefined;

  const token = authHeader.slice(7);
  try {
    const { data } = await verifyToken(token, { secretKey: CLERK_SECRET_KEY });
    if (!data) return undefined;
    return (data as { sub?: string }).sub;
  } catch {
    return undefined;
  }
}

async function getUserEmail(req: NextRequest): Promise<string | undefined> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return undefined;

  const token = authHeader.slice(7);
  try {
    const { data } = await verifyToken(token, { secretKey: CLERK_SECRET_KEY });
    if (!data) return undefined;
    return (data as { email?: string }).email;
  } catch {
    return undefined;
  }
}

async function isAdmin(req: NextRequest): Promise<boolean> {
  if (SUPERADMIN_EMAILS.length === 0) return false;
  const email = await getUserEmail(req);
  if (!email) return false;
  return SUPERADMIN_EMAILS.includes(email.toLowerCase());
}

export async function POST(request: NextRequest) {
  const userId = await getUserId(request);
  const admin = await isAdmin(request);

  if (userId && !admin) {
    return NextResponse.json({ error: "Forbidden: admin access required" }, { status: 403 });
  }

  const result = await handler.handle(request, {
    context: { db, userId, isAdmin: admin },
  });

  if (!result.matched) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return result.response;
}
