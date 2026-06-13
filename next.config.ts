import type { NextConfig } from "next";

export default {
  reactCompiler: true,
  cacheComponents: true,
  allowedDevOrigins: ["*.trycloudflare.com"],
} satisfies NextConfig;
