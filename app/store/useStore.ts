import { create } from 'zustand';
import { BearStore, User } from './types';
import { jwtDecode } from 'jwt-decode';

// Use the BearStore type to enforce correct state and actions
const useBearStore = create<BearStore>((set) => ({
   // --- STATE INITIALIZATION ---
   count: 0,
   user: null,
   isAuthenticated: false,

   // --- ACTIONS ---
   increment: (by: number) => set((state) => ({ count: state.count + by })),
   decrement: () => set((state) => ({ count: state.count - 1 })),
   login: (userData: User) => set({ user: userData, isAuthenticated: true }),
   logout: () => {
      if (typeof window !== 'undefined') {
         localStorage.removeItem('token');
      }
      set({ user: null, isAuthenticated: false });
   },
   initializeAuth: () => {
      if (typeof window !== 'undefined') {
         const token = localStorage.getItem('token');
         if (token) {
            try {
               const decoded = jwtDecode<User>(token);
               set({ user: decoded, isAuthenticated: true });
            } catch (error) {
               console.error('Invalid token:', error);
               localStorage.removeItem('token');
               set({ user: null, isAuthenticated: false });
            }
         }
      }
   },
}));

export default useBearStore;
