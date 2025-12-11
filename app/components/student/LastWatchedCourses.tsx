'use client';
import React, { useEffect, useState } from 'react';
import {
   CourseCard,
   Course,
} from '@/app/components/global/CourseCard/CourseCard';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { getMyCourses } from '@/app/services/studentService';
import useBearStore from '@/app/store/useStore';

const LastWatchedCourses = () => {
   const [courses, setCourses] = useState<Course[]>([]);
   const { user } = useBearStore();

   useEffect(() => {
      const fetchLastWatched = async () => {
         try {
            const studentCourses = await getMyCourses();
            console.log('LastWatchedCourses fetched:', studentCourses);
            if (studentCourses.length > 0) {
               console.log(
                  'First course progress:',
                  studentCourses[0].progress
               );
            }
            // Just take first 4 for now as "Last Watched" proxy
            const mapped = studentCourses.slice(0, 4).map((item) => ({
               id: item.course._id,
               title: item.course.basicInfo.title,
               category: item.course.basicInfo.category,
               image:
                  item.course.advancedInfo?.thumbnailUrl ||
                  'https://via.placeholder.com/750x422',
               progress: item.progress || 0,
            }));
            setCourses(mapped);
         } catch (error) {
            console.error('Failed to fetch last watched courses', error);
         }
      };

      fetchLastWatched();
   }, []);

   return (
      <section>
         {/* الهيدر: العنوان والأسهم */}
         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6">
            <div>
               <h2 className="text-xl font-bold text-gray-900">
                  Let’s start learning, {user?.name?.split(' ')[0] || 'Student'}
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
               <CourseCard
                  key={course.id}
                  course={course}
                  hideWishlist={true}
               />
            ))}
         </div>
      </section>
   );
};

export default LastWatchedCourses;
