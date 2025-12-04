'use client';

import Image from 'next/image';
import { Star, ArrowRight, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// --- Types & Interfaces ---
interface Course {
   id: number;
   image: string;
   category: string;
   price: number;
   title: string;
   rating: number;
   students: string;
   categoryColor: string;
}

interface Tool {
   name: string;
   count: string;
   highlight?: boolean;
}

interface Instructor {
   id: number;
   image: string;
   name: string;
   role: string;
   rating: number;
   students: string;
   specialties: string[];
}

// --- Data (Single Source of Truth) ---
const DB_COURSES: Course[] = [
   {
      id: 1,
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&q=80',
      category: 'DESIGN',
      categoryColor: 'bg-orange-100 text-orange-600',
      price: 57,
      title: 'Machine Learning A-Z™: Hands-On Python & R In Data...',
      rating: 5.0,
      students: '265.7K',
   },
   {
      id: 2,
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=500&q=80',
      category: 'DEVELOPMENTS',
      categoryColor: 'bg-purple-100 text-purple-600',
      price: 57,
      title: 'The Complete 2021 Web Development Bootcamp',
      rating: 5.0,
      students: '265.7K',
   },
   {
      id: 3,
      image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&q=80',
      category: 'BUSINESS',
      categoryColor: 'bg-green-100 text-green-600',
      price: 57,
      title: 'Learn Python Programming Masterclass',
      rating: 5.0,
      students: '265.7K',
   },
   {
      id: 4,
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&q=80',
      category: 'MARKETING',
      categoryColor: 'bg-blue-100 text-blue-600',
      price: 57,
      title: 'The Complete Digital Marketing Course - 12 Courses in 1',
      rating: 5.0,
      students: '265.7K',
   },
   {
      id: 5,
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&q=80',
      category: 'IT & SOFTWARE',
      categoryColor: 'bg-red-100 text-red-600',
      price: 57,
      title: 'Reiki Level I, II and Master/Teacher Program',
      rating: 5.0,
      students: '265.7K',
   },
];

const DB_TOOLS: Tool[] = [
   { name: 'HTML 5', count: '2,736 Courses' },
   { name: 'CSS 3', count: '13,832 Courses' },
   { name: 'Javascript', count: '52,822 Courses' },
   { name: 'Saas', count: '20,126 Courses' },
   { name: 'Laravel', count: '6,186 Courses', highlight: true },
   { name: 'Django', count: '22,649 Courses' },
   { name: 'React', count: '15,200 Courses' },
   { name: 'Node.js', count: '11,500 Courses' },
   { name: 'Vue.js', count: '8,900 Courses' },
];

const DB_INSTRUCTORS: Instructor[] = [
   {
      id: 1,
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&q=80',
      name: 'Devon Lane',
      role: 'Web Developer',
      rating: 5.0,
      students: '265.7K',
      specialties: ['Web Development', 'Developments', 'Website', 'HTML 5'],
   },
   {
      id: 2,
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&q=80',
      name: 'Darrell Steward',
      role: 'React Native Developer',
      rating: 5.0,
      students: '265.7K',
      specialties: ['Developments', 'Technology', 'Programing'],
   },
   {
      id: 3,
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&q=80',
      name: 'Jane Cooper',
      role: 'Mobile Developer',
      rating: 5.0,
      students: '265.7K',
      specialties: ['Technology', 'Programing', 'Responsive Developments'],
   },
   {
      id: 4,
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&q=80',
      name: 'Albert Flores',
      role: 'Javascript Developer',
      rating: 5.0,
      students: '265.7K',
      specialties: ['Web Development', 'Javascript', 'HTML 5', 'Developments'],
   },
   {
      id: 5,
      image: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=500&q=80',
      name: 'Kathryn Murphy',
      role: 'Lead Developer',
      rating: 5.0,
      students: '265.7K',
      specialties: ['Web Development', 'Wordpress', 'Website', 'Developments'],
   },
];

const KEYWORDS = [
   'HTML 5',
   'Web Development',
   'Responsive Developments',
   'Developments',
   'Programing',
   'Website',
   'Technology',
   'Wordpress',
];

// --- Sub-Components (Kept Pure for Design) ---

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
   <h2 className="text-2xl md:text-3xl font-bold text-[#1D2026] mb-8 text-center transition-all duration-300">
      {children}
   </h2>
);

