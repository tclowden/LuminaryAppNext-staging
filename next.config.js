/** @type {import('next').NextConfig} */
const nextConfig = {
   webpack(config) {
      config.module.rules.push({
         test: /\.svg$/,
         use: ['@svgr/webpack'],
      });

      // I just can't take all these warnings anymore:
      // Critical dependency: the request of a dependency is an expression
      config.module.exprContextCritical = false

      return config;
   },
   eslint: {
      // Warning: This allows production builds to successfully complete even if
      // your project has ESLint errors.
      ignoreDuringBuilds: true,
   },
   images: {
      remotePatterns: [
         {
            protocol: 'https',
            hostname: '**',
            // port: '',
            // pathname: '/**',
         },
      ],
   },
   reactStrictMode: false,
   experimental: {
      serverActions: true,
      serverComponentsExternalPackages: ['sequelize'],
      instrumentationHook: true,
   },
   images: {
      domains: ['storage.googleapis.com', 'maps.google.com', 'static.wixstatic.com'],
   },
   async rewrites() {
      return [
         { source: '/dbapi/:path*', destination: 'http://localhost:8010/api/v1/:path*' },
         { source: '/create-password', destination: '/reset-password' },
      ];
   },
};

module.exports = nextConfig;
