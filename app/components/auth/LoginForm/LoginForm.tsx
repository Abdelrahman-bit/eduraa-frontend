'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import useBearStore from '@/app/store/useStore';
import { login } from '@/app/services/authService';

export default function LoginForm() {
   const router = useRouter();
   const { initializeAuth } = useBearStore();
   const [showPassword, setShowPassword] = React.useState(false);
   const [email, setEmail] = React.useState('');
   const [password, setPassword] = React.useState('');
   const [remember, setRemember] = React.useState(false);
   const [errors, setErrors] = React.useState<{
      email?: string;
      password?: string;
      submit?: string;
   }>({});
   const [submitting, setSubmitting] = React.useState(false);

   const validate = () => {
      const e: { email?: string; password?: string } = {};
      if (!email) e.email = 'Email is required.';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
         e.email = 'Enter a valid email.';
      if (!password) e.password = 'Password is required.';
      else if (password.length < 6)
         e.password = 'Password must be at least 6 characters.';
      setErrors(e);
      return Object.keys(e).length === 0;
   };

   const handleSubmit = async (ev: React.FormEvent) => {
      ev.preventDefault();
      setErrors({});
      if (!validate()) return;
      setSubmitting(true);

      try {
         const response = await login({ email, password, remember });
         const { token } = response;
         // Check for user in response.user or response.data.user
         const user = response.user || response.data?.user;

         localStorage.setItem('token', token);
         if (user) {
            localStorage.setItem('user', JSON.stringify(user));
         }
         // Decode the token to get user information, including the role
         const decodedToken: { role: string } = jwtDecode(token);
         const userRole = decodedToken.role;

         // Initialize auth state in Zustand store before navigation
         await initializeAuth();

         // Redirect based on user role
         if (userRole === 'student') {
            router.push('/student/courses');
         } else if (userRole === 'instructor') {
            router.push('/dashboard/instructor');
         } else if (userRole === 'admin') {
            router.push('/dashboard/admin');
         }
      } catch (err: any) {
         // Improved error handling with fallback messages
         let errorMessage = 'Login failed. Please try again.';

         // Check for backend error message first
         if (err?.response?.data?.message) {
            const backendMessage = err.response.data.message;
            // Handle specific backend messages
            if (
               backendMessage.toLowerCase().includes('incorrect') ||
               backendMessage.toLowerCase().includes('invalid')
            ) {
               errorMessage = 'Invalid email or password';
            } else {
               errorMessage = backendMessage;
            }
         } else if (err?.response?.status === 401) {
            errorMessage = 'Invalid email or password';
         } else if (err?.response?.status === 404) {
            errorMessage = 'Account not found';
         } else if (err?.message) {
            errorMessage = err.message;
         }

         setErrors({ submit: errorMessage });
         setSubmitting(false);
      }
   };

   return (
      <div className="w-full max-w-sm">
         <h2 className="text-2xl font-semibold mb-4">
            Sign in to your account
         </h2>
         <form onSubmit={handleSubmit} className="space-y-3">
            <div>
               <label className="block text-xs font-medium text-gray-700 mb-1">
                  Email
               </label>
               <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Username or email address..."
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
               />
               {errors.email && (
                  <p className="text-xs text-red-500 mt-1">{errors.email}</p>
               )}
            </div>

            <div>
               <label className="block text-xs font-medium text-gray-700 mb-1">
                  Password
               </label>
               <div className="relative">
                  <input
                     type={showPassword ? 'text' : 'password'}
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     placeholder="Password"
                     className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <button
                     type="button"
                     className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 text-sm"
                     onClick={() => setShowPassword(!showPassword)}
                  >
                     {/* placeholder for visibility toggle if needed */}
                     {showPassword ? (
                        <svg
                           xmlns="http://www.w3.org/2000/svg"
                           width="24"
                           height="24"
                           viewBox="0 0 24 24"
                           fill="none"
                           stroke="currentColor"
                           strokeWidth="2"
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           className="lucide lucide-eye"
                        >
                           <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                           <circle cx="12" cy="12" r="3" />
                        </svg>
                     ) : (
                        <svg
                           xmlns="http://www.w3.org/2000/svg"
                           width="24"
                           height="24"
                           viewBox="0 0 24 24"
                           fill="none"
                           stroke="currentColor"
                           strokeWidth="2"
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           className="lucide lucide-eye-off"
                        >
                           <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                           <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                           <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                           <line x1="2" x2="22" y1="2" y2="22" />
                        </svg>
                     )}
                  </button>
               </div>
               {errors.password && (
                  <p className="text-xs text-red-500 mt-1">{errors.password}</p>
               )}
            </div>

            <div className="flex items-center justify-between">
               <label className="flex items-center gap-2 text-xs text-gray-600">
                  <input
                     type="checkbox"
                     checked={remember}
                     onChange={(e) => setRemember(e.target.checked)}
                     className="w-3 h-3"
                  />
                  Remember me
               </label>
               <a href="#" className="text-xs text-orange-500 hover:underline">
                  Forgot password?
               </a>
            </div>

            {errors.submit && (
               <p className="text-sm text-red-500">
                  {'Invalid email or password'}
               </p>
            )}

            <div className="flex items-center gap-3">
               <button
                  type="submit"
                  disabled={submitting}
                  className="ml-auto bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 text-sm rounded transition-colors disabled:opacity-60"
               >
                  {submitting ? 'Signing in...' : 'Sign In →'}
               </button>
            </div>

            <div className="relative my-3">
               <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
               </div>
               <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-white text-gray-500">
                     SIGN IN WITH
                  </span>
               </div>
            </div>

            <div className="flex gap-2">
               <button
                  type="button"
                  className="flex-1 flex items-center justify-center gap-1 py-2 text-xs border border-gray-300 rounded hover:bg-gray-50"
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
                  <span className="hidden sm:inline text-xs">Google</span>
               </button>
               <button
                  type="button"
                  className="flex-1 flex items-center justify-center gap-1 py-2 text-xs border border-gray-300 rounded hover:bg-gray-50"
               >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#1877F2">
                     <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span className="hidden sm:inline text-xs">Facebook</span>
               </button>
            </div>
         </form>
      </div>
   );
}
