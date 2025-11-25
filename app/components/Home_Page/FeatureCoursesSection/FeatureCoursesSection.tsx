import React from "react";
import CourseHorizontalCard from "../CourseCard/CourseHorizontalCard";

export default function FeatureCoursesSection() {
  return (
    <section className="pb-20 bg-gray-50">
      <div className="section-boundary-lg flex flex-col gap-10 p-10 bg-white border border-gray-scale-100">
        <h2 className="section-header">Our Feature Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CourseHorizontalCard />
          <CourseHorizontalCard />
          <CourseHorizontalCard />
          <CourseHorizontalCard />
        </div>
      </div>
    </section>
  );
}
