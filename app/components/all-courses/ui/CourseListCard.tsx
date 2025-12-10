// components/CourseCard.jsx
import { Star, Clock } from 'lucide-react';
import { Course } from '@/app/services/courses';

const getCategoryColor = (category: string) => {
   const colors: Record<string, string> = {
      'Web Development': 'text-blue-500 bg-blue-50',
      'Mobile Development': 'text-purple-500 bg-purple-50',
      Backend: 'text-green-500 bg-green-50',
      AI: 'text-pink-500 bg-pink-50',
      Design: 'text-orange-500 bg-orange-50',
   };
   return colors[category] || 'text-gray-500 bg-gray-50';
};

const getLevelLabel = (level: string) => {
   const labels: Record<string, string> = {
      'all-levels': 'All Levels',
      beginner: 'Beginner',
      intermediate: 'Intermediate',
      expert: 'Expert',
   };
   return labels[level] || level;
};

const CourseListCard = ({ course }: { course: Course }) => {
   return (
      <div className="group bg-white rounded-xl border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full">
         {/* Image Container */}
         <div className="relative aspect-16/10 overflow-hidden bg-gray-100">
            <img
               src={course.advancedInfo.thumbnailUrl}
               alt={course.basicInfo.title}
               className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <button className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:text-orange-500 text-gray-400">
               <Star className="w-4 h-4" />
            </button>
         </div>

         {/* Content */}
         <div className="p-4 flex flex-col flex-1">
            <div className="flex items-center justify-between mb-3">
               <span
                  className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${getCategoryColor(course.basicInfo.category)}`}
               >
                  {course.basicInfo.category}
               </span>
               <span className="font-bold text-lg text-orange-500">
                  ${course.price.amount}
               </span>
            </div>

            <h3 className="font-bold text-gray-800 text-base leading-snug mb-2 line-clamp-2 group-hover:text-orange-500 transition-colors">
               {course.basicInfo.title}
            </h3>

            <p className="text-xs text-gray-500 mb-3 line-clamp-1">
               {course.basicInfo.subtitle}
            </p>

            <div className="mt-auto flex items-center justify-between border-t border-gray-50 pt-4">
               <div className="flex items-center gap-1.5 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs font-medium">
                     {course.basicInfo.durationValue}{' '}
                     {course.basicInfo.durationUnit}
                  </span>
               </div>
               <div className="text-xs font-medium text-gray-500">
                  {getLevelLabel(course.basicInfo.level)}
               </div>
            </div>
         </div>
      </div>
   );
};

export default CourseListCard;
