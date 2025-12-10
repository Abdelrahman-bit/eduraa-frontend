export default function CourseDetailsSkeleton() {
   const SkeletonBox = ({ className }: { className: string }) => (
      <div className={`relative bg-gray-200 overflow-hidden ${className}`}>
         <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-white/60 to-transparent" />
      </div>
   );

   return (
      <div className="min-h-screen bg-white font-sans text-slate-800 pb-20">
         {/* Breadcrumb Skeleton */}
         <div className="bg-gray-50 py-4 border-b border-gray-100">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8 flex items-center gap-2">
               <SkeletonBox className="h-4 w-12 rounded" />
               <SkeletonBox className="h-4 w-4 rounded" />
               <SkeletonBox className="h-4 w-16 rounded" />
               <SkeletonBox className="h-4 w-4 rounded" />
               <SkeletonBox className="h-4 w-24 rounded" />
               <SkeletonBox className="h-4 w-4 rounded" />
               <SkeletonBox className="h-4 w-32 rounded" />
            </div>
         </div>

         <div className="max-w-[1400px] mx-auto px-4 md:px-8 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left Column */}
            <div className="lg:col-span-8">
               {/* Title Skeleton */}
               <div className="space-y-3 mb-6">
                  <SkeletonBox className="h-10 rounded w-full" />
                  <SkeletonBox className="h-10 rounded w-3/4" />
               </div>

               {/* Subtitle Skeleton */}
               <SkeletonBox className="h-6 rounded w-2/3 mb-6" />

               {/* Instructor & Level Skeleton */}
               <div className="flex items-center gap-6 mb-8">
                  <div className="flex items-center gap-3">
                     <SkeletonBox className="w-10 h-10 rounded-full" />
                     <div className="space-y-2">
                        <SkeletonBox className="h-3 w-16 rounded" />
                        <SkeletonBox className="h-4 w-24 rounded" />
                     </div>
                  </div>
                  <div className="flex items-center gap-2">
                     <SkeletonBox className="w-5 h-5 rounded" />
                     <SkeletonBox className="h-4 w-20 rounded" />
                  </div>
               </div>

               {/* Video Skeleton */}
               <SkeletonBox className="relative w-full aspect-video rounded-2xl mb-8" />

               {/* Tabs Skeleton */}
               <div className="border-b border-gray-200 mb-8">
                  <div className="flex gap-8 pb-3">
                     {[1, 2, 3, 4].map((i) => (
                        <SkeletonBox key={i} className="h-6 w-24 rounded" />
                     ))}
                  </div>
               </div>

               {/* Content Skeleton */}
               <div className="space-y-8">
                  {/* Description Section */}
                  <div>
                     <SkeletonBox className="h-8 w-32 rounded mb-4" />
                     <div className="space-y-3">
                        <SkeletonBox className="h-4 rounded w-full" />
                        <SkeletonBox className="h-4 rounded w-full" />
                        <SkeletonBox className="h-4 rounded w-5/6" />
                        <SkeletonBox className="h-4 rounded w-full" />
                        <SkeletonBox className="h-4 rounded w-4/5" />
                     </div>
                  </div>

                  {/* What you will learn Skeleton */}
                  <div className="bg-gray-100 rounded-2xl p-8">
                     <SkeletonBox className="h-6 w-64 rounded mb-6" />
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                           <div key={i} className="flex items-start gap-3">
                              <SkeletonBox className="w-5 h-5 rounded-full shrink-0 mt-0.5" />
                              <SkeletonBox className="h-4 rounded flex-1" />
                           </div>
                        ))}
                     </div>
                  </div>

                  {/* Requirements Section */}
                  <div>
                     <SkeletonBox className="h-6 w-32 rounded mb-4" />
                     <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                           <div key={i} className="flex items-start gap-3">
                              <SkeletonBox className="w-2 h-2 rounded-full mt-2" />
                              <SkeletonBox className="h-4 rounded flex-1" />
                           </div>
                        ))}
                     </div>
                  </div>

                  {/* Target Audience Section */}
                  <div>
                     <SkeletonBox className="h-6 w-48 rounded mb-4" />
                     <div className="space-y-3">
                        {[1, 2].map((i) => (
                           <div key={i} className="flex items-start gap-3">
                              <SkeletonBox className="w-2 h-2 rounded-full mt-2" />
                              <SkeletonBox className="h-4 rounded flex-1" />
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>

            {/* Right Column - Sidebar Skeleton */}
            <div className="lg:col-span-4">
               <div className="sticky top-24 bg-white border border-gray-100 rounded-2xl shadow-sm p-6 md:p-8">
                  {/* Price Skeleton */}
                  <SkeletonBox className="h-10 w-32 rounded mb-6" />

                  {/* Meta Info Skeleton */}
                  <div className="space-y-4 mb-8">
                     {[1, 2, 3, 4].map((i) => (
                        <div
                           key={i}
                           className="flex items-center justify-between"
                        >
                           <div className="flex items-center gap-3">
                              <SkeletonBox className="w-4 h-4 rounded" />
                              <SkeletonBox className="h-4 w-28 rounded" />
                           </div>
                           <SkeletonBox className="h-4 w-20 rounded" />
                        </div>
                     ))}
                  </div>

                  {/* Buttons Skeleton */}
                  <div className="space-y-3 mb-6">
                     <SkeletonBox className="h-12 rounded-lg w-full" />
                     <SkeletonBox className="h-12 rounded-lg w-full" />
                  </div>

                  {/* Actions Skeleton */}
                  <div className="flex items-center justify-between mb-8 px-2">
                     <div className="flex items-center gap-2">
                        <SkeletonBox className="w-4 h-4 rounded" />
                        <SkeletonBox className="h-4 w-24 rounded" />
                     </div>
                     <div className="flex items-center gap-2">
                        <SkeletonBox className="w-4 h-4 rounded" />
                        <SkeletonBox className="h-4 w-20 rounded" />
                     </div>
                  </div>

                  {/* Includes List Skeleton */}
                  <div className="border-t border-gray-100 pt-6">
                     <SkeletonBox className="h-5 w-40 rounded mb-4" />
                     <div className="space-y-3">
                        {[1, 2, 3, 4].map((i) => (
                           <div key={i} className="flex items-center gap-3">
                              <SkeletonBox className="w-4 h-4 rounded" />
                              <SkeletonBox className="h-4 rounded flex-1" />
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
