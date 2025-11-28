'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import useCourseBuilderStore from '@/app/store/courseBuilderStore';
import { CourseBasicInfo } from '@/app/store/types';
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
   categories,
   courseLevels,
   durationUnits,
   languages,
} from '../constants';
import { courseBasicInfoSchema, type CourseBasicInfoSchema } from '../schemas';
import {
   createCourseDraft,
   updateCourseBasicInfo,
} from '@/app/services/courseService';

export function BasicInfoForm() {
   const {
      basicInfo,
      setActiveStep,
      setCourseId,
      courseId,
      updateBasicInfo,
      setIsSaving,
   } = useCourseBuilderStore();

   const form = useForm<CourseBasicInfoSchema>({
      resolver: zodResolver(courseBasicInfoSchema),
      defaultValues: basicInfo,
   });

   useEffect(() => {
      form.reset(basicInfo);
   }, [basicInfo, form]);

   const mutation = useMutation({
      mutationFn: (values: CourseBasicInfo) => {
         if (courseId) {
            return updateCourseBasicInfo(courseId, values);
         }
         return createCourseDraft({ basicInfo: values });
      },
      onMutate: () => setIsSaving(true),
      onSuccess: (course) => {
         setCourseId(course._id);
         updateBasicInfo(course.basicInfo);
         toast.success('Basic information saved');
         setActiveStep(1);
      },
      onError: (error: Error) => {
         toast.error(error.message);
      },
      onSettled: () => setIsSaving(false),
   });

   const onSubmit = (values: CourseBasicInfoSchema) => {
      mutation.mutate(values);
   };

   return (
      <div className="rounded-2xl border bg-card p-6 shadow-sm">
         <div className="mb-6">
            <h2 className="text-xl font-semibold">Basic Information</h2>
            <p className="text-muted-foreground text-sm">
               Provide a concise overview so students understand what to expect.
            </p>
         </div>
         <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
               <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                           <Input
                              placeholder="Your course title"
                              maxLength={80}
                              {...field}
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               <FormField
                  control={form.control}
                  name="subtitle"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Subtitle</FormLabel>
                        <FormControl>
                           <Textarea
                              placeholder="Your course subtitle"
                              maxLength={120}
                              {...field}
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                     control={form.control}
                     name="category"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Course Category</FormLabel>
                           <FormControl>
                              <select
                                 className="border-input focus-visible:ring-ring/50 rounded-md border bg-background px-3 py-2 text-sm focus-visible:ring-[3px]"
                                 {...field}
                              >
                                 <option value="">Select...</option>
                                 {categories.map((category) => (
                                    <option
                                       key={category.value}
                                       value={category.value}
                                    >
                                       {category.label}
                                    </option>
                                 ))}
                              </select>
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name="subCategory"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Course Sub-category</FormLabel>
                           <FormControl>
                              <Input
                                 placeholder="e.g. UX Research"
                                 {...field}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
               </div>

               <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Course Topic</FormLabel>
                        <FormControl>
                           <Input
                              placeholder="What is primarily taught in your course?"
                              {...field}
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                     control={form.control}
                     name="primaryLanguage"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Course Language</FormLabel>
                           <FormControl>
                              <select
                                 className="border-input focus-visible:ring-ring/50 rounded-md border bg-background px-3 py-2 text-sm focus-visible:ring-[3px]"
                                 {...field}
                              >
                                 <option value="">Select...</option>
                                 {languages.map((language) => (
                                    <option
                                       key={language.value}
                                       value={language.value}
                                    >
                                       {language.label}
                                    </option>
                                 ))}
                              </select>
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name="subtitleLanguage"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Subtitle Language (Optional)</FormLabel>
                           <FormControl>
                              <select
                                 className="border-input focus-visible:ring-ring/50 rounded-md border bg-background px-3 py-2 text-sm focus-visible:ring-[3px]"
                                 {...field}
                              >
                                 <option value="">Select...</option>
                                 {languages.map((language) => (
                                    <option
                                       key={language.value}
                                       value={language.value}
                                    >
                                       {language.label}
                                    </option>
                                 ))}
                              </select>
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
               </div>

               <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                     control={form.control}
                     name="level"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Course Level</FormLabel>
                           <FormControl>
                              <select
                                 className="border-input focus-visible:ring-ring/50 rounded-md border bg-background px-3 py-2 text-sm focus-visible:ring-[3px]"
                                 {...field}
                              >
                                 {courseLevels.map((level) => (
                                    <option
                                       key={level.value}
                                       value={level.value}
                                    >
                                       {level.label}
                                    </option>
                                 ))}
                              </select>
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <div className="grid grid-cols-2 gap-3">
                     <FormField
                        control={form.control}
                        name="durationValue"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Duration</FormLabel>
                              <FormControl>
                                 <Input
                                    type="number"
                                    min={1}
                                    placeholder="Course duration"
                                    value={field.value ?? ''}
                                    onChange={(event) => {
                                       const nextValue = event.target.value;
                                       field.onChange(
                                          nextValue
                                             ? Number(nextValue)
                                             : undefined
                                       );
                                    }}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                     <FormField
                        control={form.control}
                        name="durationUnit"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>&nbsp;</FormLabel>
                              <FormControl>
                                 <select
                                    className="border-input focus-visible:ring-ring/50 rounded-md border bg-background px-3 py-2 text-sm focus-visible:ring-[3px]"
                                    {...field}
                                 >
                                    {durationUnits.map((unit) => (
                                       <option
                                          key={unit.value}
                                          value={unit.value}
                                       >
                                          {unit.label}
                                       </option>
                                    ))}
                                 </select>
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                  </div>
               </div>

               <div className="flex justify-end gap-3">
                  <Button type="submit" disabled={mutation.isPending}>
                     {mutation.isPending ? 'Saving...' : 'Save & Next'}
                  </Button>
               </div>
            </form>
         </Form>
      </div>
   );
}
