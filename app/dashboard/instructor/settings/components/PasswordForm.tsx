'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { apiClient } from '@/lib/http';
import { passwordSchema, PasswordFormValues } from '../schemas';
import { PasswordInput, SaveButton, SectionTitle } from './SharedUI';

export default function PasswordForm() {
   const {
      register,
      handleSubmit,
      reset,
      formState: { errors, isSubmitting },
   } = useForm<PasswordFormValues>({
      resolver: zodResolver(passwordSchema),
   });

   const onSubmit = async (data: PasswordFormValues) => {
      try {
         await apiClient.patch('/user/profile/updatePassword', {
            currentPassword: data.currentPassword,
            newPassword: data.newPassword,
            confirmPassword: data.confirmPassword,
         });
         reset();
         alert('Password updated successfully!');
      } catch (error: any) {
         console.error(error);
         alert(error.response?.data?.message || 'Failed to update password');
      }
   };

   return (
      <form
         onSubmit={handleSubmit(onSubmit)}
         className="bg-white p-8 rounded-sm shadow-sm h-full flex flex-col"
      >
         <SectionTitle title="Change password" />
         <div className="flex flex-col gap-5 mb-6 flex-1">
            <PasswordInput
               label="Current Password"
               placeholder="Password"
               register={register}
               name="currentPassword"
               error={errors.currentPassword}
            />
            <PasswordInput
               label="New Password"
               placeholder="Password"
               register={register}
               name="newPassword"
               error={errors.newPassword}
            />
            <PasswordInput
               label="Confirm Password"
               placeholder="Confirm new password"
               register={register}
               name="confirmPassword"
               error={errors.confirmPassword}
            />
         </div>
         <SaveButton isLoading={isSubmitting} />
      </form>
   );
}
