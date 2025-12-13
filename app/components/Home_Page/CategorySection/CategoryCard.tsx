import React from 'react';

type CardProps = {
   icon: React.ReactNode;
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
         className="flex items-center gap-4 p-2 py-3 lg:p-5 w-full rounded-lg
         hover:shadow-lg
         transition-all duration-300 
         hover:-translate-y-1 cursor-pointer"
         style={{ backgroundColor }}
      >
         <div
            className="p-2 lg:p-5 bg-white shrink-0 rounded-md"
            style={{ color: iconColor }}
         >
            {icon}
         </div>

         <div className="min-w-0">
            <p className="font-bold text-gray-scale-900 text-body-md truncate">
               {title}
            </p>
            <p className="font-normal text-gray-scale-500 text-body-md">
               {courseCount} Courses
            </p>
         </div>
      </div>
   );
}
