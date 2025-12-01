import {
   LayoutDashboard,
   PlusCircle,
   BookOpen,
   Settings,
   BookCheck,
   UserPlus,
   PackagePlus,
   MessageSquare,
   Wallet,
} from 'lucide-react';

export const getSidebarItems = (role: 'instructor' | 'student' | 'admin') => {
   const commonItems = [
      { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
      { label: 'Settings', icon: Settings, href: '/dashboard/settings' },
   ];

   let items = [];

   switch (role) {
      case 'instructor':
         items = [
            {
               label: 'Create New Course',
               icon: PlusCircle,
               href: '/dashboard/create-course',
            },
            { label: 'My Courses', icon: BookOpen, href: '/dashboard/courses' },
            ...commonItems,
         ];
         break;

      case 'student':
         items = [
            {
               label: 'My Courses',
               icon: BookOpen,
               href: '/dashboard/student/courses',
            },
            {
               label: 'My Exams',
               icon: BookCheck,
               href: '/dashboard/student/exams',
            },
            ...commonItems,
         ];
         break;

      case 'admin':
         items = [
            {
               label: 'Join Requests',
               icon: UserPlus,
               href: '/dashboard/admin/instructorRequests',
            },
            {
               label: 'Course Requests',
               icon: PackagePlus,
               href: '/dashboard/admin/courseRequests',
            },
            ...commonItems,
         ];
         break;

      default:
         items = [...commonItems];
         break;
   }
   return items;
};
