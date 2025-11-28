'use client';

import { CourseBuilder } from '@/app/components/course-builder/CourseBuilder';

export default function CreateCoursePage() {
   return (
      <div className="bg-muted/20 py-12">
         <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4">
            <header className="space-y-2">
               <p className="text-sm font-semibold uppercase text-primary">
                  Course Builder
               </p>
               <h1 className="text-3xl font-bold">Create a new course</h1>
               <p className="text-muted-foreground max-w-2xl text-base">
                  Follow the guided steps to add general information, upload
                  media, craft your curriculum, and publish when you are ready.
               </p>
            </header>
            <CourseBuilder />
         </div>
      </div>
   );
}
