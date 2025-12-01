'use client';

import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import useCourseBuilderStore from '@/app/store/courseBuilderStore';
import { updateCourseStatus } from '@/app/services/courseService';
import { Button } from '@/components/ui/button';

export function PublishStep() {
   const {
      courseId,
      status,
      setStatus,
      setActiveStep,
      basicInfo,
      advancedInfo,
      curriculum,
      setIsSaving,
   } = useCourseBuilderStore();

   const mutation = useMutation({
      mutationFn: async (nextStatus: 'draft' | 'review') => {
         if (!courseId) {
            throw new Error('Create a course draft before publishing.');
         }
         return updateCourseStatus(courseId, nextStatus);
      },
      onMutate: () => setIsSaving(true),
      onSuccess: (_, nextStatus) => {
         setStatus(nextStatus === 'review' ? 'review' : 'draft');
         toast.success(
            nextStatus === 'review'
               ? 'Course submitted for review'
               : 'Course saved as draft'
         );
      },
      onError: (error: Error) => toast.error(error.message),
      onSettled: () => setIsSaving(false),
   });

   const sectionsCount = curriculum.sections.length;
   const lecturesCount = curriculum.sections.reduce(
      (total, section) => total + section.lectures.length,
      0
   );

   return (
      <div className="rounded-2xl border bg-card p-6 shadow-sm">
         <div className="mb-6">
            <h2 className="text-xl font-semibold">Publish Course</h2>
            <p className="text-muted-foreground text-sm">
               Review your course details before submitting for review.
            </p>
         </div>

         <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border bg-background/60 p-4">
               <h3 className="text-lg font-semibold">Basic Information</h3>
               <p className="text-muted-foreground text-sm mt-2">
                  {basicInfo.title || 'Course title pending'}
               </p>
               <p className="text-muted-foreground text-sm">
                  {basicInfo.category
                     ? `Category: ${basicInfo.category}`
                     : 'No category yet'}
               </p>
            </div>
            <div className="rounded-xl border bg-background/60 p-4">
               <h3 className="text-lg font-semibold">Curriculum Overview</h3>
               <p className="text-muted-foreground text-sm mt-2">
                  {sectionsCount} sections • {lecturesCount} lectures
               </p>
            </div>
         </div>

         <div className="mt-8 flex flex-wrap justify-between gap-3">
            <div className="text-sm text-muted-foreground">
               Current status:{' '}
               <span className="font-semibold text-foreground capitalize">
                  {status}
               </span>
            </div>
            <div className="flex gap-3">
               <Button variant="outline" onClick={() => setActiveStep(2)}>
                  Previous
               </Button>
               <Button
                  type="button"
                  variant="secondary"
                  disabled={mutation.isPending}
                  onClick={() => mutation.mutate('draft')}
               >
                  Save Draft
               </Button>
               <Button
                  type="button"
                  disabled={mutation.isPending} // Use isPending instead of isLoading
                  onClick={() => mutation.mutate('review')}
               >
                  {mutation.isPending ? 'Submitting...' : 'Submit for Review'}
               </Button>
            </div>
         </div>
      </div>
   );
}
