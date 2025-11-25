import React from "react";

type CardProps = {
  icon: IconType;
  iconColor: string;
  backgroundColor: string;
  title: string;
  courseCount: number;
};

export default function CategoryCard({
  icon,
  iconColor,
  backgroundColor,
  title,
  courseCount,
}: CardProps) {
  return (
    <div
      className="flex items-center gap-4 p-5 
         hover:shadow-lg
        transition-all duration-300 
        hover:-translate-y-1 cursor-pointer"
      style={{ backgroundColor }}
    >
      <div className="p-5 bg-white " style={{ color: iconColor }}>
        {icon}
      </div>
      <div>
        <p className="font-bold text-gray-scale-900 text-body-md">{title}</p>
        <p className="font-normal text-gray-scale-500 text-body-md">
          {courseCount} Courses
        </p>
      </div>
    </div>
  );
}
