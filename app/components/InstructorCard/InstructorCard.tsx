import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { FaStar } from 'react-icons/fa';
import { LuUserRound } from 'react-icons/lu';

type InstructorCardProps = {
   displayIcon?: boolean;
   instructorName: string;
   instructorPic: string;
   instructorSubject: string;
   instructorAvgRating: number;
   instructorStudentTotal: number;
};

export default function InstructorCard({
   displayIcon,
   instructorName,
   instructorPic,
   instructorSubject,
   instructorAvgRating,
   instructorStudentTotal,
}: InstructorCardProps) {
   return (
      <Link
         href="/instructors/id"
         className="bg-white flex flex-col gap-3.5 border border-gray-scale-100  
            hover:shadow-lg transition-all duration-300 
             hover:-translate-y-1 cursor-pointer"
      >
         <div>
            <Image
               src="/instructors/instructor-1.jpg"
               alt="Instructor"
               width={300}
               height={183}
            />
         </div>

         <div className="px-3.5 flex flex-col text-center">
            <p className="text-body-xl text-gray-scale-900 font-medium">
               Wade Warren
            </p>
            <p className="text-body-md text-gray-scale-500 font-normal">
               Digital Product Designer
            </p>
         </div>

         <div className="px-3.5 flex flex-col gap-3 pb-3 border-t border-gray-200 pt-3">
            <div className="flex justify-between w-full">
               <div className="flex items-center gap-1">
                  <FaStar size={16} className="text-primary-500" />
                  <p className="text-body-md font-medium text-gray-scale-700">
                     5.0
                  </p>
               </div>

               <div className="flex items-center gap-1">
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

            <div className="w-full py-2 bg-primary-100 text-primary-500 font-medium text-center hover:bg-primary-200 transition">
               View Instructor
            </div>
         </div>
      </Link>
   );
}
