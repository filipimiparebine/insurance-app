import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";
import { checkRateLimit, rateLimitHeaders, parseWindow } from "@blaj/security/ratelimit";

const SUPERADMIN_EMAILS = (process.env.SUPERADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase());

const DDoS_LIMIT = 30;
const DDoS_WINDOW = "60 s" as const;

const API_RATE_LIMIT = 120;
const API_RATE_WINDOW = "60 s" as const;

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp;
  return "127.0.0.1";
}

function applyHeaders(response: NextResponse, headers: Record<string, string>): void {
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
}

export default clerkMiddleware(async (auth, req) => {
  const ip = getClientIp(req);
  const path = req.nextUrl.pathname;
  const isApi = path.startsWith("/api/");

  // Layer 1: Global DDoS guard — strictest limit, applied before any processing
  const ddosResult = await checkRateLimit(`ddos:${ip}`, DDoS_LIMIT, DDoS_WINDOW);
  if (!ddosResult.success) {
    const ddosHeaders = rateLimitHeaders(ddosResult, parseWindow(DDoS_WINDOW));
    return new NextResponse("Service Unavailable", { status: 503, headers: ddosHeaders });
  }

  if (isApi) {
    // Layer 2: API rate limiting — per-IP
    const result = await checkRateLimit(`api:${ip}`, API_RATE_LIMIT, API_RATE_WINDOW);
    const windowMs = parseWindow(API_RATE_WINDOW);
    const headers = rateLimitHeaders(result, windowMs);

    if (!result.success) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429, headers },
      );
    }

    const response = NextResponse.next();
    applyHeaders(response, headers);
    return response;
  }

  // Page routes: Clerk auth + admin email allowlist
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("redirect_url", req.url);
    return NextResponse.redirect(signInUrl);
  }

  const email = ((sessionClaims?.email as string) ?? "").toLowerCase();

  if (SUPERADMIN_EMAILS.length > 0 && !SUPERADMIN_EMAILS.includes(email)) {
    return new NextResponse("Access denied: email not in admin allowlist", { status: 403 });
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sign-in|sign-up).*)",
  ],
};
