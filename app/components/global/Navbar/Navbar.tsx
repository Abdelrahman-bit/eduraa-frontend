'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { IoIosMoon } from 'react-icons/io';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { Menu, X } from 'lucide-react';
import Button from '../Button/Button';
import ProfileDropdown from '../ProfileDropdown/ProfileDropdown';
import useBearStore from '@/app/store/useStore';

import { IoMdHeartEmpty } from 'react-icons/io';

export default function Navbar() {
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
   const [isHydrated, setIsHydrated] = useState(false);
   const { user, isAuthenticated, loading, initializeAuth, wishlist } =
      useBearStore();

   // console.log('Navbar State:', { isAuthenticated, loading, user: !!user, isHydrated });

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

   return (
      <>
         {/* Secondary NavBar  */}
         <nav className="hidden md:flex justify-between bg-gray-scale-900 text-gray-scale-500 px-6 text-body-md font-medium">
            <ul className="flex gap-8 p-4">
               <li>
                  <Link href="/">Home</Link>
               </li>
               <li>
                  <Link href="/all-courses">Courses</Link>
               </li>
               <li>
                  <Link href="/about">About</Link>
               </li>
               <li>
                  <Link href="/contact">Contact</Link>
               </li>
            </ul>
            <ul className="flex gap-8 p-4">
               <li>
                  <Link href="/mode">Dark</Link>
               </li>
               <li>
                  <Link href="/language">English</Link>
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
                     alt="eTutor Logo"
                     width={40}
                     height={40}
                  />
               </Link>

               {/* Desktop Search */}
               <div className="hidden lg:flex gap-3 items-center">
                  <select
                     name=""
                     id=""
                     className="w-32 h-12 border-2 border-gray-scale-100 px-2 text-sm"
                  >
                     <option value="Courses">Browse</option>
                     <option value="Courses">Courses</option>
                     <option value="Teachers">Teachers</option>
                     <option value="Students">Students</option>
                  </select>
                  <input
                     type="text"
                     placeholder="What do you want to learn"
                     className="w-64 xl:w-96 h-12 border-2 border-gray-scale-100 px-2 text-sm"
                  />
               </div>
            </div>

            {/* Right Section */}
            <div className="flex gap-3 items-center">
               {/* Icons - Hidden on mobile */}
               <div className="hidden md:flex gap-3 text-gray-scale-900">
                  <button>
                     <IoIosMoon size={24} />
                  </button>
                  <button>
                     <IoMdNotificationsOutline size={24} />
                  </button>
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
                     <select
                        name=""
                        id=""
                        className="w-full h-12 border-2 border-gray-scale-100 px-2 text-sm"
                     >
                        <option value="Courses">Browse</option>
                        <option value="Courses">Courses</option>
                        <option value="Teachers">Teachers</option>
                        <option value="Students">Students</option>
                     </select>
                     <input
                        type="text"
                        placeholder="What do you want to learn"
                        className="w-full h-12 border-2 border-gray-scale-100 px-2 text-sm"
                     />
                  </div>

                  {/* Mobile Navigation Links */}
                  <div className="flex flex-col gap-2 border-t pt-4">
                     <Link
                        href="/"
                        className="py-2 text-gray-scale-700 hover:text-orange-500"
                        onClick={() => setIsMobileMenuOpen(false)}
                     >
                        Home
                     </Link>
                     <Link
                        href="/courses"
                        className="py-2 text-gray-scale-700 hover:text-orange-500"
                        onClick={() => setIsMobileMenuOpen(false)}
                     >
                        Courses
                     </Link>
                     <Link
                        href="/about"
                        className="py-2 text-gray-scale-700 hover:text-orange-500"
                        onClick={() => setIsMobileMenuOpen(false)}
                     >
                        About
                     </Link>
                     <Link
                        href="/contact"
                        className="py-2 text-gray-scale-700 hover:text-orange-500"
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
