import { create } from 'zustand';
import { BearStore, User } from './types';
import { jwtDecode } from 'jwt-decode';
import { getUserProfile } from '@/app/services/userService';
import { apiClient } from '@/lib/http';

// Use the BearStore type to enforce correct state and actions
const useBearStore = create<BearStore>((set, get) => ({
   // --- STATE INITIALIZATION ---
   user: null,
   isAuthenticated: false,
   loading: true,
   wishlist: [],
   enrolledCourseIds: [],

   // --- ACTIONS ---
   fetchEnrolledCourses: async () => {
      const { isAuthenticated, user } = get();
      if (!isAuthenticated || user?.role !== 'student') return;

      try {
         const { data } = await apiClient.get('/student/my-courses');
         if (data.status === 'success') {
            const courseIds = data.studentCourses.map(
               (enrollment: any) => enrollment.course?._id || enrollment.course
            );
            set({ enrolledCourseIds: courseIds });
         }
      } catch (error) {
         console.error('Store: Failed to fetch enrolled courses', error);
      }
   },

   isCourseEnrolled: (courseId: string) => {
      const { enrolledCourseIds } = get();
      return enrolledCourseIds.includes(courseId);
   },

   login: (userData: User) =>
      set({ user: userData, isAuthenticated: true, loading: false }),

   logout: () => {
      if (typeof window !== 'undefined') {
         localStorage.removeItem('token');
         localStorage.removeItem('user');
      }
      set({
         user: null,
         isAuthenticated: false,
         loading: false,
         wishlist: [],
         enrolledCourseIds: [],
      });
   },

   fetchWishlist: async () => {
      const { isAuthenticated, user } = get();
      if (!isAuthenticated || user?.role !== 'student') return;

      try {
         const { data } = await apiClient.get('/student/wishlist');
         if (data.status === 'success') {
            const courses = data.data.map((item: any) => ({
               ...item.course,
               id: item.course._id,
            }));
            set({ wishlist: courses });
         }
      } catch (error) {
         console.error('Store: Failed to fetch wishlist', error);
      }
   },

   addToWishlist: async (courseId: string) => {
      const { isAuthenticated, wishlist, user } = get();
      if (!isAuthenticated || user?.role !== 'student') return;

      // Optimistic update: Add placeholder or rely on UI to toggle immediately
      // Ideally we need course details to add to wishlist state instantly.
      // For now, we persist the "added" state via UI button, but let's try to be consistent.

      try {
         const { data } = await apiClient.post('/student/wishlist', {
            courseId,
         });

         if (data.status === 'success') {
            get().fetchWishlist(); // Refresh list to get full details
         }
      } catch (error) {
         console.error('Store: Failed to add to wishlist', error);
      }
   },

   removeFromWishlist: async (courseId: string) => {
      const { isAuthenticated, wishlist, user } = get();
      if (!isAuthenticated || user?.role !== 'student') return;

      // Optimistic update
      set({
         wishlist: wishlist.filter(
            (c) => c.id !== courseId && c._id !== courseId
         ),
      });

      try {
         await apiClient.delete(`/student/wishlist/${courseId}`);
      } catch (error) {
         console.error('Store: Failed to remove from wishlist', error);
         get().fetchWishlist(); // Revert on failure
      }
   },

   isCourseInWishlist: (courseId: string) => {
      const { wishlist } = get();
      return wishlist.some((c) => c.id === courseId || c._id === courseId);
   },

   initializeAuth: async () => {
      if (typeof window !== 'undefined') {
         const token = localStorage.getItem('token');
         const userStr = localStorage.getItem('user');

         if (token) {
            try {
               const decoded = jwtDecode<{ exp?: number; role?: string }>(
                  token
               );
               const currentTime = Date.now() / 1000;

               if (decoded.exp && decoded.exp > currentTime) {
                  if (userStr && userStr !== 'undefined') {
                     try {
                        const user = JSON.parse(userStr);
                        set({ user, isAuthenticated: true, loading: false });
                        if (user.role === 'student') {
                           get().fetchWishlist();
                           get().fetchEnrolledCourses();
                        }
                     } catch (e) {
                        console.error('Store: Error parsing user', e);
                        const user = await getUserProfile();
                        localStorage.setItem('user', JSON.stringify(user));
                        set({ user, isAuthenticated: true, loading: false });
                        if (user.role === 'student') {
                           get().fetchWishlist();
                           get().fetchEnrolledCourses();
                        }
                     }
                  } else {
                     try {
                        const user = await getUserProfile();
                        localStorage.setItem('user', JSON.stringify(user));
                        set({ user, isAuthenticated: true, loading: false });
                        if (user.role === 'student') {
                           get().fetchWishlist();
                           get().fetchEnrolledCourses();
                        }
                     } catch (fetchError) {
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        set({
                           user: null,
                           isAuthenticated: false,
                           loading: false,
                        });
                     }
                  }
               } else {
                  console.log('Store: Token expired');
                  localStorage.removeItem('token');
                  localStorage.removeItem('user');
                  set({ user: null, isAuthenticated: false, loading: false });
               }
            } catch (error) {
               console.error('Store: Invalid token:', error);
               localStorage.removeItem('token');
               localStorage.removeItem('user');
               set({ user: null, isAuthenticated: false, loading: false });
            }
         } else {
            set({ user: null, isAuthenticated: false, loading: false });
         }
      } else {
         set({ loading: false });
      }
   },
}));

export default useBearStore;
