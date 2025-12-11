'use client';
import React, { useEffect } from 'react';
import useBearStore from '@/app/store/useStore';
import Link from 'next/link';
import { IoMdHeart } from 'react-icons/io';
import CourseListCard from '@/app/components/all-courses/ui/CourseListCard';

export default function WishlistPage() {
   const { wishlist, removeFromWishlist, isCourseEnrolled, fetchWishlist } =
      useBearStore();

   useEffect(() => {
      fetchWishlist();
   }, []);

   return (
      <div className="space-y-8 pb-20">
         <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
               My Wishlist{' '}
               <span className="text-gray-500 font-medium ml-2">
                  ({wishlist.length})
               </span>
            </h1>
         </div>

         {wishlist.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
               {wishlist.map((course) => (
                  <div key={course.id} className="h-full">
                     <CourseListCard course={course as any} />
                  </div>
               ))}
            </div>
         ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
               <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                  <IoMdHeart className="w-8 h-8 text-gray-300" />
               </div>
               <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Your wishlist is empty
               </h3>
               <p className="text-gray-500 mb-6 text-center max-w-md">
                  Explore courses and save the ones you're interested in to
                  watch later.
               </p>
               <Link
                  href="/all-courses"
                  className="px-6 py-3 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition-colors"
               >
                  Browse Courses
               </Link>
            </div>
         )}
      </div>
   );
}
