'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { apiClient } from '@/lib/http';
import { accountSchema, AccountFormValues } from '../schemas';
import { InputGroup, SaveButton, SectionTitle } from './SharedUI';
import { PhotoUpload } from './PhotoUpload';

interface AccountFormProps {
   userData: {
      firstname: string;
      lastname: string;
      phone?: string;
      headline?: string;
      biography?: string;
      avatar?: string;
   } | null;
}

export default function AccountForm({ userData }: AccountFormProps) {
   // ... existing useForm ...
   // (Skipping useForm lines for brevity in replace, targeting specific lines or using multi-replace if distant)
   // Actually, since userData type change is at top and usage is at bottom, I should split or use multi-replace.
   // Let's use multi-replace to be safe and clean.

   const {
      register,
      handleSubmit,
      reset,
      formState: { errors, isSubmitting },
   } = useForm<AccountFormValues>({
      resolver: zodResolver(accountSchema),
      defaultValues: {
         firstName: '',
         lastName: '',
         phoneCode: '+880',
         phoneNumber: '',
         title: '',
         biography: '',
      },
   });

   // Populate form when userData is available
   useEffect(() => {
      if (userData) {
         reset({
            firstName: userData.firstname || '',
            lastName: userData.lastname || '',
            phoneCode: '+880', // Default or parse complex logic if needed
            phoneNumber: userData.phone || '',
            title: userData.headline || '',
            biography: userData.biography || '',
         });
      }
   }, [userData, reset]);

   const onSubmit = async (data: AccountFormValues) => {
      try {
         const payload = {
            firstname: data.firstName,
            lastname: data.lastName,
            phone: data.phoneNumber,
            headline: data.title,
            biography: data.biography,
         };

         await apiClient.patch('/user/profile', payload);
         alert('Account settings saved successfully!');
      } catch (error: any) {
         console.error(error);
         alert(error.response?.data?.message || 'Failed to update profile');
      }
   };

   return (
      <form
         onSubmit={handleSubmit(onSubmit)}
         className="bg-white p-8 rounded-sm shadow-sm"
      >
         <SectionTitle title="Account Settings" />

         <div className="flex flex-col-reverse lg:flex-row gap-8">
            {/* Form Fields */}
            <div className="flex-1 flex flex-col gap-5">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InputGroup
                     label="First name"
                     placeholder="First name"
                     register={register}
                     name="firstName"
                     error={errors.firstName}
                  />
                  <InputGroup
                     label="Last name"
                     placeholder="Last name"
                     register={register}
                     name="lastName"
                     error={errors.lastName}
                  />
               </div>

               {/* Username field removed */}

               {/* Phone Number Custom Layout */}
               <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-sm text-gray-900 font-medium">
                     Phone Number
                  </label>
                  <div className="flex">
                     <select
                        {...register('phoneCode')}
                        className="border border-r-0 border-gray-200 bg-gray-50 text-gray-500 text-sm px-2 rounded-l-sm focus:outline-none"
                     >
                        <option value="+880">+880</option>
                        <option value="+20">+20</option>
                        <option value="+966">+966</option>
                     </select>
                     <div className="w-full relative">
                        <input
                           type="text"
                           placeholder="Your Phone number..."
                           {...register('phoneNumber')}
                           className={`w-full border rounded-r-sm px-4 py-2.5 text-sm text-gray-700 focus:outline-none transition-all
                          ${errors.phoneNumber ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-orange-500'}`}
                        />
                     </div>
                  </div>
                  {errors.phoneNumber && (
                     <span className="text-xs text-red-500">
                        {errors.phoneNumber.message}
                     </span>
                  )}
               </div>

               <InputGroup
                  label="Title"
                  placeholder="Your title, profession or small biography"
                  register={register}
                  name="title"
                  error={errors.title}
               />

               <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-sm text-gray-900 font-medium">
                     Biography
                  </label>
                  <textarea
                     rows={4}
                     placeholder="Your bio..."
                     {...register('biography')}
                     className="w-full border border-gray-200 rounded-sm px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-orange-500 resize-none"
                  ></textarea>
               </div>

               <SaveButton isLoading={isSubmitting} />
            </div>

            <PhotoUpload currentAvatar={userData?.avatar} />
         </div>
      </form>
   );
}
