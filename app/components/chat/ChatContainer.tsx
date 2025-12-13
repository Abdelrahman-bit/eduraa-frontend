'use client';

/**
 * ChatContainer Component (Ably Version)
 *
 * Main chat container combining sidebar and chat window.
 * Uses Ably for real-time messaging via the useAblyChat hook.
 *
 * CHANGES FROM SOCKET.IO VERSION:
 * - Replaced useSocket with useAblyChat
 * - Removed manual room join/leave (Ably handles via channel subscription)
 * - Messages are now sent via REST API first (for persistence),
 *   then broadcast via Ably (for real-time delivery)
 * - Wrapped with AblyProvider for Ably context
 * - Supports ?group= query param for deep linking from notifications
 */

import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { ChatSidebar } from './ChatSidebar';
import { ChatWindow } from './ChatWindow';
import {
   ChatGroup,
   ChatMessage,
   getChatGroups,
   getChatMessages,
   updateChatSettings,
   sendMessageRest,
} from '@/app/services/chatService';
import { useAblyChat } from '@/app/hooks/useAblyChat';
import { AblyProvider } from '@/app/providers/AblyProvider';
import useStore from '@/app/store/useStore';
import toast from 'react-hot-toast';
import { Lock, LockOpen, X, Settings } from 'lucide-react';

interface ChatContainerProps {
   userRole: 'instructor' | 'student' | 'admin';
}

interface TypingUser {
   userId: string;
   user: { firstname: string; lastname: string };
}

/**
 * Inner component that uses Ably hooks
 * Must be wrapped with AblyProvider
 */
