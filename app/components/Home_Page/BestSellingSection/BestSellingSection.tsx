'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchPublishedCourses } from '@/app/services/courses';
import CourseListCard from '@/app/components/all-courses/ui/CourseListCard';
import CourseCardSkeleton from '@/app/components/all-courses/ui/CourseCardSkeleton';

export default function BestSellingSection() {
   const { data, isLoading } = useQuery({
      queryKey: ['best-selling-courses'],
      queryFn: () => fetchPublishedCourses({ limit: 20 }), // Fetch enough to sort
   });

   // Sort by price desc (just as a proxy for "best selling" or "premium")
   const courses = (data?.data || [])
      .sort((a, b) => b.price.amount - a.price.amount)
      .slice(0, 5);

   // ... inside component ...

   if (isLoading) {
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

   if (courses.length === 0) return null;

   return (
      <section className="py-20 bg-gray-50">
         <div className="flex flex-col gap-10 px-4 md:px-0">
            <h2 className="section-header text-center text-3xl font-bold text-gray-800">
               Best Selling Courses
            </h2>

            <div className="lg:w-[90%] mx-auto grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
               {courses.map((course) => (
                  <CourseListCard key={course._id} course={course} />
               ))}
            </div>
         </div>
      </section>
   );
}
