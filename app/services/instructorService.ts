import { apiClient } from '@/lib/http';

export const applyForJob = async (values: {
   firstname: string;
   lastname: string;
   email: string;
   phone: string;
}) => {
   try {
      return await apiClient.post('/instructor/applicationRequest', values);
   } catch (error) {
      throw error;
   }
};

export const getMyCourses = async () => {
   const { data } = await apiClient.get<{
      status: string;
      results: number;
      data: any[];
   }>('/courses');
   return data.data;
};

// ===== Enrollment Request Services =====

export interface EnrollmentRequest {
   _id: string;
   student: {
      _id: string;
      firstname: string;
      lastname: string;
      email: string;
      avatar?: string;
   };
   course: {
      _id: string;
      basicInfo: {
         title: string;
      };
      advancedInfo?: {
         thumbnail?: {
            url: string;
         };
      };
   };
   status: 'pending' | 'approved' | 'rejected';
   createdAt: string;
}

export interface EnrollmentRequestsResponse {
   status: string;
   results: number;
   data: EnrollmentRequest[];
}

export const getEnrollmentRequests =
   async (): Promise<EnrollmentRequestsResponse> => {
      const { data } = await apiClient.get<EnrollmentRequestsResponse>(
         '/enrollment/requests'
      );
      return data;
   };

export const approveEnrollmentRequest = async (
   requestId: string,
   durationDays: number = 30
): Promise<{ status: string; message: string; code: string }> => {
   const { data } = await apiClient.patch(
      `/enrollment/requests/${requestId}/approve`,
      { durationDays }
   );
   return data;
};

export const rejectEnrollmentRequest = async (
   requestId: string
): Promise<{ status: string; message: string }> => {
   const { data } = await apiClient.patch(
      `/enrollment/requests/${requestId}/reject`
   );
   return data;
};

// ===== Enrolled Students Services =====

export interface EnrolledStudent {
   _id: string;
   student: {
      _id: string;
      firstname: string;
      lastname: string;
      email: string;
      avatar?: string;
   };
   course: {
      _id: string;
      basicInfo: {
         title: string;
      };
      advancedInfo?: {
         thumbnail?: {
            url: string;
         };
      };
   };
   progress: number;
   createdAt: string;
}

export interface EnrolledStudentsResponse {
   status: string;
   results: number;
   data: EnrolledStudent[];
}

export const getEnrolledStudents = async (
   courseId?: string
): Promise<EnrolledStudentsResponse> => {
   const url = courseId
      ? `/instructor/enrolled-students?courseId=${courseId}`
      : '/instructor/enrolled-students';
   const { data } = await apiClient.get<EnrolledStudentsResponse>(url);
   return data;
};

export const removeStudentFromCourse = async (
   courseId: string,
   studentId: string
): Promise<{ status: string; message: string }> => {
   const { data } = await apiClient.delete(
      `/instructor/courses/${courseId}/students/${studentId}`
   );
   return data;
};

// ===== Student Profile Service =====

export interface StudentProfile {
   _id: string;
   firstname: string;
   lastname: string;
   email: string;
   phone?: string;
   avatar?: string;
   title?: string;
   bio?: string;
   createdAt: string;
   courses: Array<{
      _id: string;
      basicInfo: { title: string };
      advancedInfo?: { thumbnail?: { url: string } };
      progress: number;
      enrolledAt: string;
   }>;
}

export const getStudentDetails = async (
   studentId: string
): Promise<StudentProfile> => {
   const { data } = await apiClient.get<{
      status: string;
      data: StudentProfile;
   }>(`/instructor/students/${studentId}`);
   return data.data;
};
