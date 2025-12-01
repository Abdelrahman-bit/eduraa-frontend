'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
   getInReviewCourses,
   updateCourseStatus,
} from '@/app/services/adminService';
import { Button } from '@/components/ui/button';
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'react-hot-toast';
import { CourseDTO } from '@/app/services/courseService';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const CourseRequestsList = () => {
   const queryClient = useQueryClient();
   const [selectedCourse, setSelectedCourse] = useState<CourseDTO | null>(null);
   const router = useRouter();

   const { data: courses, isLoading } = useQuery({
      queryKey: ['inReviewCourses'],
      queryFn: getInReviewCourses,
   });

   const mutation = useMutation({
      mutationFn: ({
         courseId,
         status,
      }: {
         courseId: string;
         status: 'published' | 'rejected';
      }) => updateCourseStatus(courseId, status),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['inReviewCourses'] });
         toast.success('Course status updated successfully');
         setSelectedCourse(null);
      },
      onError: () => {
         toast.error('Failed to update course status');
      },
   });

   const handleApprove = (courseId: string) => {
      mutation.mutate({ courseId, status: 'published' });
   };

   const handleReject = (courseId: string) => {
      mutation.mutate({ courseId, status: 'rejected' });
   };

   const handleViewContent = (courseId: string) => {
      router.push(`/dashboard/admin/courses/${courseId}`);
   };

   if (isLoading) {
      return <div>Loading...</div>;
   }

   return (
      <div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses?.map((course) => (
               <div key={course._id} className="border p-4 rounded-lg">
                  {course.advancedInfo?.thumbnail?.url && (
                     <Image
                        src={course.advancedInfo.thumbnail.url}
                        alt={course.basicInfo.title}
                        width={300}
                        height={200}
                        className="rounded-lg object-cover mb-4"
                     />
                  )}
                  <h2 className="text-xl font-bold">
                     {course.basicInfo.title}
                  </h2>
                  <p>Instructor: {course.instructor.name}</p>
                  <Button
                     variant="outline"
                     onClick={() => setSelectedCourse(course)}
                  >
                     View Details
                  </Button>
               </div>
            ))}
         </div>
         {selectedCourse && (
            <Dialog
               open={!!selectedCourse}
               onOpenChange={() => setSelectedCourse(null)}
            >
               <DialogContent className="max-w-4xl">
                  <DialogHeader>
                     <DialogTitle>{selectedCourse.basicInfo.title}</DialogTitle>
                     <DialogDescription>
                        Instructor: {selectedCourse.instructor.name}
                     </DialogDescription>
                  </DialogHeader>
                  <div className="max-h-[60vh] overflow-y-auto p-4">
                     {selectedCourse.advancedInfo?.thumbnail?.url && (
                        <Image
                           src={selectedCourse.advancedInfo.thumbnail.url}
                           alt={selectedCourse.basicInfo.title}
                           width={400}
                           height={250}
                           className="rounded-lg object-cover mb-4"
                        />
                     )}
                     <h3 className="font-bold">Description</h3>
                     <p>{selectedCourse.advancedInfo.description}</p>
                     <h3 className="font-bold mt-4">What you will learn</h3>
                     <ul>
                        {selectedCourse.advancedInfo.whatYouWillLearn.map(
                           (item, index) => (
                              <li key={index}>- {item}</li>
                           )
                        )}
                     </ul>
                     <h3 className="font-bold mt-4">Curriculum</h3>
                     {selectedCourse.curriculum.sections.map((section) => (
                        <div key={section.clientId} className="mt-2">
                           <h4 className="font-semibold">{section.title}</h4>
                           <ul>
                              {section.lectures.map((lecture) => (
                                 <li key={lecture.clientId} className="ml-4">
                                    - {lecture.title}
                                 </li>
                              ))}
                           </ul>
                        </div>
                     ))}
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                     <Button
                        variant="outline"
                        onClick={() => handleViewContent(selectedCourse._id)}
                     >
                        View Content
                     </Button>
                     <Button
                        variant="destructive"
                        onClick={() => handleReject(selectedCourse._id)}
                     >
                        Reject
                     </Button>
                     <Button onClick={() => handleApprove(selectedCourse._id)}>
                        Approve
                     </Button>
                  </div>
               </DialogContent>
            </Dialog>
         )}
      </div>
   );
};

export default CourseRequestsList;
