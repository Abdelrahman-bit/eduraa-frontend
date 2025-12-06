'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link'; // Import Link for navigation
import { Star, User, MoreHorizontal } from 'lucide-react';

// Define the Course interface
export interface CourseType {
   id: string; // Unique ID is crucial for routing
   title: string;
   category: string;
   rating: number;
   students: number;
   price: number;
   originalPrice: number;
   image: string; // URL path for the image
}

interface CourseCardProps {
   course: CourseType;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
   const [isMenuOpen, setIsMenuOpen] = useState(false);
   const menuRef = useRef<HTMLDivElement>(null);

   // Close menu when clicking outside
   useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
         if (
            menuRef.current &&
            !menuRef.current.contains(event.target as Node)
         ) {
            setIsMenuOpen(false);
         }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
         document.removeEventListener('mousedown', handleClickOutside);
   }, []);

   return (
      <div className="bg-white border border-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 relative group">
         {/* Course Image */}
         <div className="relative h-48 w-full bg-gray-200">
            {/* Replace src with your actual image path or course.image */}
            <img
               src={course.image}
               alt={course.title}
               className="w-full h-full object-cover"
            />
            <span className="absolute top-3 left-3 bg-indigo-100 text-indigo-600 text-xs font-semibold px-2 py-1 rounded-sm uppercase tracking-wide">
               {course.category}
            </span>
         </div>

         {/* Card Content */}
         <div className="p-4">
            {/* Title */}
            <h3 className="text-gray-900 font-bold text-base mb-2 line-clamp-2 min-h-[3rem]">
               {course.title}
            </h3>

            {/* Rating & Students */}
            <div className="flex justify-between items-center mb-3 text-sm">
               <div className="flex items-center gap-1 text-orange-500 font-semibold">
                  <Star size={16} fill="currentColor" />
                  <span>{course.rating.toFixed(1)}</span>
               </div>
               <div className="flex items-center gap-1 text-gray-500">
                  <User size={16} />
                  <span>{course.students.toLocaleString()} students</span>
               </div>
            </div>

            <div className="border-t border-gray-100 pt-3 flex justify-between items-center relative">
               {/* Price */}
               <div>
                  <span className="text-orange-500 font-bold text-lg mr-2">
                     ${course.price.toFixed(2)}
                  </span>
                  <span className="text-gray-400 text-sm line-through">
                     ${course.originalPrice.toFixed(2)}
                  </span>
               </div>

               {/* Action Menu (3 Dots) */}
               <div className="relative" ref={menuRef}>
                  <button
                     onClick={() => setIsMenuOpen(!isMenuOpen)}
                     className={`p-1 rounded hover:bg-gray-100 transition-colors ${isMenuOpen ? 'bg-gray-100' : ''}`}
                  >
                     <MoreHorizontal size={20} className="text-gray-500" />
                  </button>

                  {/* Dropdown Menu */}
                  {isMenuOpen && (
                     <div className="absolute right-0 bottom-full mb-2 w-40 bg-white shadow-xl rounded-md border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-bottom-right">
                        <div className="flex flex-col text-sm">
                           {/* Pass the ID in the URL. 
                      Next.js will handle capturing this ID on the destination page.
                  */}
                           <Link
                              href={`/dashboard/instructor/courses/${course.id}`}
                              className="px-4 py-2.5 bg-orange-500 text-white font-medium hover:bg-orange-600 text-left"
                           >
                              View Details
                           </Link>
                           <button className="px-4 py-2.5 text-gray-700 hover:bg-gray-50 text-left transition-colors">
                              Edit Course
                           </button>
                           <button className="px-4 py-2.5 text-gray-700 hover:bg-gray-50 text-left transition-colors">
                              Delete Course
                           </button>
                        </div>
                     </div>
                  )}
               </div>
            </div>
         </div>
      </div>
   );
};
