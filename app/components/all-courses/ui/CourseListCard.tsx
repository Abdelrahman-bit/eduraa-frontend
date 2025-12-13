// components/CourseListCard.tsx
import { useState } from 'react';
import { Star, Clock, Loader2 } from 'lucide-react';
import { IoMdHeart, IoMdHeartEmpty } from 'react-icons/io';
import Link from 'next/link';
import { Course } from '@/app/services/courses';
import useBearStore from '@/app/store/useStore';
import toast from 'react-hot-toast';

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
   const {
      addToWishlist,
      removeFromWishlist,
      isCourseInWishlist,
      isCourseEnrolled,
      isAuthenticated,
      user,
   } = useBearStore();
   const [isWishlistLoading, setIsWishlistLoading] = useState(false);

   const isWishlisted = isCourseInWishlist(course._id);
   const isEnrolled = isCourseEnrolled(course._id);
   const isStudent = user?.role === 'student';

   const handleWishlistClick = async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (!isAuthenticated) {
         toast.error('Please login to manage wishlist');
         return;
      }

      setIsWishlistLoading(true);
      try {
         if (isWishlisted) {
            await removeFromWishlist(course._id);
            toast.success('Removed from wishlist successfully');
         } else {
            await addToWishlist(course._id);
            toast.success('Added to wishlist successfully');
         }
      } catch (error) {
         toast.error('Failed to update wishlist');
         console.error(error);
      } finally {
         setIsWishlistLoading(false);
      }
   };

   return (
      <Link
         href={`/all-courses/${course._id}`}
         className="group bg-white rounded-xl border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full relative"
      >
         {/* Image Container */}
         <div className="relative aspect-16/10 overflow-hidden bg-gray-100">
            <img
               src={course.advancedInfo.thumbnailUrl}
               alt={course.basicInfo.title}
               className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {isStudent && !isEnrolled && (
               <button
                  onClick={handleWishlistClick}
                  disabled={isWishlistLoading}
                  className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full transition-opacity hover:text-red-500 text-gray-400 z-10 disabled:cursor-not-allowed cursor-pointer"
               >
                  {isWishlistLoading ? (
                     <Loader2 className="w-5 h-5 animate-spin text-orange-500" />
                  ) : isWishlisted ? (
                     <IoMdHeart className="w-5 h-5 text-red-500" />
                  ) : (
                     <IoMdHeartEmpty className="w-5 h-5" />
                  )}
               </button>
            )}
         </div>

         {/* Content */}
         <div className="p-4 flex flex-col flex-1">
            <div className="flex items-center justify-between mb-3">
               <span
                  className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${getCategoryColor(course.basicInfo.category)}`}
               >
                  {course.basicInfo.category}
               </span>
            </div>

            <h3 className="font-bold text-gray-800 text-base leading-snug mb-2 line-clamp-2 group-hover:text-orange-500 transition-colors">
               {course.basicInfo.title}
            </h3>

            <p className="text-xs text-gray-500 mb-3 line-clamp-1">
               {course.basicInfo.subtitle}
            </p>

            <div className="flex items-center gap-2 mb-3">
               <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden relative">
                  {typeof course.instructor === 'object' &&
                  course.instructor?.avatar ? (
                     <img
                        src={course.instructor.avatar}
                        alt="Instructor"
                        className="w-full h-full object-cover"
                     />
                  ) : (
                     <div className="w-full h-full bg-gray-300 flex items-center justify-center text-[10px] text-gray-500">
                        {typeof course.instructor === 'object'
                           ? course.instructor.firstname?.[0]
                           : '?'}
                     </div>
                  )}
               </div>
               <span className="text-xs text-gray-600 font-medium truncate">
                  {typeof course.instructor === 'object'
                     ? `${course.instructor.firstname} ${course.instructor.lastname}`
                     : 'Instructor'}
               </span>
            </div>

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
      </Link>
   );
};

export default CourseListCard;
