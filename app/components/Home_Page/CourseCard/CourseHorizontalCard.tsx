import React from 'react';
import Image from 'next/image';
import { FaStar } from 'react-icons/fa';
import { LuUserRound } from 'react-icons/lu';
import { FiBarChart } from 'react-icons/fi';
import { CiClock2 } from 'react-icons/ci';

export default function CourseHorizontalCard() {
   return (
      <div
         className="flex gap-4  border border-gray-scale-100 items-center hover:shadow-lg
        transition-all duration-300 
        hover:-translate-y-1 cursor-pointer"
      >
         {/* Course thumbnail */}
         <div className="">
            <Image
               src="/course2.png"
               alt="Course Image"
               width={225}
               height={200}
               className="object-cover"
            />
         </div>
         {/* Course category &price */}
         <div className="flex flex-col justify-between gap-3 p-3">
            <div className="flex justify-between items-center">
               <p className="text-label-sm py-1 px-1.5 bg-success-100 text-success-700 font-medium uppercase">
                  Health & Fitness
               </p>
               <div className="flex gap-2 items-center">
                  <p className="text-body-xl font-medium text-gray-scale-900">
                     $14.00
                  </p>
                  <p className="text-sm line-through font-normal text-gray-scale-400">
                     $26.00
                  </p>
               </div>
            </div>
            {/* Course title */}
            <p className="text-md font-medium text-gray-scale-900">
               Investing In Stocks The Complete Course!
            </p>

            {/*Instractor Info */}
            <div className="flex justify-between items-center border-b pb-2 border-gray-scale-100">
               <div className="flex gap-2 items-center">
                  <Image
                     src="/avatar.jpg"
                     alt="Instructor Image"
                     width={28}
                     height={28}
                     className="rounded-full"
                  />
                  <p className="text-sm font-medium text-gray-scale-700">
                     Kevin Gilbert
                  </p>
               </div>

               <div className="flex gap-1 items-center">
                  <FaStar size={16} className="text-primary-500" />
                  <p className="text-md font-medium text-gray-scale-900">5.0</p>
                  <p className="text-sm font-medium text-gray-scale-500">
                     (357,914)
                  </p>
               </div>
            </div>
            {/*Course features */}
            <div className="flex justify-between gap-4   ">
               <div className="flex gap-1 items-center">
                  <LuUserRound size={20} className="text-secondary-500" />
                  <p className="text-sm font-medium text-gray-scale-700">
                     265.5K
                  </p>
                  <p className="text-sm  text-gray-scale-500">students</p>
               </div>
               <div className="flex gap-1 items-center">
                  <FiBarChart size={20} className="text-danger-500" />
                  <p className="text-sm  text-gray-scale-500">Beginner</p>
               </div>
               <div className="flex gap-1 items-center">
                  <CiClock2 size={20} className="text-success-700" />
                  <p className="text-sm  text-gray-scale-500">6 Hours</p>
               </div>
            </div>
         </div>
      </div>
   );
}
