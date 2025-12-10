'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ChevronDown, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { CourseCard } from '@/app/components/global/CourseCard/CourseCard';
import { Pagination } from '@/app/components/global/Pagination/Pagination';
import { fetchMyCourses, Section } from '@/app/services/courses';

export interface Course {
   id: string;
   image: string;
   category: string;
   title: string;
   progress?: number;
}

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

   const [progressOverrides, setProgressOverrides] = useState<
      Record<string, number>
   >({});

   // Fetch my courses from API
   const { data, isLoading, isError } = useQuery({
      queryKey: ['myCourses'],
      queryFn: fetchMyCourses,
   });

   // Sync progress with LocalStorage (client-side only)
   useEffect(() => {
      if (data?.studentCourses) {
         const newOverrides: Record<string, number> = {};
         data.studentCourses.forEach((enrollment) => {
            const courseId = enrollment.course._id;
            // Try to find local progress
            const stored = localStorage.getItem(`course_${courseId}_completed`);
            if (stored) {
               try {
                  const localCompleted: string[] = JSON.parse(stored);
                  // Helper to get total lectures
                  const totalLectures =
                     enrollment.course.curriculum?.sections?.reduce(
                        (acc: number, section: Section) =>
                           acc + (section.lectures?.length || 0),
                        0
                     ) || 0;

                  if (totalLectures > 0) {
                     const percentage = Math.round(
                        (localCompleted.length / totalLectures) * 100
                     );
                     newOverrides[courseId] = percentage;
                  }
               } catch (e) {
                  console.error('Error parsing local progress', e);
               }
            }
         });
         // eslint-disable-next-line react-hooks/set-state-in-effect
         setProgressOverrides(newOverrides);
      }
   }, [data]);

   // Transform API data to match CourseCard interface
   const courses: Course[] =
      data?.studentCourses?.map((enrollment) => {
         // Determine progress: Override > API Percentage > Calculated from API
         let progress =
            progressOverrides[enrollment.course._id] ??
            enrollment.progress?.progressPercentage;

         if (progress === undefined) {
            const totalLectures =
               enrollment.course.curriculum?.sections?.reduce(
                  (acc: number, section: Section) =>
                     acc + (section.lectures?.length || 0),
                  0
               ) || 0;
            const completedCount =
               enrollment.progress?.completedLectures?.length || 0;
            if (totalLectures > 0) {
               progress = Math.round((completedCount / totalLectures) * 100);
            }
         }

         return {
            id: enrollment.course._id,
            image:
               enrollment.course.advancedInfo.thumbnailUrl ||
               'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000',
            category: enrollment.course.basicInfo.category,
            title: enrollment.course.basicInfo.title,
            progress: progress || 0,
         };
      }) || [];

   // Filtering Logic
   const filteredCourses = courses.filter(
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

            {/* Loading State */}
            {isLoading && (
               <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
               </div>
            )}

            {/* Error State */}
            {isError && (
               <div className="text-center py-20">
                  <p className="text-red-500 mb-4">
                     Failed to load your courses
                  </p>
                  <button
                     onClick={() => window.location.reload()}
                     className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                  >
                     Retry
                  </button>
               </div>
            )}

            {/* Grid */}
            {!isLoading && !isError && (
               <>
                  {filteredCourses.length === 0 ? (
                     <div className="text-center py-20">
                        <p className="text-gray-400 mb-4">
                           {searchQuery
                              ? 'No courses found matching your criteria.'
                              : "You haven't enrolled in any courses yet."}
                        </p>
                        {!searchQuery && (
                           <Link
                              href="/all-courses"
                              className="inline-block px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                           >
                              Browse Courses
                           </Link>
                        )}
                     </div>
                  ) : (
                     <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                           {filteredCourses.map((course) => (
                              <CourseCard key={course.id} course={course} />
                           ))}
                        </div>

                        {/* Pagination Section */}
                        {filteredCourses.length > 12 && (
                           <Pagination
                              currentPage={currentPage}
                              totalPages={Math.ceil(
                                 filteredCourses.length / 12
                              )}
                              onPageChange={setCurrentPage}
                           />
                        )}
                     </>
                  )}
               </>
            )}
         </div>
      </div>
   );
}
