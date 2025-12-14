'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
   getDashboardOverview,
   getJoinRequests,
} from '@/app/services/adminService';
import {
   Users,
   BookOpen,
   UserPlus,
   Activity,
   Calendar,
   GraduationCap,
   Loader2,
} from 'lucide-react';
import {
   AreaChart,
   Area,
   XAxis,
   YAxis,
   CartesianGrid,
   Tooltip,
   ResponsiveContainer,
   Legend,
} from 'recharts';

export default function AdminDashboard() {
   // 1. Fetch Overview Data
   const { data: overviewData, isLoading: isOverviewLoading } = useQuery({
      queryKey: ['adminDashboardOverview'],
      queryFn: getDashboardOverview,
   });

   // 2. Fetch Join Requests (Real API)
   const { data: joinRequests, isLoading: isRequestsLoading } = useQuery({
      queryKey: ['joinRequests'],
      queryFn: getJoinRequests,
   });

   // Loading State
   if (isOverviewLoading || isRequestsLoading) {
      return (
         <div className="flex h-screen items-center justify-center bg-[#F5F7FA]">
            <div className="flex flex-col items-center gap-2">
               <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
               <p className="text-gray-500 text-sm">
                  Loading dashboard analytics...
               </p>
            </div>
         </div>
      );
   }

   // Stat Card Component
   const AdminStatCard = ({
      title,
      value,
      icon: Icon,
      color,
      bg,
      trend,
      trendColor,
   }: any) => (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-start justify-between hover:shadow-md transition-shadow">
         <div>
            <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
               {value?.toLocaleString() || 0}
            </h3>
            <div
               className={`flex items-center gap-1 text-xs font-medium w-fit px-2 py-1 rounded-full ${trendColor}`}
            >
               <Activity size={12} />
               {trend}
            </div>
         </div>
         <div
            className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${bg} ${color}`}
         >
            <Icon size={24} />
         </div>
      </div>
   );

   return (
      <div className="p-4 md:p-6 lg:p-8 space-y-8 min-h-screen bg-[#F5F7FA]">
         {/* Header */}
         <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
               <h1 className="text-2xl font-bold text-gray-900">
                  Admin Dashboard
               </h1>
               <p className="text-gray-500 text-sm mt-1">
                  Platform overview & operational metrics.
               </p>
            </div>
            <div className="hidden md:block">
               <span className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-sm text-sm font-medium shadow-sm">
                  {new Date().toLocaleDateString('en-US', {
                     weekday: 'long',
                     year: 'numeric',
                     month: 'long',
                     day: 'numeric',
                  })}
               </span>
            </div>
         </div>

         {/* Stats Grid */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <AdminStatCard
               title="Pending Requests"
               value={
                  joinRequests?.length ?? overviewData?.stats?.pendingRequests
               } // Prefer Real Count
               icon={UserPlus}
               color="text-orange-500"
               bg="bg-orange-100"
               trend="Action Needed"
               trendColor="text-orange-600 bg-orange-50"
            />
            <AdminStatCard
               title="Total Instructors"
               value={overviewData?.stats?.totalInstructors ?? 0}
               icon={Users}
               color="text-blue-500"
               bg="bg-blue-100"
               trend="Active"
               trendColor="text-blue-600 bg-blue-50"
            />
            <AdminStatCard
               title="Total Students"
               value={overviewData?.stats?.totalStudents ?? 0}
               icon={GraduationCap}
               color="text-green-500"
               bg="bg-green-100"
               trend="Growing"
               trendColor="text-green-600 bg-green-50"
            />
            <AdminStatCard
               title="Active Courses"
               value={overviewData?.stats?.activeCourses ?? 0}
               icon={BookOpen}
               color="text-purple-500"
               bg="bg-purple-100"
               trend="Published"
               trendColor="text-purple-600 bg-purple-50"
            />
         </div>

         {/* Charts & Sidebar Grid */}
         <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Growth Chart */}
            <div className="xl:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
               <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-bold text-gray-900">
                     User Growth
                  </h2>
               </div>
               <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                     <AreaChart
                        data={overviewData?.growthChart || []}
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
                                 stopColor="#22C55E"
                                 stopOpacity={0.1}
                              />
                              <stop
                                 offset="95%"
                                 stopColor="#22C55E"
                                 stopOpacity={0}
                              />
                           </linearGradient>
                           <linearGradient
                              id="colorInstructors"
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
                           dy={10}
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
                        <Legend
                           verticalAlign="top"
                           height={36}
                           iconType="circle"
                        />

                        <Area
                           name="Students"
                           type="monotone"
                           dataKey="students"
                           stroke="#22C55E"
                           strokeWidth={3}
                           fillOpacity={1}
                           fill="url(#colorStudents)"
                        />
                        <Area
                           name="Instructors"
                           type="monotone"
                           dataKey="instructors"
                           stroke="#FF6636"
                           strokeWidth={3}
                           fillOpacity={1}
                           fill="url(#colorInstructors)"
                        />
                     </AreaChart>
                  </ResponsiveContainer>
               </div>
            </div>

            {/* Right Column: Widgets */}
            <div className="flex flex-col gap-6">
               {/* Recent Join Requests Widget (REAL DATA) */}
               <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                     <h2 className="text-lg font-bold text-gray-900">
                        New Instructors
                     </h2>
                     <Link
                        href="/dashboard/admin/instructors"
                        className="text-orange-500 text-xs font-bold uppercase tracking-wider hover:underline"
                     >
                        View All
                     </Link>
                  </div>

                  <div className="space-y-4">
                     {!joinRequests || joinRequests.length === 0 ? (
                        <p className="text-gray-400 text-sm">
                           No pending requests.
                        </p>
                     ) : (
                        // Display only first 4 items from Real Data
                        joinRequests.slice(0, 4).map((req) => (
                           <div
                              key={req._id}
                              className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-md transition-colors border border-transparent hover:border-gray-100 cursor-pointer"
                           >
                              <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center font-bold text-sm shrink-0 uppercase">
                                    {req.firstname?.charAt(0) || '?'}
                                 </div>
                                 <div className="min-w-0">
                                    <h4 className="text-sm font-bold text-gray-900 truncate">
                                       {req.firstname} {req.lastname}
                                    </h4>
                                    <p className="text-xs text-gray-500 truncate">
                                       {req.email}
                                    </p>
                                 </div>
                              </div>
                              <div className="text-right shrink-0">
                                 <span className="text-[10px] bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
                                    New
                                 </span>
                              </div>
                           </div>
                        ))
                     )}
                  </div>
               </div>

               {/* Recent Bookings Widget */}
               <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-4">
                     <h2 className="text-lg font-bold text-gray-900">
                        Recent Bookings
                     </h2>
                     <Link
                        href="/dashboard/admin/bookings"
                        className="text-blue-500 text-xs font-bold uppercase hover:underline"
                     >
                        Manage
                     </Link>
                  </div>
                  <div className="space-y-3">
                     {!overviewData?.recentBookings ||
                     overviewData.recentBookings.length === 0 ? (
                        <p className="text-gray-400 text-sm">
                           No bookings yet.
                        </p>
                     ) : (
                        overviewData.recentBookings.map((booking) => (
                           <div
                              key={booking.id}
                              className="flex items-center gap-3 p-3 bg-gray-50 rounded-md"
                           >
                              <div className="bg-white p-2 rounded text-blue-500 shadow-sm">
                                 <Calendar size={18} />
                              </div>
                              <div>
                                 <p className="text-sm font-bold text-gray-800">
                                    {booking.hall}
                                 </p>
                                 <p className="text-xs text-gray-500">
                                    {new Date(
                                       booking.date
                                    ).toLocaleDateString()}{' '}
                                    • {booking.instructor}
                                 </p>
                              </div>
                           </div>
                        ))
                     )}
                  </div>
               </div>
            </div>
         </div>

         {/* Recent Platform Activity Table */}
         <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
               <h2 className="text-lg font-bold text-gray-900">
                  Recent Platform Activity
               </h2>
            </div>
            <div className="p-0 sm:p-6 overflow-x-auto">
               <table className="w-full text-left text-sm text-gray-600 min-w-[600px]">
                  <thead className="bg-gray-50 text-gray-900 font-semibold hidden sm:table-header-group">
                     <tr>
                        <th className="p-3 rounded-l-md">Type</th>
                        <th className="p-3">User</th>
                        <th className="p-3">Action Details</th>
                        <th className="p-3 rounded-r-md text-right">Time</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                     {overviewData?.recentActivities?.map((activity) => (
                        <tr key={activity.id}>
                           <td className="p-3">
                              <span
                                 className={`px-2 py-1 rounded text-xs font-medium capitalize 
                                    ${
                                       activity.type === 'new_course'
                                          ? 'bg-purple-50 text-purple-600'
                                          : activity.type === 'registration'
                                            ? 'bg-green-50 text-green-600'
                                            : activity.type === 'booking'
                                              ? 'bg-blue-50 text-blue-600'
                                              : 'bg-gray-50 text-gray-600'
                                    }`}
                              >
                                 {activity.type.replace('_', ' ')}
                              </span>
                           </td>
                           <td className="p-3 font-medium text-gray-900">
                              {activity.user}
                           </td>
                           <td className="p-3">{activity.action}</td>
                           <td className="p-3 text-right text-gray-400">
                              {activity.time}
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
   );
}
