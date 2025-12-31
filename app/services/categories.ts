import { apiClient } from '@/lib/http';

export interface Category {
   _id: string;
   name: string;
   slug: string;
   description?: string;
   icon: string;
   iconColor: string;
   backgroundColor: string;
   courseCount: number;
   isActive: boolean;
   order: number;
   createdAt: string;
   updatedAt: string;
}

export interface CreateCategoryDto {
   name: string;
   description?: string;
   icon?: string;
   iconColor?: string;
   backgroundColor?: string;
   order?: number;
}

export interface UpdateCategoryDto extends Partial<CreateCategoryDto> {}

// Public API calls
export const fetchCategories = async (): Promise<Category[]> => {
   const response = await apiClient.get('/categories');
   return response.data.data;
};

export const fetchCategoryBySlug = async (slug: string): Promise<Category> => {
   const response = await apiClient.get(`/categories/${slug}`);
   return response.data.data;
};

// Admin API calls
export const fetchAllCategories = async (): Promise<Category[]> => {
   const response = await apiClient.get('/categories/admin/all');
   return response.data.data;
};

export const createCategory = async (
   data: CreateCategoryDto
): Promise<Category> => {
   const response = await apiClient.post('/categories/admin/create', data);
   return response.data.data;
};

export const updateCategory = async (
   id: string,
   data: UpdateCategoryDto
): Promise<Category> => {
   const response = await apiClient.put(`/categories/admin/${id}`, data);
   return response.data.data;
};

export const deleteCategory = async (id: string): Promise<void> => {
   await apiClient.delete(`/categories/admin/${id}`);
};

export const toggleCategoryStatus = async (id: string): Promise<Category> => {
   const response = await apiClient.patch(`/categories/admin/${id}/toggle`);
   return response.data.data;
};

export const reorderCategories = async (
   categoryOrders: { id: string; order: number }[]
): Promise<void> => {
   await apiClient.patch('/categories/admin/reorder', { categoryOrders });
};
