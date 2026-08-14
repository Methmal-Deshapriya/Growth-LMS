import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PATHS = [
  "/dashboard",
  "/admin",
  "/my-courses",
  "/projects",
  "/certificates",
];
const AUTH_ONLY_PATHS = [
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];
const PUBLIC_MARKETING_PATHS = ["/", "/bootcamps", "/pretech-courses", "/free-learning", "/consultations"];
const PUBLIC_CERTIFICATE_PREFIX = "/certificates/verify/";

export function proxy(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  const isPublicCertificate = pathname.startsWith(PUBLIC_CERTIFICATE_PREFIX);
  const isProtected =
    !isPublicCertificate && PROTECTED_PATHS.some((p) => pathname.startsWith(p));
  const isAuthOnly = AUTH_ONLY_PATHS.some((p) => pathname.startsWith(p));
  const isMarketing = PUBLIC_MARKETING_PATHS.some((path) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path)
  );

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/?slide=auth", req.url));
  }

  if ((isAuthOnly || isMarketing) && token) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

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
    "/",
    "/bootcamps/:path*",
    "/pretech-courses/:path*",
    "/free-learning/:path*",
    "/consultations",
  ],
};
