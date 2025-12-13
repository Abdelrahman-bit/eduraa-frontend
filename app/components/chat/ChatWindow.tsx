'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ChatGroup, ChatMessage } from '@/app/services/chatService';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import {
   MessageCircle,
   Users,
   Settings,
   Lock,
   ArrowLeft,
   Wifi,
   WifiOff,
} from 'lucide-react';
import { getDateSeparatorLabel, isSameDay } from '@/app/utils/dateUtils';

interface ChatWindowProps {
   group: ChatGroup | null;
   currentUserId: string;
   isConnected: boolean;
   messages: ChatMessage[];
   onSendMessage: (content: string) => void;
   onTypingStart?: () => void;
   onTypingStop?: () => void;
   typingUsers?: Array<{
      userId: string;
      user: { firstname: string; lastname: string };
   }>;
   onSettingsClick?: () => void;
   onBack?: () => void;
   showBackButton?: boolean;
}

/**
 * Main chat window component displaying messages and input
 */
export const ChatWindow: React.FC<ChatWindowProps> = ({
   group,
   currentUserId,
   isConnected,
   messages,
   onSendMessage,
   onTypingStart,
   onTypingStop,
   typingUsers = [],
   onSettingsClick,
   onBack,
   showBackButton = false,
}) => {
   const messagesEndRef = useRef<HTMLDivElement>(null);
   const messagesContainerRef = useRef<HTMLDivElement>(null);
   const [isAtBottom, setIsAtBottom] = useState(true);

   // Scroll to bottom when new messages arrive (if user is at bottom)
   useEffect(() => {
      if (isAtBottom && messagesContainerRef.current) {
         // Use scrollTop instead of scrollIntoView for smoother behavior
         const container = messagesContainerRef.current;
         container.scrollTo({
            top: container.scrollHeight,
            behavior: 'smooth',
         });
      }
   }, [messages, isAtBottom]);

   // Track if user is at the bottom of the chat
   const handleScroll = () => {
      if (messagesContainerRef.current) {
         const { scrollTop, scrollHeight, clientHeight } =
            messagesContainerRef.current;
         const atBottom = scrollHeight - scrollTop - clientHeight < 50;
         setIsAtBottom(atBottom);
      }
   };

   // No group selected - beautiful empty state
   if (!group) {
      return (
         <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-orange-50/30 p-8 text-center h-full">
            <div className="relative mb-6">
               <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-purple-100 rounded-3xl flex items-center justify-center shadow-lg shadow-orange-100/50">
                  <MessageCircle className="w-12 h-12 text-orange-500" />
               </div>
               <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-purple-500 rounded-xl flex items-center justify-center shadow-md">
                  <Users className="w-4 h-4 text-white" />
               </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
               Start a Conversation
            </h3>
            <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
               Select a course chat from the sidebar to connect with your
               instructor and fellow students
            </p>
         </div>
      );
   }

   const courseTitle = group.course?.basicInfo?.title || 'Course Chat';
   const isAdmin = group.admin?._id === currentUserId;
   const canSendMessages =
      group.settings?.isActive !== false &&
      (!group.settings?.instructorOnlyMode || isAdmin);

   // Get disabled reason
   let disabledReason = '';
   if (!group.settings?.isActive) {
      disabledReason = 'Chat is currently disabled';
   } else if (group.settings?.instructorOnlyMode && !isAdmin) {
      disabledReason = 'Only the instructor can send messages';
   }

   // Render messages with date separators
   const renderMessagesWithDates = () => {
      const elements: React.ReactNode[] = [];
      let lastDate: Date | null = null;

      messages.forEach((message) => {
         const messageDate = new Date(message.createdAt);

         // Add date separator if needed
         if (!lastDate || !isSameDay(messageDate, lastDate)) {
            elements.push(
               <div
                  key={`date-${message._id}`}
                  className="flex justify-center my-6"
               >
                  <div className="px-4 py-1.5 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-gray-100">
                     <span className="text-xs text-gray-500 font-medium">
                        {getDateSeparatorLabel(messageDate)}
                     </span>
                  </div>
               </div>
            );
            lastDate = messageDate;
         }

         elements.push(
            <MessageBubble
               key={message._id}
               message={message}
               isOwn={message.sender?._id === currentUserId}
            />
         );
      });

      return elements;
   };

   return (
      <div className="flex flex-col bg-white h-full min-h-0 overflow-hidden">
         {/* Header - Glass effect */}
         <div className="flex-shrink-0 flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-white/80 backdrop-blur-sm z-10">
            {showBackButton && onBack && (
               <button
                  onClick={onBack}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 lg:hidden cursor-pointer active:scale-95"
               >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
               </button>
            )}

            {/* Group info */}
            <div className="flex-1 min-w-0">
               <h2 className="font-semibold text-gray-900 truncate text-sm sm:text-base">
                  {courseTitle}
               </h2>
               <div className="flex items-center gap-2 text-[10px] sm:text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                     <Users className="w-3 h-3" />
                     <span>{group.memberCount}</span>
                     <span className="hidden sm:inline">members</span>
                  </div>
                  {group.settings?.instructorOnlyMode && (
                     <>
                        <span className="text-gray-300 hidden sm:inline">
                           •
                        </span>
                        <div className="hidden sm:flex items-center gap-1 text-orange-500">
                           <Lock className="w-3 h-3" />
                           <span>Broadcast only</span>
                        </div>
                     </>
                  )}
                  <span className="text-gray-300">•</span>
                  <div
                     className={`flex items-center gap-1 ${isConnected ? 'text-green-500' : 'text-orange-500'}`}
                  >
                     {isConnected ? (
                        <>
                           <Wifi className="w-3 h-3" />
                           <span className="hidden sm:inline">Live</span>
                        </>
                     ) : (
                        <>
                           <WifiOff className="w-3 h-3" />
                           <span className="hidden sm:inline">
                              Connecting...
                           </span>
                        </>
                     )}
                  </div>
               </div>
            </div>

            {/* Settings button (admin only) */}
            {isAdmin && onSettingsClick && (
               <button
                  onClick={onSettingsClick}
                  className="p-2.5 hover:bg-gray-100 rounded-xl transition-all duration-200 cursor-pointer active:scale-95"
                  title="Chat settings"
               >
                  <Settings className="w-5 h-5 text-gray-500" />
               </button>
            )}
         </div>

         {/* Messages area - with custom scrollbar */}
         <div
            ref={messagesContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto px-4 py-4 bg-gradient-to-b from-gray-50/50 to-gray-50 min-h-0
               scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400"
            style={{
               scrollbarWidth: 'thin',
               scrollbarColor: '#d1d5db transparent',
            }}
         >
            {messages.length === 0 ? (
               <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-purple-100 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                     <MessageCircle className="w-8 h-8 text-orange-400" />
                  </div>
                  <p className="text-gray-600 font-medium">No messages yet</p>
                  <p className="text-gray-400 text-sm mt-1">
                     Be the first to start the conversation!
                  </p>
               </div>
            ) : (
               <>
                  {renderMessagesWithDates()}
                  <div ref={messagesEndRef} className="h-1" />
               </>
            )}
         </div>

         {/* Typing indicator - Animated */}
         {typingUsers.length > 0 && (
            <div className="flex-shrink-0 px-4 py-2 bg-gray-50/80 border-t border-gray-100">
               <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                     <span
                        className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"
                        style={{ animationDelay: '0ms' }}
                     />
                     <span
                        className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"
                        style={{ animationDelay: '150ms' }}
                     />
                     <span
                        className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"
                        style={{ animationDelay: '300ms' }}
                     />
                  </div>
                  <p className="text-xs text-gray-500">
                     {typingUsers.length === 1
                        ? `${typingUsers[0].user.firstname} is typing...`
                        : `${typingUsers.length} people are typing...`}
                  </p>
               </div>
            </div>
         )}

         {/* Message input */}
         <div className="flex-shrink-0">
            <MessageInput
               onSendMessage={onSendMessage}
               onTypingStart={onTypingStart}
               onTypingStop={onTypingStop}
               disabled={!canSendMessages || !isConnected}
               disabledReason={
                  !isConnected ? 'Connecting to chat...' : disabledReason
               }
            />
         </div>
      </div>
   );
};

export default ChatWindow;
