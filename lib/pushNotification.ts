/**
 * Push Notification Utility
 *
 * Handles browser push notifications using the Web Notification API.
 * Works when the browser is open but the site tab is not focused.
 */

/**
 * Request notification permission from the user
 */
export async function requestNotificationPermission(): Promise<boolean> {
   if (typeof window === 'undefined' || !('Notification' in window)) {
      console.log('[Push] Notifications not supported in this browser');
      return false;
   }

   if (Notification.permission === 'granted') {
      return true;
   }

   if (Notification.permission === 'denied') {
      console.log('[Push] Notifications were previously denied');
      return false;
   }

   try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
   } catch (err) {
      console.error('[Push] Error requesting permission:', err);
      return false;
   }
}

/**
 * Check if notifications are supported and permitted
 */
export function canShowNotifications(): boolean {
   return (
      typeof window !== 'undefined' &&
      'Notification' in window &&
      Notification.permission === 'granted'
   );
}

/**
 * Show a browser notification
 */
export interface NotificationOptions {
   title: string;
   body: string;
   icon?: string;
   badge?: string;
   tag?: string; // Used to replace notifications with same tag
   data?: Record<string, any>;
   requireInteraction?: boolean; // Keep notification until user interacts
   silent?: boolean;
}

export function showBrowserNotification(
   options: NotificationOptions
): Notification | null {
   if (!canShowNotifications()) {
      console.log('[Push] Cannot show notification - not permitted');
      return null;
   }

   try {
      const notification = new Notification(options.title, {
         body: options.body,
         icon: options.icon || '/icons/notification-icon.png',
         badge: options.badge || '/icons/badge-icon.png',
         tag: options.tag,
         data: options.data,
         requireInteraction: options.requireInteraction ?? false,
         silent: options.silent ?? false,
      });

      // Handle click - focus the tab or open the app
      notification.onclick = (event) => {
         event.preventDefault();

         // Focus the window
         window.focus();

         // Navigate to the related chat if available
         if (options.data?.groupId) {
            // You could use Next.js router here, but for now just focus
            console.log('[Push] Navigate to group:', options.data.groupId);
         }

         notification.close();
      };

      // Auto-close after 5 seconds if not an instructor message
      if (!options.requireInteraction) {
         setTimeout(() => {
            notification.close();
         }, 5000);
      }

      return notification;
   } catch (err) {
      console.error('[Push] Failed to show notification:', err);
      return null;
   }
}

/**
 * Show a notification for instructor message (high priority)
 */
export function showInstructorNotification({
   title,
   message,
   senderName,
   groupName,
   groupId,
}: {
   title?: string;
   message: string;
   senderName: string;
   groupName: string;
   groupId: string;
}): Notification | null {
   return showBrowserNotification({
      title: title || `📢 ${senderName} (Instructor)`,
      body: `${groupName}: ${message}`,
      tag: `instructor-${groupId}`,
      data: { groupId, type: 'instructor_message' },
      requireInteraction: true, // Keep until user acknowledges
   });
}

/**
 * Show a notification for regular message
 */
export function showMessageNotification({
   senderName,
   message,
   groupName,
   groupId,
}: {
   senderName: string;
   message: string;
   groupName: string;
   groupId: string;
}): Notification | null {
   return showBrowserNotification({
      title: `New message from ${senderName}`,
      body: `${groupName}: ${message}`,
      tag: `message-${groupId}`,
      data: { groupId, type: 'new_message' },
      requireInteraction: false,
   });
}