const ChatContainerInner: React.FC<ChatContainerProps> = ({ userRole }) => {
   const { user } = useStore();
   const [groups, setGroups] = useState<ChatGroup[]>([]);
   const [selectedGroup, setSelectedGroup] = useState<ChatGroup | null>(null);
   const [messages, setMessages] = useState<ChatMessage[]>([]);
   const [isLoadingGroups, setIsLoadingGroups] = useState(true);
   const [isLoadingMessages, setIsLoadingMessages] = useState(false);
   const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
   const [showSettingsModal, setShowSettingsModal] = useState(false);
   const [isMobileView, setIsMobileView] = useState(false);
   const [showSidebar, setShowSidebar] = useState(true);

   // Current user info
   const currentUserId = user?.id?.toString() || '';
   const currentUserInfo = {
      firstname: user?.firstName || '',
      lastname: user?.lastName || '',
   };

   // Ably chat hook - connects to channel based on selected group
   const {
      isConnected,
      sendMessage: ablySendMessage,
      startTyping: ablyStartTyping,
      stopTyping: ablyStopTyping,
      typingUsers: ablyTypingUsers,
      connectionState,
   } = useAblyChat(selectedGroup?._id || null, {
      currentUserId,
      onNewMessage: (message) => {
         // Add new message to the list
         console.log(
            '[ChatContainer] New message received via Ably:',
            message._id
         );
         setMessages((prev) => {
            // Avoid duplicates
            if (prev.some((m) => m._id === message._id)) return prev;
            return [...prev, message];
         });
      },
      onError: (error) => {
         toast.error(error.message);
      },
      onUserTyping: (data) => {
         if (data.userId !== currentUserId) {
            setTypingUsers((prev) => {
               if (prev.some((u) => u.userId === data.userId)) return prev;
               return [...prev, data];
            });
         }
      },
      onUserStoppedTyping: (data) => {
         setTypingUsers((prev) => prev.filter((u) => u.userId !== data.userId));
      },
      onSettingsUpdated: (data) => {
         // Real-time settings update from instructor
         console.log('[ChatContainer] Settings updated via Ably:', data);

         // Update the selected group if it matches
         if (selectedGroup?._id === data.groupId) {
            setSelectedGroup((prev) =>
               prev ? { ...prev, settings: data.settings } : prev
            );

            // Show notification to user about the change
            if (data.settings.instructorOnlyMode) {
               toast(
                  'Chat is now in broadcast mode - only instructor can send messages',
                  {
                     icon: '🔒',
                     duration: 4000,
                  }
               );
            } else {
               toast('Chat is now open - everyone can send messages', {
                  icon: '🔓',
                  duration: 4000,
               });
            }
         }

         // Update groups list
         setGroups((prev) =>
            prev.map((g) =>
               g._id === data.groupId ? { ...g, settings: data.settings } : g
            )
         );
      },
   });

   // Detect mobile view
   useEffect(() => {
      const checkMobile = () => {
         setIsMobileView(window.innerWidth < 1024);
      };
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
   }, []);

   // Get group ID from URL query parameter (for deep linking from notifications)
   const searchParams = useSearchParams();
   const groupIdFromUrl = searchParams.get('group');

   // Fetch chat groups on mount
   useEffect(() => {
      const fetchGroups = async () => {
         try {
            setIsLoadingGroups(true);
            const data = await getChatGroups();
            setGroups(data);

            // Auto-select group from URL parameter if present
            if (groupIdFromUrl && !selectedGroup) {
               const matchingGroup = data.find(
                  (g: ChatGroup) => g._id === groupIdFromUrl
               );
               if (matchingGroup) {
                  setSelectedGroup(matchingGroup);
               }
            }
         } catch (error: any) {
            toast.error(error.message || 'Failed to load chat groups');
         } finally {
            setIsLoadingGroups(false);
         }
      };

      fetchGroups();
   }, [groupIdFromUrl]);

   // Fetch messages when group changes
   useEffect(() => {
      if (!selectedGroup) return;

      const fetchMessages = async () => {
         try {
            setIsLoadingMessages(true);
            const response = await getChatMessages(selectedGroup._id);
            setMessages(response.data);
         } catch (error: any) {
            toast.error(error.message || 'Failed to load messages');
         } finally {
            setIsLoadingMessages(false);
         }
      };

      fetchMessages();

      // Clear typing users when switching groups
      setTypingUsers([]);
   }, [selectedGroup?._id]);

   // Handle group selection
   const handleSelectGroup = useCallback(
      (group: ChatGroup) => {
         setSelectedGroup(group);

         // Reset unread count in the groups list when selecting
         if (group.unreadCount && group.unreadCount > 0) {
            setGroups((prev) =>
               prev.map((g) =>
                  g._id === group._id ? { ...g, unreadCount: 0 } : g
               )
            );
         }

         if (isMobileView) {
            setShowSidebar(false);
         }
      },
      [isMobileView]
   );

   // Handle sending message
   // Flow: Save to DB via REST → Broadcast via Ably
   const handleSendMessage = useCallback(
      async (content: string) => {
         if (!selectedGroup || !content.trim()) return;

         try {
            // 1. Save message to database via REST API
            const savedMessage = await sendMessageRest(
               selectedGroup._id,
               content
            );

            // 2. Add to local state immediately for sender
            setMessages((prev) => {
               if (prev.some((m) => m._id === savedMessage._id)) return prev;
               return [...prev, savedMessage];
            });

            // 3. Broadcast via Ably for other users
            await ablySendMessage(content, savedMessage);
         } catch (error: any) {
            toast.error(error.message || 'Failed to send message');
         }
      },
      [selectedGroup, ablySendMessage]
   );

   // Handle typing indicators
   const handleTypingStart = useCallback(() => {
      if (selectedGroup && currentUserId) {
         ablyStartTyping(currentUserId, currentUserInfo);
      }
   }, [selectedGroup, currentUserId, currentUserInfo, ablyStartTyping]);

   const handleTypingStop = useCallback(() => {
      if (selectedGroup && currentUserId) {
         ablyStopTyping(currentUserId);
      }
   }, [selectedGroup, currentUserId, ablyStopTyping]);

   // Handle settings update
   const handleUpdateSettings = async (instructorOnlyMode: boolean) => {
      if (!selectedGroup) return;

      try {
         const updated = await updateChatSettings(selectedGroup._id, {
            instructorOnlyMode,
         });
         setSelectedGroup((prev) =>
            prev ? { ...prev, settings: updated.settings } : prev
         );
         setGroups((prev) =>
            prev.map((g) =>
               g._id === selectedGroup._id
                  ? { ...g, settings: updated.settings }
                  : g
            )
         );
         toast.success(
            instructorOnlyMode
               ? 'Chat is now instructor-only'
               : 'All members can now send messages'
         );
         setShowSettingsModal(false);
      } catch (error: any) {
         toast.error(error.message || 'Failed to update settings');
      }
   };

   // Handle back navigation (mobile)
   const handleBack = () => {
      setShowSidebar(true);
      setSelectedGroup(null);
   };

   // Combine typing users from Ably hook and local state
   const allTypingUsers = [...typingUsers, ...ablyTypingUsers].filter(
      (user, index, self) =>
         index === self.findIndex((u) => u.userId === user.userId)
   );

   return (
      <div className="flex bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden h-full w-full">
         {/* Sidebar */}
         <div
            className={`${
               isMobileView
                  ? showSidebar
                     ? 'w-full'
                     : 'hidden'
                  : 'w-80 flex-shrink-0'
            } h-full`}
         >
            <ChatSidebar
               groups={groups}
               selectedGroupId={selectedGroup?._id || null}
               onSelectGroup={handleSelectGroup}
               isLoading={isLoadingGroups}
            />
         </div>

         {/* Chat window */}
         <div
            className={`flex-1 min-w-0 h-full ${
               isMobileView && showSidebar ? 'hidden' : 'flex flex-col'
            }`}
         >
            <ChatWindow
               group={selectedGroup}
               currentUserId={currentUserId}
               isConnected={isConnected}
               messages={messages}
               onSendMessage={handleSendMessage}
               onTypingStart={handleTypingStart}
               onTypingStop={handleTypingStop}
               typingUsers={allTypingUsers}
               onSettingsClick={() => setShowSettingsModal(true)}
               onBack={handleBack}
               showBackButton={isMobileView}
            />
         </div>

         {/* Settings Modal - Premium Glass Effect */}
         {showSettingsModal && selectedGroup && (
            <div
               className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
               onClick={() => setShowSettingsModal(false)}
            >
               <div
                  className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
                  onClick={(e) => e.stopPropagation()}
               >
                  <div className="flex items-center justify-between mb-6">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-purple-100 rounded-xl flex items-center justify-center">
                           <Settings className="w-5 h-5 text-orange-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">
                           Chat Settings
                        </h3>
                     </div>
                     <button
                        onClick={() => setShowSettingsModal(false)}
                        className="p-2 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                     >
                        <X className="w-5 h-5 text-gray-400" />
                     </button>
                  </div>

                  <div className="space-y-4">
                     <div className="p-4 bg-gradient-to-r from-gray-50 to-orange-50/30 rounded-xl border border-gray-100">
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-3">
                              <div
                                 className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                    selectedGroup.settings?.instructorOnlyMode
                                       ? 'bg-orange-100'
                                       : 'bg-green-100'
                                 }`}
                              >
                                 {selectedGroup.settings?.instructorOnlyMode ? (
                                    <Lock className="w-5 h-5 text-orange-600" />
                                 ) : (
                                    <LockOpen className="w-5 h-5 text-green-600" />
                                 )}
                              </div>
                              <div>
                                 <p className="font-medium text-gray-900">
                                    Broadcast Mode
                                 </p>
                                 <p className="text-sm text-gray-500">
                                    {selectedGroup.settings?.instructorOnlyMode
                                       ? 'Only you can send messages'
                                       : 'Everyone can participate'}
                                 </p>
                              </div>
                           </div>
                           <button
                              onClick={() =>
                                 handleUpdateSettings(
                                    !selectedGroup.settings?.instructorOnlyMode
                                 )
                              }
                              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 cursor-pointer ${
                                 selectedGroup.settings?.instructorOnlyMode
                                    ? 'bg-gradient-to-r from-orange-500 to-orange-600'
                                    : 'bg-gray-300'
                              }`}
                           >
                              <span
                                 className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-300 ${
                                    selectedGroup.settings?.instructorOnlyMode
                                       ? 'translate-x-6'
                                       : 'translate-x-1'
                                 }`}
                              />
                           </button>
                        </div>
                     </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                     <button
                        onClick={() => setShowSettingsModal(false)}
                        className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium cursor-pointer"
                     >
                        Done
                     </button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};

/**
 * Main ChatContainer export
 * Wraps the inner component with AblyProvider
 */
export const ChatContainer: React.FC<ChatContainerProps> = ({ userRole }) => {
   return (
      <AblyProvider>
         <ChatContainerInner userRole={userRole} />
      </AblyProvider>
   );
};

export default ChatContainer;
