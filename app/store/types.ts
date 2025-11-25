// store/types.ts

// 1. Define the shape of your state
export interface User {
   id: number;
   name: string;
}

export interface BearState {
   count: number;
   user: User | null;
   isAuthenticated: boolean;
}

// 2. Define the shape of your actions (functions)
export interface BearActions {
   increment: (by: number) => void;
   decrement: () => void;
   login: (userData: User) => void;
   logout: () => void;
}

// 3. Combine State and Actions for the final store signature
export type BearStore = BearState & BearActions;
