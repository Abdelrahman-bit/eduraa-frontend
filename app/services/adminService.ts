import { apiClient } from '@/lib/http';
import { CourseDTO } from '@/app/services/courseService';

export interface JoinRequest {
   _id: string;
   name: string;
   email: string;
   phone: string;
   status: 'pending' | 'approved' | 'rejected';
}

export const getJoinRequests = async () => {
   const { data } = await apiClient.get<{
      status: string;
      applications: JoinRequest[];
   }>('/admin/dashboard/applicationRequest');
   return data.applications;
};

export const updateJoinRequestStatus = async (
   id: string,
   status: 'approved' | 'rejected'
) => {
   const { data } = await apiClient.patch<{
      status: string;
      message: string;
   }>(`/admin/dashboard/applicationRequest/${id}`, { status });
   return data;
};

export const getInReviewCourses = async () => {
   const { data } = await apiClient.get<{
      status: string;
      data: CourseDTO[];
   }>('/admin/courses/review');
   return data.data;
};

export const updateCourseStatus = async (
   courseId: string,
   status: 'published' | 'rejected'
) => {
   const { data } = await apiClient.patch<{
      status: string;
      message: string;
   }>(`/admin/courses/${courseId}/status`, { status });
   return data;
};

export interface Instructor {
   _id: string;
   name: string;
   email: string;
   courses: CourseDTO[];
}

export const searchInstructors = async (name: string) => {
   const { data } = await apiClient.get<{
      status: string;
      data: Instructor[];
   }>('/admin/instructors', {
      params: { name },
   });
   return data.data;
};
