import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';

import './globals.css';
import { QueryProvider } from './providers/QueryProvider';

const inter = Inter({
   subsets: ['latin'],
});

export const metadata: Metadata = {
   title: 'E-learning Platform',
   description: 'E-learning platform for students and teachers',
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
            </QueryProvider>
         </body>
      </html>
   );
}
