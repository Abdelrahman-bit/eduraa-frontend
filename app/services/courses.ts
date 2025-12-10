import { apiClient } from '@/lib/http';

export interface CourseFilters {
   category?: string;
   level?: string;
   minPrice?: number;
   maxPrice?: number;
   rating?: number;
   page?: number;
   limit?: number;
}

export interface Lecture {
   clientId: string;
   title: string;
   description?: string;
   notes?: string;
   video?: {
      url: string;
      fileName: string;
      fileType: string;
      duration: number;
   };
   attachments?: Array<{
      title: string;
      file: {
         url: string;
         fileName: string;
         fileType: string;
      };
   }>;
   captions?: Array<{
      language: string;
      file: {
         url: string;
         fileName: string;
         fileType: string;
      };
   }>;
   order: number;
}

export interface Section {
   clientId: string;
   title: string;
   order: number;
   lectures: Lecture[];
}

export interface Instructor {
   _id: string;
   name: string;
   email: string;
   id: string;
}

export interface Course {
   _id: string;
   basicInfo: {
      title: string;
      subtitle: string;
      category: string;
      subCategory: string;
      topic?: string;
      primaryLanguage?: string;
      subtitleLanguage?: string;
      level: string;
      durationValue: number;
      durationUnit: string;
   };
   advancedInfo: {
      thumbnail?: {
         url: string;
         fileName: string;
         fileType: string;
      };
      trailer?: {
         url: string;
         fileName: string;
         fileType: string;
      };
      thumbnailUrl: string;
      trailerUrl?: string;
      description: string;
      whatYouWillLearn?: string[];
      targetAudience?: string[];
      requirements?: string[];
   };
   curriculum?: {
      sections: Section[];
   };
   price: {
      amount: number;
      currency: string;
   };
   instructor: string | Instructor;
   slug: string;
   tags: string[];
   status?: string;
   version?: number;
   lastPublishedAt?: string;
   createdAt?: string;
   updatedAt?: string;
}

export interface CoursesResponse {
   status: string;
   results: number;
   data: Course[];
}

export const fetchPublishedCourses = async (
   filters: CourseFilters = {}
): Promise<CoursesResponse> => {
   const params = new URLSearchParams();

   if (filters.category) params.append('category', filters.category);
   if (filters.level) params.append('level', filters.level);
   if (filters.minPrice !== undefined)
      params.append('minPrice', filters.minPrice.toString());
   if (filters.maxPrice !== undefined)
      params.append('maxPrice', filters.maxPrice.toString());
   if (filters.rating !== undefined)
      params.append('rating', filters.rating.toString());
   if (filters.page) params.append('page', filters.page.toString());
   if (filters.limit) params.append('limit', filters.limit.toString());

   const url = `/courses/published?${params.toString()}`;
   console.log('📡 API Request URL:', url);

   const { data } = await apiClient.get<CoursesResponse>(url);
   console.log('✅ API Response - Results:', data.results);
   console.log('✅ API Response - Courses Count:', data.data?.length);
   if (data.data?.length > 0) {
      console.log('✅ First Course:', {
         title: data.data[0].basicInfo.title,
         level: data.data[0].basicInfo.level,
         price: data.data[0].price.amount,
         category: data.data[0].basicInfo.category,
         tags: data.data[0].tags,
      });
   }
   return data;
};
export interface CourseDetailsResponse {
   status: string;
   data: Course;
}

export const fetchCourseById = async (
   courseId: string
): Promise<CourseDetailsResponse> => {
   const url = `/courses/${courseId}`;
   console.log('📡 Fetching course details:', url);

   const { data } = await apiClient.get<CourseDetailsResponse>(url);
   console.log('✅ Course details response:', data);
   return data;
};

export interface EnrollmentResponse {
   status: string;
   message: string;
   data?: any;
}

