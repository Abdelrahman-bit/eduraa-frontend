'use client';
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import CourseCard, { CourseProps } from '@/components/student/CourseCard';

export default function StudentCoursesPage() {
   const [searchQuery, setSearchQuery] = useState('');
   const [sortBy, setSortBy] = useState('Latest');
   const [statusFilter, setStatusFilter] = useState('All Courses');

   // fetch data from API later
   const myCourses: CourseProps[] = [
      {
         id: 1,
         category: 'Web Development',
         title: 'The Complete 2024 Web Development Bootcamp',
         image: 'https://img-c.udemycdn.com/course/750x422/1565838_e54e_18.jpg',
         progress: 61,
      },
      {
         id: 2,
         category: 'Design',
         title: 'Complete Adobe Lightroom Megacourse',
         image: 'https://img-c.udemycdn.com/course/750x422/394676_ce3d_5.jpg',
         progress: 25,
      },
      {
         id: 3,
         category: 'Marketing',
         title: 'Instagram Marketing 2024',
         image: 'https://img-c.udemycdn.com/course/750x422/405926_02c8_2.jpg',
         progress: 100,
      },
      {
         id: 4,
         category: 'Software',
         title: 'Adobe Premiere Pro CC',
         image: 'https://img-c.udemycdn.com/course/750x422/567828_67d0.jpg',
         progress: 0,
      },
      {
         id: 5,
         category: 'Development',
         title: 'Machine Learning A-Z',
         image: 'https://img-c.udemycdn.com/course/750x422/950390_270f_3.jpg',
         progress: 12,
      },
      {
         id: 6,
         category: 'Photography',
         title: 'Photography Masterclass',
         image: 'https://img-c.udemycdn.com/course/750x422/1462428_639f_5.jpg',
         progress: 45,
      },
   ];

   // filter and sort courses based on user input
   const filteredCourses = myCourses
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
            return Number(a.id) - Number(b.id);
         } else {
            // Latest (default)
            return Number(b.id) - Number(a.id);
         }
      });

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
