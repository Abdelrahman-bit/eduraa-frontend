'use client';

import React from 'react';
import { Play, BookOpen, Users, Award } from 'lucide-react';
import {
   AreaChart,
   Area,
   XAxis,
   YAxis,
   CartesianGrid,
   Tooltip,
   ResponsiveContainer,
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { getInstructorDashboardStats } from '@/app/services/courseService';

// Custom Component Imports
import { StatCard } from '@/app/components/dashboard/instructor/StatCard';
import { ChartCard } from '@/app/components/dashboard/instructor/ChartCard';
import { RatingCard } from '@/app/components/dashboard/instructor/RatingCard';
import { RecentActivity } from '@/app/components/dashboard/instructor/RecentActivity';

// --- Types & Interfaces ---

interface StatItemType {
   label: string;
   value: string;
   icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
   color: string;
   bg: string;
}

// --- Main Page Component ---

export default function DashboardPage() {
   const { data: stats, isLoading } = useQuery({
      queryKey: ['instructorStats'],
      queryFn: getInstructorDashboardStats,
   });

   if (isLoading) {
      return <div className="p-8">Loading dashboard stats...</div>;
   }

   const STATS_DATA: StatItemType[] = [
      {
         label: 'Total Courses',
         value: stats?.totalCourses.toString() || '0',
         icon: Play,
         color: 'text-orange-500',
         bg: 'bg-orange-100/50',
      },
      {
         label: 'Published Courses',
         value: stats?.activeCourses.toString() || '0',
         icon: BookOpen,
         color: 'text-green-500',
         bg: 'bg-green-100/50',
      },
      {
         label: 'Courses Under Review',
         value: stats?.reviewCourses.toString() || '0',
         icon: Award,
         color: 'text-yellow-500',
         bg: 'bg-yellow-100/50',
      },
      {
         label: 'Draft Courses',
         value: stats?.draftCourses.toString() || '0',
         icon: Users,
         color: 'text-gray-500',
         bg: 'bg-gray-100/50',
      },
      {
         label: 'Total Students',
         value: stats?.totalStudents.toString() || '0',
         icon: Users,
         color: 'text-blue-500',
         bg: 'bg-blue-100/50',
      },
   ];

   const CHART_DATA = stats?.chartData || [];
   const RECENT_ACTIVITY = stats?.recentActivity || [];

   // Mock ratings data (Until backend supports it)
   const RATING_TREND = [
      { value: 4.2 },
      { value: 4.5 },
      { value: 4.3 },
      { value: 4.8 },
      { value: 4.6 },
      { value: 4.7 },
      { value: 4.6 },
   ];

   const STAR_DISTRIBUTION = [
      { stars: 5, percent: 56 },
      { stars: 4, percent: 37 },
      { stars: 3, percent: 8 },
      { stars: 2, percent: 1 },
      { stars: 1, percent: 0 },
   ];

   return (
      <div className="p-6 md:p-8 bg-[#F5F7FA] min-h-screen font-sans">
         {/* Page Header */}
         <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">
               Overview of your activity
            </p>
         </div>

         {/* 1. Statistics Grid */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {STATS_DATA.map((item, index) => (
               <StatCard key={index} {...item} />
            ))}
         </div>

         {/* 2. Main Content Grid */}
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Chart & Activity */}
            <div className="lg:col-span-8 flex flex-col gap-6">
               {/* Main Chart */}
               <ChartCard
                  title="Student Enrollments (Last 7 Days)"
                  filterText="This week"
               >
                  <div className="h-[300px] w-full">
                     <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                           data={CHART_DATA}
                           margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >
                           <defs>
                              <linearGradient
                                 id="colorStudents"
                                 x1="0"
                                 y1="0"
                                 x2="0"
                                 y2="1"
                              >
                                 <stop
                                    offset="5%"
                                    stopColor="#FF6636"
                                    stopOpacity={0.1}
                                 />
                                 <stop
                                    offset="95%"
                                    stopColor="#FF6636"
                                    stopOpacity={0}
                                 />
                              </linearGradient>
                           </defs>
                           <XAxis
                              dataKey="name"
                              axisLine={false}
                              tickLine={false}
                              tick={{ fill: '#9CA3AF', fontSize: 12 }}
                              dy={15}
                           />
                           <YAxis
                              axisLine={false}
                              tickLine={false}
                              tick={{ fill: '#9CA3AF', fontSize: 12 }}
                           />
                           <Tooltip
                              contentStyle={{
                                 borderRadius: '8px',
                                 border: 'none',
                                 boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                              }}
                           />
                           <CartesianGrid
                              vertical={false}
                              stroke="#F3F4F6"
                              strokeDasharray="3 3"
                           />
                           <Area
                              type="monotone"
                              dataKey="students"
                              stroke="#FF6636"
                              strokeWidth={3}
                              fillOpacity={1}
                              fill="url(#colorStudents)"
                           />
                        </AreaChart>
                     </ResponsiveContainer>
                  </div>
               </ChartCard>

               {/* Recent Activity */}
               <RecentActivity activities={RECENT_ACTIVITY} />
            </div>

            {/* Right Column: Rating */}
            <div className="lg:col-span-4 flex flex-col gap-6">
               <RatingCard
                  rating={4.6}
                  totalRating={0}
                  data={STAR_DISTRIBUTION}
                  chartData={RATING_TREND}
               />
            </div>
         </div>
      </div>
   );
}