const CourseCard = ({
   course,
   onCategoryClick,
}: {
   course: Course;
   onCategoryClick: (cat: string) => void;
}) => (
   <div className="bg-white border border-gray-100 hover:shadow-lg transition-shadow duration-300 flex flex-col h-full cursor-pointer overflow-hidden rounded-lg group">
      <div className="relative w-full aspect-[4/3] mb-4">
         <Image
            src={course.image}
            alt={course.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
         />
      </div>
      <div className="flex justify-between items-center mb-3 text-xs font-semibold px-2">
         <button
            onClick={(e) => {
               e.stopPropagation();
               onCategoryClick(course.category);
            }}
            className={cn(
               'px-2 py-1 rounded-sm uppercase hover:brightness-95 active:scale-95 transition-all',
               course.categoryColor
            )}
         >
            {course.category}
         </button>
         <span className="text-[#FF6636] text-lg">${course.price}</span>
      </div>
      <h3 className="text-[#1D2026] font-medium text-sm md:text-base leading-snug line-clamp-2 mb-4 flex-grow px-2">
         {course.title}
      </h3>
      <hr className="border-gray-100 mb-3" />
      <div className="flex justify-between items-center text-sm text-[#6E7485] px-2 pb-4">
         <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-[#FD8E1F] text-[#FD8E1F]" />
            <span className="font-semibold text-[#1D2026]">
               {course.rating}
            </span>
         </div>
         <span>
            <span className="font-semibold text-[#1D2026]">
               {course.students}
            </span>{' '}
            students
         </span>
      </div>
   </div>
);

const ToolCard = ({ tool }: { tool: Tool }) => (
   <div
      className={cn(
         'border p-4 text-center transition-all cursor-pointer min-w-[160px] rounded-md shrink-0 snap-start',
         tool.highlight
            ? 'border-red-100 bg-red-50/30'
            : 'border-gray-100 bg-white hover:border-[#FF6636] hover:shadow-sm'
      )}
   >
      <div
         className={cn(
            'font-bold text-sm mb-1',
            tool.highlight ? 'text-[#FF6636]' : 'text-[#1D2026]'
         )}
      >
         {tool.name}
      </div>
      <div className="text-xs text-[#8C94A3]">{tool.count}</div>
   </div>
);

const InstructorCard = ({ instructor }: { instructor: Instructor }) => (
   <div className="bg-white border border-gray-100 p-0 hover:shadow-lg transition-shadow duration-300 overflow-hidden rounded-lg">
      <div className="relative w-full aspect-square ">
         <Image
            src={instructor.image}
            alt={instructor.name}
            fill
            className="object-cover"
         />
      </div>
      <div className="p-4 text-center">
         <h3 className="text-[#1D2026] font-bold text-base mb-1">
            {instructor.name}
         </h3>
         <p className="text-[#8C94A3] text-sm mb-3">{instructor.role}</p>
         <hr className="border-gray-100" />
         <div className="flex justify-between items-center text-sm text-[#6E7485] pt-3 ">
            <div className="flex items-center gap-1">
               <Star className="w-4 h-4 fill-[#FD8E1F] text-[#FD8E1F]" />
               <span className="font-semibold text-[#1D2026]">
                  {instructor.rating}
               </span>
            </div>
            <span>
               <span className="font-semibold text-[#1D2026]">
                  {instructor.students}
               </span>{' '}
               students
            </span>
         </div>
      </div>
   </div>
);

// --- Main Page Logic ---
function HomePageContent() {
   const router = useRouter();
   const searchParams = useSearchParams();
   const toolsContainerRef = useRef<HTMLDivElement>(null);

   // 1. URL State (Read Only)
   const categoryParam = searchParams.get('category');
   const currentCategory = categoryParam || 'ALL';

   // 2. Local State for Instructors Keyword
   const [selectedKeyword, setSelectedKeyword] = useState('Web Development');

   // Logic: Filter Courses (Instant / Synchronous)
   const displayCourses =
      currentCategory === 'ALL'
         ? DB_COURSES
         : DB_COURSES.filter(
              (c) => c.category.toUpperCase() === currentCategory.toUpperCase()
           );

   // Logic: Filter Instructors (Instant)
   const displayInstructors = DB_INSTRUCTORS.filter((inst) =>
      inst.specialties.includes(selectedKeyword)
   );

   // Handlers
   const handleCategoryClick = (category: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('category', category);
      router.push(`?${params.toString()}`);
   };

   const scrollTools = (direction: 'left' | 'right') => {
      if (toolsContainerRef.current) {
         const scrollAmount = 200;
         const container = toolsContainerRef.current;
         container.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth',
         });
      }
   };

   return (
      <main className="min-h-screen bg-white font-sans pb-20">
         {/* Section 1: Best Selling Courses */}
         <section className="py-16 container mx-auto px-4 md:px-6 min-h-[500px]">
            <div className="flex flex-col items-center">
               <SectionTitle>
                  Best selling courses in{' '}
                  {currentCategory === 'ALL'
                     ? 'Web Development'
                     : currentCategory}
               </SectionTitle>

               {currentCategory !== 'ALL' && (
                  <button
                     onClick={() => router.push('/')}
                     className="mb-6 text-sm text-[#FF6636] hover:underline"
                  >
                     Show All Categories
                  </button>
               )}
            </div>

            {displayCourses.length > 0 ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 animate-in fade-in duration-500">
                  {displayCourses.map((course) => (
                     <CourseCard
                        key={course.id}
                        course={course}
                        onCategoryClick={handleCategoryClick}
                     />
                  ))}
               </div>
            ) : (
               <div className="text-center py-20 text-gray-500 bg-gray-50 rounded-lg">
                  No courses found in the category{' '}
                  <strong>{currentCategory}</strong>.
                  <br />
                  <button
                     onClick={() => router.push('/')}
                     className="text-[#FF6636] mt-2 underline"
                  >
                     Go back
                  </button>
               </div>
            )}
         </section>

         {/* Section 2: Popular Tools */}
         <section className="py-8 container mx-auto px-4 md:px-6">
            <div className="flex justify-between items-end mb-6">
               <h3 className="text-xl font-bold text-[#1D2026]">
                  Popular tools
               </h3>
               <div className="flex gap-2">
                  <button
                     onClick={() => scrollTools('left')}
                     className="p-2 border rounded hover:bg-[#FF6636] hover:text-white hover:border-[#FF6636] text-gray-500 transition-colors"
                  >
                     <ArrowLeft className="w-4 h-4" />
                  </button>
                  <button
                     onClick={() => scrollTools('right')}
                     className="p-2 border rounded hover:bg-[#FF6636] hover:text-white hover:border-[#FF6636] text-gray-500 transition-colors"
                  >
                     <ArrowRight className="w-4 h-4" />
                  </button>
               </div>
            </div>

            <div
               ref={toolsContainerRef}
               className="flex gap-4 overflow-x-auto pb-4 mb-8 scrollbar-hide snap-x"
               style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
               {DB_TOOLS.map((tool, idx) => (
                  <ToolCard key={idx} tool={tool} />
               ))}
            </div>

            {/* Popular Keywords */}
            <div className="flex flex-wrap items-center gap-3">
               <span className="text-[#1D2026] font-medium mr-2">
                  Popular keyword:
               </span>
               {KEYWORDS.map((keyword, idx) => {
                  const isActive = keyword === selectedKeyword;
                  return (
                     <button
                        key={idx}
                        onClick={() => setSelectedKeyword(keyword)}
                        className={cn(
                           'px-4 py-2 text-sm rounded-md cursor-pointer transition-colors border outline-none',
                           isActive
                              ? 'bg-[#FF6636] text-white border-[#FF6636]'
                              : 'bg-gray-50 text-[#1D2026] border-transparent hover:bg-gray-100'
                        )}
                     >
                        {keyword}
                     </button>
                  );
               })}
            </div>
         </section>

         {/* Section 3: Popular Instructors */}
         <section className="py-16 bg-[#F5F7FA] mt-12 transition-colors duration-500">
            <div className="container mx-auto px-4 md:px-6">
               <SectionTitle>
                  Popular instructor in{' '}
                  <span className="text-[#FF6636]">{selectedKeyword}</span>
               </SectionTitle>

               {displayInstructors.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 animate-in fade-in duration-500">
                     {displayInstructors.map((instructor) => (
                        <InstructorCard
                           key={instructor.id}
                           instructor={instructor}
                        />
                     ))}
                  </div>
               ) : (
                  <div className="text-center py-10 text-gray-500">
                     No instructors found for {selectedKeyword}.
                  </div>
               )}
            </div>
         </section>
      </main>
   );
}

// Suspense is technically required for useSearchParams in Client Components
export default function HomePage() {
   return (
      <Suspense fallback={<div className="min-h-screen bg-white" />}>
         <HomePageContent />
      </Suspense>
   );
}
