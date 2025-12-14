'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { Menu, X } from 'lucide-react';
import Button from '../Button/Button';
import ProfileDropdown from '../ProfileDropdown/ProfileDropdown';
import useBearStore from '@/app/store/useStore';
import { NotificationDropdown } from '@/app/components/notifications/NotificationDropdown';
import { useNotifications } from '@/app/hooks/useNotifications';
import { AblyProvider, useAblyContext } from '@/app/providers/AblyProvider';
import { useRouter, usePathname } from 'next/navigation';

import { IoMdHeartEmpty } from 'react-icons/io';

/**
 * Inner Navbar component with notification integration
 */
function NavbarInner() {
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
   const [isHydrated, setIsHydrated] = useState(false);
   const router = useRouter();
   const pathname = usePathname();
   const { user, isAuthenticated, loading, initializeAuth, wishlist } =
      useBearStore();

   // Use notifications hook for authenticated users
   const {
      notifications,
      unreadCount,
      isLoading: notificationsLoading,
      markAsRead,
      markAllAsRead,
   } = useNotifications({ autoRequestPermission: true });

   // Handle hydration mismatch
   useEffect(() => {
      const timer = setTimeout(() => {
         setIsHydrated(true);
      }, 0);
      return () => clearTimeout(timer);
   }, []);

   // Initialize auth
   useEffect(() => {
      initializeAuth();
   }, [initializeAuth]);

   // Search state
   const [searchQuery, setSearchQuery] = useState('');

   const handleSearch = () => {
      if (!searchQuery.trim()) return;
      router.push(`/all-courses?search=${encodeURIComponent(searchQuery)}`);
   };

   // Handle key press for search
   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
         handleSearch();
      }
   };

   const handleNotificationClick = (notification: any) => {
      if (notification.relatedGroup) {
         // Navigate to correct chat page based on user role
         if (user?.role === 'instructor') {
            router.push(
               `/dashboard/instructor/messages?group=${notification.relatedGroup}`
            );
         } else {
            router.push(
               `/student/studentMsgs?group=${notification.relatedGroup}`
            );
         }
      }
   };

   return (
      <>
         {/* Secondary NavBar  */}
         <nav className="hidden md:flex justify-between bg-gray-scale-900 text-gray-scale-500 px-6 text-body-md font-medium">
            <ul className="flex gap-8 p-4">
               <li>
                  <Link
                     href="/"
                     className={pathname === '/' ? 'text-orange-500' : ''}
                  >
                     Home
                  </Link>
               </li>
               <li>
                  <Link
                     href="/all-courses"
                     className={
                        pathname === '/all-courses' ? 'text-orange-500' : ''
                     }
                  >
                     Courses
                  </Link>
               </li>
               <li>
                  <Link
                     href="/about"
                     className={pathname === '/about' ? 'text-orange-500' : ''}
                  >
                     About
                  </Link>
               </li>
               <li>
                  <Link
                     href="/contact"
                     className={
                        pathname === '/contact' ? 'text-orange-500' : ''
                     }
                  >
                     Contact
                  </Link>
               </li>
            </ul>
         </nav>

         {/* Main NavBar  */}
         <nav className="relative z-[100] flex justify-between items-center px-4 md:px-8 py-4 border-b-2 border-gray-scale-100">
            {/* Left Section */}
            <div className="flex gap-3 md:gap-6 items-center flex-1">
               <Link href="/">
                  <Image
                     src="/GraduationCap.png"
                     alt="Eduraa Logo"
                     width={40}
                     height={40}
                  />
               </Link>

               {/* Desktop Search */}
               <div className="hidden lg:flex gap-3 items-center">
                  <input
                     type="text"
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     onKeyDown={handleKeyDown}
                     placeholder="What do you want to learn"
                     className="w-64 xl:w-96 h-12 border-2 border-gray-scale-100 px-2 text-sm focus:outline-none focus:border-orange-500"
                  />
               </div>
            </div>

            {/* Right Section */}
            <div className="flex gap-3 items-center">
               {/* Icons - Hidden on mobile */}
               <div className="hidden md:flex gap-3 text-gray-scale-900 items-center">
                  {/* Notification Bell - Show dropdown for authenticated users */}
                  {/* Notification Bell - Show dropdown for authenticated users */}
                  {isAuthenticated && user && (
                     <NotificationDropdown
                        notifications={notifications}
                        unreadCount={unreadCount}
                        isLoading={notificationsLoading}
                        onMarkAsRead={markAsRead}
                        onMarkAllAsRead={markAllAsRead}
                        onNotificationClick={handleNotificationClick}
                     />
                  )}

                  {isAuthenticated && user?.role === 'student' && (
                     <Link
                        href="/student/wishlist"
                        className="relative hover:text-orange-500 transition-colors"
                     >
                        <IoMdHeartEmpty size={24} />
                        {wishlist.length > 0 && (
                           <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[10px] text-white">
                              {wishlist.length}
                           </span>
                        )}
                     </Link>
                  )}
               </div>

               {/* Auth Section */}
               {!isHydrated || loading ? (
                  // Skeleton for auth buttons while loading
                  <div className="flex gap-3 items-center">
                     <div className="hidden sm:block h-10 w-36 bg-gray-200 rounded animate-pulse" />
                     <div className="h-10 w-20 bg-gray-200 rounded animate-pulse" />
                  </div>
               ) : isAuthenticated && user ? (
                  <ProfileDropdown />
               ) : (
                  <>
                     <Link href="/auth/signup" className="hidden sm:block">
                        <Button text="Create an Account" type="secondary" />
                     </Link>
                     <Link href="/auth/login">
                        <Button text="Sign In" type="primary" />
                     </Link>
                  </>
               )}

               {/* Mobile Menu Button */}
               <button
                  className="md:hidden text-gray-scale-900"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
               >
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
               </button>
            </div>
         </nav>

         {/* Mobile Menu */}
         {isMobileMenuOpen && (
            <div className="md:hidden bg-white border-b-2 border-gray-scale-100 px-4 py-4">
               <div className="flex flex-col gap-4">
                  {/* Mobile Search */}
                  <div className="flex flex-col gap-2">
                     <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="What do you want to learn"
                        className="w-full h-12 border-2 border-gray-scale-100 px-2 text-sm focus:outline-none focus:border-orange-500"
                     />
                  </div>

                  {/* Mobile Navigation Links */}
                  <div className="flex flex-col gap-2 border-t pt-4">
                     <Link
                        href="/"
                        className={`py-2 hover:text-orange-500 ${
                           pathname === '/'
                              ? 'text-orange-500'
                              : 'text-gray-scale-700'
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                     >
                        Home
                     </Link>
                     <Link
                        href="/courses"
                        className={`py-2 hover:text-orange-500 ${
                           pathname === '/courses'
                              ? 'text-orange-500'
                              : 'text-gray-scale-700'
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                     >
                        Courses
                     </Link>
                     <Link
                        href="/about"
                        className={`py-2 hover:text-orange-500 ${
                           pathname === '/about'
                              ? 'text-orange-500'
                              : 'text-gray-scale-700'
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                     >
                        About
                     </Link>
                     <Link
                        href="/contact"
                        className={`py-2 hover:text-orange-500 ${
                           pathname === '/contact'
                              ? 'text-orange-500'
                              : 'text-gray-scale-700'
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                     >
                        Contact
                     </Link>
                  </div>

                  {/* Mobile Auth Buttons */}
                  {loading ? (
                     <div className="flex flex-col gap-2 border-t pt-4 sm:hidden">
                        <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
                     </div>
                  ) : (
                     !isAuthenticated && (
                        <div className="flex flex-col gap-2 border-t pt-4 sm:hidden">
                           <Link
                              href="/auth/signup"
                              onClick={() => setIsMobileMenuOpen(false)}
                           >
                              <Button
                                 text="Create an Account"
                                 type="secondary"
                              />
                           </Link>
                        </div>
                     )
                  )}
               </div>
            </div>
         )}
      </>
   );
}

/**
 * Navbar wrapper with AblyProvider for real-time notifications
 */
export default function Navbar() {
   return (
      <AblyProvider>
         <NavbarInner />
      </AblyProvider>
   );
}
