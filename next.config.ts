import type { NextConfig } from 'next';

// Use environment variable for API URL, with localhost as default for development
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

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
            protocol: 'https',
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
         {
            protocol: 'https',
            hostname: 'github.com',
         },
         {
            protocol: 'https',
            hostname: 'cdn.jsdelivr.net',
         },
      ],
   },
   async rewrites() {
      return [
         {
            source: '/api/chat',
            destination: `${API_URL}/chat`,
         },
      ];
   },
};

export default nextConfig;
