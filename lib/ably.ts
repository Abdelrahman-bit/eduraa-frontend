/**
 * Ably Client Configuration
 *
 * This module provides the Ably Realtime client for real-time features.
 *
 * KEY CONCEPT: Token Authentication
 * ---------------------------------
 * Instead of exposing the Ably API key in frontend code (security risk!),
 * we use token authentication:
 *
 * 1. Frontend requests a token from our backend (/api/ably/token)
 * 2. Backend uses the secret API key to create a signed token
 * 3. Frontend uses this token to connect to Ably
 * 4. When token expires, Ably SDK automatically requests a new one
 *
 * The `authCallback` method handles this automatically.
 */

import * as Ably from 'ably';

// Singleton client instance
let ablyClient: Ably.Realtime | null = null;

/**
 * Get or create the Ably Realtime client
 * Uses token authentication via our backend
 */
export const getAblyClient = (): Ably.Realtime | null => {
   // Only create client in browser environment
   if (typeof window === 'undefined') {
      return null;
   }

   // Return existing client if already created
   if (ablyClient) {
      return ablyClient;
   }

   // Get auth token from localStorage
   const token = localStorage.getItem('token');
   if (!token) {
      console.log('[Ably] No auth token found, skipping client creation');
      return null;
   }

   const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

   // Create new Ably client with token authentication
   ablyClient = new Ably.Realtime({
      // authCallback is called when Ably needs a token (initial connect + refresh)
      authCallback: async (tokenParams, callback) => {
         try {
            console.log('[Ably] Requesting token from backend...');

            const response = await fetch(`${apiUrl}/ably/token`, {
               method: 'GET',
               headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
               },
            });

            if (!response.ok) {
               throw new Error(`Token request failed: ${response.status}`);
            }

            const data = await response.json();
            console.log('[Ably] Token received successfully');

            // Return the token request to Ably
            callback(null, data.data);
         } catch (error: any) {
            console.error('[Ably] Token request error:', error.message);
            callback(error, null);
         }
      },

      // Enable automatic reconnection
      autoConnect: true,

      // Echo messages back to sender (useful for confirming sends)
      echoMessages: false,
   });

   return ablyClient;
};

/**
 * Disconnect and cleanup the Ably client
 * Call this when user logs out
 */
export const disconnectAbly = (): void => {
   if (ablyClient) {
      console.log('[Ably] Disconnecting client...');
      ablyClient.close();
      ablyClient = null;
   }
};

/**
 * Check if Ably is connected
 */
export const isAblyConnected = (): boolean => {
   return ablyClient?.connection.state === 'connected';
};

/**
 * Get the current connection state
 */
export const getAblyConnectionState = (): string => {
   return ablyClient?.connection.state || 'disconnected';
};
