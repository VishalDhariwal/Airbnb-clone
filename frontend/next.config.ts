import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for Docker: produces a self-contained Node.js server in .next/standalone
  output: "standalone",
};

export default nextConfig;
