'use client';

import React, { useState } from 'react';
import { Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import { renderIcon } from '@/lib/iconRenderer';
import {
   Category,
   deleteCategory,
   toggleCategoryStatus,
} from '@/app/services/categories';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import DeleteDialog from './DeleteDialog';

interface CategoryCardProps {
   category: Category;
   onEdit: (category: Category) => void;
}

export default function CategoryCard({ category, onEdit }: CategoryCardProps) {
   const [showDeleteDialog, setShowDeleteDialog] = useState(false);
   const queryClient = useQueryClient();

   const deleteMutation = useMutation({
      mutationFn: () => deleteCategory(category._id),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
         setShowDeleteDialog(false);
      },
   });

   const toggleMutation = useMutation({
      mutationFn: () => toggleCategoryStatus(category._id),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      },
   });

   return (
      <>
         <div
            className="group relative bg-white rounded-xl border-2 border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all duration-300 overflow-hidden"
            style={{
               backgroundColor: category.isActive
                  ? category.backgroundColor
                  : '#f3f4f6',
            }}
         >
            {/* Status Badge */}
            {!category.isActive && (
               <div className="absolute top-3 right-3 z-10">
                  <span className="px-2 py-1 bg-gray-600 text-white text-xs font-medium rounded-full">
                     Inactive
                  </span>
               </div>
            )}

            {/* Main Content */}
            <div className="p-4 sm:p-6">
               {/* Icon & Name */}
               <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div
                     className="shrink-0 p-2 sm:p-3 bg-white rounded-lg shadow-sm"
                     style={{ color: category.iconColor }}
                  >
                     {renderIcon(category.icon, {
                        size: 24,
                        className: 'sm:w-7 sm:h-7',
                     })}
                  </div>
                  <div className="flex-1 min-w-0">
                     <h3 className="text-base sm:text-lg font-bold text-gray-900 truncate">
                        {category.name}
                     </h3>
                     <p className="text-xs sm:text-sm text-gray-600">
                        {category.courseCount}{' '}
                        {category.courseCount === 1 ? 'Course' : 'Courses'}
                     </p>
                  </div>
               </div>

               {/* Description */}
               {category.description && (
                  <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mb-3 sm:mb-4">
                     {category.description}
                  </p>
               )}

               {/* Metadata */}
               <div className="flex items-center justify-between text-xs text-gray-500 mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-gray-200">
                  <span className="truncate mr-2">Slug: {category.slug}</span>
                  <span className="shrink-0">Order: {category.order}</span>
               </div>

               {/* Actions */}
               <div className="grid grid-cols-3 gap-2">
                  <button
                     onClick={() => toggleMutation.mutate()}
                     disabled={toggleMutation.isPending}
                     className="flex flex-col sm:flex-row items-center justify-center gap-1 px-2 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-xs font-medium disabled:opacity-50"
                     title={category.isActive ? 'Deactivate' : 'Activate'}
                  >
                     {category.isActive ? (
                        <>
                           <EyeOff className="w-4 h-4" />
                           <span>Hide</span>
                        </>
                     ) : (
                        <>
                           <Eye className="w-4 h-4" />
                           <span>Show</span>
                        </>
                     )}
                  </button>

                  <button
                     onClick={() => onEdit(category)}
                     className="flex flex-col sm:flex-row items-center justify-center gap-1 px-2 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors text-xs font-medium"
                  >
                     <Edit2 className="w-4 h-4" />
                     <span>Edit</span>
                  </button>

                  <button
                     onClick={() => setShowDeleteDialog(true)}
                     className="flex flex-col sm:flex-row items-center justify-center gap-1 px-2 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-xs font-medium"
                  >
                     <Trash2 className="w-4 h-4" />
                     <span>Delete</span>
                  </button>
               </div>
            </div>
         </div>

         {/* Delete Confirmation Dialog */}
         {showDeleteDialog && (
            <DeleteDialog
               category={category}
               onClose={() => setShowDeleteDialog(false)}
               onConfirm={() => deleteMutation.mutate()}
               isDeleting={deleteMutation.isPending}
            />
         )}
      </>
   );
}
