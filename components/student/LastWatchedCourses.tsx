'use client';
import React from 'react';
import CourseCard, { CourseProps } from './CourseCard';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const LastWatchedCourses = () => {
   // data from api or backend (should be dynamic later)
   const courses: CourseProps[] = [
      {
         id: 1,
         category: 'Reiki Level I, II and Master/Teacher Program',
         title: '1. Introductions',
         image: 'https://img-c.udemycdn.com/course/750x422/394676_ce3d_5.jpg',
         progress: 0,
      },
      {
         id: 2,
         category: 'The Complete 2024 Web Development Bootcamp',
         title: "167. What You'll Need to Get Started",
         image: 'https://img-c.udemycdn.com/course/750x422/1565838_e54e_18.jpg',
         progress: 61,
      },
      {
         id: 3,
         category: 'Copywriting - Become a Freelance Copywriter',
         title: '1. How to get started with figma',
         image: 'https://img-c.udemycdn.com/course/750x422/405926_02c8_2.jpg',
         progress: 0,
      },
      {
         id: 4,
         category: '2024 Complete Python Bootcamp From Zero',
         title: '9. Advanced CSS - Selector Priority',
         image: 'https://img-c.udemycdn.com/course/750x422/567828_67d0.jpg',
         progress: 12,
      },
   ];

   return (
      <section>
         {/* الهيدر: العنوان والأسهم */}
         <div className="flex justify-between items-end mb-6">
            <div>
               <h2 className="text-xl font-bold text-gray-900">
                  Let’s start learning, Kevin
               </h2>
               <p className="text-sm text-gray-500 mt-1">
                  Pick up where you left off
               </p>
            </div>

            {/*can not scroll now */}
            <div className="flex gap-2">
               <button className="p-2 rounded bg-gray-100 hover:bg-[#FF6636] hover:text-white transition text-gray-600">
                  <ArrowLeft size={20} />
               </button>
               <button className="p-2 rounded bg-gray-100 hover:bg-[#FF6636] hover:text-white transition text-gray-600">
                  <ArrowRight size={20} />
               </button>
            </div>
         </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map((course) => (
               <CourseCard key={course.id} {...course} />
            ))}
         </div>
      </section>
   );
};

export default LastWatchedCourses;
