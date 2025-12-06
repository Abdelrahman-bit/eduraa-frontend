'use client';

import React from 'react';
import Image from 'next/image';
import {
   Star,
   User,
   MoreHorizontal,
   Play,
   MessageCircle,
   FileText,
   Clock,
   Trophy,
   BarChart,
   Monitor,
   Download,
} from 'lucide-react';
import {
   LineChart,
   Line,
   XAxis,
   YAxis,
   CartesianGrid,
   Tooltip,
   ResponsiveContainer,
   AreaChart,
   Area,
} from 'recharts';

// --- Types ---

interface PageProps {
   params: {
      id: string;
   };
}

// --- Mock Data ---

// 1. Main Course Details Data
const COURSE_DETAILS = {
   id: '101',
   title: '2021 Complete Python Bootcamp From Zero to Hero in Python',
   breadcrumbs: ['Development', 'Web Development', 'Python'],
   uploadDate: 'Jan 21, 2020',
   updateDate: 'Sep 11, 2021',
   instructors: [
      { name: 'Kevin Gilbert', avatar: 'https://i.pravatar.cc/150?u=kevin' },
      { name: 'Kristin Watson', avatar: 'https://i.pravatar.cc/150?u=kristin' },
   ],
   rating: 4.8,
   totalRatings: 451444,
   price: 13.99,
   totalRevenue: 131800455.82,
   image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1000&auto=format&fit=crop',
};

// 2. Statistics Grid Data
const STATS_GRID = [
   {
      label: 'Lecture',
      value: '1,957',
      sub: '219.3 GB',
      icon: Play,
      bg: 'bg-orange-100',
      color: 'text-orange-500',
   },
   {
      label: 'Total Comments',
      value: '51,429',
      sub: '',
      icon: MessageCircle,
      bg: 'bg-purple-100',
      color: 'text-purple-500',
   },
   {
      label: 'Students enrolled',
      value: '9,419,418',
      sub: '',
      icon: User,
      bg: 'bg-pink-100',
      color: 'text-pink-500',
   },
   {
      label: 'Course level',
      value: 'Beginner',
      sub: '',
      icon: BarChart,
      bg: 'bg-green-100',
      color: 'text-green-500',
   },
   {
      label: 'Course Language',
      value: 'Mandarin',
      sub: '',
      icon: FileText,
      bg: 'bg-gray-100',
      color: 'text-gray-600',
   },
   {
      label: 'Attach File',
      value: '142',
      sub: '14.4 GB',
      icon: Download,
      bg: 'bg-orange-100',
      color: 'text-orange-500',
   }, // Used Download icon as generic attach
   {
      label: 'Hours',
      value: '19:37:51',
      sub: '',
      icon: Clock,
      bg: 'bg-indigo-100',
      color: 'text-indigo-500',
   },
   {
      label: 'Students viewed',
      value: '76,395,167',
      sub: '',
      icon: Trophy,
      bg: 'bg-gray-100',
      color: 'text-gray-600',
   },
];

// 3. Chart Data (Revenue & Overview)
const REVENUE_DATA = [
   { name: 'Aug 01', value: 120000 },
   { name: 'Aug 05', value: 150000 },
   { name: 'Aug 10', value: 110000 },
   { name: 'Aug 15', value: 130000 },
   { name: 'Aug 20', value: 90000 },
   { name: 'Aug 25', value: 140000 },
   { name: 'Aug 31', value: 130000 },
];

const OVERVIEW_DATA = [
   { name: 'Sun', views: 60000, comments: 40000 },
   { name: 'Mon', views: 50000, comments: 30000 },
   { name: 'Tue', views: 80000, comments: 50000 },
   { name: 'Wed', views: 40000, comments: 20000 },
   { name: 'Thu', views: 60000, comments: 10000 },
   { name: 'Fri', views: 70000, comments: 40000 },
   { name: 'Sat', views: 90000, comments: 50000 },
];

