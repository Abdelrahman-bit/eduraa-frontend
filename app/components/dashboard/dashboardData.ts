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
   Users,
} from 'lucide-react';

export const getSidebarItems = (
   role: 'instructor' | 'student' | 'admin',
   counts?: { joinRequests?: number; courseRequests?: number }
) => {
   const commonItems = [
      { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
      { label: 'Settings', icon: Settings, href: '/dashboard/settings' },
   ];

   let items = [];

   switch (role) {
      case 'instructor':
         items = [
            {
               label: 'dashboard',
               icon: LayoutDashboard,
               href: '/dashboard/instructor',
            },
            {
               label: 'My Courses',
               icon: BookOpen,
               href: '/dashboard/instructor/courses',
            },
            {
               label: 'Create New Course',
               icon: PlusCircle,
               href: '/dashboard/instructor/create-course',
            },
            {
               label: 'Messages',
               icon: MessageSquare,
               href: '/dashboard/instructor/messages',
            },
            {
               label: 'settings',
               icon: Settings,
               href: '/dashboard/instructor/settings',
            },
         ];
         break;

      case 'admin':
         items = [
            {
               label: 'Join Requests',
               icon: UserPlus,
               href: '/dashboard/admin/join-requests',
               badge: counts?.joinRequests,
            },
            {
               label: 'Course Requests',
               icon: PackagePlus,
               href: '/dashboard/admin/course-requests',
               badge: counts?.courseRequests,
            },
            {
               label: 'Instructors',
               icon: Users,
               href: '/dashboard/admin/instructors',
            },
         ];
         break;

      default:
         items = [...commonItems];
         break;
   }
   return items;
};
