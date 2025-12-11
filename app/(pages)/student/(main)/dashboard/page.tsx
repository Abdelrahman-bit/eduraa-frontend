import React from 'react';
import DashboardStats from '@/app/components/student/DashboardStats';
import LastWatchedCourses from '@/app/components/student/LastWatchedCourses';

export default function StudentDashboardPage() {
   return (
      <div className="space-y-10">
         <DashboardStats />

         <LastWatchedCourses />
      </div>
   );
}
