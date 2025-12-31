'use client';
import React from 'react';
import Button from '../../global/Button/Button';
import Image from 'next/image';
import Link from 'next/link';
import useBearStore from '@/app/store/useStore';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchPlatformStats } from '@/app/services/stats';

export default function Hero() {
   const { isAuthenticated } = useBearStore();

   // Fetch real platform statistics
   const { data: stats } = useQuery({
      queryKey: ['platform-stats'],
      queryFn: fetchPlatformStats,
      staleTime: 10 * 60 * 1000, // 10 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes
   });

   // Format numbers with K suffix
   const formatNumber = (num: number) => {
      if (num >= 1000) {
         return `${(num / 1000).toFixed(1)}K+`;
      }
      return `${num}+`;
   };

   return (
      <section className="relative bg-gradient-to-br from-slate-50 via-white to-orange-50 overflow-hidden">
         {/* Decorative Elements */}
         <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 bg-orange-100 rounded-full filter blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100 rounded-full filter blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2" />
         </div>

         <div className="relative container mx-auto px-4 pt-8 pb-20 md:pt-12 md:pb-28 lg:pt-16 lg:pb-32">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
               {/* Content Section */}
               <div className="space-y-8 z-10 animate-fadeIn">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-orange-200/50 shadow-sm">
                     <Sparkles className="w-4 h-4 text-orange-500" />
                     <span className="text-sm font-medium text-gray-700">
                        Learn from industry experts
                     </span>
                  </div>

                  {/* Heading */}
                  <div className="space-y-4">
                     <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                        Learn{' '}
                        <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                           Anything
                        </span>
                        <br />
                        Anytime, Anywhere
                     </h1>
                     <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-xl">
                        Master new skills with expert-led courses. Build your
                        future with flexible, world-class online education.
                     </p>
                  </div>

                  {/* CTA Buttons */}
                  {!isAuthenticated && (
                     <div className="flex flex-col sm:flex-row gap-4">
                        <Link href="/auth/signup">
                           <button className="group px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2">
                              Get Started Free
                              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                           </button>
                        </Link>
                        <Link href="/all-courses">
                           <button className="px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold border-2 border-gray-200 hover:border-orange-200 hover:text-orange-600 transition-all duration-300">
                              Browse Courses
                           </button>
                        </Link>
                     </div>
                  )}

                  {/* Stats - Now with real data */}
                  <div className="flex flex-wrap gap-8 pt-4">
                     <div>
                        <p className="text-3xl font-bold text-gray-900">
                           {stats ? formatNumber(stats.totalStudents) : '...'}
                        </p>
                        <p className="text-sm text-gray-600">Active Students</p>
                     </div>
                     <div>
                        <p className="text-3xl font-bold text-gray-900">
                           {stats ? `${stats.activeCourses}+` : '...'}
                        </p>
                        <p className="text-sm text-gray-600">Expert Courses</p>
                     </div>
                     <div>
                        <p className="text-3xl font-bold text-gray-900">
                           {stats ? `${stats.averageRating}★` : '...'}
                        </p>
                        <p className="text-sm text-gray-600">Average Rating</p>
                     </div>
                  </div>
               </div>

               {/* Image Section */}
               <div className="relative lg:block hidden">
                  <div className="relative">
                     {/* Main Image Container with modern frame */}
                     <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-gray-900/10 bg-white p-2">
                        <div className="relative rounded-2xl overflow-hidden">
                           <Image
                              sizes="(max-width: 1024px) 100vw, 50vw"
                              width={700}
                              height={500}
                              src="/hero.jpg"
                              alt="Students learning online"
                              priority
                              className="w-full h-auto"
                           />
                           {/* Gradient Overlay */}
                           <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/10 to-transparent" />
                        </div>
                     </div>

                     {/* Floating Card 1 - Top Right */}
                     <div className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-xl p-4 animate-float">
                        <div className="flex items-center gap-3">
                           <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                              <svg
                                 className="w-6 h-6 text-white"
                                 fill="none"
                                 stroke="currentColor"
                                 viewBox="0 0 24 24"
                              >
                                 <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                 />
                              </svg>
                           </div>
                           <div>
                              <p className="text-sm font-semibold text-gray-900">
                                 Course Completed!
                              </p>
                              <p className="text-xs text-gray-500">
                                 Well done!
                              </p>
                           </div>
                        </div>
                     </div>

                     {/* Floating Card 2 - Bottom Left */}
                     <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 animate-float-delayed">
                        <div className="flex items-center gap-3">
                           <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center">
                              <svg
                                 className="w-6 h-6 text-white"
                                 fill="none"
                                 stroke="currentColor"
                                 viewBox="0 0 24 24"
                              >
                                 <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                 />
                              </svg>
                           </div>
                           <div>
                              <p className="text-sm font-semibold text-gray-900">
                                 New Course
                              </p>
                              <p className="text-xs text-gray-500">
                                 React Mastery
                              </p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Custom Animations */}
         <style jsx>{`
            @keyframes fadeIn {
               from {
                  opacity: 0;
                  transform: translateY(20px);
               }
               to {
                  opacity: 1;
                  transform: translateY(0);
               }
            }

            @keyframes float {
               0%,
               100% {
                  transform: translateY(0);
               }
               50% {
                  transform: translateY(-10px);
               }
            }

            .animate-fadeIn {
               animation: fadeIn 0.8s ease-out;
            }

            .animate-float {
               animation: float 3s ease-in-out infinite;
            }

            .animate-float-delayed {
               animation: float 3s ease-in-out infinite 1.5s;
            }
         `}</style>
      </section>
   );
}
