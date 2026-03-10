import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["vapourizable-unlaudably-lauran.ngrok-free.dev", "*.ngrok-free.dev", "localhost:3000"]
    }
  },
  // @ts-ignore - Some versions of Next.js use this property for ngrok/dev-server origins
  allowedDevOrigins: ["vapourizable-unlaudably-lauran.ngrok-free.dev"]
};

export default nextConfig;
