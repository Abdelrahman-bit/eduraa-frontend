'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import {
   courseAdvancedInfoSchema,
   type CourseAdvancedInfoSchema,
} from '../schemas';
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import useCourseBuilderStore from '@/app/store/courseBuilderStore';
import { updateCourseAdvancedInfo } from '@/app/services/courseService';

const ensureFourItems = (items: string[]) => {
   const next = [...items];
   while (next.length < 4) {
      next.push('');
   }
   return next.slice(0, 4);
};

export function AdvancedInfoForm() {
   const {
      advancedInfo,
      courseId,
      updateAdvancedInfo,
      setActiveStep,
      setIsSaving,
   } = useCourseBuilderStore();

   const form = useForm<CourseAdvancedInfoSchema>({
      resolver: zodResolver(courseAdvancedInfoSchema),
      defaultValues: {
         description: advancedInfo.description,
         whatYouWillLearn: ensureFourItems(advancedInfo.whatYouWillLearn),
         targetAudience: ensureFourItems(advancedInfo.targetAudience),
         requirements: ensureFourItems(advancedInfo.requirements),
      },
   });

   useEffect(() => {
      form.reset({
         description: advancedInfo.description,
         whatYouWillLearn: ensureFourItems(advancedInfo.whatYouWillLearn),
         targetAudience: ensureFourItems(advancedInfo.targetAudience),
         requirements: ensureFourItems(advancedInfo.requirements),
      });
   }, [advancedInfo, form]);

   const mutation = useMutation({
      mutationFn: async (values: CourseAdvancedInfoSchema) => {
         if (!courseId) {
            throw new Error('Create a course draft before updating details.');
         }
         return updateCourseAdvancedInfo(courseId, values);
      },
      onMutate: () => setIsSaving(true),
      onSuccess: () => {
         updateAdvancedInfo({
            description: form.getValues('description'),
            whatYouWillLearn: form.getValues('whatYouWillLearn'),
            targetAudience: form.getValues('targetAudience'),
            requirements: form.getValues('requirements'),
         });
         toast.success('Advanced information saved');
         setActiveStep(2);
      },
      onError: (error: Error) => toast.error(error.message),
      onSettled: () => setIsSaving(false),
   });

   const onSubmit = (values: CourseAdvancedInfoSchema) => {
      mutation.mutate(values);
   };

   const handleFileUpload = (
      type: 'thumbnail' | 'trailer',
      event: React.ChangeEvent<HTMLInputElement>
   ) => {
      const file = event.target.files?.[0] ?? null;
      updateAdvancedInfo({ [type]: file });
   };

   const renderDynamicList = (
      name: 'whatYouWillLearn' | 'targetAudience' | 'requirements',
      label: string
   ) => (
      <div>
         <h3 className="mb-3 font-semibold">{label}</h3>
         <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
               <FormField
                  key={`${name}-${index}`}
                  control={form.control}
                  name={`${name}.${index}` as const}
                  render={({ field }) => (
                     <FormItem>
                        <FormControl>
                           <Textarea
                              placeholder={`${label} #${index + 1}`}
                              {...field}
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
            ))}
         </div>
      </div>
   );

   return (
      <div className="rounded-2xl border bg-card p-6 shadow-sm">
         <div className="mb-6">
            <h2 className="text-xl font-semibold">Advanced Information</h2>
            <p className="text-muted-foreground text-sm">
               Add media, descriptions, learning outcomes, target audience, and
               course requirements.
            </p>
         </div>
         <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
               <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl border p-4">
                     <label className="text-sm font-medium">
                        Course Thumbnail
                     </label>
                     <p className="text-muted-foreground text-xs">
                        Upload a 750x422px image (PNG, JPG)
                     </p>
                     <input
                        type="file"
                        accept="image/*"
                        className="mt-3 text-sm"
                        onChange={(event) =>
                           handleFileUpload('thumbnail', event)
                        }
                     />
                  </div>
                  <div className="rounded-xl border p-4">
                     <label className="text-sm font-medium">
                        Course Trailer
                     </label>
                     <p className="text-muted-foreground text-xs">
                        Upload a short trailer up to 4GB (MP4, MOV)
                     </p>
                     <input
                        type="file"
                        accept="video/*"
                        className="mt-3 text-sm"
                        onChange={(event) => handleFileUpload('trailer', event)}
                     />
                  </div>
               </div>

               <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Course Description</FormLabel>
                        <FormControl>
                           <Textarea
                              placeholder="Enter your course description"
                              className="min-h-40"
                              {...field}
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               <div className="grid gap-6">
                  {renderDynamicList(
                     'whatYouWillLearn',
                     'What you will teach in this course'
                  )}
                  {renderDynamicList('targetAudience', 'Target Audience')}
                  {renderDynamicList('requirements', 'Course Requirements')}
               </div>

               <div className="flex justify-between">
                  <Button
                     type="button"
                     variant="outline"
                     onClick={() => setActiveStep(0)}
                  >
                     Previous
                  </Button>
                  <Button type="submit" disabled={mutation.isPending}>
                     {mutation.isPending ? 'Saving...' : 'Save & Next'}
                  </Button>
               </div>
            </form>
         </Form>
      </div>
   );
}
