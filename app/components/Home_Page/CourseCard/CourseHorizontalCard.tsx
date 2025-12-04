import React from 'react';
import Image from 'next/image';
import { FaStar } from 'react-icons/fa';
import { LuUserRound } from 'react-icons/lu';
import { FiBarChart } from 'react-icons/fi';
import { CiClock2 } from 'react-icons/ci';

export default function CourseHorizontalCard() {
   return (
      <div
         className="flex flex-col md:flex-row w-full border border-gray-100 rounded-sm overflow-hidden bg-white 
             hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
      >
         <div className="relative w-full aspect-[4/3] md:w-[280px] md:aspect-auto md:h-auto shrink-0">
            <Image
               src="/course2.png"
               alt="Course Image"
               fill
               className="object-cover"
               sizes="(max-width: 768px) 100vw, 33vw"
            />
         </div>

         {/* Course Content - Flex-1 to occupy remaining space */}
         <div className="flex flex-col flex-1 p-4 md:p-6 justify-between gap-4">
            {/* Top Row: Category Badge & Price */}
            <div>
               <div className="flex justify-between items-start mb-2">
                  {/* Category Badge */}
                  <p className="text-xs py-1 px-2 bg-green-100 text-green-700 font-semibold uppercase rounded-sm">
                     HEALTH & FITNESS
                  </p>

                  {/* Price */}
                  <div className="flex gap-2 items-end">
                     <p className="text-xl font-bold text-gray-900">$14.00</p>
                     {/* Strikethrough price, lighter gray color */}
                     <p className="text-sm line-through font-normal text-gray-400">
                        $26.00
                     </p>
                  </div>
               </div>

               {/* Course Title - Added line-clamp-2 for safety */}
               <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                  Investing In Stocks The Complete Course! (13 H...)
               </h3>
            </div>

            {/* Instructor and Rating Row */}
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
               {/* Instructor Info */}
               <div className="flex gap-2 items-center">
                  <Image
                     src="/avatar.jpg"
                     alt="Instructor Image"
                     width={32}
                     height={32}
                     className="rounded-full object-cover shrink-0"
                  />
                  <p className="text-base font-medium text-gray-700">
                     Kevin Gilbert
                  </p>
               </div>

               {/* Rating (Pushed to the right) */}
               <div className="flex gap-1.5 items-center">
                  <FaStar size={18} className="text-orange-400" />
                  <p className="text-base font-bold text-gray-900">5.0</p>
                  <p className="text-sm font-normal text-gray-500">(357,914)</p>
               </div>
            </div>

            {/* Course Features / Statistics */}
            <div className="flex justify-between flex-wrap gap-4 pt-1">
               {/* Students */}
               <div className="flex gap-1.5 items-center">
                  <LuUserRound size={20} className="text-purple-600 shrink-0" />
                  <p className="text-sm font-medium text-gray-700">265.5K</p>
                  <p className="text-sm text-gray-500 hidden sm:block">
                     students
                  </p>
               </div>

               {/* Level */}
               <div className="flex gap-1.5 items-center">
                  <FiBarChart size={20} className="text-red-500 shrink-0" />
                  <p className="text-sm font-medium text-gray-700">Beginner</p>
               </div>

               {/* Duration */}
               <div className="flex gap-1.5 items-center">
                  <CiClock2 size={20} className="text-green-700 shrink-0" />
                  <p className="text-sm font-medium text-gray-700">6 Hours</p>
               </div>
            </div>
         </div>
      </div>
   );
}
