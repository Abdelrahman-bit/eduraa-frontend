'use client';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useBearStore from '@/app/store/useStore';
import {
   User,
   BookOpen,
   LayoutDashboard,
   LogOut,
   LucideIcon,
} from 'lucide-react';
import { getUserProfile } from '@/app/services/userService';

interface MenuItem {
   href: string;
   icon: LucideIcon;
   label: string;
}

export default function ProfileDropdown() {
   const [isOpen, setIsOpen] = useState(false);
   const [userData, setUserData] = useState<any>(null);
   const [isLoadingData, setIsLoadingData] = useState(true);
   const dropdownRef = useRef<HTMLDivElement>(null);
   const { user, logout } = useBearStore();
   const router = useRouter();

   useEffect(() => {
      fetchProfile();
   }, []);
   const fetchProfile = async () => {
      try {
         const user = await getUserProfile();
         setUserData(user);
      } catch (error) {
         console.error('Failed to fetch profile:', error);
      } finally {
         setIsLoadingData(false);
      }
   };

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

   const getMenuItems = (): MenuItem[] => {
      if (!user) return [];

      const isPrivileged = user.role === 'instructor' || user.role === 'admin';
      const basePath =
         user.role === 'admin' ? '/dashboard/admin' : '/dashboard/instructor';

      if (isPrivileged) {
         return [
            { href: `${basePath}/settings`, icon: User, label: 'Settings' },
            {
               href: `${basePath}/courses`,
               icon: BookOpen,
               label: 'My Courses',
            },
            { href: basePath, icon: LayoutDashboard, label: 'Dashboard' },
         ];
      }

      // Student menu items
      return [
         { href: '/student/courses', icon: BookOpen, label: 'My Courses' },
         {
            href: '/student/dashboard',
            icon: LayoutDashboard,
            label: 'Dashboard',
         },
      ];
   };

   if (!user) return null;

   const menuItems = getMenuItems();

   return (
      <div className="relative" ref={dropdownRef}>
         <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 focus:outline-none cursor-pointer"
         >
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 hover:border-orange-500 transition-colors">
               <Image
                  src={userData?.avatar || '/avatar.png'}
                  alt={`${userData?.name} profile picture`}
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
               />
            </div>
         </button>

         {isOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
               <div className="px-4 py-3 border-b border-gray-200">
                  <p className="text-sm font-semibold text-gray-900">
                     {user.name ||
                        `${(user as any).firstName || ''} ${(user as any).lastName || ''}`.trim() ||
                        'User'}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                  <p className="text-xs text-orange-500 mt-1 capitalize">
                     {user.role}
                  </p>
               </div>

               <div className="py-1">
                  {menuItems.map((item) => (
                     <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setIsOpen(false)}
                     >
                        <item.icon size={16} />
                        {item.label}
                     </Link>
                  ))}
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
