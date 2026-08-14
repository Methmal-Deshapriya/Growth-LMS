import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    const apiOrigin = (() => {
      try {
        return new URL(process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000").origin;
      } catch {
        return "http://localhost:5000";
      }
    })();
    const contentSecurityPolicy = [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'none'",
      "form-action 'self'",
      `connect-src 'self' ${apiOrigin}`,
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      "style-src 'self' 'unsafe-inline'",
      process.env.NODE_ENV === "production"
        ? "script-src 'self' 'unsafe-inline'"
        : "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    ].join("; ");
    const securityHeaders = [
      { key: "Content-Security-Policy", value: contentSecurityPolicy },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      ...(process.env.NODE_ENV === "production"
        ? [{ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" }]
        : []),
    ];
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    return [
      { source: "/it-bootcamps", destination: "/bootcamps", permanent: true },
      { source: "/it-bootcamps/:path*", destination: "/bootcamps/:path*", permanent: true },
      { source: "/contributions", destination: "/free-learning", permanent: true },
      { source: "/contributions/:path*", destination: "/free-learning/:path*", permanent: true },
      { source: "/admin/bootcamps", destination: "/admin/catalog/courses", permanent: false },
      { source: "/admin/bootcamps/:path*", destination: "/admin/catalog/courses/:path*", permanent: false },
    ];
  },
};

export default nextConfig;
