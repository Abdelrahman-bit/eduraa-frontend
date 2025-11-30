'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Plus, Trash2, Upload, X } from 'lucide-react';

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
import { uploadToCloudinary } from '@/lib/cloudinary';

export function AdvancedInfoForm() {
   const {
      advancedInfo,
      courseId,
      updateAdvancedInfo,
      setActiveStep,
      setIsSaving,
   } = useCourseBuilderStore();

   const [uploadingMedia, setUploadingMedia] = useState<{
      thumbnail?: boolean;
      trailer?: boolean;
   }>({});
   const [previewUrls, setPreviewUrls] = useState<{
      thumbnail?: string;
      trailer?: string;
   }>({});

   const form = useForm<CourseAdvancedInfoSchema>({
      resolver: zodResolver(courseAdvancedInfoSchema),
      defaultValues: {
         description: advancedInfo.description,
         whatYouWillLearn:
            advancedInfo.whatYouWillLearn.length > 0
               ? advancedInfo.whatYouWillLearn
               : [''],
         targetAudience:
            advancedInfo.targetAudience.length > 0
               ? advancedInfo.targetAudience
               : [''],
         requirements:
            advancedInfo.requirements.length > 0
               ? advancedInfo.requirements
               : [''],
         thumbnailUrl: advancedInfo.thumbnailUrl,
         trailerUrl: advancedInfo.trailerUrl,
      },
   });

   useEffect(() => {
      form.reset({
         description: advancedInfo.description,
         whatYouWillLearn:
            advancedInfo.whatYouWillLearn.length > 0
               ? advancedInfo.whatYouWillLearn
               : [''],
         targetAudience:
            advancedInfo.targetAudience.length > 0
               ? advancedInfo.targetAudience
               : [''],
         requirements:
            advancedInfo.requirements.length > 0
               ? advancedInfo.requirements
               : [''],
         thumbnailUrl: advancedInfo.thumbnailUrl,
         trailerUrl: advancedInfo.trailerUrl,
      });

      // Set preview URLs from uploaded media
      if (advancedInfo.thumbnailUrl) {
         setPreviewUrls((prev) => ({
            ...prev,
            thumbnail: advancedInfo.thumbnailUrl,
         }));
      }
      if (advancedInfo.trailerUrl) {
         setPreviewUrls((prev) => ({
            ...prev,
            trailer: advancedInfo.trailerUrl,
         }));
      }
   }, [advancedInfo, form]);

   const mutation = useMutation({
      mutationFn: async (values: CourseAdvancedInfoSchema) => {
         if (!courseId) {
            throw new Error('Create a course draft before updating details.');
         }
         return updateCourseAdvancedInfo(courseId, values);
      },
      onMutate: () => setIsSaving(true),
      onSuccess: (data) => {
         if (data.advancedInfo) {
            updateAdvancedInfo(data.advancedInfo);
         }
         toast.success('Advanced information saved');
         setActiveStep(2);
      },
      onError: (error: Error) => toast.error(error.message),
      onSettled: () => setIsSaving(false),
   });

   const onSubmit = (values: CourseAdvancedInfoSchema) => {
      mutation.mutate(values);
   };

   const handleMediaUpload = async (
      type: 'thumbnail' | 'trailer',
      event: React.ChangeEvent<HTMLInputElement>
   ) => {
      const file = event.target.files?.[0];
      if (!file) return;

      try {
         setUploadingMedia((prev) => ({ ...prev, [type]: true }));
         const resourceType = type === 'thumbnail' ? 'image' : 'video';
         const response = await uploadToCloudinary(file, resourceType);

         const mediaData = {
            url: response.secure_url,
            publicId: response.public_id,
            fileName: file.name,
            fileType: file.type,
            duration: response.duration,
         };

         updateAdvancedInfo({
            [type]: mediaData,
            [`${type}Url`]: response.secure_url,
         });

         setPreviewUrls((prev) => ({
            ...prev,
            [type]: response.secure_url,
         }));

         toast.success(
            `${type === 'thumbnail' ? 'Thumbnail' : 'Trailer'} uploaded successfully`
         );
      } catch (error) {
         toast.error(`Failed to upload ${type}`);
         console.error(error);
      } finally {
         setUploadingMedia((prev) => ({ ...prev, [type]: false }));
      }
   };

   const removeMedia = (type: 'thumbnail' | 'trailer') => {
      updateAdvancedInfo({
         [type]: null,
         [`${type}Url`]: undefined,
      });
      setPreviewUrls((prev) => ({
         ...prev,
         [type]: undefined,
      }));
   };

   const addField = (
      fieldName: 'whatYouWillLearn' | 'targetAudience' | 'requirements'
   ) => {
      const currentValues = form.getValues(fieldName);
      if (currentValues.length < 8) {
         form.setValue(fieldName, [...currentValues, '']);
      }
   };

   const removeField = (
      fieldName: 'whatYouWillLearn' | 'targetAudience' | 'requirements',
      index: number
   ) => {
      const currentValues = form.getValues(fieldName);
      if (currentValues.length > 1) {
         form.setValue(
            fieldName,
            currentValues.filter((_, i) => i !== index)
         );
      }
   };

   const renderDynamicList = (
      name: 'whatYouWillLearn' | 'targetAudience' | 'requirements',
      label: string
   ) => {
      const fields = form.watch(name);
      return (
         <div className="rounded-lg border p-4">
            <div className="mb-4 flex items-center justify-between">
               <h3 className="font-semibold">{label}</h3>
               <span className="text-xs text-muted-foreground">
                  {fields.length}/8 fields
               </span>
            </div>
            <div className="space-y-3">
               {fields.map((_, index) => (
                  <div key={`${name}-${index}`} className="flex gap-2">
                     <FormField
                        control={form.control}
                        name={`${name}.${index}` as const}
                        render={({ field }) => (
                           <FormItem className="flex-1">
                              <FormControl>
                                 <Textarea
                                    placeholder={`${label} #${index + 1}`}
                                    className="min-h-20"
                                    {...field}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                     {fields.length > 1 && (
                        <Button
                           type="button"
                           variant="ghost"
                           size="icon"
                           onClick={() => removeField(name, index)}
                           className="mt-0"
                        >
                           <Trash2 className="h-4 w-4" />
                        </Button>
                     )}
                  </div>
               ))}
            </div>
            {fields.length < 8 && (
               <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addField(name)}
                  className="mt-3 w-full"
               >
                  <Plus className="mr-2 h-4 w-4" />
                  Add {label}
               </Button>
            )}
         </div>
      );
   };

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
                  {/* Thumbnail Upload */}
                  <div className="rounded-xl border p-4">
                     <label className="text-sm font-medium">
                        Course Thumbnail
                     </label>
                     <p className="text-muted-foreground text-xs">
                        Upload a 750x422px image (PNG, JPG)
                     </p>
                     {previewUrls.thumbnail ? (
                        <div className="relative mt-3">
                           <img
                              src={previewUrls.thumbnail}
                              alt="Thumbnail preview"
                              className="h-32 w-full rounded-lg object-cover"
                           />
                           <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute right-2 top-2"
                              onClick={() => removeMedia('thumbnail')}
                           >
                              <X className="h-4 w-4" />
                           </Button>
                        </div>
                     ) : (
                        <div className="relative mt-3">
                           <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              id="thumbnail-upload"
                              onChange={(e) =>
                                 handleMediaUpload('thumbnail', e)
                              }
                              disabled={uploadingMedia.thumbnail}
                           />
                           <label
                              htmlFor="thumbnail-upload"
                              className="flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed p-6 hover:bg-muted"
                           >
                              <div className="text-center">
                                 <Upload className="mx-auto h-6 w-6 text-muted-foreground" />
                                 <p className="text-xs text-muted-foreground">
                                    {uploadingMedia.thumbnail
                                       ? 'Uploading...'
                                       : 'Click to upload'}
                                 </p>
                              </div>
                           </label>
                        </div>
                     )}
                  </div>

                  {/* Trailer Upload */}
                  <div className="rounded-xl border p-4">
                     <label className="text-sm font-medium">
                        Course Trailer
                     </label>
                     <p className="text-muted-foreground text-xs">
                        Upload a short trailer up to 4GB (MP4, MOV)
                     </p>
                     {previewUrls.trailer ? (
                        <div className="relative mt-3">
                           <video
                              src={previewUrls.trailer}
                              className="h-32 w-full rounded-lg object-cover"
                              controls
                           />
                           <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute right-2 top-2"
                              onClick={() => removeMedia('trailer')}
                           >
                              <X className="h-4 w-4" />
                           </Button>
                        </div>
                     ) : (
                        <div className="relative mt-3">
                           <input
                              type="file"
                              accept="video/*"
                              className="hidden"
                              id="trailer-upload"
                              onChange={(e) => handleMediaUpload('trailer', e)}
                              disabled={uploadingMedia.trailer}
                           />
                           <label
                              htmlFor="trailer-upload"
                              className="flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed p-6 hover:bg-muted"
                           >
                              <div className="text-center">
                                 <Upload className="mx-auto h-6 w-6 text-muted-foreground" />
                                 <p className="text-xs text-muted-foreground">
                                    {uploadingMedia.trailer
                                       ? 'Uploading...'
                                       : 'Click to upload'}
                                 </p>
                              </div>
                           </label>
                        </div>
                     )}
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
