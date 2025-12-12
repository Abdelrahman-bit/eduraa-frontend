'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { ChatSidebar } from './ChatSidebar';
import { ChatWindow } from './ChatWindow';
import {
   ChatGroup,
   ChatMessage,
   getChatGroups,
   getChatMessages,
   updateChatSettings,
} from '@/app/services/chatService';
import { useSocket } from '@/app/hooks/useSocket';
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
 * Main chat container component combining sidebar and chat window
 */
export const ChatContainer: React.FC<ChatContainerProps> = ({ userRole }) => {
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

   // Socket connection
   const {
      socket,
      isConnected,
      joinRoom,
      leaveRoom,
      sendMessage: socketSendMessage,
      startTyping,
      stopTyping,
   } = useSocket({
      onNewMessage: (message) => {
         // Only add if it's for the current group
         if (selectedGroup && message.chatGroup === selectedGroup._id) {
            setMessages((prev) => {
               // Avoid duplicates
               if (prev.some((m) => m._id === message._id)) return prev;
               return [...prev, message];
            });
         }
      },
      onError: (error) => {
         toast.error(error.message);
      },
      onUserTyping: (data) => {
         if (data.userId !== user?.id?.toString()) {
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
         // Update the group settings locally
         setGroups((prev) =>
            prev.map((g) =>
               g._id === data.groupId ? { ...g, settings: data.settings } : g
            )
         );
         if (selectedGroup?._id === data.groupId) {
            setSelectedGroup((prev) =>
               prev ? { ...prev, settings: data.settings } : prev
            );
         }
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

   // Fetch chat groups on mount
   useEffect(() => {
      const fetchGroups = async () => {
         try {
            setIsLoadingGroups(true);
            const data = await getChatGroups();
            setGroups(data);
         } catch (error: any) {
            toast.error(error.message || 'Failed to load chat groups');
         } finally {
            setIsLoadingGroups(false);
         }
      };

      fetchGroups();
   }, []);

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

      // Join the socket room
      if (isConnected) {
         joinRoom(selectedGroup._id);
      }

      // Clear typing users when switching groups
      setTypingUsers([]);

      // Cleanup: leave room when switching
      return () => {
         if (selectedGroup && isConnected) {
            leaveRoom(selectedGroup._id);
         }
      };
   }, [selectedGroup?._id, isConnected]);

   // Handle group selection
   const handleSelectGroup = useCallback(
      (group: ChatGroup) => {
         setSelectedGroup(group);
         if (isMobileView) {
            setShowSidebar(false);
         }
      },
      [isMobileView]
   );

   // Handle sending message
   const handleSendMessage = useCallback(
      (content: string) => {
         if (!selectedGroup || !content.trim()) return;
         socketSendMessage(selectedGroup._id, content);
      },
      [selectedGroup, socketSendMessage]
   );

   // Handle typing indicators
   const handleTypingStart = useCallback(() => {
      if (selectedGroup) {
         startTyping(selectedGroup._id);
      }
   }, [selectedGroup, startTyping]);

   const handleTypingStop = useCallback(() => {
      if (selectedGroup) {
         stopTyping(selectedGroup._id);
      }
   }, [selectedGroup, stopTyping]);

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
               currentUserId={user?.id?.toString() || ''}
               isConnected={isConnected}
               messages={messages}
               onSendMessage={handleSendMessage}
               onTypingStart={handleTypingStart}
               onTypingStop={handleTypingStop}
               typingUsers={typingUsers}
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

export default ChatContainer;
