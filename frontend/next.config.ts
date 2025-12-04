import type { NextConfig } from "next";

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
  async rewrites() {
    return [
      {
        source: '/api/categorias/:path*',
        destination: 'https://api.cubells.com.ar/stock/categorias/:path*',
      },
      {
        source: '/api/productos/:path*',
        destination: 'https://api.cubells.com.ar/stock/productos/:path*',
      },
      {
        source: '/api/reservas/:path*',
        destination: 'https://api.cubells.com.ar/stock/reservas/:path*',
      },
    ]
  },
};

export default nextConfig;