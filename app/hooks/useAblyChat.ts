'use client';

/**
 * useAblyChat Hook
 *
 * This hook replaces the old useSocket hook for real-time chat functionality.
 * It manages Ably channel subscriptions manually to handle the case where
 * the client may not be immediately available.
 *
 * CHANNEL NAMING CONVENTION:
 * - Chat messages: `chat:{groupId}` (e.g., `chat:507f1f77bcf86cd799439011`)
 * - Notifications: `notifications:{userId}` for personal
 *
 * MESSAGE TYPES (published with different event names):
 * - 'message': Chat message
 * - 'typing_start': User started typing
 * - 'typing_stop': User stopped typing
 */

import { useCallback, useEffect, useState, useRef } from 'react';
import type { RealtimeChannel } from 'ably';
import { ChatMessage } from '@/app/services/chatService';
import { useAblyContext } from '@/app/providers/AblyProvider';

// Typing user structure
interface TypingUser {
   userId: string;
   user: { firstname: string; lastname: string };
}

// Settings update structure
interface SettingsUpdate {
   groupId: string;
   settings: {
      instructorOnlyMode: boolean;
      isActive: boolean;
   };
}

// Hook options
interface UseAblyChatOptions {
   onNewMessage?: (message: ChatMessage) => void;
   onError?: (error: { message: string }) => void;
   onUserTyping?: (data: TypingUser) => void;
   onUserStoppedTyping?: (data: { userId: string }) => void;
   onSettingsUpdated?: (data: SettingsUpdate) => void;
   currentUserId?: string;
}

// Return type
interface UseAblyChatReturn {
   isConnected: boolean;
   sendMessage: (
      content: string,
      messageData: Partial<ChatMessage>
   ) => Promise<void>;
   startTyping: (
      userId: string,
      user: { firstname: string; lastname: string }
   ) => void;
   stopTyping: (userId: string) => void;
   typingUsers: TypingUser[];
   onlineUsers: string[];
   connectionState: string;
}

/**
 * Custom hook for Ably-powered chat functionality
 *
 * @param groupId - The chat group ID to subscribe to (null if no group selected)
 * @param options - Callback options for handling events
 */
