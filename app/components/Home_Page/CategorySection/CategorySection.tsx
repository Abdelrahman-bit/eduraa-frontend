'use client';

import React from 'react';
import Link from 'next/link';
import CategoryCard from './CategoryCard';
import { useQuery } from '@tanstack/react-query';
import { fetchCategories } from '@/app/services/categories';
import { Loader2 } from 'lucide-react';

export default function CategorySection() {
   const {
      data: categories,
      isLoading,
      isError,
   } = useQuery({
      queryKey: ['public-categories'],
      queryFn: fetchCategories,
      staleTime: 30 * 60 * 1000, // 30 minutes
      gcTime: 60 * 60 * 1000, // 1 hour
   });

   if (isError) {
      return null; // Hide section on error
   }

   return (
      <section className="py-12 sm:py-16 md:py-20">
         <div className="section-boundary-lg mx-auto flex flex-col gap-8 sm:gap-10 px-4">
            <h2 className="section-header text-center text-2xl sm:text-3xl font-bold text-gray-800">
               Browse Top Categories
            </h2>

            {isLoading ? (
               <div className="flex justify-center items-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
               </div>
            ) : (
               <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                  {categories?.map((category) => (
                     <Link
                        key={category._id}
                        href={`/all-courses?category=${category.slug}`}
                        passHref
                        className="block"
                     >
                        <CategoryCard
                           icon={category.icon}
                           iconColor={category.iconColor}
                           backgroundColor={category.backgroundColor}
                           title={category.name}
                           courseCount={category.courseCount}
                        />
                     </Link>
                  ))}
               </div>
            )}

            {!isLoading && categories?.length === 0 && (
               <p className="text-center text-gray-500 py-12">
                  No categories available at the moment.
               </p>
            )}
         </div>
      </section>
   );
}
