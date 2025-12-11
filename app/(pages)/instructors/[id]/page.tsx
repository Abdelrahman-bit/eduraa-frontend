'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { FaStar, FaFacebookF } from 'react-icons/fa';
import { FaCirclePlay } from 'react-icons/fa6';
import { LuUsersRound } from 'react-icons/lu';
import { useParams } from 'next/navigation';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// Using the student CourseCard or Home Page CourseCard. Let's assume student one is more appropriate or check imports.
// The file imported originally was @/app/components/Home_Page/CourseCard/CourseCard. Let's stick to it or use the student one if we want consistent student view.
// Given user context (student view), let's use the one from student components which expects specific props, or map to whatever component works best.
// The original import was from Home_Page. Let's use `app/components/student/CourseCard` for consistency with student dashboard if possible, or keep original if it looks better.
// Actually, let's use `app/components/student/CourseCard` to reuse the logic we just fixed.
import { CourseCard } from '@/app/components/global/CourseCard/CourseCard';
import { getPublicUserProfile, UserProfile } from '@/app/services/userService';
import {
   getPublicInstructorCourses,
   CourseDTO,
} from '@/app/services/courseService';

export default function InstructorDetails() {
   const params = useParams();
   const id = params.id as string;

   const [instructor, setInstructor] = useState<UserProfile | null>(null);
   const [courses, setCourses] = useState<any[]>([]); // Using any for mapped props
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      if (id) {
         fetchData();
      }
   }, [id]);

   const fetchData = async () => {
      try {
         setLoading(true);
         const [userProfile, userCourses] = await Promise.all([
            getPublicUserProfile(id),
            getPublicInstructorCourses(id),
         ]);

         setInstructor(userProfile);

         // Map courses to CourseCard props
         const mapped = userCourses.map((c: CourseDTO) => ({
            id: c._id,
            title: c.basicInfo.title,
            category: c.basicInfo.category,
            image:
               c.advancedInfo?.thumbnailUrl ||
               'https://via.placeholder.com/750x422',
            progress: 0, // Public view, no progress
            students: c.students || 0,
            // CourseCard might need price or rating if it supports it, check props
            // Student CourseCard: { id, title, category, image, progress }
         }));
         setCourses(mapped);
      } catch (error) {
         console.error('Failed to fetch instructor details', error);
      } finally {
         setLoading(false);
      }
   };

   if (loading) {
      return (
         <div className="flex justify-center items-center py-40">
            <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
         </div>
      );
   }

   if (!instructor) {
      return <div className="text-center py-20">Instructor not found.</div>;
   }

   return (
      <section className="section-boundary my-10 flex flex-col gap-10">
         <div className="flex justify-between items-center  p-10 border border-gray-scale-100 shadow-sm bg-white">
            <div className="flex gap-6 items-center flex-wrap">
               <div className="w-[150px] h-[150px] relative rounded-full overflow-hidden shrink-0 border border-gray-200">
                  <Image
                     src={
                        instructor.avatar ||
                        `https://ui-avatars.com/api/?name=${instructor.firstname}+${instructor.lastname}`
                     }
                     alt="Instructor"
                     fill
                     className="object-cover"
                  />
               </div>
               <div className="flex flex-col gap-2">
                  <h3 className="font-semibold text-gray-scale-900 text-3xl">
                     {instructor.firstname} {instructor.lastname}
                  </h3>
                  <p className="text-gray-scale-600 text-lg">
                     {instructor.title || instructor.role}
                  </p>
                  <div className="flex gap-5 justify-between mt-2 flex-wrap">
                     <div className="flex items-center gap-1">
                        <FaStar size={16} className="text-orange-500" />
                        <p className="text-body-md font-medium text-gray-scale-900">
                           0.0
                        </p>
                        <p className="text-gray-scale-600 text-body-md">
                           (0 reviews)
                        </p>
                     </div>
                     <div className="flex items-center gap-1">
                        <LuUsersRound size={16} className="text-orange-500" />
                        <p className="text-body-md font-medium text-gray-scale-900">
                           {courses.reduce(
                              (acc, curr) => acc + (curr.students || 0),
                              0
                           )}
                        </p>
                        <p className="text-gray-scale-600 text-body-md">
                           students
                        </p>
                     </div>
                     <div className="flex items-center gap-1">
                        <FaCirclePlay size={16} className="text-orange-500" />
                        <p className="text-body-md font-medium text-gray-scale-900">
                           {courses.length}
                        </p>
                        <p className="text-gray-scale-600 text-body-md">
                           courses
                        </p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 p-8 border border-gray-scale-100 shadow-sm bg-white self-start">
               <h5 className="text-xl text-gray-scale-900 uppercase font-semibold mb-4">
                  About Me
               </h5>
               <p className="text-body-md text-gray-600 leading-loose whitespace-pre-line">
                  {instructor.biography || 'No biography available.'}
               </p>
            </div>
            <div className="flex-[2] rounded-sm bg-white border border-gray-scale-100 shadow-sm">
               <Tabs defaultValue="courses" className="w-full rounded-none">
                  <TabsList className="bg-transparent w-full h-[50px] border-b border-gray-100 justify-start px-2">
                     <TabsTrigger
                        value="courses"
                        className="data-[state=active]:text-orange-500 data-[state=active]:border-b-2 data-[state=active]:border-orange-500 rounded-none h-full px-6 font-semibold"
                     >
                        Courses
                     </TabsTrigger>
                     <TabsTrigger
                        value="reviews"
                        className="data-[state=active]:text-orange-500 data-[state=active]:border-b-2 data-[state=active]:border-orange-500 rounded-none h-full px-6 font-semibold"
                     >
                        Reviews
                     </TabsTrigger>
                  </TabsList>
                  <TabsContent value="courses" className="mt-0">
                     <div className="p-6">
                        <h3 className="text-xl font-semibold mb-6">
                           Courses ({courses.length})
                        </h3>
                        {courses.length > 0 ? (
                           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                              {courses.map((course) => (
                                 <div key={course.id} className="h-full">
                                    {/* Wrap in div to control height if needed */}
                                    <CourseCard {...course} />
                                 </div>
                              ))}
                           </div>
                        ) : (
                           <div className="text-gray-500 text-center py-10">
                              No courses published yet.
                           </div>
                        )}
                     </div>
                  </TabsContent>
                  <TabsContent value="reviews" className="mt-0">
                     <div className="p-10 text-center text-gray-500">
                        Reviews coming soon...
                     </div>
                  </TabsContent>
               </Tabs>
            </div>
         </div>
      </section>
   );
}
