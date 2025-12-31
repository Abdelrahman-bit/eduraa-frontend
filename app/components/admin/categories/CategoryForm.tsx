'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import {
   Category,
   CreateCategoryDto,
   createCategory,
   updateCategory,
} from '@/app/services/categories';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { renderIcon } from '@/lib/iconRenderer';

// Common category-related icons
const COMMON_ICONS = [
   'Brain',
   'Layout',
   'Database',
   'Server',
   'Globe',
   'Code',
   'BookOpen',
   'GraduationCap',
   'Cpu',
   'Cloud',
   'Folder',
   'FileText',
   'Video',
   'Music',
   'Image',
   'Palette',
   'Camera',
   'Smartphone',
   'Monitor',
   'Package',
   'Briefcase',
   'Settings',
   'Tool',
   'Rocket',
   'Zap',
];

interface CategoryFormProps {
   category?: Category | null;
   onClose: () => void;
}

export default function CategoryForm({ category, onClose }: CategoryFormProps) {
   const queryClient = useQueryClient();
   const isEdit = !!category;

   const [showIconDropdown, setShowIconDropdown] = useState(false);

   const [formData, setFormData] = useState<CreateCategoryDto>({
      name: category?.name || '',
      description: category?.description || '',
      icon: category?.icon || '',
      iconColor: category?.iconColor || '#6366f1',
      backgroundColor: category?.backgroundColor || '#eef2ff',
      order: category?.order || 0,
   });

   const [errors, setErrors] = useState<Record<string, string>>({});

   // Close dropdown when clicking outside
   useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
         const target = e.target as HTMLElement;
         if (!target.closest('.icon-dropdown-container')) {
            setShowIconDropdown(false);
         }
      };

      if (showIconDropdown) {
         document.addEventListener('mousedown', handleClickOutside);
         return () =>
            document.removeEventListener('mousedown', handleClickOutside);
      }
   }, [showIconDropdown]);

   const createMutation = useMutation({
      mutationFn: (data: CreateCategoryDto) => createCategory(data),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
         queryClient.invalidateQueries({ queryKey: ['public-categories'] });
         onClose();
      },
      onError: (error: any) => {
         if (error.response?.data?.message) {
            setErrors({ submit: error.response.data.message });
         }
      },
   });

   const updateMutation = useMutation({
      mutationFn: (data: CreateCategoryDto) =>
         updateCategory(category!._id, data),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
         queryClient.invalidateQueries({ queryKey: ['public-categories'] });
         onClose();
      },
      onError: (error: any) => {
         if (error.response?.data?.message) {
            setErrors({ submit: error.response.data.message });
         }
      },
   });

   const validate = () => {
      const newErrors: Record<string, string> = {};

      if (!formData.name || formData.name.trim().length < 2) {
         newErrors.name = 'Name must be at least 2 characters';
      }

      if (formData.description && formData.description.length > 500) {
         newErrors.description = 'Description must not exceed 500 characters';
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
   };

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!validate()) return;

      if (isEdit) {
         updateMutation.mutate(formData);
      } else {
         createMutation.mutate(formData);
      }
   };

   const isPending = createMutation.isPending || updateMutation.isPending;

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
         <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full my-8 mx-4 sm:mx-0 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
               <h2 className="text-2xl font-bold text-gray-900">
                  {isEdit ? 'Edit Category' : 'Create New Category'}
               </h2>
               <button
                  onClick={onClose}
                  disabled={isPending}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
               >
                  <X className="w-5 h-5 text-gray-500" />
               </button>
            </div>

            {/* Form - Scrollable */}
            <form
               onSubmit={handleSubmit}
               className="p-6 space-y-6 overflow-y-auto flex-1"
            >
               {/* Name */}
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                     Category Name <span className="text-red-500">*</span>
                  </label>
                  <input
                     type="text"
                     value={formData.name}
                     onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                     }
                     className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                     }`}
                     placeholder="e.g., Web Development"
                     disabled={isPending}
                  />
                  {errors.name && (
                     <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                  )}
               </div>

               {/* Description */}
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                     Description
                  </label>
                  <textarea
                     value={formData.description}
                     onChange={(e) =>
                        setFormData({
                           ...formData,
                           description: e.target.value,
                        })
                     }
                     rows={3}
                     className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none ${
                        errors.description
                           ? 'border-red-500'
                           : 'border-gray-300'
                     }`}
                     placeholder="Brief description of the category..."
                     disabled={isPending}
                  />
                  {errors.description && (
                     <p className="mt-1 text-sm text-red-500">
                        {errors.description}
                     </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                     {formData.description?.length || 0}/500 characters
                  </p>
               </div>

               {/* Icon Name with Dropdown */}
               <div className="icon-dropdown-container">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                     Icon Name (Lucide React)
                  </label>
                  <div className="relative">
                     <input
                        type="text"
                        value={formData.icon}
                        onChange={(e) => {
                           setFormData({ ...formData, icon: e.target.value });
                           setShowIconDropdown(true);
                        }}
                        onFocus={() => setShowIconDropdown(true)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                        placeholder="Search or type icon name..."
                        disabled={isPending}
                     />

                     {/* Icon Dropdown */}
                     {showIconDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                           <div className="p-2">
                              <p className="text-xs text-gray-500 mb-2 px-2">
                                 Common Icons:
                              </p>
                              <div className="grid grid-cols-2 gap-1">
                                 {COMMON_ICONS.filter((iconName) =>
                                    iconName
                                       .toLowerCase()
                                       .includes(
                                          formData.icon?.toLowerCase() || ''
                                       )
                                 ).map((iconName) => (
                                    <button
                                       key={iconName}
                                       type="button"
                                       onClick={() => {
                                          setFormData({
                                             ...formData,
                                             icon: iconName,
                                          });
                                          setShowIconDropdown(false);
                                       }}
                                       className="flex items-center gap-2 px-3 py-2 hover:bg-orange-50 rounded-lg transition-colors text-left text-sm"
                                    >
                                       {renderIcon(iconName, { size: 18 })}
                                       <span>{iconName}</span>
                                    </button>
                                 ))}
                              </div>
                              {COMMON_ICONS.filter((iconName) =>
                                 iconName
                                    .toLowerCase()
                                    .includes(
                                       formData.icon?.toLowerCase() || ''
                                    )
                              ).length === 0 && (
                                 <p className="text-sm text-gray-500 text-center py-4">
                                    No matching icons. Type a custom icon name.
                                 </p>
                              )}
                           </div>
                        </div>
                     )}
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                     Select from common icons or type any icon from{' '}
                     <a
                        href="https://lucide.dev/icons"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-500 hover:underline"
                     >
                        Lucide Icons
                     </a>
                  </p>
               </div>

               {/* Colors */}
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                        Icon Color
                     </label>
                     <div className="flex gap-2">
                        <input
                           type="color"
                           value={formData.iconColor}
                           onChange={(e) =>
                              setFormData({
                                 ...formData,
                                 iconColor: e.target.value,
                              })
                           }
                           className="w-16 h-11 rounded-lg border border-gray-300 cursor-pointer"
                           disabled={isPending}
                        />
                        <input
                           type="text"
                           value={formData.iconColor}
                           onChange={(e) =>
                              setFormData({
                                 ...formData,
                                 iconColor: e.target.value,
                              })
                           }
                           className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none font-mono text-sm"
                           placeholder="#6366f1"
                           disabled={isPending}
                        />
                     </div>
                  </div>

                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                        Background Color
                     </label>
                     <div className="flex gap-2">
                        <input
                           type="color"
                           value={formData.backgroundColor}
                           onChange={(e) =>
                              setFormData({
                                 ...formData,
                                 backgroundColor: e.target.value,
                              })
                           }
                           className="w-16 h-11 rounded-lg border border-gray-300 cursor-pointer"
                           disabled={isPending}
                        />
                        <input
                           type="text"
                           value={formData.backgroundColor}
                           onChange={(e) =>
                              setFormData({
                                 ...formData,
                                 backgroundColor: e.target.value,
                              })
                           }
                           className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none font-mono text-sm"
                           placeholder="#eef2ff"
                           disabled={isPending}
                        />
                     </div>
                  </div>
               </div>

               {/* Order */}
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                     Display Order
                  </label>
                  <input
                     type="number"
                     value={formData.order}
                     onChange={(e) =>
                        setFormData({
                           ...formData,
                           order: parseInt(e.target.value) || 0,
                        })
                     }
                     className="w-full sm:w-32 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                     min="0"
                     disabled={isPending}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                     Lower numbers appear first
                  </p>
               </div>

               {/* Error Message */}
               {errors.submit && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                     <p className="text-sm text-red-800">{errors.submit}</p>
                  </div>
               )}

               {/* Actions */}
               <div className="flex gap-3 pt-4">
                  <button
                     type="button"
                     onClick={onClose}
                     disabled={isPending}
                     className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                     Cancel
                  </button>
                  <button
                     type="submit"
                     disabled={isPending}
                     className="flex-1 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                     {isPending ? (
                        <>
                           <Loader2 className="w-5 h-5 animate-spin" />
                           {isEdit ? 'Updating...' : 'Creating...'}
                        </>
                     ) : (
                        <>
                           <Save className="w-5 h-5" />
                           {isEdit ? 'Update Category' : 'Create Category'}
                        </>
                     )}
                  </button>
               </div>
            </form>
         </div>
      </div>
   );
}
