import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: {
    sources: (filename: string) => filename.includes("/app/"),
  },
};

export default nextConfig;
