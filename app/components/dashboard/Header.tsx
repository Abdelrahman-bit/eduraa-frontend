// components/dashboard/Header.tsx
import { Bell, Search } from 'lucide-react';

export default function Header() {
   return (
      <header className="h-20 bg-white border-b border-gray-100 px-8 flex items-center justify-between sticky top-0 z-40">
         <div>
            <p className="text-xs text-gray-500 mb-1">Good Morning</p>
            <h2 className="text-xl font-bold text-gray-800">
               Create a new course
            </h2>
         </div>

         <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
               <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
               />
               <input
                  type="text"
                  placeholder="Search"
                  className="pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none w-64"
               />
            </div>

            <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full">
               <Bell size={20} />
               <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full border border-white"></span>
            </button>

            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold cursor-pointer">
               U{/* if not image render U */}
            </div>
         </div>
      </header>
   );
}
