import React from 'react';

export default function CourseHorizontalCardSkeleton() {
   return (
      <div className="flex flex-col md:flex-row w-full border border-gray-100 rounded-lg overflow-hidden bg-white h-full">
         {/* Image Skeleton */}
         <div className="relative w-full aspect-4/3 md:w-[240px] md:aspect-auto shrink-0 bg-gray-200 overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-white/60 to-transparent" />
         </div>

         {/* Content Skeleton */}
         <div className="flex flex-col flex-1 p-4 md:p-5 justify-between gap-3">
            <div>
               {/* Top Row: Badge & Price */}
               <div className="flex justify-between items-start mb-2">
                  <div className="h-5 w-24 bg-gray-200 rounded overflow-hidden relative">
                     <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-white/60 to-transparent" />
                  </div>
                  <div className="h-6 w-16 bg-gray-200 rounded overflow-hidden relative">
                     <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-white/60 to-transparent" />
                  </div>
               </div>

               {/* Title */}
               <div className="space-y-2 mb-2">
                  <div className="h-5 bg-gray-200 rounded w-full overflow-hidden relative">
                     <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-white/60 to-transparent" />
                  </div>
                  <div className="h-5 bg-gray-200 rounded w-3/4 overflow-hidden relative">
                     <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-white/60 to-transparent" />
                  </div>
               </div>
            </div>

            {/* Instructor */}
            <div className="flex items-center gap-2">
               <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden relative">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-white/60 to-transparent" />
               </div>
               <div className="h-4 w-32 bg-gray-200 rounded overflow-hidden relative">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-white/60 to-transparent" />
               </div>
            </div>

            {/* Bottom Row: Stats */}
            <div className="flex items-center justify-between border-t border-gray-50 pt-3 mt-1">
               <div className="h-4 w-16 bg-gray-200 rounded overflow-hidden relative">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-white/60 to-transparent" />
               </div>
               <div className="h-4 w-16 bg-gray-200 rounded overflow-hidden relative hidden sm:block">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-white/60 to-transparent" />
               </div>
               <div className="h-4 w-16 bg-gray-200 rounded overflow-hidden relative">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-white/60 to-transparent" />
               </div>
            </div>
         </div>
      </div>
   );
}
