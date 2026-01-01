'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { getInstructorById } from '@/app/services/adminService';
import { Button } from '@/components/ui/button';
import {
   ArrowLeft,
   Mail,
   Phone,
   Calendar,
   BookOpen,
   Users,
   Star,
   Loader2,
} from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { CourseDTO } from '@/app/services/courseService';
import CourseDetailsModal from '../../courses/components/CourseDetailsModal';

export default function InstructorProfilePage() {
   const { id } = useParams() as { id: string };
   const router = useRouter();
   const [selectedCourse, setSelectedCourse] = useState<CourseDTO | null>(null);

   const { data: instructor, isLoading } = useQuery({
      queryKey: ['instructor', id],
      queryFn: () => getInstructorById(id),
      enabled: !!id,
   });

   if (isLoading) {
      return (
         <div className="flex h-[80vh] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
         </div>
      );
   }

   if (!instructor) {
      return (
         <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
            <h2 className="text-xl font-bold text-gray-800">
               Instructor Not Found
            </h2>
            <Button onClick={() => router.back()}>Go Back</Button>
         </div>
      );
   }

   return (
      <div className="space-y-6">
         {/* Back Button */}
         <div>
            <Button
               variant="ghost"
               className="gap-2 text-gray-500 hover:text-gray-900"
               onClick={() => router.back()}
            >
               <ArrowLeft size={16} />
               Back to Instructors
            </Button>
         </div>

         {/* Header Profile Card */}
         <div className="bg-white rounded-lg border shadow-sm p-6 sm:p-8 flex flex-col md:flex-row gap-8 items-start">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-gray-50 overflow-hidden shrink-0 relative bg-gray-100">
               {instructor.avatar ? (
                  <Image
                     src={instructor.avatar}
                     alt={instructor.firstname}
                     fill
                     className="object-cover"
                  />
               ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-gray-400 bg-gray-100">
                     {instructor.firstname?.charAt(0)}
                  </div>
               )}
            </div>

            <div className="flex-1 space-y-4">
               <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                     {instructor.firstname} {instructor.lastname}
                  </h1>
                  <p className="text-gray-500 text-sm mt-1">
                     Instructor ID: {instructor._id}
                  </p>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                     <Mail size={16} className="text-gray-400" />
                     {instructor.email}
                  </div>
                  {instructor.phone && (
                     <div className="flex items-center gap-2">
                        <Phone size={16} className="text-gray-400" />
                        {instructor.phone}
                     </div>
                  )}
                  <div className="flex items-center gap-2">
                     <Calendar size={16} className="text-gray-400" />
                     Joined{' '}
                     {new Date(instructor.createdAt).toLocaleDateString()}
                  </div>
               </div>
            </div>
         </div>

         {/* Stats Grid */}
         <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg border shadow-sm">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                     <BookOpen size={24} />
                  </div>
                  <div>
                     <p className="text-sm font-medium text-gray-500">
                        Total Courses
                     </p>
                     <h3 className="text-2xl font-bold text-gray-900">
                        {instructor.courses?.length || 0}
                     </h3>
                  </div>
               </div>
            </div>

            <div className="bg-white p-6 rounded-lg border shadow-sm">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                     <Users size={24} />
                  </div>
                  <div>
                     <p className="text-sm font-medium text-gray-500">
                        Total Students
                     </p>
                     <h3 className="text-2xl font-bold text-gray-900">
                        {instructor.totalStudents ?? '--'}
                     </h3>
                  </div>
               </div>
            </div>

            <div className="bg-white p-6 rounded-lg border shadow-sm">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center">
                     <Star size={24} />
                  </div>
                  <div>
                     <p className="text-sm font-medium text-gray-500">
                        Average Rating
                     </p>
                     <h3 className="text-2xl font-bold text-gray-900">
                        {instructor.averageRating
                           ? instructor.averageRating.toFixed(1)
                           : 'N/A'}
                     </h3>
                  </div>
               </div>
            </div>
         </div>

         {/* Courses List */}
         <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
            <div className="p-6 border-b">
               <h2 className="text-lg font-bold text-gray-900">
                  Courses by this Instructor
               </h2>
            </div>
            {instructor.courses && instructor.courses.length > 0 ? (
               <div className="divide-y relative">
                  {instructor.courses.map((course: any) => (
                     <div
                        key={course._id}
                        className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => setSelectedCourse(course)}
                     >
                        <div>
                           <h3 className="font-semibold text-gray-900 mb-1">
                              {course.basicInfo?.title || 'Untitled Course'}
                           </h3>
                           <p className="text-sm text-gray-500 line-clamp-2">
                              {course.basicInfo?.subtitle ||
                                 'No description available.'}
                           </p>
                           <div className="flex gap-2 mt-2">
                              <Badge
                                 variant={
                                    course.status === 'published'
                                       ? 'default'
                                       : 'secondary'
                                 }
                                 className={
                                    course.status === 'published'
                                       ? 'bg-green-100 text-green-700 hover:bg-green-100'
                                       : course.status === 'rejected'
                                         ? 'bg-red-100 text-red-700 hover:bg-red-100'
                                         : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100'
                                 }
                              >
                                 {course.status}
                              </Badge>
                              <Badge variant="outline">
                                 {course.basicInfo?.level}
                              </Badge>
                           </div>
                        </div>
                        <div className="shrink-0 flex items-center gap-6 text-sm text-gray-500">
                           <div className="flex items-center gap-1">
                              <Users size={14} />
                              <span>
                                 {course.enrollmentCount || 0} Students
                              </span>
                           </div>
                           <div className="font-semibold text-gray-900">
                              {course.basicInfo?.price > 0
                                 ? `$${course.basicInfo.price}`
                                 : 'Free'}
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            ) : (
               <div className="p-12 text-center text-gray-500">
                  <BookOpen className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                  <p>No courses found for this instructor.</p>
               </div>
            )}
         </div>

         {/* Course Details Modal */}
         <CourseDetailsModal
            isOpen={!!selectedCourse}
            onClose={() => setSelectedCourse(null)}
            course={selectedCourse}
         />
      </div>
   );
}
