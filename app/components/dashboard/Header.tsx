'use client';

// components/dashboard/Header.tsx
import { Search } from 'lucide-react';
import ProfileDropdown from '../global/ProfileDropdown/ProfileDropdown';
import { NotificationDropdown } from '../notifications/NotificationDropdown';
import { useNotifications } from '@/app/hooks/useNotifications';
import { AblyProvider } from '@/app/providers/AblyProvider';
import { useRouter } from 'next/navigation';

/**
 * Header with notification integration
 */
function HeaderInner() {
   const router = useRouter();
   const { notifications, unreadCount, isLoading, markAsRead, markAllAsRead } =
      useNotifications({ autoRequestPermission: true });

   // Handle notification click - navigate to instructor messages
   const handleNotificationClick = (notification: any) => {
      if (notification.relatedGroup) {
         router.push(
            `/dashboard/instructor/messages?group=${notification.relatedGroup}`
         );
      }
   };

   return (
      <header className="h-20 bg-white border-b border-gray-100 px-8 flex items-center justify-between sticky top-0 z-40">
         <div></div>

         <div className="flex items-center gap-6">
            <NotificationDropdown
               notifications={notifications}
               unreadCount={unreadCount}
               isLoading={isLoading}
               onMarkAsRead={markAsRead}
               onMarkAllAsRead={markAllAsRead}
               onNotificationClick={handleNotificationClick}
            />

            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold cursor-pointer">
               <ProfileDropdown />
            </div>
         </div>
      </header>
   );
}

export default function Header() {
   return (
      <AblyProvider>
         <HeaderInner />
      </AblyProvider>
   );
}
