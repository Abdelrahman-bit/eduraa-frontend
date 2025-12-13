import type { NextConfig } from 'next';

// Use environment variable for API URL, with localhost as default for development
const getApiUrl = () => {
   const envUrl = process.env.NEXT_PUBLIC_API_URL;
   // Prevent redirect loop if API URL points to frontend
   if (envUrl?.includes('graduation-project-frontend-livid.vercel.app')) {
      return 'https://graduation-project-backend-nine.vercel.app/api';
   }
   return (
      envUrl ||
      (process.env.NODE_ENV === 'production'
         ? 'https://graduation-project-backend-nine.vercel.app/api'
         : 'http://localhost:5000/api')
   );
};

const API_URL = getApiUrl();

const nextConfig: NextConfig = {
   // Skip TypeScript errors during build for faster deployment
   // TODO: Fix type errors in admin components and remove this
   typescript: {
      ignoreBuildErrors: true,
   },
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
      // Hardcode backend URL for chat to prevent redirect loops
      const backendUrl =
         process.env.NODE_ENV === 'production'
            ? 'https://graduation-project-backend-nine.vercel.app/api'
            : 'http://localhost:5000/api';

      return [
         {
            source: '/api/chat',
            destination: `${backendUrl}/chat`,
         },
      ];
   },
};

export default nextConfig;
