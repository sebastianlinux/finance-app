import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuración para export estático
  output: 'export',
  // Generar rutas con trailing slash para mejor compatibilidad con S3
  trailingSlash: true,
  // Deshabilitar optimización de imágenes (requiere servidor)
  images: {
    unoptimized: true,
  },
  // Configuración para rutas estáticas
  distDir: 'out',
  // Permitir rutas dinámicas en client-side (no se pre-generan, funcionan como SPA)
  // Las rutas dinámicas como /blog/[id] funcionarán en client-side routing
};

export default nextConfig;
