'use client';

import { useMutation } from '@tanstack/react-query';
import { Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

import useCourseBuilderStore from '@/app/store/courseBuilderStore';
import { CourseCurriculum, Lecture, Section } from '@/app/store/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { updateCourseCurriculum } from '@/app/services/courseService';

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
                  Structure your course into sections and lectures.
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
                     {section.lectures.map((lecture) => (
                        <div
                           key={lecture.clientId}
                           className="rounded-lg border bg-card/40 p-4"
                        >
                           <div className="mb-3 flex items-center gap-3">
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
                              />
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
                           <Textarea
                              placeholder="Lecture description"
                              className="mb-3"
                              value={lecture.description}
                              onChange={(event) =>
                                 handleLectureChange(
                                    section.clientId,
                                    lecture.clientId,
                                    {
                                       description: event.target.value,
                                    }
                                 )
                              }
                           />
                           <Textarea
                              placeholder="Lecture notes"
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
                     ))}
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
            <Button onClick={handleSave} disabled={mutation.isPending}>
               {mutation.isPending ? 'Saving...' : 'Save & Next'}
            </Button>
         </div>
      </div>
   );
}
