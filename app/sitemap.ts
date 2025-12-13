import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
   const baseUrl = 'https://eduraa.com';
   return [
      {
         url: baseUrl,
         lastModified: new Date(),
         changeFrequency: 'yearly',
         priority: 1,
      },
      {
         url: `${baseUrl}/instructors`,
         lastModified: new Date(),
         changeFrequency: 'monthly',
         priority: 0.8,
      },
      {
         url: `${baseUrl}/contact`,
         lastModified: new Date(),
         changeFrequency: 'yearly',
         priority: 0.5,
      },
      {
         url: `${baseUrl}/about`,
         lastModified: new Date(),
         changeFrequency: 'yearly',
         priority: 0.5,
      },
      {
         url: `${baseUrl}/career`,
         lastModified: new Date(),
         changeFrequency: 'monthly',
         priority: 0.5,
      },
   ];
}
