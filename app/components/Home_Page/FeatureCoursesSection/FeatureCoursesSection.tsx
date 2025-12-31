'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchPublishedCourses } from '@/app/services/courses';
import CourseHorizontalCard from '../CourseCard/CourseHorizontalCard';
import CourseHorizontalCardSkeleton from '../CourseCard/CourseHorizontalCardSkeleton';

export default function FeatureCoursesSection() {
   const { data, isLoading, isError } = useQuery({
      queryKey: ['featured-courses'],
      queryFn: () => fetchPublishedCourses({ limit: 4 }),
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
   });

   const courses = data?.data || [];

   if (isLoading) {
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

   if (isError || courses.length === 0) {
      return null; // Hide section if error or no courses
   }

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
                  {courses.map((course) => (
                     <CourseHorizontalCard key={course._id} course={course} />
                  ))}
               </div>
            </div>
         </div>
      </section>
   );
}
