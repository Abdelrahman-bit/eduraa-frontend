'use client';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useBearStore from '@/app/store/useStore';
import { User, BookOpen, LayoutDashboard, LogOut } from 'lucide-react';

export default function ProfileDropdown() {
   const [isOpen, setIsOpen] = useState(false);
   const dropdownRef = useRef<HTMLDivElement>(null);
   const { user, logout } = useBearStore();
   const router = useRouter();

   useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
         if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target as Node)
         ) {
            setIsOpen(false);
         }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () =>
         document.removeEventListener('mousedown', handleClickOutside);
   }, []);

   const handleLogout = () => {
      logout();
      setIsOpen(false);
      router.push('/');
   };

   if (!user) return null;

   return (
      <div className="relative" ref={dropdownRef}>
         <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 focus:outline-none"
         >
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 hover:border-orange-500 transition-colors">
               <Image
                  src={user.avatar || '/avatar.jpg'}
                  alt={`${user.name} profile picture`}
                  width={40}
                  height={40}
                  className="object-cover"
               />
            </div>
         </button>

         {isOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
               <div className="px-4 py-3 border-b border-gray-200">
                  <p className="text-sm font-semibold text-gray-900">
                     {user.name}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                  <p className="text-xs text-orange-500 mt-1 capitalize">
                     {user.role}
                  </p>
               </div>

               <div className="py-1">
                  <Link
                     href="/profile"
                     className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                     onClick={() => setIsOpen(false)}
                  >
                     <User size={16} />
                     Profile
                  </Link>

                  <Link
                     href="/courses"
                     className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                     onClick={() => setIsOpen(false)}
                  >
                     <BookOpen size={16} />
                     My Courses
                  </Link>

                  {(user.role === 'instructor' || user.role === 'admin') && (
                     <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setIsOpen(false)}
                     >
                        <LayoutDashboard size={16} />
                        Dashboard
                     </Link>
                  )}
               </div>

               <div className="border-t border-gray-200 py-1">
                  <button
                     onClick={handleLogout}
                     className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                     <LogOut size={16} />
                     Logout
                  </button>
               </div>
            </div>
         )}
      </div>
   );
}
