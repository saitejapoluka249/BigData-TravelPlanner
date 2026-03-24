import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Add this line to ensure Turbopack correctly resolves and transpiles the library
  transpilePackages: ['react-datepicker'],
};

export default nextConfig;