// types/next-pwa.d.ts
declare module "next-pwa" {
  import type { NextConfig } from "next";

  export interface PWAOptions {
    dest: string;
    register?: boolean;
    skipWaiting?: boolean;
    disable?: boolean;
    swSrc?: string;
    buildExcludes?: string[];
    // You can add more options if needed
  }

  function withPWA(options: PWAOptions): (nextConfig: NextConfig) => NextConfig;

  export default withPWA;
}
