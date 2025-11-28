import { apiClient } from '@/lib/http';
import { CourseBasicInfo, CourseCurriculum } from '@/app/store/types';

export type CourseResponse<T = unknown> = {
   status: string;
   data: T;
};

export interface CourseMedia {
   url?: string;
   publicId?: string;
   fileName?: string;
   fileType?: string;
   duration?: number;
}

export interface LectureDTO {
   clientId?: string;
   title: string;
   description?: string;
   notes?: string;
   video?: CourseMedia;
   attachments?: { title: string; file: CourseMedia }[];
   captions?: { language: string; file: CourseMedia }[];
   order?: number;
}

export interface SectionDTO {
   clientId?: string;
   title: string;
   order?: number;
   lectures: LectureDTO[];
}

export interface CourseDTO {
   _id: string;
   status: 'draft' | 'review' | 'published' | 'rejected';
   basicInfo: CourseBasicInfo;
   advancedInfo: CourseAdvancedInfoPayload & {
      thumbnail?: CourseMedia;
      trailer?: CourseMedia;
   };
   curriculum: {
      sections: SectionDTO[];
   };
   slug: string;
}

export type CourseAdvancedInfoPayload = {
   description: string;
   whatYouWillLearn: string[];
   targetAudience: string[];
   requirements: string[];
};

export const createCourseDraft = async (payload: {
   basicInfo: CourseBasicInfo;
   advancedInfo?: CourseAdvancedInfoPayload;
   curriculum?: CourseCurriculum;
}) => {
   const { data } = await apiClient.post<CourseResponse<CourseDTO>>(
      '/courses',
      payload
   );
   return data.data;
};

export const updateCourseBasicInfo = async (
   courseId: string,
   basicInfo: CourseBasicInfo
) => {
   const { data } = await apiClient.patch<CourseResponse<CourseDTO>>(
      `/courses/${courseId}/basic`,
      { basicInfo }
   );
   return data.data;
};

export const updateCourseAdvancedInfo = async (
   courseId: string,
   advancedInfo: CourseAdvancedInfoPayload
) => {
   const { data } = await apiClient.patch<CourseResponse<CourseDTO>>(
      `/courses/${courseId}/advanced`,
      { advancedInfo }
   );
   return data.data;
};

export const updateCourseCurriculum = async (
   courseId: string,
   curriculum: CourseCurriculum
) => {
   const { data } = await apiClient.patch<CourseResponse<CourseDTO>>(
      `/courses/${courseId}/curriculum`,
      { curriculum }
   );
   return data.data;
};

export const updateCourseStatus = async (
   courseId: string,
   status: 'draft' | 'review' | 'published'
) => {
   const { data } = await apiClient.patch<CourseResponse<CourseDTO>>(
      `/courses/${courseId}/status`,
      { status }
   );
   return data.data;
};
