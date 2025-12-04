import React from 'react';
import CourseCard from '../CourseCard/CourseCard';

const allCoursesData = [
   {
      slug: 'WEB_DEVELOPMENT',
      image: '/course2.png',
      category: 'Development',
      price: '129',
      courseTitle: 'Full Stack Development with Next.js & TypeScript',
      courseRating: '4.9',
      enrolledStudents: '55.2K',
   },
   {
      slug: 'DATA_SCIENCE',
      image: '/course2.png',
      category: 'Data Science',
      price: '199',
      courseTitle: 'Python for Data Science and Machine Learning Bootcamp',
      courseRating: '4.7',
      enrolledStudents: '98.5K',
   },
   {
      slug: 'UX_DESIGN',
      image: '/course2.png',
      category: 'Design',
      price: '99',
      courseTitle:
         'The Complete Figma Course: UI/UX Design from Beginner to Expert',
      courseRating: '4.8',
      enrolledStudents: '42.1K',
   },
   {
      slug: 'FINANCE',
      image: '/course2.png',
      category: 'Finance',
      price: '79',
      courseTitle: 'Financial Analyst Training & Investing Course',
      courseRating: '4.6',
      enrolledStudents: '71.9K',
   },
   {
      slug: 'MARKETING',
      image: '/course2.png',
      category: 'Marketing',
      price: '49',
      courseTitle: 'Google Ads Mastery: The Ultimate Guide to PPC',
      courseRating: '4.5',
      enrolledStudents: '33.8K',
   },
   {
      slug: 'AI_ML',
      image: '/course2.png',
      category: 'Artificial Intelligence',
      price: '249',
      courseTitle: 'Deep Learning A-Z™: Hands-On Artificial Neural Networks',
      courseRating: '4.9',
      enrolledStudents: '61.4K',
   },
   {
      slug: 'CYBER_SECURITY',
      image: '/course2.png',
      category: 'Cyber Security',
      price: '149',
      courseTitle: 'The Complete Cyber Security Course: Network Security',
      courseRating: '4.7',
      enrolledStudents: '88.3K',
   },
   {
      slug: 'BUSINESS',
      image: '/course2.png',
      category: 'Business',
      price: '59',
      courseTitle: 'PMP Certification Exam Prep Course: Project Management',
      courseRating: '4.6',
      enrolledStudents: '21.7K',
   },
];

export default function BestSellingSection() {
   return (
      <section className="py-20 bg-gray-50 ">
         <div className=" flex flex-col gap-10 px-4 md:px-0">
            <h2 className="section-header text-center text-3xl font-bold text-gray-800">
               Best Selling Courses
            </h2>

            <div className="lg:w-4/5 mx-auto grid gap-3 md:gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
               {allCoursesData.map((course) => (
                  <CourseCard
                     key={course.slug}
                     categorySlug={course.slug}
                     imageUrl={course.image}
                     categoryName={course.category}
                     price={course.price}
                     title={course.courseTitle}
                     rating={course.courseRating}
                     studentsCount={course.enrolledStudents}
                     displayIcon={true}
                  />
               ))}
            </div>
         </div>
      </section>
   );
}
