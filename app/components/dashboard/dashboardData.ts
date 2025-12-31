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
   GraduationCap,
   Building,
   CalendarCheck,
   LogOut,
   Folders,
} from 'lucide-react';

export const getSidebarItems = (
   role: 'instructor' | 'student' | 'admin',
   counts?: {
      joinRequests?: number;
      courseRequests?: number;
      bookingRequests?: number;
      enrollmentRequests?: number;
   }
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
               label: 'Dashboard',
               icon: LayoutDashboard,
               href: '/dashboard/instructor',
            },
            {
               label: 'My Courses',
               icon: BookOpen,
               href: '/dashboard/instructor/courses',
            },
            {
               label: 'Enrollment Requests',
               icon: UserPlus,
               href: '/dashboard/instructor/enrollment-requests',
               badge: counts?.enrollmentRequests,
            },
            {
               label: 'Create New Course',
               icon: PlusCircle,
               href: '/dashboard/instructor/create-course',
            },
            {
               label: 'Book a Hall',
               icon: Building,
               href: '/dashboard/instructor/halls',
            },
            {
               label: 'Messages',
               icon: MessageSquare,
               href: '/dashboard/instructor/messages',
            },
            {
               label: 'Settings',
               icon: Settings,
               href: '/dashboard/instructor/settings',
            },
         ];
         break;

      case 'admin':
         items = [
            {
               label: 'Dashboard',
               icon: LayoutDashboard,
               href: '/dashboard/admin',
            },
            {
               label: 'Categories',
               icon: Folders,
               href: '/dashboard/admin/categories',
            },
            {
               label: 'Instructors',
               icon: Users,
               href: '/dashboard/admin/instructors',
               badge: counts?.joinRequests,
            },
            {
               label: 'All Courses',
               icon: BookOpen,
               href: '/dashboard/admin/courses',
               badge: counts?.courseRequests,
            },
            {
               label: 'Students',
               icon: GraduationCap,
               href: '/dashboard/admin/students',
            },
            {
               label: 'Halls',
               icon: Building,
               href: '/dashboard/admin/halls',
            },
            {
               label: 'Halls Status',
               icon: CalendarCheck,
               href: '/dashboard/admin/halls/status',
            },
            {
               label: 'Settings',
               icon: Settings,
               href: '/dashboard/admin/settings',
            },
         ];
         break;

      default:
         items = [...commonItems];
         break;
   }
   return items;
};
