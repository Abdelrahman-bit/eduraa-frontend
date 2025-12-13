'use client';

/**
 * Ably Provider Component
 *
 * This component wraps parts of the app that need real-time features.
 * It provides:
 * - Ably Realtime client connection
 * - Connection state tracking
 * - React context for Ably hooks (useChannel, usePresence, etc.)
 *
 * IMPORTANT: This must wrap any component using Ably React hooks
 * (useChannel, usePresence, usePresenceListener, etc.)
 *
 * Usage:
 * ```tsx
 * <AblyProvider>
 *   <ChatContainer />
 * </AblyProvider>
 * ```
 */

import React, {
   createContext,
   useContext,
   useEffect,
   useState,
   useCallback,
} from 'react';
import * as Ably from 'ably';
import { AblyProvider as AblyReactProvider } from 'ably/react';
import { apiClient } from '@/lib/http';

// Context for sharing Ably state
interface AblyContextValue {
   client: Ably.Realtime | null;
   isConnected: boolean;
   connectionState: Ably.ConnectionState;
   reconnect: () => void;
}

const AblyContext = createContext<AblyContextValue>({
   client: null,
   isConnected: false,
   connectionState: 'disconnected',
   reconnect: () => {},
});

// Hook to access Ably context
export const useAblyContext = () => useContext(AblyContext);

interface AblyProviderProps {
   children: React.ReactNode;
}

export function AblyProvider({ children }: AblyProviderProps) {
   const [client, setClient] = useState<Ably.Realtime | null>(null);
   const [isConnected, setIsConnected] = useState(false);
   const [connectionState, setConnectionState] =
      useState<Ably.ConnectionState>('disconnected');
   const [error, setError] = useState<string | null>(null);

   // Initialize Ably client
   useEffect(() => {
      // Only run in browser
      if (typeof window === 'undefined') return;

      const token = localStorage.getItem('token');
      if (!token) {
         console.log('[AblyProvider] No auth token, skipping Ably connection');
         return;
      }

      console.log('[AblyProvider] Initializing Ably client...');

      // Create Ably client with token authentication
      const ablyClient = new Ably.Realtime({
         authCallback: async (tokenParams, callback) => {
            try {
               console.log(
                  '[AblyProvider] Fetching Ably token from backend...'
               );
               const response = await apiClient.get('/ably/token');
               console.log('[AblyProvider] Token received');
               callback(null, response.data.data);
            } catch (err: any) {
               console.error('[AblyProvider] Token fetch failed:', err.message);
               callback(err, null);
            }
         },
         autoConnect: true,
         echoMessages: false,
      });

      // Connection state handlers
      const handleConnected = () => {
         console.log('[AblyProvider] Connected to Ably');
         setIsConnected(true);
         setConnectionState('connected');
         setError(null);
      };

      const handleDisconnected = () => {
         console.log('[AblyProvider] Disconnected from Ably');
         setIsConnected(false);
         setConnectionState('disconnected');
      };

      const handleFailed = (stateChange: Ably.ConnectionStateChange) => {
         console.error(
            '[AblyProvider] Connection failed:',
            stateChange.reason?.message
         );
         setIsConnected(false);
         setConnectionState('failed');
         setError(stateChange.reason?.message || 'Connection failed');
      };

      const handleStateChange = (stateChange: Ably.ConnectionStateChange) => {
         console.log(
            `[AblyProvider] Connection state: ${stateChange.previous} -> ${stateChange.current}`
         );
         setConnectionState(stateChange.current);

         if (stateChange.current === 'connected') {
            setIsConnected(true);
         } else if (
            ['disconnected', 'suspended', 'closed', 'failed'].includes(
               stateChange.current
            )
         ) {
            setIsConnected(false);
         }
      };

      // Register listeners
      ablyClient.connection.on('connected', handleConnected);
      ablyClient.connection.on('disconnected', handleDisconnected);
      ablyClient.connection.on('failed', handleFailed);
      ablyClient.connection.on(handleStateChange);

      setClient(ablyClient);

      // Cleanup on unmount or token change
      return () => {
         console.log('[AblyProvider] Cleaning up Ably client');
         ablyClient.connection.off('connected', handleConnected);
         ablyClient.connection.off('disconnected', handleDisconnected);
         ablyClient.connection.off('failed', handleFailed);
         ablyClient.connection.off(handleStateChange);
         ablyClient.close();
         setClient(null);
         setIsConnected(false);
      };
   }, []);

   // Manual reconnect function
   const reconnect = useCallback(() => {
      if (client && !isConnected) {
         console.log('[AblyProvider] Attempting reconnect...');
         client.connect();
      }
   }, [client, isConnected]);

   // Context value
   const contextValue: AblyContextValue = {
      client,
      isConnected,
      connectionState,
      reconnect,
   };

   // If no client yet, just render children without Ably features
   if (!client) {
      return (
         <AblyContext.Provider value={contextValue}>
            {children}
         </AblyContext.Provider>
      );
   }

   // Wrap with AblyReactProvider for React hooks support
   return (
      <AblyReactProvider client={client}>
         <AblyContext.Provider value={contextValue}>
            {children}
         </AblyContext.Provider>
      </AblyReactProvider>
   );
}

export default AblyProvider;
