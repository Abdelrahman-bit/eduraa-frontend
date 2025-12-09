'use client';

import { useState, useEffect, useRef } from 'react';
import { useChat } from '@ai-sdk/react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

export default function ChatBot() {
   const [isOpen, setIsOpen] = useState(false);
   const [token, setToken] = useState<string | null>(null);
   const messagesEndRef = useRef<HTMLDivElement>(null);

   // Get token on mount AND when chat opens (in case user logged in while app was open)
   useEffect(() => {
      const storedToken = localStorage.getItem('token');
      console.log('[ChatBot] Token loaded:', storedToken ? 'YES' : 'NO');
      setToken(storedToken);
   }, []); // Load on mount

   useEffect(() => {
      if (isOpen) {
         // Re-check token when opening chat (user might have logged in)
         const storedToken = localStorage.getItem('token');
         if (storedToken !== token) {
            console.log('[ChatBot] Token updated on open');
            setToken(storedToken);
         }
      }
   }, [isOpen]);

   // Use apiClient base URL to construct the endpoint
   // Use Next.js rewrite to proxy /api/chat to backend
   // See next.config.ts for rewrite configuration

   // Manually manage input state since useChat's handleInputChange was unreliable here
   const [localInput, setLocalInput] = useState('');

   // Explicitly defining the options type as any to bypass the potential lint error about 'api'
   // while still providing it, in case the SDK header/check fails without it.
   // Generate a unique chat ID on mount to ensure fresh session (prevents stale message history issues)
   const [chatId] = useState(() => `chat-${Date.now()}`);

   const chatHook = useChat({
      id: chatId, // Unique ID per session to avoid message persistence issues
      initialMessages: [], // Force clean state on each page load
      maxSteps: 3, // CRITICAL: Must match server's maxSteps to prevent tool execution failures
      api: '/api/chat', // Uses Next.js rewrite to proxy to backend
      // Use a function for headers to always get the latest token from localStorage
      headers: () => {
         const currentToken = localStorage.getItem('token');
         console.log(
            '[ChatBot] Sending request with token:',
            currentToken ? 'YES' : 'NO'
         );
         return currentToken ? { Authorization: `Bearer ${currentToken}` } : {};
      },
      // Using default UI Message stream protocol per official docs
      onResponse: (response) => {
         console.log(
            'ChatBot: Received response',
            response.status,
            response.statusText
         );
      },
      onFinish: (message) => {
         console.log('ChatBot: Stream finished', message);
      },
      onError: (err) => {
         console.error('ChatBot: Chat error:', err);
      },
   } as any);

   const { messages, sendMessage, stop, isLoading, error, status } =
      chatHook as any;

   // Debug: Log status changes to understand streaming behavior
   useEffect(() => {
      console.log(
         'ChatBot Status:',
         status,
         'isLoading:',
         isLoading,
         'messages:',
         messages.length
      );
   }, [status, isLoading, messages.length]);

   useEffect(() => {
      if (isOpen) {
         console.log('ChatBot Hook State:', {
            keys: Object.keys(chatHook),
            hasAppend: typeof (chatHook as any).append === 'function',
            hasSendMessage: typeof chatHook.sendMessage === 'function',
            hasStop: typeof chatHook.stop === 'function',
            messagesCount: messages.length,
         });
      }
   }, [isOpen, chatHook, messages]);

   const handleLocalSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!localInput.trim() || isLoading) return;

      const userMessage = localInput.trim();
      setLocalInput(''); // Clear input immediately

      // Get current token for authorization
      const currentToken = localStorage.getItem('token');
      const headers = currentToken
         ? { Authorization: `Bearer ${currentToken}` }
         : {};
      console.log(
         '[ChatBot] Sending message with token:',
         currentToken ? 'YES' : 'NO'
      );

      // Use sendMessage with headers option for auth
      if (sendMessage) {
         try {
            // Pass headers in the options object for SDK v5+
            await sendMessage({ text: userMessage }, { headers });
         } catch (sendError) {
            console.warn(
               '[ChatBot] First attempt failed, retrying...',
               sendError
            );
            // Automatic retry on first failure
            await new Promise((resolve) => setTimeout(resolve, 500));
            await sendMessage({ text: userMessage }, { headers });
         }
      } else if ((chatHook as any).append) {
         await (chatHook as any).append({
            role: 'user',
            content: userMessage,
         });
      } else {
         console.error("ChatBot: Both 'sendMessage' and 'append' are missing!");
      }
   };

   // Scroll to bottom when new messages arrive
   useEffect(() => {
      if (messagesEndRef.current) {
         messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
   }, [messages]);

   // Scroll to bottom when chat window opens
   useEffect(() => {
      if (isOpen && messagesEndRef.current) {
         // Small delay to ensure the DOM is rendered
         setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
         }, 100);
      }
   }, [isOpen]);

   return (
      <>
         {/* Toggle Button */}
         <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(!isOpen)}
            className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
         >
            {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
         </motion.button>

         {/* Chat Window */}
         <AnimatePresence>
            {isOpen && (
               <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="fixed bottom-24 right-6 z-50 flex h-[600px] w-[400px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white/95 shadow-2xl backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/95"
               >
                  {/* Header */}
                  <div className="flex items-center justify-between bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-4 text-white">
                     <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                           <Bot size={18} />
                        </div>
                        <div>
                           <h3 className="font-semibold text-sm">
                              AI Assistant
                           </h3>
                           <p className="text-[10px] text-indigo-100 opacity-90">
                              Always here to help
                           </p>
                        </div>
                     </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                     {messages.length === 0 && (
                        <div className="flex h-full flex-col items-center justify-center text-center text-gray-500">
                           <Bot size={48} className="mb-4 text-indigo-200" />
                           <p className="text-sm">
                              Hi! How can I help you today?
                           </p>
                           <p className="text-xs text-gray-400 mt-2">
                              Ask about courses, your stats, or the platform.
                           </p>
                        </div>
                     )}

                     {messages.map((m: any) => (
                        <div
                           key={m.id}
                           className={cn(
                              'flex w-full gap-2',
                              m.role === 'user'
                                 ? 'justify-end'
                                 : 'justify-start'
                           )}
                        >
                           {m.role !== 'user' && (
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 border border-indigo-200">
                                 <Bot size={14} />
                              </div>
                           )}

                           <div
                              className={cn(
                                 'max-w-[80%] px-4 py-2.5 text-sm shadow-sm',
                                 m.role === 'user'
                                    ? 'rounded-2xl rounded-tr-sm bg-indigo-600 text-white'
                                    : 'rounded-2xl rounded-tl-sm bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
                              )}
                           >
                              {m.role === 'user' ? (
                                 <p className="whitespace-pre-wrap leading-relaxed">
                                    {m.parts
                                       ? m.parts
                                            .map((part: any) =>
                                               part.type === 'text'
                                                  ? part.text
                                                  : ''
                                            )
                                            .join('')
                                       : m.content}
                                 </p>
                              ) : (
                                 <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5 prose-headings:my-2 prose-strong:text-inherit">
                                    <ReactMarkdown>
                                       {m.parts
                                          ? m.parts
                                               .map((part: any) =>
                                                  part.type === 'text'
                                                     ? part.text
                                                     : ''
                                               )
                                               .join('')
                                          : m.content}
                                    </ReactMarkdown>
                                 </div>
                              )}
                           </div>

                           {m.role === 'user' && (
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-600 border border-gray-300 dark:bg-gray-700 dark:text-gray-300">
                                 <User size={14} />
                              </div>
                           )}
                        </div>
                     ))}

                     {/* Show typing indicator when:
                        1. status is 'submitted' or 'streaming', OR isLoading is true
                        2. AND either the last message is from user, OR the last assistant message has no content yet
                     */}
                     {(status === 'submitted' ||
                        status === 'streaming' ||
                        isLoading) &&
                        (messages[messages.length - 1]?.role === 'user' ||
                           (messages[messages.length - 1]?.role ===
                              'assistant' &&
                              !messages[messages.length - 1]?.content &&
                              (!messages[messages.length - 1]?.parts ||
                                 messages[messages.length - 1]?.parts
                                    ?.length === 0))) && (
                           <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex justify-start gap-2"
                           >
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 border border-indigo-200">
                                 <Bot size={14} />
                              </div>
                              <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm bg-gray-100 px-4 py-3 dark:bg-gray-800">
                                 <div className="flex gap-1">
                                    <motion.span
                                       animate={{ scale: [1, 1.2, 1] }}
                                       transition={{
                                          repeat: Infinity,
                                          duration: 0.6,
                                          delay: 0,
                                       }}
                                       className="h-2 w-2 rounded-full bg-indigo-400"
                                    />
                                    <motion.span
                                       animate={{ scale: [1, 1.2, 1] }}
                                       transition={{
                                          repeat: Infinity,
                                          duration: 0.6,
                                          delay: 0.2,
                                       }}
                                       className="h-2 w-2 rounded-full bg-indigo-400"
                                    />
                                    <motion.span
                                       animate={{ scale: [1, 1.2, 1] }}
                                       transition={{
                                          repeat: Infinity,
                                          duration: 0.6,
                                          delay: 0.4,
                                       }}
                                       className="h-2 w-2 rounded-full bg-indigo-400"
                                    />
                                 </div>
                                 <span className="text-xs text-gray-500 ml-1">
                                    AI is typing...
                                 </span>
                              </div>
                           </motion.div>
                        )}

                     {error && (
                        <div className="mx-auto rounded-md bg-red-50 p-3 text-center text-xs text-red-500">
                           Something went wrong. Please try again.
                        </div>
                     )}

                     <div ref={messagesEndRef} />
                  </div>

                  {/* Input Form */}
                  <form
                     onSubmit={handleLocalSubmit}
                     className="border-t border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900/50"
                  >
                     <div className="relative flex items-center gap-2">
                        <input
                           value={localInput}
                           onChange={(e) => setLocalInput(e.target.value)}
                           placeholder="Type your message..."
                           className="flex-1 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                        />
                        <button
                           type="submit"
                           disabled={isLoading || !localInput.trim()}
                           className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white transition-colors hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed"
                        >
                           {isLoading ? (
                              <Loader2 size={18} className="animate-spin" />
                           ) : (
                              <Send size={18} />
                           )}
                        </button>
                     </div>
                  </form>
               </motion.div>
            )}
         </AnimatePresence>
      </>
   );
}
