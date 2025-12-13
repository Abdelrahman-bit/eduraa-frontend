import { apiClient } from '@/lib/http';

/**
 * Notification Service
 *
 * API functions for notification management
 */

// Types
export interface NotificationSender {
   _id: string;
   firstname: string;
   lastname: string;
   avatar?: string;
   role: string;
}

// Renamed to AppNotification to avoid conflict with browser's Notification API
export interface AppNotification {
   _id: string;
   recipient: string;
   type: 'new_message' | 'instructor_message' | 'settings_changed' | 'system';
   title: string;
   message: string;
   relatedGroup?: string;
   relatedMessage?: string;
   relatedCourse?: string;
   sender?: NotificationSender;
   isRead: boolean;
   priority: 'normal' | 'high';
   groupKey?: string;
   createdAt: string;
   updatedAt: string;
}

export interface NotificationPagination {
   page: number;
   limit: number;
   total: number;
   pages: number;
   hasMore: boolean;
}

export interface GetNotificationsResponse {
   status: string;
   data: AppNotification[];
   pagination: NotificationPagination;
   unreadCount: number;
}

export interface UnreadCountResponse {
   status: string;
   data: { count: number };
}

/**
 * Get notifications for the current user
 */
export const getNotifications = async (params?: {
   page?: number;
   limit?: number;
   unreadOnly?: boolean;
}): Promise<GetNotificationsResponse> => {
   const queryParams = new URLSearchParams();
   if (params?.page) queryParams.set('page', params.page.toString());
   if (params?.limit) queryParams.set('limit', params.limit.toString());
   if (params?.unreadOnly) queryParams.set('unreadOnly', 'true');

   const queryString = queryParams.toString();
   const url = queryString ? `/notifications?${queryString}` : '/notifications';

   const response = await apiClient.get<GetNotificationsResponse>(url);
   return response.data;
};

/**
 * Get unread notification count
 */
export const getUnreadCount = async (): Promise<number> => {
   const response = await apiClient.get<UnreadCountResponse>(
      '/notifications/unread-count'
   );
   return response.data.data.count;
};

/**
 * Mark a single notification as read
 */
export const markAsRead = async (
   notificationId: string
): Promise<AppNotification> => {
   const response = await apiClient.patch(
      `/notifications/${notificationId}/read`
   );
   return response.data.data;
};

/**
 * Mark all notifications as read
 */
export const markAllAsRead = async (): Promise<void> => {
   await apiClient.patch('/notifications/read-all');
};

/**
 * Mark notifications for a group as read
 */
export const markGroupAsRead = async (groupId: string): Promise<void> => {
   await apiClient.patch(`/notifications/group/${groupId}/read`);
};

/**
 * Delete a notification
 */
export const deleteNotification = async (
   notificationId: string
): Promise<void> => {
   await apiClient.delete(`/notifications/${notificationId}`);
};
