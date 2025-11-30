'use client';

import { CourseDTO } from '@/app/services/courseService';
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
import { Trash2 } from 'lucide-react';
import Link from 'next/link';

interface CourseCardProps {
   course: CourseDTO;
   onDelete: (courseId: string) => void;
}

export function CourseCard({ course, onDelete }: CourseCardProps) {
   return (
      <div key={course._id} className="border rounded-lg p-4 shadow-sm">
         <h2 className="text-xl font-semibold">{course.basicInfo.title}</h2>
         <p className="text-gray-500">{course.basicInfo.subtitle}</p>
         <div className="mt-4 flex justify-end gap-2">
            {course.status === 'draft' && (
               <Link
                  href={`/dashboard/instructor/create-course?id=${course._id}`}
               >
                  <Button variant="outline" size="sm">
                     Continue Editing
                  </Button>
               </Link>
            )}
            <Dialog>
               <DialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                     <Trash2 className="mr-2 h-4 w-4" />
                     Delete
                  </Button>
               </DialogTrigger>
               <DialogContent>
                  <DialogHeader>
                     <DialogTitle>Are you sure?</DialogTitle>
                     <DialogDescription>
                        This action cannot be undone. This will permanently
                        delete the course and all its resources.
                     </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                     <DialogClose asChild>
                        <Button variant="ghost">Cancel</Button>
                     </DialogClose>
                     <Button
                        variant="destructive"
                        onClick={() => onDelete(course._id)}
                     >
                        Delete
                     </Button>
                  </DialogFooter>
               </DialogContent>
            </Dialog>
         </div>
      </div>
   );
}
