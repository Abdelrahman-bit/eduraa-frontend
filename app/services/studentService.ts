import { apiClient } from '@/lib/http';

export interface Instructor {
   _id: string;
   firstname: string;
   lastname: string;
   avatar: string;
   title?: string;
   name?: string; // Derived in frontend if needed
}

export interface StudentCourse {
   _id: string;
   student: string;
   course: {
      _id: string;
      basicInfo: {
         title: string;
         category: string;
         level: string;
      };
      advancedInfo: {
         thumbnailUrl: string;
      };
      instructor: Instructor;
      curriculum: {
         sections: any[];
      };
   };
   status: 'enrolled' | 'unenrolled';
   createdAt: string;
   updatedAt: string;
   progress?: number; // Backend doesn't seem to calculate progress yet, default to 0
}

export interface StudentCoursesResponse {
   status: string;
   results: number;
   studentCourses: StudentCourse[];
}

// ... existing interfaces ...

export interface DashboardStats {
   enrolledCourses: number;
   activeCourses: number;
   completedCourses: number;
   courseInstructors: number;
}

export interface WishlistItem {
   _id: string;
   course: {
      _id: string;
      basicInfo: {
         title: string;
         category: string;
         price: number;
      };
      advancedInfo: {
         thumbnailUrl: string;
      };
      instructor: {
         firstname: string;
         lastname: string;
      };
   };
}

// ... getMyCourses ...
export const getMyCourses = async (): Promise<StudentCourse[]> => {
   try {
      const { data } = await apiClient.get<StudentCoursesResponse>(
         '/student/my-courses'
      );
      return data.studentCourses;
   } catch (error: any) {
      throw new Error(
         error.response?.data?.message || 'Failed to fetch student courses'
      );
   }
};

export const getDashboardStats = async (): Promise<DashboardStats> => {
   try {
      const { data } = await apiClient.get('/student/stats');
      return data.data;
   } catch (error: any) {
      console.error('Failed to fetch stats', error);
      return {
         enrolledCourses: 0,
         activeCourses: 0,
         completedCourses: 0,
         courseInstructors: 0,
      };
   }
};

export const getWishlist = async (): Promise<WishlistItem[]> => {
   try {
      const { data } = await apiClient.get('/student/wishlist');
      return data.data;
   } catch (error: any) {
      throw new Error(
         error.response?.data?.message || 'Failed to fetch wishlist'
      );
   }
};

export const getInstructorProfile = async (id: string) => {
   try {
      const { data } = await apiClient.get<any>(`/user/${id}`);
      return data.data;
   } catch (error: any) {
      console.error('Failed to fetch instructor profile', error);
      return null;
   }
};

export const addToWishlist = async (courseId: string) => {
   return apiClient.post('/student/wishlist', { courseId });
};

export const removeFromWishlist = async (courseId: string) => {
   return apiClient.delete(`/student/wishlist/${courseId}`);
};
