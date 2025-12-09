'use client';

import React, { useState, useEffect } from 'react';
import { getUserProfile, UserProfile } from '@/app/services/userService';
import AccountForm from '@/app/dashboard/instructor/settings/components/AccountForm';
import PasswordForm from '@/app/dashboard/instructor/settings/components/PasswordForm';

export default function StudentSettings() {
   const [isLoadingData, setIsLoadingData] = useState(true);
   const [userData, setUserData] = useState<UserProfile | null>(null);

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

   if (isLoadingData) {
      return (
         <div className="flex h-screen items-center justify-center bg-[#F5F7FA]">
            <div className="text-center">
               <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
               <p className="text-gray-600">Loading settings...</p>
            </div>
         </div>
      );
   }

   return (
      <div className="p-6 md:p-8 bg-[#F5F7FA] font-sans">
         {/* Header */}
         <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
         </div>

         <div className="flex flex-col gap-8">
            {/* 1. Account Settings Section */}
            <AccountForm userData={userData} onAvatarUpdate={fetchProfile} />

            {/* 2. Change Password Section */}
            <div className="w-full">
               <PasswordForm />
            </div>
         </div>
      </div>
   );
}
