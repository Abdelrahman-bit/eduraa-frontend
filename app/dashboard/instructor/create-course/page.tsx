'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import { CourseBuilder } from '@/app/components/course-builder/CourseBuilder';
import { getCourseById } from '@/app/services/courseService';
import useCourseBuilderStore from '@/app/store/courseBuilderStore';

export default function CreateCoursePage() {
   const searchParams = useSearchParams();
   const courseId = searchParams.get('id');

   const {
      setCourseId,
      updateBasicInfo,
      updateAdvancedInfo,
      setCurriculum,
      setStatus,
   } = useCourseBuilderStore();

   const { data: course, isLoading } = useQuery({
      queryKey: ['course', courseId],
      queryFn: () => getCourseById(courseId as string),
      enabled: !!courseId,
   });

   useEffect(() => {
      if (course) {
         setCourseId(course._id);
         updateBasicInfo(course.basicInfo);
         updateAdvancedInfo(course.advancedInfo);
         setCurriculum(course.curriculum);
         setStatus(course.status);
      }
   }, [
      course,
      setCourseId,
      updateBasicInfo,
      updateAdvancedInfo,
      setCurriculum,
      setStatus,
   ]);

   return (
      <div className="bg-muted/20 py-12">
         <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4">
            <header className="space-y-2">
               <p className="text-sm font-semibold uppercase text-primary">
                  Course Builder
               </p>
               <h1 className="text-3xl font-bold">
                  {courseId ? 'Edit your course' : 'Create a new course'}
               </h1>
               <p className="text-muted-foreground max-w-2xl text-base">
                  Follow the guided steps to add general information, upload
                  media, craft your curriculum, and publish when you are ready.
               </p>
            </header>
            {isLoading && courseId ? (
               <div>Loading course data...</div>
            ) : (
               <CourseBuilder />
            )}
         </div>
      </div>
   );
}
