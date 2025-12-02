'use client';
import React from 'react';
import { signUp } from '@/app/services/authService';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';

const SignupForm = () => {
   const router = useRouter();
   const [firstName, setFirstName] = React.useState('');
   const [lastName, setLastName] = React.useState('');
   const [username, setUsername] = React.useState('');
   const [email, setEmail] = React.useState('');
   const [password, setPassword] = React.useState('');
   const [confirmPassword, setConfirmPassword] = React.useState('');
   const [termsChecked, setTermsChecked] = React.useState(false);

   const [showPassword, setShowPassword] = React.useState(false);
   const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

   const [errors, setErrors] = React.useState<{
      firstName?: string;
      lastName?: string;
      username?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
      submit?: string;
   }>({});
   const [submitting, setSubmitting] = React.useState(false);

   const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
   };

   const toggleConfirmPasswordVisibility = () => {
      setShowConfirmPassword(!showConfirmPassword);
   };

   const validate = () => {
      const e: any = {};
      if (!firstName.trim()) e.firstName = 'First name is required.';
      if (!lastName.trim()) e.lastName = 'Last name is required.';
      if (!username.trim()) e.username = 'Username is required.';
      else if (username.length < 3)
         e.username = 'Username must be at least 3 characters.';
      if (!email.trim()) e.email = 'Email is required.';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
         e.email = 'Enter a valid email.';
      if (!password) e.password = 'Password is required.';
      else if (password.length < 6)
         e.password = 'Password must be at least 6 characters.';
      if (!confirmPassword) e.confirmPassword = 'Confirm your password.';
      else if (confirmPassword !== password)
         e.confirmPassword = 'Passwords do not match.';
      if (!termsChecked) e.submit = 'You must agree to the Terms & Conditions.';
      setErrors(e);
      return Object.keys(e).length === 0;
   };

   const handleSubmit = async (ev: React.FormEvent) => {
      ev.preventDefault();
      setErrors({});
      if (!validate()) return;

      setSubmitting(true);
      try {
         await signUp({
            firstName,
            lastName,
            username,
            email,
            password,
            confirmPassword,
         });
         router.push('/courses');
      } catch (error: any) {
         setErrors({ submit: error.message });
      } finally {
         setSubmitting(false);
      }
   };

   return (
      <div className="w-full max-w-md">
         <h1 className="text-2xl font-bold mb-5">Create your account</h1>

         <form onSubmit={handleSubmit} className="space-y-3">
            {/* Full Name */}
            <div>
               <label className="block text-xs font-medium text-gray-700 mb-1">
                  Full Name
               </label>
               <div className="flex gap-2">
                  <input
                     type="text"
                     placeholder="First name..."
                     value={firstName}
                     onChange={(e) => setFirstName(e.target.value)}
                     className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <input
                     type="text"
                     placeholder="Last name"
                     value={lastName}
                     onChange={(e) => setLastName(e.target.value)}
                     className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
               </div>
               {errors.firstName && (
                  <p className="text-xs text-red-500 mt-1">
                     {errors.firstName}
                  </p>
               )}
               {errors.lastName && (
                  <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>
               )}
            </div>

            {/* Username */}
            <div>
               <label className="block text-xs font-medium text-gray-700 mb-1">
                  Username
               </label>
               <input
                  type="text"
                  placeholder="Username..."
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
               />
               {errors.username && (
                  <p className="text-xs text-red-500 mt-1">{errors.username}</p>
               )}
            </div>

            {/* Email */}
            <div>
               <label className="block text-xs font-medium text-gray-700 mb-1">
                  Email
               </label>
               <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
               />
               {errors.email && (
                  <p className="text-xs text-red-500 mt-1">{errors.email}</p>
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
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <button
                     type="button"
                     onClick={togglePasswordVisibility}
                     className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 text-sm"
                  >
                     {showPassword ? <Eye /> : <EyeOff />}
                  </button>
               </div>
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
                     value={confirmPassword}
                     onChange={(e) => setConfirmPassword(e.target.value)}
                     className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <button
                     type="button"
                     onClick={toggleConfirmPasswordVisibility}
                     className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 text-sm"
                  >
                     {showConfirmPassword ? <Eye /> : <EyeOff />}
                  </button>
               </div>
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start gap-2 text-xs text-gray-600">
               <input
                  type="checkbox"
                  id="terms"
                  checked={termsChecked}
                  onChange={(e) => setTermsChecked(e.target.checked)}
                  className="mt-0.5 w-3 h-3 accent-orange-500"
               />
               <label htmlFor="terms" className="text-xs">
                  I agree with all of your{' '}
                  <a href="#" className="text-orange-500 hover:underline">
                     Terms & Conditions
                  </a>
               </label>
            </div>

            {/* Create Account Button */}
            <button
               type="submit"
               disabled={submitting}
               className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 text-sm rounded transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
               {submitting ? 'Creating...' : 'Create Account'}
               <span>→</span>
            </button>

            {errors.submit && (
               <p className="text-xs text-red-500">{errors.submit}</p>
            )}

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
