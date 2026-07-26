import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  allowedDevOrigins: ["192.168.1.130", "abdb-2605-59c1-182e-f908-7c5d-bc67-737c-2c01.ngrok-free.app"],
};

export default nextConfig;
