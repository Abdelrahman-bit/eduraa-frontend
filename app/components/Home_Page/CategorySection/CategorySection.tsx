import React from 'react';
import Link from 'next/link';
import CategoryCard from './CategoryCard';

import {
   AiOutlineCalculator,
   AiOutlineCode,
   AiOutlineDollarCircle,
   AiOutlineBarChart,
} from 'react-icons/ai';
import { FaLongArrowAltRight, FaHistory } from 'react-icons/fa';
import { GiMicroscope } from 'react-icons/gi';
import { MdPalette } from 'react-icons/md';

const categoriesData = [
   {
      icon: <AiOutlineCalculator size={30} />,
      iconColor: '#6050E7',
      backgroundColor: '#EBEBFF',
      title: 'Mathematics',
      courseCount: 365,
      slug: 'MATHEMATICS',
   },
   {
      icon: <GiMicroscope size={30} />,
      iconColor: '#28A745',
      backgroundColor: '#E1F7E3',
      title: 'Science & Biology',
      courseCount: 452,
      slug: 'SCIENCE_BIOLOGY',
   },
   {
      icon: <FaHistory size={30} />,
      iconColor: '#FF8A00',
      backgroundColor: '#FFF2E5',
      title: 'History',
      courseCount: 952,
      slug: 'HISTORY',
   },
   {
      icon: <AiOutlineCode size={30} />,
      iconColor: '#00BCD4',
      backgroundColor: '#E0FFFF',
      title: 'Programming',
      courseCount: 968,
      slug: 'PROGRAMMING',
   },
   {
      icon: <MdPalette size={30} />,
      iconColor: '#E91E63',
      backgroundColor: '#FCE4EC',
      title: 'Graphic Design',
      courseCount: 780,
      slug: 'GRAPHIC_DESIGN',
   },
   {
      icon: <AiOutlineDollarCircle size={30} />,
      iconColor: '#4CAF50',
      backgroundColor: '#E8F5E9',
      title: 'Finance & Accounting',
      courseCount: 610,
      slug: 'FINANCE_ACCOUNTING',
   },
   {
      icon: <AiOutlineBarChart size={30} />,
      iconColor: '#795548',
      backgroundColor: '#F3E5F5',
      title: 'Marketing',
      courseCount: 890,
      slug: 'MARKETING',
   },
   {
      icon: <AiOutlineCalculator size={30} />,
      iconColor: '#007BFF',
      backgroundColor: '#E6F2FF',
      title: 'Statistics',
      courseCount: 320,
      slug: 'STATISTICS',
   },
   {
      icon: <GiMicroscope size={30} />,
      iconColor: '#FF6B00',
      backgroundColor: '#FFF2E5',
      title: 'Chemistry',
      courseCount: 210,
      slug: 'CHEMISTRY',
   },
];

export default function CategorySection() {
   return (
      <section className="py-20">
         <div className="section-boundary-lg mx-auto flex flex-col gap-10">
            <h2 className="section-header text-center text-3xl font-bold text-gray-800">
               Browse top category
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
               {categoriesData.map((category, index) => (
                  <Link
                     key={index}
                     href={`/category?category=${category.slug}`}
                     passHref
                     className="block"
                  >
                     <CategoryCard
                        icon={category.icon}
                        iconColor={category.iconColor}
                        backgroundColor={category.backgroundColor}
                        title={category.title}
                        courseCount={category.courseCount}
                     />
                  </Link>
               ))}
            </div>

            <div className="flex flex-wrap gap-2 items-center justify-center pt-4">
               <p className="text-gray-700 text-base font-normal">
                  We have more category & subcategory.
               </p>
               <Link href="/categories" passHref>
                  <div className="flex gap-2 items-center text-primary-500 font-semibold cursor-pointer text-base">
                     <p>Browse All</p>
                     <FaLongArrowAltRight size={18} />
                  </div>
               </Link>
            </div>
         </div>
      </section>
   );
}
