import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next.js only loads images from domains you allow here (for security).
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