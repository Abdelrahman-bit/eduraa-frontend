'use client';
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import CourseCard, { CourseProps } from '@/app/components/student/CourseCard';
import { getMyCourses } from '@/app/services/studentService';

export default function StudentCoursesPage() {
   const [searchQuery, setSearchQuery] = useState('');
   const [sortBy, setSortBy] = useState('Latest');
   const [statusFilter, setStatusFilter] = useState('All Courses');
   const [courses, setCourses] = useState<CourseProps[]>([]);
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      fetchCourses();
   }, []);

   const fetchCourses = async () => {
      try {
         setIsLoading(true);
         const studentCourses = await getMyCourses();

         const mappedCourses: CourseProps[] = studentCourses.map((item) => ({
            id: item.course._id,
            title: item.course.basicInfo.title,
            category: item.course.basicInfo.category,
            image:
               item.course.advancedInfo?.thumbnailUrl ||
               'https://via.placeholder.com/750x422',
            progress: item.progress || 0, // Backend needs to calculate this
            // We can also pass instructor info if we update CourseCard, but for now matching interface
         }));
         setCourses(mappedCourses);
      } catch (error) {
         console.error('Failed to fetch courses:', error);
      } finally {
         setIsLoading(false);
      }
   };

   // filter and sort courses based on user input
   const filteredCourses = courses
      .filter((course) => {
         // name filter
         const matchesSearch = course.title
            .toLowerCase()
            .includes(searchQuery.toLowerCase());

         // ststus filter  (Completed / Active)
         let matchesStatus = true;
         if (statusFilter === 'Completed') {
            matchesStatus = course.progress === 100;
         } else if (statusFilter === 'Active') {
            matchesStatus = course.progress < 100;
         }

         return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
         //   (Sort)
         if (sortBy === 'Title') {
            return a.title.localeCompare(b.title);
         } else if (sortBy === 'Oldest') {
            // Assuming ID isn't sortable this way if string, but for now keeping logic or maybe better to sort by index if we had date
            return 0;
         } else {
            // Latest (default) - If we had date, we'd sort by date.
            // Since we don't have date in CourseProps map, we might need to improve this.
            // But let's leave it simple for now or use original order (latest first usually from DB)
            return 0;
         }
      });

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
               Courses{' '}
               <span className="text-gray-500 font-medium">
                  ({filteredCourses.length})
               </span>
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
               {/* Search Bar */}
               <div className="relative">
                  <input
                     type="text"
                     placeholder="Search in your courses..."
                     className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:border-[#FF6636]"
                     // input handlers by ststes
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
               </div>

               {/* Sort Dropdown */}
               <select
                  className="px-4 py-3 border border-gray-200 rounded-md bg-white text-gray-600 focus:outline-none cursor-pointer"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
               >
                  <option value="Latest">Sort by: Latest</option>
                  <option value="Oldest">Sort by: Oldest</option>
                  <option value="Title">Sort by: Title</option>
               </select>

               {/* Status Dropdown */}
               <select
                  className="px-4 py-3 border border-gray-200 rounded-md bg-white text-gray-600 focus:outline-none cursor-pointer"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
               >
                  <option value="All Courses">Status: All Courses</option>
                  <option value="Completed">Status: Completed</option>
                  <option value="Active">Status: Active</option>
               </select>

               <select className="px-4 py-3 border border-gray-200 rounded-md bg-white text-gray-600 focus:outline-none cursor-pointer">
                  <option>Teacher: All Teachers</option>
               </select>
            </div>
         </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredCourses.length > 0 ? (
               filteredCourses.map((course) => (
                  <div key={course.id} className="h-full">
                     <CourseCard {...course} />
                  </div>
               ))
            ) : (
               <div className="col-span-full text-center py-10 text-gray-500">
                  No courses found matching your filters.
               </div>
            )}
         </div>
      </div>
   );
}
