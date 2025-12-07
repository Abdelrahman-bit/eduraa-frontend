'use client';
import React from 'react';
import StatCard from './StateCard';
import { PlayCircle, CheckSquare, Trophy, Users } from 'lucide-react';

const DashboardStats = () => {
   // soon import data from backend
   const stats = [
      {
         icon: PlayCircle,
         number: 957,
         label: 'Enrolled Courses',
         bgColor: 'bg-orange-50',
         iconColor: 'text-orange-500',
      },
      {
         icon: CheckSquare,
         number: 6,
         label: 'Active Courses',
         bgColor: 'bg-purple-50',
         iconColor: 'text-purple-500',
      },
      {
         icon: Trophy,
         number: 951,
         label: 'Completed Courses',
         bgColor: 'bg-green-50',
         iconColor: 'text-green-500',
      },
      {
         icon: Users,
         number: 241,
         label: 'Course Instructors',
         bgColor: 'bg-orange-50',
         iconColor: 'text-orange-500',
      },
   ];

   return (
      <section>
         <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
               <StatCard key={index} {...stat} />
            ))}
         </div>
      </section>
   );
};

export default DashboardStats;
