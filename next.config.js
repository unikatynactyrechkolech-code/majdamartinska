/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    qualities: [75, 80],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'format.creatorcdn.com',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
