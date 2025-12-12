'use client';

import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Send, Lock, Smile } from 'lucide-react';

interface MessageInputProps {
   onSendMessage: (content: string) => void;
   onTypingStart?: () => void;
   onTypingStop?: () => void;
   disabled?: boolean;
   disabledReason?: string;
   placeholder?: string;
}

/**
 * Message input component with send button and typing indicators
 */
export const MessageInput: React.FC<MessageInputProps> = ({
   onSendMessage,
   onTypingStart,
   onTypingStop,
   disabled = false,
   disabledReason,
   placeholder = 'Type a message...',
}) => {
   const [message, setMessage] = useState('');
   const [isTyping, setIsTyping] = useState(false);
   const [isFocused, setIsFocused] = useState(false);
   const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
   const inputRef = useRef<HTMLTextAreaElement>(null);

   // Send message
   const handleSend = () => {
      const trimmedMessage = message.trim();
      if (!trimmedMessage || disabled) return;

      onSendMessage(trimmedMessage);
      setMessage('');

      // Reset textarea height
      if (inputRef.current) {
         inputRef.current.style.height = '44px';
      }

      // Stop typing indicator
      if (isTyping) {
         setIsTyping(false);
         onTypingStop?.();
      }

      // Clear typing timeout
      if (typingTimeoutRef.current) {
         clearTimeout(typingTimeoutRef.current);
         typingTimeoutRef.current = null;
      }

      // Refocus input
      inputRef.current?.focus();
   };

   // Handle input change with typing indicator
   const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setMessage(e.target.value);

      if (!disabled) {
         // Start typing indicator
         if (!isTyping) {
            setIsTyping(true);
            onTypingStart?.();
         }

         // Reset typing timeout
         if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
         }

         // Stop typing after 2 seconds of inactivity
         typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
            onTypingStop?.();
         }, 2000);
      }
   };

   // Handle key press (Enter to send)
   const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         handleSend();
      }
   };

   // Cleanup on unmount
   useEffect(() => {
      return () => {
         if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
         }
      };
   }, []);

   // Auto-resize textarea without visible scrollbar
   useEffect(() => {
      if (inputRef.current) {
         inputRef.current.style.height = '44px';
         const newHeight = Math.min(inputRef.current.scrollHeight, 120);
         inputRef.current.style.height = `${newHeight}px`;
      }
   }, [message]);

   return (
      <div
         className={`border-t bg-white p-3 transition-all duration-200 ${
            isFocused
               ? 'border-orange-200 shadow-lg shadow-orange-100/30'
               : 'border-gray-100'
         }`}
      >
         {/* Disabled message */}
         {disabled && disabledReason && (
            <div className="flex items-center gap-2 mb-3 px-4 py-2.5 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-100">
               <Lock className="w-4 h-4 text-orange-500 flex-shrink-0" />
               <p className="text-sm text-orange-700">{disabledReason}</p>
            </div>
         )}

         {/* Input area */}
         <div className="flex items-end gap-2">
            {/* Text input with hidden scrollbar */}
            <div
               className={`flex-1 relative rounded-2xl border-2 transition-all duration-200 ${
                  isFocused
                     ? 'border-orange-400 bg-white shadow-sm'
                     : disabled
                       ? 'border-gray-100 bg-gray-50'
                       : 'border-gray-200 bg-gray-50 hover:border-gray-300'
               }`}
            >
               <textarea
                  ref={inputRef}
                  value={message}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder={
                     disabled ? disabledReason || 'Chat disabled' : placeholder
                  }
                  disabled={disabled}
                  rows={1}
                  className="w-full resize-none px-4 py-3 text-sm bg-transparent
                     focus:outline-none placeholder:text-gray-400 text-gray-900
                     disabled:text-gray-400 disabled:cursor-not-allowed
                     overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                  style={{
                     minHeight: '44px',
                     maxHeight: '120px',
                  }}
               />
            </div>

            {/* Send button */}
            <button
               onClick={handleSend}
               disabled={disabled || !message.trim()}
               className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center 
                  transition-all duration-200 cursor-pointer active:scale-95
                  ${
                     disabled || !message.trim()
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30'
                  }`}
            >
               <Send className="w-5 h-5" />
            </button>
         </div>

         {/* Helper text - hidden on mobile */}
         {!disabled && (
            <p className="hidden sm:flex text-[11px] text-gray-400 mt-2 px-1 items-center gap-1">
               <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-500 font-mono text-[10px]">
                  Enter
               </kbd>
               <span>to send</span>
               <span className="mx-1">•</span>
               <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-500 font-mono text-[10px]">
                  Shift + Enter
               </kbd>
               <span>for new line</span>
            </p>
         )}
      </div>
   );
};

export default MessageInput;
