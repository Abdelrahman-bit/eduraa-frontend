'use client';
import React, { useEffect, useState } from 'react';
import { Users, PlayCircle, Star, MessageCircle } from 'lucide-react';
import {
   CourseCard,
   Course,
} from '@/app/components/global/CourseCard/CourseCard';
import { getInstructorProfile } from '@/app/services/studentService';
import { fetchCoursesByInstructor } from '@/app/services/courses';
import { useParams } from 'next/navigation';

export default function InstructorProfilePage() {
   const params = useParams();
   const id = params?.id as string;

   const [instructor, setInstructor] = useState<any>(null);
   const [courses, setCourses] = useState<Course[]>([]);
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      const loadData = async () => {
         if (!id) return;
         try {
            setIsLoading(true);
            const [profileData, coursesData] = await Promise.all([
               getInstructorProfile(id),
               fetchCoursesByInstructor(id),
            ]);

            setInstructor(profileData);

            // Map backend courses to Course interface
            const mappedCourses = (coursesData.data || []).map(
               (course: any) => ({
                  id: course._id,
                  title: course.basicInfo.title,
                  category: course.basicInfo.category,
                  image:
                     course.advancedInfo?.thumbnailUrl ||
                     'https://via.placeholder.com/750x422',
                  // For public view, progress is not relevant
                  // progress: undefined
               })
            );

            setCourses(mappedCourses);
         } catch (error) {
            console.error('Failed to load instructor data', error);
         } finally {
            setIsLoading(false);
         }
      };

      loadData();
   }, [id]);

   if (isLoading) {
      return (
         <div className="flex justify-center items-center h-96">
            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
         </div>
      );
   }

   if (!instructor) {
      return (
         <div className="text-center py-20 text-gray-500">
            Instructor not found
         </div>
      );
   }

   const studentCount =
      courses.reduce((acc, course: any) => acc + (course.students || 0), 0) ||
      'N/A'; // Need to check if students count is returned by API

   return (
      <div className="space-y-10">
         <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-lg shrink-0">
               <img
                  src={
                     instructor.avatar ||
                     `https://ui-avatars.com/api/?name=${instructor.firstname}+${instructor.lastname}&background=random`
                  }
                  alt={`${instructor.firstname} ${instructor.lastname}`}
                  className="w-full h-full object-cover"
               />
            </div>

            <div className="flex-1 space-y-4 pt-2">
               <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                     {instructor.firstname} {instructor.lastname}
                  </h1>
                  <p className="text-gray-500 font-medium">
                     {instructor.title || 'Instructor'}
                  </p>
               </div>

               <div className="flex gap-6">
                  {/* Stats can be refined if API provides them */}
                  {/* <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-3 py-1 rounded-full text-sm">
                     <Users size={16} />
                     <span>{studentCount} Students</span>
                  </div> */}
                  <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-3 py-1 rounded-full text-sm">
                     <PlayCircle size={16} />
                     <span>{courses.length} Courses</span>
                  </div>
               </div>
            </div>

            {/* <button className="bg-[#FFEEE8] text-[#FF6636] px-6 py-3 rounded-md font-semibold hover:bg-[#FF6636] hover:text-white transition-colors">
               Send Message
            </button> */}
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-4 space-y-4">
               <h3 className="text-xl font-bold text-gray-900">About Me</h3>
               <p className="text-gray-500 leading-relaxed text-sm">
                  {instructor.biography || 'No biography available.'}
               </p>
            </div>

            <div className="lg:col-span-8 space-y-6">
               <div className="border-b border-gray-100 flex gap-8">
                  <button className="pb-3 text-[#FF6636] border-b-2 border-[#FF6636] font-semibold">
                     Courses ({courses.length})
                  </button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {courses.map((course) => (
                     <div key={course.id} className="h-full">
                        <CourseCard course={course} />
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
   );
}
