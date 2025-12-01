'use client';

import { useMutation } from '@tanstack/react-query';
import { Plus, Trash2, Upload, X, GripVertical } from 'lucide-react';
import toast from 'react-hot-toast';
import { useState } from 'react';

import useCourseBuilderStore from '@/app/store/courseBuilderStore';
import { CourseCurriculum, Lecture, Section } from '@/app/store/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { updateCourseCurriculum } from '@/app/services/courseService';
import { uploadToCloudinary } from '@/lib/cloudinary';

const createLecture = (): Lecture => ({
   clientId: crypto.randomUUID(),
   title: 'Lecture title',
   description: '',
   notes: '',
   video: null,
});

const createSection = (): Section => ({
   clientId: crypto.randomUUID(),
   title: 'Section name',
   lectures: [createLecture()],
});

export function CurriculumBuilder() {
   const { curriculum, setCurriculum, courseId, setActiveStep, setIsSaving } =
      useCourseBuilderStore();

   const [uploadingVideo, setUploadingVideo] = useState<{
      [key: string]: boolean;
   }>({});
   const [draggedLecture, setDraggedLecture] = useState<{
      sectionId: string;
      lectureId: string;
   } | null>(null);
   const [expandedLecture, setExpandedLecture] = useState<string | null>(null);

   const mutation = useMutation({
      mutationFn: async (payload: CourseCurriculum) => {
         if (!courseId) {
            throw new Error(
               'Create a course draft before editing the curriculum.'
            );
         }
         return updateCourseCurriculum(courseId, payload);
      },
      onMutate: () => setIsSaving(true),
      onSuccess: () => {
         toast.success('Curriculum saved');
         setActiveStep(3);
      },
      onError: (error: Error) => toast.error(error.message),
      onSettled: () => setIsSaving(false),
   });

   const updateSections = (updater: (sections: Section[]) => Section[]) => {
      setCurriculum({ sections: updater(curriculum.sections) });
   };

   const handleSectionTitleChange = (sectionId: string, title: string) => {
      updateSections((sections) =>
         sections.map((section) =>
            section.clientId === sectionId ? { ...section, title } : section
         )
      );
   };

   const handleLectureChange = (
      sectionId: string,
      lectureId: string,
      changes: Partial<Lecture>
   ) => {
      updateSections((sections) =>
         sections.map((section) =>
            section.clientId === sectionId
               ? {
                    ...section,
                    lectures: section.lectures.map((lecture) =>
                       lecture.clientId === lectureId
                          ? { ...lecture, ...changes }
                          : lecture
                    ),
                 }
               : section
         )
      );
   };

   const handleVideoUpload = async (
      sectionId: string,
      lectureId: string,
      event: React.ChangeEvent<HTMLInputElement>
   ) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const uploadKey = `${sectionId}-${lectureId}`;
      try {
         setUploadingVideo((prev) => ({ ...prev, [uploadKey]: true }));
         const response = await uploadToCloudinary(file, 'video');

         const mediaData = {
            url: response.secure_url,
            publicId: response.public_id,
            fileName: file.name,
            fileType: file.type,
            duration: response.duration,
         };

         handleLectureChange(sectionId, lectureId, { video: mediaData });
         toast.success('Video uploaded successfully');
      } catch (error) {
         toast.error('Failed to upload video');
         console.error(error);
      } finally {
         setUploadingVideo((prev) => ({ ...prev, [uploadKey]: false }));
      }
   };

   const removeVideo = (sectionId: string, lectureId: string) => {
      handleLectureChange(sectionId, lectureId, { video: null });
   };

   const addSection = () =>
      updateSections((sections) => [...sections, createSection()]);

   const removeSection = (sectionId: string) =>
      updateSections((sections) =>
         sections.length === 1
            ? sections
            : sections.filter((section) => section.clientId !== sectionId)
      );

   const addLecture = (sectionId: string) =>
      updateSections((sections) =>
         sections.map((section) =>
            section.clientId === sectionId
               ? {
                    ...section,
                    lectures: [...section.lectures, createLecture()],
                 }
               : section
         )
      );

   const removeLecture = (sectionId: string, lectureId: string) =>
      updateSections((sections) =>
         sections.map((section) =>
            section.clientId === sectionId
               ? {
                    ...section,
                    lectures:
                       section.lectures.length === 1
                          ? section.lectures
                          : section.lectures.filter(
                               (lecture) => lecture.clientId !== lectureId
                            ),
                 }
               : section
         )
      );

   const moveLecture = (
      fromSectionId: string,
      toSectionId: string,
      lectureId: string,
      toIndex: number
   ) => {
      updateSections((sections) => {
         const newSections = sections.map((s) => ({ ...s }));
         const fromSection = newSections.find(
            (s) => s.clientId === fromSectionId
         );
         const toSection = newSections.find((s) => s.clientId === toSectionId);

         if (!fromSection || !toSection) return sections;

         const lectureIndex = fromSection.lectures.findIndex(
            (l) => l.clientId === lectureId
         );
         if (lectureIndex === -1) return sections;

         const [lecture] = fromSection.lectures.splice(lectureIndex, 1);
         toSection.lectures.splice(toIndex, 0, lecture);

         return newSections;
      });
   };

   const serializeCurriculum = (sections: Section[]): CourseCurriculum => ({
      sections: sections.map((section, sectionIndex) => ({
         clientId: section.clientId,
         title: section.title,
         order: sectionIndex,
         lectures: section.lectures.map((lecture, lectureIndex) => ({
            clientId: lecture.clientId,
            title: lecture.title,
            description: lecture.description,
            notes: lecture.notes,
            video: lecture.video,
            order: lectureIndex,
         })),
      })),
   });

   const handleSave = () => {
      mutation.mutate(serializeCurriculum(curriculum.sections));
   };

   return (
      <div className="rounded-2xl border bg-card p-6 shadow-sm">
         <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
               <h2 className="text-xl font-semibold">Course Curriculum</h2>
               <p className="text-muted-foreground text-sm">
                  Structure your course into sections and lectures. Drag
                  lectures to reorder them.
               </p>
            </div>
            <Button variant="outline" onClick={addSection}>
               <Plus className="mr-2 h-4 w-4" />
               Add Section
            </Button>
         </div>

         <div className="space-y-4">
            {curriculum.sections.map((section) => (
               <div
                  key={section.clientId}
                  className="rounded-xl border bg-background p-4 shadow-sm"
               >
                  <div className="mb-4 flex items-center gap-3">
                     <Input
                        value={section.title}
                        onChange={(event) =>
                           handleSectionTitleChange(
                              section.clientId,
                              event.target.value
                           )
                        }
                        placeholder="Section title"
                     />
                     <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeSection(section.clientId)}
                        disabled={curriculum.sections.length === 1}
                     >
                        <Trash2 className="h-4 w-4" />
                     </Button>
                  </div>

                  <div className="space-y-3">
                     {section.lectures.map((lecture, lectureIndex) => {
                        const uploadKey = `${section.clientId}-${lecture.clientId}`;
                        const isExpanded = expandedLecture === lecture.clientId;

                        return (
                           <div
                              key={lecture.clientId}
                              draggable
                              onDragStart={() =>
                                 setDraggedLecture({
                                    sectionId: section.clientId,
                                    lectureId: lecture.clientId,
                                 })
                              }
                              onDragOver={(e) => e.preventDefault()}
                              onDrop={() => {
                                 if (draggedLecture) {
                                    moveLecture(
                                       draggedLecture.sectionId,
                                       section.clientId,
                                       draggedLecture.lectureId,
                                       lectureIndex
                                    );
                                    setDraggedLecture(null);
                                 }
                              }}
                              className="rounded-lg border bg-card/40 p-4 transition-all hover:bg-card/60"
                           >
                              <div className="mb-3 flex items-center gap-3">
                                 <GripVertical className="h-5 w-5 cursor-grab text-muted-foreground active:cursor-grabbing" />
                                 <Input
                                    value={lecture.title}
                                    onChange={(event) =>
                                       handleLectureChange(
                                          section.clientId,
                                          lecture.clientId,
                                          {
                                             title: event.target.value,
                                          }
                                       )
                                    }
                                    placeholder="Lecture title"
                                    className="flex-1"
                                 />
                                 <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                       setExpandedLecture(
                                          isExpanded ? null : lecture.clientId
                                       )
                                    }
                                 >
                                    {isExpanded ? '▼' : '▶'}
                                 </Button>
                                 <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                       removeLecture(
                                          section.clientId,
                                          lecture.clientId
                                       )
                                    }
                                    disabled={section.lectures.length === 1}
                                 >
                                    <Trash2 className="h-4 w-4" />
                                 </Button>
                              </div>

                              {isExpanded && (
                                 <div className="space-y-3 border-t pt-3">
                                    {/* Video Upload Section */}
                                    <div className="rounded-lg bg-muted/30 p-3">
                                       <label className="text-sm font-medium">
                                          Lecture Video
                                       </label>
                                       {lecture.video ? (
                                          <div className="relative mt-2">
                                             <video
                                                src={
                                                   typeof lecture.video ===
                                                      'object' &&
                                                   'url' in lecture.video
                                                      ? lecture.video.url
                                                      : ''
                                                }
                                                className="h-24 w-full rounded-lg object-cover"
                                                controls
                                             />
                                             <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                className="absolute right-2 top-2"
                                                onClick={() =>
                                                   removeVideo(
                                                      section.clientId,
                                                      lecture.clientId
                                                   )
                                                }
                                             >
                                                <X className="h-4 w-4" />
                                             </Button>
                                          </div>
                                       ) : (
                                          <div className="relative mt-2">
                                             <input
                                                type="file"
                                                accept="video/*"
                                                className="hidden"
                                                id={`video-upload-${uploadKey}`}
                                                onChange={(e) =>
                                                   handleVideoUpload(
                                                      section.clientId,
                                                      lecture.clientId,
                                                      e
                                                   )
                                                }
                                                disabled={
                                                   uploadingVideo[uploadKey]
                                                }
                                             />
                                             <label
                                                htmlFor={`video-upload-${uploadKey}`}
                                                className="flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed p-4 hover:bg-muted"
                                             >
                                                <div className="text-center">
                                                   <Upload className="mx-auto h-5 w-5 text-muted-foreground" />
                                                   <p className="text-xs text-muted-foreground">
                                                      {uploadingVideo[uploadKey]
                                                         ? 'Uploading...'
                                                         : 'Click to upload video'}
                                                   </p>
                                                </div>
                                             </label>
                                          </div>
                                       )}
                                    </div>

                                    {/* Description */}
                                    <div>
                                       <label className="text-sm font-medium">
                                          Description
                                       </label>
                                       <Textarea
                                          placeholder="Lecture description"
                                          className="mt-1 min-h-20"
                                          value={lecture.description}
                                          onChange={(event) =>
                                             handleLectureChange(
                                                section.clientId,
                                                lecture.clientId,
                                                {
                                                   description:
                                                      event.target.value,
                                                }
                                             )
                                          }
                                       />
                                    </div>

                                    {/* Notes */}
                                    <div>
                                       <label className="text-sm font-medium">
                                          Lecture Notes
                                       </label>
                                       <Textarea
                                          placeholder="Lecture notes"
                                          className="mt-1 min-h-20"
                                          value={lecture.notes}
                                          onChange={(event) =>
                                             handleLectureChange(
                                                section.clientId,
                                                lecture.clientId,
                                                {
                                                   notes: event.target.value,
                                                }
                                             )
                                          }
                                       />
                                    </div>
                                 </div>
                              )}
                           </div>
                        );
                     })}
                  </div>

                  <Button
                     type="button"
                     variant="secondary"
                     className="mt-4"
                     onClick={() => addLecture(section.clientId)}
                  >
                     <Plus className="mr-2 h-4 w-4" />
                     Add Lecture
                  </Button>
               </div>
            ))}
         </div>

         <div className="mt-6 flex justify-between">
            <Button variant="outline" onClick={() => setActiveStep(1)}>
               Previous
            </Button>
            <Button onClick={handleSave} disabled={mutation.isLoading}>
               {mutation.isLoading ? 'Saving...' : 'Save & Next'}
            </Button>
         </div>
      </div>
   );
}
