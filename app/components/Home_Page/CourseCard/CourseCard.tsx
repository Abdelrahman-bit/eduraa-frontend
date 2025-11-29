import React from 'react';
import Image from 'next/image';
import { FaStar } from 'react-icons/fa';
import { LuUserRound } from 'react-icons/lu';

import {
   HoverCard,
   HoverCardContent,
   HoverCardTrigger,
} from '@/components/ui/hover-card';
import CourseDetailsCard from './CourseDetailsCard';

export default function CourseCard({ displayIcon = false }) {
   return (
      <HoverCard>
         <HoverCardTrigger>
            <div
               className="bg-white flex flex-col gap-3.5 border border-gray-scale-100  hover:shadow-lg
        transition-all duration-300 
        hover:-translate-y-1 cursor-pointer"
            >
               <div>
                  <Image
                     src="/course.png"
                     alt="Course Image"
                     width={300}
                     height={183}
                  />
               </div>
               <div className="px-3.5 flex justify-between">
                  <p className="text-label-sm uppercase py-1 px-1.5 text-primary-700 bg-primary-100 font-medium">
                     Design
                  </p>
                  <p className="text-body-lg  text-primary-500 font-semibold ">
                     $57
                  </p>
               </div>
               <div className="px-3.5">
                  <p className="font-medium text-body-md text-gray-900">
                     Machine Learning A-Z™: Hands-On Python & R .
                  </p>
               </div>
               <div className="px-3.5 flex justify-between items-center pb-3 border-t border-gray-200 pt-3">
                  <div className="flex gap-1 items-center">
                     <FaStar size={16} className="text-primary-500" />
                     <p className="text-body-md font-medium text-gray-scale-700">
                        5.0
                     </p>
                  </div>
                  <div className="flex gap-1 items-center">
                     {displayIcon ? (
                        <LuUserRound size={20} className="text-secondary-500" />
                     ) : null}

                     <p className="text-body-md font-medium text-gray-scale-700">
                        265.7K
                     </p>
                     <p className="text-body-md font-normal text-gray-scale-500">
                        students
                     </p>
                  </div>
               </div>
            </div>
         </HoverCardTrigger>
         <HoverCardContent side="right" align="start" className="w-[430px]">
            <CourseDetailsCard />
         </HoverCardContent>
      </HoverCard>
   );
}
