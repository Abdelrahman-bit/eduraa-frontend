'use client';

import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

/**
 * Get or create the Socket.IO instance
 * Ensures only one connection is maintained
 */
export const getSocket = (token: string): Socket => {
   if (!socket) {
      // Get the base server URL (strip /api if present since Socket.IO connects to root)
      let serverUrl =
         process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      serverUrl = serverUrl.replace(/\/api\/?$/, ''); // Remove trailing /api or /api/

      console.log('[Socket] Connecting to:', serverUrl);

      socket = io(serverUrl, {
         auth: { token },
         autoConnect: false,
         reconnection: true,
         reconnectionAttempts: 5,
         reconnectionDelay: 1000,
         reconnectionDelayMax: 5000,
         timeout: 20000,
      });

      // Setup connection event listeners
      socket.on('connect', () => {
         console.log('[Socket] Connected to server');
      });

      socket.on('connect_error', (error) => {
         console.error('[Socket] Connection error:', error.message);
      });

      socket.on('disconnect', (reason) => {
         console.log('[Socket] Disconnected:', reason);
      });
   }

   return socket;
};

/**
 * Check if socket is connected
 */
export const isSocketConnected = (): boolean => {
   return socket?.connected ?? false;
};

/**
 * Disconnect and cleanup socket
 */
export const disconnectSocket = (): void => {
   if (socket) {
      socket.disconnect();
      socket = null;
      console.log('[Socket] Socket disconnected and cleaned up');
   }
};

/**
 * Get current socket instance (may be null)
 */
export const getCurrentSocket = (): Socket | null => {
   return socket;
};
