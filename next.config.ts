import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // حل تحذير تعدد ملفات الـ lockfile وربط المشروع بمجله الصحيح
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;