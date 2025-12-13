'use client';

import { useState, useEffect, useRef } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, Loader2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
import useBearStore from '@/app/store/useStore';

export default function ChatBot() {
   const [isOpen, setIsOpen] = useState(false);
   const [token, setToken] = useState<string | null>(null);
   const messagesEndRef = useRef<HTMLDivElement>(null);

   // Get user from store for profile image
   const { user, isAuthenticated } = useBearStore();
   const [userAvatar, setUserAvatar] = useState<string>('/avatar.png');

   // Get token on mount AND when chat opens (in case user logged in while app was open)
   useEffect(() => {
      const storedToken = localStorage.getItem('token');
      console.log('[ChatBot] Token loaded:', storedToken ? 'YES' : 'NO');
      setToken(storedToken);

      // Try to get user avatar from localStorage
      const userStr = localStorage.getItem('user');
      if (userStr) {
         try {
            const userData = JSON.parse(userStr);
            if (userData?.avatar) {
               setUserAvatar(userData.avatar);
            }
         } catch (e) {
            console.error('[ChatBot] Error parsing user data:', e);
         }
      }
   }, []); // Load on mount

   useEffect(() => {
      if (isOpen) {
         // Re-check token when opening chat (user might have logged in)
         const storedToken = localStorage.getItem('token');
         if (storedToken !== token) {
            console.log('[ChatBot] Token updated on open');
            setToken(storedToken);
         }

         // Update avatar if user data changed
         const userStr = localStorage.getItem('user');
         if (userStr) {
            try {
               const userData = JSON.parse(userStr);
               if (userData?.avatar) {
                  setUserAvatar(userData.avatar);
               }
            } catch (e) {
               console.error('[ChatBot] Error parsing user data:', e);
            }
         }
      }
   }, [isOpen, token]);

   // Manually manage input state since useChat's handleInputChange was unreliable here
   const [localInput, setLocalInput] = useState('');

   // Generate a unique chat ID on mount to ensure fresh session
   const [chatId] = useState(() => `chat-${Date.now()}`);

   // Use DefaultChatTransport for proper SDK v5 configuration
   const chatHook = useChat({
      id: chatId,
      transport: new DefaultChatTransport({
         api: '/api/chat',
         headers: (): Record<string, string> => {
            const currentToken = localStorage.getItem('token');
            console.log(
               '[ChatBot] Sending request with token:',
               currentToken ? 'YES' : 'NO'
            );
            if (currentToken) {
               return { Authorization: `Bearer ${currentToken}` };
            }
            return {};
         },
      }),
   });

   const { messages, sendMessage, stop, error, status } = chatHook;

   // In SDK v5, isLoading is replaced by status checks
   const isLoading = status === 'submitted' || status === 'streaming';

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

      console.log('[ChatBot] Sending message:', userMessage.substring(0, 50));

      // sendMessage is the preferred method in SDK v5
      // Headers are automatically handled by DefaultChatTransport
      try {
         await sendMessage({ text: userMessage });
      } catch (sendError) {
         console.error('[ChatBot] Send failed:', sendError);
         // Retry once on failure
         await new Promise((resolve) => setTimeout(resolve, 500));
         try {
            await sendMessage({ text: userMessage });
         } catch (retryError) {
            console.error('[ChatBot] Retry also failed:', retryError);
         }
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

   // Get user display name
   const getUserName = () => {
      if (user?.name) return user.name;
      const userStr = localStorage.getItem('user');
      if (userStr) {
         try {
            const userData = JSON.parse(userStr);
            if (userData?.firstname) {
               return `${userData.firstname} ${userData.lastname || ''}`.trim();
            }
         } catch (e) {}
      }
      return 'You';
   };

   return (
      <>
         {/* Toggle Button - Using platform primary color (orange) */}
         <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(!isOpen)}
            className="fixed bottom-6 right-6 z-[999] flex h-14 w-14 items-center justify-center rounded-full bg-primary-500 text-white shadow-lg shadow-primary-500/30 transition-all hover:bg-primary-600 hover:shadow-primary-500/40 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
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
                  className="fixed bottom-24 right-6 z-[999] flex h-[600px] w-[400px] flex-col overflow-hidden rounded-2xl border border-gray-scale-200 bg-white shadow-2xl dark:border-gray-scale-700 dark:bg-gray-scale-900"
               >
                  {/* Header - Gradient using platform colors */}
                  <div className="flex items-center justify-between bg-gradient-to-r from-primary-500 via-primary-600 to-secondary-500 px-4 py-4 text-white">
                     <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                           <Sparkles size={20} className="text-white" />
                        </div>
                        <div>
                           <h3 className="font-semibold text-base">
                              AI Learning Assistant
                           </h3>
                           <p className="text-xs text-white/80">
                              {isAuthenticated
                                 ? `Hi, ${getUserName().split(' ')[0]}! 👋`
                                 : 'Always here to help'}
                           </p>
                        </div>
                     </div>
                     <button
                        onClick={() => setIsOpen(false)}
                        className="rounded-full p-1.5 hover:bg-white/20 transition-colors"
                     >
                        <X size={18} />
                     </button>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-scale-50 dark:bg-gray-scale-800">
                     {messages.length === 0 && (
                        <div className="flex h-full flex-col items-center justify-center text-center text-gray-scale-500">
                           <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center mb-4">
                              <Bot size={32} className="text-primary-500" />
                           </div>
                           <p className="text-sm font-medium text-gray-scale-700 dark:text-gray-scale-200">
                              Hi! How can I help you today?
                           </p>
                           <p className="text-xs text-gray-scale-500 mt-2 max-w-[250px]">
                              Ask about courses, your learning progress, or
                              anything about the platform.
                           </p>

                           {/* Quick action suggestions */}
                           <div className="flex flex-wrap gap-2 mt-6 justify-center">
                              {isAuthenticated && (
                                 <>
                                    <button
                                       onClick={() =>
                                          setLocalInput(
                                             'How many courses am I enrolled in?'
                                          )
                                       }
                                       className="text-xs px-3 py-1.5 rounded-full bg-white border border-gray-scale-200 text-gray-scale-600 hover:border-primary-300 hover:text-primary-600 transition-colors"
                                    >
                                       📚 My Courses
                                    </button>
                                    <button
                                       onClick={() =>
                                          setLocalInput(
                                             'What courses are available?'
                                          )
                                       }
                                       className="text-xs px-3 py-1.5 rounded-full bg-white border border-gray-scale-200 text-gray-scale-600 hover:border-primary-300 hover:text-primary-600 transition-colors"
                                    >
                                       🔍 Browse
                                    </button>
                                 </>
                              )}
                              <button
                                 onClick={() =>
                                    setLocalInput(
                                       'How do I become an instructor?'
                                    )
                                 }
                                 className="text-xs px-3 py-1.5 rounded-full bg-white border border-gray-scale-200 text-gray-scale-600 hover:border-primary-300 hover:text-primary-600 transition-colors"
                              >
                                 🎓 Teach
                              </button>
                           </div>
                        </div>
                     )}

                     {messages.map((m: any) => (
                        <div
                           key={m.id}
                           className={cn(
                              'flex w-full gap-3',
                              m.role === 'user'
                                 ? 'justify-end'
                                 : 'justify-start'
                           )}
                        >
                           {/* Bot Avatar */}
                           {m.role !== 'user' && (
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-white shadow-sm">
                                 <Bot size={14} />
                              </div>
                           )}

                           {/* Message Bubble */}
                           <div
                              className={cn(
                                 'max-w-[80%] px-4 py-2.5 text-sm shadow-sm',
                                 m.role === 'user'
                                    ? 'rounded-2xl rounded-tr-md bg-primary-500 text-white'
                                    : 'rounded-2xl rounded-tl-md bg-white text-gray-scale-800 border border-gray-scale-100 dark:bg-gray-scale-700 dark:text-gray-scale-100 dark:border-gray-scale-600'
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
                                 <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5 prose-headings:my-2 prose-strong:text-inherit prose-a:text-primary-500">
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

                           {/* User Avatar - Using actual profile picture */}
                           {m.role === 'user' && (
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full overflow-hidden border-2 border-primary-200 bg-gray-scale-100">
                                 <Image
                                    src={userAvatar}
                                    alt="Your avatar"
                                    width={32}
                                    height={32}
                                    className="object-cover w-full h-full"
                                 />
                              </div>
                           )}
                        </div>
                     ))}

                     {/* Show typing indicator when loading and last message is from user or has no parts yet */}
                     {isLoading &&
                        (messages[messages.length - 1]?.role === 'user' ||
                           (messages[messages.length - 1]?.role ===
                              'assistant' &&
                              (!messages[messages.length - 1]?.parts ||
                                 messages[messages.length - 1]?.parts
                                    ?.length === 0))) && (
                           <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex justify-start gap-3"
                           >
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-white">
                                 <Bot size={14} />
                              </div>
                              <div className="flex items-center gap-2 rounded-2xl rounded-tl-md bg-white px-4 py-3 border border-gray-scale-100 dark:bg-gray-scale-700 dark:border-gray-scale-600">
                                 <div className="flex gap-1">
                                    <motion.span
                                       animate={{ scale: [1, 1.2, 1] }}
                                       transition={{
                                          repeat: Infinity,
                                          duration: 0.6,
                                          delay: 0,
                                       }}
                                       className="h-2 w-2 rounded-full bg-primary-400"
                                    />
                                    <motion.span
                                       animate={{ scale: [1, 1.2, 1] }}
                                       transition={{
                                          repeat: Infinity,
                                          duration: 0.6,
                                          delay: 0.2,
                                       }}
                                       className="h-2 w-2 rounded-full bg-primary-400"
                                    />
                                    <motion.span
                                       animate={{ scale: [1, 1.2, 1] }}
                                       transition={{
                                          repeat: Infinity,
                                          duration: 0.6,
                                          delay: 0.4,
                                       }}
                                       className="h-2 w-2 rounded-full bg-secondary-400"
                                    />
                                 </div>
                                 <span className="text-xs text-gray-scale-500 ml-1">
                                    Thinking...
                                 </span>
                              </div>
                           </motion.div>
                        )}

                     {error && (
                        <div className="mx-auto rounded-lg bg-danger-50 p-3 text-center text-xs text-danger-500 border border-danger-100">
                           Something went wrong. Please try again.
                        </div>
                     )}

                     <div ref={messagesEndRef} />
                  </div>

                  {/* Input Form */}
                  <form
                     onSubmit={handleLocalSubmit}
                     className="border-t border-gray-scale-100 bg-white p-4 dark:border-gray-scale-700 dark:bg-gray-scale-900"
                  >
                     <div className="relative flex items-center gap-2">
                        <input
                           value={localInput}
                           onChange={(e) => setLocalInput(e.target.value)}
                           placeholder="Ask me anything..."
                           className="flex-1 rounded-full border border-gray-scale-200 bg-gray-scale-50 px-4 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-gray-scale-600 dark:bg-gray-scale-800 dark:text-gray-scale-100 dark:focus:ring-primary-900"
                        />
                        <button
                           type="submit"
                           disabled={isLoading || !localInput.trim()}
                           className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-500 text-white transition-all hover:bg-primary-600 hover:shadow-md disabled:bg-gray-scale-300 disabled:cursor-not-allowed disabled:shadow-none"
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
