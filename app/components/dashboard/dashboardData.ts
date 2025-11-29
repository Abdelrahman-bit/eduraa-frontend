import {
   LayoutDashboard,
   PlusCircle,
   BookOpen,
   Wallet,
   MessageSquare,
   Settings,
} from 'lucide-react';

export const getSidebarItems = (role: 'instructor' | 'student') => {
   const commonItems = [
      { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
      { label: 'Settings', icon: Settings, href: '/dashboard/settings' },
   ];

   if (role === 'instructor') {
      return [
         { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
         {
            label: 'Create New Course',
            icon: PlusCircle,
            href: '/dashboard/create-course',
         },
         { label: 'My Courses', icon: BookOpen, href: '/dashboard/courses' },
         { label: 'Earning', icon: Wallet, href: '/dashboard/earnings' },
         {
            label: 'Message',
            icon: MessageSquare,
            href: '/dashboard/messages',
            badge: 3,
         },
         { label: 'Settings', icon: Settings, href: '/dashboard/settings' },
      ];
   }

   return commonItems;
};
