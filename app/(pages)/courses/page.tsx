'use client';
import React, { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { CourseCard } from '@/app/components/global/CourseCard/CourseCard';
import { Pagination } from '@/app/components/global/Pagination/Pagination';

export interface Course {
   id: string;
   image: string;
   category: string;
   title: string;
   progress?: number;
}

//call api to get courses data
export const COURSES_DATA: Course[] = [
   {
      id: '1',
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000',
      category: 'Learn Ethical Hacking From Scratch',
      title: '31. Learn More About Web Design',
      progress: undefined,
   },
   {
      id: '2',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1000',
      category: 'SQL for NEWBS: Weekender Crash Course',
      title: '165. Font Properties Challenge 3 - Change...',
      progress: 2,
   },
   {
      id: '3',
      image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1000',
      category: 'Complete Adobe Lightroom Megacourse: Begin...',
      title: '7. Adding Content to Our Website',
      progress: undefined,
   },
   {
      id: '4',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1000',
      category: 'Machine Learning A-Z™: Hands-On Python & R I...',
      title: '651. CSS Font Property Challenge Soluti...',
      progress: 23,
   },
   {
      id: '5',
      image: 'https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?auto=format&fit=crop&q=80&w=1000',
      category: 'Premiere Pro CC for Beginners: Video Editing in...',
      title: '7. Adding Content to Our Website',
      progress: 26,
   },
   {
      id: '6',
      image: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&q=80&w=1000',
      category: 'Graphic Design Masterclass - Learn GREAT De...',
      title: '17. The Dark Art of Centering Elements w...',
      progress: 21,
   },
   {
      id: '7',
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1000',
      category: 'Angular - The Complete Guide (2021 Edition)',
      title: '54. CSS Static and Relative Positioning',
      progress: undefined,
   },
   {
      id: '8',
      image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=1000',
      category: 'Complete Blender Creator: Learn 3D Modelling...',
      title: '6. Learn More About Typography',
      progress: 52,
   },
   {
      id: '9',
      image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=1000',
      category: 'Ultimate Google Ads Training 2020: Profit with...',
      title: '1. Introductions',
      progress: undefined,
   },
   {
      id: '10',
      image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=1000',
      category: 'SEO 2021: Complete SEO Training + SEO for W...',
      title: '1. Introductions',
      progress: undefined,
   },
   {
      id: '11',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1000',
      category: 'Instagram Marketing 2021: Complete Guide To I...',
      title: '54. CSS Static and Relative Positioning',
      progress: 52,
   },
   {
      id: '12',
      image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=1000',
      category: '[NEW] Ultimate AWS Certified Cloud Practitio...',
      title: '91. CSS Float and Clear',
      progress: 13,
   },
];

interface SelectProps {
   label: string;
   options: string[];
}

export const Select: React.FC<SelectProps> = ({ label, options }) => (
   <div className="flex flex-col gap-1.5 w-full md:w-auto">
      <label className="text-xs text-gray-500 font-medium ml-1">{label}</label>
      <div className="relative">
         <select className="w-full md:w-48 appearance-none bg-white border border-gray-200 text-gray-700 py-2.5 pl-3 pr-8 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-300 transition-shadow cursor-pointer">
            {options.map((opt, i) => (
               <option key={i}>{opt}</option>
            ))}
         </select>
         <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
            <ChevronDown size={14} />
         </div>
      </div>
   </div>
);

interface FilterBarProps {
   searchQuery: string;
   onSearchChange: (val: string) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
   searchQuery,
   onSearchChange,
}) => (
   <div className="flex flex-col lg:flex-row gap-4 lg:items-end justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8">
      {/* Search Input */}
      <div className="grow w-full lg:max-w-md">
         <label className="text-xs text-gray-500 font-medium ml-1 mb-1.5 block">
            Search:
         </label>
         <div className="relative">
            <input
               type="text"
               placeholder="Search in your courses..."
               value={searchQuery}
               onChange={(e) => onSearchChange(e.target.value)}
               className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-300 transition-all placeholder:text-gray-400"
            />
            <Search
               className="absolute left-3 top-2.5 text-gray-400"
               size={18}
            />
         </div>
      </div>

      {/* Dropdowns */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full lg:w-auto">
         <Select
            label="Sort by:"
            options={['Latest', 'Oldest', 'Popularity', 'A-Z']}
         />
         <Select
            label="Status:"
            options={['All Courses', 'In Progress', 'Completed', 'Not Started']}
         />
         <Select
            label="Teacher:"
            options={['All Teachers', 'Ahmed', 'Abdelrahman', 'Remon']}
         />
      </div>
   </div>
);

export default function CoursesPage() {
   const [searchQuery, setSearchQuery] = useState('');
   const [currentPage, setCurrentPage] = useState(1);

   // Filtering Logic
   const filteredCourses = COURSES_DATA.filter(
      (course) =>
         course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
         course.category.toLowerCase().includes(searchQuery.toLowerCase())
   );

   return (
      <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 font-sans text-slate-800">
         <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
               <h1 className="text-2xl font-bold text-gray-900">
                  Courses{' '}
                  <span className="text-gray-400 font-normal text-lg">
                     ({filteredCourses.length})
                  </span>
               </h1>
            </div>

            {/* Filters */}
            <FilterBar
               searchQuery={searchQuery}
               onSearchChange={setSearchQuery}
            />

            {/* Grid */}
            {filteredCourses.length === 0 ? (
               <div className="text-center py-20 text-gray-400">
                  No courses found matching your criteria.
               </div>
            ) : (
               <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                     {filteredCourses.map((course) => (
                        <CourseCard key={course.id} course={course} />
                     ))}
                  </div>

                  {/* Pagination Section */}
                  <Pagination
                     currentPage={currentPage}
                     totalPages={5}
                     onPageChange={setCurrentPage}
                  />
               </>
            )}
         </div>
      </div>
   );
}
