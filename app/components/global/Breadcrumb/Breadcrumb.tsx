import Link from 'next/link';
import { MotionContainer, MotionItem } from '../Motion/Motion';

interface BreadcrumbHeaderProps {
   title: string;
   activePage: string;
   homeLabel?: string; // اختياري: لو حابب تغير كلمة Home
}

export const BreadcrumbHeader = ({
   title,
   activePage,
   homeLabel = 'Home',
}: BreadcrumbHeaderProps) => {
   return (
      <section className="bg-gray-scale-50  py-10">
         <MotionContainer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Title */}
            <MotionItem>
               <h1 className="text-3xl font-bold text-gray-900 mb-3 font-sans">
                  {title}
               </h1>
            </MotionItem>

            {/* Breadcrumb Navigation */}
            <MotionItem>
               <nav className="flex justify-center items-center text-sm text-gray-500 font-sans">
                  <Link
                     href="/"
                     className="hover:text-[#FF5A1F] transition-colors duration-200"
                  >
                     {homeLabel}
                  </Link>

                  <span className="mx-2 text-gray-400">/</span>

                  <span className="text-gray-900 font-medium">
                     {activePage}
                  </span>
               </nav>
            </MotionItem>
         </MotionContainer>
      </section>
   );
};
