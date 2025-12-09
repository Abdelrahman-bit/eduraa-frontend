'use client';
import React from 'react';
import WishlistCard from '@/components/student/WishlistCard';

export default function WishlistPage() {
   const wishlistItems = [
      {
         id: 1,
         image: 'https://img-c.udemycdn.com/course/750x422/1565838_e54e_18.jpg',
         rating: 4.6,
         reviews: '451,444 Review',
         title: 'The Ultimate Drawing Course - Beginner to Advanced',
         instructor: 'Harry Potter',
         price: 37.0,
         originalPrice: 49.0,
      },
      {
         id: 2,
         image: 'https://img-c.udemycdn.com/course/750x422/394676_ce3d_5.jpg',
         rating: 4.8,
         reviews: '451,444 Review',
         title: 'Digital Marketing Masterclass - 23 Courses in 1',
         instructor: 'Nobody',
         price: 24.0,
         originalPrice: 80.0,
      },
      {
         id: 3,
         image: 'https://img-c.udemycdn.com/course/750x422/756150_c033_2.jpg',
         rating: 4.7,
         reviews: '451,444 Review',
         title: 'Angular - The Complete Guide (2021 Edition)',
         instructor: 'Kevin Gilbert',
         price: 13.0,
         originalPrice: 20.0,
      },
   ];

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
               {wishlistItems.map((item) => (
                  <WishlistCard key={item.id} {...item} />
               ))}
            </div>
         </div>
      </div>
   );
}
