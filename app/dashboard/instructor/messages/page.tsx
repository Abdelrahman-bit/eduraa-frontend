'use client';

import React from 'react';
import ChatContainer from '@/app/components/chat/ChatContainer';

export default function MessagePage() {
   return (
      <div className="flex flex-col h-[100vh] min-h-[500px]">
         {/* Header */}
         <div className="mb-4 flex-shrink-0">
            <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
            <p className="text-gray-500 text-sm mt-1">
               Communicate with your students in course chat groups
            </p>
         </div>

         {/* Chat Container - Takes remaining height */}
         <div className="flex-1 min-h-0">
            <ChatContainer userRole="instructor" />
         </div>
      </div>
   );
}
