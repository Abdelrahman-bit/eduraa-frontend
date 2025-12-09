import React from 'react';
import Link from 'next/link';

export interface CourseProps {
   id: string | number;
   title: string;
   category: string;
   image: string;
   progress: number;
}

const CourseCard = ({ title, category, image, progress, id }: CourseProps) => {
   return (
      <div className="bg-white border border-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
         <div className="relative h-40 w-full bg-gray-200">
            <img
               src={image}
               alt={title}
               className="w-full h-full object-cover"
            />
         </div>

         <div className="p-4 flex flex-col flex-1 justify-between">
            <div>
               <span className="text-xs font-medium text-gray-500 block mb-1 truncate">
                  {category}
               </span>
               <h3 className="text-base font-bold text-gray-900 line-clamp-2 mb-4">
                  {title}
               </h3>
            </div>

            <div className="border-t border-gray-100 pt-4 flex items-center justify-between mt-auto">
               <Link
                  href={`/student/courses/${id}`}
                  className="bg-[#FFEEE8] text-[#FF6636] text-sm font-semibold py-2 px-4 rounded hover:bg-[#FF6636] hover:text-white transition-colors"
               >
                  Watch Lecture
               </Link>

               <span className="text-xs font-semibold text-green-500">
                  {progress}% Completed
               </span>
            </div>
         </div>
      </div>
   );
};

export default CourseCard;
