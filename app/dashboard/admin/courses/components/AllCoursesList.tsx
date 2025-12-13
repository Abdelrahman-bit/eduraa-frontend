'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllCourses } from '@/app/services/adminService';
import { Button } from '@/components/ui/button';
import {
   Dialog,
   DialogContent,
   DialogTitle,
   DialogDescription,
} from '@/components/ui/dialog';
import { CourseDTO } from '@/app/services/courseService';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
   Eye,
   BookOpen,
   User,
   Layers,
   FileText,
   ExternalLink,
   DollarSign,
   Check,
   PlayCircle,
   Trash2,
} from 'lucide-react';

const AllCoursesList = () => {
   const [selectedCourse, setSelectedCourse] = useState<CourseDTO | null>(null);
   const router = useRouter();

   const { data: courses, isLoading } = useQuery({
      queryKey: ['allCourses'],
      queryFn: getAllCourses,
   });

   const handleViewContent = (courseId: string) => {
      router.push(`/dashboard/admin/courses/${courseId}`);
   };

   // Helper function for status colors
   const getStatusStyle = (status: string) => {
      switch (status) {
         case 'published':
            return 'bg-green-100 text-green-700';
         case 'review':
            return 'bg-orange-100 text-orange-700';
         case 'rejected':
            return 'bg-red-100 text-red-700';
         default:
            return 'bg-gray-100 text-gray-700';
      }
   };

   if (isLoading) {
      return (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4].map((i) => (
               <div
                  key={i}
                  className="h-72 bg-gray-100 rounded-xl animate-pulse"
               />
            ))}
         </div>
      );
   }

   return (
      <div>
         {/* Grid Layout */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses?.map((course) => (
               <div
                  key={course._id}
                  className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
               >
                  {/* Image & Status Badge */}
                  <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                     {course.advancedInfo?.thumbnail?.url ? (
                        <Image
                           src={course.advancedInfo.thumbnail.url}
                           alt={course.basicInfo.title}
                           fill
                           className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                     ) : (
                        <div className="flex items-center justify-center h-full text-gray-300 bg-gray-50">
                           <BookOpen size={40} />
                        </div>
                     )}
                     {/* Category */}
                     <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                        {course.basicInfo.category}
                     </div>
                     {/* Status Badge */}
                     <div
                        className={`absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide shadow-sm ${getStatusStyle(course.status)}`}
                     >
                        {course.status}
                     </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                     <div className="mb-2">
                        <h2 className="text-base font-bold text-gray-900 line-clamp-2 leading-tight group-hover:text-orange-600 transition-colors">
                           {course.basicInfo.title}
                        </h2>
                     </div>

                     <div className="flex items-center gap-2 mb-4 mt-1">
                        <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shrink-0 text-xs font-bold">
                           {typeof course.instructor === 'object'
                              ? course.instructor?.firstname?.charAt(0)
                              : 'U'}
                        </div>
                        <span className="text-xs text-gray-500 truncate font-medium">
                           {typeof course.instructor === 'object'
                              ? `${course.instructor?.firstname || ''} ${course.instructor?.lastname || ''}`.trim()
                              : 'Unknown'}
                        </span>
                     </div>

                     <div className="mt-auto pt-4 border-t border-gray-100">
                        <Button
                           className="w-full bg-white border border-gray-200 text-gray-700 hover:border-orange-500 hover:text-orange-500 transition-all h-10"
                           onClick={() => setSelectedCourse(course)}
                        >
                           <Eye size={16} className="mr-2" /> View Details
                        </Button>
                     </div>
                  </div>
               </div>
            ))}
         </div>

         {/* --- Course Details Modal (Single Column) --- */}
         {selectedCourse && (
            <Dialog
               open={!!selectedCourse}
               onOpenChange={() => setSelectedCourse(null)}
            >
               <DialogContent className="max-w-3xl w-full h-[90vh] p-0 border-none rounded-2xl overflow-hidden bg-white flex flex-col">
                  {/* Scrollable Content */}
                  <div className="flex-1 overflow-y-auto">
                     {/* Hero Banner */}
                     <div className="relative h-56 w-full">
                        {selectedCourse.advancedInfo?.thumbnail?.url ? (
                           <Image
                              src={selectedCourse.advancedInfo.thumbnail.url}
                              alt="Cover"
                              fill
                              className="object-cover"
                           />
                        ) : (
                           <div className="flex items-center justify-center h-full bg-gray-200 text-gray-400">
                              No Image
                           </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                        <div className="absolute bottom-0 left-0 p-6 w-full text-white">
                           <div className="flex items-center gap-3 mb-3">
                              <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">
                                 {selectedCourse.basicInfo.category}
                              </span>
                              <span
                                 className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getStatusStyle(selectedCourse.status)}`}
                              >
                                 {selectedCourse.status}
                              </span>
                           </div>
                           <DialogTitle className="text-2xl md:text-3xl font-bold leading-tight mb-2">
                              {selectedCourse.basicInfo.title}
                           </DialogTitle>
                        </div>
                     </div>

                     {/* Body */}
                     <div className="p-6 md:p-8 space-y-8">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                           <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-orange-600 font-bold shadow-sm">
                                 {typeof selectedCourse.instructor === 'object'
                                    ? selectedCourse.instructor?.firstname?.charAt(
                                         0
                                      )
                                    : 'U'}
                              </div>
                              <div className="overflow-hidden">
                                 <p className="text-[10px] text-gray-400 uppercase font-bold">
                                    Instructor
                                 </p>
                                 <p className="text-sm font-bold text-gray-900 truncate">
                                    {typeof selectedCourse.instructor ===
                                    'object'
                                       ? `${selectedCourse.instructor?.firstname || ''} ${selectedCourse.instructor?.lastname || ''}`.trim()
                                       : 'Unknown'}
                                 </p>
                              </div>
                           </div>

                           <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-green-600 font-bold shadow-sm">
                                 <DollarSign size={18} />
                              </div>
                              <div>
                                 <p className="text-[10px] text-gray-400 uppercase font-bold">
                                    Price
                                 </p>
                                 <p className="text-sm font-bold text-gray-900">
                                    ${selectedCourse.basicInfo.price}
                                 </p>
                              </div>
                           </div>

                           <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-blue-600 font-bold shadow-sm">
                                 <Layers size={18} />
                              </div>
                              <div>
                                 <p className="text-[10px] text-gray-400 uppercase font-bold">
                                    Content
                                 </p>
                                 <p className="text-sm font-bold text-gray-900">
                                    {selectedCourse.curriculum?.sections
                                       ?.length || 0}{' '}
                                    Sections
                                 </p>
                              </div>
                           </div>
                        </div>

                        {/* Description */}
                        <section>
                           <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900 uppercase tracking-wide mb-3 border-b border-gray-100 pb-2">
                              <FileText size={16} className="text-orange-500" />{' '}
                              About Course
                           </h3>
                           <div className="text-sm text-gray-600 leading-7">
                              {selectedCourse.advancedInfo?.description ||
                                 'No description provided.'}
                           </div>
                        </section>

                        {/* What you'll learn */}
                        {selectedCourse.advancedInfo?.whatYouWillLearn && (
                           <section>
                              <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900 uppercase tracking-wide mb-3 border-b border-gray-100 pb-2">
                                 <Check size={16} className="text-green-500" />{' '}
                                 What You'll Learn
                              </h3>
                              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                 {selectedCourse.advancedInfo.whatYouWillLearn.map(
                                    (item, index) => (
                                       <li
                                          key={index}
                                          className="flex items-start gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100/50"
                                       >
                                          <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
                                          {item}
                                       </li>
                                    )
                                 )}
                              </ul>
                           </section>
                        )}

                        {/* Curriculum */}
                        <section>
                           <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900 uppercase tracking-wide mb-3 border-b border-gray-100 pb-2">
                              <Layers size={16} className="text-blue-500" />{' '}
                              Curriculum
                           </h3>
                           <div className="border border-gray-200 rounded-xl divide-y divide-gray-100 overflow-hidden">
                              {selectedCourse.curriculum?.sections?.map(
                                 (section, idx) => (
                                    <div key={idx} className="bg-white">
                                       <div className="bg-gray-50 px-4 py-3 text-xs font-bold text-gray-700 uppercase flex justify-between items-center">
                                          <span>{section.title}</span>
                                          <span className="bg-white border border-gray-200 px-2 py-0.5 rounded-full text-[10px] text-gray-500">
                                             {section.lectures.length} Lectures
                                          </span>
                                       </div>
                                       <div className="px-4 py-2 space-y-1">
                                          {section.lectures.map(
                                             (lecture, lIdx) => (
                                                <div
                                                   key={lIdx}
                                                   className="flex items-center gap-3 text-sm text-gray-600 py-2"
                                                >
                                                   <PlayCircle
                                                      size={14}
                                                      className="text-gray-400"
                                                   />
                                                   {lecture.title}
                                                </div>
                                             )
                                          )}
                                       </div>
                                    </div>
                                 )
                              )}
                           </div>
                        </section>
                     </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="p-4 md:p-5 border-t border-gray-100 bg-white flex flex-col sm:flex-row gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
                     <Button
                        variant="outline"
                        className="flex-1 sm:flex-none border-gray-200 text-gray-600 hover:bg-gray-50"
                        onClick={() => handleViewContent(selectedCourse._id)}
                     >
                        <ExternalLink size={16} className="mr-2" /> View Full
                        Page
                     </Button>

                     <div className="flex-1"></div>

                     <Button
                        variant="ghost"
                        className="flex-1 sm:flex-none text-red-600 hover:bg-red-50 hover:text-red-700"
                        onClick={() => {
                           if (
                              confirm(
                                 'Are you sure you want to remove this course?'
                              )
                           ) {
                              // Call delete API (Mock logic here)
                              alert('Delete functionality would trigger here');
                           }
                        }}
                     >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                     </Button>
                  </div>
               </DialogContent>
            </Dialog>
         )}
      </div>
   );
};

export default AllCoursesList;
