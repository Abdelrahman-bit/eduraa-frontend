import React from 'react';
import { renderIcon } from '@/lib/iconRenderer';

type CardProps = {
   icon: string; // Changed from ReactNode to string (icon name)
   iconColor: string;
   backgroundColor: string;
   title: string;
   courseCount: number;
};

export default function CategoryCard({
   icon,
   iconColor,
   backgroundColor,
   title,
   courseCount,
}: CardProps) {
   return (
      <div
         className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 lg:p-5 w-full rounded-lg
         hover:shadow-lg
         transition-all duration-300 
         hover:-translate-y-1 cursor-pointer
         border border-transparent hover:border-gray-200"
         style={{ backgroundColor }}
      >
         <div
            className="p-2 sm:p-3 lg:p-4 bg-white shrink-0 rounded-md shadow-sm"
            style={{ color: iconColor }}
         >
            {renderIcon(icon, {
               size: 24,
               className: 'sm:w-7 sm:h-7 lg:w-8 lg:h-8',
            })}
         </div>

         <div className="min-w-0 flex-1">
            <p className="font-bold text-gray-900 text-sm sm:text-base lg:text-lg break-words">
               {title}
            </p>
            <p className="font-normal text-gray-600 text-xs sm:text-sm mt-0.5">
               {courseCount} Course{courseCount !== 1 ? 's' : ''}
            </p>
         </div>
      </div>
   );
}
