import { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Warning: This allows production builds to successfully complete even if
    // your project has TypeScript errors.
    ignoreBuildErrors: true,
  },
  // NOTA: Los rewrites ya no son necesarios porque ahora usamos API routes que actúan como proxy
  // Las API routes manejan la autenticación y hacen requests al backend directamente
};

export default nextConfig;