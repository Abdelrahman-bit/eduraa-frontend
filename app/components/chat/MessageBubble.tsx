'use client';

import React from 'react';
import { ChatMessage } from '@/app/services/chatService';
import { Check, CheckCheck } from 'lucide-react';

interface MessageBubbleProps {
   message: ChatMessage;
   isOwn: boolean;
   showAvatar?: boolean;
}

/**
 * Individual message bubble component with premium styling
 */
export const MessageBubble: React.FC<MessageBubbleProps> = ({
   message,
   isOwn,
   showAvatar = true,
}) => {
   const senderName =
      `${message.sender?.firstname || ''} ${message.sender?.lastname || ''}`.trim();
   const avatarUrl = message.sender?.avatar;
   const timestamp = new Date(message.createdAt);
   const timeStr = timestamp.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
   });

   // System message styling
   if (message.messageType === 'system') {
      return (
         <div className="flex justify-center my-4">
            <div className="px-4 py-1.5 bg-white/70 backdrop-blur-sm rounded-full shadow-sm border border-gray-100">
               <p className="text-xs text-gray-500 italic">{message.content}</p>
            </div>
         </div>
      );
   }

   return (
      <div
         className={`flex gap-2.5 mb-4 ${
            isOwn ? 'flex-row-reverse' : 'flex-row'
         }`}
      >
         {/* Avatar */}
         {showAvatar && (
            <div className="flex-shrink-0 mt-1">
               {avatarUrl ? (
                  <img
                     src={avatarUrl}
                     alt={senderName}
                     className="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow-sm"
                  />
               ) : (
                  <div
                     className={`w-9 h-9 rounded-full flex items-center justify-center ring-2 ring-white shadow-sm
                     ${
                        isOwn
                           ? 'bg-gradient-to-br from-orange-400 to-orange-600'
                           : 'bg-gradient-to-br from-purple-400 to-purple-600'
                     }`}
                  >
                     <span className="text-white text-xs font-semibold">
                        {senderName.charAt(0).toUpperCase()}
                     </span>
                  </div>
               )}
            </div>
         )}

         {/* Message Content */}
         <div
            className={`flex flex-col max-w-[85%] sm:max-w-[70%] ${
               isOwn ? 'items-end' : 'items-start'
            }`}
         >
            {/* Sender name (only for others' messages) */}
            {!isOwn && (
               <p className="text-xs font-medium text-gray-500 mb-1 ml-1">
                  {senderName}
               </p>
            )}

            {/* Bubble with shadow and gradient */}
            <div
               className={`px-4 py-2.5 shadow-sm transition-all duration-200 hover:shadow-md ${
                  isOwn
                     ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl rounded-tr-md'
                     : 'bg-white text-gray-800 rounded-2xl rounded-tl-md border border-gray-100'
               }`}
            >
               <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                  {message.content}
               </p>
            </div>

            {/* Timestamp with delivery status */}
            <div
               className={`flex items-center gap-1 mt-1 ${isOwn ? 'flex-row-reverse' : ''}`}
            >
               <p
                  className={`text-[11px] ${isOwn ? 'text-gray-400' : 'text-gray-400'} ml-1 mr-1`}
               >
                  {timeStr}
               </p>
               {isOwn && <CheckCheck className="w-3.5 h-3.5 text-orange-400" />}
            </div>
         </div>
      </div>
   );
};

export default MessageBubble;
