import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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