import React from "react";
import CourseCard from "../CourseCard/CourseCard";

export default function BestSellingSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="section-boundary flex flex-col gap-10">
        <h2 className="section-header text-center">Best Selling Courses</h2>
        {/* courses grid container TODO*/}
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          <CourseCard />
          <CourseCard />
          <CourseCard />
          <CourseCard />
          <CourseCard />
          <CourseCard />
          <CourseCard />
          <CourseCard />
          <CourseCard />
          <CourseCard />
        </div>
      </div>
    </section>
  );
}
