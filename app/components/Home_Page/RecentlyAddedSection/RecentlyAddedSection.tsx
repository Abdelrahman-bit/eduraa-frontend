'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchPublishedCourses } from '@/app/services/courses';
import CourseListCard from '@/app/components/all-courses/ui/CourseListCard';
import Button from '../../global/Button/Button';
import Link from 'next/link';
import CourseCardSkeleton from '@/app/components/all-courses/ui/CourseCardSkeleton';

export default function RecentlyAddedSection() {
   const { data, isLoading } = useQuery({
      queryKey: ['recent-courses'],
      queryFn: () => fetchPublishedCourses({ limit: 4 }),
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
   });

   const courses = data?.data || [];

   // ... inside component ...

   if (isLoading) {
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

   if (courses.length === 0) return null;

   return (
      <section className="py-20">
         <div className="section-boundary flex flex-col gap-10 items-center">
            <h2 className="section-header text-center">
               Recently Added Courses
            </h2>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full px-4 md:px-0">
               {courses.map((course) => (
                  <CourseListCard key={course._id} course={course} />
               ))}
            </div>

            <Link href="/all-courses">
               <Button text="Browse All Courses -->" type="secondary" />
            </Link>
         </div>
      </section>
   );
}
