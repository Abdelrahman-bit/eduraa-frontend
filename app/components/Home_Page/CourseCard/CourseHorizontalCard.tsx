import React from 'react';
import Image from 'next/image';
import { FaStar } from 'react-icons/fa';
import { FiBarChart } from 'react-icons/fi';
import { CiClock2 } from 'react-icons/ci';
import Link from 'next/link';
import { Course } from '@/app/services/courses';
import { getOptimizedCloudinaryUrl, CloudinaryPresets } from '@/lib/cloudinary';

interface CourseHorizontalCardProps {
   course: Course;
}

export default function CourseHorizontalCard({
   course,
}: CourseHorizontalCardProps) {
   const { basicInfo, advancedInfo, price, instructor, _id } = course;
   const instructorName =
      typeof instructor === 'object'
         ? `${instructor.firstname} ${instructor.lastname}`
         : 'Instructor';
   const instructorAvatar =
      typeof instructor === 'object' ? instructor.avatar : null;

   return (
      <Link href={`/all-courses/${_id}`} className="block w-full">
         <div
            className="flex flex-col md:flex-row w-full border border-gray-100 rounded-lg overflow-hidden bg-white 
              hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 cursor-pointer h-full"
         >
            <div className="relative w-full aspect-[4/3] md:w-[240px] md:aspect-auto shrink-0 bg-gray-100">
               <Image
                  src={getOptimizedCloudinaryUrl(
                     advancedInfo.thumbnailUrl || '/course.png',
                     CloudinaryPresets.medium
                  )}
                  alt={basicInfo.title}
                  fill
                  loading="lazy"
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 240px"
               />
            </div>

            {/* Course Content - Flex-1 to occupy remaining space */}
            <div className="flex flex-col flex-1 p-4 md:p-5 justify-between gap-3">
               {/* Top Row: Category Badge & Price */}
               <div>
                  <div className="flex justify-between items-start mb-2">
                     {/* Category Badge */}
                     <span className="text-[10px] py-1 px-2 bg-orange-50 text-orange-600 font-bold uppercase rounded tracking-wider">
                        {basicInfo.category}
                     </span>

                     {/* Price */}
                     <div className="flex gap-2 items-end">
                        <p className="text-lg font-bold text-gray-900">
                           {price.amount > 0 ? `$${price.amount}` : 'Free'}
                        </p>
                     </div>
                  </div>

                  {/* Course Title */}
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-2 leading-tight mb-1">
                     {basicInfo.title}
                  </h3>
               </div>

               {/* Instructor and Rating Row */}
               {/* Instructor Info */}
               <div className="flex items-center gap-2">
                  <div className="relative w-6 h-6 rounded-full overflow-hidden bg-gray-200">
                     {instructorAvatar ? (
                        <Image
                           src={getOptimizedCloudinaryUrl(
                              instructorAvatar,
                              CloudinaryPresets.avatar
                           )}
                           alt={instructorName}
                           fill
                           loading="lazy"
                           sizes="24px"
                           className="object-cover"
                        />
                     ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-500">
                           {instructorName[0]}
                        </div>
                     )}
                  </div>
                  <p className="text-sm font-medium text-gray-600 truncate">
                     {instructorName}
                  </p>
               </div>

               {/* Course Features / Statistics */}
               <div className="flex items-center justify-between border-t border-gray-50 pt-3 mt-1">
                  {/* Rating */}
                  <div className="flex gap-1.5 items-center">
                     <FaStar size={14} className="text-yellow-400" />
                     <p className="text-sm font-bold text-gray-900">4.8</p>
                     <p className="text-xs text-gray-500">(120)</p>
                  </div>

                  {/* Level */}
                  <div className="hidden sm:flex gap-1.5 items-center">
                     <FiBarChart size={16} className="text-gray-400" />
                     <p className="text-xs font-medium text-gray-500 capitalize">
                        {basicInfo.level}
                     </p>
                  </div>

                  {/* Duration */}
                  <div className="flex gap-1.5 items-center">
                     <CiClock2 size={16} className="text-gray-400" />
                     <p className="text-xs font-medium text-gray-500">
                        {basicInfo.durationValue} {basicInfo.durationUnit}
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </Link>
   );
}
