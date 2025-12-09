'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import useBearStore from '@/app/store/useStore'; // Corrected import path
import Loading from '@/app/loading';

interface RouteGuardProps {
   type: 'auth' | 'protected';
   role?: 'admin' | 'instructor' | 'student';
}

export default function RouteGuard({ type, role }: RouteGuardProps) {
   const router = useRouter();
   const pathname = usePathname();
   const { user, isAuthenticated, loading } = useBearStore();

   useEffect(() => {
      // If authentication status is still loading, do nothing yet.
      if (loading) {
         return;
      }

      // Handle authentication-related redirects
      if (!isAuthenticated && type === 'protected') {
         router.replace(`/auth/login?redirect=${pathname}`);
         return; // Early exit after redirect
      }

      // Handle role-based authorization for protected routes
      if (isAuthenticated && type === 'protected') {
         const userRole = user?.role;

         // If the route is for admins only
         if (pathname.startsWith('/dashboard/admin')) {
            if (userRole !== 'admin') {
               // Redirect non-admins away from admin pages
               router.replace('/');
            }
         }
         // If the route is for instructors only
         else if (pathname.startsWith('/dashboard/instructor')) {
            if (userRole !== 'instructor') {
               // Redirect non-instructors away from instructor pages
               router.replace('/');
            }
         }
         // If the route is for students only
         else if (pathname.startsWith('/student')) {
            if (userRole === 'instructor') {
               // Instructors shouldn't be in student area (unless they are also students, but requirement says restrict)
               router.replace('/dashboard/instructor');
            }
         }
      }
   }, [isAuthenticated, loading, user, pathname, router, type]);

   // Show a loading indicator while checking auth status
   if (loading) {
      return <Loading />;
   }

   return null;
}
