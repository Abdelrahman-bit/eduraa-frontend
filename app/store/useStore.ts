import { create } from 'zustand';
import { BearStore, User } from './types';
import { jwtDecode } from 'jwt-decode';

// Use the BearStore type to enforce correct state and actions
const useBearStore = create<BearStore>((set) => ({
   // --- STATE INITIALIZATION ---
   count: 0,
   user: null,
   isAuthenticated: false,
   loading: true,

   // --- ACTIONS ---
   increment: (by: number) => set((state) => ({ count: state.count + by })),
   decrement: () => set((state) => ({ count: state.count - 1 })),
   login: (userData: User) =>
      set({ user: userData, isAuthenticated: true, loading: false }),
   logout: () => {
      if (typeof window !== 'undefined') {
         localStorage.removeItem('token');
         localStorage.removeItem('user');
      }
      set({ user: null, isAuthenticated: false, loading: false });
   },
   initializeAuth: () => {
      if (typeof window !== 'undefined') {
         const token = localStorage.getItem('token');
         const userStr = localStorage.getItem('user');

         if (token && userStr && userStr !== 'undefined') {
            try {
               const user = JSON.parse(userStr);
               // Verify token is still valid
               const decoded = jwtDecode<{ exp?: number; role?: string }>(
                  token
               );
               const currentTime = Date.now() / 1000;

               if (decoded.exp && decoded.exp > currentTime) {
                  set({ user, isAuthenticated: true, loading: false });
               } else {
                  // Token expired
                  localStorage.removeItem('token');
                  localStorage.removeItem('user');
                  set({ user: null, isAuthenticated: false, loading: false });
               }
            } catch (error) {
               console.error('Invalid token:', error);
               localStorage.removeItem('token');
               localStorage.removeItem('user');
               set({ user: null, isAuthenticated: false, loading: false });
            }
         } else {
            set({ loading: false });
         }
      }
   },
}));

export default useBearStore;
