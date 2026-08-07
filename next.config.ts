import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
