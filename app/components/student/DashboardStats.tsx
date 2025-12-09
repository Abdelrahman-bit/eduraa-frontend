'use client';
import React, { useEffect, useState } from 'react';
import StatCard from './StateCard';
import { PlayCircle, CheckSquare, Trophy, Users } from 'lucide-react';
import { getDashboardStats } from '@/app/services/studentService';

const DashboardStats = () => {
   const [stats, setStats] = useState([
      {
         icon: PlayCircle,
         number: 0,
         label: 'Enrolled Courses',
         bgColor: 'bg-orange-50',
         iconColor: 'text-orange-500',
      },
      {
         icon: CheckSquare,
         number: 0,
         label: 'Active Courses',
         bgColor: 'bg-purple-50',
         iconColor: 'text-purple-500',
      },
      {
         icon: Trophy,
         number: 0,
         label: 'Completed Courses',
         bgColor: 'bg-green-50',
         iconColor: 'text-green-500',
      },
      {
         icon: Users,
         number: 0,
         label: 'Course Instructors',
         bgColor: 'bg-orange-50',
         iconColor: 'text-orange-500',
      },
   ]);

   useEffect(() => {
      const fetchStats = async () => {
         try {
            const data = await getDashboardStats();
            setStats((prev) => [
               { ...prev[0], number: data.enrolledCourses },
               { ...prev[1], number: data.activeCourses },
               { ...prev[2], number: data.completedCourses },
               { ...prev[3], number: data.courseInstructors },
            ]);
         } catch (error) {
            console.error('Failed to fetch dashboard stats', error);
         }
      };

      fetchStats();
   }, []);

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
