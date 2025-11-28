'use client';

import { create } from 'zustand';

import {
   CourseAdvancedInfo,
   CourseBasicInfo,
   CourseBuilderStore,
   CourseCurriculum,
} from './types';

const defaultBasicInfo: CourseBasicInfo = {
   title: '',
   subtitle: '',
   category: '',
   subCategory: '',
   topic: '',
   primaryLanguage: '',
   subtitleLanguage: '',
   level: 'beginner',
   durationValue: undefined,
   durationUnit: 'Day',
};

const defaultAdvancedInfo: CourseAdvancedInfo = {
   description: '',
   whatYouWillLearn: ['', '', '', ''],
   targetAudience: ['', '', '', ''],
   requirements: ['', '', '', ''],
   thumbnail: null,
   trailer: null,
};

const defaultCurriculum: CourseCurriculum = {
   sections: [
      {
         clientId: crypto.randomUUID(),
         title: 'Section 1',
         lectures: [
            {
               clientId: crypto.randomUUID(),
               title: 'Lecture 1',
               description: '',
               notes: '',
               video: null,
            },
         ],
      },
   ],
};

const initialState: CourseBuilderStore = {
   courseId: undefined,
   activeStep: 0,
   basicInfo: defaultBasicInfo,
   advancedInfo: defaultAdvancedInfo,
   curriculum: defaultCurriculum,
   status: 'draft',
   isSaving: false,
   setCourseId: () => undefined,
   setActiveStep: () => undefined,
   updateBasicInfo: () => undefined,
   updateAdvancedInfo: () => undefined,
   setCurriculum: () => undefined,
   setStatus: () => undefined,
   setIsSaving: () => undefined,
};

const useCourseBuilderStore = create<CourseBuilderStore>((set) => ({
   ...initialState,
   setCourseId: (courseId) => set({ courseId }),
   setActiveStep: (step) => set({ activeStep: step }),
   updateBasicInfo: (info) =>
      set((state) => ({
         basicInfo: { ...state.basicInfo, ...info },
      })),
   updateAdvancedInfo: (info) =>
      set((state) => ({
         advancedInfo: { ...state.advancedInfo, ...info },
      })),
   setCurriculum: (curriculum) => set({ curriculum }),
   setStatus: (status) => set({ status }),
   setIsSaving: (isSaving) => set({ isSaving }),
}));

export default useCourseBuilderStore;
