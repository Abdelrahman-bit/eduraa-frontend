import Footer from '../components/global/Footer/Footer';
import Header from '../components/global/Header/Header';
import { Toaster } from 'react-hot-toast';

export const metadata = {
   title: 'application layout',
};

export default function AuthLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <>
         <Header />
         <Toaster position="top-center" reverseOrder={false} />
         {children}

         <Footer />
      </>
   );
}
