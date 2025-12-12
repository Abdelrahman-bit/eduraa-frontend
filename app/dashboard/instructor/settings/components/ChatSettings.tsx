'use client';

import React, { useEffect, useState, useMemo } from 'react';
import {
   getChatGroups,
   updateChatSettings,
   ChatGroup,
} from '@/app/services/chatService';
import {
   Lock,
   LockOpen,
   MessageCircle,
   Power,
   Users,
   FileEdit,
   BookOpen,
} from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * Chat settings component for instructor settings page
 * Compact view for managing chat settings for all courses
 */
export const ChatSettings: React.FC = () => {
   const [chatGroups, setChatGroups] = useState<ChatGroup[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [updatingGroupId, setUpdatingGroupId] = useState<string | null>(null);

   // Separate published and unpublished courses
   const { publishedGroups, unpublishedGroups } = useMemo(() => {
      const published: ChatGroup[] = [];
      const unpublished: ChatGroup[] = [];

      chatGroups.forEach((group) => {
         const status = group.course?.status;
         if (status === 'published' || !status) {
            published.push(group);
         } else {
            unpublished.push(group);
         }
      });

      return { publishedGroups: published, unpublishedGroups: unpublished };
   }, [chatGroups]);

   // Fetch chat groups on mount
   useEffect(() => {
      const fetchGroups = async () => {
         try {
            setIsLoading(true);
            const groups = await getChatGroups();
            setChatGroups(groups);
         } catch (error: any) {
            console.error('Failed to load chat groups:', error);
            toast.error('Failed to load chat groups');
         } finally {
            setIsLoading(false);
         }
      };

      fetchGroups();
   }, []);

   // Handle toggling instructor-only mode
   const handleToggleInstructorOnly = async (
      groupId: string,
      currentValue: boolean
   ) => {
      setUpdatingGroupId(groupId);
      try {
         const updated = await updateChatSettings(groupId, {
            instructorOnlyMode: !currentValue,
         });
         setChatGroups((prev) =>
            prev.map((g) =>
               g._id === groupId ? { ...g, settings: updated.settings } : g
            )
         );
         toast.success(
            !currentValue ? 'Broadcast mode on' : 'Broadcast mode off'
         );
      } catch (error: any) {
         toast.error(error.message || 'Failed to update');
      } finally {
         setUpdatingGroupId(null);
      }
   };

   // Handle toggling chat active status
   const handleToggleActive = async (
      groupId: string,
      currentValue: boolean
   ) => {
      setUpdatingGroupId(groupId);
      try {
         const updated = await updateChatSettings(groupId, {
            isActive: !currentValue,
         });
         setChatGroups((prev) =>
            prev.map((g) =>
               g._id === groupId ? { ...g, settings: updated.settings } : g
            )
         );
         toast.success(!currentValue ? 'Chat enabled' : 'Chat disabled');
      } catch (error: any) {
         toast.error(error.message || 'Failed to update');
      } finally {
         setUpdatingGroupId(null);
      }
   };

   // Compact toggle button
   const Toggle: React.FC<{
      isOn: boolean;
      onToggle: () => void;
      disabled?: boolean;
      colorOn?: string;
   }> = ({ isOn, onToggle, disabled, colorOn = 'bg-orange-500' }) => (
      <button
         onClick={onToggle}
         disabled={disabled}
         className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer ${
            isOn ? colorOn : 'bg-gray-300'
         } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
         <span
            className="inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform"
            style={{ transform: isOn ? 'translateX(17px)' : 'translateX(3px)' }}
         />
      </button>
   );

   // Compact row for each course
   const renderGroupRow = (
      group: ChatGroup,
      isUnpublished: boolean = false
   ) => {
      const isUpdating = updatingGroupId === group._id;
      const courseTitle = group.course?.basicInfo?.title || 'Unnamed Course';
      const status = group.course?.status;

      return (
         <div
            key={group._id}
            className={`flex items-center gap-3 py-2.5 px-3 rounded-lg transition-colors ${
               isUnpublished ? 'bg-gray-50 opacity-70' : 'hover:bg-gray-50'
            }`}
         >
            {/* Thumbnail */}
            {group.course?.advancedInfo?.thumbnail?.url ? (
               <img
                  src={group.course.advancedInfo.thumbnail.url}
                  alt={courseTitle}
                  className={`w-8 h-8 rounded object-cover flex-shrink-0 ${isUnpublished ? 'grayscale' : ''}`}
               />
            ) : (
               <div
                  className={`w-8 h-8 rounded flex items-center justify-center flex-shrink-0 ${
                     isUnpublished
                        ? 'bg-gray-300'
                        : 'bg-gradient-to-br from-orange-400 to-purple-500'
                  }`}
               >
                  <MessageCircle className="w-4 h-4 text-white" />
               </div>
            )}

            {/* Course Info */}
            <div className="flex-1 min-w-0">
               <div className="flex items-center gap-1.5">
                  <span className="text-sm font-medium text-gray-800 truncate">
                     {courseTitle}
                  </span>
                  {status && status !== 'published' && (
                     <span className="text-[9px] text-yellow-700 bg-yellow-100 px-1.5 py-0.5 rounded capitalize">
                        {status}
                     </span>
                  )}
               </div>
               <div className="flex items-center gap-1 text-[11px] text-gray-400">
                  <Users className="w-3 h-3" />
                  <span>{group.memberCount}</span>
               </div>
            </div>

            {/* Toggles */}
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
               {/* Instructor Only Toggle */}
               <div
                  className="flex items-center gap-1 sm:gap-1.5"
                  title="Broadcast mode (only you can send)"
               >
                  {group.settings?.instructorOnlyMode ? (
                     <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-orange-500" />
                  ) : (
                     <LockOpen className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400" />
                  )}
                  <Toggle
                     isOn={group.settings?.instructorOnlyMode || false}
                     onToggle={() =>
                        handleToggleInstructorOnly(
                           group._id,
                           group.settings?.instructorOnlyMode || false
                        )
                     }
                     disabled={isUpdating}
                  />
               </div>

               {/* Chat Active Toggle */}
               <div
                  className="flex items-center gap-1 sm:gap-1.5"
                  title="Enable/disable chat"
               >
                  <Power
                     className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${group.settings?.isActive !== false ? 'text-green-500' : 'text-gray-400'}`}
                  />
                  <Toggle
                     isOn={group.settings?.isActive !== false}
                     onToggle={() =>
                        handleToggleActive(
                           group._id,
                           group.settings?.isActive !== false
                        )
                     }
                     disabled={isUpdating}
                     colorOn="bg-green-500"
                  />
               </div>
            </div>
         </div>
      );
   };

   if (isLoading) {
      return (
         <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2 mb-3">
               <MessageCircle className="w-4 h-4 text-orange-500" />
               Chat Settings
            </h3>
            <div className="flex justify-center py-6">
               <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
         </div>
      );
   }

   return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
         <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
               <MessageCircle className="w-4 h-4 text-orange-500" />
               Chat Settings
            </h3>
            <div className="flex items-center gap-3 text-[10px] text-gray-400">
               <span className="flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Broadcast
               </span>
               <span className="flex items-center gap-1">
                  <Power className="w-3 h-3" /> Active
               </span>
            </div>
         </div>

         {chatGroups.length === 0 ? (
            <div className="text-center py-6">
               <MessageCircle className="w-10 h-10 text-gray-300 mx-auto mb-2" />
               <p className="text-gray-500 text-sm">No chat groups available</p>
            </div>
         ) : (
            <div
               className="space-y-4 max-h-[400px] overflow-y-auto pr-1"
               style={{ scrollbarWidth: 'thin' }}
            >
               {/* Published Courses Section */}
               {publishedGroups.length > 0 && (
                  <div>
                     <div className="flex items-center gap-1.5 mb-1.5 px-1">
                        <BookOpen className="w-3.5 h-3.5 text-green-500" />
                        <span className="text-xs font-medium text-gray-600">
                           Published
                        </span>
                        <span className="text-[10px] text-gray-400">
                           ({publishedGroups.length})
                        </span>
                     </div>
                     <div className="space-y-0.5">
                        {publishedGroups.map((group) =>
                           renderGroupRow(group, false)
                        )}
                     </div>
                  </div>
               )}

               {/* Unpublished Courses Section */}
               {unpublishedGroups.length > 0 && (
                  <div
                     className={
                        publishedGroups.length > 0
                           ? 'border-t border-gray-100 pt-3'
                           : ''
                     }
                  >
                     <div className="flex items-center gap-1.5 mb-1.5 px-1">
                        <FileEdit className="w-3.5 h-3.5 text-yellow-500" />
                        <span className="text-xs font-medium text-gray-500">
                           Drafts
                        </span>
                        <span className="text-[10px] text-gray-400">
                           ({unpublishedGroups.length})
                        </span>
                     </div>
                     <div className="space-y-0.5">
                        {unpublishedGroups.map((group) =>
                           renderGroupRow(group, true)
                        )}
                     </div>
                  </div>
               )}
            </div>
         )}
      </div>
   );
};

export default ChatSettings;
