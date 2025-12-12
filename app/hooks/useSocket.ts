'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { getSocket, disconnectSocket, isSocketConnected } from '@/lib/socket';
import { ChatMessage } from '@/app/services/chatService';

interface UseSocketReturn {
   socket: Socket | null;
   isConnected: boolean;
   joinRoom: (groupId: string) => void;
   leaveRoom: (groupId: string) => void;
   sendMessage: (groupId: string, content: string) => void;
   startTyping: (groupId: string) => void;
   stopTyping: (groupId: string) => void;
}

interface TypingUser {
   userId: string;
   user: {
      firstname: string;
      lastname: string;
   };
}

interface UseSocketOptions {
   onNewMessage?: (message: ChatMessage) => void;
   onMessageSent?: (data: { success: boolean; message: ChatMessage }) => void;
   onError?: (error: { message: string }) => void;
   onUserTyping?: (data: TypingUser) => void;
   onUserStoppedTyping?: (data: { userId: string }) => void;
   onSettingsUpdated?: (data: { groupId: string; settings: any }) => void;
   onRoomJoined?: (data: { groupId: string; roomName: string }) => void;
}

/**
 * Custom hook for managing Socket.IO connection and chat events
 */
export const useSocket = (options: UseSocketOptions = {}): UseSocketReturn => {
   const [socket, setSocket] = useState<Socket | null>(null);
   const [isConnected, setIsConnected] = useState(false);
   const optionsRef = useRef(options);

   // Update options ref when options change
   optionsRef.current = options;

   useEffect(() => {
      // Get token from localStorage (where it's stored by auth)
      const token =
         typeof window !== 'undefined' ? localStorage.getItem('token') : null;

      if (!token) {
         console.log('[useSocket] No token found, skipping socket connection');
         return;
      }

      // Get or create socket instance
      const socketInstance = getSocket(token);

      // Setup event listeners
      const handleConnect = () => {
         console.log('[useSocket] Connected');
         setIsConnected(true);
      };

      const handleDisconnect = () => {
         console.log('[useSocket] Disconnected');
         setIsConnected(false);
      };

      const handleNewMessage = (message: ChatMessage) => {
         console.log('[useSocket] New message received:', message._id);
         optionsRef.current.onNewMessage?.(message);
      };

      const handleMessageSent = (data: {
         success: boolean;
         message: ChatMessage;
      }) => {
         console.log('[useSocket] Message sent confirmation');
         optionsRef.current.onMessageSent?.(data);
      };

      const handleError = (error: { message: string }) => {
         console.error('[useSocket] Error:', error.message);
         optionsRef.current.onError?.(error);
      };

      const handleUserTyping = (data: TypingUser) => {
         optionsRef.current.onUserTyping?.(data);
      };

      const handleUserStoppedTyping = (data: { userId: string }) => {
         optionsRef.current.onUserStoppedTyping?.(data);
      };

      const handleSettingsUpdated = (data: {
         groupId: string;
         settings: any;
      }) => {
         console.log('[useSocket] Settings updated for group:', data.groupId);
         optionsRef.current.onSettingsUpdated?.(data);
      };

      const handleRoomJoined = (data: {
         groupId: string;
         roomName: string;
      }) => {
         console.log('[useSocket] Joined room:', data.roomName);
         optionsRef.current.onRoomJoined?.(data);
      };

      // Register event listeners
      socketInstance.on('connect', handleConnect);
      socketInstance.on('disconnect', handleDisconnect);
      socketInstance.on('new_message', handleNewMessage);
      socketInstance.on('message_sent', handleMessageSent);
      socketInstance.on('error', handleError);
      socketInstance.on('user_typing', handleUserTyping);
      socketInstance.on('user_stopped_typing', handleUserStoppedTyping);
      socketInstance.on('settings_updated', handleSettingsUpdated);
      socketInstance.on('room_joined', handleRoomJoined);

      // Connect if not already connected
      if (!socketInstance.connected) {
         socketInstance.connect();
      } else {
         setIsConnected(true);
      }

      setSocket(socketInstance);

      // Cleanup on unmount
      return () => {
         socketInstance.off('connect', handleConnect);
         socketInstance.off('disconnect', handleDisconnect);
         socketInstance.off('new_message', handleNewMessage);
         socketInstance.off('message_sent', handleMessageSent);
         socketInstance.off('error', handleError);
         socketInstance.off('user_typing', handleUserTyping);
         socketInstance.off('user_stopped_typing', handleUserStoppedTyping);
         socketInstance.off('settings_updated', handleSettingsUpdated);
         socketInstance.off('room_joined', handleRoomJoined);
      };
   }, []);

   const joinRoom = useCallback(
      (groupId: string) => {
         if (socket && isConnected) {
            socket.emit('join_room', { groupId });
         }
      },
      [socket, isConnected]
   );

   const leaveRoom = useCallback(
      (groupId: string) => {
         if (socket && isConnected) {
            socket.emit('leave_room', { groupId });
         }
      },
      [socket, isConnected]
   );

   const sendMessage = useCallback(
      (groupId: string, content: string) => {
         if (socket && isConnected) {
            socket.emit('send_message', { groupId, content });
         } else {
            console.warn('[useSocket] Cannot send message - not connected');
            optionsRef.current.onError?.({
               message: 'Not connected to chat server',
            });
         }
      },
      [socket, isConnected]
   );

   const startTyping = useCallback(
      (groupId: string) => {
         if (socket && isConnected) {
            socket.emit('typing_start', { groupId });
         }
      },
      [socket, isConnected]
   );

   const stopTyping = useCallback(
      (groupId: string) => {
         if (socket && isConnected) {
            socket.emit('typing_stop', { groupId });
         }
      },
      [socket, isConnected]
   );

   return {
      socket,
      isConnected,
      joinRoom,
      leaveRoom,
      sendMessage,
      startTyping,
      stopTyping,
   };
};

export default useSocket;
