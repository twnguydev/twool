// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Désactiver l'exportation statique pour le développement
  // Nous l'utiliserons uniquement pour la production
  ...(process.env.NODE_ENV === 'production' ? { output: 'export' } : {}),
  
  // Configuration des images non optimisées (nécessaire pour l'export statique)
  images: {
    unoptimized: true
  },
  
  // Configuration webpack pour Electron
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Ignorer les modules spécifiques à Node.js dans le build client
      config.resolve.fallback = {
        fs: false,
        path: false,
        module: false,
      };
    }
    return config;
  }
};

module.exports = nextConfig;