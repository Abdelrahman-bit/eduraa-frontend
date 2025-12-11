'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { accountSchema, AccountFormValues } from '../schemas';
import { updateUserProfile } from '@/app/services/userService';
import toast from 'react-hot-toast';
import { InputGroup, SaveButton, SectionTitle } from './SharedUI';
import { PhotoUpload } from './PhotoUpload';

interface AccountFormProps {
   userData: {
      firstname: string;
      lastname: string;
      phone?: string;
      title?: string;
      biography?: string;
      avatar?: string;
   } | null;
   onAvatarUpdate?: () => void;
}

export default function AccountForm({
   userData,
   onAvatarUpdate,
}: AccountFormProps) {
   const [currentAvatar, setCurrentAvatar] = useState(userData?.avatar);

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
            phoneNumber: userData.phone || '',
            title: userData.title || '',
            biography: userData.biography || '',
         });
         setCurrentAvatar(userData.avatar);
      }
   }, [userData, reset]);

   const onSubmit = async (data: AccountFormValues) => {
      try {
         await updateUserProfile({
            firstname: data.firstName,
            lastname: data.lastName,
            phone: data.phoneNumber,
            title: data.title,
            biography: data.biography,
         });
         toast.success('Account settings saved successfully!');
      } catch (error: any) {
         console.error(error);
         toast.error(error.message || 'Failed to update profile');
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

               {/* Phone Number Custom Layout */}
               <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-sm text-gray-900 font-medium">
                     Phone Number
                  </label>
                  <div className="flex">
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

            <PhotoUpload
               currentAvatar={currentAvatar}
               onUploadSuccess={(newUrl) => {
                  setCurrentAvatar(newUrl);
                  onAvatarUpdate?.();
               }}
            />
         </div>
      </form>
   );
}
