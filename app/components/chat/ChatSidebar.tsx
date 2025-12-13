'use client';

import React, { useState, useMemo } from 'react';
import { formatDistanceToNow } from '@/app/utils/dateUtils';
import { ChatGroup } from '@/app/services/chatService';
import {
   MessageCircle,
   Users,
   Lock,
   ChevronDown,
   ChevronRight,
   FileEdit,
   Sparkles,
} from 'lucide-react';

interface ChatSidebarProps {
   groups: ChatGroup[];
   selectedGroupId: string | null;
   onSelectGroup: (group: ChatGroup) => void;
   isLoading?: boolean;
}

/**
 * Single chat group item component
 */
const ChatGroupItem: React.FC<{
   group: ChatGroup;
   isSelected: boolean;
   isFaded?: boolean;
   onSelect: () => void;
}> = ({ group, isSelected, isFaded = false, onSelect }) => {
   const courseTitle = group.course?.basicInfo?.title || 'Unnamed Course';
   const thumbnailUrl = group.course?.advancedInfo?.thumbnail?.url;
   const lastActivity = group.lastMessageAt
      ? formatDistanceToNow(new Date(group.lastMessageAt))
      : null;
   const status = group.course?.status;
   const unreadCount = group.unreadCount || 0;

   return (
      <button
         onClick={onSelect}
         className={`w-full p-3 flex items-start gap-3 text-left transition-all duration-200 
            cursor-pointer group
            ${
               isSelected
                  ? 'bg-gradient-to-r from-orange-50 to-orange-100/50 border-l-4 border-orange-500'
                  : 'hover:bg-gray-50 border-l-4 border-transparent hover:border-gray-200'
            } 
            ${isFaded ? 'opacity-60' : ''}`}
      >
         {/* Thumbnail - Rounded */}
         <div className="flex-shrink-0 relative">
            {thumbnailUrl ? (
               <img
                  src={thumbnailUrl}
                  alt={courseTitle}
                  className={`w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-sm
                     transition-transform duration-200 group-hover:scale-105
                     ${isFaded ? 'grayscale' : ''} 
                     ${isSelected ? 'ring-orange-200' : ''}`}
               />
            ) : (
               <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center 
                  ring-2 ring-white shadow-sm transition-transform duration-200 group-hover:scale-105
                  ${
                     isFaded
                        ? 'bg-gray-300'
                        : 'bg-gradient-to-br from-orange-400 to-purple-500'
                  }`}
               >
                  <MessageCircle className="w-5 h-5 text-white" />
               </div>
            )}
            {/* Status badge for draft/review */}
            {status && status !== 'published' && (
               <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center ring-2 ring-white">
                  <FileEdit className="w-2.5 h-2.5 text-yellow-800" />
               </div>
            )}
         </div>

         {/* Content */}
         <div className="flex-1 min-w-0 py-0.5">
            <div className="flex items-center justify-between gap-2">
               <h3
                  className={`font-medium truncate text-sm transition-colors flex-1
                  ${isFaded ? 'text-gray-500' : isSelected ? 'text-orange-700' : 'text-gray-800 group-hover:text-gray-900'}`}
               >
                  {courseTitle}
               </h3>
               <div className="flex items-center gap-1.5 flex-shrink-0">
                  {/* Unread count badge */}
                  {unreadCount > 0 && (
                     <span className="min-w-[20px] h-5 px-1.5 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 99 ? '99+' : unreadCount}
                     </span>
                  )}
                  {group.settings?.instructorOnlyMode && (
                     <Lock className="w-3.5 h-3.5 text-orange-400" />
                  )}
               </div>
            </div>

            <div className="flex items-center gap-1.5 mt-1">
               <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Users className="w-3 h-3" />
                  <span>{group.memberCount}</span>
               </div>
               {lastActivity && (
                  <>
                     <span className="text-gray-300">•</span>
                     <span className="text-xs text-gray-400">
                        {lastActivity}
                     </span>
                  </>
               )}
               {status && status !== 'published' && (
                  <>
                     <span className="text-gray-300">•</span>
                     <span className="text-[10px] text-yellow-600 bg-yellow-50 px-1.5 py-0.5 rounded-full capitalize font-medium">
                        {status}
                     </span>
                  </>
               )}
            </div>

            <p className="text-xs text-gray-400 mt-1 truncate">
               by {group.admin?.firstname} {group.admin?.lastname}
            </p>
         </div>
      </button>
   );
};

/**
 * Sidebar component that displays a list of chat groups
 */
export const ChatSidebar: React.FC<ChatSidebarProps> = ({
   groups,
   selectedGroupId,
   onSelectGroup,
   isLoading = false,
}) => {
   const [isDraftSectionOpen, setIsDraftSectionOpen] = useState(false);

   // Separate published from draft/review courses
   const { publishedGroups, draftGroups } = useMemo(() => {
      const published: ChatGroup[] = [];
      const drafts: ChatGroup[] = [];

      groups.forEach((group) => {
         const status = group.course?.status;
         if (status === 'published' || !status) {
            published.push(group);
         } else {
            drafts.push(group);
         }
      });

      return { publishedGroups: published, draftGroups: drafts };
   }, [groups]);

   if (isLoading) {
      return (
         <div className="flex flex-col h-full bg-white border-r border-gray-100">
            <div className="p-4 border-b border-gray-100">
               <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
            </div>
            <div className="flex-1 flex items-center justify-center">
               <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm text-gray-400">
                     Loading chats...
                  </span>
               </div>
            </div>
         </div>
      );
   }

   if (groups.length === 0) {
      return (
         <div className="flex flex-col h-full bg-white border-r border-gray-100">
            <div className="p-4 border-b border-gray-100">
               <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
               <div className="w-20 h-20 bg-gradient-to-br from-orange-50 to-purple-50 rounded-full flex items-center justify-center mb-4 shadow-sm">
                  <MessageCircle className="w-10 h-10 text-orange-400" />
               </div>
               <p className="text-gray-700 font-medium mb-1">
                  No conversations yet
               </p>
               <p className="text-gray-400 text-sm leading-relaxed max-w-[200px]">
                  Enroll in a course to join its chat community
               </p>
            </div>
         </div>
      );
   }

   return (
      <div className="flex flex-col h-full bg-white border-r border-gray-100">
         {/* Header */}
         <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
               <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
               <div className="flex items-center gap-1 px-2 py-1 bg-orange-50 rounded-full">
                  <Sparkles className="w-3 h-3 text-orange-500" />
                  <span className="text-xs font-medium text-orange-600">
                     {publishedGroups.length}
                  </span>
               </div>
            </div>
            {draftGroups.length > 0 && (
               <p className="text-xs text-gray-400 mt-1">
                  + {draftGroups.length} unpublished
               </p>
            )}
         </div>

         {/* Group Lists */}
         <div
            className="flex-1 overflow-y-auto"
            style={{
               scrollbarWidth: 'thin',
               scrollbarColor: '#e5e7eb transparent',
            }}
         >
            {/* Published Courses */}
            {publishedGroups.length > 0 && (
               <div className="py-1">
                  {publishedGroups.map((group) => (
                     <ChatGroupItem
                        key={group._id}
                        group={group}
                        isSelected={selectedGroupId === group._id}
                        onSelect={() => onSelectGroup(group)}
                     />
                  ))}
               </div>
            )}

            {/* Draft/Review Courses - Collapsible */}
            {draftGroups.length > 0 && (
               <div className="border-t border-gray-100 mt-1">
                  {/* Collapsible Header */}
                  <button
                     onClick={() => setIsDraftSectionOpen(!isDraftSectionOpen)}
                     className="w-full px-4 py-3 flex items-center justify-between bg-gray-50/50 
                        hover:bg-gray-100/50 transition-colors cursor-pointer"
                  >
                     <div className="flex items-center gap-2">
                        <div
                           className={`transition-transform duration-200 ${isDraftSectionOpen ? 'rotate-0' : '-rotate-90'}`}
                        >
                           <ChevronDown className="w-4 h-4 text-gray-400" />
                        </div>
                        <span className="text-sm font-medium text-gray-500">
                           Drafts & In Review
                        </span>
                        <span className="text-[10px] text-gray-400 bg-gray-200 px-2 py-0.5 rounded-full font-medium">
                           {draftGroups.length}
                        </span>
                     </div>
                     <FileEdit className="w-4 h-4 text-gray-300" />
                  </button>

                  {/* Collapsible Content with smooth animation */}
                  <div
                     className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isDraftSectionOpen
                           ? 'max-h-[500px] opacity-100'
                           : 'max-h-0 opacity-0'
                     }`}
                  >
                     <div className="bg-gray-50/30 py-1">
                        {draftGroups.map((group) => (
                           <ChatGroupItem
                              key={group._id}
                              group={group}
                              isSelected={selectedGroupId === group._id}
                              isFaded={true}
                              onSelect={() => onSelectGroup(group)}
                           />
                        ))}
                     </div>
                  </div>
               </div>
            )}
         </div>
      </div>
   );
};

export default ChatSidebar;
