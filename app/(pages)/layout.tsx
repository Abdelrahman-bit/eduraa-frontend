import Footer from '../components/global/Footer/Footer';
import Header from '../components/global/Header/Header';

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

         {children}

         <Footer />
      </>
   );
}
