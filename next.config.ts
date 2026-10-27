import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // The route badge sits on top of controls (welcome dots, tab bar) in every corner. Errors still show.
  devIndicators: false,
};

export default nextConfig;
