import Image from 'next/image';
import React from 'react';
import { FaStar, FaFacebookF } from 'react-icons/fa';
import { FaCirclePlay } from 'react-icons/fa6';
import { LuUsersRound } from 'react-icons/lu';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CourseCard from '@/app/components/Home_Page/CourseCard/CourseCard';

export default function InstructorDetails() {
   return (
      <section className="section-boundary my-10 flex flex-col gap-10">
         <div className="flex justify-between items-center  p-10 border border-gray-scale-100 shadow-sm">
            <div className="flex gap-3 items-center">
               <Image
                  src="/instructors/instructor-1.jpg"
                  alt="Instructor"
                  width={150}
                  height={150}
                  className="rounded-full"
               />
               <div className="flex flex-col gap-1 ">
                  <h3 className="font-semibold text-gray-scale-900 text-heading-3">
                     Vako Shvili
                  </h3>
                  <p className="text-gray-scale-600 text-body-lg">
                     Web Designer & Best-Selling Instructor
                  </p>
                  <div className="flex gap-5 justify-between mt-2  ">
                     <div className="flex items-center gap-1">
                        <FaStar size={16} className="text-primary-500" />
                        <p className="text-body-md font-medium text-gray-scale-900">
                           5.0
                        </p>
                        <p className="text-gray-scale-600 text-body-md">
                           (134,633 review)
                        </p>
                     </div>
                     <div className="flex items-center gap-1">
                        <LuUsersRound size={16} className="text-primary-500" />
                        <p className="text-body-md font-medium text-gray-scale-900">
                           431,500
                        </p>
                        <p className="text-gray-scale-600 text-body-md">
                           students
                        </p>
                     </div>
                     <div className="flex items-center gap-1">
                        <FaCirclePlay size={16} className="text-primary-500" />
                        <p className="text-body-md font-medium text-gray-scale-900">
                           7
                        </p>
                        <p className="text-gray-scale-600 text-body-md">
                           courses
                        </p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         <div className="flex gap-6 ">
            <div className="flex-1 p-6 border border-gray-scale-100 shadow-sm self-start">
               <h5 className="text-label-xl text-gray-scale-900 uppercase font-semibold mb-3">
                  About Me
               </h5>
               <p className="text-body-md text-gray-scale-600 leading-loose">
                  One day Vako had enough with the 9-to-5 grind, or more like
                  9-to-9 in his case, and quit his job, or more like got himself
                  fired from his own startup. He decided to work on his dream:
                  be his own boss, travel the world, only do the work he
                  enjoyed, and make a lot more money in the process. No more
                  begging for vacation days and living from paycheck to
                  paycheck. After trying everything from e-commerce stores to
                  professional poker his lucky break came when he started
                  freelance design. Vako fell in love with the field that gives
                  him the lifestyle of his dreams. Vako realizes that people who
                  take courses on Udemy want to transform their lives. Today
                  with his courses and mentoring Vako is helping thousands of
                  people transform their lives, just like he did once.
               </p>
            </div>
            <div className="flex-2  rounded-sm">
               <Tabs defaultValue="account" className="w-full rounded-none">
                  <TabsList className="bg-transparent w-full h-[50px]  rounded-sm">
                     <TabsTrigger
                        value="courses"
                        className="data-[state=active]:bg-primary-500 data-[state=active]:text-white font-semibold"
                     >
                        Courses
                     </TabsTrigger>
                     <TabsTrigger
                        value="reviews"
                        className="data-[state=active]:bg-primary-500 data-[state=active]:text-white font-semibold "
                     >
                        Reviews
                     </TabsTrigger>
                  </TabsList>
                  <TabsContent value="courses">
                     <h3 className="text-heading-4 font-semibold px-6">
                        Vako Courses (02)
                     </h3>
                     <div className="grid grid-cols-3 gap-4 p-6">
                        <CourseCard />
                        <CourseCard />
                        <CourseCard />
                        <CourseCard />
                        <CourseCard />
                        <CourseCard />
                     </div>
                  </TabsContent>
                  <TabsContent value="reviews">
                     <div className="bg-secondary-300 ">Coming Soon</div>
                  </TabsContent>
               </Tabs>
            </div>
         </div>
      </section>
   );
}
