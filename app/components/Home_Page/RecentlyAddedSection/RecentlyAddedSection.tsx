import React from 'react';
import CourseCard from '../CourseCard/CourseCard';
import Button from '../../global/Button/Button';

export default function RecentlyAddedSection() {
   return (
      <section className="py-20">
         <div className="section-boundary flex flex-col gap-10 items-center">
            <h2 className="section-header text-center">
               Recently Added Courses
            </h2>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-4">
               <CourseCard displayIcon={true} />
               <CourseCard displayIcon={true} />
               <CourseCard displayIcon={true} />
               <CourseCard displayIcon={true} />
            </div>
            <Button text="Browse All Courses -->" type="secondary" />
         </div>
      </section>
   );
}
