'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
   getInstructorCourses,
   deleteCourse,
} from '@/app/services/courseService';
import { Button } from '@/components/ui/button';
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
   DialogClose,
} from '@/components/ui/dialog';
import toast from 'react-hot-toast';
import { CourseDTO } from '@/app/services/courseService';
import { CourseCard } from '@/app/components/dashboard/instructor/CourseCard';

export default function InstructorCoursesPage() {
   const queryClient = useQueryClient();

   const { data: courses, isLoading } = useQuery({
      queryKey: ['instructorCourses'],
      queryFn: getInstructorCourses,
   });

   const deleteMutation = useMutation({
      mutationFn: deleteCourse,
      onSuccess: () => {
         console.log('✅ DELETE SUCCESS - Course deleted');
         toast.success('Course deleted successfully');
         queryClient.invalidateQueries({ queryKey: ['instructorCourses'] });
      },
      onError: (error) => {
         console.error('❌ DELETE ERROR:', error);
         toast.error(error.message || 'Failed to delete course');
      },
   });

   const handleDelete = (courseId: string) => {
      console.log('🔵 handleDelete called with courseId:', courseId);
      deleteMutation.mutate(courseId);
      console.log('🔵 deleteMutation.mutate() called');
   };

   if (isLoading) {
      return <div>Loading...</div>;
   }

   const publishedCourses = courses?.filter(
      (course: CourseDTO) => course.status === 'published'
   );
   const draftCourses = courses?.filter(
      (course: CourseDTO) => course.status === 'draft'
   );
   const inReviewCourses = courses?.filter(
      (course: CourseDTO) => course.status === 'review'
   );

   return (
      <div className="container mx-auto p-4">
         <h1 className="text-2xl font-bold mb-4">My Courses</h1>

         <div>
            <h2 className="text-xl font-semibold mb-2">Published Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {publishedCourses?.map((course: CourseDTO) => (
                  <CourseCard
                     key={course._id}
                     course={course}
                     onDelete={handleDelete}
                  />
               ))}
            </div>
            {publishedCourses?.length === 0 && (
               <p className="text-gray-500">No published courses yet.</p>
            )}
         </div>

         <div className="mt-8">
            <h2 className="text-xl font-semibold mb-2">In Review Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {inReviewCourses?.map((course: CourseDTO) => (
                  <CourseCard
                     key={course._id}
                     course={course}
                     onDelete={handleDelete}
                  />
               ))}
            </div>
            {inReviewCourses?.length === 0 && (
               <p className="text-gray-500">No courses in review.</p>
            )}
         </div>

         <div className="mt-8">
            <h2 className="text-xl font-semibold mb-2">Draft Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {draftCourses?.map((course: CourseDTO) => (
                  <CourseCard
                     key={course._id}
                     course={course}
                     onDelete={handleDelete}
                  />
               ))}
            </div>
            {draftCourses?.length === 0 && (
               <p className="text-gray-500">No draft courses.</p>
            )}
         </div>
      </div>
   );
}
