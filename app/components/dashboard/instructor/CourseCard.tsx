'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, User, MoreHorizontal, Trash2 } from 'lucide-react';
import { CourseDTO } from '@/app/services/courseService';
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface CourseCardProps {
   course: CourseDTO;
   onDelete?: (courseId: string) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onDelete }) => {
   const [isMenuOpen, setIsMenuOpen] = useState(false);
   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
   const menuRef = useRef<HTMLDivElement>(null);

   // Close menu when clicking outside
   useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
         if (
            menuRef.current &&
            !menuRef.current.contains(event.target as Node)
         ) {
            setIsMenuOpen(false);
         }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
         document.removeEventListener('mousedown', handleClickOutside);
   }, []);

   const imageUrl =
      course.advancedInfo?.thumbnailUrl ||
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';

   const handleDeleteClick = () => {
      // Close menu and open dialog
      setIsMenuOpen(false);
      setIsDeleteDialogOpen(true);
   };

   const handleConfirmDelete = () => {
      if (onDelete) {
         onDelete(course._id);
      }
      setIsDeleteDialogOpen(false);
   };

   return (
      <>
         <div className="bg-white border border-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 relative group">
            {/* Course Image */}
            <div className="relative h-48 w-full bg-gray-200">
               <Image
                  src={imageUrl}
                  alt={course.basicInfo?.title || 'Course'}
                  fill
                  className="object-cover"
               />
               <span className="absolute top-3 left-3 bg-indigo-100 text-indigo-600 text-xs font-semibold px-2 py-1 rounded-sm uppercase tracking-wide">
                  {course.basicInfo?.category}
               </span>
            </div>

            {/* Card Content */}
            <div className="p-4">
               {/* Title */}
               <h3 className="text-gray-900 font-bold text-base mb-2 line-clamp-2 min-h-[3rem]">
                  {course.basicInfo?.title}
               </h3>

               {/* Rating & Students */}
               <div className="flex justify-between items-center mb-3 text-sm">
                  <div className="flex items-center gap-1 text-orange-500 font-semibold">
                     <Star size={16} fill="currentColor" />
                     <span>0.0</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500">
                     <User size={16} />
                     <span>{course.students || 0} students</span>
                  </div>
               </div>

               <div className="border-t border-gray-100 pt-3 flex justify-between items-center relative">
                  {/* Status Badge */}
                  <div>
                     <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full uppercase ${
                           course.status === 'published'
                              ? 'bg-green-100 text-green-700'
                              : course.status === 'draft'
                                ? 'bg-gray-100 text-gray-700'
                                : 'bg-yellow-100 text-yellow-700'
                        }`}
                     >
                        {course.status}
                     </span>
                  </div>

                  {/* Action Menu (3 Dots) */}
                  <div className="relative" ref={menuRef}>
                     <button
                        type="button"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className={`p-1 rounded hover:bg-gray-100 transition-colors ${isMenuOpen ? 'bg-gray-100' : ''}`}
                     >
                        <MoreHorizontal size={20} className="text-gray-500" />
                     </button>

                     {/* Dropdown Menu */}
                     {isMenuOpen && (
                        <div className="absolute right-0 bottom-full mb-2 w-48 bg-white shadow-xl rounded-md border border-gray-100 z-50 overflow-hidden flex flex-col">
                           <Link
                              href={`/dashboard/instructor/courses/${course._id}`}
                              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left transition-colors"
                           >
                              View Details
                           </Link>
                           <Link
                              href={`/dashboard/instructor/create-course?id=${course._id}`}
                              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left transition-colors"
                           >
                              Edit Course
                           </Link>
                           {onDelete && (
                              <button
                                 type="button"
                                 onClick={handleDeleteClick}
                                 className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left transition-colors flex items-center"
                              >
                                 <Trash2 size={14} className="mr-2" /> Delete
                              </button>
                           )}
                        </div>
                     )}
                  </div>
               </div>
            </div>
         </div>

         {/* Delete Confirmation Dialog - OUTSIDE the card */}
         <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogContent>
               <DialogHeader>
                  <DialogTitle>Delete Course</DialogTitle>
                  <DialogDescription>
                     Are you sure you want to delete "{course.basicInfo?.title}
                     "? This action cannot be undone.
                  </DialogDescription>
               </DialogHeader>
               <DialogFooter>
                  <Button
                     type="button"
                     variant="ghost"
                     onClick={() => setIsDeleteDialogOpen(false)}
                  >
                     Cancel
                  </Button>
                  <Button
                     type="button"
                     variant="destructive"
                     onClick={handleConfirmDelete}
                  >
                     Delete
                  </Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>
      </>
   );
};
