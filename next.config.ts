import { PHASE_PRODUCTION_BUILD } from "next/constants";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PHASE:
      process.env.NODE_ENV === "production" ? PHASE_PRODUCTION_BUILD : "",
  },
};

export default nextConfig;
