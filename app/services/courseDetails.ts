import { apiClient } from '@/lib/http';
import { Course } from './courses';

export const fetchCourseById = async (
   id: string
): Promise<{ status: string; data: Course }> => {
   const { data } = await apiClient.get<{ status: string; data: Course }>(
      `/courses/${id}`
   );
   console.log('📚 Course Details:', data);
   return data;
};