export function useAblyChat(
   groupId: string | null,
   options: UseAblyChatOptions = {}
): UseAblyChatReturn {
   const { client, isConnected, connectionState } = useAblyContext();
   const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
   const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
   const [channel, setChannel] = useState<RealtimeChannel | null>(null);

   // Use ref to keep options stable across renders
   const optionsRef = useRef(options);
   optionsRef.current = options;

   // Typing timeout for auto-stop
   const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

   // Channel name for this chat group
   const channelName = groupId ? `chat:${groupId}` : null;

   // Subscribe to channel when client and groupId are available
   useEffect(() => {
      if (!client || !channelName) {
         setChannel(null);
         return;
      }

      console.log('[useAblyChat] Subscribing to channel:', channelName);

      // Get the channel
      const ch = client.channels.get(channelName);
      setChannel(ch);

      // Message handler
      const handleMessage = (message: any) => {
         console.log(
            '[useAblyChat] Received message:',
            message.name,
            message.data
         );

         switch (message.name) {
            case 'message':
               // New chat message
               const chatMessage = message.data as ChatMessage;
               optionsRef.current.onNewMessage?.(chatMessage);
               break;

            case 'typing_start':
               // User started typing
               const typingData = message.data as TypingUser;
               // Don't show our own typing
               if (typingData.userId !== optionsRef.current.currentUserId) {
                  setTypingUsers((prev) => {
                     if (prev.some((u) => u.userId === typingData.userId))
                        return prev;
                     return [...prev, typingData];
                  });
                  optionsRef.current.onUserTyping?.(typingData);
               }
               break;

            case 'typing_stop':
               // User stopped typing
               const { userId } = message.data as { userId: string };
               setTypingUsers((prev) =>
                  prev.filter((u) => u.userId !== userId)
               );
               optionsRef.current.onUserStoppedTyping?.({ userId });
               break;

            case 'settings_updated':
               // Chat settings were updated by instructor
               const settingsData = message.data as SettingsUpdate;
               console.log('[useAblyChat] Settings updated:', settingsData);
               optionsRef.current.onSettingsUpdated?.(settingsData);
               break;
         }
      };

      // Subscribe to all messages on the channel
      ch.subscribe(handleMessage);

      // Enter presence
      ch.presence.enter({ status: 'online' }).catch((err: any) => {
         console.error('[useAblyChat] Failed to enter presence:', err);
      });

      // Get initial presence
      ch.presence
         .get()
         .then((members: any[]) => {
            const userIds = members.map((m) => m.clientId);
            setOnlineUsers(userIds);
         })
         .catch((err: any) => {
            console.error('[useAblyChat] Failed to get presence:', err);
         });

      // Listen for presence updates
      const handlePresenceEnter = (member: any) => {
         setOnlineUsers((prev) => {
            if (prev.includes(member.clientId)) return prev;
            return [...prev, member.clientId];
         });
      };

      const handlePresenceLeave = (member: any) => {
         setOnlineUsers((prev) => prev.filter((id) => id !== member.clientId));
      };

      ch.presence.subscribe('enter', handlePresenceEnter);
      ch.presence.subscribe('leave', handlePresenceLeave);

      // Cleanup
      return () => {
         console.log('[useAblyChat] Unsubscribing from channel:', channelName);
         ch.unsubscribe(handleMessage);
         ch.presence.unsubscribe('enter', handlePresenceEnter);
         ch.presence.unsubscribe('leave', handlePresenceLeave);
         ch.presence.leave().catch(() => {});
      };
   }, [client, channelName]);

   // Clear typing users when switching groups
   useEffect(() => {
      setTypingUsers([]);
   }, [groupId]);

   /**
    * Send a message to the chat channel
    *
    * NOTE: This publishes to Ably for real-time delivery.
    * The actual message should be saved to MongoDB via REST API first,
    * then this is called to broadcast to other users.
    */
   const sendMessage = useCallback(
      async (content: string, messageData: Partial<ChatMessage>) => {
         if (!channel || !content.trim()) {
            console.warn(
               '[useAblyChat] Cannot send: no active channel or empty content'
            );
            return;
         }

         try {
            console.log('[useAblyChat] Publishing message to channel');

            await channel.publish('message', {
               ...messageData,
               content: content.trim(),
               timestamp: new Date().toISOString(),
            });

            console.log('[useAblyChat] Message published successfully');
         } catch (error: any) {
            console.error(
               '[useAblyChat] Failed to publish message:',
               error.message
            );
            optionsRef.current.onError?.({ message: error.message });
         }
      },
      [channel]
   );

   /**
    * Signal that user started typing
    */
   const startTyping = useCallback(
      (userId: string, user: { firstname: string; lastname: string }) => {
         if (!channel) return;

         // Clear existing timeout
         if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
         }

         // Publish typing start
         channel
            .publish('typing_start', { userId, user })
            .catch((err: any) =>
               console.error('[useAblyChat] Failed to send typing_start:', err)
            );

         // Auto-stop after 3 seconds of no typing
         typingTimeoutRef.current = setTimeout(() => {
            channel
               .publish('typing_stop', { userId })
               .catch((err: any) =>
                  console.error(
                     '[useAblyChat] Failed to send typing_stop:',
                     err
                  )
               );
         }, 3000);
      },
      [channel]
   );

   /**
    * Signal that user stopped typing
    */
   const stopTyping = useCallback(
      (userId: string) => {
         if (!channel) return;

         // Clear auto-stop timeout
         if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = null;
         }

         channel
            .publish('typing_stop', { userId })
            .catch((err: any) =>
               console.error('[useAblyChat] Failed to send typing_stop:', err)
            );
      },
      [channel]
   );

   // Cleanup on unmount
   useEffect(() => {
      return () => {
         if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
         }
      };
   }, []);

   return {
      isConnected,
      sendMessage,
      startTyping,
      stopTyping,
      typingUsers,
      onlineUsers,
      connectionState: connectionState || 'disconnected',
   };
}

export default useAblyChat;
