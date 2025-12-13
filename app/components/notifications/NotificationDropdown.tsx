'use client';

/**
 * NotificationDropdown Component
 *
 * A dropdown menu showing the user's notifications.
 * Highlights instructor messages with special styling.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
   Bell,
   Check,
   CheckCheck,
   MessageCircle,
   Settings,
   X,
} from 'lucide-react';
import { AppNotification } from '@/app/services/notificationService';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

interface NotificationDropdownProps {
   notifications: AppNotification[];
   unreadCount: number;
   isLoading?: boolean;
   onMarkAsRead: (id: string) => void;
   onMarkAllAsRead: () => void;
   onNotificationClick?: (notification: AppNotification) => void;
}

export function NotificationDropdown({
   notifications,
   unreadCount,
   isLoading = false,
   onMarkAsRead,
   onMarkAllAsRead,
   onNotificationClick,
}: NotificationDropdownProps) {
   const [isOpen, setIsOpen] = useState(false);
   const dropdownRef = useRef<HTMLDivElement>(null);

   // Close dropdown when clicking outside
   useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
         if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target as Node)
         ) {
            setIsOpen(false);
         }
      };

      if (isOpen) {
         document.addEventListener('mousedown', handleClickOutside);
      }

      return () => {
         document.removeEventListener('mousedown', handleClickOutside);
      };
   }, [isOpen]);

   // Handle notification click
   const handleNotificationClick = (notification: AppNotification) => {
      if (!notification.isRead) {
         onMarkAsRead(notification._id);
      }
      onNotificationClick?.(notification);
      setIsOpen(false);
   };

   // Format time ago
   const formatTimeAgo = (dateStr: string) => {
      try {
         return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
      } catch {
         return 'just now';
      }
   };

   // Get notification icon based on type
   const getNotificationIcon = (notification: AppNotification) => {
      if (notification.type === 'instructor_message') {
         return (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-sm">
               📢
            </div>
         );
      }

      if (notification.type === 'settings_changed') {
         return (
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
               <Settings size={18} />
            </div>
         );
      }

      // Default: show sender avatar or icon
      if (notification.sender?.avatar) {
         return (
            <img
               src={notification.sender.avatar}
               alt={`${notification.sender.firstname} ${notification.sender.lastname}`}
               className="w-10 h-10 rounded-full object-cover"
            />
         );
      }

      return (
         <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
            <MessageCircle size={18} />
         </div>
      );
   };

   return (
      <div ref={dropdownRef} className="relative">
         {/* Bell Button */}
         <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
         >
            <Bell size={20} />
            {unreadCount > 0 && (
               <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1">
                  {unreadCount > 99 ? '99+' : unreadCount}
               </span>
            )}
         </button>

         {/* Dropdown */}
         {isOpen && (
            <div className="absolute right-0 top-full mt-2 w-96 max-h-[480px] bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50">
               {/* Header */}
               <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-orange-50/30">
                  <div className="flex items-center gap-2">
                     <h3 className="font-semibold text-gray-900">
                        Notifications
                     </h3>
                     {unreadCount > 0 && (
                        <span className="px-2 py-0.5 bg-orange-100 text-orange-600 text-xs font-medium rounded-full">
                           {unreadCount} new
                        </span>
                     )}
                  </div>
                  {unreadCount > 0 && (
                     <button
                        onClick={onMarkAllAsRead}
                        className="text-xs text-orange-600 hover:text-orange-700 flex items-center gap-1 font-medium"
                     >
                        <CheckCheck size={14} />
                        Mark all read
                     </button>
                  )}
               </div>

               {/* Notifications List */}
               <div className="max-h-[380px] overflow-y-auto">
                  {isLoading ? (
                     <div className="p-8 text-center text-gray-500">
                        <div className="animate-spin w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full mx-auto mb-2" />
                        Loading...
                     </div>
                  ) : notifications.length === 0 ? (
                     <div className="p-8 text-center text-gray-500">
                        <Bell
                           size={32}
                           className="mx-auto mb-2 text-gray-300"
                        />
                        <p>No notifications yet</p>
                     </div>
                  ) : (
                     notifications.slice(0, 10).map((notification) => (
                        <div
                           key={notification._id}
                           onClick={() => handleNotificationClick(notification)}
                           className={`px-4 py-3 flex gap-3 cursor-pointer transition-colors border-b border-gray-50 last:border-none
                              ${!notification.isRead ? 'bg-orange-50/50' : 'hover:bg-gray-50'}
                              ${notification.priority === 'high' ? 'border-l-4 border-l-orange-500' : ''}`}
                        >
                           {/* Icon */}
                           <div className="flex-shrink-0">
                              {getNotificationIcon(notification)}
                           </div>

                           {/* Content */}
                           <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                 <p
                                    className={`text-sm ${notification.isRead ? 'text-gray-600' : 'text-gray-900 font-medium'}`}
                                 >
                                    {notification.title}
                                 </p>
                                 {!notification.isRead && (
                                    <span className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0 mt-1.5" />
                                 )}
                              </div>
                              <p className="text-sm text-gray-500 truncate mt-0.5">
                                 {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                 {formatTimeAgo(notification.createdAt)}
                              </p>
                           </div>
                        </div>
                     ))
                  )}
               </div>

               {/* Footer */}
               {notifications.length > 10 && (
                  <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
                     <Link
                        href="/notifications"
                        className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                        onClick={() => setIsOpen(false)}
                     >
                        View all notifications →
                     </Link>
                  </div>
               )}
            </div>
         )}
      </div>
   );
}

export default NotificationDropdown;
