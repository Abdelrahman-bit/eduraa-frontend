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
   title: 'Eduraa - E-learning Platform',
   description:
      'Eduraa is a leading e-learning platform connecting students and teachers worldwide.',
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
