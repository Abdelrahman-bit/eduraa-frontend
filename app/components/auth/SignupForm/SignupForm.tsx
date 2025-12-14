'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signUp } from '@/app/services/authService';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Zod validation schema
const signupSchema = z
   .object({
      firstName: z.string().min(1, 'First name is required'),
      lastName: z.string().min(1, 'Last name is required'),
      email: z.string().email('Enter a valid email address'),
      password: z
         .string()
         .min(6, 'Password must be at least 6 characters')
         .regex(/[A-Z]/, 'Password must contain an uppercase letter')
         .regex(/[a-z]/, 'Password must contain a lowercase letter')
         .regex(/[0-9]/, 'Password must contain a number')
         .regex(
            /[!@#$%^&*(),.?":{}|<>]/,
            'Password must contain a special character'
         ),
      confirmPassword: z.string().min(1, 'Please confirm your password'),
      terms: z.boolean().refine((val) => val === true, {
         message: 'You must agree to the Terms & Conditions',
      }),
   })
   .refine((data) => data.password === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
   });

type SignupFormData = z.infer<typeof signupSchema>;

const SignupForm = () => {
   const router = useRouter();
   const [showPassword, setShowPassword] = React.useState(false);
   const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
   const [submitError, setSubmitError] = React.useState<string>('');

   const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
   } = useForm<SignupFormData>({
      resolver: zodResolver(signupSchema),
      mode: 'onBlur',
   });

   const onSubmit = async (data: SignupFormData) => {
      setSubmitError('');
      try {
         await signUp({
            firstname: data.firstName,
            lastname: data.lastName,
            email: data.email,
            password: data.password,
            confirmPassword: data.confirmPassword,
         });
         router.push('/student/courses');
      } catch (error: any) {
         setSubmitError(
            error?.response?.data?.message ||
               error?.message ||
               'Registration failed. Please try again.'
         );
      }
   };

   return (
      <div className="w-full max-w-md">
         <h1 className="text-2xl font-bold mb-5">Create your account</h1>

         <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            {/* Full Name */}
            <div>
               <label className="block text-xs font-medium text-gray-700 mb-1">
                  Full Name
               </label>
               <div className="flex gap-2">
                  <div className="flex-1">
                     <input
                        type="text"
                        placeholder="First name..."
                        {...register('firstName')}
                        className={`w-full px-3 py-1.5 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                           errors.firstName
                              ? 'border-red-500'
                              : 'border-gray-300'
                        }`}
                     />
                     {errors.firstName && (
                        <p className="text-xs text-red-500 mt-1">
                           {errors.firstName.message}
                        </p>
                     )}
                  </div>
                  <div className="flex-1">
                     <input
                        type="text"
                        placeholder="Last name"
                        {...register('lastName')}
                        className={`w-full px-3 py-1.5 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                           errors.lastName
                              ? 'border-red-500'
                              : 'border-gray-300'
                        }`}
                     />
                     {errors.lastName && (
                        <p className="text-xs text-red-500 mt-1">
                           {errors.lastName.message}
                        </p>
                     )}
                  </div>
               </div>
            </div>

            {/* Email */}
            <div>
               <label className="block text-xs font-medium text-gray-700 mb-1">
                  Email
               </label>
               <input
                  type="email"
                  placeholder="Email address"
                  {...register('email')}
                  className={`w-full px-3 py-1.5 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                     errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
               />
               {errors.email && (
                  <p className="text-xs text-red-500 mt-1">
                     {errors.email.message}
                  </p>
               )}
            </div>

            {/* Password */}
            <div>
               <label className="block text-xs font-medium text-gray-700 mb-1">
                  Password
               </label>
               <div className="relative">
                  <input
                     type={showPassword ? 'text' : 'password'}
                     placeholder="Create password"
                     {...register('password')}
                     className={`w-full px-3 py-1.5 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-orange-500 pr-10 ${
                        errors.password ? 'border-red-500' : 'border-gray-300'
                     }`}
                  />
                  <button
                     type="button"
                     onClick={() => setShowPassword(!showPassword)}
                     className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                     {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
               </div>
               {errors.password && (
                  <p className="text-xs text-red-500 mt-1">
                     {errors.password.message}
                  </p>
               )}
            </div>

            {/* Confirm Password */}
            <div>
               <label className="block text-xs font-medium text-gray-700 mb-1">
                  Confirm Password
               </label>
               <div className="relative">
                  <input
                     type={showConfirmPassword ? 'text' : 'password'}
                     placeholder="Confirm password"
                     {...register('confirmPassword')}
                     className={`w-full px-3 py-1.5 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-orange-500 pr-10 ${
                        errors.confirmPassword
                           ? 'border-red-500'
                           : 'border-gray-300'
                     }`}
                  />
                  <button
                     type="button"
                     onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                     }
                     className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                     {showConfirmPassword ? (
                        <Eye size={18} />
                     ) : (
                        <EyeOff size={18} />
                     )}
                  </button>
               </div>
               {errors.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">
                     {errors.confirmPassword.message}
                  </p>
               )}
            </div>

            {/* Terms & Conditions */}
            <div>
               <div className="flex items-start gap-2 text-xs text-gray-600">
                  <input
                     type="checkbox"
                     id="terms"
                     {...register('terms')}
                     className="mt-0.5 w-3 h-3 accent-orange-500"
                  />
                  <label htmlFor="terms" className="text-xs">
                     I agree with all of your{' '}
                     <a href="#" className="text-orange-500 hover:underline">
                        Terms & Conditions
                     </a>
                  </label>
               </div>
               {errors.terms && (
                  <p className="text-xs text-red-500 mt-1">
                     {errors.terms.message}
                  </p>
               )}
            </div>

            {/* Submit Error */}
            {submitError && (
               <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-xs">
                  {submitError}
               </div>
            )}

            {/* Create Account Button */}
            <button
               type="submit"
               disabled={isSubmitting}
               className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 text-sm rounded transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
               {isSubmitting ? 'Creating...' : 'Create Account'}
               <span>→</span>
            </button>

            {/* Social Sign Up */}
            <div className="relative my-3">
               <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
               </div>
               <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-white text-gray-500 text-xs">
                     SIGN UP WITH
                  </span>
               </div>
            </div>

            <div className="flex gap-2">
               <button
                  type="button"
                  className="flex-1 flex items-center justify-center gap-1 py-2 text-xs border border-gray-300 rounded hover:bg-gray-50 transition-colors"
               >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                     <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                     />
                     <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                     />
                     <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                     />
                     <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                     />
                  </svg>
                  <span className="hidden sm:inline text-xs font-medium">
                     Google
                  </span>
               </button>
               <button
                  type="button"
                  className="flex-1 flex items-center justify-center gap-1 py-2 text-xs border border-gray-300 rounded hover:bg-gray-50 transition-colors"
               >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#1877F2">
                     <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span className="hidden sm:inline text-xs font-medium">
                     Facebook
                  </span>
               </button>
            </div>
         </form>
      </div>
   );
};

export default SignupForm;
