'use client';
import React, { useState, useEffect } from 'react';
import WishlistCard from '@/app/components/student/WishlistCard';
import {
   getWishlist,
   WishlistItem,
   removeFromWishlist,
} from '@/app/services/studentService';
import toast from 'react-hot-toast';

export default function WishlistPage() {
   const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      fetchWishlist();
   }, []);

   const fetchWishlist = async () => {
      try {
         setIsLoading(true);
         const data = await getWishlist();
         setWishlistItems(data);
      } catch (error) {
         console.error('Failed to fetch wishlist', error);
         toast.error('Failed to load wishlist');
      } finally {
         setIsLoading(false);
      }
   };

   const handleRemove = async (courseId: string | number) => {
      // Convert to string safely
      const idStr = String(courseId);
      try {
         await removeFromWishlist(idStr);
         setWishlistItems((prev) =>
            prev.filter((item) => item.course._id !== idStr)
         );
         toast.success('Removed from wishlist');
      } catch (error) {
         console.error('Failed to remove from wishlist', error);
         toast.error('Failed to remove item');
      }
   };

   if (isLoading) {
      return (
         <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
         </div>
      );
   }

   return (
      <div className="space-y-6">
         <h1 className="text-2xl font-bold text-gray-900">
            Wishlist{' '}
            <span className="text-gray-500 font-medium">
               ({wishlistItems.length})
            </span>
         </h1>

         <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="hidden md:flex justify-between items-center px-6 py-4 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
               <div className="flex-1">Course</div>
            </div>

            <div className="divide-y divide-gray-100">
               {wishlistItems.length > 0 ? (
                  wishlistItems.map((item) => (
                     <WishlistCard
                        key={item._id}
                        id={item.course._id}
                        image={
                           item.course.advancedInfo?.thumbnailUrl ||
                           'https://via.placeholder.com/300'
                        }
                        title={item.course.basicInfo.title}
                        rating={0}
                        reviews="0 Reviews"
                        instructor={`${item.course.instructor.firstname} ${item.course.instructor.lastname}`}
                        price={item.course.basicInfo.price}
                        originalPrice={item.course.basicInfo.price}
                        onRemove={handleRemove}
                     />
                  ))
               ) : (
                  <div className="text-center py-10 text-gray-500">
                     Your wishlist is empty.
                  </div>
               )}
            </div>
         </div>
      </div>
   );
}
