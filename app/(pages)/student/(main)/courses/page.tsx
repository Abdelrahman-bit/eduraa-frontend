'use client';
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import {
   CourseCard,
   Course,
} from '@/app/components/global/CourseCard/CourseCard';
import { fetchMyCourses, Section } from '@/app/services/courses';

export default function StudentCoursesPage() {
   const [searchQuery, setSearchQuery] = useState('');
   const [sortBy, setSortBy] = useState('Latest');
   const [statusFilter, setStatusFilter] = useState('All Courses');
   const [courses, setCourses] = useState<Course[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [progressOverrides, setProgressOverrides] = useState<
      Record<string, number>
   >({});

   // Fetch courses
   useEffect(() => {
      const loadCourses = async () => {
         try {
            setIsLoading(true);
            const response = await fetchMyCourses();
            const studentCourses = response.studentCourses;

            // Map to Course interface
            const mappedCourses: Course[] = studentCourses.map((enrollment) => {
               // Use progress directly from backend
               // If it's a number, use it. If undefined, default to 0.
               let progress = 0;
               if (typeof enrollment.progress === 'number') {
                  progress = enrollment.progress;
               } else if (
                  (enrollment as any).progress?.progressPercentage !== undefined
               ) {
                  // Fallback for any legacy structure if necessary
                  progress = (enrollment as any).progress.progressPercentage;
               }

               return {
                  id: enrollment.course._id,
                  title: enrollment.course.basicInfo.title,
                  category: enrollment.course.basicInfo.category,
                  image:
                     enrollment.course.advancedInfo?.thumbnailUrl ||
                     'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000',
                  progress: progress,
               };
            });
            setCourses(mappedCourses);
         } catch (error) {
            console.error('Failed to fetch courses:', error);
         } finally {
            setIsLoading(false);
         }
      };

      loadCourses();
   }, []);

   // filter and sort courses based on user input
   const filteredCourses = courses
      .filter((course) => {
         // name filter
         const matchesSearch = course.title
            .toLowerCase()
            .includes(searchQuery.toLowerCase());

         // status filter
         let matchesStatus = true;
         if (statusFilter === 'Completed') {
            matchesStatus = (course.progress || 0) === 100;
         } else if (statusFilter === 'Active') {
            matchesStatus = (course.progress || 0) < 100;
         }

         return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
         if (sortBy === 'Title') {
            return a.title.localeCompare(b.title);
         } else if (sortBy === 'Oldest') {
            // Basic fallback since we don't have date in the summarized Course interface yet
            return 0;
         } else {
            return 0; // Latest default
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
         {/* Header & Stats */}
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
            </div>
         </div>

         {/* Course Grid */}
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredCourses.length > 0 ? (
               filteredCourses.map((course) => (
                  <div key={course.id} className="h-full">
                     <CourseCard course={course} hideWishlist={true} />
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
