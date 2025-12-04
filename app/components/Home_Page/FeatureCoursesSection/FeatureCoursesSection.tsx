import React from 'react';
import CourseHorizontalCard from '../CourseCard/CourseHorizontalCard';

export default function FeatureCoursesSection() {
   return (
      <section className="py-16 bg-gray-50">
         <div className="container mx-auto px-2 md:px-4 lg:px-8">
            <div className="flex flex-col gap-8 p-4 md:p-8 bg-white">
               <h2 className="section-header text-3xl font-bold text-gray-800">
                  Our Feature Courses
               </h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <CourseHorizontalCard />
                  <CourseHorizontalCard />
                  <CourseHorizontalCard />
                  <CourseHorizontalCard />
               </div>
            </div>
         </div>
      </section>
   );
}
