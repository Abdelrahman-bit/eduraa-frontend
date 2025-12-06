'use client';

import React from 'react';
import {
   Play,
   BookOpen,
   Users,
   Award,
   UserCircle,
   FileText,
   CreditCard,
   Layers,
   MessageCircle,
   Star,
   ShoppingCart,
   LucideIcon,
} from 'lucide-react';
import {
   AreaChart,
   Area,
   XAxis,
   YAxis,
   CartesianGrid,
   Tooltip,
   ResponsiveContainer,
} from 'recharts';

// Custom Component Imports
import { StatCard } from '@/app/components/dashboard/instructor/StatCard';
import { RatingCard } from '@/app/components/dashboard/instructor/RatingCard';
import { ChartCard } from '@/app/components/dashboard/instructor/ChartCard';

// --- Types & Interfaces ---

interface ActivityItemType {
   id: number;
   user: string;
   action: string;
   time: string;
   icon: React.ElementType;
   bg: string;
}

interface StatItemType {
   label: string;
   value: string;
   icon: LucideIcon;
   color: string;
   bg: string;
}

// --- Mock Data Configuration ---

const STATS_DATA: StatItemType[] = [
   {
      label: 'Enrolled Courses',
      value: '957',
      icon: Play,
      color: 'text-orange-500',
      bg: 'bg-orange-100/50',
   },
   {
      label: 'Active Courses',
      value: '19',
      icon: BookOpen,
      color: 'text-purple-500',
      bg: 'bg-purple-100/50',
   },
   {
      label: 'Course Instructors',
      value: '241',
      icon: Users,
      color: 'text-yellow-500',
      bg: 'bg-yellow-100/50',
   },
   {
      label: 'Completed Courses',
      value: '951',
      icon: Award,
      color: 'text-green-500',
      bg: 'bg-green-100/50',
   },
   {
      label: 'Students',
      value: '1,674,767',
      icon: UserCircle,
      color: 'text-red-500',
      bg: 'bg-red-100/50',
   },
   {
      label: 'Online Courses',
      value: '3',
      icon: FileText,
      color: 'text-emerald-600',
      bg: 'bg-emerald-100/50',
   },
   {
      label: 'USD Total Earning',
      value: '$7,461,767',
      icon: CreditCard,
      color: 'text-gray-700',
      bg: 'bg-gray-100/50',
   },
   {
      label: 'Course Sold',
      value: '56,489',
      icon: Layers,
      color: 'text-indigo-500',
      bg: 'bg-indigo-100/50',
   },
];

const ACTIVITY_DATA: ActivityItemType[] = [
   {
      id: 1,
      user: 'Kevin',
      action:
         'comments on your lecture "What is ux" in "2021 ui/ux design with figma"',
      time: 'Just now',
      icon: MessageCircle,
      bg: 'bg-orange-100 text-orange-500',
   },
   {
      id: 2,
      user: 'John',
      action:
         'give a 5 star rating on your course "2021 ui/ux design with figma"',
      time: '5 mins ago',
      icon: Star,
      bg: 'bg-orange-100 text-orange-500',
   },
   {
      id: 3,
      user: 'Sraboni',
      action: 'purchase your course "2021 ui/ux design with figma"',
      time: '6 mins ago',
      icon: ShoppingCart,
      bg: 'bg-rose-100 text-rose-500',
   },
   {
      id: 4,
      user: 'Arif',
      action: 'purchase your course "2021 ui/ux design with figma"',
      time: '10 mins ago',
      icon: ShoppingCart,
      bg: 'bg-rose-100 text-rose-500',
   },
];

const CHART_DATA = [
   { name: 'Sun', sales: 4000, views: 2400 },
   { name: 'Mon', sales: 3000, views: 1398 },
   { name: 'Tue', sales: 2000, views: 9800 },
   { name: 'Wed', sales: 2780, views: 3908 },
   { name: 'Thu', sales: 1890, views: 4800 },
   { name: 'Fri', sales: 2390, views: 3800 },
   { name: 'Sat', sales: 3490, views: 4300 },
];

