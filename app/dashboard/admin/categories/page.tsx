'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAllCategories } from '@/app/services/categories';
import { Plus, Search, Loader2 } from 'lucide-react';
import CategoryCard from '../../../components/admin/categories/CategoryCard';
import CategoryForm from '../../../components/admin/categories/CategoryForm';

export default function CategoriesPage() {
   const [searchTerm, setSearchTerm] = useState('');
   const [showForm, setShowForm] = useState(false);
   const [editingCategory, setEditingCategory] = useState<any>(null);

   const {
      data: categories,
      isLoading,
      isError,
   } = useQuery({
      queryKey: ['admin-categories'],
      queryFn: fetchAllCategories,
   });

   const filteredCategories = categories?.filter((cat) =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase())
   );

   const handleEdit = (category: any) => {
      setEditingCategory(category);
      setShowForm(true);
   };

   const handleCloseForm = () => {
      setShowForm(false);
      setEditingCategory(null);
   };

   return (
      <div className="p-4 sm:p-6 lg:p-8">
         {/* Header */}
         <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
               Categories Management
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
               Manage course categories for your platform
            </p>
         </div>

         {/* Actions Bar */}
         <div className="mb-6 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
               <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
               />
            </div>

            {/* Create Button */}
            <button
               onClick={() => setShowForm(true)}
               className="flex items-center justify-center gap-2 px-6 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
            >
               <Plus className="w-5 h-5" />
               <span>Add Category</span>
            </button>
         </div>

         {/* Loading State */}
         {isLoading && (
            <div className="flex justify-center items-center py-20">
               <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
         )}

         {/* Error State */}
         {isError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
               Error loading categories. Please try again.
            </div>
         )}

         {/* Categories Grid */}
         {!isLoading && !isError && (
            <>
               {filteredCategories && filteredCategories.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                     {filteredCategories.map((category) => (
                        <CategoryCard
                           key={category._id}
                           category={category}
                           onEdit={handleEdit}
                        />
                     ))}
                  </div>
               ) : (
                  <div className="text-center py-20">
                     <p className="text-gray-500 text-lg">
                        {searchTerm
                           ? 'No categories found matching your search.'
                           : 'No categories yet. Create your first category!'}
                     </p>
                  </div>
               )}
            </>
         )}

         {/* Category Form Modal */}
         {showForm && (
            <CategoryForm
               category={editingCategory}
               onClose={handleCloseForm}
            />
         )}
      </div>
   );
}