export const enrollInCourse = async (
   courseId: string
): Promise<EnrollmentResponse> => {
   if (!courseId) {
      throw new Error('Course ID is required for enrollment');
   }

   const url = `/student/enroll`;
   console.log('📡 Enrolling in course:', { courseId });

   const { data } = await apiClient.post<EnrollmentResponse>(url, {
      course: courseId,
   });
   console.log('✅ Enrollment response:', data);
   return data;
};

export const checkEnrollment = async (courseId: string): Promise<boolean> => {
   try {
      const token =
         typeof window !== 'undefined' ? localStorage.getItem('token') : null;

      // If no token, user is not logged in, so not enrolled
      if (!token) {
         return false;
      }

      const url = `/student/my-courses`;
      const { data } = await apiClient.get<any>(url);

      // Check if the course is in the studentCourses list
      const isEnrolled = data.studentCourses?.some(
         (enrollment: any) =>
            enrollment.course === courseId ||
            enrollment.course?._id === courseId ||
            enrollment._id === courseId
      );

      console.log('📚 Enrollment check:', {
         courseId,
         isEnrolled,
         totalCourses: data.studentCourses?.length,
      });
      return isEnrolled || false;
   } catch (error: any) {
      // If 401 or 403, user is not authenticated or not authorized
      if (error?.response?.status === 401 || error?.response?.status === 403) {
         return false;
      }
      // For other errors, log but return false
      console.warn(
         'Could not check enrollment status:',
         error?.response?.data?.message || error.message
      );
      return false;
   }
};

export interface StudentCourse {
   _id: string;
   course: Course;
   student: string;
   enrolledAt: string;
   progress?: {
      completedLectures: string[];
      lastAccessedLecture?: string;
      progressPercentage: number;
   };
}

export interface MyCoursesResponse {
   status: string;
   results: number;
   studentCourses: StudentCourse[];
}

export const fetchMyCourses = async (): Promise<MyCoursesResponse> => {
   const url = `/student/my-courses`;
   console.log('📚 Fetching my courses');

   const { data } = await apiClient.get<MyCoursesResponse>(url);
   console.log('✅ My courses response:', data);
   return data;
};

export interface UpdateProgressPayload {
   lectureId: string;
   completed: boolean;
}

export const updateLectureProgress = async (
   courseId: string,
   lectureId: string,
   completed: boolean
) => {
   // Save to localStorage as fallback
   if (typeof window !== 'undefined') {
      const key = `course_progress_${courseId}`;
      const stored = localStorage.getItem(key);
      const progress = stored ? JSON.parse(stored) : { completedLectures: [] };

      if (completed) {
         if (!progress.completedLectures.includes(lectureId)) {
            progress.completedLectures.push(lectureId);
         }
      } else {
         progress.completedLectures = progress.completedLectures.filter(
            (id: string) => id !== lectureId
         );
      }

      localStorage.setItem(key, JSON.stringify(progress));
   }

   // Try to sync with server (optional)
   try {
      const url = `/student/my-courses/${courseId}/progress`;
      const { data } = await apiClient.put(url, { lectureId, completed });
      console.log('✅ Progress updated on server:', data);
      return data;
   } catch (error) {
      console.log('⚠️ Server sync failed, using localStorage only');
      // Silently fail - localStorage is the source of truth
      return { success: true };
   }
};

export const getCourseProgress = async (courseId: string) => {
   // Get from localStorage first
   if (typeof window !== 'undefined') {
      const key = `course_progress_${courseId}`;
      const stored = localStorage.getItem(key);
      if (stored) {
         return JSON.parse(stored);
      }
   }

   // Try to get from server
   try {
      const url = `/student/my-courses/${courseId}/progress`;
      const { data } = await apiClient.get(url);
      console.log('✅ Progress fetched from server:', data);
      return data;
   } catch (error) {
      console.log('⚠️ Server fetch failed, using localStorage only');
      return { completedLectures: [] };
   }
};
