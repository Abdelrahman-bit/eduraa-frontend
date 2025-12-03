'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import useBearStore from '@/app/store/useStore';

interface RouteGuardProps {
   type: 'auth' | 'protected';
}

export default function RouteGuard({ type }: RouteGuardProps) {
   const router = useRouter();
   const pathname = usePathname();
   const { isAuthenticated } = useBearStore();

   useEffect(() => {
      if (type === 'auth') {
         // Auth pages (login/signup) - redirect if already logged in
         if (isAuthenticated) {
            router.replace('/');
         }
      } else if (type === 'protected') {
         // Protected pages (dashboard/profile) - redirect if not logged in
         if (!isAuthenticated) {
            router.replace(`/auth/login?redirect=${pathname}`);
         }
      }
   }, [isAuthenticated, pathname, router, type]);

   return null;
}
