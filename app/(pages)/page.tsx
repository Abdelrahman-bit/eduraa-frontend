import { Metadata } from 'next';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import Hero from '../components/Home_Page/Hero/Hero';
import CategorySection from '../components/Home_Page/CategorySection/CategorySection';
import CourseCardSkeleton from '../components/all-courses/ui/CourseCardSkeleton';
import CourseHorizontalCardSkeleton from '../components/Home_Page/CourseCard/CourseHorizontalCardSkeleton';

// Lazy load below-the-fold components
const BestSellingSection = dynamic(
   () =>
      import('../components/Home_Page/BestSellingSection/BestSellingSection'),
   { ssr: true }
);
const FeatureCoursesSection = dynamic(
   () =>
      import(
         '../components/Home_Page/FeatureCoursesSection/FeatureCoursesSection'
      ),
   { ssr: true }
);
const RecentlyAddedSection = dynamic(
   () =>
      import(
         '../components/Home_Page/RecentlyAddedSection/RecentlyAddedSection'
      ),
   { ssr: true }
);

export const metadata: Metadata = {
   title: 'Home',
   description:
      'Discover thousands of online courses on Eduraa. Learn programming, web development, design, business, and more from expert instructors. Start your learning journey today with interactive courses and certifications.',
   keywords: [
      'online courses',
      'learn programming',
      'web development courses',
      'design courses',
      'business training',
      'expert instructors',
      'online education',
      'skill development',
   ],
};

// Loading components for Suspense fallbacks
function BestSellingLoading() {
   return (
      <section className="py-20 bg-gray-50">
         <div className="flex flex-col gap-10 px-4 md:px-0">
            <h2 className="section-header text-center text-3xl font-bold text-gray-800">
               Best Selling Courses
            </h2>
            <div className="lg:w-[90%] mx-auto grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
               {[1, 2, 3, 4, 5].map((i) => (
                  <CourseCardSkeleton key={i} />
               ))}
            </div>
         </div>
      </section>
   );
}

function FeaturedLoading() {
   return (
      <section className="py-16 bg-gray-50">
         <div className="container mx-auto px-2 md:px-4 lg:px-8">
            <div className="flex flex-col gap-8 p-4 md:p-8 bg-white rounded-xl shadow-sm border border-gray-100">
               <div className="flex items-center justify-between">
                  <h2 className="section-header text-3xl font-bold text-gray-800">
                     Our Feature Courses
                  </h2>
               </div>
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                     <CourseHorizontalCardSkeleton key={i} />
                  ))}
               </div>
            </div>
         </div>
      </section>
   );
}

function RecentlyAddedLoading() {
   return (
      <section className="py-20">
         <div className="section-boundary flex flex-col gap-10 items-center">
            <h2 className="section-header text-center">
               Recently Added Courses
            </h2>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full px-4 md:px-0">
               {[1, 2, 3, 4].map((i) => (
                  <CourseCardSkeleton key={i} />
               ))}
            </div>
         </div>
      </section>
   );
}

export default function Home() {
   return (
      <>
         <Hero />
         <CategorySection />
         <Suspense fallback={<BestSellingLoading />}>
            <BestSellingSection />
         </Suspense>
         <Suspense fallback={<FeaturedLoading />}>
            <FeatureCoursesSection />
         </Suspense>
         <Suspense fallback={<RecentlyAddedLoading />}>
            <RecentlyAddedSection />
         </Suspense>
      </>
   );
}
