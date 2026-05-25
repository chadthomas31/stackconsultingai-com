/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co' },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  async redirects() {
    return [
      { source: '/blog', destination: '/stack-report', permanent: true },
      { source: '/blog/:slug', destination: '/stack-report/:slug', permanent: true },
    ];
  },
};

module.exports = nextConfig;
