import { apiClient } from '@/lib/http';

export interface PlatformStats {
   totalStudents: number;
   activeCourses: number;
   averageRating: number;
}

export const fetchPlatformStats = async (): Promise<PlatformStats> => {
   try {
      const response = await apiClient.get('/stats/public');

      if (response.data.status === 'success') {
         return {
            totalStudents: response.data.data.totalStudents,
            activeCourses: response.data.data.activeCourses,
            averageRating: response.data.data.averageRating,
         };
      }

      // Fallback if response format is unexpected
      return {
         totalStudents: 10000,
         activeCourses: 500,
         averageRating: 4.8,
      };
   } catch (error) {
      console.error('Error fetching platform stats:', error);
      // Return fallback data on error
      return {
         totalStudents: 10000,
         activeCourses: 500,
         averageRating: 4.8,
      };
   }
};
