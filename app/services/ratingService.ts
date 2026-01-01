import { apiClient } from '@/lib/http';

// Types
export interface Rating {
   _id: string;
   student:
      | string
      | { _id: string; firstname: string; lastname: string; avatar?: string };
   course: string;
   rating: number;
   review?: string;
   createdAt: string;
   updatedAt: string;
}

export interface RatingStats {
   averageRating: number;
   totalRatings: number;
   distribution: { stars: number; count: number; percent: number }[];
}

export interface SubmitRatingPayload {
   rating: number;
   review?: string;
}

interface RatingResponse<T> {
   status: string;
   data: T;
}

interface RatingsListResponse {
   status: string;
   results: number;
   total: number;
   data: Rating[];
}

/**
 * Submit or update a rating for a course
 */
export const submitRating = async (
   courseId: string,
   payload: SubmitRatingPayload
): Promise<Rating> => {
   const { data } = await apiClient.post<RatingResponse<Rating>>(
      `/ratings/${courseId}`,
      payload
   );
   return data.data;
};

/**
 * Get the current student's rating for a course
 */
export const getMyRating = async (courseId: string): Promise<Rating | null> => {
   const { data } = await apiClient.get<RatingResponse<Rating | null>>(
      `/ratings/${courseId}/my-rating`
   );
   return data.data;
};

/**
 * Get all ratings for a course (instructor/admin only)
 */
export const getCourseRatings = async (
   courseId: string,
   page = 1,
   limit = 10
): Promise<{ ratings: Rating[]; total: number }> => {
   const { data } = await apiClient.get<RatingsListResponse>(
      `/ratings/${courseId}?page=${page}&limit=${limit}`
   );
   return { ratings: data.data, total: data.total };
};

/**
 * Get rating statistics for a course
 */
export const getCourseRatingStats = async (
   courseId: string
): Promise<RatingStats> => {
   const { data } = await apiClient.get<RatingResponse<RatingStats>>(
      `/ratings/${courseId}/stats`
   );
   return data.data;
};

/**
 * Get ratings for multiple courses at once (used for filtering)
 */
export const getBatchCourseRatings = async (
   courseIds: string[]
): Promise<Record<string, RatingStats>> => {
   // Fetch ratings in parallel
   const results = await Promise.all(
      courseIds.map(async (courseId) => {
         try {
            const stats = await getCourseRatingStats(courseId);
            return { courseId, stats };
         } catch {
            return {
               courseId,
               stats: { averageRating: 0, totalRatings: 0, distribution: [] },
            };
         }
      })
   );

   return results.reduce(
      (acc, { courseId, stats }) => {
         acc[courseId] = stats;
         return acc;
      },
      {} as Record<string, RatingStats>
   );
};