const RATING_DATA = [
   { stars: 5, percent: 67 },
   { stars: 4, percent: 27 },
   { stars: 3, percent: 5 },
   { stars: 2, percent: 1 },
   { stars: 1, percent: 0.5 }, // Using <1% as 0.5 for visual
];

const RATING_TREND_DATA = [
   { v: 4.5 },
   { v: 4.8 },
   { v: 4.2 },
   { v: 4.6 },
   { v: 4.5 },
   { v: 4.9 },
   { v: 4.7 },
];

// --- Sub-Components ---

// 1. Single Stat Box Component
const StatBox = ({
   label,
   value,
   sub,
   icon: Icon,
   bg,
   color,
}: {
   label: string;
   value: string;
   sub: string;
   icon: React.ElementType;
   bg: string;
   color: string;
}) => (
   <div className="bg-white p-5 rounded-sm shadow-sm flex items-start gap-4">
      <div
         className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${bg} ${color}`}
      >
         <Icon size={24} />
      </div>
      <div>
         <h4 className="text-xl font-bold text-gray-900">{value}</h4>
         <p className="text-sm text-gray-500">{label}</p>
         {sub && (
            <span className="text-xs text-gray-400 mt-1 block">{sub}</span>
         )}
      </div>
   </div>
);

// --- Main Page Component ---

export default function CourseDetailPage({ params }: PageProps) {
   // In a real app, you would fetch data here using params.id
   // const courseData = fetchCourseById(params.id);

   return (
      <div className="p-6 md:p-8 bg-[#F5F7FA] min-h-screen font-sans">
         {/* 1. Breadcrumb & Header */}
         <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
               My Course details
            </h1>
         </div>

         {/* 2. Top Course Banner */}
         <div className="bg-white p-6 rounded-sm shadow-sm mb-6 flex flex-col lg:flex-row gap-6">
            {/* Left: Image */}
            <div className="w-full lg:w-1/4 h-48 lg:h-auto relative rounded-md overflow-hidden bg-gray-200">
               <img
                  src={COURSE_DETAILS.image}
                  alt="Course Thumbnail"
                  className="w-full h-full object-cover"
               />
            </div>

            {/* Middle: Info */}
            <div className="flex-1 flex flex-col justify-between py-2">
               <div>
                  <div className="flex text-xs text-gray-400 gap-4 mb-2">
                     <span>Uploaded: {COURSE_DETAILS.uploadDate}</span>
                     <span>Last Updated: {COURSE_DETAILS.updateDate}</span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 leading-tight">
                     {COURSE_DETAILS.title}
                  </h2>
                  <p className="text-sm text-gray-500 mb-4">
                     3 in 1 Course: Learn to design websites with Figma, build
                     with Webflow, and make a living freelancing.
                  </p>

                  {/* Instructors */}
                  <div className="flex items-center gap-3">
                     <div className="flex -space-x-2">
                        {COURSE_DETAILS.instructors.map((inst, i) => (
                           <img
                              key={i}
                              src={inst.avatar}
                              alt={inst.name}
                              className="w-8 h-8 rounded-full border-2 border-white"
                           />
                        ))}
                     </div>
                     <div className="text-sm text-gray-600">
                        Created by:{' '}
                        <span className="font-semibold text-gray-900">
                           {COURSE_DETAILS.instructors
                              .map((i) => i.name)
                              .join(' • ')}
                        </span>
                     </div>
                  </div>
               </div>

               {/* Mobile Actions (Visible only on small screens) */}
               <div className="mt-4 lg:hidden">
                  <button className="bg-orange-500 text-white px-6 py-2 rounded-sm font-medium w-full">
                     Withdraw Money
                  </button>
               </div>
            </div>

            {/* Right: Pricing & Actions */}
            <div className="w-full lg:w-1/4 flex flex-col items-start lg:items-end justify-between py-2 border-t lg:border-t-0 lg:border-l border-gray-100 lg:pl-6 mt-4 lg:mt-0 pt-4 lg:pt-0">
               {/* Rating */}
               <div className="flex items-center gap-1 mb-4 lg:mb-0">
                  <div className="flex text-orange-500">
                     {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={16} fill="currentColor" />
                     ))}
                  </div>
                  <span className="font-bold text-gray-900 ml-1">
                     {COURSE_DETAILS.rating}
                  </span>
                  <span className="text-xs text-gray-400">
                     ({COURSE_DETAILS.totalRatings.toLocaleString()} Rating)
                  </span>
               </div>

               {/* Price info */}
               <div className="flex lg:flex-col gap-8 lg:gap-2 mb-4 lg:mb-0 w-full lg:w-auto">
                  <div>
                     <span className="text-xl font-bold text-gray-900 block">
                        ${COURSE_DETAILS.price}
                     </span>
                     <span className="text-xs text-gray-400">
                        Course prices
                     </span>
                  </div>
                  <div className="border-l lg:border-l-0 lg:border-t border-gray-200 pl-8 lg:pl-0 lg:pt-2">
                     <span className="text-xl font-bold text-gray-900 block">
                        ${COURSE_DETAILS.totalRevenue.toLocaleString()}
                     </span>
                     <span className="text-xs text-gray-400">
                        USD dollar revenue
                     </span>
                  </div>
               </div>

               {/* Action Buttons */}
               <div className="hidden lg:flex gap-3">
                  <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-sm font-medium transition-colors">
                     Withdraw Money
                  </button>
                  <button className="bg-gray-50 hover:bg-gray-100 p-2.5 rounded-sm border border-gray-200 transition-colors">
                     <MoreHorizontal size={20} className="text-gray-500" />
                  </button>
               </div>
            </div>
         </div>

         {/* 3. Stats Grid & Rating Section */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Left Column: Stats Grid (Spans 2 columns) */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
               {STATS_GRID.map((stat, index) => (
                  <StatBox key={index} {...stat} />
               ))}
            </div>

            {/* Right Column: Overall Rating */}
            <div className="bg-white p-6 rounded-sm shadow-sm lg:col-span-1">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-gray-900">
                     Overall Course Rating
                  </h3>
                  <span className="text-xs text-gray-400">This week ▼</span>
               </div>

               <div className="flex gap-4 mb-6">
                  <div className="bg-orange-50 w-24 h-24 flex flex-col items-center justify-center rounded-sm shrink-0">
                     <span className="text-3xl font-bold text-gray-900">
                        {COURSE_DETAILS.rating}
                     </span>
                     <div className="flex text-orange-500 my-1">
                        <Star size={12} fill="currentColor" />
                        <Star size={12} fill="currentColor" />
                        <Star size={12} fill="currentColor" />
                        <Star size={12} fill="currentColor" />
                        <Star size={12} fill="currentColor" />
                     </div>
                     <span className="text-[10px] text-gray-500 font-medium">
                        Course Rating
                     </span>
                  </div>

                  {/* Mini Trend Chart */}
                  <div className="flex-1 h-24">
                     <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={RATING_TREND_DATA}>
                           <Line
                              type="monotone"
                              dataKey="v"
                              stroke="#f97316"
                              strokeWidth={2}
                              dot={false}
                           />
                        </LineChart>
                     </ResponsiveContainer>
                  </div>
               </div>

               {/* Rating Bars */}
               <div className="space-y-3">
                  {RATING_DATA.map((r) => (
                     <div
                        key={r.stars}
                        className="flex items-center gap-2 text-xs"
                     >
                        <div className="flex items-center gap-1 w-12 text-gray-500 font-medium">
                           {[...Array(5)].map((_, i) => (
                              <Star
                                 key={i}
                                 size={10}
                                 className={
                                    i < r.stars
                                       ? 'text-orange-400 fill-orange-400'
                                       : 'text-gray-300'
                                 }
                              />
                           ))}
                        </div>
                        <span className="w-8 text-gray-600 font-medium">
                           {r.stars} Star
                        </span>
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                           <div
                              className="h-full bg-orange-500 rounded-full"
                              style={{ width: `${r.percent}%` }}
                           ></div>
                        </div>
                        <span className="w-8 text-right text-gray-500">
                           {r.percent}%
                        </span>
                     </div>
                  ))}
               </div>
            </div>
         </div>

         {/* 4. Charts Section (Revenue & Overview) */}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <div className="bg-white p-6 rounded-sm shadow-sm">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-gray-900">Revenue</h3>
                  <span className="text-xs text-gray-400">This month ▼</span>
               </div>
               <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                     <AreaChart
                        data={REVENUE_DATA}
                        margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
                     >
                        <defs>
                           <linearGradient
                              id="colorValue"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                           >
                              <stop
                                 offset="5%"
                                 stopColor="#22c55e"
                                 stopOpacity={0.1}
                              />
                              <stop
                                 offset="95%"
                                 stopColor="#22c55e"
                                 stopOpacity={0}
                              />
                           </linearGradient>
                        </defs>
                        <XAxis
                           dataKey="name"
                           axisLine={false}
                           tickLine={false}
                           tick={{ fontSize: 10, fill: '#9ca3af' }}
                           dy={10}
                        />
                        <YAxis
                           axisLine={false}
                           tickLine={false}
                           tick={{ fontSize: 10, fill: '#9ca3af' }}
                        />
                        <Tooltip
                           contentStyle={{
                              borderRadius: '4px',
                              border: 'none',
                              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                           }}
                        />
                        <CartesianGrid
                           vertical={false}
                           stroke="#f3f4f6"
                           strokeDasharray="3 3"
                        />
                        <Area
                           type="monotone"
                           dataKey="value"
                           stroke="#22c55e"
                           strokeWidth={2}
                           fillOpacity={1}
                           fill="url(#colorValue)"
                        />
                     </AreaChart>
                  </ResponsiveContainer>
               </div>
            </div>

            {/* Course Overview Chart */}
            <div className="bg-white p-6 rounded-sm shadow-sm">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-gray-900">Course Overview</h3>
                  <div className="flex items-center gap-4">
                     <div className="flex items-center gap-1 text-xs text-gray-500">
                        <span className="w-2 h-2 rounded-full bg-orange-500"></span>{' '}
                        Comments
                     </div>
                     <div className="flex items-center gap-1 text-xs text-gray-500">
                        <span className="w-2 h-2 rounded-full bg-indigo-500"></span>{' '}
                        View
                     </div>
                     <span className="text-xs text-gray-400 cursor-pointer">
                        This month ▼
                     </span>
                  </div>
               </div>
               <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                     <LineChart
                        data={OVERVIEW_DATA}
                        margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
                     >
                        <XAxis
                           dataKey="name"
                           axisLine={false}
                           tickLine={false}
                           tick={{ fontSize: 10, fill: '#9ca3af' }}
                           dy={10}
                        />
                        <YAxis
                           axisLine={false}
                           tickLine={false}
                           tick={{ fontSize: 10, fill: '#9ca3af' }}
                        />
                        <Tooltip
                           contentStyle={{
                              borderRadius: '4px',
                              border: 'none',
                              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                           }}
                        />
                        <CartesianGrid
                           vertical={false}
                           stroke="#f3f4f6"
                           strokeDasharray="3 3"
                        />
                        {/* Comments Line (Orange) */}
                        <Line
                           type="monotone"
                           dataKey="comments"
                           stroke="#f97316"
                           strokeWidth={2}
                           dot={false}
                           activeDot={{ r: 6 }}
                        />
                        {/* Views Line (Purple/Indigo) */}
                        <Line
                           type="monotone"
                           dataKey="views"
                           stroke="#6366f1"
                           strokeWidth={2}
                           dot={false}
                           activeDot={{ r: 6 }}
                        />
                     </LineChart>
                  </ResponsiveContainer>
               </div>
            </div>
         </div>
      </div>
   );
}
