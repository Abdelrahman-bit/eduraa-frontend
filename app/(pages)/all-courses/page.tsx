'use client';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
   Search,
   Filter,
   ChevronDown,
   ChevronRight,
   Loader2,
   X,
   ChevronLeft,
} from 'lucide-react';
import { fetchPublishedCourses } from '@/app/services/courses';
import CourseListCard from '@/app/components/all-courses/ui/CourseListCard';
import CourseCardSkeleton from '@/app/components/all-courses/ui/CourseCardSkeleton';
import FilterSidebar from '@/app/components/all-courses/ui/FilterSidebar';
import Link from 'next/link';

const App = () => {
   const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
   const [isDesktopFiltersOpen, setIsDesktopFiltersOpen] = useState(true);
   const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
   const [selectedTools, setSelectedTools] = useState<string[]>([]);
   const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
   const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
   const [searchQuery, setSearchQuery] = useState('');
   const [currentPage, setCurrentPage] = useState(1);
   const [sortBy, setSortBy] = useState<
      'trending' | 'newest' | 'price-low' | 'price-high' | 'rating'
   >('trending');
   const [showSortMenu, setShowSortMenu] = useState(false);

   const ITEMS_PER_PAGE = 12;

   // Fetch all courses with filters (Client-side pagination requires fetching all)
   const { data, isLoading, isError, error } = useQuery({
      queryKey: [
         'courses',
         selectedCategories,
         selectedLevels,
         selectedRatings,
      ],
      queryFn: () => {
         const filters = {
            category: selectedCategories[0],
            level: selectedLevels[0],
            rating:
               selectedRatings.length > 0
                  ? Math.min(...selectedRatings)
                  : undefined,
            page: 1,
            limit: 1000, // Fetch all (or a large enough number)
         };
         return fetchPublishedCourses(filters);
      },
   });

   const allCourses = data?.data || [];

   // Client-side filtering (backup if API doesn't filter properly)
   let courses = allCourses.filter((course) => {
      // Search filter
      if (searchQuery) {
         const query = searchQuery.toLowerCase();
         const matchesSearch =
            course.basicInfo.title.toLowerCase().includes(query) ||
            course.basicInfo.subtitle.toLowerCase().includes(query) ||
            course.basicInfo.category.toLowerCase().includes(query);
         if (!matchesSearch) return false;
      }

      // Level filter (client-side backup)
      if (selectedLevels.length > 0) {
         if (!selectedLevels.includes(course.basicInfo.level)) {
            return false;
         }
      }

      // Category filter (client-side backup)
      if (selectedCategories.length > 0) {
         if (!selectedCategories.includes(course.basicInfo.category)) {
            return false;
         }
      }

      // Tools filter (matches against course tags)
      if (selectedTools.length > 0) {
         if (!course.tags || course.tags.length === 0) {
            return false;
         }
         const hasMatchingTool = selectedTools.some((tool) =>
            course.tags.some(
               (tag) =>
                  tag.toLowerCase().includes(tool.toLowerCase()) ||
                  tool.toLowerCase().includes(tag.toLowerCase())
            )
         );
         if (!hasMatchingTool) {
            return false;
         }
      }

      return true;
   });

   // Sort courses
   courses = [...courses].sort((a, b) => {
      switch (sortBy) {
         case 'price-low':
            return a.price.amount - b.price.amount;
         case 'price-high':
            return b.price.amount - a.price.amount;
         case 'newest':
            return (
               new Date(b.createdAt || 0).getTime() -
               new Date(a.createdAt || 0).getTime()
            );
         case 'rating':
            // Since we don't have rating in API response, keep original order
            return 0;
         case 'trending':
         default:
            return 0;
      }
   });

   // Pagination Logic
   const totalPages = Math.ceil(courses.length / ITEMS_PER_PAGE);
   const paginatedCourses = courses.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
   );

   // Ensure we don't stay on a non-existent page if filters reduce results
   // React allows updating state during render to handle derived state changes (prevents flickering)
   if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(1);
   }

   const activeFiltersCount =
      selectedCategories.length +
      selectedTools.length +
      selectedRatings.length +
      selectedLevels.length;

   // Close sort menu when clicking outside
   useEffect(() => {
      const handleClickOutside = () => {
         if (showSortMenu) setShowSortMenu(false);
      };

      if (showSortMenu) {
         document.addEventListener('click', handleClickOutside);
         return () => document.removeEventListener('click', handleClickOutside);
      }
   }, [showSortMenu]);

   // Reset to page 1 when filters change
   useEffect(() => {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentPage(1);
   }, [selectedCategories, selectedLevels, selectedRatings, searchQuery]);

   // Scroll to top on page change
   useEffect(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
   }, [currentPage]);

   return (
      <div className="min-h-screen bg-gray-50 font-sans text-slate-800">
         {/* --- Top Navigation Bar --- */}
         <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
            <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-4">
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1">
                     <button
                        onClick={() =>
                           setIsMobileFiltersOpen(!isMobileFiltersOpen)
                        }
                        className="flex items-center gap-2 px-4 py-2.5 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors font-medium text-sm lg:hidden"
                     >
                        <Filter className="w-4 h-4" />
                        <span>Filters</span>
                        {activeFiltersCount > 0 && (
                           <span className="flex items-center justify-center bg-orange-500 text-white text-[10px] w-5 h-5 rounded-full">
                              {activeFiltersCount}
                           </span>
                        )}
                     </button>

                     <button
                        onClick={() =>
                           setIsDesktopFiltersOpen(!isDesktopFiltersOpen)
                        }
                        className="hidden lg:flex items-center gap-2 px-4 py-2.5 bg-orange-50 text-orange-600 rounded-lg font-medium text-sm border border-orange-100 hover:bg-orange-100 transition-colors cursor-pointer"
                     >
                        {isDesktopFiltersOpen ? (
                           <ChevronLeft className="w-4 h-4" />
                        ) : (
                           <Filter className="w-4 h-4" />
                        )}
                        <span>
                           {isDesktopFiltersOpen
                              ? 'Hide Filters'
                              : 'Show Filters'}
                        </span>
                        {activeFiltersCount > 0 && (
                           <span className="flex items-center justify-center bg-orange-500 text-white text-[10px] w-5 h-5 rounded-full ml-1">
                              {activeFiltersCount}
                           </span>
                        )}
                     </button>

                     <div className="relative flex-1 max-w-xl group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                        <input
                           type="text"
                           value={searchQuery}
                           onChange={(e) => setSearchQuery(e.target.value)}
                           placeholder="Search courses..."
                           className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-transparent rounded-lg text-sm outline-none focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all"
                        />
                        {searchQuery && (
                           <button
                              onClick={() => setSearchQuery('')}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                           >
                              <X className="w-4 h-4" />
                           </button>
                        )}
                     </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 text-sm text-gray-500">
                     <div className="hidden xl:block">
                        <span className="text-gray-400 mr-2">Suggestion:</span>
                        <span
                           onClick={() => setSearchQuery('user interface')}
                           className="text-gray-600 hover:text-orange-500 cursor-pointer transition-colors mx-1"
                        >
                           user interface
                        </span>
                        <span
                           onClick={() => setSearchQuery('user experience')}
                           className="text-gray-600 hover:text-orange-500 cursor-pointer transition-colors mx-1"
                        >
                           user experience
                        </span>
                        <span
                           onClick={() => setSearchQuery('web design')}
                           className="text-gray-600 hover:text-orange-500 cursor-pointer transition-colors mx-1"
                        >
                           web design
                        </span>
                     </div>

                     <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 relative">
                           <span className="text-gray-400">Sort by:</span>
                           <div
                              onClick={(e) => {
                                 e.stopPropagation();
                                 setShowSortMenu(!showSortMenu);
                              }}
                              className="relative cursor-pointer group flex items-center gap-1 font-medium text-gray-700 hover:text-orange-500 transition-colors"
                           >
                              {sortBy === 'trending' && 'Trending'}
                              {sortBy === 'newest' && 'Newest'}
                              {sortBy === 'price-low' && 'Price: Low to High'}
                              {sortBy === 'price-high' && 'Price: High to Low'}
                              {sortBy === 'rating' && 'Highest Rated'}
                              <ChevronDown
                                 className={`w-4 h-4 transition-transform ${showSortMenu ? 'rotate-180' : ''}`}
                              />
                           </div>

                           {/* Sort Dropdown Menu */}
                           {showSortMenu && (
                              <div
                                 onClick={(e) => e.stopPropagation()}
                                 className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-2"
                              >
                                 <button
                                    onClick={() => {
                                       setSortBy('trending');
                                       setShowSortMenu(false);
                                    }}
                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-orange-50 transition-colors ${sortBy === 'trending' ? 'text-orange-500 font-medium' : 'text-gray-700'}`}
                                 >
                                    Trending
                                 </button>
                                 <button
                                    onClick={() => {
                                       setSortBy('newest');
                                       setShowSortMenu(false);
                                    }}
                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-orange-50 transition-colors ${sortBy === 'newest' ? 'text-orange-500 font-medium' : 'text-gray-700'}`}
                                 >
                                    Newest
                                 </button>
                                 <button
                                    onClick={() => {
                                       setSortBy('price-low');
                                       setShowSortMenu(false);
                                    }}
                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-orange-50 transition-colors ${sortBy === 'price-low' ? 'text-orange-500 font-medium' : 'text-gray-700'}`}
                                 >
                                    Price: Low to High
                                 </button>
                                 <button
                                    onClick={() => {
                                       setSortBy('price-high');
                                       setShowSortMenu(false);
                                    }}
                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-orange-50 transition-colors ${sortBy === 'price-high' ? 'text-orange-500 font-medium' : 'text-gray-700'}`}
                                 >
                                    Price: High to Low
                                 </button>
                                 <button
                                    onClick={() => {
                                       setSortBy('rating');
                                       setShowSortMenu(false);
                                    }}
                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-orange-50 transition-colors ${sortBy === 'rating' ? 'text-orange-500 font-medium' : 'text-gray-700'}`}
                                 >
                                    Highest Rated
                                 </button>
                              </div>
                           )}
                        </div>
                     </div>
                  </div>
               </div>

               <div className="mt-4 flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-3 lg:hidden">
                  <span>
                     <strong className="text-gray-900">
                        {paginatedCourses.length}
                     </strong>{' '}
                     results of {courses.length}
                  </span>
               </div>
            </div>
         </header>

         {/* --- Main Content Area --- */}
         <main className="max-w-[1600px] mx-auto flex items-start">
            {/* Overlay for mobile sidebar */}
            {isMobileFiltersOpen && (
               <div
                  className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
                  onClick={() => setIsMobileFiltersOpen(false)}
               />
            )}

            {/* Sidebar Component */}
            <FilterSidebar
               isOpen={isMobileFiltersOpen}
               isDesktopOpen={isDesktopFiltersOpen}
               onClose={() => setIsMobileFiltersOpen(false)}
               selectedCategories={selectedCategories}
               setSelectedCategories={setSelectedCategories}
               selectedTools={selectedTools}
               setSelectedTools={setSelectedTools}
               selectedRatings={selectedRatings}
               setSelectedRatings={setSelectedRatings}
               selectedLevels={selectedLevels}
               setSelectedLevels={setSelectedLevels}
            />

            {/* Course Grid Area */}
            <div
               className={`flex-1 p-4 md:p-6 lg:p-8 transition-all duration-300 ${!isDesktopFiltersOpen ? 'lg:max-w-full' : ''}`}
            >
               {/* Active Filters Chips */}
               {activeFiltersCount > 0 && (
                  <div className="mb-6 flex flex-wrap items-center gap-2">
                     <span className="text-sm text-gray-600 font-medium">
                        Active Filters:
                     </span>

                     {selectedCategories.map((cat) => (
                        <div
                           key={cat}
                           className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-700 rounded-full text-sm"
                        >
                           <span>{cat}</span>
                           <button
                              onClick={() =>
                                 setSelectedCategories((prev) =>
                                    prev.filter((c) => c !== cat)
                                 )
                              }
                              className="hover:text-orange-900 transition-colors"
                           >
                              <X className="w-3.5 h-3.5" />
                           </button>
                        </div>
                     ))}

                     {selectedLevels.map((level) => (
                        <div
                           key={level}
                           className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm"
                        >
                           <span className="capitalize">
                              {level.replace('-', ' ')}
                           </span>
                           <button
                              onClick={() =>
                                 setSelectedLevels((prev) =>
                                    prev.filter((l) => l !== level)
                                 )
                              }
                              className="hover:text-blue-900 transition-colors"
                           >
                              <X className="w-3.5 h-3.5" />
                           </button>
                        </div>
                     ))}

                     {selectedRatings.map((rating) => (
                        <div
                           key={rating}
                           className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 text-yellow-700 rounded-full text-sm"
                        >
                           <span>{rating}+ Stars</span>
                           <button
                              onClick={() =>
                                 setSelectedRatings((prev) =>
                                    prev.filter((r) => r !== rating)
                                 )
                              }
                              className="hover:text-yellow-900 transition-colors"
                           >
                              <X className="w-3.5 h-3.5" />
                           </button>
                        </div>
                     ))}

                     {selectedTools.map((tool) => (
                        <div
                           key={tool}
                           className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-sm"
                        >
                           <span>{tool}</span>
                           <button
                              onClick={() =>
                                 setSelectedTools((prev) =>
                                    prev.filter((t) => t !== tool)
                                 )
                              }
                              className="hover:text-purple-900 transition-colors"
                           >
                              <X className="w-3.5 h-3.5" />
                           </button>
                        </div>
                     ))}

                     <button
                        onClick={() => {
                           setSelectedCategories([]);
                           setSelectedTools([]);
                           setSelectedRatings([]);
                           setSelectedLevels([]);
                        }}
                        className="text-sm text-gray-500 hover:text-orange-500 underline transition-colors"
                     >
                        Clear all
                     </button>
                  </div>
               )}

               <div className="flex items-center justify-between mb-6">
                  <div className="hidden lg:block text-sm text-gray-500">
                     <strong className="text-gray-900 font-bold text-lg mr-1">
                        {courses.length}
                     </strong>
                     {courses.length === 1 ? 'result' : 'results'} found
                  </div>
               </div>

               {isLoading && (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                     {[1, 2, 3, 4, 5, 6].map((i) => (
                        <CourseCardSkeleton key={i} />
                     ))}
                  </div>
               )}

               {isError && (
                  <div className="text-center py-12">
                     <p className="text-red-500 text-lg">
                        Error loading courses: {error?.message}
                     </p>
                  </div>
               )}

               {!isLoading && !isError && (
                  <>
                     <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {paginatedCourses.map((course) => (
                           <Link
                              key={course._id}
                              href={`/all-courses/${course._id}`}
                              className="block h-full hover:opacity-95 transition-opacity"
                           >
                              <CourseListCard course={course} />
                           </Link>
                        ))}
                     </div>
                     {courses.length === 0 && (
                        <div className="text-center py-12">
                           <p className="text-gray-500 text-lg">
                              No courses found matching your filters
                           </p>
                        </div>
                     )}
                  </>
               )}

               {/* Pagination */}
               {!isLoading && courses.length > 0 && (
                  <div className="mt-12">
                     <div className="flex flex-col items-center gap-4">
                        <div className="flex items-center justify-center gap-2">
                           {/* Previous Button */}
                           <button
                              onClick={() =>
                                 setCurrentPage((p) => Math.max(1, p - 1))
                              }
                              disabled={currentPage === 1}
                              className="px-4 py-2 rounded-lg flex items-center gap-2 border border-gray-200 text-gray-700 hover:border-orange-500 hover:text-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:disabled:border-gray-200 hover:disabled:text-gray-700 font-medium text-sm"
                           >
                              <ChevronRight className="w-4 h-4 rotate-180" />
                              <span className="hidden sm:inline">Previous</span>
                           </button>

                           {/* Page Numbers */}
                           <div className="flex items-center gap-1">
                              {Array.from(
                                 { length: totalPages },
                                 (_, i) => i + 1
                              ).map((page) => {
                                 if (
                                    page === 1 ||
                                    page === totalPages ||
                                    (page >= currentPage - 1 &&
                                       page <= currentPage + 1)
                                 ) {
                                    return (
                                       <button
                                          key={page}
                                          onClick={() => setCurrentPage(page)}
                                          className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                                             currentPage === page
                                                ? 'bg-orange-500 text-white'
                                                : 'text-gray-600 hover:bg-gray-100'
                                          }`}
                                       >
                                          {page}
                                       </button>
                                    );
                                 } else if (
                                    (page === currentPage - 2 && page > 1) ||
                                    (page === currentPage + 2 &&
                                       page < totalPages)
                                 ) {
                                    return (
                                       <span
                                          key={page}
                                          className="text-gray-400 px-1"
                                       >
                                          ...
                                       </span>
                                    );
                                 }
                                 return null;
                              })}
                           </div>

                           {/* Next Button */}
                           <button
                              onClick={() =>
                                 setCurrentPage((p) =>
                                    Math.min(totalPages, p + 1)
                                 )
                              }
                              disabled={currentPage === totalPages}
                              className="px-4 py-2 rounded-lg flex items-center gap-2 border border-gray-200 text-gray-700 hover:border-orange-500 hover:text-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:disabled:border-gray-200 hover:disabled:text-gray-700 font-medium text-sm"
                           >
                              <span className="hidden sm:inline">Next</span>
                              <ChevronRight className="w-4 h-4" />
                           </button>
                        </div>

                        {/* Results info */}
                        <div className="text-sm text-gray-500">
                           Showing{' '}
                           {Math.min(
                              (currentPage - 1) * ITEMS_PER_PAGE + 1,
                              courses.length
                           )}{' '}
                           -{' '}
                           {Math.min(
                              currentPage * ITEMS_PER_PAGE,
                              courses.length
                           )}{' '}
                           of {courses.length} courses
                        </div>
                     </div>
                  </div>
               )}
            </div>
         </main>
      </div>
   );
};

export default App;
