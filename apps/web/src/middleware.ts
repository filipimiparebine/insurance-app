import createMiddleware from "next-intl/middleware";
import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

const SUPERADMIN_EMAILS = (process.env.SUPERADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL ?? "";

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();
  const pathname = req.nextUrl.pathname;

  const isRootPath = pathname === "/" || /^\/(ro|en)$/.test(pathname);

  if (userId && isRootPath) {
    const email = ((sessionClaims?.email as string) ?? "").toLowerCase();

    if (SUPERADMIN_EMAILS.length > 0 && SUPERADMIN_EMAILS.includes(email)) {
      if (ADMIN_URL) {
        return NextResponse.redirect(new URL(ADMIN_URL));
      }
    }

    const locale = pathname === "/" ? "ro" : pathname.slice(1);
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, req.url));
  }

  return intlMiddleware(req);
});

export const config = {
  matcher: [
    "/",
    "/(ro|en)/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
