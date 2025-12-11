'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
   Star,
   User,
   Play,
   FileText,
   Clock,
   BarChart,
   Monitor,
   Download,
   ChevronRight,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getCourseById } from '@/app/services/courseService';
import CurriculumViewer from './components/CurriculumViewer';

// --- Types ---

interface PageProps {
   params: Promise<{
      id: string;
   }>;
}

// --- Sub-Components ---

// 1. Single Stat Box Component
const StatBox = ({
   label,
   value,
   sub,
   icon: Icon,
   bg,
   color,
}: {
   label: string;
   value: string;
   sub?: string;
   icon: React.ElementType;
   bg: string;
   color: string;
}) => (
   <div className="bg-white p-5 rounded-sm shadow-sm flex items-start gap-4">
      <div
         className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${bg} ${color}`}
      >
         <Icon size={24} />
      </div>
      <div>
         <h4 className="text-xl font-bold text-gray-900">{value}</h4>
         <p className="text-sm text-gray-500">{label}</p>
         {sub && (
            <span className="text-xs text-gray-400 mt-1 block">{sub}</span>
         )}
      </div>
   </div>
);

// --- Main Page Component ---

export default function CourseDetailPage({ params }: PageProps) {
   const unwrappedParams = React.use(params);
   const { data: course, isLoading } = useQuery({
      queryKey: ['course', unwrappedParams.id],
      queryFn: () => getCourseById(unwrappedParams.id),
   });

   if (isLoading) {
      return <div className="p-8">Loading course details...</div>;
   }

   if (!course) {
      return <div className="p-8">Course not found</div>;
   }

   // Derived Data
   const basicInfo = course.basicInfo;
   const advancedInfo = course.advancedInfo;
   const statsGrid = [
      {
         label: 'Course level',
         value: basicInfo.level || 'Beginner',
         icon: BarChart,
         bg: 'bg-green-100',
         color: 'text-green-500',
      },
      {
         label: 'Course Language',
         value: basicInfo.primaryLanguage || 'English',
         icon: FileText,
         bg: 'bg-gray-100',
         color: 'text-gray-600',
      },
      {
         label: 'Duration',
         value: `${basicInfo.durationValue || 0} ${basicInfo.durationUnit || 'Hours'}`,
         icon: Clock,
         bg: 'bg-indigo-100',
         color: 'text-indigo-500',
      },
      {
         label: 'Category',
         value: basicInfo.category,
         icon: Monitor,
         bg: 'bg-orange-100',
         color: 'text-orange-500',
      },
   ];

   const imageUrl =
      advancedInfo.thumbnailUrl ||
      'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1000&auto=format&fit=crop';
   const instructor =
      typeof course.instructor === 'object' ? course.instructor : null;
   const instructorName = instructor?.firstname
      ? `${instructor.firstname} ${instructor.lastname}`
      : 'Instructor';

   console.log(course.instructor);
   return (
      <div className="p-6 md:p-8 bg-[#F5F7FA] min-h-screen font-sans">
         {/* Breadcrumb Navigation */}
         <div className="mb-4 flex items-center gap-2 text-sm">
            <Link
               href="/dashboard/instructor/courses"
               className="text-gray-500 hover:text-orange-500 transition-colors"
            >
               My Courses
            </Link>
            <ChevronRight size={16} className="text-gray-400" />
            <span className="text-gray-900 font-medium truncate max-w-md">
               {basicInfo.title}
            </span>
         </div>

         {/* Header */}
         <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Course Details</h1>
            <div className="text-sm text-gray-500 mt-2 flex gap-2">
               <span>{basicInfo.category}</span>
               {basicInfo.subCategory && (
                  <span>&gt; {basicInfo.subCategory}</span>
               )}
               {basicInfo.topic && <span>&gt; {basicInfo.topic}</span>}
            </div>
         </div>

         {/* 2. Top Course Banner */}
         <div className="bg-white p-6 rounded-sm shadow-sm mb-6 flex flex-col lg:flex-row gap-6">
            {/* Left: Image */}
            <div className="w-full lg:w-1/4 h-48 lg:h-auto relative rounded-md overflow-hidden bg-gray-200">
               <Image
                  src={imageUrl}
                  alt="Course Thumbnail"
                  fill
                  className="object-cover"
               />
            </div>

            {/* Middle: Info */}
            <div className="flex-1 flex flex-col justify-between py-2">
               <div>
                  <div className="flex text-xs text-gray-400 gap-4 mb-2 flex-wrap">
                     <span>
                        ID:{' '}
                        <span className="font-mono text-gray-600 select-all">
                           {course._id}
                        </span>
                     </span>
                     <span className="w-px h-3 bg-gray-300"></span>
                     <span>
                        Last Updated:{' '}
                        {new Date(
                           course.updatedAt || Date.now()
                        ).toLocaleDateString()}
                     </span>
                     <span className="w-px h-3 bg-gray-300"></span>
                     <span>
                        Status:{' '}
                        <span className="uppercase font-semibold text-gray-600">
                           {course.status}
                        </span>
                     </span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 leading-tight">
                     {basicInfo.title}
                  </h2>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                     {basicInfo.subtitle}
                  </p>

                  {/* Instructors */}
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold text-gray-600">
                        {instructorName.charAt(0)}
                     </div>
                     <div className="text-sm text-gray-600">
                        Created by:{' '}
                        <span className="font-semibold text-gray-900">
                           {instructorName}
                        </span>
                     </div>
                  </div>
               </div>
            </div>

            {/* Right: Info (Rating placeholder) */}
            <div className="w-full lg:w-1/4 flex flex-col items-start lg:items-end justify-center py-2 border-t lg:border-t-0 lg:border-l border-gray-100 lg:pl-6 mt-4 lg:mt-0 pt-4 lg:pt-0">
               {/* Rating Placeholder */}
               <div className="flex items-center gap-1 mb-4 lg:mb-0">
                  <div className="flex text-orange-500">
                     {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                           key={s}
                           size={16}
                           fill={s <= 4 ? 'currentColor' : 'none'}
                           color="currentColor"
                        />
                     ))}
                  </div>
                  <span className="font-bold text-gray-900 ml-1">0.0</span>
                  <span className="text-xs text-gray-400">(0 Rating)</span>
               </div>

               <div className="mt-4">
                  <span className="text-xs text-gray-400">Course Status</span>
                  <span
                     className={`block font-bold mt-1 ${course.status === 'published' ? 'text-green-600' : 'text-gray-600'}`}
                  >
                     {course.status.charAt(0).toUpperCase() +
                        course.status.slice(1)}
                  </span>
               </div>
            </div>
         </div>

         {/* 3. Stats Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {statsGrid.map((stat, index) => (
               <StatBox key={index} {...stat} />
            ))}
         </div>

         {/* Description & Curriculum Section */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
               <div className="bg-white p-6 rounded-sm shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-4 text-lg">
                     Description
                  </h3>
                  <div className="prose max-w-none text-gray-600 text-sm">
                     {advancedInfo.description ? (
                        <div
                           dangerouslySetInnerHTML={{
                              __html: advancedInfo.description,
                           }}
                        />
                     ) : (
                        <p>No description available.</p>
                     )}
                  </div>
               </div>

               {/* Curriculum Viewer */}
               <CurriculumViewer sections={course.curriculum?.sections || []} />
            </div>

            {/* Sidebar (Optional) */}
            <div className="space-y-6">
               {/* Future: Course Trailer or Requirements could go here */}
            </div>
         </div>
      </div>
   );
}
