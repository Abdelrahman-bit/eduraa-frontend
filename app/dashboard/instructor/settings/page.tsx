'use client';

import React, { useState } from 'react';
import {
   useForm,
   UseFormRegister,
   FieldValues,
   FieldError,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Upload, Eye, EyeOff } from 'lucide-react';

// --- 1.  (Validation Schemas) ---

const accountSchema = z.object({
   firstName: z.string().min(1, 'First name is required'),
   lastName: z.string().min(1, 'Last name is required'),
   username: z.string().min(3, 'Username must be at least 3 characters'),
   phoneCode: z.string(),
   phoneNumber: z
      .string()
      .regex(/^\d+$/, 'Phone must be numbers only')
      .min(8, 'Phone is too short'),
   title: z.string().max(50, 'Title must be less than 50 chars').optional(),
   biography: z.string().optional(),
});

const passwordSchema = z
   .object({
      currentPassword: z.string().min(1, 'Current password is required'),
      newPassword: z
         .string()
         .min(8, 'Password must be at least 8 characters')
         .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
         .regex(/[0-9]/, 'Must contain at least one number'),
      confirmPassword: z.string().min(1, 'Please confirm your password'),
   })
   .refine((data) => data.newPassword === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
   });

type AccountFormValues = z.infer<typeof accountSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

interface InputGroupProps {
   label: string;
   placeholder: string;
   type?: string;
   register: UseFormRegister<FieldValues>;
   name: string;
   error?: FieldError;
}

const InputGroup = ({
   label,
   placeholder,
   type = 'text',
   register,
   name,
   error,
}: InputGroupProps) => (
   <div className="flex flex-col gap-1.5 w-full">
      <label className="text-sm text-gray-900 font-medium">{label}</label>
      <div className="relative">
         <input
            type={type}
            placeholder={placeholder}
            {...register(name)} // ربط الحقل بـ Hook Form
            className={`w-full border rounded-sm px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-1 transition-all pl-4 
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-orange-500 focus:ring-orange-500'}`}
         />
      </div>
      {/* رسالة الخطأ */}
      {error && (
         <span className="text-xs text-red-500 mt-1">{error.message}</span>
      )}
   </div>
);

interface PasswordInputProps {
   label: string;
   placeholder: string;
   register: UseFormRegister<FieldValues>;
   name: string;
   error?: FieldError;
}

