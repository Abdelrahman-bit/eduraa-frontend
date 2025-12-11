'use client';
import React, { useState } from 'react';
import { UseFormRegister, FieldError, FieldValues } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';

interface InputGroupProps {
   label: string;
   placeholder: string;
   type?: string;
   register: UseFormRegister<any>; // Using any to be compatible with generic forms
   name: string;
   error?: FieldError;
   disabled?: boolean;
}

export const InputGroup = ({
   label,
   placeholder,
   type = 'text',
   register,
   name,
   error,
   disabled = false,
}: InputGroupProps) => (
   <div className="flex flex-col gap-1.5 w-full">
      <label className="text-sm text-gray-900 font-medium">{label}</label>
      <div className="relative">
         <input
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            {...register(name)}
            className={`w-full border rounded-sm px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-1 transition-all pl-4 
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-orange-500 focus:ring-orange-500'}
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
         />
      </div>
      {error && (
         <span className="text-xs text-red-500 mt-1">{error.message}</span>
      )}
   </div>
);

interface PasswordInputProps {
   label: string;
   placeholder: string;
   register: UseFormRegister<any>;
   name: string;
   error?: FieldError;
}

export const PasswordInput = ({
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

export const SectionTitle = ({ title }: { title: string }) => (
   <h2 className="text-xl font-bold text-gray-900 mb-6">{title}</h2>
);

export const SaveButton = ({ isLoading }: { isLoading?: boolean }) => (
   <button
      type="submit"
      disabled={isLoading}
      className="bg-[#FF6636] hover:bg-orange-600 text-white px-6 py-2.5 rounded-sm font-semibold transition-colors text-sm w-fit mt-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
   >
      {isLoading && (
         <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      )}
      {isLoading ? 'Saving...' : 'Save Changes'}
   </button>
);
