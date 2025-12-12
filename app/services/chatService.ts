import { apiClient } from '@/lib/http';

// Types
export interface ChatGroupSettings {
   instructorOnlyMode: boolean;
   isActive: boolean;
}

export interface ChatGroupCourse {
   _id: string;
   basicInfo: {
      title: string;
   };
   advancedInfo?: {
      thumbnail?: {
         url?: string;
      };
   };
   slug: string;
   status?: 'draft' | 'review' | 'published' | 'rejected';
}

export interface ChatGroupAdmin {
   _id: string;
   firstname: string;
   lastname: string;
   avatar: string;
}

export interface ChatGroupMember {
   _id: string;
   firstname: string;
   lastname: string;
   avatar: string;
}

export interface ChatGroup {
   _id: string;
   course: ChatGroupCourse;
   admin: ChatGroupAdmin;
   members: ChatGroupMember[];
   settings: ChatGroupSettings;
   memberCount: number;
   lastMessageAt: string | null;
   createdAt: string;
   updatedAt: string;
}

export interface MessageSender {
   _id: string;
   firstname: string;
   lastname: string;
   avatar: string;
}

export interface ChatMessage {
   _id: string;
   chatGroup: string;
   sender: MessageSender;
   content: string;
   messageType: 'text' | 'system';
   createdAt: string;
   updatedAt: string;
}

export interface PaginationInfo {
   page: number;
   limit: number;
   total: number;
   pages: number;
   hasMore: boolean;
}

export interface MessagesResponse {
   status: string;
   data: ChatMessage[];
   pagination: PaginationInfo;
}

// API Functions

/**
 * Get all chat groups for the current user
 */
export const getChatGroups = async (): Promise<ChatGroup[]> => {
   try {
      const { data } = await apiClient.get('/chats/groups');
      return data.data;
   } catch (error: any) {
      console.error('[ChatService] Failed to get chat groups:', error);
      throw new Error(
         error.response?.data?.message || 'Failed to fetch chat groups'
      );
   }
};

/**
 * Get a specific chat group by ID
 */
export const getChatGroupById = async (groupId: string): Promise<ChatGroup> => {
   try {
      const { data } = await apiClient.get(`/chats/groups/${groupId}`);
      return data.data;
   } catch (error: any) {
      console.error('[ChatService] Failed to get chat group:', error);
      throw new Error(
         error.response?.data?.message || 'Failed to fetch chat group'
      );
   }
};

/**
 * Get chat group by course ID
 */
export const getChatGroupByCourse = async (
   courseId: string
): Promise<ChatGroup> => {
   try {
      const { data } = await apiClient.get(`/chats/course/${courseId}`);
      return data.data;
   } catch (error: any) {
      console.error('[ChatService] Failed to get chat group by course:', error);
      throw new Error(
         error.response?.data?.message || 'Failed to fetch chat group'
      );
   }
};

/**
 * Get messages for a chat group with pagination
 */
export const getChatMessages = async (
   groupId: string,
   page: number = 1,
   limit: number = 50
): Promise<MessagesResponse> => {
   try {
      const { data } = await apiClient.get(
         `/chats/groups/${groupId}/messages?page=${page}&limit=${limit}`
      );
      return {
         status: data.status,
         data: data.data,
         pagination: data.pagination,
      };
   } catch (error: any) {
      console.error('[ChatService] Failed to get messages:', error);
      throw new Error(
         error.response?.data?.message || 'Failed to fetch messages'
      );
   }
};

/**
 * Send a message via REST API (fallback for when socket is unavailable)
 */
export const sendMessageRest = async (
   groupId: string,
   content: string
): Promise<ChatMessage> => {
   try {
      const { data } = await apiClient.post(
         `/chats/groups/${groupId}/messages`,
         {
            content,
         }
      );
      return data.data;
   } catch (error: any) {
      console.error('[ChatService] Failed to send message:', error);
      throw new Error(
         error.response?.data?.message || 'Failed to send message'
      );
   }
};

/**
 * Update chat group settings (instructor only)
 */
export const updateChatSettings = async (
   groupId: string,
   settings: Partial<ChatGroupSettings>
): Promise<ChatGroup> => {
   try {
      const { data } = await apiClient.patch(
         `/chats/groups/${groupId}/settings`,
         settings
      );
      return data.data;
   } catch (error: any) {
      console.error('[ChatService] Failed to update settings:', error);
      throw new Error(
         error.response?.data?.message || 'Failed to update chat settings'
      );
   }
};
