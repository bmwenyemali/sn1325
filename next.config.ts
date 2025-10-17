import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use a custom distDir to avoid Windows file locking issues on .next
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
};

export default nextConfig;