const RATING_STATS = {
   rating: 4.6,
   miniChart: [
      { value: 30 },
      { value: 50 },
      { value: 40 },
      { value: 60 },
      { value: 50 },
   ],
   bars: [
      { stars: 5, percent: 56 },
      { stars: 4, percent: 37 },
      { stars: 3, percent: 8 },
      { stars: 2, percent: 1 },
      { stars: 1, percent: 0 },
   ],
};

// --- Internal Helper Components ---

/**
 * Renders a single row in the Recent Activity list.
 */
const ActivityItem = ({ item }: { item: ActivityItemType }) => (
   <div className="flex gap-4 border-b border-gray-100 last:border-0 pb-4 mb-4 items-start">
      <div
         className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-1 ${item.bg}`}
      >
         <item.icon size={18} strokeWidth={2.5} />
      </div>
      <div className="flex-1">
         <p className="text-sm text-gray-600 leading-snug">
            <span className="font-bold text-gray-900">{item.user}</span>{' '}
            {item.action}
         </p>
         <span className="text-xs text-gray-400 mt-1.5 block font-medium">
            {item.time}
         </span>
      </div>
   </div>
);

// --- Main Page Component ---

export default function DashboardPage() {
   return (
      <div className="p-6 md:p-8 bg-[#F5F7FA] min-h-screen font-sans">
         {/* Page Header */}
         <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Good Morning</p>
         </div>

         {/* 1. Statistics Grid */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {STATS_DATA.map((item, index) => (
               <StatCard key={index} {...item} />
            ))}
         </div>

         {/* 2. Main Content Grid */}
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Activity & Ratings (Spans 4 columns on large screens) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
               {/* Recent Activity Panel */}
               <div className="bg-white p-6 shadow-sm rounded-sm">
                  <div className="flex justify-between items-center mb-6">
                     <h2 className="text-lg font-bold text-gray-900">
                        Recent Activity
                     </h2>
                     <button className="text-xs text-gray-400 hover:text-orange-500 transition-colors">
                        Today ▼
                     </button>
                  </div>
                  <div>
                     {ACTIVITY_DATA.map((item) => (
                        <ActivityItem key={item.id} item={item} />
                     ))}
                  </div>
               </div>

               {/* Rating Analytics Panel */}
               <RatingCard
                  rating={RATING_STATS.rating}
                  totalRating={100}
                  data={RATING_STATS.bars}
                  chartData={RATING_STATS.miniChart}
                  title="Overall Course Rating"
               />
            </div>

            {/* Right Column: Main Chart (Spans 8 columns on large screens) */}
            <div className="lg:col-span-8 flex flex-col">
               <ChartCard title="Course Overview" filterText="This week">
                  {/* Recharts Area Chart Configuration */}
                  <ResponsiveContainer width="100%" height="100%">
                     <AreaChart
                        data={CHART_DATA}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                     >
                        <defs>
                           <linearGradient
                              id="colorSales"
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
                           <linearGradient
                              id="colorViews"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                           >
                              <stop
                                 offset="5%"
                                 stopColor="#6D28D9"
                                 stopOpacity={0.1}
                              />
                              <stop
                                 offset="95%"
                                 stopColor="#6D28D9"
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

                        {/* Views Series (Purple) */}
                        <Area
                           type="monotone"
                           dataKey="views"
                           stroke="#6D28D9"
                           strokeWidth={3}
                           fillOpacity={1}
                           fill="url(#colorViews)"
                        />
                        {/* Sales Series (Orange) */}
                        <Area
                           type="monotone"
                           dataKey="sales"
                           stroke="#FF6636"
                           strokeWidth={3}
                           fillOpacity={1}
                           fill="url(#colorSales)"
                        />
                     </AreaChart>
                  </ResponsiveContainer>
               </ChartCard>
            </div>
         </div>
      </div>
   );
}