const PasswordInput = ({
   label,
   placeholder,
   register,
   name,
   error,
}: PasswordInputProps) => {
   const [show, setShow] = useState(false);
   return (
      <div className="flex flex-col gap-1.5 w-full">
         <label className="text-sm text-gray-900 font-medium">{label}</label>
         <div className="relative">
            <input
               type={show ? 'text' : 'password'}
               placeholder={placeholder}
               {...register(name)}
               className={`w-full border rounded-sm px-4 py-2.5 text-sm text-gray-700 focus:outline-none transition-all pr-10
            ${error ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-orange-500'}`}
            />
            <button
               type="button"
               onClick={() => setShow(!show)}
               className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
               {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
         </div>
         {error && (
            <span className="text-xs text-red-500 mt-1">{error.message}</span>
         )}
      </div>
   );
};

const SectionTitle = ({ title }: { title: string }) => (
   <h2 className="text-xl font-bold text-gray-900 mb-6">{title}</h2>
);

const SaveButton = ({ isLoading }: { isLoading?: boolean }) => (
   <button
      type="submit"
      disabled={isLoading}
      className="bg-[#FF6636] hover:bg-orange-600 text-white px-6 py-2.5 rounded-sm font-semibold transition-colors text-sm w-fit mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
   >
      {isLoading ? 'Saving...' : 'Save Changes'}
   </button>
);

export default function SettingsPage() {
   const {
      register: registerAccount,
      handleSubmit: handleSubmitAccount,
      formState: { errors: accountErrors, isSubmitting: isAccountSubmitting },
   } = useForm<AccountFormValues>({
      resolver: zodResolver(accountSchema),
      defaultValues: {
         firstName: 'Kevin',
         lastName: 'Gilbert',
         username: 'kevin_gilbert',
         phoneCode: '+880',
         phoneNumber: '1234567890',
         title: '',
         biography: '',
      },
   });

   const {
      register: registerPassword,
      handleSubmit: handleSubmitPassword,
      formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
   } = useForm<PasswordFormValues>({
      resolver: zodResolver(passwordSchema),
   });

   // save handlers
   const onAccountSubmit = async (data: AccountFormValues) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Account Data Valid:', data);
      alert('Account settings saved successfully!');
   };

   // password change handler
   const onPasswordSubmit = async (data: PasswordFormValues) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Password Data Valid:', data);
      alert('Password updated successfully!');
   };

   return (
      <div className="p-6 md:p-8 bg-[#F5F7FA] min-h-screen font-sans">
         {/* Header */}
         <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
         </div>

         <div className="flex flex-col gap-8">
            {/* 1. Account Settings Section (FORM 1) */}
            <form
               onSubmit={handleSubmitAccount(onAccountSubmit)}
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
                           register={registerAccount}
                           name="firstName"
                           error={accountErrors.firstName}
                        />
                        <InputGroup
                           label="Last name"
                           placeholder="Last name"
                           register={registerAccount}
                           name="lastName"
                           error={accountErrors.lastName}
                        />
                     </div>

                     <InputGroup
                        label="Username"
                        placeholder="Enter your username"
                        register={registerAccount}
                        name="username"
                        error={accountErrors.username}
                     />

                     {/* Phone Number Custom Layout with Validation */}
                     <div className="flex flex-col gap-1.5 w-full">
                        <label className="text-sm text-gray-900 font-medium">
                           Phone Number
                        </label>
                        <div className="flex">
                           <select
                              {...registerAccount('phoneCode')}
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
                                 {...registerAccount('phoneNumber')}
                                 className={`w-full border rounded-r-sm px-4 py-2.5 text-sm text-gray-700 focus:outline-none transition-all
                                ${accountErrors.phoneNumber ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-orange-500'}`}
                              />
                           </div>
                        </div>
                        {accountErrors.phoneNumber && (
                           <span className="text-xs text-red-500">
                              {accountErrors.phoneNumber.message}
                           </span>
                        )}
                     </div>

                     <div className="flex flex-col gap-1.5 w-full">
                        <div className="flex justify-between">
                           <label className="text-sm text-gray-900 font-medium">
                              Title
                           </label>
                           <span className="text-xs text-gray-400">0/50</span>
                        </div>
                        <input
                           type="text"
                           placeholder="Your title, profession or small biography"
                           {...registerAccount('title')}
                           className="w-full border border-gray-200 rounded-sm px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-orange-500"
                        />
                        {accountErrors.title && (
                           <span className="text-xs text-red-500">
                              {accountErrors.title.message}
                           </span>
                        )}
                     </div>

                     <div className="flex flex-col gap-1.5 w-full">
                        <label className="text-sm text-gray-900 font-medium">
                           Biography
                        </label>
                        <textarea
                           rows={4}
                           placeholder="Your bio..."
                           {...registerAccount('biography')}
                           className="w-full border border-gray-200 rounded-sm px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-orange-500 resize-none"
                        ></textarea>
                     </div>

                     <SaveButton isLoading={isAccountSubmitting} />
                  </div>

                  {/* Photo Upload (No changes needed logic-wise for now) */}
                  <div className="w-full lg:w-[280px] shrink-0">
                     <div className="bg-gray-50 border border-dashed border-gray-300 rounded-sm p-6 flex flex-col items-center justify-center text-center h-[320px] relative overflow-hidden group">
                        <div className="w-32 h-32 bg-gray-200 mb-4 overflow-hidden relative">
                           <img
                              src="/api/placeholder/150/150"
                              alt="User"
                              className="w-full h-full object-cover"
                           />
                        </div>
                        <button
                           type="button"
                           className="flex items-center gap-2 bg-white border border-gray-200 hover:border-orange-500 hover:text-orange-500 text-gray-700 px-4 py-2 rounded-sm text-xs font-semibold transition-all shadow-sm z-10"
                        >
                           <Upload size={14} /> Upload Photo
                        </button>
                        <p className="text-[10px] text-gray-400 mt-3 max-w-[150px] leading-relaxed">
                           Image size should be under 1MB and image ratio needs
                           to be 1:1
                        </p>
                     </div>
                  </div>
               </div>
            </form>

            {/* 2. Bottom Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               {/* Notifications Section (Static for now, but can be wrapped in form) */}
               <div className="bg-white p-8 rounded-sm shadow-sm h-full flex flex-col">
                  <SectionTitle title="Notifications" />
                  <div className="flex flex-col gap-4 mb-6 flex-1">
                     {/* Checkboxes logic usually doesn't need complex validation, handled by state or simple form */}
                     <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                           type="checkbox"
                           className="w-4 h-4 accent-orange-500"
                        />
                        <span className="text-sm text-gray-600">
                           I want to know who buy my course.
                        </span>
                     </label>
                     <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                           type="checkbox"
                           defaultChecked
                           className="w-4 h-4 accent-orange-500"
                        />
                        <span className="text-sm text-gray-600">
                           I want to know who write a review on my course.
                        </span>
                     </label>
                     {/* ... other checkboxes */}
                  </div>
                  <button className="bg-[#FF6636] hover:bg-orange-600 text-white px-6 py-2.5 rounded-sm font-semibold transition-colors text-sm w-fit mt-2">
                     Save Changes
                  </button>
               </div>

               {/* Change Password Section (FORM 2) */}
               <form
                  onSubmit={handleSubmitPassword(onPasswordSubmit)}
                  className="bg-white p-8 rounded-sm shadow-sm h-full flex flex-col"
               >
                  <SectionTitle title="Change password" />
                  <div className="flex flex-col gap-5 mb-6 flex-1">
                     <PasswordInput
                        label="Current Password"
                        placeholder="Password"
                        register={registerPassword}
                        name="currentPassword"
                        error={passwordErrors.currentPassword}
                     />
                     <PasswordInput
                        label="New Password"
                        placeholder="Password"
                        register={registerPassword}
                        name="newPassword"
                        error={passwordErrors.newPassword}
                     />
                     <PasswordInput
                        label="Confirm Password"
                        placeholder="Confirm new password"
                        register={registerPassword}
                        name="confirmPassword"
                        error={passwordErrors.confirmPassword}
                     />
                  </div>
                  <SaveButton isLoading={isPasswordSubmitting} />
               </form>
            </div>
         </div>
      </div>
   );
}
