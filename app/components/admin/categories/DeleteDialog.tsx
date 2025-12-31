'use client';

import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { Category } from '@/app/services/categories';

interface DeleteDialogProps {
   category: Category;
   onClose: () => void;
   onConfirm: () => void;
   isDeleting: boolean;
}

export default function DeleteDialog({
   category,
   onClose,
   onConfirm,
   isDeleting,
}: DeleteDialogProps) {
   const hasCourses = category.courseCount > 0;

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
         <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 sm:mx-0 animate-fadeIn">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                     <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                     Delete Category
                  </h2>
               </div>
               <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
               >
                  <X className="w-5 h-5 text-gray-500" />
               </button>
            </div>

            {/* Content */}
            <div className="p-6">
               {hasCourses ? (
                  /* Cannot Delete - Has Courses */
                  <div className="space-y-4">
                     <p className="text-gray-700">
                        Cannot delete{' '}
                        <span className="font-bold">{category.name}</span>{' '}
                        category because it has{' '}
                        <span className="font-bold text-orange-600">
                           {category.courseCount} active{' '}
                           {category.courseCount === 1 ? 'course' : 'courses'}
                        </span>
                        .
                     </p>
                     <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                        <p className="text-sm text-orange-800">
                           <strong>Suggestion:</strong> Reassign or delete all
                           courses in this category first, then try again.
                        </p>
                     </div>
                  </div>
               ) : (
                  /* Can Delete - No Courses */
                  <div className="space-y-4">
                     <p className="text-gray-700">
                        Are you sure you want to delete the{' '}
                        <span className="font-bold">{category.name}</span>{' '}
                        category?
                     </p>
                     <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-sm text-red-800">
                           <strong>Warning:</strong> This action cannot be
                           undone.
                        </p>
                     </div>
                  </div>
               )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 p-6 border-t border-gray-200">
               <button
                  onClick={onClose}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors disabled:opacity-50"
               >
                  {hasCourses ? 'Close' : 'Cancel'}
               </button>
               {!hasCourses && (
                  <button
                     onClick={onConfirm}
                     disabled={isDeleting}
                     className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                     {isDeleting ? (
                        <>
                           <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                           Deleting...
                        </>
                     ) : (
                        'Delete Category'
                     )}
                  </button>
               )}
            </div>
         </div>
      </div>
   );
}
