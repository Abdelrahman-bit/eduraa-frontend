import Link from 'next/link';
import Image from 'next/image';
import Header from './components/global/Header/Header';
import { Metadata } from 'next';

export const metadata: Metadata = {
   title: '404 - Page Not Found',
   description: 'The page you are looking for does not exist.',
};
export default function NotFound() {
   return (
      <>
         <Header />
         <div className="min-h-screen flex flex-col items-center justify-center bg-white text-gray-800 font-sans section-boundary">
            <div className="container mx-auto px-4 py-16 flex flex-col-reverse lg:flex-row items-center justify-between gap-12">
               <div className="w-full lg:w-1/2 flex flex-col items-start space-y-6">
                  <h1 className="text-6xl md:text-8xl font-bold text-gray-100 absolute -z-10 -translate-y-16 select-none">
                     Error 404
                  </h1>

                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                     Oops! page not found
                  </h2>

                  <p className="text-gray-500 text-lg md:text-xl max-w-md leading-relaxed">
                     Something went wrong. It's look that your requested could
                     not be found. It's look like the link is broken or the page
                     is removed.
                  </p>

                  <Link
                     href="/"
                     className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded shadow-md transition-all duration-300"
                  >
                     Go Back
                  </Link>
               </div>

               <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
                  <div className="relative w-full max-w-lg h-auto aspect-video">
                     <Image
                        src="/notFound.png"
                        alt="404 Not Found Page"
                        width={600}
                        height={500}
                        className="object-contain"
                        priority
                     />
                  </div>
               </div>
            </div>
         </div>
      </>
   );
}
