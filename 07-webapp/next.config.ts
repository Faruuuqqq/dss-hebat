import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Aplikasi sepenuhnya statis di sisi klien; tidak ada backend atau database.
  outputFileTracingRoot: process.cwd(),
};

export default nextConfig;
