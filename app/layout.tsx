import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';

import './globals.css';
import { QueryProvider } from './providers/QueryProvider';
import ChatBot from '@/app/components/ai/ChatBot';

const inter = Inter({
   subsets: ['latin'],
});

export const metadata: Metadata = {
   metadataBase: new URL(
      process.env.NEXT_PUBLIC_APP_URL || 'https://eduraa.com'
   ),
   title: {
      default: 'Eduraa - Online Learning Platform | Expert-Led Courses',
      template: '%s | Eduraa',
   },
   description:
      'Eduraa is a leading online learning platform offering expert-led courses in programming, design, business, and more. Learn anytime, anywhere with certified instructors and interactive content.',
   keywords: [
      'online learning',
      'e-learning platform',
      'online courses',
      'programming courses',
      'web development',
      'design courses',
      'business courses',
      'certified instructors',
      'learn online',
      'education platform',
      'skill development',
      'professional training',
      'Eduraa',
   ],
   authors: [{ name: 'Eduraa Team' }],
   creator: 'Eduraa',
   publisher: 'Eduraa',
   formatDetection: {
      email: false,
      address: false,
      telephone: false,
   },
   openGraph: {
      title: 'Eduraa - Online Learning Platform | Expert-Led Courses',
      description:
         'Learn from expert instructors with Eduraa. Access thousands of courses in programming, design, business, and more. Start learning today!',
      siteName: 'Eduraa',
      images: [
         {
            url: '/og-image.jpg',
            width: 1200,
            height: 630,
            alt: 'Eduraa - Online Learning Platform',
         },
      ],
      locale: 'en_US',
      type: 'website',
   },
   robots: {
      index: true,
      follow: true,
      googleBot: {
         index: true,
         follow: true,
         'max-video-preview': -1,
         'max-image-preview': 'large',
         'max-snippet': -1,
      },
   },
};

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="en">
         <body
            className={`${inter.className} antialiased min-h-screen flex flex-col`}
         >
            <QueryProvider>
               <Toaster />
               <main className="grow">{children}</main>
               <ChatBot />
            </QueryProvider>
         </body>
      </html>
   );
}
