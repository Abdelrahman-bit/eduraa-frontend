import { apiClient } from '@/lib/http';

export const applyForJob = async (values: {
   name: string;
   email: string;
   phone: string;
}) => {
   try {
      return await apiClient.post('/instructor/applicationRequest', values);
   } catch (error) {
      throw error;
   }
};
