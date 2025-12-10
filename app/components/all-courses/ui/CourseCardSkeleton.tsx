export default function CourseCardSkeleton() {
   return (
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
         {/* Image Skeleton with shimmer effect */}
         <div className="relative w-full aspect-video bg-gray-200 overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-white/60 to-transparent" />
         </div>

         <div className="p-5">
            {/* Category Badge Skeleton */}
            <div className="relative h-5 w-24 bg-gray-200 rounded-full mb-3 overflow-hidden">
               <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-white/60 to-transparent" />
            </div>

            {/* Title Skeleton */}
            <div className="space-y-2 mb-3">
               <div className="relative h-5 bg-gray-200 rounded w-full overflow-hidden">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-white/60 to-transparent" />
               </div>
               <div className="relative h-5 bg-gray-200 rounded w-3/4 overflow-hidden">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-white/60 to-transparent" />
               </div>
            </div>

            {/* Meta Info Skeleton */}
            <div className="flex items-center gap-4 mb-4">
               <div className="relative h-4 w-16 bg-gray-200 rounded overflow-hidden">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-white/60 to-transparent" />
               </div>
               <div className="relative h-4 w-20 bg-gray-200 rounded overflow-hidden">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-white/60 to-transparent" />
               </div>
            </div>

            {/* Instructor Skeleton */}
            <div className="flex items-center gap-2 mb-4">
               <div className="relative w-6 h-6 rounded-full bg-gray-200 overflow-hidden">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-white/60 to-transparent" />
               </div>
               <div className="relative h-4 w-24 bg-gray-200 rounded overflow-hidden">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-white/60 to-transparent" />
               </div>
            </div>

            {/* Price Skeleton */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
               <div className="relative h-6 w-20 bg-gray-200 rounded overflow-hidden">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-white/60 to-transparent" />
               </div>
               <div className="relative h-9 w-24 bg-gray-200 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-white/60 to-transparent" />
               </div>
            </div>
         </div>
      </div>
   );
}
