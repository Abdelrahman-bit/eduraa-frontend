// store/types.ts

// 1. Define the shape of your state
export interface User {
   id: number;
   name?: string;
   firstName?: string;
   lastName?: string;
   email: string;
   role: 'student' | 'instructor' | 'admin';
   avatar?: string;
}

export interface BearState {
   count: number;
   user: User | null;
   isAuthenticated: boolean;
   loading: boolean;
}

// 2. Define the shape of your actions (functions)
export interface BearActions {
   increment: (by: number) => void;
   decrement: () => void;
   login: (userData: User) => void;
   logout: () => void;
   initializeAuth: () => void;
}

// 3. Combine State and Actions for the final store signature
export type BearStore = BearState & BearActions;

export type CourseLevel =
   | 'beginner'
   | 'intermediate'
   | 'advanced'
   | 'all-levels';
export type CourseDurationUnit = 'Day' | 'Week' | 'Month' | 'Hour';

export interface CourseBasicInfo {
   title: string;
   subtitle: string;
   category: string;
   subCategory: string;
   topic: string;
   primaryLanguage: string;
   subtitleLanguage?: string;
   level: CourseLevel;
   durationValue?: number;
   durationUnit: CourseDurationUnit;
}

export interface UploadedMedia {
   url?: string;
   publicId?: string;
   fileName?: string;
   fileType?: string;
   duration?: number;
}

export interface CourseAdvancedInfo {
   description: string;
   whatYouWillLearn: string[];
   targetAudience: string[];
   requirements: string[];
   thumbnail?: File | UploadedMedia | null;
   trailer?: File | UploadedMedia | null;
   thumbnailUrl?: string;
   trailerUrl?: string;
}

export interface Lecture {
   clientId: string;
   title: string;
   description: string;
   notes: string;
   video?: File | UploadedMedia | null;
   attachments?: { title: string; file: UploadedMedia }[];
   order?: number;
}

export interface Section {
   clientId: string;
   title: string;
   lectures: Lecture[];
   order?: number;
}

export interface CourseCurriculum {
   sections: Section[];
}

export interface CourseBuilderState {
   courseId?: string;
   activeStep: number;
   basicInfo: CourseBasicInfo;
   advancedInfo: CourseAdvancedInfo;
   curriculum: CourseCurriculum;
   status: 'draft' | 'review' | 'published' | 'rejected';
   isSaving: boolean;
}

export interface CourseBuilderActions {
   setCourseId: (courseId: string) => void;
   setActiveStep: (step: number) => void;
   updateBasicInfo: (info: Partial<CourseBasicInfo>) => void;
   updateAdvancedInfo: (info: Partial<CourseAdvancedInfo>) => void;
   setCurriculum: (curriculum: CourseCurriculum) => void;
   setStatus: (status: CourseBuilderState['status']) => void;
   setIsSaving: (saving: boolean) => void;
}

export type CourseBuilderStore = CourseBuilderState & CourseBuilderActions;

export interface SignUpData {
   firstName?: string;
   lastName?: string;
   username?: string;
   email?: string;
   password?: string;
   confirmPassword?: string;
}
