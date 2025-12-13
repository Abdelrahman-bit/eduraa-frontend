'use client';

/**
 * useNotifications Hook
 *
 * Manages notification state and real-time updates via Ably.
 * Supports browser push notifications for instructor messages.
 */

import { useCallback, useEffect, useState, useRef } from 'react';
import { useAblyContext } from '@/app/providers/AblyProvider';
import {
   AppNotification,
   getNotifications,
   getUnreadCount,
   markAsRead,
   markAllAsRead,
} from '@/app/services/notificationService';
import useStore from '@/app/store/useStore';
import {
   requestNotificationPermission,
   showBrowserNotification,
} from '@/lib/pushNotification';

interface UseNotificationsOptions {
   autoRequestPermission?: boolean;
}

interface UseNotificationsReturn {
   notifications: AppNotification[];
   unreadCount: number;
   isLoading: boolean;
   error: string | null;
   hasPermission: boolean;
   fetchNotifications: () => Promise<void>;
   markAsRead: (id: string) => Promise<void>;
   markAllAsRead: () => Promise<void>;
   requestPermission: () => Promise<boolean>;
}

export function useNotifications(
   options: UseNotificationsOptions = {}
): UseNotificationsReturn {
   const { autoRequestPermission = false } = options;
   const { client, isConnected } = useAblyContext();
   const { user } = useStore();

   const [notifications, setNotifications] = useState<AppNotification[]>([]);
   const [unreadCount, setUnreadCount] = useState(0);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const [hasPermission, setHasPermission] = useState(false);

   // Track if we've already subscribed
   const subscribed = useRef(false);

   // Check notification permission on mount
   // Check browser notification permission on mount
   useEffect(() => {
      if (typeof window !== 'undefined' && 'Notification' in window) {
         setHasPermission(window.Notification.permission === 'granted');
      }
   }, []);

   // Auto-request permission if configured
   useEffect(() => {
      if (autoRequestPermission && !hasPermission) {
         requestNotificationPermission().then(setHasPermission);
      }
   }, [autoRequestPermission, hasPermission]);

   // Fetch initial notifications
   const fetchNotifications = useCallback(async () => {
      // Don't fetch if not authenticated
      if (!user?.id) {
         setIsLoading(false);
         return;
      }

      try {
         setIsLoading(true);
         setError(null);

         console.log(
            '[useNotifications] Fetching notifications for user:',
            user.id
         );
         const response = await getNotifications({ limit: 20 });
         console.log('[useNotifications] Response:', response);

         // Handle both possible response formats
         const notifications = response.data || response;
         const unread = response.unreadCount ?? 0;

         setNotifications(Array.isArray(notifications) ? notifications : []);
         setUnreadCount(unread);
      } catch (err: any) {
         console.error(
            '[useNotifications] Failed to fetch notifications:',
            err
         );
         setError(err.message || 'Failed to load notifications');
         // Don't leave in loading state on error
         setNotifications([]);
         setUnreadCount(0);
      } finally {
         setIsLoading(false);
      }
   }, [user?.id]);

   // Fetch on mount if user is logged in
   useEffect(() => {
      if (user?.id) {
         fetchNotifications();
      } else {
         // Reset state when user logs out
         setNotifications([]);
         setUnreadCount(0);
         setIsLoading(false);
      }
   }, [user?.id, fetchNotifications]);

   // Subscribe to notification channel via Ably
   useEffect(() => {
      if (!client || !isConnected || !user?.id) {
         console.log('[useNotifications] Not ready to subscribe:', {
            hasClient: !!client,
            isConnected,
            userId: user?.id,
         });
         return;
      }

      if (subscribed.current) {
         console.log('[useNotifications] Already subscribed');
         return;
      }

      const channelName = `notifications:${user.id}`;
      console.log('[useNotifications] Subscribing to:', channelName);

      const channel = client.channels.get(channelName);
      subscribed.current = true;

      // Handle new notifications
      const handleNewNotification = (message: any) => {
         console.log(
            '[useNotifications] New notification received:',
            message.data
         );

         const notification = message.data as AppNotification;

         // Add to state
         setNotifications((prev) => {
            // Avoid duplicates
            if (prev.some((n) => n._id === notification._id)) return prev;
            return [notification, ...prev];
         });

         // Increment unread count
         setUnreadCount((prev) => prev + 1);

         // Show browser notification
         const isHighPriority =
            notification.priority === 'high' ||
            notification.type === 'instructor_message';
         console.log(
            '[useNotifications] Showing browser notification, isHighPriority:',
            isHighPriority
         );

         showBrowserNotification({
            title: notification.title,
            body: notification.message,
            icon: notification.sender?.avatar || '/default-avatar.png',
            tag: notification.groupKey || notification._id,
            data: {
               notificationId: notification._id,
               groupId: notification.relatedGroup,
            },
            requireInteraction: isHighPriority,
         });

         // Note: Sound playing removed to avoid 404 errors
         // Browser notifications provide their own audio feedback
      };

      channel.subscribe('new_notification', handleNewNotification);

      return () => {
         console.log('[useNotifications] Unsubscribing from:', channelName);
         channel.unsubscribe('new_notification', handleNewNotification);
         subscribed.current = false;
      };
   }, [client, isConnected, user?.id]);

   // Mark single notification as read
   const handleMarkAsRead = useCallback(async (id: string) => {
      try {
         await markAsRead(id);

         setNotifications((prev) =>
            prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
         );

         setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (err: any) {
         console.error('[useNotifications] Failed to mark as read:', err);
      }
   }, []);

   // Mark all notifications as read
   const handleMarkAllAsRead = useCallback(async () => {
      try {
         await markAllAsRead();

         setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
         setUnreadCount(0);
      } catch (err: any) {
         console.error('[useNotifications] Failed to mark all as read:', err);
      }
   }, []);

   // Request notification permission
   const handleRequestPermission = useCallback(async () => {
      const granted = await requestNotificationPermission();
      setHasPermission(granted);
      return granted;
   }, []);

   return {
      notifications,
      unreadCount,
      isLoading,
      error,
      hasPermission,
      fetchNotifications,
      markAsRead: handleMarkAsRead,
      markAllAsRead: handleMarkAllAsRead,
      requestPermission: handleRequestPermission,
   };
}

export default useNotifications;
