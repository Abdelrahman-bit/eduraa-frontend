'use client';
import Footer from '../components/global/Footer/Footer';
import Header from '../components/global/Header/Header';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';

export default function AuthLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   useEffect(() => {
      const token = localStorage.getItem('token');
      console.log('token from local storage', token);
   }, []);
   return (
      <>
         <Header />
         <Toaster position="top-center" reverseOrder={false} />
         {children}

         <Footer />
      </>
   );
}
