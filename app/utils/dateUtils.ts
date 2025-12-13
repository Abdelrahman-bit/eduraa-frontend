/**
 * Utility functions for date formatting and manipulation
 */

/**
 * Format a date relative to now (e.g., "2 hours ago", "just now")
 */
export function formatDistanceToNow(date: Date): string {
   const now = new Date();
   const diffMs = now.getTime() - date.getTime();
   const diffSecs = Math.floor(diffMs / 1000);
   const diffMins = Math.floor(diffSecs / 60);
   const diffHours = Math.floor(diffMins / 60);
   const diffDays = Math.floor(diffHours / 24);
   const diffWeeks = Math.floor(diffDays / 7);
   const diffMonths = Math.floor(diffDays / 30);

   if (diffSecs < 60) {
      return 'just now';
   } else if (diffMins < 60) {
      return `${diffMins}m ago`;
   } else if (diffHours < 24) {
      return `${diffHours}h ago`;
   } else if (diffDays < 7) {
      return `${diffDays}d ago`;
   } else if (diffWeeks < 4) {
      return `${diffWeeks}w ago`;
   } else if (diffMonths < 12) {
      return `${diffMonths}mo ago`;
   } else {
      return date.toLocaleDateString();
   }
}

/**
 * Format a date for message timestamps
 */
export function formatMessageTime(date: Date): string {
   return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/**
 * Format a date with full details
 */
export function formatFullDate(date: Date): string {
   return date.toLocaleDateString([], {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
   });
}

/**
 * Check if two dates are on the same day
 */
export function isSameDay(date1: Date, date2: Date): boolean {
   return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
   );
}

/**
 * Get a date separator label (e.g., "Today", "Yesterday", "Monday")
 */
export function getDateSeparatorLabel(date: Date): string {
   const now = new Date();
   const yesterday = new Date(now);
   yesterday.setDate(yesterday.getDate() - 1);

   if (isSameDay(date, now)) {
      return 'Today';
   } else if (isSameDay(date, yesterday)) {
      return 'Yesterday';
   } else {
      // Check if within the last week
      const diffDays = Math.floor(
         (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (diffDays < 7) {
         return date.toLocaleDateString([], { weekday: 'long' });
      } else {
         return date.toLocaleDateString([], {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
         });
      }
   }
}
