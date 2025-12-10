import { Course } from '@/app/(pages)/my-courses/page';
import Image from 'next/image';
import Link from 'next/link';

interface CourseCardProps {
   course: Course;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
   return (
      <Link
         href={`/my-courses/${course.id}`}
         className={`relative group flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 h-full`}
      >
         {/* Image Section */}
         <div className="relative h-48 overflow-hidden bg-gray-100">
            <Image
               src={course.image}
               alt={course.title}
               className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
               loading="lazy"
               fill
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
         </div>

         {/* Content Section */}
         <div className="flex flex-col grow p-5">
            <div className="mb-2">
               <h4 className="text-xs text-gray-500 font-medium mb-1 line-clamp-1">
                  {course.category}
               </h4>
               <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 min-h-10">
                  {course.title}
               </h3>
            </div>

            <div className="grow" />

            {/* Footer Section */}
            <div className="mt-4">
               {course.progress !== undefined && course.progress > 0 ? (
                  <div className="flex items-center justify-between gap-3">
                     <span className="flex-1 text-xs font-semibold py-2.5 px-4 rounded shadow-sm transition-colors text-center bg-orange-500 hover:bg-orange-600 text-white">
                        Continue Learning
                     </span>
                     <span className="text-xs font-semibold text-green-500 whitespace-nowrap">
                        {course.progress}% completed
                     </span>
                  </div>
               ) : (
                  <span className="block w-full text-xs font-semibold py-2.5 px-4 rounded shadow-sm transition-colors text-center bg-orange-50 hover:bg-orange-100 text-orange-600">
                     Start Learning
                  </span>
               )}
            </div>
         </div>
         {course.progress !== undefined && course.progress > 0 && (
            <div
               className="absolute bottom-0 left-0 h-1 bg-orange-500"
               style={{ width: `${course.progress}%` }}
            />
         )}
      </Link>
   );
};
