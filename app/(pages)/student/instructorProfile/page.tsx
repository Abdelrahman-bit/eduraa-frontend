'use client';
import React from 'react';
import { Users, PlayCircle } from 'lucide-react';
import CourseCard from '@/components/student/CourseCard';

export default function InstructorProfilePage({
   params,
}: {
   params: { id: string };
}) {
   const instructor = {
      id: params.id,
      name: 'Kevin Gilbert',
      title: 'Web Designer & Best-Selling Instructor',
      image: 'https://ui-avatars.com/api/?name=Kevin+Gilbert&background=1D2026&color=fff&size=200',
      students: '236,568',
      coursesCount: 23,
      about: `He decided to work on his dream to be his own boss, travel the world, only do the work he enjoyed, and make a lot more money in the process. No more begging for vacation days and living from paycheck to paycheck. After trying everything from e-commerce stores to professional poker his lucky break came when he started freelance design. Vako fell in love with the field that gives him the lifestyle of his dreams.`,
   };

   const instructorCourses = [
      {
         id: 101,
         title: 'Machine Learning A-Z™: Hands-On Python & R In Data Science',
         category: 'Development',
         image: 'https://img-c.udemycdn.com/course/750x422/950390_270f_3.jpg',
         progress: 0,
      },
      {
         id: 102,
         title: 'The Complete 2024 Web Development Bootcamp',
         category: 'Development',
         image: 'https://img-c.udemycdn.com/course/750x422/1565838_e54e_18.jpg',
         progress: 0,
      },
      {
         id: 103,
         title: 'Learn Ethical Hacking From Scratch',
         category: 'IT & Software',
         image: 'https://img-c.udemycdn.com/course/750x422/857010_8239_2.jpg',
         progress: 0,
      },
   ];

   return (
      <div className="space-y-10">
         <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-lg shrink-0">
               <img
                  src={instructor.image}
                  alt={instructor.name}
                  className="w-full h-full object-cover"
               />
            </div>

            <div className="flex-1 space-y-4 pt-2">
               <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                     {instructor.name}
                  </h1>
                  <p className="text-gray-500 font-medium">
                     {instructor.title}
                  </p>
               </div>

               <div className="flex gap-6">
                  <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-3 py-1 rounded-full text-sm">
                     <PlayCircle size={16} />
                     <span>{instructor.coursesCount} Courses</span>
                  </div>
               </div>
            </div>

            <button className="bg-[#FFEEE8] text-[#FF6636] px-6 py-3 rounded-md font-semibold hover:bg-[#FF6636] hover:text-white transition-colors">
               Send Message
            </button>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-4 space-y-4">
               <h3 className="text-xl font-bold text-gray-900">About Me</h3>
               <p className="text-gray-500 leading-relaxed text-sm">
                  {instructor.about}
               </p>
            </div>

            <div className="lg:col-span-8 space-y-6">
               <div className="border-b border-gray-100 flex gap-8">
                  <button className="pb-3 text-[#FF6636] border-b-2 border-[#FF6636] font-semibold">
                     Courses ({instructorCourses.length})
                  </button>
                  {/* <button className="pb-3 text-gray-500 hover:text-gray-800 transition">
                    Reviews
                </button> */}
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {instructorCourses.map((course) => (
                     <div key={course.id} className="h-full">
                        <CourseCard {...course} />
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
   );
}
