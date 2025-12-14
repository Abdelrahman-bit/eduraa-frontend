import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
   // Use environment variable for production URL or fallback to localhost
   const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

   return [
      {
         url: baseUrl,
         lastModified: new Date(),
         changeFrequency: 'daily',
         priority: 1,
      },
      {
         url: `${baseUrl}/all-courses`,
         lastModified: new Date(),
         changeFrequency: 'daily',
         priority: 0.9,
      },
      {
         url: `${baseUrl}/about`,
         lastModified: new Date(),
         changeFrequency: 'monthly',
         priority: 0.8,
      },
      {
         url: `${baseUrl}/contact`,
         lastModified: new Date(),
         changeFrequency: 'monthly',
         priority: 0.7,
      },
      {
         url: `${baseUrl}/become_an_instructor`,
         lastModified: new Date(),
         changeFrequency: 'monthly',
         priority: 0.8,
      },
      {
         url: `${baseUrl}/career`,
         lastModified: new Date(),
         changeFrequency: 'monthly',
         priority: 0.6,
      },
      {
         url: `${baseUrl}/auth/login`,
         lastModified: new Date(),
         changeFrequency: 'monthly',
         priority: 0.5,
      },
      {
         url: `${baseUrl}/auth/signup`,
         lastModified: new Date(),
         changeFrequency: 'monthly',
         priority: 0.5,
      },
   ];
}
