'use client';

import React, { useState, useEffect } from 'react';
import { apiClient } from '@/lib/http';
import AccountForm from './components/AccountForm';
import PasswordForm from './components/PasswordForm';
import NotificationSettings from './components/NotificationSettings';

export default function SettingsPage() {
   const [isLoadingData, setIsLoadingData] = useState(true);
   const [userData, setUserData] = useState(null);

   useEffect(() => {
      const fetchProfile = async () => {
         try {
            const { data } = await apiClient.get('/user/profile');
            setUserData(data.user);
         } catch (error) {
            console.error('Failed to fetch profile:', error);
         } finally {
            setIsLoadingData(false);
         }
      };

      fetchProfile();
   }, []);

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
      <div className="p-6 md:p-8 bg-[#F5F7FA] min-h-screen font-sans">
         {/* Header */}
         <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
         </div>

         <div className="flex flex-col gap-8">
            {/* 1. Account Settings Section */}
            <AccountForm userData={userData} />

            {/* 2. Bottom Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               {/* Notifications Section */}
               <NotificationSettings />

               {/* Change Password Section */}
               <PasswordForm />
            </div>
         </div>
      </div>
   );
}
