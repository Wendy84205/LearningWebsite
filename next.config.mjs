/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@prisma/client', 'better-sqlite3'],
  async redirects() {
    return [
      {
        source: '/nursery-landing',
        destination: '/learning/lop-1',
        permanent: true,
      },
      {
        source: '/nursery-map',
        destination: '/learning/lop-1/map',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
