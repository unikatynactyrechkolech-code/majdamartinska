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
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'vyzvednifotky.majdamartinska.com',
        pathname: '/**',
      },
    ],
  },
  // Allow larger payloads for image uploads via Server Actions
  experimental: {
    serverActions: {
      bodySizeLimit: '12mb',
    },
  },
};

module.exports = nextConfig;
