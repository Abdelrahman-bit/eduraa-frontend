import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
   images: {
      remotePatterns: [
         {
            protocol: 'https',
            hostname: 'images.unsplash.com',
         },
         {
            protocol: 'https',
            hostname: 'picsum.photos',
         },
         {
            protocol: 'https',
            hostname: 'source.unsplash.com',
         },
         {
            hostname: 'res.cloudinary.com',
         },
         {
            protocol: 'https',
            hostname: 'avatars.githubusercontent.com',
         },
         {
            protocol: 'https',
            hostname: 'ui-avatars.com',
         },
      ],
   },
};

export default nextConfig;
