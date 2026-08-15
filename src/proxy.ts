import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PATHS = [
  "/dashboard",
  "/admin",
  "/my-courses",
  "/projects",
  "/certificates",
];
const PUBLIC_CERTIFICATE_PREFIX = "/certificates/verify/";

export function proxy(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  const isPublicCertificate = pathname.startsWith(PUBLIC_CERTIFICATE_PREFIX);
  const isProtected =
    !isPublicCertificate && PROTECTED_PATHS.some((p) => pathname.startsWith(p));
  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/?slide=auth", req.url));
  }

  // A cookie is only evidence that a browser has a token, not that the token
  // is valid. Public and recovery routes must stay reachable so a stale
  // HttpOnly cookie cannot create a redirect loop.
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/my-courses/:path*",
    "/projects/:path*",
    "/certificates/:path*",
    "/forgot-password",
    "/reset-password",
    "/verify-email",
    "/verify-login",
    "/",
    "/bootcamps/:path*",
    "/pretech-courses/:path*",
    "/free-learning/:path*",
    "/consultations",
  ],
};
