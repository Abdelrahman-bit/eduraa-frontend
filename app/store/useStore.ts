import { create } from 'zustand';
import { BearStore, User } from './types';

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
   logout: () => set({ user: null, isAuthenticated: false }),
}));

export default useBearStore;
