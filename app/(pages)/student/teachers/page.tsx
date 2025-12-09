'use client';
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import InstructorCard, {
   InstructorProps,
} from '@/app/components/student/InstructorCard';
import { getMyCourses } from '@/app/services/studentService';

export default function StudentInstructorsPage() {
   const [instructors, setInstructors] = useState<InstructorProps[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [searchQuery, setSearchQuery] = useState('');

   useEffect(() => {
      const fetchInstructors = async () => {
         try {
            setIsLoading(true);
            const courses = await getMyCourses();

            // Extract unique instructors from courses
            const uniqueInstructorsMap = new Map();

            courses.forEach((item) => {
               const instructor = item.course.instructor;
               if (instructor && !uniqueInstructorsMap.has(instructor._id)) {
                  uniqueInstructorsMap.set(instructor._id, {
                     id: instructor._id,
                     name: `${instructor.firstname} ${instructor.lastname}`,
                     title: instructor.title || 'Instructor', // Fallback title as it might not be populated in course list view deep populate
                     image:
                        instructor.avatar ||
                        `https://ui-avatars.com/api/?name=${instructor.firstname}+${instructor.lastname}&background=random`,
                  });
               }
            });

            setInstructors(Array.from(uniqueInstructorsMap.values()));
         } catch (error) {
            console.error('Failed to fetch instructors:', error);
         } finally {
            setIsLoading(false);
         }
      };

      fetchInstructors();
   }, []);

   const filteredInstructors = instructors.filter((instructor) =>
      instructor.name.toLowerCase().includes(searchQuery.toLowerCase())
   );

   if (isLoading) {
      return (
         <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
         </div>
      );
   }

   return (
      <div className="space-y-8">
         <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-bold text-gray-900">
               Instructors{' '}
               <span className="text-gray-500 font-medium">
                  ({filteredInstructors.length})
               </span>
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div className="relative">
                  <input
                     type="text"
                     placeholder="Search in your teachers..."
                     className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:border-[#FF6636]"
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
               </div>

               <select className="px-4 py-3 border border-gray-200 rounded-md bg-white text-gray-600 focus:outline-none cursor-pointer">
                  <option>All Courses</option>
               </select>

               <select className="px-4 py-3 border border-gray-200 rounded-md bg-white text-gray-600 focus:outline-none cursor-pointer">
                  <option>All Teachers</option>
               </select>
            </div>
         </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredInstructors.length > 0 ? (
               filteredInstructors.map((instructor) => (
                  <div key={instructor.id} className="h-full">
                     <InstructorCard {...instructor} />
                  </div>
               ))
            ) : (
               <div className="col-span-full text-center py-10 text-gray-500">
                  No instructors found from your enrolled courses.
               </div>
            )}
         </div>
      </div>
   );
}
