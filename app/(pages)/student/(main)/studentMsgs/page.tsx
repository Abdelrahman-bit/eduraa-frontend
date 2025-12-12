'use client';

import React from 'react';
import ChatContainer from '@/app/components/chat/ChatContainer';

export default function StudentMsgs() {
   return (
      <div className="flex flex-col h-[100vh] min-h-[500px]">
         {/* Header */}
         <div className="mb-4 flex-shrink-0">
            <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
            <p className="text-gray-500 text-sm mt-1">
               Chat with your instructors and fellow students
            </p>
         </div>

         {/* Chat Container - Fixed height with scrolling */}
         <div className="flex-1 min-h-0">
            <ChatContainer userRole="student" />
         </div>
      </div>
   );
}
