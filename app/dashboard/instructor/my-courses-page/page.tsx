'use client';

import React from 'react';
import { Search } from 'lucide-react';
import {
   CourseCard,
   CourseType,
} from '@/app/components/dashboard/instructor/InstructorCourseCard';

// --- Mock Data ---
// In a real app, this would come from an API
const COURSES_DATA: CourseType[] = [
   {
      id: '101', // This ID will be passed to the URL
      title: 'Data Structures & Algorithms Essentials (2021)',
      category: 'Developments',
      rating: 5.0,
      students: 197637,
      price: 23.0,
      originalPrice: 35.0,
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000&auto=format&fit=crop', // Mock Image
   },
   {
      id: '102',
      title: 'Premiere Pro CC for Beginners: Video Editing in Premiere',
      category: 'Design',
      rating: 4.9,
      students: 982941,
      price: 24.0,
      originalPrice: 24.0,
      image: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=1000&auto=format&fit=crop',
   },
   {
      id: '103',
      title: 'Learn Python Programming Masterclass',
      category: 'Developments',
      rating: 4.0,
      students: 511123,
      price: 49.0,
      originalPrice: 89.0,
      image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1000&auto=format&fit=crop',
   },
   {
      id: '104',
      title: 'Machine Learning A-Z™: Hands-On Python & R In Data Science',
      category: 'Developments',
      rating: 5.0,
      students: 211434,
      price: 89.0,
      originalPrice: 199.0,
      image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=1000&auto=format&fit=crop',
   },
   // Add more mock items to fill the grid...
];

export default function MyCoursesPage() {
   return (
      <div className="p-6 md:p-8 bg-[#F5F7FA] min-h-screen font-sans">
         {/* Header */}
         <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
            <p className="text-gray-500 text-sm mt-1">Good Morning</p>
         </div>

         {/* Filters & Search Bar */}
         <div className="bg-white p-4 rounded-sm shadow-sm mb-8 flex flex-col xl:flex-row gap-4 justify-between items-center">
            {/* Search */}
            <div className="relative w-full xl:w-96">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
               </div>
               <input
                  type="text"
                  placeholder="Search in your courses..."
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-sm leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm transition-shadow"
               />
            </div>

            {/* Dropdowns */}
            <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
               {/* Sort By */}
               <div className="flex flex-col w-full sm:w-40">
                  <label className="text-xs text-gray-400 mb-1">Sort by:</label>
                  <select className="form-select block w-full pl-3 pr-10 py-2 text-base border-gray-200 bg-gray-50 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-sm">
                     <option>Latest</option>
                     <option>Oldest</option>
                     <option>Price: Low to High</option>
                  </select>
               </div>

               {/* Category */}
               <div className="flex flex-col w-full sm:w-40">
                  <label className="text-xs text-gray-400 mb-1">Category</label>
                  <select className="form-select block w-full pl-3 pr-10 py-2 text-base border-gray-200 bg-gray-50 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-sm">
                     <option>All Category</option>
                     <option>Developments</option>
                     <option>Design</option>
                     <option>Marketing</option>
                  </select>
               </div>

               {/* Rating */}
               <div className="flex flex-col w-full sm:w-40">
                  <label className="text-xs text-gray-400 mb-1">Rating</label>
                  <select className="form-select block w-full pl-3 pr-10 py-2 text-base border-gray-200 bg-gray-50 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-sm">
                     <option>4 Star & Up</option>
                     <option>3 Star & Up</option>
                  </select>
               </div>
            </div>
         </div>

         {/* Courses Grid */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {COURSES_DATA.map((course) => (
               <CourseCard key={course.id} course={course} />
            ))}
         </div>

         {/* Pagination (Visual Only) */}
         <div className="flex justify-center items-center gap-2 mt-12">
            <button className="w-10 h-10 flex items-center justify-center rounded-full text-orange-500 hover:bg-orange-50 disabled:text-gray-300">
               ←
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 font-medium hover:bg-orange-500 hover:text-white transition-colors">
               01
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-orange-500 text-white font-medium shadow-md">
               02
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 font-medium hover:bg-orange-500 hover:text-white transition-colors">
               03
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 font-medium hover:bg-orange-500 hover:text-white transition-colors">
               04
            </button>
            <span className="text-gray-400">...</span>
            <button className="w-10 h-10 flex items-center justify-center rounded-full text-orange-500 hover:bg-orange-50">
               →
            </button>
         </div>
      </div>
   );
}
